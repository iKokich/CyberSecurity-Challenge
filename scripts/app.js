document.addEventListener('DOMContentLoaded', function() {
    // --- Логика для комикс-слайдера (без изменений) ---
    const panels = document.querySelectorAll('.comic-panel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    let currentPanel = 0;
    
    function updateSlider() {
        panels.forEach(panel => panel.classList.remove('active'));
        panels[currentPanel].classList.add('active');
        
        if (prevBtn) prevBtn.disabled = currentPanel === 0;
        if (nextBtn) nextBtn.disabled = currentPanel === panels.length - 1;
        
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
    
    if (panels.length > 0) {
        updateSlider();
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (currentPanel < panels.length - 1) {
                    currentPanel++;
                    updateSlider();
                }
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentPanel > 0) {
                    currentPanel--;
                    updateSlider();
                }
            });
        }
        
        if (dots) {
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    currentPanel = parseInt(this.getAttribute('data-index'));
                    updateSlider();
                });
            });
        }
    }
    
    // Параллакс эффект для герой секции (без изменений)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.2) + 'px';
        }
    });

    // --- Логика случайных изображений удалена из JS, так как они теперь статичные и заданы в HTML/CSS ---
});