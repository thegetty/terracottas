//= require_tree .
//= require turbolinks
function initializeMap () {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ';
  L.mapbox.map('map', 'egardner.n1p8bjh1');
}

function initLeaflet() {
  var mapMinZoom = 2;
  var mapMaxZoom = 5;
  var map = L.map('map', {
    maxZoom: mapMaxZoom,
    minZoom: mapMinZoom,
    crs: L.CRS.Simple
  }).setView([0, 0], mapMaxZoom);
  
  var mapBounds = new L.LatLngBounds(
      map.unproject([0, 8192], mapMaxZoom),
      map.unproject([6656, 0], mapMaxZoom));

  map.fitBounds(mapBounds);
  L.tileLayer('../assets/tiles/1/{z}/{x}/{y}.png', {
    minZoom: mapMinZoom, maxZoom: mapMaxZoom,
    bounds: mapBounds,
    //maxBoundsViscosity: 1.0,
    //attribution: 'Rendered with <a href="http://www.maptiler.com/">MapTiler</a>',
    noWrap: true          
  }).addTo(map);
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

function expandSection() {

}

$(document).ready(function() {
  
  initLeaflet();

  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
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