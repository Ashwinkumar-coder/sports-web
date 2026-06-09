import fs from 'fs';
import * as d3 from 'd3-geo';

const geojson = JSON.parse(fs.readFileSync('public/maps/tn_simplified.geojson'));

// Rewind polygons if their area is > hemisphere (2PI)
geojson.features.forEach(f => {
  if (d3.geoArea(f) > 2 * Math.PI) {
    if (f.geometry.type === 'Polygon') {
      f.geometry.coordinates.forEach(ring => ring.reverse());
    } else if (f.geometry.type === 'MultiPolygon') {
      f.geometry.coordinates.forEach(polygon => polygon.forEach(ring => ring.reverse()));
    }
  }
});

// Create a projection fitting a 310x395 box
const projection = d3.geoMercator().fitSize([310, 395], geojson);
const pathGenerator = d3.geoPath().projection(projection);

const districts = [];

geojson.features.forEach(f => {
  const name = f.properties.dtname || f.properties.district || f.properties.NAME || 'Unknown';
  const pathData = pathGenerator(f);
  // Correctly compute the pixel coordinate of the centroid
  const b = pathGenerator.bounds(f);
  const centroid = [(b[0][0] + b[1][0])/2, (b[0][1] + b[1][1])/2];
  districts.push({ name, path: pathData, centroid });
});

fs.writeFileSync('src/components/districtsGeoPaths.json', JSON.stringify(districts, null, 2));
console.log('Done generating paths and centroids');
