//= require_tree .
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

  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
    event.preventDefault();
  })


});