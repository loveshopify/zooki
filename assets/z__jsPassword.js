"use strict";

Shopify.theme.jsPassword = {
  init: function init() {
    $('#open-me').on('click', function () {
      $('.overlay').addClass('overlay-open');
      $('#password-container').addClass('modal--open');
    });
    $('#close-me').on('click', function () {
      $('.overlay').removeClass('overlay-open');
      $('#password-container').removeClass('modal--open');
    });
  },
  unload: function unload($target) {
    $('#open-me').off('click');
    $('#close-me').off('click');
  }
};