"use strict";

Shopify.theme.jsBlog = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsBlog = $.extend(this, Shopify.theme.getSectionData($section));

    if (this.enable_filter == true) {
      $('#blog_filter').on('change', function () {
        Shopify.theme.jsBlog.blogFilter();
      });
    }
  },
  blogFilter: function blogFilter() {
    var url = $('#blog_filter').val();
    window.location = url;
  },
  unload: function unload($section) {
    $('#blog_filter').off();
  }
};