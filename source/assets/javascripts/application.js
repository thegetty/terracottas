//= require jquery.smoothState.min
//= require velocity.min
//= require velocity.ui.min
//= require ramjet.min

//= require ui-functions
//= require map-functions

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
  addPanelControls();
  $(".expander__content").addClass("expander--hidden");
  if (mapCheck($(".object__content"))) {
    var map = deepZoomSetup();
    // need to call this on map set up because using smoothState means that the
    // map element may be loaded asynchronously. setTimeout is needed because
    // content must render first, then map size can be recalculated.
    setTimeout(map.invalidateSize.bind(map), 100);
    addMapResizeListener(map);
  } else if ($("#map").length == true) {
    var map = initLeafletMap();
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
  // Show the off-canvas navigation
  $("#off-canvas-toggle").find("i").addClass("ion-navicon");
  $('#off-canvas-toggle').click(function() {
    $(this).find('i').toggleClass("ion-navicon");
    $(this).find('i').toggleClass("ion-ios-close-empty pr1");
    $('#nav-primary').toggleClass('visible');
  });

  // Hide the off-canvas nav when clicking a link
  $('#nav-primary').find('a').on('click', function(e) {
    $('#nav-primary').removeClass('visible');
  });

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
      duration: 300,
      render: function ($container) {
        // $container.velocity({
        //   translateX: "-100vw"
        // }, {
        //   duration: 500,
        // });

        // reset navigation on transition
        $('#nav-primary').removeClass('visible');
        $("#off-canvas-toggle").find("i")
          .removeClass("ion-ios-close-empty pr1")
          .addClass("ion-navicon");

        $container.velocity('fadeOut', {duration: 300});
      },
    },
    // Triggered when new content has been loaded via AJAX.
    // Good place to animate the insertion of new content.
    onReady: {
      duration: 300,
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
        $container.velocity('fadeIn', {duration: 300});
      }
    },
    // Triggered when the transition has completed.
    // Make sure to reinitialize any JS elements on the page at this point.
    onAfter: function ($container, $newContent) {
      setUpPage();
    }
  });

});
