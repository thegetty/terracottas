//= require geojson
//= require leaflet-easy-button

// =============================================================================
// Map Functions

// Leaflet.js is the library used for both Deep Zoom images (catalogue pages)
// as well as standard map components. Code for interacting with leaflet
// should live here.


// =============================================================================
// Set up Leaflet.js for geographic map
function initLeafletMap() {
  accessToken = 'pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ';
  // Replace 'mapbox.streets' with your map id.
  var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/egardner.n1p8bjh1/{z}/{x}/{y}.png?access_token=' + accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
  });

  var map = L.map('map', { attributionControl: false })
    .addLayer(mapboxTiles)
    .setView([40.51379915504413, 17.193603515625], 8);

  L.geoJson(geojsonFeature).addTo(map);

  L.easyButton('<i class="icon ion-android-expand"></i>', leftPanelToggle)
    .addTo(map);

  return map
}


// Set up Leaflet.js for deep zoom images
function initLeafletDeepZoom(catalogueNumber, pixelWidth, pixelHeight, objectMaxZoom) {
  var mapMinZoom = (objectMaxZoom - 3);
  var mapMaxZoom = objectMaxZoom;
  var map = L.map('map', {
    maxZoom: mapMaxZoom,
    minZoom: mapMinZoom,
    crs: L.CRS.Simple,
    attributionControl: false
  }).setView([0, 0], mapMaxZoom);

  var mapBounds = new L.LatLngBounds(
      map.unproject([0, pixelHeight], mapMaxZoom),
      map.unproject([pixelWidth, 0], mapMaxZoom));

  map.fitBounds(mapBounds);

  // Temporarily hard-code these to Github
  // Pull them from CDN once this is up
  L.tileLayer('http://gettypubs.github.io/Terracottas/assets/tiles/'
    + catalogueNumber + '/{z}/{x}/{y}.png', { noWrap: true })
    .addTo(map);

  L.easyButton('<i class="icon ion-android-expand"></i>', leftPanelToggle)
    .addTo(map);

  // Use this procedure to place elements on a map
  // see here:
  // gis.stackexchange.com/questions/76059/how-to-project-pixel-coordinates-in-leaflet

  // var coords = map.unproject([2500, 2500], mapMaxZoom);
  // var marker = L.marker(coords).addTo(map);

  return map;
}

// DOM-specific setup code (where to find object info)
function deepZoomSetup(){
  var catalogueNumber = $(".object__data").data("catalogue");
  var pixelWidth      = $(".object__data").data("dimensions-width");
  var pixelHeight     = $(".object__data").data("dimensions-height");
  var objectMaxZoom   = $(".object__data").data("dimensions-max-zoom");
  var map             = initLeafletDeepZoom(
                          catalogueNumber, pixelWidth, pixelHeight, objectMaxZoom
                        );
  // Returns a map object for use by other functions
  return map;
}

// =============================================================================
// Fix Leaflet cropping bug after dynamically re-sizing the map area by
// calling invalidateSize() whenever map region changes. Requires an already-
// initialized map object passed in as argument.

function addMapResizeListener(map) {
  $("#rightPanelToggle").click(function (event) {
    setTimeout(map.invalidateSize.bind(map), 350);
    event.preventDefault();
  });

  $("#leftPanelToggle").click(function (event) {
    setTimeout(map.invalidateSize.bind(map), 350);
    event.preventDefault();
  });

  $(".easy-button-button").click(function (event) {
    setTimeout(map.invalidateSize.bind(map), 350);
  });

  // Detect orientation change on mobile devices
  window.addEventListener("orientationchange", function (map) {
    map.invalidateSize;
  })
}
