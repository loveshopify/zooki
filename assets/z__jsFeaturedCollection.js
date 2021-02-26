"use strict";

Shopify.theme.jsFeaturedCollection = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsFeaturedCollection = $.extend(this, Shopify.theme.getSectionData($section));

    if (this.enable_masonry_layout && !this.align_height && this.collection_style == 'grid') {
      Shopify.theme.applyMasonry();
    }

    if (this.collection_style == 'slider') {
      this.createSlider();
    }
  },
  createSlider: function createSlider() {
    var featuredCollectionSlider = $('.featured-collection.layout--slider .slider-gallery');
    var slideData = {
      products_per_slide: this.products_per,
      products_available: this.products_available,
      products_limit: this.products_limit,
      cellAlign: "left",
      wrapAround: true
    };
    $(featuredCollectionSlider).flickity({
      lazyLoad: 2,
      freeScroll: true,
      imagesLoaded: true,
      draggable: true,
      cellAlign: 'center',
      wrapAround: slideData.wrapAround,
      pageDots: false,
      contain: true,
      prevNextButtons: slideData.products_limit > slideData.products_per_slide ? true : false,
      initialIndex: 0,
      arrowShape: arrowShape,
      on: {
        ready: function ready() {
          // Reset layout to avoid collapsing issues
          setTimeout(function () {
            $(featuredCollectionSlider).flickity('resize');
          }, 500);
        }
      }
    });
  },
  unload: function unload($section) {
    var $slider = $section.find('.flickity-enabled');
    $slider.flickity('destroy');
  }
};