"use strict";

Shopify.theme.mobileMenu = {
  init: function init($section) {
    var $mobileMenuToggle = $('.mobile-menu__toggle-button');
    var $mobileDropDownToggle = $('.mobile-menu .close-dropdown');
    $mobileMenuToggle.on('click', function () {
      $(this).toggleClass('is-active');
      $('body, html').toggleClass('mobile-menu--opened');
    });
    $mobileDropDownToggle.on('click', function () {
      console.log("toggle menu");
      var inputId = $(this).parents('.has-submenu').find('.submenu__input').attr('id');
      $('.mobile-menu .submenu__input:not(#' + inputId + ')').not(this).prop('checked', false);
    });

    if (Shopify.theme.jsHeader.enable_sticky === true) {
      this.enableSticky();
    }
  },
  enableSticky: function enableSticky(offset) {
    var _this = this;

    var $stickyEl = $('#mobile-header');
    $stickyEl.addClass('sticky--enabled');
    $stickyEl.sticky({
      wrapperClassName: 'header-sticky-wrapper',
      zIndex: 40,
      topSpacing: offset || 0
    }).on('sticky-start', function () {
      if (_this.enable_overlay === true && _this.sectionUnderlayIsImage() === true) {
        $stickyEl.parent().addClass('has-overlaid-header');

        _this.disableOverlayStyle();
      } else if (_this.enable_overlay === true) {
        _this.disableOverlayStyle();
      }
    }).on('sticky-end', function () {
      // Safety timeout for logo width transition which can throw calculated height off
      setTimeout(function () {
        $stickyEl.sticky('update');
      }, 250);

      _this.$el.find('.sticky-menu-wrapper').removeClass('is-visible');

      _this.$menuToggle.removeClass('is-active');

      if (_this.enable_overlay === true && _this.sectionUnderlayIsImage() === true) {
        _this.updateOverlayStyle(_this.sectionUnderlayIsImage());
      }
    });
  },
  disableSticky: function disableSticky() {
    var $stickyEl = $('#mobile-header');
    $stickyEl.unstick();
    $stickyEl.removeClass('sticky--enabled');
    setTimeout(function () {
      $stickyEl.css('height', 'auto');
    }, 250);
  },
  unload: function unload($section) {
    $('.mobile-menu .close-dropdown').off();
  }
};