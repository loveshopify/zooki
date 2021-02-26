"use strict";

Shopify.theme.jsRecommendedProducts = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsRecommendedProducts = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    var $productRecommendations = $section.find('.product-recommendations');
    var $productRecommendationsContainer = $('[data-product-recommendations-container]');
    var $productRecommendationsBlock = $productRecommendationsContainer.closest('.block__recommended-products'); // Hides product recommendations based on settings

    if (this.show_product_recommendations === false) {
      $productRecommendationsBlock.hide();
      return;
    }

    $('.recommended-products-section').show();
    $productRecommendationsBlock.show();
    var productId = $productRecommendations[0].dataset.productId;
    var limit = $productRecommendations[0].dataset.limit;
    var sectionEnabled = $productRecommendations[0].dataset.enabled; // If showing custom collection we do not want to build request url

    if (this.show_custom_collection) {
      this.showCustomCollection($section);
      return;
    } // Build request URL


    var requestUrl = "/recommendations/products?section_id=product__recommendations&limit=" + limit + "&product_id=" + productId; // Create request and submit it using Ajax

    var request = new XMLHttpRequest();
    request.open("GET", requestUrl);

    request.onload = function () {
      if (request.status >= 200 && request.status < 300) {
        if (!sectionEnabled) {
          $productRecommendationsContainer.empty();
          return;
        }

        var $recommendedProductsElement = $(request.response).find('.product-recommendations').html();
        $productRecommendationsContainer.html($recommendedProductsElement);
        $('.recommended-products-section').hide();
        Shopify.theme.jsProduct.relatedProducts();
        var $product = $productRecommendationsContainer.find('.thumbnail');

        if ($product.length === 0) {
          $productRecommendationsBlock.hide();
        }

        if (Currency.show_multiple_currencies) {
          convertCurrencies();
        }
      }
    };

    request.send();
  },
  showCustomCollection: function showCustomCollection($section) {
    var $recommendedProductsElement = $section.find('.product-recommendations').html();
    var $productRecommendationsContainer = $('[data-product-recommendations-container]');
    $productRecommendationsContainer.html($recommendedProductsElement);
    $('.recommended-products-section').hide();
    Shopify.theme.jsProduct.relatedProducts();
  },
  unload: function unload($section) {}
};