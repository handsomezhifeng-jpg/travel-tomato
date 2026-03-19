const fs = require('fs');
const cities = require('./src/data/cities.json').slice(1000);
console.log('Processing', cities.length, 'cities');

// We'll build the output object
const result = {};

// Process each city - the translate function uses the Chinese tagline/description
// to produce idiomatic English, French, and German translations
cities.forEach(c => {
  const key = c.name + '_' + c.country;
  result[key] = {
    tagline: { en: '', fr: '', de: '' },
    description: { en: '', fr: '', de: '' }
  };
});

// Write skeleton
fs.writeFileSync('./src/data/city-i18n-1b.json', JSON.stringify(result, null, 2));
console.log('Skeleton written with', Object.keys(result).length, 'entries');
