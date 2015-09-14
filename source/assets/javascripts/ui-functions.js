// =============================================================================
// UI Functions

// Code for basic interface components lives here. Everything should be wrapped
// up as individual functions that can be called from the main app.js file.


// -----------------------------------------------------------------------------
function offCanvasSetup(){
  // Show the off-canvas navigation
  $('#off-canvas-toggle').click(function() {
    $(this).find('i').toggle();
    $('#nav-primary').toggleClass('visible');
  });

  // Hide the off-canvas nav when clicking a link
  $('#nav-primary a').on('click', function(e) {
    $('#nav-primary').removeClass('visible');
    $("#off-canvas-toggle").find('i').show();
  });
}
// -----------------------------------------------------------------------------
function rightPanelToggle () {
  var left = $(".panel-left");
  var right = $(".panel-right");
  left.toggleClass("panel--collapse");
  right.toggleClass("panel--expand");
}

// -----------------------------------------------------------------------------
function leftPanelToggle() {
  var left = $(".panel-left");
  var right = $(".panel-right");
  left.toggleClass("panel--expand");
  right.toggleClass("panel--collapse");
}

// -----------------------------------------------------------------------------
function isHidden($el) {
  if ($el.hasClass("expander--hidden")) {
    return true;
  } else {
    return false;
  }
}

// -----------------------------------------------------------------------------
function addPanelControls() {
  $("#rightPanelToggle").click(function (event) {
    rightPanelToggle();
    event.preventDefault();
  });

  $("#leftPanelToggle").click(function (event) {
    leftPanelToggle();
    event.preventDefault();
  });

  $(".scroll-down").click(function (event) {
    target = $(this).attr("href");
    $(target).velocity("scroll");
    event.preventDefault();
  });

  $(".expander-trigger").click(function () {
    // Velocity JS options object
    var options = {
      duration: 300,
      complete: function () { $section.toggleClass("expander--hidden"); }
    };

    $section = $(this).parent().find(".expander-content");

    if (isHidden($section)) {
      $section.velocity("transition.slideDownIn", options);
    } else {
      $section.velocity("transition.slideUpOut", options);
    }
  });
}
