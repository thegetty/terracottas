// Grid Functions
//
// These functions manage the interactive catalogue grid.
// Users can filter by an arbitrary combination of criteria.
//
// Currently state is managed in a global gridSelection object.
// Its properties reflect the current key/value pairs for filter criteria.


// -----------------------------------------------------------------------------
// gridSetup()
// Makes an AJAX request using jQuery's promise syntax.
// Interface is rendered when promise resolves.

function gridSetup() {
  if ( $("#catalogue-grid").length ) {
    var catalogue = $.getJSON(
      "http://gettypubs.github.io/Terracottas/catalogue.json").promise();
    catalogue.done(function(data){
      renderGrid(data);
      gridControlSetup(data);
    });
  }
}

// -----------------------------------------------------------------------------
// renderGrid(array)
// Expects an array of objects which are passed to the template one by one
// Displays an empty state message if the array is empty

function renderGrid(data) {
  var cardTemplate = Handlebars.compile($("#card-template").html());
  $(".result-counter").empty();
  if(data.length > 0) {
    $.each(data, function(index, item) {
      $("#catalogue-grid .grid").append(cardTemplate({
        title: item.info.title,
        cat: item.info.cat,
        city: item.info.city,
        group: item.info.group,
        type: item.info.typology,
        region: item.info.region,
        startDate: item.meta.start_date,
        endDate: item.meta.end_date,
        url: "http://gettypubs.github.io/Terracottas/catalogue/" + item.info.cat,
        image: "http://gettypubs.github.io/Terracottas/assets/images/" + item.info.acc + ".jpg"
      }));
      $(".result-counter").html(data.length + " results");
    });
  } else {
    $("#catalogue-grid .grid").append(
      "<h2 class='grid-empty'>No results found</h2>"
    );
  }
}

// -----------------------------------------------------------------------------
// gridControlSetup(array)
// Sets up the filter controls.
// This function is called from the callback after gridSetup()'s promise resolves
// Data from the original AJAX request is passed so that it's available downstream

function gridControlSetup(data) {
  clearButton(data);
  $(".dropdown-button").click(function() {
    var $button, $menu, $category;
    $button = $(this);
    $category = $button.siblings(".dropdown-description");
    $menu = $button.siblings(".dropdown-menu");
    $menu.toggleClass("show-menu");
    $menu.children("li").click(function() {
      var selection = $(this).data();
      updateSelection(selection);
      $menu.removeClass("show-menu");
      $button.html($(this).html());
      clearItems();
      // renderGrid(_.where(data, gridSelection));
      renderGrid(filterData(data));
    });
  });
}


// -----------------------------------------------------------------------------
// FilterData(array)
//
// Expects an array of objects.
// Checks against properties of the global gridSelection object (based on user's
// input). This elaborate structure is necessary because the filter process for
// dates needs more than a simple test for the presence of a key/value pair.
// This function makes use of Underscore's chaining method.

function filterData(data) {
  return _.chain(data)
    // Location
    .filter(function (item) {
      if (gridSelection.hasOwnProperty("region")) {
        return item.info.region == gridSelection.region;
      } else {
        return item;
      }
    })
    // Typology
    .filter(function (item) {
      if (gridSelection.hasOwnProperty("typology")) {
        return item.info.typology == gridSelection.typology;
      } else {
        return item;
      }
    })
    // Group
    .filter(function (item) {
      if (gridSelection.hasOwnProperty("group")) {
        return item.info.group == gridSelection.group;
      } else {
        return item;
      }
    })
    // Date
    .filter(function (item) {
      if (gridSelection.hasOwnProperty("start")) {
        return item.meta.start_date >= gridSelection.end && item.meta.end_date <= gridSelection.start;
      } else {
        return item;
      }
    })
    .value();
  }

// -----------------------------------------------------------------------------
// updateSelection(key/value)
// Expects a simple key/value JS object.
// Adds this as a property to the global gridSelection object.
// If the user sets a filter value to "all", the relevant property is deleted

function updateSelection(selection) {
  for (var key in selection) {
    if (selection.hasOwnProperty(key)) {
      gridSelection[key] = selection[key];
    }
    if (selection[key] == "all") {
      delete gridSelection[key];
    }
  }
}

// -----------------------------------------------------------------------------
// clearButton(data)
// Sets up event handler on the clear filter button.
// Catalogue data from callback should be passed in so that the full catalogue
// can be re-rendered when selection is clear.

function clearButton(data) {
  $("#catalogue-filter-clear").click(function(event) {
    event.preventDefault();
    gridSelection = {};
    clearItems();
    $(".dropdown-button").html("Click to Select");
    renderGrid(data);
  });
}

// -----------------------------------------------------------------------------
// Remove grid items from the DOM
function clearItems(){ $("#catalogue-grid .grid").empty(); }


// -----------------------------------------------------------------------------
// Add and remove key/value pairs from this object as properties.
// To clear all filters, reset the object to = {}

var gridSelection = {};
