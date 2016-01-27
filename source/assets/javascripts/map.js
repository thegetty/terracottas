//= require geojson
//= require lib/leaflet
//= require lib/leaflet-easy-button
//= require lib/leaflet-hash
//= require lib/leaflet.markercluster
//= require lib/leaflet.label-src

// L.Icon.Default.imagePath = 'assets/stylesheets/vendor/leaflet/images';


// Map Object
// Properties
// ------------------------------------------------------------------------------------------
function GeoMap() {
  this.map         = {}; // stash a leaflet map object here once we initialize
  this.el          = 'map';
  this.defaultZoom = 6;
  this.maxZoom     = 12;
  this.ctr         = [40.51379915504413, 17.193603515625];
  this.tiles       = 'https://api.mapbox.com/v4/isawnyu.map-knmctlkh/{z}/{x}/{y}.png?access_token=';
  this.token       = "pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ";
  this.attr        = 'Tiles © <a href="http://mapbox.com/" target="_blank">MapBox</a> | Tiles and Data © 2013 <a href="http://www.awmc.unc.edu" target="_blank">AWMC</a> <a href="http://creativecommons.org/licenses/by-nc/3.0/deed.en_US" target="_blank">CC-BY-NC 3.0</a>';
  this.geojson     = geojsonFeature;

  this.init();
  this.addTiles();

  // Add clustered labels to map
  var catalogueLabels, siteLabels, countryLabels, regionLabels, siteGroup;

  catalogueLabels = L.geoJson(this.geojson, {
    filter: function (feature, layer) {
      return feature.properties.catalogue.length > 0;
    },
    pointToLayer: this.addCatalogueLabels,
    onEachFeature: this.addPopups,
  });
  siteLabels = L.geoJson(this.geojson, {
    filter: function (feature, layer) {
      if (feature.properties.catalogue.length < 1) {
        return feature.properties.feature_type == "site";
      }
    },
    pointToLayer: this.addLabels,
    onEachFeature: this.addPopups,
  });
  countryLabels = L.geoJson(this.geojson, {
    filter: function (feature, layer) {
      if (feature.properties.catalogue.length < 1) {
        return feature.properties.feature_type == "country";
      }
    },
    pointToLayer: this.addLabels,
    onEachFeature: this.addPopups,
  });
  regionLabels = L.geoJson(this.geojson, {
    filter: function (feature, layer) {
      if (feature.properties.catalogue.length < 1) {
        return feature.properties.feature_type == 'region' ||
          feature.properties.feature_type == 'sea';
      }
    },
    pointToLayer: this.addLabels,
    onEachFeature: this.addPopups
  });

  siteGroup = L.markerClusterGroup();
  siteGroup.addLayer(siteLabels);
  siteGroup.addLayer(regionLabels);
  this.map.addLayer(siteGroup);
  this.map.addLayer(countryLabels);
  this.map.addLayer(catalogueLabels);

}

// Methods
// ------------------------------------------------------------------------------------------
GeoMap.prototype = {
  init: function() {
    this.map = L.map(this.el, { maxzoom: this.maxZoom }).setView(this.ctr, this.defaultZoom);
    // Disable scroll on home page
    if ($("#" + this.el).hasClass("no-scroll")) { this.map.scrollWheelZoom.disable(); }
  },
  addCatalogueLabels: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.divIcon({
        html: "<p>" + feature.properties.custom_name + "</p>",
        className: "map-label-catalogue",
        iconSize: 50,
      })
    });
  },
  addLabels: function (feature, latlng) {
    switch (feature.properties.feature_type) {
      case "country":
      return L.marker(latlng, {
        icon: L.divIcon({
          html: "<p>" + feature.properties.custom_name + "</p>",
          className: "map-label-country",
          iconSize: 150,
        })
      });
      case "region":
      case "sea":
      return L.marker(latlng, {
        icon: L.divIcon({
          html: "<p>" + feature.properties.custom_name + "</p>",
          className: "map-label-region",
          iconSize: 80,
        })
      });
      default:
      return L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#333", // #f0c20c
        color: "#000",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.75
      }).bindLabel(feature.properties.custom_name, {noHide: true});
    }
  },
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
        var entryURL = "/catalogue/" + entry + "/";
        popupMsg += "<a href='"+ entryURL + "'><li>Cat. " + entry + "</li></a>";
      });
      popupMsg += "</ul>";
    }
    layer.bindPopup(popupMsg, popupOptions);
  },
  addTiles: function() {
    L.tileLayer(this.tiles + this.token, {attribution: this.attr}).addTo(this.map);
  },
};
