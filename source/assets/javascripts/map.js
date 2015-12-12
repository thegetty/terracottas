//= require geojson
//= require lib/leaflet
//= require lib/leaflet-easy-button
//= require lib/leaflet-hash

// L.Icon.Default.imagePath = 'assets/stylesheets/vendor/leaflet/images';
// Map Object
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
//
//
//
// Properties
// ------------------------------------------------------------------------------------------
function GeoMap() {
  this.map         = {}; // stash a leaflet map object here once we initialize
  this.el          = 'map';
  this.defaultZoom = 6;
  this.maxZoom     = 12;
  this.ctr         = [40.51379915504413, 17.193603515625],
  
  this.tiles = 'https://api.mapbox.com/v4/isawnyu.map-knmctlkh/{z}/{x}/{y}.png?access_token=';
  this.token = "pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ";
  this.attr  = 'Tiles © <a href="http://mapbox.com/" target="_blank">MapBox</a> ' +
    '| Tiles and Data © 2013 <a href="http://www.awmc.unc.edu" target="_blank">AWMC</a>' +
    '<a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US"' +
    ' target="_blank">CC-BY-NC 3.0</a>';
  
  this.geojson = geojsonFeature;
  this.styles  = {  
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
  };


  this.init();
  this.addTiles();
  this.addGeoJson();
}

// Methods
// ------------------------------------------------------------------------------------------
GeoMap.prototype = {

  // Utility function
  bind: function(method) {
    var fn = this[method],
        self = this;
    this[method] = function() {
      return fn.apply(self, arguments);
    };
    return this;
  },
  
  addTiles: function() {
    L.tileLayer(this.tiles + this.token, {attribution: this.attr}).addTo(this.map);
  },
  
  init: function() {
    this.map = L.map(this.el, { maxzoom: this.maxZoom }).setView(this.ctr, this.defaultZoom);
    // Disable scroll on home page
    if ($("#" + this.el).hasClass("no-scroll")) { this.map.scrollWheelZoom.disable(); }
  },

  // This function should be called wtih pointToLayer
  addLabels: function (feature, latlng) {
    var props = feature.properties;

    if (props.catalogue.length > 0) {
      return L.marker(latlng, 
      { 
        icon: L.divIcon({
          html: "<p>" + props.custom_name + "</p>",
          className: "map-label-catalogue",
          iconSize: 65,
        })
      });
    } else if (props.feature_type == "region" || props.feature_type == "sea") {
      return L.marker(latlng, 
      { icon: L.divIcon({
          html: "<p>" + props.custom_name + "</p>",
          className: "map-label-region",
          iconSize: 100,
        })
      });
    } else if (props.feature_type == "country") {
      return L.marker(latlng, 
      { icon: L.divIcon({
          html: "<p>" + props.custom_name + "</p>",
          className: "map-label-country",
          iconSize: 150,
        })
      });
    } else if (props.feature_type == "site") {
      return L.circleMarker(latlng, oMap.styles.defaultMarker);
    }

  },
  
  // This function should be called with onEachFeature
  addPopups: function (feature, layer) {
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
  },

  // alias for L.geoJson() method with pre-configured options
  // Call on initialization of new GeoMap object
  addGeoJson: function(){
    L.geoJson(this.geojson, { pointToLayer: this.addLabels, onEachFeature: this.addPopups }).addTo(this.map);
  }

};

