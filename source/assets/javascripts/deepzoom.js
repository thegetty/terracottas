//= require lib/leaflet-easy-button
//= require deepzoomdata


// Leaflet fullscreen button class
// Properties
// ------------------------------------------------------------------------------------------
var FullScreenButton = L.Control.extend({
  options: { position: 'topleft' },
  onAdd: function (map) {
    var container, icon;
    container = L.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control leaflet-control-custom leaflet-fullscreen'
    );
    icon = L.DomUtil.create('i', 'ion-android-expand', container);
    container.style.backgroundColor = 'white';
    container.style.width           = '26px';
    container.style.height          = '26px';
    container.style.cursor          = 'pointer';
    container.onclick               = leftPanelToggle;
    icon.style.fontSize             = '20px';
    icon.style.lineHeight           = '1.35';
    icon.style.margin               = '6px';
    return container;
  }
});

// Deep Zoom Object
// Properties
// ------------------------------------------------------------------------------------------
function DeepZoom(catNum) {
  this.cat  = catNum;
  this.data = this.find();
  this.map  = this.init(this.data);
  this.rotateButton = '<img class="rotate-icon" src="../../assets/images/icons/noun_191739.svg">';

  if (this.data.rotation == 1) {
    L.easyButton( this.rotateButton, showModal).addTo(this.map);
  }
}

// Methods
// ------------------------------------------------------------------------------------------
DeepZoom.prototype = {
  find: function () {
    var cat = this.cat;
    return _.findWhere(DEEPZOOMDATA, {cat: cat});
  },

  init: function (options) {
    var map, mapBounds, mainLayer;
    var baseMaps    = {};
    var sortedViews = _.sortBy(options.views, 'name');
    var regex       = /[\d_][^\d.]/;

    map = L.map('map', {
      maxZoom: options.dimensions.max_zoom,
      minZoom: 1,
      crs: L.CRS.Simple,
      attributionControl: false
    }).setView([0, 0], options.dimensions.max_zoom);
    mapBounds = new L.LatLngBounds(
      map.unproject([0, options.dimensions.height], options.dimensions.max_zoom),
      map.unproject([options.dimensions.width, 0], options.dimensions.max_zoom)
    );
    map.fitBounds(mapBounds);

    sortedViews.forEach(function (view) {
      var layerName, layerPaty, layerWidth, layerHeight, layerBounds;
      layerName   = view.name.split(regex)[1];
      layerPath   = view.path;
      layerWidth  = view.pixel_width;
      layerHeight = view.pixel_height;
      layerBounds = new L.LatLngBounds(
        map.unproject([0, layerHeight], options.dimensions.max_zoom),
        map.unproject([layerWidth, 0], options.dimensions.max_zoom)
      );
      baseMaps[layerName + " view"] = L.tileLayer(
        'https://www.getty.edu/publications/resources/' + layerPath + '/{z}/{x}/{y}.png',
        { bounds: layerBounds }
      );
    });

    L.control.layers(baseMaps).addTo(map).setPosition("topright");
    mainLayer = sortedViews[0].name.split(regex)[1] + " view";
    map.addLayer(baseMaps[mainLayer]);
    map.addControl(new FullScreenButton());
    $(".leaflet-fullscreen").on("click", function () {
      setTimeout(map.invalidateSize.bind(map), 250);
    });
    return map;
  }
};
