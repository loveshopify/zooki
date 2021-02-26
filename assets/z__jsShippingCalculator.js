"use strict";

Shopify.theme.jsShippingCalculator = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsShippingCalculator = $.extend(this, Shopify.theme.getSectionData($section));

    if (Shopify.theme_settings.shipping_calculator_enabled) {
      ShippingCalculator.init($('[data-cart-shipping]'));
    }
  },
  unload: function unload($section) {}
};
var ShippingCalculator = {
  visibleClass: 'shipping_calculator__response--visible',
  $shippingButton: $('.get-rates'),
  countrySelector: $('#address_country')[0],
  provinceSelector: $('#address_province')[0],
  zipSelector: $('#address_zip')[0],
  $shippingResponseContainer: $('[data-cart-shipping-response-container]'),
  $shippingResponse: $('[data-cart-shipping-response]'),
  $shippingResponseMessage: $('[data-cart-shipping-message]'),
  $shippingResponseRates: $('[data-cart-shipping-rates]'),
  init: function init() {
    var _this = this;

    $.extend(this, Shopify.theme.jsShippingCalculator);
    var countryProvinceSelector = new window.Shopify.theme.addresses.CountryProvinceSelector(Window.theme.allCountryOptionTags);
    var $provinceWrapper = $('#address_province_container');
    countryProvinceSelector.build(this.countrySelector, this.provinceSelector, {
      onCountryChange: function onCountryChange(provinces) {
        if (provinces.length) {
          $provinceWrapper.show();
        } else {
          $provinceWrapper.hide();
        }
      }
    });
    this.$shippingButton.on('click', function (event) {
      event.preventDefault();

      _this.onSubmit();
    });
  },
  renderResponse: function renderResponse(response, shippingAddress) {
    var address = this.formatAddress(shippingAddress); // Hide the response so that it can be populated smoothly

    this.hideShippingResponse(); // Empty out contents

    this.$shippingResponseMessage.empty();
    this.$shippingResponseRates.empty();
    var responseText = '';

    if (response.length > 1) {
      var firstRate = this.formatRate(response[0].price);
      responseText = this.shipping.multiple_rates.replace('*address*', address).replace('*number_of_rates*', response.length).replace('*rate*', "<span class='money'>".concat(firstRate, "</span>"));
    } else if (response.length === 1) {
      responseText = this.shipping.one_rate.replace('*address*', address);
    } else {
      responseText = this.shipping.no_rates;
    }

    this.$shippingResponseMessage.html(responseText);

    for (var i = 0; i < response.length; i++) {
      var rate = response[i];
      var price = this.formatRate(rate.price);
      var rateValue = this.shipping.rate_value.replace('*rate_title*', rate.name).replace('*rate*', "&nbsp;<span class='money'>".concat(price, "</span>"));

      if (Shopify.theme_settings.icon_style === 'icon_solid') {
        this.$shippingResponseRates.append("<li>\n            <span class=\"icon\" data-icon=\"box\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">\n                <g id=\"box\">\n                  <polygon points=\"47.5 46.89 47.5 91.72 7.5 74.07 7.5 29.23 47.5 46.89\"></polygon>\n                  <path d=\"M92.5,29.23V74.07L75.84,81.42V71.73a2.5,2.5,0,1,0-5,0v11.9L52.5,91.72V46.89l18.34-8.1V47.9a2.5,2.5,0,1,0,5,0V36.59Z\"></path>\n                  <polygon points=\"67.2 34.93 50 42.52 11.19 25.4 28.89 17.59 67.2 34.93\"></polygon>\n                  <polygon points=\"88.81 25.4 73.35 32.23 35.05 14.88 50 8.28 88.81 25.4\"></polygon>\n                </g>\n              </svg>\n            </span>\n            ".concat(rateValue, "\n            </li>"));
      } else {
        this.$shippingResponseRates.append("<li>\n              <span class=\"icon\" data-icon=\"box\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">\n                  <g id=\"box\">\n                    <path d=\"M96.92,24.34l0-.13a2.22,2.22,0,0,0-.2-.41l0-.05a3,3,0,0,0-.33-.38l-.1-.07a1.91,1.91,0,0,0-.41-.26s0,0,0,0h0l-45-19.84a2,2,0,0,0-1.62,0L28.52,12.29a2,2,0,0,0-.93.41L4.19,23c-.07,0-.13.08-.19.11l-.09.05,0,0a2.45,2.45,0,0,0-.35.29l0,.05a2.35,2.35,0,0,0-.23.32L3.21,24a1.88,1.88,0,0,0-.12.3,1,1,0,0,1,0,.14,2.33,2.33,0,0,0,0,.38s0,0,0,.05v0H3V75.15A2,2,0,0,0,4.19,77l45,19.85.17,0,.14.05A2.07,2.07,0,0,0,50,97h0a2.24,2.24,0,0,0,.51-.07l.13-.05.17,0L95.81,77A2,2,0,0,0,97,75.15V24.85A1.7,1.7,0,0,0,96.92,24.34ZM50,7.19,90,24.85,73.35,32.22,33.81,14.33Zm0,35.33L10,24.85l19-8.36,39.54,17.9ZM7,27.92,48,46V91.93L7,73.84ZM75.34,81.64V71.18a2,2,0,0,0-4,0V83.4L52,91.93V46l19.34-8.53v9.87a2,2,0,0,0,4,0V35.71L93,27.92V73.84Z\"></path>\n                  </g>\n                </svg>\n              </span>\n              ".concat(rateValue, "\n              </li>"));
      }
    } // if using our currency converter, convert currencies.. if using Shopify multi-currency, initialize currency converter, then convert currency


    if (Currency.native_multi_currency == true && Shopify.currency.active !== Currency.shop_currency) {
      Shopify.theme.currencyConverter.init();
      convertShippingCalculatorResult(Shopify.currency.active);
    } else if (Shopify.theme_settings.show_multiple_currencies) {
      convertCurrencies();
    } // Reset the calculating button so that it can be used again


    this.enableShippingButton(); // Show the response

    this.showShippingResponse();
  },
  onSubmit: function onSubmit() {
    this.disableShippingButton();
    var shippingAddress = {};
    shippingAddress.country = $(this.countrySelector).val() || '';
    shippingAddress.province = $(this.provinceSelector).val() || '';
    shippingAddress.zip = $(this.zipSelector).val() || ''; //Creates an ajax request which returns shipping information

    Shopify.getCartShippingRatesForDestination(shippingAddress, this.renderResponse.bind(this), this.onShopifyError.bind(this));
  },
  onShopifyError: function onShopifyError() {
    var xhr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (!xhr) {
      return;
    }

    var errors = $.parseJSON(xhr.responseText);

    if (errors.zip && errors.zip.length > 0) {
      // Hide the response so that it can be popuated smoothly
      this.hideShippingResponse(); // Empty out contents

      this.$shippingResponseMessage.empty();
      this.$shippingResponseRates.empty();

      if (errors.zip[0].indexOf('is not valid') !== -1 || errors.zip[0].indexOf("can't be blank") !== -1) {
        this.$shippingResponseMessage.html("".concat(Shopify.translation.shipping_calculator_zip_code, " ").concat(errors.zip));
      }

      this.showShippingResponse();
      this.enableShippingButton();
    }

    if (errors.country && errors.country.length > 0) {
      // Hide the response so that it can be popuated smoothly
      this.hideShippingResponse(); // Empty out contents

      this.$shippingResponseMessage.empty();
      this.$shippingResponseRates.empty();

      if (errors.country[0].indexOf('is not supported') !== -1 || errors.country[0].indexOf("can't be blank") !== -1) {
        this.$shippingResponseMessage.html("Country ".concat(errors.country));
      }

      this.showShippingResponse();
      this.enableShippingButton();
    }
  },
  enableShippingButton: function enableShippingButton() {
    this.$shippingButton.text(Shopify.translation.shipping_calculator_submit_btn).attr('disabled', false);
  },
  disableShippingButton: function disableShippingButton() {
    this.$shippingButton.text(Shopify.translation.shipping_calculator_submit_btn_disabled).attr('disabled', true);
  },
  formatRate: function formatRate(cents) {
    if (typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents, Currency.money_format);
    }
  },
  formatAddress: function formatAddress(shippingAddress) {
    var addressBase = [];

    if (shippingAddress.zip.length) {
      addressBase.push(shippingAddress.zip.trim());
    }

    if (shippingAddress.province.length) {
      addressBase.push(shippingAddress.province);
    }

    if (shippingAddress.country.length) {
      addressBase.push(shippingAddress.country);
    }

    return addressBase.join(', ');
  },
  showShippingResponse: function showShippingResponse() {
    this.$shippingResponseContainer.addClass(this.visibleClass);
  },
  hideShippingResponse: function hideShippingResponse() {
    this.$shippingResponseContainer.removeClass(this.visibleClass);
  }
};