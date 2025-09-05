document.addEventListener('DOMContentLoaded', function() {
    // --- Логика для комикс-слайдера ---
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
    
    // Параллакс эффект для герой секции
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = -(scrolled * 0.2) + 'px';
        }
    });

    // --- НОВАЯ ЛОГИКА: Модальное окно "Поделиться" ---
    const shareBtn = document.getElementById('share-btn');
    const shareModalOverlay = document.getElementById('share-modal-overlay');
    const shareModal = document.getElementById('share-modal');
    const shareModalCloseBtn = shareModal.querySelector('.close-btn');
    const shareLinkElement = document.getElementById('share-link');

    function openShareModal() {
        // Устанавливаем текущую ссылку страницы в качестве ссылки для копирования
        shareLinkElement.textContent = window.location.href;
        // Добавляем обработчик для копирования ссылки
        shareLinkElement.onclick = () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Ссылка скопирована в буфер обмена!');
            }).catch(err => {
                console.error('Не удалось скопировать ссылку: ', err);
            });
        };

        shareModalOverlay.style.display = 'block';
        shareModal.style.display = 'block';
    }

    function closeShareModal() {
        shareModalOverlay.style.display = 'none';
        shareModal.style.display = 'none';
        shareLinkElement.onclick = null; // Удаляем обработчик, чтобы избежать дублирования
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', openShareModal);
    }
    if (shareModalCloseBtn) {
        shareModalCloseBtn.addEventListener('click', closeShareModal);
    }
    if (shareModalOverlay) {
        shareModalOverlay.addEventListener('click', closeShareModal);
    }
});