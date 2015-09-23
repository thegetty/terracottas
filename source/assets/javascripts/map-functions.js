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
  var mapMinZoom = 2;
  var mapMaxZoom = 5;
  var baseMaps   = {};

  console.log(options);

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

  options.views.forEach(function(view){
    var layerName   = view.name;
    var layerPath   = view.path;
    var layerWidth  = view.pixel_width;
    var layerHeight = view.pixel_height;
    var layerBounds = new L.LatLngBounds(
      map.unproject([0, layerHeight], mapMaxZoom),
      map.unproject([layerWidth, 0], mapMaxZoom)
    );

    baseMaps[layerName + " view"] = L.tileLayer(
      'http://gettypubs.github.io/maptiles/' + layerPath + '/{z}/{x}/{y}.png',
      { bounds: layerBounds });
  });

  // Add map controls
  L.control.layers(baseMaps).addTo(map).setPosition("topright");
  map.addLayer(baseMaps["Main view"]);
  L.easyButton('<i class="icon ion-android-expand"></i>', leftPanelToggle).addTo(map);

  return map;
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
