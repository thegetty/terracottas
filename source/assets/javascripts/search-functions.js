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

function searchSetup(){
  $("#search").click(function () {
    $(this).closest(".page-header").toggleClass("search-active");
  });

  $("#search-field").bind("keyup", debounce(function(){
    if ($(this).val() < 2) return;
    var query = $(this).val();

    var results = idx.search(query);
    console.log(results);
  }));
}

// Moved this code to global scope for now

// function loadIndex(){
//   var idx = lunr(function(){
//     this.field('title', { boost: 10 });
//     this.field('city');
//     this.field('typology');
//     this.field('region');
//     this.field('group');
//     this.ref('id');
//   });
//
//   // Make an AJAX request for the JSON search data and feed this to Lunr's index
//   list = $.getJSON("/search.json", function (data) {
//     data.forEach(function(item){
//       idx.add(item);
//     });
//   });
//
//   return idx;
// }
