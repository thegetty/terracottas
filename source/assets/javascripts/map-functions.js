//= require geojson
//= require lib/leaflet-easy-button

// =============================================================================
// Map Functions

// Leaflet.js is the library used for both Deep Zoom images (catalogue pages)
// as well as standard map components. Code for interacting with leaflet
// should live here.

CONFIG = {
  mapboxAccessToken: "pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ",
  mapboxTileURL: "https://api.mapbox.com/v4/egardner.n1p8bjh1/{z}/{x}/{y}.png?access_token=",
  imageTileURL: "http://gettypubs.github.io/maptiles/",
  mapID: "map",
  coords: [40.51379915504413, 17.193603515625],
  defaultZoom: 8,

};

// -----------------------------------------------------------------------------
// deepZoomSetup
//
// This function pulls data out of the DOM and uses it to set up new map instances.
// Map info lives in a non-visible .object-data div on each catalogue page.
// This function calls the other setup functions and returns a leaflet map object.

function deepZoomSetup() {
  var options = {
    catNum:      $(".object-data").data("catalogue"),
    pixelWidth:  $(".object-data").data("dimensions-width"),
    pixelHeight: $(".object-data").data("dimensions-height"),
    maxZoom:     $(".object-data").data("dimensions-max-zoom"),
    views:       $(".object-data").data("views").layers
  };

  var map = initDeepZoom(options);
  return map;
}

// =============================================================================
// initMap
//
// Creates a geographic map using Mapbox tiles.
// Returns a Leaflet map object.

function initMap() {
  var mapboxTiles = L.tileLayer(CONFIG.mapboxTileURL + CONFIG.mapboxAccessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
  });

  var map = L.map(CONFIG.mapID, { attributionControl: false })
    .addLayer(mapboxTiles)
    .setView(CONFIG.coords, CONFIG.defaultZoom);

  // geoJson placeholder is currently loaded from geojson.js
  L.geoJson(geojsonFeature).addTo(map);
  L.easyButton('<i class="icon ion-android-expand"></i>', leftPanelToggle).addTo(map);
  return map;
}

// -----------------------------------------------------------------------------
// initDeepZoom (options)
//
// Creates a non-geographic Leaflet map for deep-zoom images.
// Expects an options object containing properties for:
// maxZoom, catNum, pixelWidth, pixelHeight, and views (array)
// Returns a Leaflet map object.

function initDeepZoom(options) {
  var mapMinZoom = (options.maxZoom - 3);
  var mapMaxZoom = options.maxZoom;

  var map = L.map('map', {
    maxZoom: mapMaxZoom,
    minZoom: mapMinZoom,
    crs: L.CRS.Simple,
    attributionControl: false
  }).setView([0, 0], mapMaxZoom);

  var mapBounds = new L.LatLngBounds(
    map.unproject([0, options.pixelHeight], mapMaxZoom),
    map.unproject([options.pixelWidth, 0], mapMaxZoom)
  );
  map.fitBounds(mapBounds);

  // Add default layer to map
  L.tileLayer(CONFIG.imageTileURL +
    "terracottas/" + options.catNum +
    "/main/{z}/{x}/{y}.png", { noWrap: true }).addTo(map);

  // Set up alternate view layers
  var baseMaps = {};
  for (var i = 0; i < options.views.length; i++) {
    var layerName = options.views[i].name + " view";
    var layerPath = options.views[i].path;
    baseMaps[layerName] = createTileLayer(layerPath);
  }

  // Add map controls
  L.control.layers(baseMaps).addTo(map).setPosition("bottomleft");
  L.easyButton('<i class="icon ion-android-expand"></i>', leftPanelToggle).addTo(map);
  return map;
}

// -----------------------------------------------------------------------------
// createTileLayer (path)
//
// Returns a Leaflet tileLayer object pointing at the path provided, w/default options.

function createTileLayer(path) {
  return L.tileLayer(
    'http://gettypubs.github.io/maptiles/' + path + '/{z}/{x}/{y}.png', {
      noWrap: true,
      attributionControl: false
  });
}

// -----------------------------------------------------------------------------
// addMapResizeListener(map)
//
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
    map.invalidateSize();
  });
}
