const fs = require('fs');
const d3 = require('d3-geo');

const geojson = JSON.parse(fs.readFileSync('public/maps/tn_simplified.geojson'));

// Create a projection fitting a 310x395 box
const projection = d3.geoMercator().fitSize([310, 395], geojson);
const pathGenerator = d3.geoPath().projection(projection);

const districts = [];

geojson.features.forEach(f => {
  const name = f.properties.dtname || f.properties.district || f.properties.NAME || 'Unknown';
  const pathData = pathGenerator(f);
  districts.push({ name, path: pathData });
});

fs.writeFileSync('generated_paths.json', JSON.stringify(districts, null, 2));
console.log('Done generating paths');
