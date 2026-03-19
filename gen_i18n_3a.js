const fs = require('fs');
const cities = JSON.parse(fs.readFileSync('D:/lvyoufanqie/src/data/cities.json', 'utf8')).slice(0, 1000);

// Translation map: key -> { tagline: {ja,ko,ar,th,vi}, description: {ja,ko,ar,th,vi} }
const translations = {};

// Helper to add translations
function t(key, tj, tk, ta, tth, tv, dj, dk, da, dth, dv) {
  translations[key] = {
    tagline: { ja: tj, ko: tk, ar: ta, th: tth, vi: tv },
    description: { ja: dj, ko: dk, ar: da, th: dth, vi: dv }
  };
}

// The script just outputs the structure - we'll write translations inline
// For 1000 cities this needs to be done in code

const result = {};
cities.forEach(c => {
  const key = c.name + '_' + c.country;
  result[key] = {
    tagline: { ja: '', ko: '', ar: '', th: '', vi: '' },
    description: { ja: '', ko: '', ar: '', th: '', vi: '' }
  };
});

// We'll write the actual data file directly
console.log('Template generated for', Object.keys(result).length, 'cities');
fs.writeFileSync('D:/lvyoufanqie/src/data/city-i18n-3a.json', JSON.stringify(result, null, 2));
