//= require lib/underscore-min
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
    selection: {
      location:   "All regions",
      typology:   "All types",
      group:      "All groups",
      date: {
        start: "550",
        end: "0",
        text: "All dates"
      }
    },
    locationOptions: [
      "All regions",
      "Taranto region",
      "Canosa",
      "Medma",
      "South Italy",
      "Sicily"
    ],
    typologyOptions: [
      "All types",
      "Statue",
      "Head",
      "Bust",
      "Statuette",
      "Plaque",
      "Mask",
      "Relief",
      "Altar",
      "Thymiaterion",
      "Clipeus"
    ],
    groupOptions: [
      "All groups",
      "Group of a Seated Poet and Sirens",
      "Group of Heads and Busts from the Taranto Region",
      "Four Statues of Mourning Women from Canosa",
      "Statuettes of a Seated Eros",
      "Pair of Altars with the Myth of Adonis"
    ],
    dateOptions: [
      {start: "550", end:"0",   text: "All dates"},
      {start: "550", end:"500", text: "550–500 BC"},
      {start: "499", end:"450", text: "499–450 BC"},
      {start: "400", end:"350", text: "400–350 BC"},
      {start: "399", end:"350", text: "399–350 BC"},
      {start: "349", end:"300", text: "349–300 BC"},
      {start: "299", end:"250", text: "299–250 BC"},
      {start: "249", end:"200", text: "249–200 BC"},
      {start: "199", end:"150", text: "199–150 BC"},
      {start: "149", end:"100", text: "149–100 BC"}
    ]
  },

  computed: {
    currentEntries: function() {
      return this.$eval('entries | selectedItems ');
    }
  },

  methods: {
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
    selectedItems: function () {
      var selection = this.selection;
      return _.chain(this.entries)
        .filter(function (entry) { // Location
          if (selection.location == "All regions") { return entry; }
          return entry.info.location == selection.location;
        })
        .filter(function (entry) { // Typology
          if (selection.typology == "All types") { return entry; }
          return entry.info.typology == selection.typology;
        })
        .filter(function (entry) { // Group
          if (selection.group == "All groups") { return entry; }
          return entry.info.group == selection.group;
        })
        .filter(function (entry) { // Date range
          return entry.meta.start_date >= selection.date.end
                 && entry.meta.end_date <= selection.date.start;
        })
        .value();
    }
  },

  ready: function (argument) {
    this.getCatalogue();
    this.loaded = true;
  }

};
