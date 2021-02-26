"use strict";

Shopify.theme.jsCustomContactForm = {
  init: function init() {
    // Selectors
    var $contactForm = $('.contact-form__form'); // Contact form checkbox validation

    if ($('[data-is-required]').length) {
      var $checkboxGroup = $('.contact-form__list .checkbox');
      $checkboxGroup.prop('required', true);
      $('.contact-form__list .checkbox').on('change', function () {
        $checkboxGroup.prop('required', true);

        if ($checkboxGroup.is(":checked")) {
          $checkboxGroup.prop('required', false);
        }
      });
    }

    $contactForm.on('submit', function (e) {
      var $form = $(this);
      var $formBlocks = $('.contact-form__blocks [data-checkbox-required]', $form);
      var $errorMessage = Shopify.translation.contact_form_checkbox_error;
      var $errorMessageContainer = $('.form__error', $form);
      var completeForm = true;

      for (var i = 0; i < $formBlocks.length; i++) {
        var $checkbox = $('input[type=checkbox]:checked', $formBlocks[i]);

        if ($checkbox.length) {
          completeForm = true;
        } else {
          $errorMessageContainer.html($errorMessage);
          completeForm = false;
        }
      }

      if (completeForm) {
        return;
      } else {
        event.preventDefault();
      }
    });
  },
  unload: function unload() {
    var $contactForm = $('.contact-form__form');
    var $submitButton = $contactForm.find(':submit');
    $submitButton.off();
  }
};