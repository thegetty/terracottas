//= require geojson
//= require lib/leaflet-easy-button

// =============================================================================
// Map Functions

// oMap = Octavo Map – use o* namespace
// has CONFIG, methods, and styles properties

var oMap = {
  styles: {
    defaultMarker: {
      radius: 6,
      fillColor: "#E79340",
      color: "#000",
      weight: 0.5,
      opacity: 1,
      fillOpacity: 1
    },

    regionMarker: {
      radius: 6,
      fillColor: "#fff",
      color: "#fff",
      weight: 3,
      opacity: 0,
      fillOpacity: 0.75
    }
  }
};

// -----------------------------------------------------------------------------
// deepZoomSetup
//
// This function pulls data out of the DOM and uses it to set up new map instances.
// Map info lives in a non-visible .object-data div on each catalogue page.
// This function calls the other setup functions and returns a leaflet map object.

function deepZoomSetup() {
  var options = {
    // grab cat number from URL; workaround for now
    catNum:      Number(window.location.pathname.match(/\d+/)[0]),
    pixelWidth:  $(".object-data").data("dimensions-width"),
    pixelHeight: $(".object-data").data("dimensions-height"),
    views:       $(".object-data").data("views"),
    rotation:    $(".object-data").data("rotation")
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
  var map, mapboxTiles, hash;

  // Load tiles
  mapboxTiles = L.tileLayer(
    oMap.CONFIG.mapboxTileURL + oMap.CONFIG.mapboxAccessToken, {
      attribution: oMap.CONFIG.attribution
    });

  // Load default options
  map = L.map(oMap.CONFIG.mapID, {
          maxZoom: 12
        }).addLayer(mapboxTiles)
          .setView(oMap.CONFIG.coords, oMap.CONFIG.defaultZoom);

  // Disable scroll zoom on home page
  if ($("#map").hasClass("no-scroll")) {
    map.scrollWheelZoom.disable();
  }

  L.geoJson(geojsonFeature, oMap.methods.geojson).addTo(map);

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
  var mapMinZoom = 1;
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

  var sortedViews = _.sortBy(options.views, 'name');
  var regex = /[\d_][^\d.]/;

  sortedViews.forEach(function(view){
    var layerName   = view.name.split(regex)[1];
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

  var mainLayer = sortedViews[0].name.split(regex)[1] + " view";
  map.addLayer(baseMaps[mainLayer]);

  L.easyButton({
    id: "fullscreen-toggle",
    states: [
      {
        icon: '<i class="icon ion-android-expand"></i>',
        onClick: leftPanelToggle,
        title: "Toggle Full Screen"
      }
    ]
  }).addTo(map);

  if (options.rotation === 1) {
    L.easyButton(
      '<img class="rotate-icon" src="../../assets/images/icons/noun_191739.svg">',
      showModal
    ).addTo(map);
  }

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
