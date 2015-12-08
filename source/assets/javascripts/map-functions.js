//= require geojson
//= require lib/leaflet-easy-button

// =============================================================================
// Map Functions

// oMap = Octavo Map – use o* namespace
// has CONFIG, methods, and styles properties

var oMap = {
  CONFIG: {
    mapboxAccessToken: "pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ",
    mapboxTileURL: "https://api.mapbox.com/v4/isawnyu.map-knmctlkh/{z}/{x}/{y}.png?access_token=",
    imageTileURL: "http://gettypubs.github.io/maptiles/",
    mapID: "map",
    coords: [40.51379915504413, 17.193603515625],
    defaultZoom: 6,
    attribution: 'Tiles © <a href="http://mapbox.com/" target="_blank">MapBox</a> ' +
                 '| Tiles and Data © 2013 <a href="http://www.awmc.unc.edu" target="_blank">AWMC</a>' +
                 '<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US"' +
                 ' target="_blank">CC-BY-NC 3.0</a>'
  },

  // icon: L.divIcon({
  //   className: 'map-label',
  //   html: "Custom Label"
  // }),

  methods: {
    geojson: {
      // Generate a marker layer for each geoJSON feature
      pointToLayer: function (feature, latlng) {
        var props = feature.properties;

        if (props.catalogue.length > 0) {
          return L.marker(latlng, { icon: L.divIcon({
              html: "<p>" + props.custom_name + "</p>",
              className: "map-label-catalogue",
              iconSize: 65,
            })
          });
        } else if (props.feature_type == "region" || props.feature_type == "sea") {
          return L.marker(latlng, { icon: L.divIcon({
              html: "<p>" + props.custom_name + "</p>",
              className: "map-label-region",
              iconSize: 100,
            })
          });
        } else if (props.feature_type == "country") {
          return L.marker(latlng, { icon: L.divIcon({
              html: "<p>" + props.custom_name + "</p>",
              className: "map-label-country",
              iconSize: 150,
            })
          });
        } else if (props.feature_type == "site") {
          return L.circleMarker(latlng, oMap.styles.defaultMarker);
        }

      },
      // Add popup text to each geoJSON feature
      onEachFeature: function(feature, layer) {
        oMap.methods.popupContent(feature, layer);
      }
    },
    // Build the HTML string for each popup's content
    popupContent: function (feature, layer) {
      var props = feature.properties;

      var popupOptions  = { minWidth: 100, maxHeight: 250 };
      var pleiadesUrl   = "http://pleiades.stoa.org/places/" + props.pid;
      var tgnUrl        = "http://vocab.getty.edu/page/tgn/" + props.tgn;
      var popupMsg      = "<h4 class='feature-name'>" + props.custom_name + "</h4>";
      var linkedEntries = props.catalogue;

      if (props.tgn.length > 0) {
        popupMsg += "<a target='blank' href='" + tgnUrl + "'>Getty TGN ID: " +
                    props.tgn + "</a><br />";
      }

      if (props.pid.length > 0) {
        popupMsg += "<a target='blank' href='" + pleiadesUrl + "'>Pleiades ID: " +
                    props.pid + "</a><br />";
      }

      if (linkedEntries.length > 0) {
        popupMsg += "<strong>Catalogue Entries:</strong><ul>";
        linkedEntries.forEach(function (entry) {
          var entryURL = "http://gettypubs.github.io/Terracottas/catalogue/" + entry + "/";
          popupMsg += "<a href='"+ entryURL + "'><li>Cat. " + entry + "</li></a>";
        });
        popupMsg += "</ul>";
      }

      layer.bindPopup(popupMsg, popupOptions);
    }
  },

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
