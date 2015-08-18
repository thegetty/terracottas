//= require jquery.smoothState.min
//= require velocity.min
//= require velocity.ui.min
//= require ramjet.min

// =============================================================================
// Basic UI Control functions
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

function isHidden($el) {
  if ($el.hasClass("expander--hidden")) {
    return true;
  } else {
    return false;
  }
}

function scrollDown() {

}


function addPanelControls() {
  // Show the off-canvas navigation
  $('#off-canvas-toggle').click(function() {
  	$('#nav-primary').toggleClass('visible');
  });


  // Hide the off-canvas nav when clicking a link
  $('#nav-primary').find('a').on('click', function(e) {
  	$('#nav-primary').removeClass('visible');
  });

  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
    event.preventDefault();
  });

  $("#leftPanelToggle").click(function (event) {
    leftPanelToggle();
    event.preventDefault();
  });

  $(".expander__trigger").click(function () {
    $section = $(this).parent().find(".expander__content");
    if (isHidden($section)) {
      $section.velocity("transition.slideDownIn", {
        duration: 300,
        complete: function () {
          $section.toggleClass("expander--hidden");
        }
      });
    } else {
      $section.velocity("transition.slideUpOut", {
        duration: 300,
        complete: function () {
          $section.toggleClass("expander--hidden");
        }
      });
    }

    //$(this).toggleClass("expander--hidden");
    //$(this).parent().find(".expander__content").velocity("transition.slideUpIn");
  });
}

// =============================================================================
// Determine whether the current page needs a deep zoom image

function isCatalogueItem($el) {
  if (!isNaN($el.data("catalogue"))) {
    return true;
  } else {
    return false;
  }
}

// =============================================================================
// Set up Leaflet.js for deep zoom images

// General leaflet setup
function initLeaflet(catalogueNumber, pixelWidth, pixelHeight, objectMaxZoom) {
  var mapMinZoom = (objectMaxZoom - 3);
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

// DOM-specific setup code (where to find object info)
function deepZoomSetup(){
  var catalogueNumber = $(".object__content").data("catalogue");
  var pixelWidth      = $(".object__content").data("dimensions-width");
  var pixelHeight     = $(".object__content").data("dimensions-height");
  var objectMaxZoom   = $(".object__content").data("dimensions-max-zoom");
  var map             = initLeaflet(
                          catalogueNumber, pixelWidth, pixelHeight, objectMaxZoom
                        );
  // Returns a map object for use by other functions
  return map;
}

// =============================================================================
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
}

// =============================================================================
// Set up all the things!

function setUpPage(){
  addPanelControls();
  if (isCatalogueItem($(".object__content"))) {
    $(".expander__content").addClass("expander--hidden");
    var map = deepZoomSetup();
    // need to call this on map set up because using smoothState means that the
    // map element may be loaded asynchronously. setTimeout is needed because
    // content must render first, then map size can be recalculated.
    setTimeout(map.invalidateSize.bind(map), 100);
    addMapResizeListener(map);
  }
}

function ramjetTest(a, b){
  // set the stage so ramjet copies the right styles...
  b.classList.remove('hidden');

  ramjet.transform( a, b, {
    done: function () {
      // this function is called as soon as the transition completes
      b.classList.remove('hidden');
    }
  });

  // ...then hide the original elements for the duration of the transition
  a.classList.add('hidden');
  b.classList.add('hidden');
}

// =============================================================================
// Document.ready and smoothState.onAfter events

$(document).ready(function() {
  // Set up the UI
  setUpPage();

  $("#main").smoothState({
    // Triggered when user clicks a link
    // Good place to animate removal of old content.

    // Example options when using the Velocity UI pack:
    // $(".card").velocity("transition.slideRightOut", {
    //   duration: 800,
    //   stagger: 200,
    //   drag: true
    // });

    onStart: {
      duration: 200,
      render: function ($container) {
        // $container.velocity({
        //   translateX: "-100vw"
        // }, {
        //   duration: 500,
        // });
        $container.velocity('fadeOut', {duration: 200});
      },
    },
    // Triggered when new content has been loaded via AJAX.
    // Good place to animate the insertion of new content.
    onReady: {
      duration: 200,
      render: function ($container, $newContent) {
        $container.html($newContent);
        // $container.velocity({
        //   translateX: "100vw"
        // }, {
        //   duration: 0,
        //   delay: 0
        // });
        // $container.velocity({
        //   translateX: "0"
        // }, {
        //   duration: 500,
        //   delay: 0
        // });
        $(".expander__content").addClass("expander--hidden");
        //
        // console.log("New Content: ");
        // console.log($newContent);
        $container.velocity('fadeIn', {duration: 200});
      }
    },
    // Triggered when the transition has completed.
    // Make sure to reinitialize any JS elements on the page at this point.
    onAfter: function ($container, $newContent) {
      setUpPage();
    }
  });

});
