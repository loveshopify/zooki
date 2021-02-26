"use strict";

Shopify.theme.jsSlideshowWithText = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsSlideshowWithText = $.extend(this, Shopify.theme.getSectionData($section));
    var textTransition = this.text_transition; // Selectors

    var $imageSlideshowEl = $section.find('[data-image-slideshow]').removeClass('is-hidden');
    var $textSlideshowEl = $section.find('[data-text-slideshow]').removeClass('is-hidden');
    var $imageSlideshow = $imageSlideshowEl.flickity({
      contain: true,
      wrapAround: true,
      prevNextButtons: this.number_of_slides > 1 ? this.show_arrows : false,
      pageDots: false,
      draggable: true,
      imagesLoaded: true,
      fade: this.image_transition == 'fade' ? true : false,
      autoPlay: this.image_slideshow_speed * 1000,
      arrowShape: arrowShape
    });
    var $textSlideshow = $textSlideshowEl.flickity({
      autoplay: false,
      contain: true,
      imagesLoaded: true,
      lazyload: 4,
      prevNextButtons: false,
      pageDots: this.number_of_slides > 1 ? this.show_nav_buttons : false,
      draggable: false,
      on: {
        ready: function ready() {
          var $currentTextSlide = $textSlideshowEl.find('.is-selected .text-slideshow__content');
          Shopify.theme.animation.slideTransition($currentTextSlide, textTransition);
        }
      }
    });
    $imageSlideshow.on('change.flickity', function (event, index) {
      $textSlideshow.flickity('select', index, true, true);
      var $currentTextSlide = $textSlideshowEl.find('.is-selected .text-slideshow__content');
      Shopify.theme.animation.slideTransition($currentTextSlide, textTransition);
    });
    $textSlideshow.on('change.flickity', function (event, index) {
      $imageSlideshow.flickity('select', index, true, false);
    });
    $section.find('.flickity-button').wrapAll('<div class="flickity-buttons-container"></div>');
  },
  blockSelect: function blockSelect($section, blockId) {
    var $slider = $section.find('[data-image-slideshow]');
    var $sliderIndex = $('#shopify-section-' + blockId).data('slide-index');
    $slider.flickity('select', $sliderIndex, true, true); // Fix for theme editor delay when adding new images to slideshow

    setTimeout(function () {
      $slider.flickity('resize');
    }, 500);
  },
  unload: function unload($section) {
    $section.find('.flickity-button').unwrap();
  }
};