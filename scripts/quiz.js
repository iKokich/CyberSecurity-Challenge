document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const teamCards = document.querySelectorAll('.team-card');
    const quizSection = document.getElementById('quiz-section');
    const resultsSection = document.getElementById('results-section');
    const teamNameElement = document.getElementById('team-name');
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container'); 
    const gameContainer = document.getElementById('game-container');
    const gameTitleElement = document.getElementById('game-title');
    const gameContentElement = document.getElementById('game-content'); 
    const gameFeedbackElement = document.getElementById('game-feedback');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const scoreValueElement = document.getElementById('score-value');
    const totalQuestionsElement = document.getElementById('total-questions');
    const scoreMessageElement = document.getElementById('score-message');
    const restartBtn = document.getElementById('restart-btn');
    const hintBtn = document.getElementById('hint-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const hintModal = document.getElementById('hint-modal');
    const hintTextElementModal = document.getElementById('hint-text');
    const closeModalBtn = document.querySelector('.close-btn');
    
    // Переменные состояния
    let selectedTeam = '';
    let currentStep = 0;
    let score = 0;
    let userAnswers = []; 
    let currentSteps = []; 

    // Английский алфавит для шифра Цезаря
    const englishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Шаги для Red Team (вопросы и игры чередуются)
    const redTeamSteps = [
        {
            type: 'question',
            question: "Что символизирует красный цвет в кибербезопасности?",
            options: [
                "Предупреждение об опасности",
                "Высокий уровень безопасности",
                "Нейтральный статус",
                "Низкий приоритет"
            ],
            correct: 0,
            hint: "Красный цвет часто используется для обозначения опасности или необходимости внимания, как в светофоре."
        },
        {
            type: 'game',
            gameType: 'dragAndDrop',
            title: "Распределите действия по командам",
            description: "Перетащите элементы в соответствующие зоны",
            items: [
                { id: 1, text: "Проведение пентестов", correctCategory: "red" },
                { id: 2, text: "Социальная инженерия", correctCategory: "red" },
                { id: 3, text: "Мониторинг угроз", correctCategory: "blue" },
                { id: 4, text: "Анализ уязвимостей", correctCategory: "blue" }
            ],
            categories: [
                { id: "red", title: "Red Team" },
                { id: "blue", title: "Blue Team" }
            ],
            hint: "Red Team атакует (пентесты, социальная инженерия), Blue Team защищает (мониторинг, анализ)."
        },
        {
            type: 'question',
            question: "Какая из этих угроз чаще всего ассоциируется с Red Team?",
            options: [
                "Фишинг атаки",
                "Атаки на доступность (DDoS)",
                "Атаки на целостность данных",
                "Социальная инженерия"
            ],
            correct: 0,
            hint: "Фишинг - это один из методов, который Red Team использует для проверки бдительности сотрудников."
        },
        {
            type: 'game',
            gameType: 'matching',
            title: "Сопоставьте термины и определения",
            description: "Выберите пары, которые соответствуют друг другу",
            pairs: [
                { term: "Фишинг", definition: "Мошеннические попытки получить конфиденциальную информацию" },
                { term: "DDoS", definition: "Атака на отказ в обслуживании" },
                { term: "Эксплойт", definition: "Код, использующий уязвимость" },
                { term: "Ботнет", definition: "Сеть зараженных компьютеров" }
            ],
            hint: "DDoS связан с 'отказом в обслуживании'. Фишинг - с получением 'конфиденциальной информации'."
        },
        // НОВЫЙ ШАГ: DragToInput - Перебор паролей
        {
            type: 'game',
            gameType: 'dragToInput',
            title: "Инструмент для перебора паролей",
            question: "Чем пользуются хакеры для перебора пароля, для его получения?",
            imageUrl: "assets/img/password_cracking.png", // Вам нужно будет создать папку 'images' и поместить туда картинку.
            options: ["hydra", "nmap", "metasploit", "dirb"],
            correctOptionIndex: 0, // 'hydra'
            hint: "Название программы похоже на имя мифического существа."
        },
        // НОВЫЙ ШАГ: Шифр Цезаря (с английским алфавитом)
        {
            type: 'game',
            gameType: 'caesarCipher',
            title: "Расшифровка шифра Цезаря",
            task: "Расшифруйте слово с длиной ключа 13 (сдвиг назад на 13 позиций):",
            ciphertext: "UNPXRE", // Зашифрованное слово
            key: 13, // Ключ для расшифровки (сдвиг назад)
            correctAnswer: "HACKER", // Правильный ответ
            hint: "БЫЛ КОГДА ТО ТАКОЙ ЦАРЬ И ЕГО ЗВАЛИ ЦЕЗАРЬ. Шифр Цезаря использует сдвиг букв по алфавиту." 
        },
        {
            type: 'game',
            gameType: 'bashTerminal',
            title: "Задача: Настройка безопасности SSH",
            task: "Вам необходимо отредактировать конфигурационный файл SSH, чтобы отключить вход по паролю и разрешить только вход по ключам. Введите команду для редактирования файла конфигурации SSH:",
            correctCommand: "sudo nano /etc/sshd_config",
            filename: "/etc/sshd_config",
            fileContent: [
                "# This is the sshd server system-wide configuration file.",
                "# See sshd_config(5) for more information.",
                "",
                "Port 22",
                "AddressFamily any",
                "ListenAddress 0.0.0.0",
                "ListenAddress ::",
                "",
                "#HostKey /etc/ssh/ssh_host_rsa_key",
                "#HostKey /etc/ssh/ssh_host_dsa_key",
                "#HostKey /etc/ssh/ssh_host_ecdsa_key",
                "#HostKey /etc/ssh/ssh_host_ed25519_key",
                "",
                "# Ciphers and keying",
                "#KexAlgorithms curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group-exchange-sha256,diffie-hellman-group14-sha1",
                "",
                "PermitRootLogin prohibit-password",
                "#PubkeyAuthentication yes", 
                "",
                "# The default is to check both .ssh/authorized_keys and .ssh/authorized_keys2",
                "# but this is overridden so that files can be specified in the AuthorizedKeysFile",
                "# option, instead of just the default names.",
                "",
                "#AuthorizedKeysFile     .ssh/authorized_keys",
                "PasswordAuthentication yes", 
                "#ChallengeResponseAuthentication no",
                "",
                "# UsePAM yes",
                "X11Forwarding yes",
                "PrintMotd no",
                "",
                "# Allow client to pass locale environment variables",
                "AcceptEnv LANG LC_*",
                "",
                "Subsystem sftp /usr/lib/openssh/sftp-server",
                "",
                "# Set this to 'yes' to enable pam_deny.",
                "# UsePrivilegeSeparation yes"
            ],
            expectedModifications: [
                "PasswordAuthentication no",
                "PubkeyAuthentication yes"
            ],
            successMessage: "Отлично! Вы успешно имитировали настройку SSH для повышения безопасности.",
            hint: "Вам нужно открыть файл конфигурации SSH. Обычно это делается командой 'sudo nano /etc/sshd_config'."
        },
        {
            type: 'question',
            question: "Какой основной фокус Red Team в кибербезопасности?",
            options: [
                "Имитация атак для тестирования защиты",
                "Разработка защитных механизмов",
                "Мониторинг сетевой активности",
                "Анализ malware"
            ],
            correct: 0,
            hint: "Red Team действует как 'этичный хакер', имитируя атаки, чтобы найти слабые места."
        }
    ];
    
    // Шаги для Blue Team (вопросы и игры чередуются)
    const blueTeamSteps = [
        {
            type: 'question',
            question: "Что символизирует синий цвет в кибербезопасности?",
            options: [
                "Защиту и безопасность",
                "Критическую уязвимость",
                "Низкий уровень угрозы",
                "Необходимость немедленного действия"
            ],
            correct: 0,
            hint: "Синий цвет часто ассоциируется со спокойствием и надежностью, что соответствует роли защитников."
        },
        {
            type: 'game',
            gameType: 'dragAndDrop',
            title: "Распределите инструменты по категориям",
            description: "Перетащите элементы в соответствующие зоны",
            items: [
                { id: 1, text: "Wireshark", correctCategory: "analysis" },
                { id: 2, text: "Nmap", correctCategory: "scanning" },
                { id: 3, text: "Metasploit", correctCategory: "exploitation" },
                { id: 4, text: "Burp Suite", correctCategory: "testing" }
            ],
            categories: [
                { id: "analysis", title: "Анализ" },
                { id: "scanning", title: "Сканирование" },
                { id: "exploitation", title: "Эксплуатация" },
                { id: "testing", title: "Тестирование" }
            ],
            hint: "Wireshark 'анализирует' трафик, а Nmap 'сканирует' сеть."
        },
        {
            type: 'question',
            question: "Какая из этих задач является основной для Blue Team?",
            options: [
                "Защита инфраструктуры и реагирование на инциденты",
                "Разработка эксплойтов и уязвимостей",
                "Проведение атак на системы",
                "Создание инструментов для взлома"
            ],
            correct: 0,
            hint: "Blue Team находится в обороне, поэтому их главная задача - защита и реагирование."
        },
        {
            type: 'game',
            gameType: 'matching',
            title: "Сопоставьте протоколы и их назначение",
            description: "Выберите пары, которые соответствуют друг другу",
            pairs: [
                { term: "HTTPS", definition: "Защищенная передача веб-данных" },
                { term: "SSH", definition: "Безопасное удаленное управление" },
                { term: "DNS", definition: "Преобразование доменных имен в IP-адреса" },
                { term: "VPN", definition: "Защищенное соединение между сетями" }
            ],
            hint: "HTTPS - это безопасная версия HTTP. VPN создает 'защищенное соединение'."
        },
        {
            type: 'question',
            question: "Какой основной фокус Blue Team в кибербезопасности?",
            options: [
                "Оборонительные меры и защита",
                "Наступательные операции",
                "Разведка угроз",
                "Разработка уязвимостей"
            ],
            correct: 0,
            hint: "В отличие от атакующей Red Team, Blue Team сосредоточена на оборонительных мерах."
        },
        // Новый шаг для Blue Team: Анализ фишингового email
        {
            type: 'game',
            gameType: 'phishingAnalysis',
            title: "Анализ фишингового письма",
            email: {
                sender: "security-alert@microsoft-support.com",
                subject: "Срочное уведомление безопасности учетной записи",
                date: "2024-09-25",
                body: `
                Уважаемый пользователь,
                
                Мы обнаружили подозрительную активность на вашей учетной записи Microsoft. Для ее защиты, пожалуйста, немедленно подтвердите свою личность, перейдя по следующей ссылке:
                
                <a href="http://m1cr0s0ft-secure-login.xyz/verify">Нажмите здесь для подтверждения</a>
                
                Если вы не выполните данное действие в течение 24 часов, ваша учетная запись будет заблокирована.
                
                С уважением,<br>
                Служба поддержки Microsoft
                `
            },
            question: "Является ли это письмо фишинговым?",
            options: ["Да, это фишинг", "Нет, это не фишинг"],
            correctAnswerIndex: 0, // "Да, это фишинг"
            explanation: "Это письмо является фишинговым по нескольким причинам:<br>- **Подозрительный отправитель:** Адрес 'microsoft-support@microsoft-support.com' выглядит как попытка имитировать официальный, но имеет мелкие отличия (например, 'microsoft-support' вместо 'microsoft.com').<br>- **Срочность и угроза:** Письмо создает ощущение срочности ('немедленно', 'в течение 24 часов', 'учетная запись будет заблокирована'), чтобы заставить пользователя действовать необдуманно.<br>- **Подозрительная ссылка:** Ссылка 'm1cr0s0ft-secure-login.xyz' явно не относится к официальному домену Microsoft (.com).<br>- **Грамматические и стилистические ошибки:** Возможны мелкие ошибки, хотя в данном примере они не столь явны, но часто встречаются в фишинговых письмах.<br>- **Запрос конфиденциальной информации:** Косвенно, переход по ссылке может привести к краже учетных данных."
        },
        {
            type: 'question',
            question: "Какой основной фокус Blue Team в кибербезопасности?",
            options: [
                "Оборонительные меры и защита",
                "Наступательные операции",
                "Разведка угроз",
                "Разработка уязвимостей"
            ],
            correct: 0,
            hint: "В отличие от атакующей Red Team, Blue Team сосредоточена на оборонительных мерах."
        }
    ];
    
    // Обработчики выбора команды
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            selectedTeam = this.getAttribute('data-team');
            teamNameElement.textContent = selectedTeam === 'red' ? 'Red' : 'Blue';
            currentSteps = selectedTeam === 'red' ? redTeamSteps : blueTeamSteps;
            document.querySelector('.team-selection').style.display = 'none';
            quizSection.style.display = 'block';
            
            loadStep();
        });
    });
    
    // Загрузка шага (вопроса или игры)
    function loadStep() {
        const step = currentSteps[currentStep];
        
        // Управление видимостью кнопки "Подсказка"
        if (step.hint) {
            hintBtn.style.display = 'flex'; 
        } else {
            hintBtn.style.display = 'none'; 
        }
        
        // Скрываем все контейнеры перед загрузкой нового шага
        document.querySelector('.question-container').style.display = 'none';
        gameContainer.style.display = 'none';
        
        // Показываем соответствующий контейнер и загружаем контент
        if (step.type === 'question') {
            document.querySelector('.question-container').style.display = 'block';
            loadQuestion(step);
        } else if (step.type === 'game') {
            gameContainer.style.display = 'block';
            loadGame(step);
        }
        
        // Обновляем прогресс-бар и счетчик вопросов
        progressBar.style.width = `${((currentStep + 1) / currentSteps.length) * 100}%`;
        totalQuestionsElement.textContent = currentSteps.length; 
        questionCounter.textContent = `Шаг ${currentStep + 1} из ${currentSteps.length}`;
        
        // Обновляем состояние кнопок навигации
        prevBtn.disabled = currentStep === 0;
        
        // Для последнего шага меняем текст кнопки "Далее" (с использованием innerHTML для иконки)
        if (currentStep === currentSteps.length - 1) {
            nextBtn.innerHTML = 'Завершить квиз'; 
        } else {
            nextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>'; 
        }

        // Если ответ на текущий шаг уже был дан, активируем Next
        if (userAnswers[currentStep] !== undefined) {
             nextBtn.disabled = false;
        } else {
             nextBtn.disabled = true; // Блокируем Next до ответа/выполнения игры
        }
    }
    
    // Загрузка вопроса
    function loadQuestion(questionData) {
        questionTextElement.textContent = questionData.question;
        optionsContainer.innerHTML = '';
        
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.setAttribute('data-index', index);
            
            // Если на этот вопрос уже был дан ответ, подсвечиваем его
            if (userAnswers[currentStep] !== undefined) {
                if (index === questionData.correct) {
                    optionElement.classList.add('correct');
                } else if (index === userAnswers[currentStep] && index !== questionData.correct) {
                    optionElement.classList.add('incorrect');
                }
            }
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Кнопка "Далее" заблокирована, пока нет ответа
        nextBtn.disabled = userAnswers[currentStep] === undefined;
    }
    
    // Загрузка игры
    function loadGame(gameData) {
        gameTitleElement.textContent = gameData.title;
        gameContentElement.innerHTML = ''; // Очищаем game-content перед загрузкой новой игры

        // Сбрасываем состояние обратной связи при загрузке новой игры
        gameFeedbackElement.innerHTML = '';
        gameFeedbackElement.className = 'game-feedback';
        gameFeedbackElement.style.backgroundColor = '';
        gameFeedbackElement.style.color = '';
        
        if (gameData.gameType === 'dragAndDrop') {
            loadDragAndDropGame(gameData);
        } else if (gameData.gameType === 'matching') {
            loadMatchingGame(gameData);
        } else if (gameData.gameType === 'bashTerminal') {
            loadBashTerminalGame(gameData);
        } else if (gameData.gameType === 'dragToInput') {
            loadDragToInputGame(gameData);
        } else if (gameData.gameType === 'caesarCipher') { 
            loadCaesarCipherGame(gameData);
        } else if (gameData.gameType === 'phishingAnalysis') { // <-- НОВЫЙ ТИП ИГРЫ
            loadPhishingAnalysisGame(gameData);
        }
        
        // Кнопка "Далее" заблокирована, пока игра не завершена успешно/попытка не сделана
        nextBtn.disabled = userAnswers[currentStep] === undefined;
    }
    
    // Загрузка игры с перетаскиванием
    function loadDragAndDropGame(gameData) {
        const gameHTML = `
            <div class="drag-game">
                <p>${gameData.description}</p>
                <div class="drag-items">
                    ${gameData.items.map(item => `
                        <div class="drag-item" draggable="true" data-id="${item.id}">
                            ${item.text}
                        </div>
                    `).join('')}
                </div>
                <div class="drop-zones">
                    ${gameData.categories.map(category => `
                        <div class="drop-zone" data-category="${category.id}">
                            <h4>${category.title}</h4>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        gameContentElement.innerHTML = gameHTML;
        
        initDragAndDrop(gameData);
    }
    
    // Инициализация перетаскивания
    function initDragAndDrop(gameData) {
        const dragItems = gameContentElement.querySelectorAll('.drag-item'); 
        const dropZones = gameContentElement.querySelectorAll('.drop-zone'); 
        const draggedItems = {}; 
        
        dragItems.forEach(item => {
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.dataset.id);
                this.style.opacity = '0.5';
            });
            
            item.addEventListener('dragend', function() {
                this.style.opacity = '1';
            });
        });
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('active');
            });
            
            zone.addEventListener('dragleave', function() {
                this.classList.remove('active');
            });
            
            zone.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('active');
                
                const itemId = e.dataTransfer.getData('text/plain');
                const draggedItem = gameContentElement.querySelector(`.drag-item[data-id="${itemId}"]`); 
                
                if (draggedItem) {
                    this.appendChild(draggedItem);
                    draggedItems[itemId] = this.dataset.category; 
                    
                    if (Object.keys(draggedItems).length === gameData.items.length) {
                        checkDragAndDropAnswer(gameData, draggedItems);
                    }
                }
            });
        });
    }
    
    // Проверка ответа для игры с перетаскиванием
    function checkDragAndDropAnswer(gameData, draggedItems) {
        let allCorrect = true;
        
        gameData.items.forEach(item => {
            if (draggedItems[item.id] !== item.correctCategory) {
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            gameFeedbackElement.textContent = 'Правильно! Все элементы на своих местах.';
            gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
            gameFeedbackElement.style.color = '#2ed573';
            userAnswers[currentStep] = true;
            score++;
        } else {
            gameFeedbackElement.textContent = 'Есть ошибки. Попробуйте еще раз.';
            gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
            gameFeedbackElement.style.color = '#ff4757';
            userAnswers[currentStep] = false; 
        }
        
        nextBtn.disabled = false; 
    }
    
    // Загрузка игры на сопоставление
    function loadMatchingGame(gameData) {
        const shuffledPairs = [...gameData.pairs].sort(() => Math.random() - 0.5);
        const terms = shuffledPairs.map(pair => pair.term);
        const definitions = [...shuffledPairs.map(pair => pair.definition)].sort(() => Math.random() - 0.5); 
        
        const gameHTML = `
            <div class="match-game">
                <p>${gameData.description}</p>
                <div class="match-pairs">
                    <div class="terms">
                        ${terms.map(term => `
                            <div class="match-item" data-type="term" data-value="${term}">
                                ${term}
                            </div>
                        `).join('')}
                    </div>
                    <div class="definitions">
                        ${definitions.map(definition => `
                            <div class="match-item" data-type="definition" data-value="${definition}">
                                ${definition}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        gameContentElement.innerHTML = gameHTML;
        
        initMatchingGame(gameData);
    }
    
    // Инициализация игры на сопоставление
    function initMatchingGame(gameData) {
        const matchItems = gameContentElement.querySelectorAll('.match-item'); 
        let selectedTerm = null;
        let selectedDefinition = null;
        const matches = {}; 
        
        matchItems.forEach(item => {
            if (item.classList.contains('correct')) return;

            item.addEventListener('click', function() {
                if (this.dataset.type === 'term') {
                    gameContentElement.querySelectorAll('.match-item[data-type="term"]').forEach(i => { 
                        if (i !== this) i.classList.remove('selected');
                    });
                    
                    this.classList.toggle('selected');
                    selectedTerm = this.classList.contains('selected') ? this.dataset.value : null;
                } else {
                    gameContentElement.querySelectorAll('.match-item[data-type="definition"]').forEach(i => { 
                        if (i !== this) i.classList.remove('selected');
                    });
                    
                    this.classList.toggle('selected');
                    selectedDefinition = this.classList.contains('selected') ? this.dataset.value : null;
                }
                
                if (selectedTerm && selectedDefinition) {
                    const isCorrect = checkMatchingPair(gameData, selectedTerm, selectedDefinition);
                    const termElement = gameContentElement.querySelector(`.match-item[data-value="${selectedTerm}"]`); 
                    const defElement = gameContentElement.querySelector(`.match-item[data-value="${selectedDefinition}"]`); 

                    if (isCorrect) {
                        [termElement, defElement].forEach(el => {
                            el.classList.add('correct');
                            el.classList.remove('selected');
                            el.style.pointerEvents = 'none'; 
                        });
                        
                        matches[selectedTerm] = selectedDefinition;
                        
                        if (Object.keys(matches).length === gameData.pairs.length) {
                            gameFeedbackElement.textContent = 'Правильно! Все пары сопоставлены.';
                            gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                            gameFeedbackElement.style.color = '#2ed573';
                            if (userAnswers[currentStep] === undefined) { 
                                userAnswers[currentStep] = true;
                                score++;
                            }
                            nextBtn.disabled = false;
                        } else {
                             gameFeedbackElement.textContent = '';
                             gameFeedbackElement.style.backgroundColor = '';
                             gameFeedbackElement.style.color = '';
                        }
                    } else {
                        [termElement, defElement].forEach(el => el.classList.add('incorrect'));
                        setTimeout(() => { 
                            [termElement, defElement].forEach(el => el.classList.remove('selected', 'incorrect'));
                        }, 1000);
                        
                        gameFeedbackElement.textContent = 'Неверное сопоставление. Попробуйте еще раз.';
                        gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                        gameFeedbackElement.style.color = '#ff4757';
                        
                        if (userAnswers[currentStep] === undefined) {
                            userAnswers[currentStep] = false;
                        }
                        nextBtn.disabled = false; 
                    }
                    
                    selectedTerm = null;
                    selectedDefinition = null;
                }
            });
        });
    }
    
    // Проверка пары в игре на сопоставление
    function checkMatchingPair(gameData, term, definition) {
        const pair = gameData.pairs.find(p => p.term === term);
        return pair && pair.definition === definition;
    }
    
    // Выбор варианта ответа (для обычных вопросов)
    function selectOption(optionIndex) {
        if (userAnswers[currentStep] !== undefined) return; 
        
        const question = currentSteps[currentStep];
        const options = optionsContainer.querySelectorAll('.option'); 
        
        userAnswers[currentStep] = optionIndex; 
        
        if (optionIndex === question.correct) {
            options[optionIndex].classList.add('correct');
            score++;
        } else {
            options[optionIndex].classList.add('incorrect');
            options[question.correct].classList.add('correct'); 
        }
        
        nextBtn.disabled = false; 
    }

    // --- Загрузка игры Bash-терминал ---
    function loadBashTerminalGame(gameData) {
        const bashGameHTML = `
            <div class="bash-terminal-game">
                <p class="bash-task">${gameData.task}</p>
                <div class="terminal-window">
                    <div class="terminal-header">
                        <span class="dot red"></span>
                        <span class="dot yellow"></span>
                        <span class="dot green"></span>
                        <span class="title">bash</span>
                    </div>
                    <div class="terminal-body">
                        <pre class="terminal-output"></pre>
                        <div class="file-editor-display" style="display: none;">
                            <p class="editor-info">Редактирование файла: <span class="editor-filename"></span></p>
                            <pre class="file-content-editor" contenteditable="true"></pre> 
                            <p class="editor-guide">Измените <span class="highlight">PasswordAuthentication yes</span> на <span class="highlight">PasswordAuthentication no</span> и убедитесь, что <span class="highlight">PubkeyAuthentication yes</span> не закомментирована.</p>
                            <button class="save-bash-changes-btn quiz-btn">Применить изменения</button>
                        </div>
                        <div class="terminal-input-area">
                            <span class="prompt">user@ Younger&Cyber:~$</span>
                            <input type="text" class="terminal-input" autofocus>
                        </div>
                    </div>
                </div>
            </div>`;

        gameContentElement.innerHTML = bashGameHTML; 
        
        const currentBashTaskElement = gameContentElement.querySelector('.bash-task');
        const currentTerminalOutput = gameContentElement.querySelector('.terminal-output');
        const currentTerminalInput = gameContentElement.querySelector('.terminal-input');
        const currentFileEditorDisplay = gameContentElement.querySelector('.file-editor-display');
        const currentEditorFilename = gameContentElement.querySelector('.editor-filename'); 
        const currentFileContentEditor = gameContentElement.querySelector('.file-content-editor');
        const currentSaveBashChangesBtn = gameContentElement.querySelector('.save-bash-changes-btn'); 

        currentBashTaskElement.textContent = gameData.task; 
        currentTerminalOutput.textContent = ''; 
        currentTerminalInput.value = ''; 
        currentTerminalInput.focus(); 

        currentFileEditorDisplay.style.display = 'none'; 
        currentSaveBashChangesBtn.style.display = 'none'; 
        
        // Обработчик ввода команды
        currentTerminalInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const command = currentTerminalInput.value.trim();
                currentTerminalOutput.textContent += `user@ Younger&Cyber:~$ ${command}\n`; 

                if (command.toLowerCase() === gameData.correctCommand.toLowerCase()) {
                    currentTerminalOutput.textContent += `Открываю файл ${gameData.filename}...\n\n`;
                    displaySimulatedFile(gameData, currentEditorFilename, currentFileContentEditor);
                    currentTerminalInput.disabled = true; 
                    currentFileEditorDisplay.style.display = 'block'; 
                    currentSaveBashChangesBtn.style.display = 'block'; 
                    gameFeedbackElement.textContent = 'Вы открыли файл. Теперь имитируйте изменения и нажмите "Применить изменения".';
                    gameFeedbackElement.style.backgroundColor = 'rgba(108, 92, 231, 0.2)';
                    gameFeedbackElement.style.color = '#6c5ce7';
                    nextBtn.disabled = true; 
                } else {
                    currentTerminalOutput.textContent += `Ошибка: Команда '${command}' не найдена или неверна.\n`;
                    currentTerminalInput.value = ''; 
                    gameFeedbackElement.textContent = 'Неверная команда. Попробуйте еще раз.';
                    gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                    gameFeedbackElement.style.color = '#ff4757';
                }
                currentTerminalInput.value = ''; 
                currentTerminalOutput.scrollTop = currentTerminalOutput.scrollHeight; 
            }
        };

        // Обработчик кнопки "Применить изменения"
        currentSaveBashChangesBtn.onclick = () => {
            const modifiedContent = currentFileContentEditor.textContent;
            let isCorrectlyModified = true;
            let feedbackMessage = '';

            // 1. Проверка PasswordAuthentication
            if (!modifiedContent.includes("PasswordAuthentication no")) {
                isCorrectlyModified = false;
                feedbackMessage += "Ошибка: 'PasswordAuthentication no' не найдено.\n";
            }
            if (modifiedContent.includes("PasswordAuthentication yes")) {
                isCorrectlyModified = false;
                feedbackMessage += "Ошибка: 'PasswordAuthentication yes' все еще активно.\n";
            }

            // 2. Проверка PubkeyAuthentication
            if (!modifiedContent.includes("PubkeyAuthentication yes")) {
                isCorrectlyModified = false;
                feedbackMessage += "Ошибка: 'PubkeyAuthentication yes' не раскомментировано или изменено некорректно.\n";
            }
            if (modifiedContent.includes("#PubkeyAuthentication yes")) {
                isCorrectlyModified = false;
                feedbackMessage += "Ошибка: 'PubkeyAuthentication yes' все еще закомментировано.\n";
            }

            if (isCorrectlyModified) {
                if (userAnswers[currentStep] === undefined) { 
                    userAnswers[currentStep] = true;
                    score++;
                }
                gameFeedbackElement.textContent = gameData.successMessage;
                gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                gameFeedbackElement.style.color = '#2ed573';
                nextBtn.disabled = false; 
                currentTerminalInput.disabled = true; 
                currentFileContentEditor.setAttribute('contenteditable', 'false'); // Заблокировать редактирование после успеха
                currentSaveBashChangesBtn.style.display = 'none'; 
            } else {
                gameFeedbackElement.textContent = `Ваши изменения неверны. ${feedbackMessage.trim()} Попробуйте еще раз.`;
                gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                gameFeedbackElement.style.color = '#ff4757';
                
                if (userAnswers[currentStep] === undefined) {
                    userAnswers[currentStep] = false;
                }
                nextBtn.disabled = false; 
            }
        };
    }

    // Функция для отображения симулированного содержимого файла в редакторе
    function displaySimulatedFile(gameData, editorFilenameElement, fileContentEditorElement) {
        editorFilenameElement.textContent = gameData.filename;
        fileContentEditorElement.textContent = gameData.fileContent.join('\n'); 
        fileContentEditorElement.setAttribute('contenteditable', 'true'); 
        fileContentEditorElement.focus(); 
    }

    // --- Загрузка игры DragToInput ---
    function loadDragToInputGame(gameData) {
        const dragToInputHTML = `
            <div class="drag-to-input-game">
                <img src="${gameData.imageUrl}" alt="Изображение для вопроса" class="drag-to-input-image">
                <p class="drag-question-text">${gameData.question}</p>
                <div class="drag-options-list">
                    ${gameData.options.map((option, index) => `
                        <div class="drag-option-item" draggable="true" data-value="${option}" data-index="${index}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <div class="drop-target-input" id="drop-target-input">
                    Перетащите ответ сюда
                </div>
            </div>
        `;
        gameContentElement.innerHTML = dragToInputHTML;

        const dragOptionItems = gameContentElement.querySelectorAll('.drag-option-item');
        const dropTargetInput = gameContentElement.querySelector('#drop-target-input');
        let draggedItemValue = '';

        dragOptionItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItemValue = e.target.dataset.value;
                e.target.classList.add('dragging');
            });
            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        dropTargetInput.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            dropTargetInput.classList.add('drag-over');
        });

        dropTargetInput.addEventListener('dragleave', () => {
            dropTargetInput.classList.remove('drag-over');
        });

        dropTargetInput.addEventListener('drop', (e) => {
            e.preventDefault();
            dropTargetInput.classList.remove('drag-over');
            
            dropTargetInput.textContent = draggedItemValue; 

            if (draggedItemValue.toLowerCase() === gameData.options[gameData.correctOptionIndex].toLowerCase()) {
                dropTargetInput.classList.add('correct');
                gameFeedbackElement.textContent = 'Верно! Это правильный инструмент.';
                gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                gameFeedbackElement.style.color = '#2ed573';
                if (userAnswers[currentStep] === undefined) {
                    userAnswers[currentStep] = true;
                    score++;
                }
            } else {
                dropTargetInput.classList.add('incorrect');
                gameFeedbackElement.textContent = 'Неверно. Попробуйте еще раз.';
                gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                gameFeedbackElement.style.color = '#ff4757';
                if (userAnswers[currentStep] === undefined) {
                    userAnswers[currentStep] = false;
                }
            }
            nextBtn.disabled = false; 
            dragOptionItems.forEach(item => item.draggable = false);
            dropTargetInput.style.pointerEvents = 'none'; 
        });
    }

    // --- Загрузка игры Шифр Цезаря ---
    function loadCaesarCipherGame(gameData) {
        const alphabetHtml = englishAlphabet.split('').map((letter, index) => `
            <div class="alphabet-letter-cell">
                <span class="letter">${letter}</span>
                <span class="number">${index + 1}</span>
            </div>
        `).join('');

        const cipherBlocksHtml = gameData.ciphertext.split('').map((letter, index) => `
            <div class="cipher-letter-block" contenteditable="true" data-index="${index}">${letter}</div>
        `).join('');

        const caesarGameHTML = `
            <div class="caesar-cipher-game">
                <p class="bash-task">${gameData.task}</p>
                <div class="caesar-alphabet-table-container">
                    <div>
                        <p style="color: #6c5ce7; font-weight: bold; margin-bottom: 10px;">Английский алфавит:</p>
                        <div class="caesar-alphabet-table">
                            ${alphabetHtml}
                        </div>
                    </div>
                </div>
                
                <div class="cipher-input-section">
                    <p style="color: #d1d8e0; margin-bottom: 10px;">Ваш ответ:</p>
                    <div class="cipher-letter-block-container">
                        ${cipherBlocksHtml}
                    </div>
                    <div class="caesar-controls">
                        <button class="check-caesar-btn quiz-btn">Проверить</button>
                        <button class="skip-caesar-btn quiz-btn">Пропустить</button>
                    </div>
                </div>
            </div>
        `;
        gameContentElement.innerHTML = caesarGameHTML;

        const cipherLetterBlocks = gameContentElement.querySelectorAll('.cipher-letter-block');
        const checkCaesarBtn = gameContentElement.querySelector('.check-caesar-btn');
        const skipCaesarBtn = gameContentElement.querySelector('.skip-caesar-btn');

        // Функция для отключения всех элементов ввода и кнопок
        function disableCaesarGameElements() {
            cipherLetterBlocks.forEach(block => block.contentEditable = 'false');
            checkCaesarBtn.disabled = true;
            skipCaesarBtn.disabled = true;
        }

        cipherLetterBlocks.forEach(block => {
            block.addEventListener('input', (e) => {
                let value = e.target.textContent.toUpperCase();
                // Ограничиваем ввод одной английской буквой
                if (value.length > 1 || !englishAlphabet.includes(value)) {
                    value = value.charAt(0) || ''; 
                    if (!englishAlphabet.includes(value)) value = ''; 
                    e.target.textContent = value;
                }
                // Перемещаем фокус на следующий блок
                if (value.length === 1) {
                    const currentIndex = parseInt(e.target.dataset.index);
                    if (currentIndex < cipherLetterBlocks.length - 1) {
                        cipherLetterBlocks[currentIndex + 1].focus();
                    } else {
                        checkCaesarBtn.focus(); 
                    }
                }
                // Активируем кнопку "Проверить", если все блоки заполнены
                const allBlocksFilled = Array.from(cipherLetterBlocks).every(b => b.textContent.length === 1);
                checkCaesarBtn.disabled = !allBlocksFilled;
            });

            block.addEventListener('keydown', (e) => {
                // Разрешаем Backspace, Delete, стрелки
                if (e.key === 'Backspace' || e.key === 'Delete' || e.key.startsWith('Arrow')) {
                    return;
                }
                // Отменяем ввод, если это не английская буква
                if (!englishAlphabet.includes(e.key.toUpperCase()) && e.key.length === 1) {
                    e.preventDefault();
                }
            });
            // Изначально кнопка "Проверить" должна быть отключена
            checkCaesarBtn.disabled = true;
        });


        checkCaesarBtn.addEventListener('click', () => {
            let userAnswer = Array.from(cipherLetterBlocks).map(block => block.textContent).join('').toUpperCase(); 
            
            if (userAnswer === gameData.correctAnswer) {
                gameFeedbackElement.textContent = `Верно! Слово расшифровано: ${gameData.correctAnswer}.`;
                gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                gameFeedbackElement.style.color = '#2ed573';
                if (userAnswers[currentStep] === undefined) {
                    userAnswers[currentStep] = true;
                    score++;
                }
                nextBtn.disabled = false;
                disableCaesarGameElements(); // Отключаем элементы после правильного ответа
            } else {
                gameFeedbackElement.textContent = `Неверно. Попробуйте еще раз.`;
                gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                gameFeedbackElement.style.color = '#ff4757';
                if (userAnswers[currentStep] === undefined) {
                    userAnswers[currentStep] = false; // Помечаем как неверный ответ
                }
                nextBtn.disabled = false; // Активируем кнопку "Далее" после попытки
            }
        });

        // Обработчик кнопки "Пропустить"
        skipCaesarBtn.addEventListener('click', () => {
            if (userAnswers[currentStep] === undefined) {
                userAnswers[currentStep] = false; // Помечаем как пропущенное/неверное
            }
            gameFeedbackElement.textContent = `Задание пропущено. Правильный ответ был: ${gameData.correctAnswer}.`;
            gameFeedbackElement.style.backgroundColor = 'rgba(255, 178, 102, 0.2)'; // Оранжевый фон для пропущенного
            gameFeedbackElement.style.color = '#ff9933';
            
            // Заполняем поля правильным ответом
            cipherLetterBlocks.forEach((block, index) => {
                block.textContent = gameData.correctAnswer[index];
                block.classList.add('incorrect'); // Визуально помечаем, что пропущено/неверно
            });

            nextBtn.disabled = false; // Активируем кнопку "Далее"
            disableCaesarGameElements(); // Отключаем все элементы после пропуска
        });

        // Проверяем, если на этот шаг уже был дан ответ/пропущен
        if (userAnswers[currentStep] !== undefined) {
            // Если ответ был правильным, показываем его
            if (userAnswers[currentStep] === true) {
                cipherLetterBlocks.forEach((block, index) => {
                    block.textContent = gameData.correctAnswer[index];
                    block.classList.add('correct'); 
                });
                gameFeedbackElement.textContent = `Верно! Слово расшифровано: ${gameData.correctAnswer}.`;
                gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                gameFeedbackElement.style.color = '#2ed573';
            } else {
                // Если ответ был неверным или пропущен, показываем правильный ответ и сообщение о пропуске/ошибке
                cipherLetterBlocks.forEach((block, index) => {
                    block.textContent = gameData.correctAnswer[index]; 
                    block.classList.add('incorrect'); 
                });
                 gameFeedbackElement.textContent = `Задание было пропущено или неверно. Правильный ответ: ${gameData.correctAnswer}.`;
                 gameFeedbackElement.style.backgroundColor = 'rgba(255, 178, 102, 0.2)';
                 gameFeedbackElement.style.color = '#ff9933';
            }
            disableCaesarGameElements(); // Отключаем элементы
            nextBtn.disabled = false;
        }
    }

    // --- Загрузка игры "Анализ Фишингового Email" ---
    function loadPhishingAnalysisGame(gameData) {
        const phishingHTML = `
            <div class="phishing-email-game">
                <p class="phishing-question">${gameData.question}</p>
                <div class="email-preview">
                    <div class="email-header">
                        <div class="email-sender">
                            <span>От:</span>
                            <span>${gameData.email.sender}</span>
                        </div>
                        <div class="email-subject">
                            <span>Тема:</span>
                            <span>${gameData.email.subject}</span>
                        </div>
                        <div class="email-date">
                            <span>Дата:</span>
                            <span>${gameData.email.date}</span>
                        </div>
                    </div>
                    <div class="email-body-content">
                        ${gameData.email.body}
                    </div>
                </div>
                <div class="phishing-options">
                    ${gameData.options.map((option, index) => `
                        <button class="quiz-btn" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
                <div class="phishing-explanation" style="display: none;">
                    <!-- Объяснение будет вставлено сюда -->
                </div>
            </div>
        `;
        gameContentElement.innerHTML = phishingHTML;

        const phishingOptionsButtons = gameContentElement.querySelectorAll('.phishing-options button');
        const phishingExplanation = gameContentElement.querySelector('.phishing-explanation');

        phishingOptionsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedIndex = parseInt(button.getAttribute('data-index'));
                
                // Сначала убираем подсветку со всех, если уже была
                phishingOptionsButtons.forEach(btn => {
                    btn.classList.remove('selected', 'correct', 'incorrect');
                    btn.disabled = true; // Блокируем кнопки после выбора
                });

                // Применяем выбранный стиль
                if (selectedIndex === gameData.correctAnswerIndex) {
                    button.classList.add('correct');
                    if (userAnswers[currentStep] === undefined) {
                        userAnswers[currentStep] = true;
                        score++;
                    }
                    gameFeedbackElement.textContent = 'Правильно!';
                    gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                    gameFeedbackElement.style.color = '#2ed573';
                } else {
                    button.classList.add('incorrect');
                    if (userAnswers[currentStep] === undefined) {
                        userAnswers[currentStep] = false;
                    }
                    gameFeedbackElement.textContent = 'Неверно.';
                    gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                    gameFeedbackElement.style.color = '#ff4757';
                }

                // Показываем объяснение
                phishingExplanation.innerHTML = `<h4>${gameData.question}</h4>${gameData.explanation}`;
                phishingExplanation.style.display = 'block';

                nextBtn.disabled = false; // Активируем кнопку "Далее"
            });
        });
        // Блокируем кнопку "Далее", пока ответ не выбран
        nextBtn.disabled = true;
    }


    // Обработчики кнопок навигации
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            loadStep();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (nextBtn.disabled) return; 

        if (currentStep < currentSteps.length - 1) {
            currentStep++;
            loadStep();
        } else {
            showResults();
        }
    });
    
    // Показ результатов
    function showResults() {
        quizSection.style.display = 'none';
        resultsSection.style.display = 'flex';
        hintBtn.style.display = 'none'; 
        
        scoreValueElement.textContent = score;
        totalQuestionsElement.textContent = currentSteps.length;
        
        if (score === currentSteps.length) {
            scoreMessageElement.textContent = 'Идеальный результат! Вы настоящий эксперт!';
        } else if (score >= currentSteps.length * 0.7) {
            scoreMessageElement.textContent = 'Отличный результат! Хорошие знания!';
        } else if (score >= currentSteps.length * 0.5) {
            scoreMessageElement.textContent = 'Неплохой результат, но есть куда расти!';
        } else {
            scoreMessageElement.textContent = 'Попробуйте еще раз, чтобы улучшить результат!';
        }
    }
    
    // Перезапуск квиза
    restartBtn.addEventListener('click', () => {
        currentStep = 0;
        score = 0;
        userAnswers = [];
        
        resultsSection.style.display = 'none';
        document.querySelector('.team-selection').style.display = 'flex';
        hintBtn.style.display = 'none'; 
    });

    // Логика для модального окна подсказки
    function openHintModal() {
        const hintText = currentSteps[currentStep].hint;
        if (hintText) {
            hintTextElementModal.textContent = hintText;
            modalOverlay.style.display = 'block';
            hintModal.style.display = 'block';
        }
    }

    function closeHintModal() {
        modalOverlay.style.display = 'none';
        hintModal.style.display = 'none';
    }

    hintBtn.addEventListener('click', openHintModal);
    closeModalBtn.addEventListener('click', closeHintModal); // Исправлено
    modalOverlay.addEventListener('click', closeHintModal); // Исправлено
});