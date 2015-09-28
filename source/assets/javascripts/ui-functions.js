// =============================================================================
// UI Functions

// Code for basic interface components lives here. Everything should be wrapped
// up as individual functions that can be called from the main app.js file.


function jq(myid) {
  return myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
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
    $(target).velocity("scroll", { offset: "-60px" });
    event.preventDefault();
  });

  $(".footnote").click(function (event) {
    // Grab parent section of footnote target
    target = $(this).attr("href");
    $section = $(jq(target)).closest(".expander-content");
    // expand this section if not aready expanded
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

    if (isHidden($section)) {
      $section.velocity("transition.slideDownIn", options);
    }

    // animate scroll to target
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
    // event.preventDefault();
  });

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
    // event.preventDefault();
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
