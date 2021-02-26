"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Shopify.theme.jsCart = {
  init: function init($section) {
    // Add settings from schema to current object
    //Shopify.theme.jsCart = $.extend(this, Shopify.theme.getSectionData($section));
    this.$section = $section;
    $(document).on('click', '[data-cart-page-delete]', function (e) {
      e.preventDefault();
      var lineID = $(this).data('line-item-key');
      Shopify.theme.jsCart.removeFromCart(lineID);
      return false;
    }); // Prevent the ajax cart form from being submitted when pressing the "Enter" key

    $('#cart_form').keydown(function (e) {
      if (e.keyCode == 13) {
        e.preventDefault();
        return false;
      }
    });
  },
  removeFromCart: function removeFromCart(lineID) {
    var $cartItem = Shopify.theme.jsCart.$section.find("[data-line-item=\"".concat(lineID, "\"]"));
    $cartItem.css('opacity', '0.5');
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=0&line=' + lineID,
      dataType: 'json',
      success: function success(cart) {
        $cartItem.addClass('animated zoomOut');
        $cartItem.remove();
        Shopify.theme.jsCart.updateView(cart, lineID);

        if (typeof Shopify.theme.jsAjaxCart !== 'undefined') {
          Shopify.theme.jsAjaxCart.updateView();
        }
      },
      error: function error(XMLHttpRequest, textStatus) {
        var response = eval('(' + XMLHttpRequest.responseText + ')');
        response = response.description;
      }
    });
  },
  updateView: function updateView(cart, lineID) {
    if (cart.item_count > 0) {
      var _$$ajax;

      $.ajax((_$$ajax = {
        dataType: "json",
        async: false,
        cache: false
      }, _defineProperty(_$$ajax, "dataType", 'html'), _defineProperty(_$$ajax, "url", "/cart"), _defineProperty(_$$ajax, "success", function success(html) {
        if (lineID !== null) {
          var updatedItems = $(html).find('.cart__item-list .cart__card');
          var currentItems = $('.cart__item-list .cart__card'); // Checks if BOGO applied and there is a change in the number of line items

          if (updatedItems.length != currentItems.length) {
            var updatedCartList = $(html).find('.cart__item-list'); // Re-append cart items

            $('.cart__item-list').replaceWith(updatedCartList);
          }

          $(currentItems).each(function (index, element) {
            $(element).attr('data-line-item', index + 1);
            $(element).find('[data-line-item-key]').attr('data-line-item-key', index + 1);
          });
          var itemTotal = $(html).find("[data-line-item=\"".concat(lineID, "\"]")).find('.cart__total');
          var quantityInput = $(html).find("[data-line-item=\"".concat(lineID, "\"]")).find('.quantity-input');
          var itemPrice = $(html).find("[data-line-item=\"".concat(lineID, "\"]")).find('.cart__price');
          $("[data-line-item=\"".concat(lineID, "\"]")).find('.cart__total').replaceWith(itemTotal);
          $("[data-line-item=\"".concat(lineID, "\"]")).find('.quantity-input').replaceWith(quantityInput);
          $("[data-line-item=\"".concat(lineID, "\"]")).find('.cart__price').replaceWith(itemPrice);
        }

        var subtotal = $(html).find('.cart__subtotal-container');
        var discounts = $(html).find('.cart__discounts');
        var savings = $(html).find('.cart__total-savings');
        $('.cart__subtotal-container').replaceWith(subtotal);

        if (discounts.length > 0 && $('.cart__discounts').length < 1) {
          $('.cart__subtotal-container').before(discounts);
        } else {
          $('.cart__discounts').replaceWith(discounts);
        }

        if (savings.length > 0 && $('.cart__total-savings').length < 1) {
          $('.cart__subtotal-container').after(savings);
        } else {
          $('.cart__total-savings').replaceWith(savings);
        }

        $('[data-bind="itemCount"]').text(cart.item_count);
      }), _$$ajax));
    } else {
      $('.cart__empty-cart-message').removeClass('is-hidden');
      $('.cart__form').addClass('is-hidden');
      $('[data-ajax-cart-trigger]').removeClass('has-cart-count');
      $('[data-bind="itemCount"]').text('0');
    }

    if (Shopify.theme_settings.show_multiple_currencies) {
      convertCurrencies();
    }
    
     
  },
  unload: function unload($section) {
    // Clear event listeners in theme editor
    $('[data-cart-page-delete]').off();
    $('#cart_form').off();
  }
};