//= require lib/jquery.smoothState.min
//= require lib/velocity.min
//= require lib/velocity.ui.min
//= require lib/handlebars.min
//= require lib/lunr.min
//= require lib/isotope.pkgd.js
//= require ui-functions
//= require map-functions
//= require search-functions


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
  if ($el.length) {
    if (!isNaN($el.data("catalogue"))) {
      return true;
    } else if ($el.data("map") === true ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// =============================================================================
// Set up all the things!

function setUpPage(){
  var map;
  offCanvasSetup();
  addPanelControls();
  keyboardNav();
  $(".expander-content").addClass("expander--hidden");
  if (mapCheck($(".object-data"))) {
    map = deepZoomSetup();
    // must bind map resize asynchronously
    setTimeout(map.invalidateSize.bind(map), 100);
    addMapResizeListener(map);
  } else if ($("#map").length) {
    map = initMap();
    setTimeout(map.invalidateSize.bind(map), 100);
    addMapResizeListener(map);
  }
}

// =============================================================================
// Document.ready and smoothState.onAfter events

$(document).ready(function() {
  // Set up the UI
  setUpPage();
  // set up search
  // This is an asynchronous function and we want search to be available
  // at all times. So all other event-based functions (smoothstate, etc.)
  // happen _after_ the results of the AJAX request are available.
  // Don't forget to re-initialize the search UI after each page load though.
  $.getJSON("/Terracottas/contents.json", function(data){
    var index = populateIndex(data);
    var contents = contentList(data);
    searchSetup(index, contents);

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
          $container.velocity('fadeOut', {duration: 200});

        },
      },
      // Triggered when new content has been loaded via AJAX.
      // Good place to animate the insertion of new content.
      onReady: {
        duration: 400,
        render: function ($container, $newContent) {
          $container.html($newContent);
          $(".expander-content").addClass("expander--hidden");
          $container.velocity('fadeIn', {duration: 100});
        }
      },
      // Triggered when the transition has completed.
      // Make sure to reinitialize any JS elements on the page at this point.
      onAfter: function ($container, $newContent) {
        setUpPage();
        searchSetup(index, contents);
      }
    });
    // end Smoothstate section
  });
  // end Callback
});
