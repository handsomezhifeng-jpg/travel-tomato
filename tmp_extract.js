const c = JSON.parse(require('fs').readFileSync('D:/lvyoufanqie/src/data/cities.json','utf8')).slice(0,1000);
const out = c.map(x => ({
  key: x.name + '_' + x.country,
  name: x.name,
  nameZh: x.nameZh,
  country: x.country,
  countryZh: x.countryZh,
  tagline: x.tagline,
  description: x.description
}));
// Print in chunks of 100 for readability
for (let i = 0; i < out.length; i += 100) {
  console.log(JSON.stringify(out.slice(i, i+100)));
}
