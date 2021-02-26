"use strict";

Shopify.theme.jsProduct = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsProduct = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    var $mainProductGallery = $section.find('.product-gallery__main');
    var $stickyElement = $section.find('.sticky-product-scroll');

    if (this.template === 'image-scroll') {
      if (isScreenSizeLarge()) {
        this.enableStickyScroll($stickyElement);
      }

      if (this.enable_zoom) {
        this.enableZoom($mainProductGallery);
      }

      if (this.enable_product_lightbox) {
        this.enableLightbox($mainProductGallery);
      }

      this.enableSlideshow($mainProductGallery);
    } else if (this.template === 'classic' || this.template === 'featured-product-section') {
      this.enableSlideshow($mainProductGallery);

      if (this.enable_zoom) {
        this.enableZoom($mainProductGallery);
      }

      if (this.enable_product_lightbox) {
        this.enableLightbox($mainProductGallery);
      }
    } else if (this.template === 'sections') {
      this.enableSlideshow($mainProductGallery);

      if (this.enable_zoom) {
        this.enableZoom($mainProductGallery);
      }

      if (this.enable_product_lightbox) {
        this.enableLightbox($mainProductGallery);
      }
    } else if (this.template === 'featured-slideshow') {
      this.enableFeaturedSlideshow($mainProductGallery);
    }

    $(".product_form_options", $section).each(function () {
      new Shopify.OptionSelectors($(this).data("select-id"), {
        product: $(this).data("product"),
        onVariantSelected: selectCallback,
        enableHistoryState: $(this).data("enable-state")
      });
    });

    if (window.location.search === '?contact_posted=true') {
      $('.notify_form .contact-form').hide();
      $('.notify_form .contact-form').prev('.message').html(Shopify.translation.notify_form_success);
    }

    var $notify_form = $('.notify_form .contact-form');
    $notify_form.each(function () {
      var $nf = $(this);
      $nf.on("submit", function (e) {
        if ($('input[name="challenge"]', $nf).val() !== "true") {
          $.ajax({
            type: $nf.attr('method'),
            url: $nf.attr('action'),
            data: $nf.serialize(),
            success: function success(data) {
              $nf.fadeOut("slow", function () {
                $nf.prev('.message').html(Shopify.translation.notify_form_success);
              });
            },
            error: function error(data) {
              $('input[name="challenge"]', $nf).val('true');
              $nf.submit();
            }
          });
          e.preventDefault();
        }
      });
    });

    if (Shopify.theme_settings.product_form_style === "swatches") {
      this.enableProductSwatches();
    } else if (Shopify.theme_settings.product_form_style === "dropdown") {
      $('.selector-wrapper select', $section).wrap('<span class="select" data-dropdown-form-style></span>');
      this.findSelectedVariantImage();
    }

    if ($('.masonry--true').length > 0) {
      Shopify.theme.applyMasonry('.thumbnail');
    }
  },
  enableStickyScroll: function enableStickyScroll($el) {
    var announcementHeight = 0;
    var headerHeight = 0;

    if (typeof Shopify.theme.jsAnnouncementBar !== 'undefined' && Shopify.theme.jsAnnouncementBar.enable_sticky) {
      announcementHeight = $('#announcement-bar').outerHeight();
    }

    if (Shopify.theme_settings.header_layout != 'vertical') {
      if (Shopify.theme.jsHeader.enable_sticky) {
        headerHeight = $('#header').outerHeight();
      }
    }

    $el.stick_in_parent({
      offset_top: announcementHeight + headerHeight + 20
    });
  },
  enableLightbox: function enableLightbox($el) {
    $el.find('.product-gallery__link').fancybox({
      beforeClose: function beforeClose(instance, slide) {
        var $instanceGallery = instance.$trigger.first().parents('.product-gallery__main');
        $instanceGallery.hide();
        setTimeout(function () {
          $instanceGallery.fadeIn(100);
        }, 500);
      }
    });
  },
  enableZoom: function enableZoom($el) {
    $el.find('img').wrap('<span class="zoom-container"></span>').css('display', 'block').parent().zoom({
      touch: false,
      magnify: 1
    });
  },
  disableSlideshow: function disableSlideshow($section) {
    var $slider = $section.find('.flickity-enabled');
    $slider.flickity('destroy');
  },
  enableFeaturedSlideshow: function enableFeaturedSlideshow($el) {
    var $gallery = $el.flickity({
      wrapAround: true,
      setGallerySize: false,
      dragThreshold: 10,
      imagesLoaded: true,
      pageDots: false,
      prevNextButtons: this.product_images_amount > 1 ? this.gallery_arrows : false,
      autoPlay: this.slideshow_speed * 1000,
      arrowShape: arrowShape
    });
    $gallery.on('staticClick.flickity', function (event, pointer, cellElem, cellIndex) {
      if (cellIndex !== undefined) {
        $gallery.flickity('select', cellIndex);
      }
    });
  },
  enableSlideshow: function enableSlideshow($el) {
    var $thumbnailProductGallery = $el.parents('.product-gallery').find('.product-gallery__thumbnails');
    $el.flickity({
      wrapAround: true,
      adaptiveHeight: true,
      dragThreshold: 10,
      imagesLoaded: true,
      pageDots: this.product_images_amount > 1 ? true : false,
      prevNextButtons: this.product_images_amount > 1 ? this.gallery_arrows : false,
      autoPlay: this.slideshow_speed * 1000,
      fade: this.slideshow_transition === 'fade' ? true : false,
      watchCSS: this.template === 'image-scroll' ? true : false,
      arrowShape: arrowShape,
      setGallerySize: false // Modified by WestmountSolutions.com WSDEV20200722-DV
    });
    setTimeout(function () {
      $el.flickity('resize');
    }, 500);
    $(window).on('load', function () {
      $el.flickity('resize');
    });
    var flkty = $el.data('flickity');

    if (this.enable_thumbnail_slider === true && this.product_images_amount > 1) {
      if (this.thumbnail_position == 'right-thumbnails' || this.thumbnail_position == 'left-thumbnails') {
        $thumbnailProductGallery.css('max-height', $el.closest('product-gallery').outerHeight());
        var $thumbnailNavCells = $thumbnailProductGallery.find('.product-gallery__thumbnail');
        $thumbnailProductGallery.addClass('vertical-slider-enabled');
        $thumbnailProductGallery.on('click', '.product-gallery__thumbnail', function (event) {
          var index = $(event.currentTarget).index();
          $el.flickity('select', index);
        });
        var navCellHeight = $thumbnailNavCells.height();
        var navHeight = $thumbnailProductGallery.height();
        $el.on('select.flickity', function () {
          // set selected nav cell
          $thumbnailProductGallery.find('.is-nav-selected').removeClass('is-nav-selected');
          var $selected = $thumbnailNavCells.eq(flkty.selectedIndex).addClass('is-nav-selected'); // scroll nav

          var scrollY = $selected.position().top + $thumbnailProductGallery.scrollTop() - (navHeight + navCellHeight) / 2;
          $thumbnailProductGallery.animate({
            scrollTop: scrollY
          });
        });
      } else {
        $thumbnailProductGallery.flickity({
          cellAlign: 'center',
          contain: false, // Modified by WestmountSolutions.com WSDEV20200722-DV
          groupCells: '80%',
          imagesLoaded: true,
          pageDots: false,
          prevNextButtons: /*this.product_images_amount > 5 ? this.thumbnail_arrows : false*/ true, // Modified by WestmountSolutions.com WSDEV20200722-DV
          asNavFor: this.template === 'image-scroll' && isScreenSizeLarge() ? '' : $el[0],
          setGallerySize: false, // Modified by WestmountSolutions.com WSDEV20200722-DV
          draggable: true, // Modified by WestmountSolutions.com WSDEV20200722-DV
          arrowShape: { 
            x0: 20,
            x1: 65, y1: 50,
            x2: 70, y2: 50,
            x3: 25
          } // Modified by WestmountSolutions.com WSDEV20200722-DV
        });
      }
    }

    var $galleryThumbnail = $thumbnailProductGallery.find('.product-gallery__thumbnail');
    $galleryThumbnail.on('click', function (e) {
      var dataIndex = $(this).find('img').data('index');
      $el.flickity('select', dataIndex);
    });
  },
  enableProductSwatches: function enableProductSwatches() {
    $('body').on('change', '.swatch :radio', function () {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();
      var parentForm = $(this).closest('.product_form form');

      if (parentForm.siblings('.notify_form').length) {
        var notifyForm = parentForm.siblings('.notify_form');
      } else {
        var notifyForm = $('.js-notify-form');
      }

      var option1 = parentForm.find('.swatch_options input:checked').eq(0).val();
      var option2 = parentForm.find('.swatch_options input:checked').eq(1).val() || '';
      var option3 = parentForm.find('.swatch_options input:checked').eq(2).val() || '';

      if (option1 && option2 && option3) {
        var notifyMessage = option1 + ' / ' + option2 + ' / ' + option3;
      } else if (option1 && option2) {
        var notifyMessage = option1 + ' / ' + option2;
      } else {
        var notifyMessage = option1;
      }

      notifyForm.find(".notify_form_message").attr("value", notifyForm.find(".notify_form_message").data('body') + " - " + notifyMessage);
      $(this).closest('form').find('.single-option-selector').eq(optionIndex).val(optionValue).trigger('change');
    }); //Swatches linked with selected options

    if ($('.js-product_section').length) {
      var $productForms = $('.js-product_section').find('.product_form');
      $productForms.addClass('is-visible'); //Loop through each product and set the initial option value state

      $productForms.each(function () {
        var JSONData = $(this).data('product');
        var productID = $(this).data('product-id');
        var productSection = '.product-' + productID + ' .js-product_section';
        var swatchOptions = $(this).find('.swatch_options .swatch');

        if (swatchOptions.length > 1) {
          Shopify.linkOptionSelectors(JSONData, productSection);
        }
      });
    } //Add click event when there is more than one product on the page (eg. Collection in Detail)


    if ($('.js-product_section').length > 1) {
      $('body').on('click', '.swatch-element', function () {
        var swatchValue = $(this).data('value').toString();
        $(this).siblings('input[value="' + swatchValue.replace(/\"/g, '\\"') + '"]').prop("checked", true).trigger("change");
        var JSONData = $(this).parents('.product_form').data('product');
        var productID = $(this).parents('.product_form').data('product-id');
        var productSection = '.product-' + productID + ' .js-product_section';
        var swatchOptions = $(this).parents('.product_form').find('.swatch_options .swatch');

        if (swatchOptions.length > 1) {
          Shopify.linkOptionSelectors(JSONData, productSection);
        }
      });
    }

    this.findSelectedVariantImage();
  },
  findSelectedVariantImage: function findSelectedVariantImage() {
    $('[data-variant-selector]').on('selectedVariantChanged', function () {
      if ($(this).attr('disabled')) {
        return;
      } else {
        getIndex($(this), $(this).val());
      }
    });

    function getIndex($selector, variantID) {
      var $parentForm = $selector.parents('.product_form');
      var $option = $parentForm.find("select option[value=".concat(variantID, "]"));
      var imageID = $option.attr('data-image-id');

      if (!imageID) {
        // If there is no image, no scrolling occurs
        return false;
      }

      var index = $("[data-image-id=".concat(imageID, "]")).data('index');

      if (Shopify.theme.jsProduct.template === 'image-scroll') {
        Shopify.theme.jsProduct.scrollSelectedImage(index);
      }
    }
  },
  scrollSelectedImage: function scrollSelectedImage(variant) {
    var headerHeight = 0;
    var announceHeight = 0; // Get header height is sticky enabled

    if (Shopify.theme.jsHeader.enable_sticky == true && Shopify.theme_settings.header_layout != 'vertical') {
      headerHeight = Shopify.theme.jsHeader.getHeaderHeight();
    } // Get announcement height is sticky enabled


    if (typeof Shopify.theme.jsAnnouncementBar !== 'undefined' && Shopify.theme.jsAnnouncementBar.enable_sticky == true && Shopify.theme_settings.header_layout != 'vertical') {
      announceHeight = Shopify.theme.jsAnnouncementBar.getAnnouncementHeight();
    } // Add values


    var totalHeight = headerHeight + announceHeight;
    Shopify.theme.scrollToTop($("[data-index=\"".concat(variant, "\"]")), totalHeight);
  },
  relatedProducts: function relatedProducts() {
    $('.block__recommended-products .js-related-products-slider .products-slider').each(function (index, value) {
      var $relatedSlider = $(this);
      var slideData = {
        products_per_slide: $relatedSlider.data('products-per-slide'),
        products_available: $relatedSlider.data('products-available'),
        products_limit: $relatedSlider.data('products-limit'),
        initialIndex: 0,
        cellAlign: "left",
        wrapAround: true
      };

      if (slideData.products_available > slideData.products_per_slide && slideData.products_limit > slideData.products_per_slide) {
        slideData.wrapAround = true;
      } else {
        slideData.wrapAround = false;
      }

      if (slideData.products_available < slideData.products_per_slide || slideData.products_limit < slideData.products_per_slide) {
        $relatedSlider.addClass('container is-justify-center');
        $relatedSlider.find('.gallery-cell').addClass('column');
      } else {
        $relatedSlider.flickity({
          lazyLoad: 2,
          freeScroll: true,
          imagesLoaded: true,
          draggable: true,
          cellAlign: 'center',
          wrapAround: slideData.wrapAround,
          pageDots: false,
          contain: true,
          prevNextButtons: slideData.products_limit > slideData.products_per_slide ? true : false,
          initialIndex: slideData.initialIndex,
          arrowShape: arrowShape
        });
        setTimeout(function () {
          $relatedSlider.flickity('resize');
        }, 500);
        $(window).on('load', function () {
          $relatedSlider.flickity('resize');
        });
      }
    });
  },
  unload: function unload($section) {
    $('.selector-wrapper select', $section).unwrap();
    this.disableSlideshow($section);
    $('[data-variant-selector]').off();
  }
};