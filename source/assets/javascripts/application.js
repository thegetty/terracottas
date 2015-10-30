//= require lib/jquery-1.11.3.min
//= require lib/jquery.smoothState.min
//= require lib/velocity.min
//= require lib/velocity.ui.min
//= require lib/handlebars.min
//= require lib/underscore-min
//= require lib/lunr.min
//= require lib/leaflet
//= require lib/threesixty
//= require lib/moment
//= require ui-functions
//= require map-functions
//= require search-functions
//= require catalogue.js
// require grid-functions

// Setting this up as global for now to ensure that old Vue instances
// are getting destroyed when not needed
var catalogueGrid;

setUpPage();

var searchIndex = $.getJSON(
  "http://gettypubs.github.io/Terracottas/contents.json").promise();
searchIndex.done(function(data) {
  var index    = populateIndex(data);
  var contents = contentList(data);
  searchSetup(index, contents);

  // Smoothstate
  $("#main").smoothState({
    onStart: {
      duration: 400,
      render: function ($container) {
        $('#nav-primary').removeClass('visible');
        $("#off-canvas-toggle").find("i")
          .removeClass("ion-ios-close-empty pr1")
          .addClass("ion-navicon");
        $container.velocity('fadeOut', {duration: 200});
      },
    },
    onReady: {
      duration: 400,
      render: function ($container, $newContent) {
        $container.html($newContent);
        $(".expander-content").addClass("expander--hidden");
        $container.velocity('fadeIn', {duration: 100});
      }
    },
    onAfter: function ($container, $newContent) {
      setUpPage();
      searchSetup(index, contents);
    }
  });
  // end Smoothstate section
});
