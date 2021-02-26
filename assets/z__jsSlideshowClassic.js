"use strict";

Shopify.theme.jsSlideshowClassic = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsSlideshowClassic = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    var $slideshowClassicEl = $section.find('[data-slideshow-classic]').removeClass('is-hidden');
    var $slideshowClassic = $slideshowClassicEl.flickity({
      wrapAround: true,
      prevNextButtons: this.number_of_slides > 1 ? this.show_arrows : false,
      pageDots: this.show_nav_buttons,
      draggable: true,
      imagesLoaded: true,
      fade: this.image_transition == 'fade' ? true : false,
      autoPlay: this.image_slideshow_speed * 1000,
      arrowShape: arrowShape
    });
    setTimeout(function () {
      $slideshowClassicEl.flickity('resize');
    }, 500);
  },
  blockSelect: function blockSelect($section, blockId) {
    var $slider = $section.find('[data-image-slideshow]');
    var $sliderIndex = $('#shopify-section-' + blockId).data('slide-index');
    $slider.flickity('select', $sliderIndex, true, true);
  },
  unload: function unload($section) {}
};