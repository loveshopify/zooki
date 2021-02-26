"use strict";

Shopify.theme.jsFeaturedPromos = {
  init: function init($section) {
    // Selectors
    var $prevButton = $section.find('.featured-promotions__nav--prev');
    var $nextButton = $section.find('.featured-promotions__nav--next');
    var $promoSlider = $section.find('[data-featured-promotions-slider]');
    var $featuredPromosSlider = $promoSlider.flickity({
      initialIndex: 1,
      contain: true,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      imagesLoaded: true,
      draggable: true,
      on: {
        ready: function ready() {
          // Reset layout to avoid collapsing issues
          setTimeout(function () {
            $featuredPromosSlider.flickity('resize');
          }, 500);
        }
      }
    });
    $prevButton.on('click', function () {
      $featuredPromosSlider.flickity('previous');
    });
    $nextButton.on('click', function () {
      $featuredPromosSlider.flickity('next');
    });
  },
  blockSelect: function blockSelect($section, blockId) {
    var $featuredPromosSlider = $section.find('[data-featured-promotions-slider]');
    var slideIndex = $('#shopify-section-' + blockId).data('promo-index');
    $featuredPromosSlider.flickity('select', slideIndex, true, true);
  },
  unload: function unload($section) {
    var $slider = $section.find('.flickity-enabled');
    $slider.flickity('destroy');
    $('.featured-promotions__nav--prev').off();
    $('.featured-promotions__nav--next').off();
  }
};