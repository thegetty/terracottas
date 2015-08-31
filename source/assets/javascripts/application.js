//= require jquery.smoothState.min
//= require velocity.min
//= require velocity.ui.min
//= require ramjet.min
//= require ui-functions
//= require map-functions


// Come back to this later

// function ramjetTest(a, b){
//   // set the stage so ramjet copies the right styles...
//   b.classList.remove('hidden');
//
//   ramjet.transform( a, b, {
//     done: function () {
//       // this function is called as soon as the transition completes
//       b.classList.remove('hidden');
//     }
//   });
//
//   // ...then hide the original elements for the duration of the transition
//   a.classList.add('hidden');
//   b.classList.add('hidden');
// }

// =============================================================================
// Determine whether the current page needs a deep zoom image

function mapCheck($el) {
  if (!isNaN($el.data("catalogue"))) {
    return true;
  } else if ($el.data("map") == true ) {
    return true;
  } else {
    return false
  }
}

// =============================================================================
// Set up all the things!

function setUpPage(){
  offCanvasSetup();
  addPanelControls();
  $(".expander__content").addClass("expander--hidden");
  if (mapCheck($(".object__data"))) {
    var map = deepZoomSetup();
    // must bind map resize asynchronously
    setTimeout(map.invalidateSize.bind(map), 100);
    addMapResizeListener(map);
  } else if ($("#map").length == true) {
    var map = initLeafletMap();
    setTimeout(map.invalidateSize.bind(map), 100);
    addMapResizeListener(map);
  }
}

// =============================================================================
// Document.ready and smoothState.onAfter events

$(document).ready(function() {
  // Set up the UI
  setUpPage();

  // Smoothstate Choreography
  $("#main").smoothState({
    // Triggered when user clicks a link
    onStart: {
      duration: 400,
      render: function ($container) {
        // reset navigation on transition
        $('#nav-primary').removeClass('visible');
        $("#off-canvas-toggle").find("i")
          .removeClass("ion-ios-close-empty pr1")
          .addClass("ion-navicon");
        $(".panel--left").velocity({translateX: "-50vw"}, {duration: 200});
        $(".panel--right").velocity({translateX: "50vw"}, {duration: 200});
        $container.velocity('fadeOut', {duration: 200});

      },
    },
    // Triggered when new content has been loaded via AJAX.
    // Good place to animate the insertion of new content.
    onReady: {
      duration: 400,
      render: function ($container, $newContent) {
        $container.html($newContent);
        $(".panel--left").velocity({translateX: "-50vw"}, {duration: 0});
        $(".panel--right").velocity({translateX: "50vw"}, {duration: 0});
        $(".expander__content").addClass("expander--hidden");
        $container.velocity('fadeIn', {duration: 100});
        $(".panel--left").velocity({translateX: "0vw"}, {duration: 200});
        $(".panel--right").velocity({translateX: "0vw"}, {duration: 200});
      }
    },
    // Triggered when the transition has completed.
    // Make sure to reinitialize any JS elements on the page at this point.
    onAfter: function ($container, $newContent) {
      setUpPage();
    }
  });

});
