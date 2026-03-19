const fs = require('fs');

// Read existing partial translations
const existing = JSON.parse(fs.readFileSync('D:/lvyoufanqie/src/data/city-i18n-3a.json', 'utf8'));

// Read all cities
const cities = JSON.parse(fs.readFileSync('D:/lvyoufanqie/src/data/cities.json', 'utf8')).slice(0, 1000);

// Check which ones still need translating
const done = new Set(Object.keys(existing));
const todo = cities.filter(c => !done.has(c.name + '_' + c.country));
console.log('Done:', done.size, 'Todo:', todo.length);
console.log('Next 20:', todo.slice(0, 20).map(c => c.name + '_' + c.country));
