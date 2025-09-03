document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const teamCards = document.querySelectorAll('.team-card');
    const quizSection = document.getElementById('quiz-section');
    const resultsSection = document.getElementById('results-section');
    const teamNameElement = document.getElementById('team-name');
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const scoreValueElement = document.getElementById('score-value');
    const totalQuestionsElement = document.getElementById('total-questions');
    const scoreMessageElement = document.getElementById('score-message');
    const restartBtn = document.getElementById('restart-btn');
    
    // Переменные состояния
    let selectedTeam = '';
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];
    
    // Вопросы для Red Team
    const redTeamQuestions = [
        {
            question: "Что символизирует красный цвет в кибербезопасности?",
            options: [
                "Предупреждение об опасности",
                "Высокий уровень безопасности",
                "Нейтральный статус",
                "Низкий приоритет"
            ],
            correct: 0
        },
        {
            question: "Какая из этих угроз чаще всего ассоциируется с Red Team?",
            options: [
                "Фишинг атаки",
                "Атаки на доступность (DDoS)",
                "Атаки на целостность данных",
                "Социальная инженерия"
            ],
            correct: 0
        },
        {
            question: "Какой основной фокус Red Team в кибербезопасности?",
            options: [
                "Имитация атак для тестирования защиты",
                "Разработка защитных механизмов",
                "Мониторинг сетевой активности",
                "Анализ malware"
            ],
            correct: 0
        },
        {
            question: "Что из перечисленного является типичной техникой Red Team?",
            options: [
                "Тестирование на проникновение",
                "Установка антивирусного ПО",
                "Настройка firewall",
                "Резервное копирование данных"
            ],
            correct: 0
        },
        {
            question: "Какая цель у Red Team в упражнениях по кибербезопасности?",
            options: [
                "Обнаружение уязвимостей защиты",
                "Обеспечение соответствия стандартам",
                "Обучение пользователей",
                "Мониторинг инцидентов"
            ],
            correct: 0
        }
    ];
    
    // Вопросы для Blue Team
    const blueTeamQuestions = [
        {
            question: "Что символизирует синий цвет в кибербезопасности?",
            options: [
                "Защиту и безопасность",
                "Критическую уязвимость",
                "Низкий уровень угрозы",
                "Необходимость немедленного действия"
            ],
            correct: 0
        },
        {
            question: "Какая из этих задач является основной для Blue Team?",
            options: [
                "Защита инфраструктуры и реагирование на инциденты",
                "Разработка эксплойтов и уязвимостей",
                "Проведение атак на системы",
                "Создание инструментов для взлома"
            ],
            correct: 0
        },
        {
            question: "Какой основной фокус Blue Team в кибербезопасности?",
            options: [
                "Оборонительные меры и защита",
                "Наступательные операции",
                "Разведка угроз",
                "Разработка уязвимостей"
            ],
            correct: 0
        },
        {
            question: "Что из перечисленного является типичной задачей Blue Team?",
            options: [
                "Мониторинг безопасности и обнаружение угроз",
                "Тестирование на проникновение",
                "Разработка эксплойтов",
                "Проведение фишинг-атак"
            ],
            correct: 0
        },
        {
            question: "Какая цель у Blue Team в упражнениях по кибербезопасности?",
            options: [
                "Защита систем от атак Red Team",
                "Взлом защитных механизмов",
                "Создание уязвимостей",
                "Обход систем безопасности"
            ],
            correct: 0
        }
    ];
    
    // Обработчики выбора команды
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            selectedTeam = this.getAttribute('data-team');
            teamNameElement.textContent = selectedTeam === 'red' ? 'Red' : 'Blue';
            document.querySelector('.team-selection').style.display = 'none';
            quizSection.style.display = 'block';
            loadQuestion();
        });
    });
    
    // Загрузка вопроса
    function loadQuestion() {
        const questions = selectedTeam === 'red' ? redTeamQuestions : blueTeamQuestions;
        const question = questions[currentQuestion];
        
        questionTextElement.textContent = question.question;
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.setAttribute('data-index', index);
            
            // Проверяем, был ли уже дан ответ на этот вопрос
            if (userAnswers[currentQuestion] !== undefined) {
                if (index === question.correct) {
                    optionElement.classList.add('correct');
                } else if (index === userAnswers[currentQuestion] && index !== question.correct) {
                    optionElement.classList.add('incorrect');
                }
            }
            
            optionElement.addEventListener('click', () => selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Обновляем прогресс
        progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
        questionCounter.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
        
        // Обновляем состояние кнопок
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.disabled = userAnswers[currentQuestion] === undefined;
        
        // Для последнего вопроса меняем текст кнопки
        if (currentQuestion === questions.length - 1) {
            nextBtn.textContent = 'Завершить квиз';
        } else {
            nextBtn.textContent = 'Далее >';
        }
    }
    
    // Выбор варианта ответа
    function selectOption(optionIndex) {
        // Если уже ответили на этот вопрос, не позволяем изменить ответ
        if (userAnswers[currentQuestion] !== undefined) return;
        
        const questions = selectedTeam === 'red' ? redTeamQuestions : blueTeamQuestions;
        const question = questions[currentQuestion];
        const options = document.querySelectorAll('.option');
        
        // Сохраняем ответ пользователя
        userAnswers[currentQuestion] = optionIndex;
        
        // Проверяем правильность ответа
        if (optionIndex === question.correct) {
            options[optionIndex].classList.add('correct');
            score++;
        } else {
            options[optionIndex].classList.add('incorrect');
            options[question.correct].classList.add('correct');
        }
        
        // Активируем кнопку "Далее"
        nextBtn.disabled = false;
    }
    
    // Обработчики кнопок навигации
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const questions = selectedTeam === 'red' ? redTeamQuestions : blueTeamQuestions;
        
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            // Завершаем квиз и показываем результаты
            showResults();
        }
    });
    
    // Показ результатов
    function showResults() {
        const questions = selectedTeam === 'red' ? redTeamQuestions : blueTeamQuestions;
        
        quizSection.style.display = 'none';
        resultsSection.style.display = 'flex';
        
        scoreValueElement.textContent = score;
        totalQuestionsElement.textContent = questions.length;
        
        // Определяем сообщение в зависимости от результата
        if (score === questions.length) {
            scoreMessageElement.textContent = 'Идеальный результат! Вы настоящий эксперт!';
        } else if (score >= questions.length * 0.7) {
            scoreMessageElement.textContent = 'Отличный результат! Хорошие знания!';
        } else if (score >= questions.length * 0.5) {
            scoreMessageElement.textContent = 'Неплохой результат, но есть куда расти!';
        } else {
            scoreMessageElement.textContent = 'Попробуйте еще раз, чтобы улучшить результат!';
        }
    }
    
    // Перезапуск квиза
    restartBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        
        resultsSection.style.display = 'none';
        document.querySelector('.team-selection').style.display = 'flex';
    });
});