// =============================================================================
// Search Functions

// Lunr.js is the library which powers client-side search. Usage follows this
// general pattern:

// 1. At buildtime: generate a JSON file of all text contents (contents.json)
// 2. At runtime: load this file asynchronously via $.getJSON()
// 3. Feed the contents of this file into an empty Lunr index via populateIndex()
// 4. At the same time: use data to create a list of contents to reference
// 5. Set up the search UI elements (do this after each page transition)
// -  add event handlers to search buttons, inputs, etc.
// -  compile a Handlebars template for search results so it is ready
// 6. When user starts typing, take each Lunr result in the order of its rank;
// -  cross-reference that result with the contents array from earlier
// -  feed each contents[result] item into the HB template and append to the DOM

// -----------------------------------------------------------------------------
// Generate an empty Lunr index which searches the specified fields.
function initIndex() {
  var index = lunr(function(){
    this.field('title', { boost: 100 });
    this.field('city');
    this.field('typology');
    this.field('location');
    this.field('group');
    this.field('acc');
    this.field('content', { boost: 10 });
    this.field('description', { boost: 10 });
    this.field('condition');
    this.field('fabric');
    this.field('bibliography');
    this.field('provenance');
    this.ref('id');
  });
  return index;
}

// -----------------------------------------------------------------------------
// Feed data into an empty lunr index and return the populated result
function populateIndex(data) {
  var index = initIndex();
  data.forEach(function(item) {
    index.add(item);
  });
  return index;
}

// -----------------------------------------------------------------------------
// Create an array of contents to reference our search results against
function contentList(data) {
  var contents = [];
  data.forEach(function(item) {
    contents.push(item);
  });
  return contents;
}

// -----------------------------------------------------------------------------
// Utility function, use this on key input handler to keep from running a
// gazillion searches
function debounce (fn) {
  var timeout;
  return function () {
    var args = Array.prototype.slice.call(arguments),
        ctx = this;

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(ctx, args);
    }, 100);
  };
}

// -----------------------------------------------------------------------------
// Add event handlers, prepare results template, and run search once input received
// This function should be called each time Smoothstate reloads the page.
function searchSetup(index, contents){
  // Set up Handlebars template
  var resultsTemplate = Handlebars.compile($("#results-template").html());

  $("#search").click(function () {
    $(this).closest(".page-header").toggleClass("search-active");
    $(".search-results").toggleClass("search-active");
    rightPanelToggle();
  });

  $("#search-close").click(function() {
    $(this).closest(".page-header").toggleClass("search-active");
    $(".search-results").toggleClass("search-active");
    rightPanelToggle();
  });

  // bind escape key to search menu close
  $(document).keyup(function(e) {
    if ($(".search-results").hasClass("search-active")) {
      if (e.which == 27) {
        $(".page-header").removeClass("search-active");
        $(".search-results").removeClass("search-active");
        rightPanelToggle();
      }
    }
  });

  $("#search-field").bind("keyup", debounce(function(){
    $(".search-results").empty();
    if ($(this).val() < 2) return;
    var query = $(this).val();
    var results = index.search(query);
    $.each(results, function(index, result){
      //console.log(JSON.stringify(contents[result.ref]));
      $(".search-results").append(resultsTemplate({
        title: contents[result.ref].title,
        url: contents[result.ref].url,
        type: contents[result.ref].type,
        acc: contents[result.ref].acc
      }));
    });
  }));
}
