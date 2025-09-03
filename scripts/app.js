document.addEventListener('DOMContentLoaded', function() {
    // Элементы слайдера
    const panels = document.querySelectorAll('.comic-panel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    let currentPanel = 0;
    
    // Функция обновления слайдера
    function updateSlider() {
        // Скрыть все панели
        panels.forEach(panel => panel.classList.remove('active'));
        
        // Показать текущую панель
        panels[currentPanel].classList.add('active');
        
        // Обновить состояние кнопок
        if (prevBtn) prevBtn.disabled = currentPanel === 0;
        if (nextBtn) nextBtn.disabled = currentPanel === panels.length - 1;
        
        // Обновить точки
        if (dots) {
            dots.forEach((dot, index) => {
                if (index === currentPanel) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }
    
    // Инициализация слайдера, если он есть на странице
    if (panels.length > 0) {
        updateSlider();
        
        // Следующая панель
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (currentPanel < panels.length - 1) {
                    currentPanel++;
                    updateSlider();
                }
            });
        }
        
        // Предыдущая панель
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentPanel > 0) {
                    currentPanel--;
                    updateSlider();
                }
            });
        }
        
        // Переход по точкам
        if (dots) {
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    currentPanel = parseInt(this.getAttribute('data-index'));
                    updateSlider();
                });
            });
        }
    }
    
    // Параллакс эффект для герой секции
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.2) + 'px';
        }
    });
});