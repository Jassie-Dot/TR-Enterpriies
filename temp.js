const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Hero section
  content = content.replace(/Solar\. Industrial\. Manpower\./g, 'Solar. Industrial.');
  content = content.replace(/solar cleaning, industrial cleaning, manpower, inverter support/g, 'solar cleaning, industrial cleaning, inverter support');
  
  // Sections
  content = content.replace(/\"Manpower supply\",\n\s*/g, '');
  content = content.replace(/solar, industrial, and manpower support/g, 'solar and industrial support');
  content = content.replace(/Solar, industrial, manpower, power/g, 'Solar, industrial, power');
  content = content.replace(/solar cleaning, industrial cleaning, manpower supply, inverter support/g, 'solar cleaning, industrial cleaning, inverter support');
  
  // Testimonials and others
  content = content.replace(/Reliable manpower with clear supervision/g, 'Reliable crew with clear supervision');
  
  fs.writeFileSync(file, content, 'utf8');
}

processFile('data/site.js');
processFile('data/site-content.json');
processFile('public/index.html');
console.log('Replaced text references.');
