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
  L.geoJson(this.geojson, { pointToLayer: this.addLabels }).addTo(this.map);
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
  // Add popup text to each geoJSON feature
  //onEachFeature: function(feature, layer) {
  //  oMap.methods.popupContent(feature, layer);
  //},
  
};

