//= require_tree .
//= require turbolinks

function initLeaflet(catalogueNumber, pixelWidth, pixelHeight, objectMaxZoom) {
  var mapMinZoom = 1;
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
  L.tileLayer('../assets/tiles/' + catalogueNumber + '/{z}/{x}/{y}.png', {
    noWrap: true
  }).addTo(map);

  return map;
}

function rightPanelToggle () {
  var left = $(".panel--left");
  var right = $(".panel--right");
  left.toggleClass("panel--collapse");
  right.toggleClass("panel--expand");
}

function leftPanelToggle() {
  var left = $(".panel--left");
  var right = $(".panel--right");
  left.toggleClass("panel--expand");
  right.toggleClass("panel--collapse");
}


$(document).ready(function() {

  // Initialize
  var catalogueNumber = $(".object__content").data("catalogue");
  var pixelWidth      = $(".object__content").data("dimensions-width");
  var pixelHeight     = $(".object__content").data("dimensions-height");
  var objectMaxZoom   = $(".object__content").data("dimensions-max-zoom");
  var map             = initLeaflet(
                          catalogueNumber, pixelWidth, pixelHeight, objectMaxZoom
                        );

  // Set up event listeners
  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
    setTimeout(map.invalidateSize.bind(map), 1000);
    event.preventDefault();
  });

  $("#leftPanelToggle").click(function (event) {
    leftPanelToggle();
    setTimeout(map.invalidateSize.bind(map), 1000);
    event.preventDefault();
  });

  $(".expander__trigger").click(function () {
    $(this).toggleClass("expander--hidden");
  });

  $(".panel__image-trigger").click(function() {
    $(this).toggleClass("active");
    $(".panel__image").fadeToggle("fast", "linear");
    $("#map").fadeToggle("fast", "linear");
  });


});
