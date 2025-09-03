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
        
        if (step.hint) {
            hintBtn.style.display = 'flex';
        } else {
            hintBtn.style.display = 'none';
        }
        
        document.querySelector('.question-container').style.display = 'none';
        gameContainer.style.display = 'none';
        
        if (step.type === 'question') {
            document.querySelector('.question-container').style.display = 'block';
            loadQuestion(step);
        } else if (step.type === 'game') {
            gameContainer.style.display = 'block';
            loadGame(step);
        }
        
        progressBar.style.width = `${((currentStep + 1) / currentSteps.length) * 100}%`;
        questionCounter.textContent = `Шаг ${currentStep + 1} из ${currentSteps.length}`;
        
        prevBtn.disabled = currentStep === 0;
        
        if (currentStep === currentSteps.length - 1) {
            nextBtn.textContent = 'Завершить квиз';
        } else {
            nextBtn.textContent = 'Далее >';
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
        
        nextBtn.disabled = userAnswers[currentStep] === undefined;
    }
    
    // Загрузка игры
    function loadGame(gameData) {
        gameTitleElement.textContent = gameData.title;
        gameContentElement.innerHTML = '';
        gameFeedbackElement.innerHTML = '';
        gameFeedbackElement.className = 'game-feedback';
        
        if (gameData.gameType === 'dragAndDrop') {
            loadDragAndDropGame(gameData);
        } else if (gameData.gameType === 'matching') {
            loadMatchingGame(gameData);
        }
        
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
        const dragItems = document.querySelectorAll('.drag-item');
        const dropZones = document.querySelectorAll('.drop-zone');
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
                const draggedItem = document.querySelector(`.drag-item[data-id="${itemId}"]`);
                
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
        const matchItems = document.querySelectorAll('.match-item');
        let selectedTerm = null;
        let selectedDefinition = null;
        const matches = {};
        
        matchItems.forEach(item => {
            item.addEventListener('click', function() {
                if (this.dataset.type === 'term') {
                    document.querySelectorAll('.match-item[data-type="term"]').forEach(i => {
                        if (i !== this) i.classList.remove('selected');
                    });
                    
                    this.classList.toggle('selected');
                    selectedTerm = this.classList.contains('selected') ? this.dataset.value : null;
                } else {
                    document.querySelectorAll('.match-item[data-type="definition"]').forEach(i => {
                        if (i !== this) i.classList.remove('selected');
                    });
                    
                    this.classList.toggle('selected');
                    selectedDefinition = this.classList.contains('selected') ? this.dataset.value : null;
                }
                
                if (selectedTerm && selectedDefinition) {
                    const isCorrect = checkMatchingPair(gameData, selectedTerm, selectedDefinition);
                    
                    if (isCorrect) {
                        document.querySelectorAll('.match-item').forEach(i => {
                            if (i.dataset.value === selectedTerm || i.dataset.value === selectedDefinition) {
                                i.classList.add('correct');
                                i.classList.remove('selected');
                                i.style.pointerEvents = 'none';
                            }
                        });
                        
                        matches[selectedTerm] = selectedDefinition;
                        
                        if (Object.keys(matches).length === gameData.pairs.length) {
                            gameFeedbackElement.textContent = 'Правильно! Все пары сопоставлены.';
                            gameFeedbackElement.style.backgroundColor = 'rgba(46, 213, 115, 0.2)';
                            gameFeedbackElement.style.color = '#2ed573';
                            userAnswers[currentStep] = true;
                            score++;
                            nextBtn.disabled = false;
                        }
                    } else {
                        document.querySelectorAll('.match-item.selected').forEach(i => {
                            i.classList.add('incorrect');
                            setTimeout(() => {
                                i.classList.remove('selected', 'incorrect');
                            }, 1000);
                        });
                        
                        gameFeedbackElement.textContent = 'Неверное сопоставление. Попробуйте еще раз.';
                        gameFeedbackElement.style.backgroundColor = 'rgba(255, 71, 87, 0.2)';
                        gameFeedbackElement.style.color = '#ff4757';
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
    
    // Выбор варианта ответа
    function selectOption(optionIndex) {
        if (userAnswers[currentStep] !== undefined) return;
        
        const question = currentSteps[currentStep];
        const options = document.querySelectorAll('.option');
        
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
    
    // Обработчики кнопок навигации
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            loadStep();
        }
    });
    
    nextBtn.addEventListener('click', () => {
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
        hintBtn.style.display = 'none'; // Скрываем кнопку подсказки на экране результатов
        
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
    closeModalBtn.addEventListener('click', closeHintModal);
    modalOverlay.addEventListener('click', closeHintModal);
});