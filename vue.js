var input_select = {
  data: function() {
    return {
      selected: 'geocode',
      options: [
        { text: 'Geocode', value: 'geocode'},
        { text: 'Address', value: 'address'},
        { text: 'Establishment', value: 'establishment'},
        { text: '(regions)', value: '(regions)'},
        { text: '(cities)', value: '(cities)'}
      ]
    };
  },
  props: ['autocomplete'],
  methods: {
    setAutocompleteTypes: function(event) {
        this.$root.autocomplete.setTypes([event.target.value]);
    },
  },
  template: `
    <div class="form-inline" onsubmit="return false;">
      <label class="sr-only" for="autocomplete">Address</label>
      <input id="autocomplete" placeholder="Enter your address" class="form-control mb-2 mr-sm-2 mb-sm-0"
             _onFocus="geolocate()" type="text"></input>

      <label class="mr-sm-2" for="type">Type</label>
      <select v-model="selected" @click="setAutocompleteTypes" class="custom-select">
        <option v-for="option in options" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  `
}


var output_components = {
  data: function() {
    return {
      address_components: [],
    };
  },
  template: `
    <p v-if="address_components.length === 0">No components defined yet</p>
    <div v-else class="table-responsive">
      <table class="table  table-sm">
        <thead>
          <tr>
            <th>short_name</th>
            <th>long_name</th>
            <th>types</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="component in address_components">
            <td>{{component.short_name}}</td>
            <td>{{component.long_name}}</td>
            <td>{{component.types}}</td>
          </tr>
        </tbody>
      </table> 
    </div>
  `,
  methods: {
    fillInAddress: function() {
      // Get the place details from the autocomplete object.
      var place = this.$root.autocomplete.getPlace();
      this.address_components = place.address_components;
    }
  }
}


var output_main = {
  data: function() {
    return {
      place: {}
    };
  },
  computed: {
    coordinates: function() {
      try {
        return this.place.geometry.location.lat() + ', ' +  this.place.geometry.location.lng();
      } catch(err) {}
    }
  },
  methods: {
    fillInAddress: function() {
      // Get the place details from the autocomplete object.
      this.place = this.$root.autocomplete.getPlace();
      global_place = this.place;

      // photos_div = document.getElementById('photos');
      // if (photos_div) {
      //   while (photos_div.hasChildNodes()) {
      //     photos_div.removeChild(photos_div.lastChild);
      //   }
      // }

      // if (place.photos) {
      //   var photos = place.photos;
      //   for (var k = 0; k < photos.length; k++) {
      //     var photo = photos[k];
      //     var img = document.createElement("img");
      //     img.src = photo.getUrl({
      //       maxHeight: 400,
      //     });

      //     div = document.createElement("div");
      //     div.classList.add("d-inline-block");

      //     img.classList.add("img-responsive");
      //     img.classList.add("img-photos");
      //     div.appendChild(img);

      //     photos_div.appendChild(div);
      //   }
      // }

    }
  },
  template: `
    <p v-if="Object.keys(place).length === 0">No values defined yet</p>
    <div v-else class="table-responsive">
      <table class="table table-sm ">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{{place.name}}</td>
          </tr>
          <tr>
            <td>Vicinity</td>
            <td>{{place.vicinity}}</td>
          </tr>
          <tr>
            <td id="formatter_address_label">Formatted Address</td>
            <td id="formatter_address_value">{{place.formatted_address}}</td>
          </tr>
          <tr>
            <td>Place ID</td>
            <td>{{place.id}}</td>
          </tr>
          <tr>
            <td>Map and Coordinates</td>
            <td>
              <img v-if="place.icon" :src="place.icon" width="18">
              <a v-if="place.url" :href="place.url" target="_blank">{{coordinates}}</a>
              <span v-else>{{coordinates}}</span>
            </td>
          </tr>
          <tr>
            <td id="types_label">Types</td>
            <td id="types_value">{{place.types}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

var output_misc = {
  data: function() {
    return {
      place: {}
    };
  },
  methods: {
    fillInAddress: function() {
      this.place = this.$root.autocomplete.getPlace();
    }
  },
  computed: {
    is_place_empty: function() {
      return Object.keys(this.place).length === 0;
    },
    viewport_ne: function() {
      try {
        return this.place.geometry.viewport.getNorthEast().lat() + ', ' + 
               this.place.geometry.viewport.getNorthEast().lng();
      } catch(err){}
    },
    viewport_sw: function() {
      try {
        return this.place.geometry.viewport.getSouthWest().lat() + ', ' + 
               this.place.geometry.viewport.getSouthWest().lng();
      } catch(err) {}
    }
  },
  template: `
    <p v-if="is_place_empty">No misc values defined yet</p>
    <div v-else class="table-responsive">
      <table class="table table-sm ">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="viewport_ne_label">Viewport NE</td>
            <td id="viewport_ne_value">{{viewport_ne}}</td>
          </tr>
          <tr>
            <td id="viewport_sw_label">Viewport SW</td>
            <td id="viewport_sw_value">{{viewport_sw}}</td>
          </tr>
          <tr>
            <td id="utc_offset_label">UTC offset</td>
            <td id="utc_offset_value">{{place.utc_offset}}</td>
          </tr>
          <tr>
            <td id="scope_label">Scope</td>
            <td id="scope_value">{{place.scope}}</td>
          </tr>
          <tr>
            <td id="adr_address_label">adr_address</td>
            <td id="adr_address_value">{{place.adr_address}}</td>
          </tr>
          <tr>
            <td id="alt_ids_label">alt_ids</td>
            <td id="alt_ids_value">{{place.alt_ids}}</td>
          </tr>
          <tr>
            <td id="html_attributions_label">HTML attributions</td>
            <td id="html_attributions_value">
              <span v-if="place.html_attributions.length > 0">{{place.html_attributions}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

var output_establishment = {
  data: function() {
    return {
      place: {}
    }
  },
  methods: {
    fillInAddress: function() {
      this.place = this.$root.autocomplete.getPlace();
    }
  },
  template: `
    <p v-if="Object.keys(place).length === 0">No establishment values defined yet</p>
    <div v-else class="table-responsive">
      <table class="table table-sm ">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="rating_label">Rating</td>
            <td id="rating_value">{{place.rating}}</td>
          </tr>
          <tr>
            <td>Price Level</td>
            <td id="price_level"></td>
          </tr>
          <tr>
            <td>Website</td>
            <td>
              <a :href="place.website" v-if="place.website"
                {{place.website}}
              </a>
            </td>
          </tr>
          <tr>
            <td>Permanently closed</td>
            <td>{{place.permanently_closed}}</td>
          </tr>
          <tr>
            <td>Formatted Phone Number</td>
            <td>{{place.formatted_phone_number}}</td>
          </tr>
          <tr>
            <td>International Phone Number</td>
            <td>{{place.international_phone_number}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

var output_photos = {
  data: function() {
    return {
      place: {},
      photos: []
    };
  },
  methods: {
    fillInAddress: function() {
      // Get the place details from the autocomplete object.
      this.photos = [];
      this.place = this.$root.autocomplete.getPlace();
      var photos = this.place.photos;

      if (photos) {
        for (var k = 0; k < photos.length; k++) {
          var photo = photos[k];
          var thumb = photo.getUrl({maxHeight: 300});
          var full = photo.getUrl({maxHeight: 1000});

          this.photos.push({thumb: thumb, full: full});
        }
      }
    }
  },
  template: `
    <p v-if="photos.length === 0">No photos defined yet</p>
    <div v-else>
      <div style="display:inline-block" v-for="photo in photos">
        <a :href="photo.full" data-toggle="lightbox" data-type="image" data-gallery="example-gallery" >
          <img :src="photo.thumb" class="img-fluid">
        </a>
      </div>
    </div>
  `
}


var vm = new Vue({
  el: '#app',
  data: {
    title: 'Geolocation example',
    selected: 'geocode',
    options: [
      { text: 'Geocode', value: 'geocode'},
      { text: 'Address', value: 'address'},
      { text: 'Establishment', value: 'establishment'},
      { text: '(regions)', value: '(regions)'},
      { text: '(cities)', value: '(cities)'}
    ]
  },
  components: {
    // 'input-address': input_address,
    'input-select': input_select,
    'output-main': output_main,
    'output-components': output_components,
    'output-establishment': output_establishment,
    'output-misc': output_misc,
    'output-photos': output_photos,
  },
  methods: {
    // addItem: function () {
    //   var text;

    //   text = this.newItem.trim();
    //   if (text) {
    //     this.items.push({
    //       text: text,
    //       checked: false
    //     });
    //     this.newItem = '';
    //   }
    // },
    initAutocomplete: function() {
      // Create the autocomplete object, restricting the search to geographical
      // location types.
      console.log('Act!');
      this.autocomplete = new google.maps.places.Autocomplete(
          /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
          {types: ['(cities)']}
      );

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      this.autocomplete.addListener('place_changed', this.$refs.output_main.fillInAddress);
      this.autocomplete.addListener('place_changed', this.$refs.output_components.fillInAddress);
      this.autocomplete.addListener('place_changed', this.$refs.output_establishment.fillInAddress);
      this.autocomplete.addListener('place_changed', this.$refs.output_misc.fillInAddress);
      this.autocomplete.addListener('place_changed', this.$refs.output_photos.fillInAddress);
    },
    geolocate: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          this.autocomplete.setBounds(circle.getBounds());
        });
      }
    },

  }
});

    var placeSearch, autocomplete;
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    // function setupSelect(id, types) {
      // var select = document.getElementById("type");
      // select.addEventListener('change', function() {
      //   autocomplete.setTypes([select.value]);
      // });
    // }



    function initAutocomplete() {
      vm.initAutocomplete();
    }
    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
