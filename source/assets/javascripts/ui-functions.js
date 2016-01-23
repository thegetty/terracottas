// =============================================================================
// UI Functions

// Code for basic interface components lives here. Everything should be wrapped
// up as individual functions that can be called from the main app.js file.


// =============================================================================
// jquery helper
// use this to wrap selectors that contain : characters

function jq(myid) { return myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );}

// =============================================================================
// Set the date inside of .cite-current-date span to date of access
// Format should be: DD Mon. YYYY per MLA guidelines

function citationDate(argument) {
  var today = moment().format("D MMM. YYYY");
  $(".cite-current-date").empty();
  $(".cite-current-date").text(today);
}

function fadeHeaderOnCover() {
  if ($(".cover").length) {
    $(window).on("scroll", debounce(function() {
      var currentHeight = $(window).scrollTop();
      var coverHeight = $(".cover").innerHeight();

      if (currentHeight > coverHeight) {
        $(".page-header").removeClass("page-header--hidden");
      }

      if (currentHeight < coverHeight) {
        $(".page-header").addClass("page-header--hidden");
      }
    }));
  }
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
  $('.menu-close-trigger').on('click', function(e) {
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
  // $(window).trigger('resize');

  // setTimeout(window.dispatchEvent(new Event('resize')), 100);
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
    duration: 300
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

  // Modal closed
  $(".modal-close").on("click", function() {
    $("body").removeClass("modal-open");
  });
}

// Show Modal ------------------------------------------------------------------
function showModal() {
  $("body").addClass("modal-open");
  init360();
}

// 360 rotation-----------------------------------------------------------------
function init360() {
  var catNum  = Number(window.location.pathname.match(/\d+/)[0]);
  var rwidth  = _.findWhere(DEEPZOOMDATA, {cat: catNum}).rwidth;
  var rheight = _.findWhere(DEEPZOOMDATA, {cat: catNum}).rheight;

  $(".rotator").ThreeSixty({
    totalFrames: 180, // Total no. of image you have for 360 slider
    endFrame: 180, // end frame for the auto spin animation
    currentFrame: 1, // This the start frame for auto spin
    imgList: '.threesixty_images', // selector for image list
    progress: '.spinner', // selector to show the loading progress
    imagePath:'http://getty.edu/publications/terracottas/assets/images/360/' + catNum + '/',
    filePrefix: '', // file prefix if any
    ext: '.JPG', // extention for the assets
    height: rheight,
    width: rwidth,
    responsive: false,
    autoplaydirection: -1,
    navigation: false
  });
}

// =============================================================================
// Set up all the things!

function setUpPage(){

  var map;

  fadeHeaderOnCover();
  offCanvasSetup();
  addPanelControls();
  keyboardNav();
  citationDate();

  if ($("#catalogue").length) {
    catalogueGrid = new Vue(catalogue);
  } else if (catalogueGrid) {
    catalogueGrid.$destroy();
    console.log("Destroyed old vue instance");
  }

  $(".expander-content").addClass("expander--hidden");
  if ( window.location.pathname.match(/catalogue\/\d+/) ) {
    var catNum = Number(window.location.pathname.match(/\d+/)[0]);
    map = new DeepZoom(catNum);
  } else if ($("#map").hasClass("fullscreen")) {
    map = new GeoMap();
  } else if ($("#map").length) {
    map = new GeoMap();
  }
}
