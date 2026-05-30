const fs = require('fs');

// 1. Merge CSS
let srcStyles = fs.readFileSync('src/styles.css', 'utf8');
const layoutCss = fs.readFileSync('public/enerture-layout.css', 'utf8');

const modalStyles = `
/* Service Modal */
.service-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  opacity: 1;
  transition: opacity 0.2s ease-out;
}
.service-modal.hidden {
  opacity: 0;
  pointer-events: none;
}
.service-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.service-close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  color: #333;
}
.service-modal-body h2 { margin-bottom: 1rem; color: #111; font-size: 1.5rem; }
.service-modal-body h3 { margin-top: 1.5rem; margin-bottom: 0.5rem; color: #222; font-size: 1.1rem; }
.service-modal-body p { margin-bottom: 1rem; color: #444; line-height: 1.5; }
.service-modal-body ul { margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc; color: #444; }
.service-modal-body li { margin-bottom: 0.25rem; }
`;

if (!srcStyles.includes('.service-modal')) {
  srcStyles += '\n' + layoutCss + '\n' + modalStyles;
  fs.writeFileSync('src/styles.css', srcStyles, 'utf8');
}

// 2. Remove enerture-layout from index.html
let indexContent = fs.readFileSync('public/index.html', 'utf8');
indexContent = indexContent.replace(/<link rel="stylesheet" href="\/enerture-layout\.css\?v=ref-10" \/>\r?\n?/g, '');
fs.writeFileSync('public/index.html', indexContent, 'utf8');

console.log('CSS merged and index updated');
