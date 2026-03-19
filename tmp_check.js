const c = JSON.parse(require('fs').readFileSync('D:/lvyoufanqie/src/data/cities.json','utf8')).slice(0,1000);
const keys = c.map(x => x.name + '_' + x.country);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
console.log('dupes:', dupes.length, dupes.slice(0, 10));
console.log('unique keys:', new Set(keys).size);
console.log('total:', c.length);
