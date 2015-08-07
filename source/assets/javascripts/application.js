//= require_tree .
//= require turbolinks
function initializeMap () {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZWdhcmRuZXIiLCJhIjoiN2IyMmRlMTc0YTAwMzRjYWVhMzI5ZGY1YmViMGVkZTEifQ._576KIFjJ0S_dRHcdM2BmQ';
  L.mapbox.map('map', 'egardner.n1p8bjh1');
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
  
  var $mapEl = $("#map");
  if ($mapEl.length) initializeMap();

  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
    event.preventDefault();
  });

  $(".expander__trigger").click(function () {
    $(this).toggleClass("expander--hidden");
  });


});