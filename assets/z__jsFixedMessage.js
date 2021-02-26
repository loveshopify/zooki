"use strict";

Shopify.theme.jsFixedMessage = {
  init: function init($section) {
    var _this = this;

    this.$el = $('.fixed-message-section');
    var fixedMessageCookie = Cookies.get('fixed-message');

    if (fixedMessageCookie !== 'dismiss') {
      this.$el.removeClass('is-hidden'); // Attach event to hide fixed message if button is clicked

      $('.js-close-fixed-message').on('click', function () {
        _this.hide();
      });
    }
  },
  hide: function hide() {
    this.$el.addClass('is-hidden'); // Remove fixed message and set cookie to hide it for 30 days

    Cookies.set('fixed-message', 'dismiss', {
      expires: 30
    });
  },
  unload: function unload($section) {
    // Clear event listeners in theme editor
    $('.js-close-fixed-message').off();
  }
};