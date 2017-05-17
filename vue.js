var autocomplete_select = {
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
    }
  },
  props: ['autocomplete'],
  methods: {
    setAutocompleteTypes: function(event) {
        this.$root.autocomplete.setTypes([event.target.value]);
    },
  },
  template: `
    <div class="form-group">
      <label for="type">Type</label>
      <select v-model="selected" @click="setAutocompleteTypes">
        <option v-for="option in options" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
  `
}

var address_input = {
  template: `
    <div class="form-group">
      <label for="autocomplete">Address</label>
      <input id="autocomplete" placeholder="Enter your address" class="form-control"
             _onFocus="geolocate()" type="text"></input>

    </div>
  `
}

var output_values = {
  template: `
    <table id="address" class="table table-condensed table-bordered">
      <tr>
        <td>Name</td>
        <td id="name"></td>
      </tr>
      <tr>
        <td>Vicinity</td>
        <td id="vicinity"></td>
      </tr>
      <tr>
        <td>UTC offset</td>
        <td id="utc_offset"></td>
      </tr>
      <tr>
        <td>Coordinates</td>
        <td id="geometry"</td>
      </tr>
      <tr>
        <td>Viewport NE</td>
        <td id="ne"></td>
      </tr>
      <tr>
        <td>Viewport SW</td>
        <td id="sw"></td>
      </tr>
      <tr>
        <td>Place ID</td>
        <td id="place_id"></td>
      </tr>
      <tr>
        <td>Place Url</td>
        <td id="place_url"></td>
      </tr>
      <tr>
        <td>Icon</td>
        <td>
          <img id="icon">
        </td>
      </tr>
      <tr>
        <td>Rating</td>
        <td id="rating"></td>
      </tr>
      <tr>
        <td>Price Level</td>
        <td id="price_level"></td>
      </tr>
      <tr>
        <td>Website</td>
        <td id="website"></td>
      </tr>
      <tr>
        <td>Types</td>
        <td id="types"></td>
      </tr>
      <tr>
        <td>Permanently closed</td>
        <td id="permanently_closed"></td>
      </tr>
      <tr>
        <td>Formatted Phone Number</td>
        <td id="formatted_phone_number"></td>
      </tr>
      <tr>
        <td>International Phone Number</td>
        <td id="international_phone_number"></td>
      </tr>
      <tr>
        <td>HTML attributions</td>
        <td id="html_attributions"></td>
      </tr>
    </table>
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
    'address-input': address_input,
    'autocomplete-select': autocomplete_select,
    'output-values': output_values,
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
      this.autocomplete.addListener('place_changed', this.fillInAddress);
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
    fillInAddress: function() {
      // Get the place details from the autocomplete object.
      var place = this.autocomplete.getPlace();

      // Get each component of the address from the place details
      // and fill the corresponding field on the form.
      adr_comps = document.getElementById("address_components");
      if (adr_comps) {
        while (adr_comps.hasChildNodes()) {
          adr_comps.removeChild(adr_comps.lastChild);
        }
      }

      if (place.address_components) {
        for (var i = 0; i < place.address_components.length; i++) {
          // var addressType = place.address_components[i].types[0];
          var tr = document.createElement("tr")
          comp = place.address_components[i];

          var td_short = document.createElement("td")
          var td_long = document.createElement("td")
          var td_types = document.createElement("td")

          td_short.innerHTML = comp.short_name;
          td_long.innerHTML = comp.long_name;
          td_types.innerHTML = String(comp.types);

          tr.appendChild(td_short);
          tr.appendChild(td_long);
          tr.appendChild(td_types);
          // if (componentForm[addressType]) {
          // var val = place.address_components[i][componentForm[addressType]];
          adr_comps.appendChild(tr);
          //document.getElementById(addressType).innerHTML = val;
          // }
        }
      }

      if (place.geometry) {
        var geometry = place.geometry.location.lat() + ', ' +
                       place.geometry.location.lng();
        var ne = place.geometry.viewport.getNorthEast().lat() + ', ' + 
                 place.geometry.viewport.getNorthEast().lng();
        var sw = place.geometry.viewport.getSouthWest().lat() + ', ' + 
                 place.geometry.viewport.getSouthWest().lng();

        document.getElementById('geometry').innerHTML = geometry;
        document.getElementById('ne').innerHTML = ne;
        document.getElementById('sw').innerHTML = sw;
      }

      if (place.permanently_closed) 
        document.getElementById('permanently_closed').innerHTML = place.permanently_closed;
      if (place.formatted_phone_number) 
        document.getElementById('formatted_phone_number').innerHTML = place.formatted_phone_number;
      if (place.html_attributions) 
        document.getElementById('html_attributions').innerHTML = place.html_attributions;
      if (place.icon)
        document.getElementById('icon').src = place.icon;
      if (place.international_phone_number)
        document.getElementById('international_phone_number').innerHTML = place.international_phone_number;

      if (place.place_id)
        document.getElementById('place_id').innerHTML = place.place_id;
      if (place.vicinity)
        document.getElementById('vicinity').innerHTML = place.vicinity;
      if (place.name)
        document.getElementById('name').innerHTML = place.name;
      if (place.url)
        document.getElementById('place_url').innerHTML = place.url;
      if (place.utc_offset)
        document.getElementById('utc_offset').innerHTML = String(place.utc_offset);
      if (place.website)
        document.getElementById('website').innerHTML = place.website;
      if (place.types) 
        document.getElementById('types').innerHTML = String(place.types);
      if (place.price_level)
        document.getElementById('price_level').innerHTML = place.price_level;
      if (place.rating)
        document.getElementById('rating').innerHTML = String(place.rating);

      photos_div = document.getElementById('photos');
      if (photos_div) {
        while (photos_div.hasChildNodes()) {
          photos_div.removeChild(photos_div.lastChild);
        }
      }

      if (place.photos) {
        var photos = place.photos;
        for (var k = 0; k < photos.length; k++) {
          var photo = photos[k];
          var img = document.createElement("img");
          img.src = photo.getUrl({
            maxHeight: 400,
          });

          div = document.createElement("div");
          div.classList.add("d-inline-block");

          img.classList.add("img-responsive");
          img.classList.add("img-photos");
          div.appendChild(img);

          photos_div.appendChild(div);
        }
      }

      global_place = place;
    }

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
