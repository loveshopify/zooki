"use strict";

Shopify.theme.jsCollection = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsCollection = $.extend(this, Shopify.theme.getSectionData($section));

    if (this.enable_sorting == true) {
      $('#sort-by').val($('#sort-by').data('default-sort'));
    }

    if (this.enable_filter == true || this.enable_sorting == true) {
      $('#tag_filter, #sort-by').on('change', function () {
        Shopify.theme.jsCollection.filterURL();
      });
    }

    if ($('[data-option-filter]').length) {
      // Show enabled filter tags based on selected checkboxes
      $('[data-tag-filter-checkbox]:checked').each(function () {
        Shopify.theme.jsCollection.multiTagFilter.showSelectedFilter($(this));
      });
    } // If breadcrumbs enabled and basic pagination is set, call breadcrumbs object


    if (this.enable_breadcrumb && this.pagination_type == 'basic_pagination') {
      Shopify.theme.breadcrumbs.init(this.number_of_pages);
    }
    /* Collection sidebar filter */


    $('body').on('click', '[data-option-filter]', function (e) {
      e.preventDefault();
      $(this).find('input').prop('checked', true);
      Shopify.theme.jsCollection.multiTagFilter.init($(this));
      Shopify.theme.scrollToTop($('.collection__content'));
    });
    $('body').on('click', '[data-clear-filter]', function () {
      var $el = $(this).siblings('[data-option-filter]');
      var $productTagFilter = $('#tag_filter');
      $productTagFilter.find('option:eq(0)').prop('selected', true);
      Shopify.theme.jsCollection.multiTagFilter.clearSelectedFilter($el);
      Shopify.theme.scrollToTop($('.collection__content'));
    });
  },
  filterURL: function filterURL() {
    var selectedOptions = [],
        query = '',
        currentTags = '',
        siteUrl = 'https://' + $.url('hostname'),
        url1 = $.url('1') ? '/' + $.url('1') + '/' : '',
        url2 = $.url('2') ? $.url('2') + '/' : '',
        url3 = $.url('3'),
        path = url1 + url2; //Handle dropdowns if they exist

    if ($('#sort-by').length) {
      query = $('#sort-by').val();
    } else {
      query = url('?sort_by');
    }

    if ($('#tag_filter').length) {
      if ($('#tag_filter').data('default-collection') != $('#tag_filter').val()) {
        var urlTag = $('#tag_filter').val().substr($('#tag_filter').val().lastIndexOf('/') + 1);

        if (urlTag != 'all') {
          if ($.inArray(urlTag, selectedOptions) > -1) {//Do nothing
          } else {
            selectedOptions.unshift(urlTag);
          }
        }
      }
    } //Add all checkbox values to array


    $('[data-option-filter] input:checked').each(function () {
      selectedOptions.push($(this).val());
    });
    selectedOptions = $.makeArray(selectedOptions); //Loop through tags to create string to update page url

    $.each(selectedOptions, function (i, value) {
      if (i != selectedOptions.length - 1) {
        currentTags += selectedOptions[i] + '+';
      } else {
        currentTags += selectedOptions[i];
      }
    });
    Shopify.theme.queryParameters.sort_by = query;
    query = '?' + $.param(Shopify.theme.queryParameters);
    this.processUrl(path, currentTags, query);
  },
  processUrl: function processUrl(path, tags, query) {
    var query = query.replace(/\page=(\w+)&/, ''),
        urlString = '';
    urlString = path + tags + query;
    this.updateView(urlString);
  },
  updateView: function updateView(filterURL) {
    $.ajax({
      type: 'GET',
      url: filterURL,
      beforeSend: function beforeSend() {
        $(".collection-matrix").addClass('fadeOut animated loading-in-progress');
      },
      success: function success(data) {},
      error: function error(x, t, m) {
        console.log(x);
        console.log(t);
        console.log(m);
        location.replace(location.protocol + '//' + location.host + filterURL);
      },
      dataType: "html"
    }).then(function (data) {
      var $breadcrumbContainer = $('.breadcrumb__container');
      var $collectionMatrix = $('.collection-matrix');
      var $collectionMain = $('.collection__main'); // Get and set new breadcrumb html

      var filteredBreadcrumb = $(data).find('.breadcrumb__container').html();
      $breadcrumbContainer.html(filteredBreadcrumb); // Remove loading animation

      $collectionMatrix.removeClass('loading-in-progress'); // Check for products

      var filteredData = $(data).find('.collection-matrix__wrapper');
      var filteredPageLinks = $(data).find('.container--pagination');
      var noProducts = $(data).find('.container--no-products-in-collection');

      if (filteredData.length) {
        // Add products to container
        $collectionMain.empty();
        $collectionMain.append(filteredData);
      } else {
        // Display no product message
        $collectionMain.empty();
        $collectionMain.append(noProducts);
      }

      $collectionMain.append(filteredPageLinks);
      window.history && window.history.pushState && window.history.pushState("", "", filterURL);

      if (Shopify.theme_settings.enable_shopify_collection_badges == true) {
        Shopify.theme.productReviews();
      }

      if (Shopify.theme_settings.show_multiple_currencies) {
        convertCurrencies();
      }
    });
  },
  multiTagFilter: {
    init: function init($el) {
      // Show filter and hide siblings
      this.showSelectedFilter($el); // Update url

      Shopify.theme.jsCollection.filterURL(); // Hide filters if types or vendors is in URL (can't be combined)

      if ($.url(2) === 'types' || $.url(2) === 'vendors') {
        $('.block__tag-filter').remove();
      }
    },
    showSelectedFilter: function showSelectedFilter($el) {
      var $sidebarToggleBlock = $el.parents('.sidebar-toggle-active');
      var $filterItem = $el.parents('.tag-filter__item');
      $filterItem.addClass('is-active');
      $filterItem.siblings(':not(.is-active)').addClass('is-hidden');
      $filterItem.find('[data-clear-filter]').removeClass('is-hidden'); // If sidebar toggle is enabled, show filter in sidebar content

      if ($sidebarToggleBlock.length) {
        var $toggleBtn = $sidebarToggleBlock.find('[data-sidebar-block__toggle-icon="closed"]');
        Shopify.theme.jsSidebar.openSidebarBlock($toggleBtn);
      }
    },
    clearSelectedFilter: function clearSelectedFilter($el) {
      var $filterItem = $el.parents('.tag-filter__item');
      $filterItem.removeClass('is-active').find('input').prop("checked", false);
      $filterItem.siblings().removeClass('is-hidden');
      $filterItem.find('[data-clear-filter]').addClass('is-hidden'); //Update url

      Shopify.theme.jsCollection.filterURL();
    }
  },
  unload: function unload($section) {
    $('#tag_filter, #sort-by').off();
    $('[data-option-filter]').off();
    $('[data-reset-filters]').off();
    $('[data-clear-filter]').off();
    Shopify.theme.breadcrumbs.unload();
  }
};