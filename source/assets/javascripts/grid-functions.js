var gridSelection = {};

function gridSetup() {
  if ( $("#catalogue-grid").length ) {
    var catalogue = $.getJSON("/catalogue.json").promise();
    catalogue.done(function(data){
      renderGrid(data);
      dropdownSetup(data);
    });
  }

}

// -----------------------------------------------------------------------------

function dropdownSetup(data) {
  $(".dropdown-button").click(function() {
    var $button, $menu, $category;
    $button = $(this);
    $category = $button.siblings(".dropdown-description");
    $menu = $button.siblings(".dropdown-menu");
    $menu.toggleClass("show-menu");
    $menu.children("li").click(function() {
      var selection = $(this).data();
      for (var key in selection) {
        if (selection.hasOwnProperty(key)) {
          gridSelection[key] = selection[key];
        }
        if (selection[key] == "all") {
          delete gridSelection[key];
        }
      }
      $menu.removeClass("show-menu");
      $button.html($(this).html());
      clearItems();
      renderGrid(_.where(data, gridSelection));
      // console.log(_.where(data, gridSelection));
      // resetFilter();
      // gridFilter($category.html(), $(this).html());
    });
  });
}

// -----------------------------------------------------------------------------
function resetFilter(){
  $(".card").show();
}

function clearItems(){
  $("#catalogue-grid .grid").empty();
}

function renderGrid(data) {
  var cardTemplate = Handlebars.compile($("#card-template").html());
  $.each(data, function(index, item) {
    $("#catalogue-grid .grid").append(cardTemplate({
      title: item.title,
      cat: item.cat,
      city: item.city,
      group: item.group,
      type: item.typology,
      region: item.region,
      url: "/catalogue/" + item.cat,
      image: "/assets/images/" + item.acc + ".jpg"
    }));
  });
}

function gridFilter(key, value) {
  if (value.toLowerCase().substring(0, 3) === "all") {
    resetFilter();
  } else {
    $(".card").not('[data-' + key.toLowerCase() + '="' + value + '"]').hide();
  }
  // console.log(key);
  // console.log(value);
}

// $("#catalogue").append(cardTemplate({
//   title: contents[result.ref].title,
//   url: contents[result.ref].url,
//   type: contents[result.ref].type,
//   acc: contents[result.ref].acc
// }));

// var searchIndex = $.getJSON("/contents.json").promise();
// searchIndex.done(function(data) {
//   var index    = populateIndex(data);
//   var contents = contentList(data);
//   searchSetup(index, contents);
