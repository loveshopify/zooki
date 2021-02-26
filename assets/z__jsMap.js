"use strict";

Shopify.theme.jsMap = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsMap = $.extend(this, Shopify.theme.getSectionData($section));
    var mapData = {
      address: this.map_address,
      apikey: this.api_key,
      sectionid: this.id,
      showpin: this.show_pin,
      zoom: this.zoom_level,
      map_style: this.map_style
    }; // Enable caching to avoid duplicate google maps files

    $.ajaxSetup({
      cache: true
    });

    if (mapData.apikey) {
      // Load maps script and find location coordinates
      $.getScript('https://maps.googleapis.com/maps/api/js?key=' + mapData.apikey).then(function () {
        Shopify.theme.jsMap.findLocation(mapData);
        $.ajaxSetup({
          cache: false
        });
      });
    }
  },
  findLocation: function findLocation(mapData) {
    var geoLat;
    var geoLng;
    var geocoder = new google.maps.Geocoder(); // Find and set coordinates

    geocoder.geocode({
      address: mapData.address
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        geoLat = results[0].geometry.location.lat();
        geoLng = results[0].geometry.location.lng(); // Create map

        Shopify.theme.jsMap.initMap(geoLat, geoLng, mapData);
      } else {
        console.log('Error:' + status);
      }
    });
  },
  initMap: function initMap(lat, lng, mapData) {
    var location = {
      lat: lat,
      lng: lng
    };
    var styleJson = JSON.parse(mapData.map_style); // Set map options

    var mapOptions = {
      zoom: mapData.zoom,
      center: location,
      styles: styleJson,
      disableDefaultUI: false
    }; // Create map

    var map = new google.maps.Map(document.getElementById(mapData.sectionid), mapOptions); // Show pin

    if (mapData.showpin == true) {
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
    }
  },
  unload: function unload($section) {}
};