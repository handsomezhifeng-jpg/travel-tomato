const fs = require('fs');
const cities = require('./cities.json').slice(1000);
const result = {};

// We'll build translations for each city
// Since we need natural idiomatic translations, we create them programmatically
// based on the Chinese tagline and description content

cities.forEach((city, idx) => {
  const key = `${city.name}_${city.country}`;
  const t = city.tagline;
  const d = city.description;
  result[key] = {
    tagline: { zh: t },
    description: { zh: d }
  };
});

// Output the keys and Chinese text for verification
console.log(`Total cities: ${Object.keys(result).length}`);
console.log('First 3 keys:', Object.keys(result).slice(0, 3));
console.log('Last 3 keys:', Object.keys(result).slice(-3));

// Write the skeleton
fs.writeFileSync('./_temp_skeleton.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Skeleton written');
