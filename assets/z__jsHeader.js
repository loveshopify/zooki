"use strict";

Shopify.theme.jsHeader = {
  init: function init($section) {
    var _this = this;

    // Add settings from schema to current object
    Shopify.theme.jsHeader = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    this.$el = $('#header');
    this.$menuToggle = this.$el.find('.header__menu-toggle');
    var announcementHeight = $('.announcement-sticky-wrapper').height(); // Overlaid header

    if (this.enable_overlay === true && isScreenSizeLarge()) {
      this.updateOverlayStyle(this.sectionUnderlayIsImage());
    } // Sticky header


    if (this.enable_sticky === true && isScreenSizeLarge()) {
      this.enableSticky(announcementHeight);
    }

    if (this.header_layout == 'centered' || this.header_layout == 'search_focus') {
      this.$menuToggle.on('click', function () {
        _this.showStickyMenu();
      });
    } else if (this.header_layout == 'vertical') {
      $section.find('.header-sticky-wrapper').stick_in_parent();

      if (Shopify.theme_settings.announcement_enabled == true) {
        Shopify.theme.jsAnnouncementBar.addVerticalHeaderTopMargin();
      }

      this.addOffScreenDropdownCheck();
    }

    if ($('.mega-menu').length > 0) {
      Shopify.theme.jsMegaMenu.init($section);
    }

    if (!isScreenSizeLarge()) {
      this.unload();
      Shopify.theme.mobileMenu.init();
    }

    $('.navbar-item').on('mouseleave', function () {
      Shopify.theme.jsHeader.collapseSubmenu($(this));
    });
    $('.search-overlay__close').on('click', function () {
      Shopify.theme.jsHeader.hideSearch();
    });
    $(document).on('click', '[data-show-search-trigger]', function () {
      Shopify.theme.jsHeader.showSearch();
    });
  },
  collapseSubmenu: function collapseSubmenu(el) {
    $(el).find('.has-submenu input').prop("checked", false);
  },
  showStickyMenu: function showStickyMenu() {
    this.$menuToggle.toggleClass('is-active');
    this.$el.find('.sticky-menu-wrapper').toggleClass('is-visible');
  },
  hideStickyMenu: function hideStickyMenu() {
    this.$menuToggle.removeClass('is-active');
    this.$el.find('.sticky-menu-wrapper').removeClass('is-visible');
  },
  disableSticky: function disableSticky() {
    var $stickyEl = $('#header');
    $stickyEl.unstick();
    $stickyEl.removeClass('sticky--enabled');
    setTimeout(function () {
      $stickyEl.css('height', 'auto');
    }, 250);
  },
  enableSticky: function enableSticky(offset) {
    var _this2 = this;

    var $stickyEl = this.$el;
    $stickyEl.addClass('sticky--enabled');
    $stickyEl.sticky({
      wrapperClassName: 'header-sticky-wrapper',
      zIndex: 40,
      topSpacing: offset || 0
    }).on('sticky-start', function () {
      var headerHeight;
      var announcementHeight; // Get header height is sticky enabled

      if (Shopify.theme.jsHeader.enable_sticky == true && Shopify.theme_settings.header_layout != 'vertical') {
        headerHeight = Shopify.theme.jsHeader.getHeaderHeight();
      } // Get announcement height is sticky enabled


      if (typeof Shopify.theme.jsAnnouncementBar !== 'undefined' && Shopify.theme.jsAnnouncementBar.enable_sticky == true && Shopify.theme_settings.header_layout != 'vertical') {
        announcementHeight = Shopify.theme.jsAnnouncementBar.getAnnouncementHeight();
      }

      var totalHeight = headerHeight + announcementHeight;
      $stickyEl.parent().parent().find('.search-overlay').addClass('sticky-search').css('top', totalHeight + 'px');

      if (_this2.enable_overlay === true && _this2.sectionUnderlayIsImage() === true) {
        $stickyEl.parent().addClass('has-overlaid-header');

        _this2.disableOverlayStyle();
      } else if (_this2.enable_overlay === true) {
        _this2.disableOverlayStyle();
      }
    }).on('sticky-end', function () {
      $stickyEl.parent().parent().find('.search-overlay').removeClass('sticky-search').css('top', '100%'); // Safety timeout for logo width transition which can throw calculated height off

      setTimeout(function () {
        $stickyEl.sticky('update');
      }, 250);

      _this2.$el.find('.sticky-menu-wrapper').removeClass('is-visible');

      _this2.$menuToggle.removeClass('is-active');

      if (_this2.enable_overlay === true && _this2.sectionUnderlayIsImage() === true) {
        _this2.updateOverlayStyle(_this2.sectionUnderlayIsImage());
      }
    });
  },
  disableOverlayStyle: function disableOverlayStyle() {
    $('[data-enable_overlay]').attr('data-enable_overlay', false);
  },
  enableOverlayStyle: function enableOverlayStyle() {
    $('[data-enable_overlay]').attr('data-enable_overlay', true);
  },
  updateOverlayStyle: function updateOverlayStyle(overlayBoolean) {
    $('[data-enable_overlay]').attr('data-enable_overlay', overlayBoolean);
  },
  sectionUnderlayIsImage: function sectionUnderlayIsImage() {
    var $firstSection = $('[data-check-for-order=true]').find('[id^=shopify-section]').first(); // Check whether the first element has class to indicate it should be under header when overlay is enabled

    if ($firstSection.hasClass('overlaid-header-option') && $.trim($firstSection.html()).length > 0) {
      return true;
    } else {
      return false;
    }
  },
  showSearch: function showSearch() {
    $('[data-show-search-trigger]').addClass('is-active');

    if (Shopify.theme_settings.search_layout == 'overlay') {
      $('[data-search-type="' + Shopify.theme_settings.search_layout + '"]').toggleClass('is-opened');
    } else {
      $.fancybox.open($('.js-search-popup'), {
        baseClass: 'search__lightbox',
        hash: false,
        infobar: false,
        toolbar: false,
        loop: true,
        smallBtn: true,
        mobile: {
          preventCaptionOverlap: false,
          toolbar: false
        },
        beforeClose: function beforeClose() {
          $('[data-show-search-trigger]').removeClass('is-active');
        }
      });
    }
  },
  hideSearch: function hideSearch() {
    $('[data-show-search-trigger]').removeClass('is-active');

    if (Shopify.theme_settings.search_layout == 'overlay') {
      $('[data-search-type="' + Shopify.theme_settings.search_layout + '"]').removeClass('is-opened');
    } else {
      $.fancybox.close($('[data-search-type="' + Shopify.theme_settings.search_layout + '"]'));
    }
  },
  addOffScreenDropdownCheck: function addOffScreenDropdownCheck() {
//     $('.navbar-item.has-dropdown--vertical').hover(function () {
//       var dropdown = $(this),
//           menu = dropdown.find('.navbar-dropdown');
//       menu.removeClass('navbar-dropdown--fix-offscreen');

//       if (menu.is(':off-screen')) {
//         menu.addClass('navbar-dropdown--fix-offscreen');
//       }
//     });
  },
  getHeaderHeight: function getHeaderHeight() {
    var headerHeight = $('.header-section').outerHeight() || 0;
    return headerHeight;
  },
  unload: function unload($section) {
    $('.has-overlaid-header').removeClass('has-overlaid-header');
    $('.search-overlay__close, [data-show-search-trigger]').off();
    $('.navbar-item').off();
    $('#header').off();
    this.$menuToggle.off();
    this.disableSticky();
    this.disableOverlayStyle();
  }
};