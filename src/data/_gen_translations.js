// Script to generate city-i18n-2a.json
// This generates translations for 1000 cities into es, pt, ru

const fs = require('fs');
const cities = JSON.parse(fs.readFileSync('./src/data/_temp_cities_1000.json', 'utf8'));

const translations = {};

// We'll define a function that returns translations for each city
// based on its key, tagline, and description
function translate(city) {
  const k = city.key;
  const t = city.tagline;
  const d = city.description;

  // Return object with es, pt, ru translations
  return { key: k, tagline_zh: t, desc_zh: d };
}

// Generate all translations
const result = {};

// We need to manually provide translations for all 1000 cities
// This will be done by the main script output

// Output format
cities.forEach(c => {
  result[c.key] = {
    tagline: { es: "", pt: "", ru: "" },
    description: { es: "", pt: "", ru: "" }
  };
});

console.log("Template generated with", Object.keys(result).length, "cities");
fs.writeFileSync('./src/data/city-i18n-2a.json', JSON.stringify(result, null, 2));
