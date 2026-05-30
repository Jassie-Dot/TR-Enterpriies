const fs = require('fs');
let styles = fs.readFileSync('src/styles.css', 'utf8');

const animationCss = `
/* Advanced Reveal Animations */
.reveal {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) !important;
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Hover Enhancements */
.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.service-card {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
}
.service-card img {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.service-card:hover img {
  transform: scale(1.05);
}
`;

styles += '\n' + animationCss;
fs.writeFileSync('src/styles.css', styles, 'utf8');
console.log('Animations added');
