const blocks = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('show'));
}, { threshold: 0.2 });
blocks.forEach(b => observer.observe(b));
