"use strict";

Shopify.theme.jsPopup = {
  init: function init($section) {
    var _this = this;

    // Add settings from schema to current object
    Shopify.theme.jsPopup = $.extend(this, Shopify.theme.getSectionData($section));
    var cookieValue = Cookies.get('popup');
    var cookieEnabled = this.popup_days_to_hide != 0 ? true : false;

    if (cookieEnabled && cookieValue == 'opened') {
      return false;
    } else {
      setTimeout(function () {
        _this.open();
      }, this.popup_delay * 1000);
    }

    if (cookieEnabled) {
      Cookies.set('popup', 'opened', {
        expires: parseInt(this.popup_days_to_hide)
      });
    }
  },
  open: function open() {
    var _this2 = this;

    $.fancybox.open({
      src: '[data-popup]',
      type: 'inline',
      opts: {
        baseClass: 'popup-modal',
        hash: false,
        infobar: false,
        toolbar: false,
        smallBtn: false,
        touch: {
          vertical: false,
          momentum: false
        },
        beforeShow: function beforeShow() {
          // Remove previous slides (fix for theme editor)
          $('.popup-modal .fancybox-slide').empty();
        },
        afterShow: function afterShow() {
          // After content is loaded, attach event listener for custom close icon
          $(document).on('click', '.popup__close', function () {
            _this2.close();
          });
        },
        beforeClose: function beforeClose() {
          // Prevent duplicate triggers for close icon click
          $('.popup__close').off();
        }
      }
    });
  },
  close: function close() {
    $.fancybox.close($('[data-popup]'));
  },
  showThemeEditorState: function showThemeEditorState() {
    $('.popup-section').addClass('is-fixed-top'); // Prevent scroll to bottom

    this.open();
  },
  hideThemeEditorState: function hideThemeEditorState() {
    $('.popup-section').removeClass('is-fixed-top');
    this.close();
  },
  unload: function unload($section) {
    $.fancybox.destroy();
    $('.popup-modal .fancybox-slide').empty();
    $('.popup__close').off();
  }
};