"use strict";

var moneyFormats = {
  USD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} USD'
  },
  EUR: {
    'money_format': '&euro;{{amount}}',
    'money_with_currency_format': '&euro;{{amount}} EUR'
  },
  GBP: {
    'money_format': '&pound;{{amount}}',
    'money_with_currency_format': '&pound;{{amount}} GBP'
  },
  CAD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} CAD'
  },
  ALL: {
    'money_format': 'Lek {{amount}}',
    'money_with_currency_format': 'Lek {{amount}} ALL'
  },
  DZD: {
    'money_format': 'DA {{amount}}',
    'money_with_currency_format': 'DA {{amount}} DZD'
  },
  AOA: {
    'money_format': 'Kz{{amount}}',
    'money_with_currency_format': 'Kz{{amount}} AOA'
  },
  ARS: {
    'money_format': '${{amount_with_comma_separator}}',
    'money_with_currency_format': '${{amount_with_comma_separator}} ARS'
  },
  AMD: {
    'money_format': '{{amount}} AMD',
    'money_with_currency_format': '{{amount}} AMD'
  },
  AWG: {
    'money_format': 'Afl{{amount}}',
    'money_with_currency_format': 'Afl{{amount}} AWG'
  },
  AUD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} AUD'
  },
  BBD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} Bds'
  },
  AZN: {
    'money_format': 'm.{{amount}}',
    'money_with_currency_format': 'm.{{amount}} AZN'
  },
  BDT: {
    'money_format': 'Tk {{amount}}',
    'money_with_currency_format': 'Tk {{amount}} BDT'
  },
  BSD: {
    'money_format': 'BS${{amount}}',
    'money_with_currency_format': 'BS${{amount}} BSD'
  },
  BHD: {
    'money_format': '{{amount}}0 BD',
    'money_with_currency_format': '{{amount}}0 BHD'
  },
  BYR: {
    'money_format': 'Br {{amount}}',
    'money_with_currency_format': 'Br {{amount}} BYR'
  },
  BZD: {
    'money_format': 'BZ${{amount}}',
    'money_with_currency_format': 'BZ${{amount}} BZD'
  },
  BTN: {
    'money_format': 'Nu {{amount}}',
    'money_with_currency_format': 'Nu {{amount}} BTN'
  },
  BAM: {
    'money_format': 'KM {{amount_with_comma_separator}}',
    'money_with_currency_format': 'KM {{amount_with_comma_separator}} BAM'
  },
  BRL: {
    'money_format': 'R$ {{amount_with_comma_separator}}',
    'money_with_currency_format': 'R$ {{amount_with_comma_separator}} BRL'
  },
  BOB: {
    'money_format': 'Bs{{amount_with_comma_separator}}',
    'money_with_currency_format': 'Bs{{amount_with_comma_separator}} BOB'
  },
  BWP: {
    'money_format': 'P{{amount}}',
    'money_with_currency_format': 'P{{amount}} BWP'
  },
  BND: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} BND'
  },
  BGN: {
    'money_format': '{{amount}} лв',
    'money_with_currency_format': '{{amount}} лв BGN'
  },
  MMK: {
    'money_format': 'K{{amount}}',
    'money_with_currency_format': 'K{{amount}} MMK'
  },
  KHR: {
    'money_format': 'KHR{{amount}}',
    'money_with_currency_format': 'KHR{{amount}}'
  },
  KYD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} KYD'
  },
  XAF: {
    'money_format': 'FCFA{{amount}}',
    'money_with_currency_format': 'FCFA{{amount}} XAF'
  },
  CLP: {
    'money_format': '${{amount_no_decimals}}',
    'money_with_currency_format': '${{amount_no_decimals}} CLP'
  },
  CNY: {
    'money_format': '&#165;{{amount}}',
    'money_with_currency_format': '&#165;{{amount}} CNY'
  },
  COP: {
    'money_format': '${{amount_with_comma_separator}}',
    'money_with_currency_format': '${{amount_with_comma_separator}} COP'
  },
  CRC: {
    'money_format': '&#8353; {{amount_with_comma_separator}}',
    'money_with_currency_format': '&#8353; {{amount_with_comma_separator}} CRC'
  },
  HRK: {
    'money_format': '{{amount_with_comma_separator}} kn',
    'money_with_currency_format': '{{amount_with_comma_separator}} kn HRK'
  },
  CZK: {
    'money_format': '{{amount_with_comma_separator}} K&#269;',
    'money_with_currency_format': '{{amount_with_comma_separator}} K&#269;'
  },
  DKK: {
    'money_format': '{{amount_with_comma_separator}}',
    'money_with_currency_format': 'kr.{{amount_with_comma_separator}}'
  },
  DOP: {
    'money_format': 'RD$ {{amount}}',
    'money_with_currency_format': 'RD$ {{amount}}'
  },
  XCD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': 'EC${{amount}}'
  },
  EGP: {
    'money_format': 'LE {{amount}}',
    'money_with_currency_format': 'LE {{amount}} EGP'
  },
  ETB: {
    'money_format': 'Br{{amount}}',
    'money_with_currency_format': 'Br{{amount}} ETB'
  },
  XPF: {
    'money_format': '{{amount_no_decimals_with_comma_separator}} XPF',
    'money_with_currency_format': '{{amount_no_decimals_with_comma_separator}} XPF'
  },
  FJD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': 'FJ${{amount}}'
  },
  GMD: {
    'money_format': 'D {{amount}}',
    'money_with_currency_format': 'D {{amount}} GMD'
  },
  GHS: {
    'money_format': 'GH&#8373;{{amount}}',
    'money_with_currency_format': 'GH&#8373;{{amount}}'
  },
  GTQ: {
    'money_format': 'Q{{amount}}',
    'money_with_currency_format': '{{amount}} GTQ'
  },
  GYD: {
    'money_format': 'G${{amount}}',
    'money_with_currency_format': '${{amount}} GYD'
  },
  GEL: {
    'money_format': '{{amount}} GEL',
    'money_with_currency_format': '{{amount}} GEL'
  },
  HNL: {
    'money_format': 'L {{amount}}',
    'money_with_currency_format': 'L {{amount}} HNL'
  },
  HKD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': 'HK${{amount}}'
  },
  HUF: {
    'money_format': '{{amount_no_decimals_with_comma_separator}}',
    'money_with_currency_format': '{{amount_no_decimals_with_comma_separator}} Ft'
  },
  ISK: {
    'money_format': '{{amount_no_decimals}} kr',
    'money_with_currency_format': '{{amount_no_decimals}} kr ISK'
  },
  INR: {
    'money_format': 'Rs. {{amount}}',
    'money_with_currency_format': 'Rs. {{amount}}'
  },
  IDR: {
    'money_format': '{{amount_with_comma_separator}}',
    'money_with_currency_format': 'Rp {{amount_with_comma_separator}}'
  },
  ILS: {
    'money_format': '{{amount}} NIS',
    'money_with_currency_format': '{{amount}} NIS'
  },
  JMD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} JMD'
  },
  JPY: {
    'money_format': '&#165;{{amount_no_decimals}}',
    'money_with_currency_format': '&#165;{{amount_no_decimals}} JPY'
  },
  JEP: {
    'money_format': '&pound;{{amount}}',
    'money_with_currency_format': '&pound;{{amount}} JEP'
  },
  JOD: {
    'money_format': '{{amount}}0 JD',
    'money_with_currency_format': '{{amount}}0 JOD'
  },
  KZT: {
    'money_format': '{{amount}} KZT',
    'money_with_currency_format': '{{amount}} KZT'
  },
  KES: {
    'money_format': 'KSh{{amount}}',
    'money_with_currency_format': 'KSh{{amount}}'
  },
  KWD: {
    'money_format': '{{amount}}0 KD',
    'money_with_currency_format': '{{amount}}0 KWD'
  },
  KGS: {
    'money_format': 'лв{{amount}}',
    'money_with_currency_format': 'лв{{amount}}'
  },
  LVL: {
    'money_format': 'Ls {{amount}}',
    'money_with_currency_format': 'Ls {{amount}} LVL'
  },
  LBP: {
    'money_format': 'L&pound;{{amount}}',
    'money_with_currency_format': 'L&pound;{{amount}} LBP'
  },
  LTL: {
    'money_format': '{{amount}} Lt',
    'money_with_currency_format': '{{amount}} Lt'
  },
  MGA: {
    'money_format': 'Ar {{amount}}',
    'money_with_currency_format': 'Ar {{amount}} MGA'
  },
  MKD: {
    'money_format': 'ден {{amount}}',
    'money_with_currency_format': 'ден {{amount}} MKD'
  },
  MOP: {
    'money_format': 'MOP${{amount}}',
    'money_with_currency_format': 'MOP${{amount}}'
  },
  MVR: {
    'money_format': 'Rf{{amount}}',
    'money_with_currency_format': 'Rf{{amount}} MRf'
  },
  MXN: {
    'money_format': '$ {{amount}}',
    'money_with_currency_format': '$ {{amount}} MXN'
  },
  MYR: {
    'money_format': 'RM{{amount}} MYR',
    'money_with_currency_format': 'RM{{amount}} MYR'
  },
  MUR: {
    'money_format': 'Rs {{amount}}',
    'money_with_currency_format': 'Rs {{amount}} MUR'
  },
  MDL: {
    'money_format': '{{amount}} MDL',
    'money_with_currency_format': '{{amount}} MDL'
  },
  MAD: {
    'money_format': '{{amount}} dh',
    'money_with_currency_format': 'Dh {{amount}} MAD'
  },
  MNT: {
    'money_format': '{{amount_no_decimals}} &#8366',
    'money_with_currency_format': '{{amount_no_decimals}} MNT'
  },
  MZN: {
    'money_format': '{{amount}} Mt',
    'money_with_currency_format': 'Mt {{amount}} MZN'
  },
  NAD: {
    'money_format': 'N${{amount}}',
    'money_with_currency_format': 'N${{amount}} NAD'
  },
  NPR: {
    'money_format': 'Rs{{amount}}',
    'money_with_currency_format': 'Rs{{amount}} NPR'
  },
  ANG: {
    'money_format': '&fnof;{{amount}}',
    'money_with_currency_format': '{{amount}} NA&fnof;'
  },
  NZD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} NZD'
  },
  NIO: {
    'money_format': 'C${{amount}}',
    'money_with_currency_format': 'C${{amount}} NIO'
  },
  NGN: {
    'money_format': '&#8358;{{amount}}',
    'money_with_currency_format': '&#8358;{{amount}} NGN'
  },
  NOK: {
    'money_format': 'kr {{amount_with_comma_separator}}',
    'money_with_currency_format': 'kr {{amount_with_comma_separator}} NOK'
  },
  OMR: {
    'money_format': '{{amount_with_comma_separator}} OMR',
    'money_with_currency_format': '{{amount_with_comma_separator}} OMR'
  },
  PKR: {
    'money_format': 'Rs.{{amount}}',
    'money_with_currency_format': 'Rs.{{amount}} PKR'
  },
  PGK: {
    'money_format': 'K {{amount}}',
    'money_with_currency_format': 'K {{amount}} PGK'
  },
  PYG: {
    'money_format': 'Gs. {{amount_no_decimals_with_comma_separator}}',
    'money_with_currency_format': 'Gs. {{amount_no_decimals_with_comma_separator}} PYG'
  },
  PEN: {
    'money_format': 'S/. {{amount}}',
    'money_with_currency_format': 'S/. {{amount}} PEN'
  },
  PHP: {
    'money_format': '&#8369;{{amount}}',
    'money_with_currency_format': '&#8369;{{amount}} PHP'
  },
  PLN: {
    'money_format': '{{amount_with_comma_separator}} zl',
    'money_with_currency_format': '{{amount_with_comma_separator}} zl PLN'
  },
  QAR: {
    'money_format': 'QAR {{amount_with_comma_separator}}',
    'money_with_currency_format': 'QAR {{amount_with_comma_separator}}'
  },
  RON: {
    'money_format': '{{amount_with_comma_separator}} lei',
    'money_with_currency_format': '{{amount_with_comma_separator}} lei RON'
  },
  RUB: {
    'money_format': '&#1088;&#1091;&#1073;{{amount_with_comma_separator}}',
    'money_with_currency_format': '&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB'
  },
  RWF: {
    'money_format': '{{amount_no_decimals}} RF',
    'money_with_currency_format': '{{amount_no_decimals}} RWF'
  },
  WST: {
    'money_format': 'WS$ {{amount}}',
    'money_with_currency_format': 'WS$ {{amount}} WST'
  },
  SAR: {
    'money_format': '{{amount}} SR',
    'money_with_currency_format': '{{amount}} SAR'
  },
  STD: {
    'money_format': 'Db {{amount}}',
    'money_with_currency_format': 'Db {{amount}} STD'
  },
  RSD: {
    'money_format': '{{amount}} RSD',
    'money_with_currency_format': '{{amount}} RSD'
  },
  SCR: {
    'money_format': 'Rs {{amount}}',
    'money_with_currency_format': 'Rs {{amount}} SCR'
  },
  SGD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} SGD'
  },
  SYP: {
    'money_format': 'S&pound;{{amount}}',
    'money_with_currency_format': 'S&pound;{{amount}} SYP'
  },
  ZAR: {
    'money_format': 'R {{amount}}',
    'money_with_currency_format': 'R {{amount}} ZAR'
  },
  KRW: {
    'money_format': '&#8361;{{amount_no_decimals}}',
    'money_with_currency_format': '&#8361;{{amount_no_decimals}} KRW'
  },
  LKR: {
    'money_format': 'Rs {{amount}}',
    'money_with_currency_format': 'Rs {{amount}} LKR'
  },
  SEK: {
    'money_format': '{{amount_no_decimals}} kr',
    'money_with_currency_format': '{{amount_no_decimals}} kr SEK'
  },
  CHF: {
    'money_format': 'SFr. {{amount}}',
    'money_with_currency_format': 'SFr. {{amount}} CHF'
  },
  TWD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} TWD'
  },
  THB: {
    'money_format': '{{amount}} &#xe3f;',
    'money_with_currency_format': '{{amount}} &#xe3f; THB'
  },
  TZS: {
    'money_format': '{{amount}} TZS',
    'money_with_currency_format': '{{amount}} TZS'
  },
  TTD: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}} TTD'
  },
  TND: {
    'money_format': '{{amount}}',
    'money_with_currency_format': '{{amount}} DT'
  },
  TRY: {
    'money_format': '{{amount}}TL',
    'money_with_currency_format': '{{amount}}TL'
  },
  UGX: {
    'money_format': 'Ush {{amount_no_decimals}}',
    'money_with_currency_format': 'Ush {{amount_no_decimals}} UGX'
  },
  UAH: {
    'money_format': '₴{{amount}}',
    'money_with_currency_format': '₴{{amount}} UAH'
  },
  AED: {
    'money_format': 'Dhs. {{amount}}',
    'money_with_currency_format': 'Dhs. {{amount}} AED'
  },
  UYU: {
    'money_format': '${{amount_with_comma_separator}}',
    'money_with_currency_format': '${{amount_with_comma_separator}} UYU'
  },
  VUV: {
    'money_format': '${{amount}}',
    'money_with_currency_format': '${{amount}}VT'
  },
  VEF: {
    'money_format': 'Bs. {{amount_with_comma_separator}}',
    'money_with_currency_format': 'Bs. {{amount_with_comma_separator}} VEF'
  },
  VND: {
    'money_format': '{{amount_no_decimals_with_comma_separator}}&#8363;',
    'money_with_currency_format': '{{amount_no_decimals_with_comma_separator}} VND'
  },
  XBT: {
    'money_format': '{{amount_no_decimals}} BTC',
    'money_with_currency_format': '{{amount_no_decimals}} BTC'
  },
  XOF: {
    'money_format': 'CFA{{amount}}',
    'money_with_currency_format': 'CFA{{amount}} XOF'
  },
  ZMW: {
    'money_format': 'K{{amount_no_decimals_with_comma_separator}}',
    'money_with_currency_format': 'ZMW{{amount_no_decimals_with_comma_separator}}'
  }
};
/**
 * Format a number to a specific format
 *
 * @param {Number} number - Value to format
 * @param {Number} precision - Amount of decimal points to show
 * @param {String} thousands - Thousands delimiter
 * @param {String} decimal - Decimal delimiter
 * @returns {String|Number}
 */

function formatWithDelimiters(number) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var thousands = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
  var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';

  if (isNaN(number) || !number) {
    return 0;
  }

  var preciseNumber = (number / 100.0).toFixed(precision);
  var parts = preciseNumber.split(thousands);
  var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1".concat(thousands));
  var centsAmount = parts[1] ? decimal + parts[1] : '';
  return dollarsAmount + centsAmount;
}
/**
 * Convert a money value in cents to a formatted currency string
 *
 * @param {Number|String} cents
 * @param {String} format
 * @returns {String}
 */


function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  } //special for JPY to account for no decimals used in currency


  if (format.indexOf('&#165') != -1 && Currency.native_multi_currency) {
    cents = cents * 100;
  }

  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;

  switch (format.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2, ',', '.');
      break;

    case 'amount_with_space_separator':
      value = formatWithDelimiters(cents, 2, ' ', '.');
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;

    case 'amount_with_apostrophe_separator':
      value = formatWithDelimiters(cents, 2, '\'', '.');
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0, ',', '.');
      break;

    case 'amount_no_decimals_with_space_separator':
      value = formatWithDelimiters(cents, 0, ' ', '.');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, ',', '.');
      break;
  }

  return format.replace(placeholderRegex, value);
}
/**
 * Return the value of money in cents value
 *
 * @param {Number} moneyAmount - Money value of a price
 *                 eg: 1000
 * @param {String} format - Shop formatting of a price
 *                 eg: {{amount}}
 * @param {String} currency - Currency of a price
 *                 eg: 'CAD'
 * @returns {Number}
 * @private
 */


function getCentsValue(moneyAmount, format, currency) {
  var cents = 0; // Convert prices from float values to integers if needed, then convert

  if (format.indexOf('amount_no_decimals') !== -1) {
    cents = moneyAmount * 100;
  } else if (currency === 'JOD' || currency === 'KWD' || currency === 'BHD') {
    cents = moneyAmount / 10;
  } else {
    cents = moneyAmount;
  }

  return cents;
}
/**
 * Converts formatted money to a number
 *
 * @param {Element} priceEl
 * @returns {Number|String}
 */


function getMoneyValue(priceEl) {
  var price = priceEl.getAttribute('data-currency-original') || priceEl.textContent;
  var value = parseInt(price.replace(/[^0-9]/g, ''), 10);
  return !isNaN(value) ? value : '';
}

Shopify.theme.currencyConverter = {
  init: function init(settings) {
    this.defaults = {
      switcherSelector: '[data-currency-converter]',
      priceSelector: 'span.money',
      shopCurrency: Currency.shop_currency,
      defaultCurrency: Currency.default_currency,
      displayFormat: Currency.display_format,
      moneyFormat: Currency.money_format,
      moneyFormatNoCurrency: Currency.money_format_no_currency,
      moneyFormatCurrency: Currency.money_format_currency
    };
    this.options = this.defaults;
    this.moneyFormats = moneyFormats;
    this.storage = 'currency';
    this.currentCurrency = null;
    this.isInitialised = false;
    if (!window.Currency || this.isInitialised) return;
    $(this.options.switcherSelector).on('change', function () {
      var $currencySelector = $(this);
      Shopify.theme.currencyConverter.setCurrency($currencySelector.val());
    });
    this.currentCurrency = this._getStoredCurrency() || this.options.defaultCurrency; //gets negated with shopify multiple currency

    if (Currency.native_multi_currency == false) {
      this.moneyFormats[this.options.shopCurrency].money_with_currency_format = this.options.moneyFormatCurrency;
    }

    this.moneyFormats[this.options.shopCurrency].money_format = this.options.moneyFormatNoCurrency;
    this.isInitialised = true;

    this._current();
  },
  setCurrency: function setCurrency(newCurrency) {
    /**
    * Change the currency to a new currency using an ISO currency code
    *
    * @param {String} newCurrency - New currency to convert prices to
    */
    if (!this.isInitialised) return;

    this._convertAll(newCurrency);
  },
  update: function update(priceEl) {
    /**
    * Update a price on the page from shop currency to the active currency, and formatting
    *
    * @param priceEl {HTMLElement} - element containing price text, in the shop currency
    */
    if (!this.isInitialised) return; // unset any stored previous conversions and the data-currency attribute itself

    var attributes = priceEl.attributes;

    for (var attr = 0; attr < attributes.length; attr++) {
      var attribute = attributes[attr];

      if (attribute.name.indexOf('data-currency') === 0) {
        priceEl.setAttribute(attribute.name, '');
      }
    }

    this._convertEl(priceEl, this.currentCurrency);
  },
  _getStoredCurrency: function _getStoredCurrency() {
    /**
    * Return the stored currency from the client's browser
    * @returns {String}
    * @private
    */
    try {
      return localStorage.getItem(this.storage);
    } catch (error) {
      console.warn(error);
      return this.options.defaultCurrency;
    }
  },
  _setStoredCurrency: function _setStoredCurrency(currency) {
    /**
    * Save the client's currency in localstorage for persistence across pages
    * and sessions
    * @param {String} currency
    * @private
    */
    try {
      localStorage.setItem(this.storage, currency);
    } catch (error) {
      console.warn(error);
    }
  },
  _current: function _current() {
    /**
    * Update the currency switcher to the current currency
    * @private
    */
    var switchers = document.querySelectorAll(this.options.switcherSelector);

    for (var i = 0; i < switchers.length; i += 1) {
      var switcher = switchers[i];
      var childrenEls = switcher.querySelectorAll('option');

      for (var j = 0; j < childrenEls.length; j += 1) {
        var optionEl = childrenEls[j];

        if (optionEl.selected && optionEl.value !== this.currentCurrency) {
          optionEl.selected = false;
        }

        if (optionEl.value === this.currentCurrency) {
          optionEl.selected = true;
        }
      }
    }

    this._convertAll(this.currentCurrency);
  },
  _convertEl: function _convertEl(priceEl, newCurrency, shippingCalculatorEnabled) {
    /**
    * Converts an individual price to the new format
    *
    * @param {Element} priceEl - Node element containing price
    * @param {String} oldCurrency - Currency of element converting from
    * @param {String} newCurrency - Currency to convert to
    * @private
    */
    var oldCurrency = this.options.shopCurrency; // If the amount has already been converted, we leave it alone.

    if (priceEl.getAttribute('data-currency') === newCurrency) {
      return;
    } // If we are converting to a currency that we have saved, we will use the saved amount.


    if (priceEl.getAttribute("data-currency-".concat(newCurrency))) {
      priceEl.innerHTML = priceEl.getAttribute("data-currency-".concat(newCurrency));
    } else {
      var oldFormat = this.moneyFormats[oldCurrency][this.options.displayFormat];

      if (shippingCalculatorEnabled !== undefined && shippingCalculatorEnabled == true) {
        var newFormat = this.moneyFormats[newCurrency]["money_format"];
      } else {
        var newFormat = this.moneyFormats[newCurrency][this.options.displayFormat];
      }

      var moneyValue = getMoneyValue(priceEl);
      var centsValue = getCentsValue(moneyValue, oldFormat, oldCurrency); // Cents value is empty, but not 0. 0$ is a valid price, while empty is not

      if (centsValue === '') return;
      var cents = window.Currency.convert(centsValue, oldCurrency, newCurrency);
      var oldPriceFormatted = formatMoney(centsValue, oldFormat);
      var priceFormatted = formatMoney(cents, newFormat);

      if (!priceEl.getAttribute('data-currency-original')) {
        priceEl.setAttribute('data-currency-original', oldPriceFormatted);
      }

      priceEl.setAttribute("data-currency-".concat(oldCurrency), oldPriceFormatted);
      priceEl.setAttribute("data-currency-".concat(newCurrency), priceFormatted);
      priceEl.innerHTML = priceFormatted;
    }

    priceEl.setAttribute('data-currency', newCurrency);
  },
  _convertAll: function _convertAll(newCurrency) {
    /**
    * Convert all prices on the page to the new currency
    *
    * @param {String} oldCurrency - Currency of element converting from
    * @param {String} newCurrency - Currency to convert to
    * @private
    */
    var priceEls = document.querySelectorAll(this.options.priceSelector); // if multi currency enabled, use filter method to exclude shipping calculator prices from being converted. They have their own function convertShippingCalculatorResult() below

    if (Currency.native_multi_currency == true && Shopify.currency.active !== Currency.shop_currency) {
      priceEls = $(priceEls).filter(function (index, priceEl) {
        return $(priceEl).parents('[data-cart-shipping-response-container]').length === 0;
      });
    }

    if (!priceEls) return;
    this.currentCurrency = newCurrency;

    this._setStoredCurrency(newCurrency); // only if Shopify multi currency is disabled, run convertEl function


    if (Currency.native_multi_currency != true && Shopify.currency.active === Currency.shop_currency) {
      for (var i = 0; i < priceEls.length; i += 1) {
        this._convertEl(priceEls[i], newCurrency);
      }
    }
  }
};

function convertCurrencies() {
  var $currencySelector = $("[data-currency-converter]");

  if ($currencySelector.val()) {
    Shopify.theme.currencyConverter.setCurrency($currencySelector.val());
  }
}

function convertShippingCalculatorResult(currency) {
  var shipEls = $('#shipping-calculator span.money');
  var shippingCalculatorEnabled = true;
  if (!shipEls) return;

  for (var i = 0; i < shipEls.length; i += 1) {
    Shopify.theme.currencyConverter._convertEl(shipEls[i], currency, shippingCalculatorEnabled);
  }
}