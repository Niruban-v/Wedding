const elements = document.querySelectorAll('section, .event-card, .photo-grid img');

elements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

elements.forEach(el => observer.observe(el));
