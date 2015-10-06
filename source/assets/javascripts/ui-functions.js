//= require grid-functions

// =============================================================================
// UI Functions

// Code for basic interface components lives here. Everything should be wrapped
// up as individual functions that can be called from the main app.js file.


// =============================================================================
// jquery helper
// use this to wrap selectors that contain : characters

function jq(myid) { return myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );}

// =============================================================================
// Determine whether the current page needs a deep zoom image

function mapCheck($el) {
  if ($el.length) {
    if ( !isNaN($el.data("catalogue")) ) { return true; }
    else if ( $el.data("map") === true ) { return true; }
    else { return false; }
  }
  else { return false; }
}

// -----------------------------------------------------------------------------
function keyboardNav(){
  $(document).keydown(function(event) {
    var prev, next;
    prev = document.getElementById("prev-link");
    next = document.getElementById("next-link");
    // 37 = left arrow key
    if (event.which === 37 && prev) {
      prev.click();
      event.preventDefault();
    }
    // 39 = right arrow key
    else if (event.which === 39 && next) {
      next.click();
      event.preventDefault();
    }
  });
}

// -----------------------------------------------------------------------------
function offCanvasSetup(){
  var $nav = $('#nav-primary');
  // Show the off-canvas navigation
  $('#off-canvas-toggle').on("click", function(e) {
    $(this).find('i').toggle();
    $nav.toggleClass('visible');
  });

  // Hide the off-canvas nav when clicking a link
  $('#nav-primary a').on('click', function(e) {
    $nav.removeClass('visible');
    $("#off-canvas-toggle").find('i').show();
  });
}
// -----------------------------------------------------------------------------
function rightPanelToggle () {
  var $left = $(".panel-left");
  var $right = $(".panel-right");
  var $header = $(".page-header");

  $left.toggleClass("panel--collapse");
  $right.toggleClass("panel--expand");
  $header.toggleClass("panel--expand");
}

// -----------------------------------------------------------------------------
function leftPanelToggle() {
  var $left = $(".panel-left");
  var $right = $(".panel-right");
  var $header = $(".page-header");

  $left.toggleClass("panel--expand");
  $right.toggleClass("panel--collapse");
  $header.toggleClass("panel--collapse");
}

// -----------------------------------------------------------------------------
function isHidden($el) {
  if ($el.hasClass("expander--hidden")) {
    return true;
  } else {
    return false;
  }
}


function expandSection($el) {
  $section = $el.parent().find(".expander-content");
  var options = {
    duration: 300,
    complete: function () { $section.toggleClass("expander--hidden"); }
  };

  if (isHidden($section)) {
    $section.velocity("transition.slideDownIn", options);
  } else {
    $section.velocity("transition.slideUpOut", options);
  }

  $section.toggleClass("expander--hidden");

}

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
function addPanelControls() {

  // Right Panel event listener
  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
    event.preventDefault();
  });

  // Left Panel event listener
  $("#leftPanelToggle").click(function (event) {
    leftPanelToggle();
    event.preventDefault();
  });

  // Scroll down event listener
  $(".scroll-down").click(function (event) {
    target = $(this).attr("href");
    $(target).velocity("scroll", { offset: "-60px" });
    event.preventDefault();
  });

  // Footnote scroll event listener
  // Opens parent section if section is closed
  $(".footnote").click(function (event) {
    var options = {
      duration: 100,
      delay: 100,
      complete: function () {
        $section.removeClass("expander--hidden");
        $(jq(target)).velocity("scroll", {
          offset: "-60px",
          container: $(".panel-right")
        });
      }
    };

    target = $(this).attr("href");
    $section = $(jq(target)).closest(".expander-content");

    if (isHidden($section)) {
      $section.velocity("transition.slideDownIn", options);
    }

    if ($(".panel-right").length >= 1) {
      $(jq(target)).velocity("scroll", {
        offset: "-60px",
        container: $(".panel-right")
      });
    } else {
      $(jq(target)).velocity("scroll", {
        offset: "-60px"
      });
    }
  });

  // Reverse footnote event listener
  $(".reversefootnote").click(function (event) {
    target = $(this).attr("href");
    if ($(".panel-right").length >= 1) {
      $(jq(target)).velocity("scroll", {
        offset: "-60px",
        container: $(".panel-right")
      });
    } else {
      $(jq(target)).velocity("scroll", {
        offset: "-60px"
      });
    }
  });

  // Accordion section event listener
  $(".expander-trigger").click(function() {
    expandSection($(this));
  });

  // Expand all trigger
  $(".expand-all").click(function(){
    $(this).toggleClass("expanded");

    // expand mode
    if ($(this).hasClass("expanded")) {
      $(this).html("Collapse All");
      $(".expander-trigger").filter(function() {
        var $section = $(this).parent().find(".expander-content");
        if ($section.hasClass("expander--hidden")) {
          return $section;
        }
      }).click();
    // collapse mode
    } else {
      $(this).html("Expand All");
      $(".expander-trigger").filter(function() {
        var $section = $(this).parent().find(".expander-content");
        if (!$section.hasClass("expander--hidden")) {
          return $section;
        }
      }).click();
    }
  });
}

// =============================================================================
// Set up all the things!

function setUpPage(){
  var map;
  offCanvasSetup();
  addPanelControls();
  keyboardNav();
  // gridControlSetup();
  gridSetup();

  $(".expander-content").addClass("expander--hidden");
  if ( mapCheck($(".object-data")) ) {
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
