"use strict";

Shopify.theme.jsGallery = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsGallery = $.extend(this, Shopify.theme.getSectionData($section));
    var gutterSize = 0;

    if (this.show_gutter == true) {
      gutterSize = 20;
    }

    if (this.gallery_type == 'masonry') {
      Shopify.theme.applyMasonry('.gallery__item', gutterSize);
    } else if (this.gallery_type == 'horizontal-masonry') {
      Shopify.theme.applyHorizontalMasonry();
    }
  },
  unload: function unload($section) {}
};