const c = JSON.parse(require('fs').readFileSync('D:/lvyoufanqie/src/data/cities.json','utf8')).slice(0,1000);
const out = c.map(x => ({
  key: x.name + '_' + x.country,
  tagline: x.tagline,
  description: x.description
}));
require('fs').writeFileSync('D:/lvyoufanqie/tmp_all_cities.json', JSON.stringify(out, null, 2));
console.log('Written', out.length, 'cities');
