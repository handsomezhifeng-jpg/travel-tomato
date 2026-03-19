const d = require('./src/data/cities.json');
const subset = d.slice(1000);
const keys = subset.map(c => c.name + '_' + c.country);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
console.log('Total cities:', subset.length);
console.log('Duplicate keys:', JSON.stringify(dupes));
