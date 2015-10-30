//= require lib/vue
//= require lib/vue-resource.min

Vue.config.debug = true;
var catalogue = {
  el: "#catalogue",

  data: {
    entries: [],
    loaded: false,
    baseUrl: "http://gettypubs.github.io/Terracottas/assets/images/",
    sortKey: '["info"]["cat"]',

    // current filter state (aka gridSelection object) lives here as well
  },

  methods: {
    backgroundImage: function (item) {
      var imgUrl = this.baseUrl + item.info.acc + '.jpg';
      return "background-image: url(" + "imgUrl" + ")";
    },
    // get json method
    getCatalogue: function () {
      // GET request
      var url = "http://gettypubs.github.io/Terracottas/catalogue.json";
      this.$http.get(url, function (data, status, request) {
        this.$set('entries', data);
      }).error(function (data, status, request) {
        console.log("Something went wrong: " + status);
      });
    }

    // remove loading indicator?
    // a sortBy method may also be useful
  },

  filters: {
    // various filters live here.
    // Instead of getting args from template events, they should just filter
    // against the value of this.filterState (or whatever)
    // Template will use v-model for 2-way binding between selection elements
    // and filterState data object.

    // regionFilter
    // typeFilter
    // groupFilter
    // dateFilter
  },

  ready: function (argument) {
    this.getCatalogue();
    this.loaded = true;
  }

};
