const fs = require('fs');
const cities = JSON.parse(fs.readFileSync('D:/lvyoufanqie/src/data/cities.json', 'utf8')).slice(0, 1000);

// Build translation data
const data = {};

cities.forEach(c => {
  const key = c.name + '_' + c.country;
  data[key] = { tagline: {}, description: {} };
});

// Write template
fs.writeFileSync('D:/lvyoufanqie/city_keys.txt', cities.map(c => c.name + '_' + c.country + '|' + c.tagline + '|' + c.description).join('\n'));
console.log('Keys written:', cities.length);
