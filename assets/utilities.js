"use strict";

Shopify.contentCreator.accordion = {
  init: function init() {
    var $accordionHeading = $('.accordion > dt > a, [data-cc-accordion] > dt > a');
    $('.accordion > dd, [data-cc-accordion] > dd').attr('aria-hidden', true);
    $accordionHeading.attr('aria-expanded', false);
    $accordionHeading.on('click', function () {
      var state = $(this).attr('aria-expanded') === 'false' ? true : false;
      $(this).attr('aria-expanded', state);
      $(this).parent().next().slideToggle(function () { });
      $(this).parent().next().attr('aria-hidden', !state);
      return false;
    });
    $accordionHeading.on('keydown', function (event) {
      var keyCode = event.keyCode || e.which;

      if (keyCode === 13) {
        $(this).trigger('activate');
      }
    });
  },
  unload: function unload() {
    $('.accordion > dt > a, [data-cc-accordion] > dt > a').off('click activate');
    $('.accordion > dt > a, [data-cc-accordion] > dt > a').off('keydown');
  }
};
Shopify.contentCreator.slideshow = {
  init: function init() {
    //backwards compatibility with flexslider
    $('.slider, .flexslider').find('li').unwrap();
    $('.slider, .flexslider').flickity({
      pageDots: true,
      lazyLoad: 2
    });
  }
};
Shopify.theme.animation = {
  init: function init() {
    $('[data-scroll-class]').waypoint(function () {
      var animationClass = $(this.element).data('scroll-class');
      $(this.element).addClass('animated').addClass(animationClass);
    }, {
      offset: '70%'
    });
  },
  slideTransition: function slideTransition($el, animationName, callback) {
    $el.parents('.flickity-enabled').find('.animated').removeClass('animated ' + animationName);
    $el.addClass('animated').addClass(animationName);
  },
  unload: function unload($target) {
    $target.data('scroll-class', '');
  }
};
var deferred = {};
Shopify.theme.asyncView = {
  /**
   * Load the template given by the provided URL into the provided
   * view
   *
   * @param {string} url - The url to load.
   * @param {string} view - The view to load into.
   * @param {object} options - Config options.
   * @param {string} options.hash - A hash of the current page content.
   */
  load: function load(url, view) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var data;

    if (url in deferred) {
      return deferred[url];
    }

    var $deferred = $.Deferred();
    deferred[url] = $deferred;

    if (options.hash) {
      data = sessionStorage.getItem(url);

      if (data) {
        var deserialized = JSON.parse(data);

        if (options.hash === deserialized.options.hash) {
          delete deferred[url];
          return $deferred.resolve(deserialized).promise();
        }
      }
    } // NOTE The $.ajax request has the cache option set to false.
    // This is to prevent certain browsers from returning cached
    // versions of the url we are requesting.
    // See this PR for more info: https://github.com/pixelunion/shopify-asyncview/pull/4


    $.ajax({
      url: url,
      cache: false,
      data: "view=".concat(view),
      dataType: 'html',
      headers: {
        'cache-control': 'no-cache'
      },
      success: function success(response) {
        var el = document.createElement('div');
        el.innerHTML = response;
        var responseOptions = JSON.parse(el.querySelector('[data-options]').innerHTML);
        var htmls = el.querySelectorAll('[data-html]');
        var html = {};

        if (htmls.length === 1 && htmls[0].getAttribute('data-html') === '') {
          html = htmls[0].innerHTML;
        } else {
          for (var _i = 0; _i < htmls.length; _i++) {
            html[htmls[_i].getAttribute('data-html')] = htmls[_i].innerHTML;
          }
        }

        if (options.hash) {
          try {
            sessionStorage.setItem(url, JSON.stringify({
              options: responseOptions,
              html: html
            }));
          } catch (error) {
            console.error(error);
          }
        }

        delete deferred[url];
        return $deferred.resolve({
          options: responseOptions,
          html: html
        });
      },
      error: function error() {
        delete deferred[url];
        return $deferred.reject();
      }
    });
    return $deferred.promise();
  }
};
Shopify.theme.breadcrumbs = {
  init: function init(pages) {
    // Show pagination if number of pages is greater than 1
    if (pages > 1) {
      var breadcrumbSpan = document.querySelector('[data-breadcrumb-text]');
      var currentPage = document.querySelector('.paginate').dataset.currentPage ? document.querySelector('.paginate').dataset.currentPage : 1;
      var totalPages = document.querySelector('.paginate').dataset.paginatePages;
      document.querySelector('.js-breadcrumb-text').classList.remove('is-hidden');
      breadcrumbSpan.innerHTML = "".concat(Shopify.translation.page_text, " ").concat(currentPage, " ").concat(Shopify.translation.of_text, " ").concat(totalPages);
    }
  },
  unload: function unload($target) {
    document.querySelector('.js-breadcrumb-text').classList.add('is-hidden');
  }
};

Shopify.theme.dropdownMenu = function () {
  var domElements = {
    $submenuInput: $('.has-submenu input')
  };
  domElements.$submenuInput.on('click', function () {
    if ($(this).hasClass('is-opened')) {
      var parentLink = $(this).closest('navbar-link').attr('href');
      window.location.href = parentLink;
    } else {
      $(this).addClass('is-opened');
    }
  });
};

Shopify.theme.newsletterAjaxForm = {
  init: function init() {
    // Selectors
    var $ajaxForm = $('.newsletter-form__wrapper .contact-form');
    $ajaxForm.each(function () {
      var $form = $(this);
      $form.on('submit', function (e) {
        if ($('input[name="challenge"]', $form).val() !== "true") {
          $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            success: function success(data) {
              $form.fadeOut("slow", function () {
                $form.prev('.form__success-message').html(Shopify.translation.newsletter_form_success);
              });
            },
            error: function error(data) {
              $('input[name="challenge"]', $form).val('true');
              $form.submit();
            }
          });
          e.preventDefault();
        }
      });
    });
  },
  unload: function unload() {
    var $ajaxForm = $('.newsletter-form__wrapper .contact-form');
    var $submitButton = $ajaxForm.find(':submit');
    $submitButton.off();
  }
};

Shopify.theme.getSectionData = function ($section) {
  var sectionId = $section.attr('id').replace('shopify-section-', '');
  var $dataEl = $section.find('[data-section-data][data-section-id=' + sectionId + ']').first();
  if (!$dataEl) return {}; // Load data from attribute, or innerHTML

  var data = $dataEl.data('section-data') || $dataEl.html();

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn("Sections: invalid section data found. ".concat(error.message));
    return {};
  }
};

Shopify.theme.infiniteScroll = {
  init: function init() {
    this.defaults = {
      grid: '[data-load-more--grid]',
      gridItems: '[data-load-more--grid-item]'
    };
    $('[data-load-more]').on('click', function (e) {
      e.preventDefault();
      var $button = $(this);
      var url = $button.attr('href');
      Shopify.theme.infiniteScroll.loadNextPage(url, $button);
    });
    $('[data-load-more-infinite]').on('click', function (e) {
      Shopify.theme.infiniteScroll.enableInfinite();
      $(this).remove(); // Prevent link from going to next page

      e.stopPropagation();
      return false;
    });

    if ($('[data-load-infinite-scroll]').length) {
      Shopify.theme.infiniteScroll.enableInfinite();
    }
  },
  loadNextPage: function loadNextPage(url, $button) {
    var _this = this;

    $.ajax({
      type: 'GET',
      dataType: 'html',
      url: url,
      beforeSend: function beforeSend() {
        $button.addClass('is-loading');
      },
      success: function success(data) {
        $button.removeClass('is-loading');
        var thumbnails = $(data).find(_this.defaults.gridItems);
        var loadMoreButtonUrl = $(data).find('[data-load-more]').attr('href');
        $('[data-load-more]').attr('href', loadMoreButtonUrl);
        $(_this.defaults.grid).first().append(thumbnails); // When there are no additional pages, hide load more button

        if (typeof loadMoreButtonUrl == 'undefined') {
          $('[data-load-more]').addClass('is-hidden');
        }
      },
      error: function error(x, t, m) {
        console.log(x);
        console.log(t);
        console.log(m);
        location.replace(location.protocol + '//' + location.host + filterURL);
      }
    });
  },
  enableInfinite: function enableInfinite() {
    var infiniteScroll = new Waypoint.Infinite({
      element: $(this.defaults.grid)[0],
      items: '[data-load-more--grid-item]',
      more: '[data-load-infinite]',
      loadingClass: 'loading-in-progress',
      onBeforePageLoad: function onBeforePageLoad() {
        $('[data-load-infinite]').removeClass('is-hidden');
      },
      onAfterPageLoad: function onAfterPageLoad(data) { }
    });
  },
  unload: function unload() {
    $('[data-load-more]').off();
    $('[data-load-infinite]').off();
  }
};

Shopify.theme.flickityIosFix = function () {
  var touchingCarousel = false,
    touchStartCoords;
  document.body.addEventListener('touchstart', function (e) {
    if ($(this).closest('.flickity-slider')) {
      touchingCarousel = true;
    } else {
      touchingCarousel = false;
      return;
    }

    touchStartCoords = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    };
  });
  document.body.addEventListener('touchmove', function (e) {
    if (!(touchingCarousel && e.cancelable)) {
      return;
    }

    var moveVector = {
      x: e.touches[0].pageX - touchStartCoords.x,
      y: e.touches[0].pageY - touchStartCoords.y
    };
    if (Math.abs(moveVector.x) > 7) e.preventDefault();
  }, {
    passive: false
  });
};

Shopify.theme.loadScript = function (name, url, callback) {
  if (Shopify.theme[name]) {
    callback;
  } else {
    $.ajax({
      url: url,
      dataType: 'script',
      success: callback,
      async: false
    });
  }
};
/*============================================================================
Swatch options - second and third swatch 'sold-out' will update based on availability of previous options selected
==============================================================================*/


Shopify.theme.updateOptionsInSelector = function (selectorIndex, parent) {
  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = $(parent + ' .single-option-selector:eq(0)');
      break;

    case 1:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      var selector = $(parent + ' .single-option-selector:eq(1)');
      break;

    case 2:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      key += ' / ' + $(parent + ' .single-option-selector:eq(1)').val();
      var selector = $(parent + ' .single-option-selector:eq(2)');
  }

  var availableOptions = Shopify.optionsMap[key];
  $(parent + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function () {
    if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
      $(this).removeClass('soldout').find(':radio').removeAttr('disabled', 'disabled').removeAttr('checked');
    } else {
      $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled', 'disabled');
    }
  });
};

Shopify.linkOptionSelectors = function (product, parent) {
  // Building our mapping object.
  Shopify.optionsMap = {};

  for (var i = 0; i < product.variants.length; i++) {
    var variant = product.variants[i];

    if (variant.available) {
      // Gathering values for the 1st drop-down.
      Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
      Shopify.optionsMap['root'].push(variant.option1);
      Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']); // Gathering values for the 2nd drop-down.

      if (product.options.length > 1) {
        var key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      } // Gathering values for the 3rd drop-down.


      if (product.options.length === 3) {
        var key = variant.option1 + ' / ' + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
    }
  } // Update options right away.


  Shopify.theme.updateOptionsInSelector(0, parent);
  if (product.options.length > 1) Shopify.theme.updateOptionsInSelector(1, parent);
  if (product.options.length === 3) Shopify.theme.updateOptionsInSelector(2, parent); // When there is an update in the first dropdown.

  $(parent + " .single-option-selector:eq(0)").change(function () {
    Shopify.theme.updateOptionsInSelector(1, parent);
    if (product.options.length === 3) Shopify.theme.updateOptionsInSelector(2, parent);
    return true;
  }); // When there is an update in the second dropdown.

  $(parent + " .single-option-selector:eq(1)").change(function () {
    if (product.options.length === 3) Shopify.theme.updateOptionsInSelector(2, parent);
    return true;
  });
};

Shopify.theme.applyMasonry = function (selector, gutterSize) {
  var $galleryWrapper = $('.gallery-type--masonry');

  if ($galleryWrapper.length > 0) {
    $galleryWrapper.imagesLoaded().progress(function () {
      $galleryWrapper.isotope({
        layoutMode: 'masonry',
        itemSelector: selector,
        percentPosition: true,
        masonry: {
          columnWidth: selector,
          gutter: gutterSize
        }
      });
    });
  }
};

Shopify.theme.applyHorizontalMasonry = function () {
  var $galleryWrapper = $('.gallery-type--horizontal-masonry');
  $galleryWrapper.find('.gallery__item').each(function (e) {
    var wrapper = $(this);
    var imgWidth, imgHeight;
    setTimeout(function () {
      imgWidth = wrapper.find('img').width();
      imgHeight = wrapper.find('img').height();
      wrapper.css("flex-basis", imgWidth * 200 / imgHeight);
      wrapper.css("flex-grow", imgWidth * 200 / imgHeight);
      wrapper.find("i").css("padding-bottom", imgHeight / imgWidth * 100 + '%');
    }, 100);
  });
};

Shopify.theme.mobileMenu = {
  init: function init() {
    this.$mobileMenuToggle = $('[data-show-mobile-menu]');
    this.$mobileMenuIcon = $('.mobile-menu__toggle-icon');
    this.$mobileDropDownToggle = $('.mobile-menu .close-dropdown');
    $('body').on('click', '.mobile-header__open-menu', function () {
      Shopify.theme.mobileMenu.open();
    });
    $('body').on('click', '.mobile-header__close-menu', function () {
      Shopify.theme.mobileMenu.close();
    });
    $('body').on('click', '[data-submenu-open="false"]', function () {
      $(this).attr('data-submenu-open', true);
      console.log("mobile menu click event");
      var inputId = $(this).parents('.has-submenu').find('.submenu__input').attr('id');
      $('.mobile-menu .submenu__input:not(#' + inputId + ')').not(this).prop('checked', false);
    });
    $('body').on('click', '[data-submenu-open="true"]', function () {
      $(this).attr('data-submenu-open', false);
      var inputId = $(this).parents('.has-submenu').find('.submenu__input').attr('id');
      $('.mobile-menu .submenu__input:not(#' + inputId + ')').not(this).prop('checked', false);
    });

    $('body').on('click', '.submenu__label', function () {
      var inputId = $(this).parents('.has-submenu').find('.submenu__input').attr('id');
      $('.mobile-menu .submenu__input:not(#' + inputId + ')').not(this).prop('checked', false);
    });

    if (Shopify.theme.jsHeader.enable_sticky === true) {
      this.enableSticky();
    }
  },
  open: function open() {
    //Get current position on page
    var currentScrollPosition = window.scrollY;
    $('body').data('current-position', currentScrollPosition); // Calculate height of mobile content area

    var announcementHeight = 0;
    var mobileHeaderHeight = parseInt($('#shopify-section-header-classic').height());
    var topbarHeight = $("#shopify-section-header__top-bar").height();
    var window_width = $(window).outerWidth();
    if (window_width < 1025) {
      topbarHeight = 0;
    }

    if (typeof Shopify.theme.jsAnnouncementBar !== 'undefined' && Shopify.theme.jsAnnouncementBar.enable_sticky) {
      announcementHeight = Shopify.theme.jsAnnouncementBar.getAnnouncementHeight();
    }



    var screenSize = $(window).width();

    $('.mobile-menu, .mobile-menu__content').css({
      // height: "calc(100% - ".concat(mobileHeaderHeight + announcementHeight + headerHeight - $(window).scrollTop(), "px)"),
      top: mobileHeaderHeight + topbarHeight + announcementHeight - $(window).scrollTop() + 'px'
    });

    var windowHeight = $(window).height();
    var height = windowHeight - mobileHeaderHeight - topbarHeight - announcementHeight - 70 + $(window).scrollTop() + 'px';
    $(".mobile-menu .tab-contents").css('max-height', height);


    $(".mobile-menu__content>ul").css('max-height', height);

    $("#main_overlay").css('top', mobileHeaderHeight + topbarHeight - $(window).scrollTop() + 'px');
    $("#main_overlay").css('z-index', '8');
    $("html, body").addClass('show-overlay');
    this.$mobileMenuIcon.addClass('is-active');
    $('.mobile-menu').css('width', '100%');

    $('[data-show-mobile-menu]').attr('data-show-mobile-menu', true);

    if (typeof Shopify.theme.jsAjaxCart !== 'undefined') {
      Shopify.theme.jsAjaxCart.hideMiniCart();
      Shopify.theme.jsAjaxCart.hideDrawer();
    } //Set delay on menu open to get proper page position


    setTimeout(function () {
      $('body, html').addClass('mobile-menu--opened');
    }, 10);

    setTimeout(function () {
      $(".mobile-menu").css('overflow-y', 'unset');
    }, 400);
  },
  close: function close() {
    $('body, html').removeClass('mobile-menu--opened');
    var lastScrollPosition = $('body').data('current-position');
    window.scrollTo(0, lastScrollPosition);
    this.$mobileMenuIcon.removeClass('is-active');
    $(".mobile-menu").css('overflow-y', 'hidden');
    setTimeout(function () {
      $('.mobile-menu').css('width', '0px');
    }, 400);
    $("html, body").removeClass('show-overlay');
    setTimeout(function () {
      $("#main_overlay").css('z-index', '-1');
    }, 300);
    $('[data-show-mobile-menu]').attr('data-show-mobile-menu', false);
  },
  enableSticky: function enableSticky() {
    Shopify.theme.jsHeader.disableSticky();
    var $stickyEl = $('#mobile-header');
    var offset = 0;

    if (typeof Shopify.theme.jsAnnouncementBar !== 'undefined' && Shopify.theme.jsAnnouncementBar.enable_sticky) {
      offset = Shopify.theme.jsAnnouncementBar.getAnnouncementHeight();
    }

    $stickyEl.addClass('sticky--enabled');
    $stickyEl.sticky({
      wrapperClassName: 'header-sticky-wrapper',
      zIndex: 40,
      topSpacing: offset
    }).on('sticky-start', function () {
      var headerheight = $('#mobile-header').height();
      var annoucementHeight = $('.announcement-sticky-wrapper').height();
      var totalHeight = headerheight + annoucementHeight;
      $stickyEl.parent().parent().find('.search-overlay').addClass('sticky-search').css('top', totalHeight + 'px');
    }).on('sticky-end', function () {
      $stickyEl.parent().parent().find('.search-overlay').removeClass('sticky-search').css('top', '100%'); // Safety timeout for logo width transition which can throw calculated height off

      setTimeout(function () {
        $stickyEl.sticky('update');
      }, 250);
      $stickyEl.find('.sticky-menu-wrapper').removeClass('is-visible');
    });
  },
  disableSticky: function disableSticky() {
    var $stickyEl = $('#mobile-header');
    $stickyEl.unstick();
    $stickyEl.removeClass('sticky--enabled');
    setTimeout(function () {
      $('.header-sticky-wrapper').css('height', 'auto');
    }, 250);
  },
  unload: function unload($section) {
    $('[data-mobilemenu-toggle]').off();
    $('.mobile-menu__toggle-icon').off();
    $('.mobile-menu .close-dropdown').off();
    this.disableSticky();
  }
};
Shopify.theme.objectFitImages = {
  init: function init() {
    objectFitImages();

    if (Shopify.theme_settings.image_loading_style == 'color') {
      this.calculateAspectRatio();
    }
  },
  calculateAspectRatio: function calculateAspectRatio() {
    // Get list of image-element__wrap's to calculate
    var imageWrap = document.querySelectorAll('[data-calculate-aspect-ratio]'); // Iterate through list

    for (var _i2 = 0; _i2 < imageWrap.length; _i2++) {
      var image = imageWrap[_i2].firstElementChild; // Calculate aspect ratio based off of original width & height

      var aspectRatio = image.getAttribute('width') / image.getAttribute('height'); // Calculate proper width based off of aspect ratio

      var aspectWidth = image.height * aspectRatio; // Apply width to image wrap

      imageWrap[_i2].style.maxWidth = "".concat(Math.floor(aspectWidth), "px");
    } // Remove background color once loaded


    document.addEventListener('lazyloaded', function (e) {
      e.srcElement.parentNode.style.background = 'none';
    });
  },
  unload: function unload() { }

};

/* option_selection.js */

function floatToString(t, e) {
  var o = t.toFixed(e).toString();
  return o.match(/^\.\d+/) ? "0" + o : o;
}

if ("undefined" == typeof Shopify) var Shopify = {};
Shopify.each = function (t, e) {
  for (var o = 0; o < t.length; o++) {
    e(t[o], o);
  }
}, Shopify.map = function (t, e) {
  for (var o = [], i = 0; i < t.length; i++) {
    o.push(e(t[i], i));
  }

  return o;
}, Shopify.arrayIncludes = function (t, e) {
  for (var o = 0; o < t.length; o++) {
    if (t[o] == e) return !0;
  }

  return !1;
}, Shopify.uniq = function (t) {
  for (var e = [], o = 0; o < t.length; o++) {
    Shopify.arrayIncludes(e, t[o]) || e.push(t[o]);
  }

  return e;
}, Shopify.isDefined = function (t) {
  return "undefined" == typeof t ? !1 : !0;
}, Shopify.getClass = function (t) {
  return Object.prototype.toString.call(t).slice(8, -1);
}, Shopify.extend = function (t, e) {
  function o() { }

  o.prototype = e.prototype, t.prototype = new o(), t.prototype.constructor = t, t.baseConstructor = e, t.superClass = e.prototype;
}, Shopify.locationSearch = function () {
  return window.location.search;
}, Shopify.locationHash = function () {
  return window.location.hash;
}, Shopify.replaceState = function (t) {
  window.history.replaceState({}, document.title, t);
}, Shopify.urlParam = function (t) {
  var e = RegExp("[?&]" + t + "=([^&#]*)").exec(Shopify.locationSearch());
  return e && decodeURIComponent(e[1].replace(/\+/g, " "));
}, Shopify.newState = function (t, e) {
  var o;
  return o = Shopify.urlParam(t) ? Shopify.locationSearch().replace(RegExp("(" + t + "=)[^&#]+"), "$1" + e) : "" === Shopify.locationSearch() ? "?" + t + "=" + e : Shopify.locationSearch() + "&" + t + "=" + e, o + Shopify.locationHash();
}, Shopify.setParam = function (t, e) {
  Shopify.replaceState(Shopify.newState(t, e));
}, Shopify.Product = function (t) {
  Shopify.isDefined(t) && this.update(t);
}, Shopify.Product.prototype.update = function (t) {
  for (var property in t) {
    this[property] = t[property];
  }
}, Shopify.Product.prototype.optionNames = function () {
  return "Array" == Shopify.getClass(this.options) ? this.options : [];
}, Shopify.Product.prototype.optionValues = function (t) {
  if (!Shopify.isDefined(this.variants)) return null;
  var e = Shopify.map(this.variants, function (e) {
    var o = "option" + (t + 1);
    return void 0 == e[o] ? null : e[o];
  });
  return null == e[0] ? null : Shopify.uniq(e);
}, Shopify.Product.prototype.getVariant = function (t) {
  var e = null;
  return t.length != this.options.length ? e : (Shopify.each(this.variants, function (o) {
    for (var i = !0, r = 0; r < t.length; r++) {
      var n = "option" + (r + 1);
      o[n] != t[r] && (i = !1);
    }

    return 1 == i ? void (e = o) : void 0;
  }), e);
}, Shopify.Product.prototype.getVariantById = function (t) {
  for (var e = 0; e < this.variants.length; e++) {
    var o = this.variants[e];
    if (t == o.id) return o;
  }

  return null;
}, Shopify.money_format = "${{amount}}", Shopify.formatMoney = function (t, e) {
  function o(t, e) {
    return "undefined" == typeof t ? e : t;
  }

  function i(t, e, i, r) {
    if (e = o(e, 2), i = o(i, ","), r = o(r, "."), isNaN(t) || null == t) return 0;
    t = (t / 100).toFixed(e);
    var n = t.split("."),
      a = n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i),
      s = n[1] ? r + n[1] : "";
    return a + s;
  }

  "string" == typeof t && (t = t.replace(".", ""));
  var r = "",
    n = /\{\{\s*(\w+)\s*\}\}/,
    a = e || this.money_format;

  switch (a.match(n)[1]) {
    case "amount":
      r = i(t, 2);
      break;

    case "amount_no_decimals":
      r = i(t, 0);
      break;

    case "amount_with_comma_separator":
      r = i(t, 2, ".", ",");
      break;

    case "amount_with_apostrophe_separator":
      r = i(t, 2);
      break;

    case "amount_no_decimals_with_comma_separator":
      r = i(t, 0, ".", ",");
      break;

    case "amount_no_decimals_with_space_separator":
      r = i(t, 0, ".", " ");
  }

  return a.replace(n, r);
}, Shopify.OptionSelectors = function (t, e) {
  return this.selectorDivClass = "selector-wrapper", this.selectorClass = "single-option-selector", this.variantIdFieldIdSuffix = "-variant-id", this.variantIdField = null, this.historyState = null, this.selectors = [], this.domIdPrefix = t, this.product = new Shopify.Product(e.product), this.onVariantSelected = Shopify.isDefined(e.onVariantSelected) ? e.onVariantSelected : function () { }, this.replaceSelector(t), this.initDropdown(), e.enableHistoryState && (this.historyState = new Shopify.OptionSelectors.HistoryState(this)), !0;
}, Shopify.OptionSelectors.prototype.initDropdown = function () {
  var t = {
    initialLoad: !0
  },
    e = this.selectVariantFromDropdown(t);

  if (!e) {
    var o = this;
    setTimeout(function () {
      o.selectVariantFromParams(t) || o.fireOnChangeForFirstDropdown.call(o, t);
    });
  }
}, Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown = function (t) {
  this.selectors[0].element.onchange(t);
}, Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown = function (t) {
  var e = this.selectVariantFromParams(t);
  e || this.selectVariantFromDropdown(t);
}, Shopify.OptionSelectors.prototype.replaceSelector = function (t) {
  var e = document.getElementById(t),
    o = e.parentNode;
  Shopify.each(this.buildSelectors(), function (t) {
    o.insertBefore(t, e);
  }), e.style.display = "none", this.variantIdField = e;
}, Shopify.OptionSelectors.prototype.selectVariantFromDropdown = function (t) {
  var e = document.getElementById(this.domIdPrefix).querySelector("[selected]");
  if (e || (e = document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')), !e) return !1;
  var o = e.value;
  return this.selectVariant(o, t);
}, Shopify.OptionSelectors.prototype.selectVariantFromParams = function (t) {
  var e = Shopify.urlParam("variant");
  return this.selectVariant(e, t);
}, Shopify.OptionSelectors.prototype.selectVariant = function (t, e) {
  var o = this.product.getVariantById(t);
  if (null == o) return !1;

  for (var i = 0; i < this.selectors.length; i++) {
    var r = this.selectors[i].element,
      n = r.getAttribute("data-option"),
      a = o[n];
    null != a && this.optionExistInSelect(r, a) && (r.value = a);
  }

  return "undefined" != typeof jQuery ? jQuery(this.selectors[0].element).trigger("change", e) : this.selectors[0].element.onchange(e), !0;
}, Shopify.OptionSelectors.prototype.optionExistInSelect = function (t, e) {
  for (var o = 0; o < t.options.length; o++) {
    if (t.options[o].value == e) return !0;
  }
}, Shopify.OptionSelectors.prototype.insertSelectors = function (t, e) {
  Shopify.isDefined(e) && this.setMessageElement(e), this.domIdPrefix = "product-" + this.product.id + "-variant-selector";
  var o = document.getElementById(t);
  Shopify.each(this.buildSelectors(), function (t) {
    o.appendChild(t);
  });
}, Shopify.OptionSelectors.prototype.buildSelectors = function () {
  for (var t = 0; t < this.product.optionNames().length; t++) {
    var e = new Shopify.SingleOptionSelector(this, t, this.product.optionNames()[t], this.product.optionValues(t));
    e.element.disabled = !1, this.selectors.push(e);
  }

  var o = this.selectorDivClass,
    i = this.product.optionNames(),
    r = Shopify.map(this.selectors, function (t) {
      var e = document.createElement("div");

      if (e.setAttribute("class", o), i.length > 1) {
        var r = document.createElement("label");
        r.htmlFor = t.element.id, r.innerHTML = t.name, e.appendChild(r);
      }

      return e.appendChild(t.element), e;
    });
  return r;
}, Shopify.OptionSelectors.prototype.selectedValues = function () {
  for (var t = [], e = 0; e < this.selectors.length; e++) {
    var o = this.selectors[e].element.value;
    t.push(o);
  }

  return t;
}, Shopify.OptionSelectors.prototype.updateSelectors = function (t, e) {
  var o = this.selectedValues(),
    i = this.product.getVariant(o);
  i ? (this.variantIdField.disabled = !1, this.variantIdField.value = i.id) : this.variantIdField.disabled = !0, this.onVariantSelected(i, this, e), null != this.historyState && this.historyState.onVariantChange(i, this, e);
}, Shopify.OptionSelectorsFromDOM = function (t, e) {
  var o = e.optionNames || [],
    i = e.priceFieldExists || !0,
    r = e.delimiter || "/",
    n = this.createProductFromSelector(t, o, i, r);
  e.product = n, Shopify.OptionSelectorsFromDOM.baseConstructor.call(this, t, e);
}, Shopify.extend(Shopify.OptionSelectorsFromDOM, Shopify.OptionSelectors), Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector = function (t, e, o, i) {
  if (!Shopify.isDefined(o)) var o = !0;
  if (!Shopify.isDefined(i)) var i = "/";
  var r = document.getElementById(t),
    n = r.childNodes,
    a = (r.parentNode, e.length),
    s = [];
  Shopify.each(n, function (t, r) {
    if (1 == t.nodeType && "option" == t.tagName.toLowerCase()) {
      var n = t.innerHTML.split(new RegExp("\\s*\\" + i + "\\s*"));
      0 == e.length && (a = n.length - (o ? 1 : 0));
      var p = n.slice(0, a),
        l = o ? n[a] : "",
        c = (t.getAttribute("value"), {
          available: t.disabled ? !1 : !0,
          id: parseFloat(t.value),
          price: l,
          option1: p[0],
          option2: p[1],
          option3: p[2]
        });
      s.push(c);
    }
  });
  var p = {
    variants: s
  };

  if (0 == e.length) {
    p.options = [];

    for (var l = 0; a > l; l++) {
      p.options[l] = "option " + (l + 1);
    }
  } else p.options = e;

  return p;
}, Shopify.SingleOptionSelector = function (t, e, o, i) {
  this.multiSelector = t, this.values = i, this.index = e, this.name = o, this.element = document.createElement("select");

  for (var r = 0; r < i.length; r++) {
    var n = document.createElement("option");
    n.value = i[r], n.innerHTML = i[r], this.element.appendChild(n);
  }

  return this.element.setAttribute("class", this.multiSelector.selectorClass), this.element.setAttribute("data-option", "option" + (e + 1)), this.element.id = t.domIdPrefix + "-option-" + e, this.element.onchange = function (o, i) {
    i = i || {}, t.updateSelectors(e, i);
  }, !0;
}, Shopify.Image = {
  preload: function preload(t, e) {
    for (var o = 0; o < t.length; o++) {
      var i = t[o];
      this.loadImage(this.getSizedImageUrl(i, e));
    }
  },
  loadImage: function loadImage(t) {
    new Image().src = t;
  },
  switchImage: function switchImage(t, e, o) {
    if (t && e) {
      var i = this.imageSize(e.src),
        r = this.getSizedImageUrl(t.src, i);
      o ? o(r, t, e) : e.src = r;
    }
  },
  imageSize: function imageSize(t) {
    var e = t.match(/_(1024x1024|2048x2048|pico|icon|thumb|small|compact|medium|large|grande)\./);
    return null != e ? e[1] : null;
  },
  getSizedImageUrl: function getSizedImageUrl(t, e) {
    if (null == e) return t;
    if ("master" == e) return this.removeProtocol(t);
    var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (null != o) {
      var i = t.split(o[0]),
        r = o[0];
      return this.removeProtocol(i[0] + "_" + e + r);
    }

    return null;
  },
  removeProtocol: function removeProtocol(t) {
    return t.replace(/http(s)?:/, "");
  }
}, Shopify.OptionSelectors.HistoryState = function (t) {
  this.browserSupports() && this.register(t);
}, Shopify.OptionSelectors.HistoryState.prototype.register = function (t) {
  window.addEventListener("popstate", function (e) {
    t.selectVariantFromParamsOrDropdown({
      popStateCall: !0
    });
  });
}, Shopify.OptionSelectors.HistoryState.prototype.onVariantChange = function (t, e, o) {
  this.browserSupports() && (!t || o.initialLoad || o.popStateCall || Shopify.setParam("variant", t.id));
  if (BOLD && BOLD.recurring_orders && BOLD.recurring_orders.app && BOLD.recurring_orders.app.ee &&
    typeof BOLD.recurring_orders.app.ee.emit === 'function') {
    BOLD.recurring_orders.app.ee.emit('variant_changed');
  }


}, Shopify.OptionSelectors.HistoryState.prototype.browserSupports = function () {
  return window.history && window.history.replaceState;
};
Shopify.theme.productReviews = {
  init: function init() {
    if ($('#shopify-product-reviews').length || $('.shopify-product-reviews-badge').length) {
      SPR.$(document).ready(function () {
        return SPR.registerCallbacks(), SPR.initRatingHandler(), SPR.initDomEls(), SPR.loadProducts(), SPR.loadBadges();
      });
    }
  }
};
Shopify.theme.quantityBox = {
  init: function init() {
    $('body').on('click', '[data-update-quantity]:not([disabled])', function () {
      Shopify.theme.quantityBox.updateQuantity($(this));
    });
    $('body').on('keyup keydown change', '.quantity-input', function () {
      Shopify.theme.quantityBox.updateQuantity($(this));
    });
  },
  updateQuantity: function updateQuantity($el) {
    var $quantityBox = $el.parents('.product-quantity-box');
    var $input = $('.quantity-input', $quantityBox);
    var lineID = $quantityBox.parents('[data-line-item]').data('line-item');
    var val = parseInt($input.val());
    var valMax = 100000000000000000;
    var valMin = $input.attr('min') || 0;

    if ($input.attr('max') != null) {
      valMax = $input.attr('max');
    }

    if (isNaN(val) || val < valMin) {
      $input.val(valMin);
      return false;
    } else if (val > valMax) {
      $input.val(valMax);
      return false;
    }

    if ($el.data('update-quantity') === 'plus') {
      // Increase quantity input by one
      if (val < valMax) {
        val++;
        $input.val(val);
      }
    } else if ($el.data('update-quantity') === 'minus') {
      // Decrease quantity by one
      if (val > valMin) {
        val--;
        $input.val(val);
      }
    }

    if (val === 1 || val === 0) {
      $('.quantity-minus', $quantityBox).attr('disabled', true);
      $('.quantity-plus', $quantityBox).attr('disabled', false);
    } else if (val >= valMax) {
      $('.quantity-plus', $quantityBox).attr('disabled', true);
      $('.quantity-minus', $quantityBox).attr('disabled', false);
      $input.val(valMax);
    } else {
      $('.quantity-minus', $quantityBox).attr('disabled', false);
      $('.quantity-plus', $quantityBox).attr('disabled', false);
    } // Update quantity if within cart (vs on the product page)


    if ($el.parents('[data-line-item]').length) {
      var _lineID = $quantityBox.data('line-item-key');

      Shopify.theme.quantityBox.updateCart(_lineID, val);
    }
  },
  updateCart: function updateCart(lineID, quantity) {
    $('.quantity-warning').removeClass('animated bounceIn');
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: "quantity=".concat(quantity, "&line=").concat(lineID),
      dataType: 'json',
      success: function success(cart) {
        if (typeof window.BOLD !== 'undefined'
          && typeof window.BOLD.common !== 'undefined'
          && typeof window.BOLD.common.cartDoctor !== 'undefined') {
          // NOTE: "cart" should be the variable containing the cart json data
          cart = window.BOLD.common.cartDoctor.fix(cart);
        }

        var newQuantity = 0;
        var itemsLeftText = '';
        var quantityWarning = $("[data-line-item=\"".concat(lineID, "\"]")).find('.quantity-warning');
        var $quantityBox = $("[data-line-item=\"".concat(lineID, "\"]")).find('.product-quantity-box'); //check to see if there are correct amount of products in array

        var cartItemsLineID = lineID - 1;

        if (typeof cart.items[cartItemsLineID] !== "undefined") {
          newQuantity = cart.items[cartItemsLineID].quantity;
        }

        if (quantity > 0 && quantity != newQuantity) {
          if (newQuantity == 1) {
            itemsLeftText = Shopify.translation.product_count_one;
            quantityWarning.text("".concat(newQuantity, " ").concat(itemsLeftText));
            $('.quantity-minus', $quantityBox).attr('disabled', true);
          } else {
            itemsLeftText = Shopify.translation.product_count_other;
            quantityWarning.text("".concat(newQuantity, " ").concat(itemsLeftText));
          }
        } // Apply quantity warning


        quantityWarning.addClass('animated bounceIn');

        if (typeof Shopify.theme.jsAjaxCart !== 'undefined') {
          Shopify.theme.jsAjaxCart.updateView();
        }

        if (Shopify.theme.jsCart) {
          Shopify.theme.jsCart.updateView(cart, lineID);
        }
        if (window.BOLD && BOLD.recurring_orders && BOLD.recurring_orders.app) {
          $.getJSON("/cart.js", function (data) {
            BOLD.common.cartDoctor.fix(data);
            BOLD.recurring_orders.app.renderLineItems(BOLD.common.cartDoctor.cart)
          });
        }

      },
      error: function error(XMLHttpRequest, textStatus) {
        var response = eval('(' + XMLHttpRequest.responseText + ')');
        response = response.description;
      }
    });
  },
  unload: function unload($target) {
    $('.quantity-input').off();
    $('[data-update-quantity]').off();
  }
};
Shopify.theme.queryParameters = {};

if (location.search.length) {
  for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
    aKeyValue = aCouples[i].split('=');

    if (aKeyValue.length > 1) {
      Shopify.theme.queryParameters[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
    }
  }
}

Shopify.theme.responsiveVideo = {
  init: function init() {
    // Checks for YouTube iframes
    $('iframe[src*="youtube"]').each(function () {
      // Does not select iframes added through the video section/block
      if (this.closest('.lazyvideo')) {
        return;
      } else {
        var vendor = 'youtube';
        Shopify.theme.responsiveVideo.getVideoElements(this, vendor);
      }
    }); // Checks for Vimeo iframes

    $('iframe[src*="vimeo"]').each(function () {
      // Does not select iframes added through the video section/block
      if (this.closest('.lazyvideo')) {
        return;
      } else {
        var vendor = 'vimeo';
        Shopify.theme.responsiveVideo.getVideoElements(this, vendor);
      }
    });
  },
  getVideoElements: function getVideoElements(video, vendor) {
    var src = video.src;
    this.enable(video, src, vendor);
  },
  enable: function enable(video, src, vendor) {
    var $videoParent = $(video).parents('.lazyframe'); // Only wraps with parent lazyframe class if it doesn't already exist 

    if ($videoParent.length < 1) {
      $(video).wrap("<div class=\"lazyframe lazyframe--embedded-video\" data-src=\"".concat(src, "\" data-vendor=\"").concat(vendor, "\"></div>"));
    }

    lazyframe('.lazyframe--embedded-video');
  }
};

var selectCallback = function selectCallback(variant, selector) {
  var $product = $('.product-' + selector.product.id);
  var $notify_form = $('.notify-form-' + selector.product.id);
  var $productForm = $('.product_form, .shopify-product-form', $product);
  var variantInventory = $productForm.data('variant-inventory');
  var $notifyFormInputs = $('.notify_form__inputs');
  var notifyEmail = Shopify.translation.notify_form_email;
  var notifyEmailValue = Shopify.translation.contact_email;
  var notifySend = Shopify.translation.notify_form_send;
  var notifyUrl = $notifyFormInputs.data('url');

  if (variant) {
    var notifyMessage = Shopify.translation.email_content + variant.name + ' | ' + notifyUrl + '?variant=' + variant.id;
  }

  if ($notifyFormInputs.hasClass('customer--true')) {
    var notifyCustomerEmail = Shopify.translation.customer_email;
    var notifyEmailInput = "\n      <input type=\"hidden\" class=\"notify_email input\" name=\"contact[email]\" id=\"contact[email]\" value=\"".concat(notifyCustomerEmail, "\" />");
  } else {
    var notifyEmailInput = "\n      <input required type=\"email\" class=\"notify_email input\" name=\"contact[email]\" id=\"contact[email]\" placeholder=\"".concat(notifyEmail, "\" value=\"").concat(notifyEmailValue, "\" />");
  }

  var notifyFormHTML = "\n    <input type=\"hidden\" name=\"challenge\" value=\"false\" />\n    <input type=\"hidden\" name=\"contact[body]\" class=\"notify_form_message\" data-body=\"".concat(notifyMessage, "\" value=\"").concat(notifyMessage, "\" />\n    <div class=\"field has-addons\">\n      <div class=\"control\">\n        ").concat(notifyEmailInput, "\n      </div>\n      <div class=\"control\">\n        <input class=\"action_button button\" type=\"submit\" value=\"").concat(notifySend, "\" />\n      </div>\n    </div>"); //Image Variant feature

  if (variant && variant.featured_image && $product.is(":visible")) {
    var $sliders = $('.product-gallery__main, .js-gallery-modal', $product);
    $sliders.each(function () {
      var $slider = $(this);
      var $sliderInstance = Flickity.data(this);
      var index = $('[data-image-id="' + variant.featured_image.id + '"]').data('index');

      if ($slider.is(":visible") && $sliderInstance != undefined) {
        $sliderInstance.select(index, false, true);
      }

      ;
    });
  } // Emits custom event


  var $selectDropdown = $productForm.find('[data-variant-selector]');
  $selectDropdown.trigger('selectedVariantChanged');

  if (variant) {
    if (variantInventory) {
      variantInventory.forEach(function (v) {
        if (v.id === variant.id) {
          variant.inventory_quantity = v.inventory_quantity;
          variant.inventory_management = v.inventory_management;
          variant.inventory_policy = v.inventory_policy;
        }
      });
    }

    $('.sku', $product).text(variant.sku);

    if (Shopify.theme_settings.product_form_style) {
      for (var i = 0, length = variant.options.length; i < length; i++) {
        var radioButton = $productForm.find('.swatch[data-option-index="' + escape(i) + '"] :radio[value="' + variant.options[i].replace(/\"/g, '\\"') + '"]');

        if (radioButton.length) {
          radioButton.get(0).checked = true;
        }
      }
    } else {
      $(".notify_form_message", $product).attr("value", $(".notify_form_message", $product).data('body') + " - " + variant.title);
    }
  }

  if (variant && variant.available == true) {
    if (variant.price < variant.compare_at_price) {
      $('.was-price', $product).html('<span class="money">' + Shopify.formatMoney(variant.compare_at_price, $('body').data('money-format')) + '</span>');
      $('.savings', $product).html(Shopify.translation.product_savings + ' ' + parseInt((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price) + '% (' + '<span class="money">' + Shopify.formatMoney(variant.compare_at_price - variant.price, $('body').data('money-format')) + '</span>)');
      $('.current_price', $product).parent().addClass('sale');
    } else {
      $('.was-price', $product).html('');
      $('.savings', $product).html('');
      $('.current_price', $product).parent().removeClass('sale');
    }

    if (variant.inventory_management && variant.inventory_quantity > 0) {
      if (Shopify.theme_settings.display_inventory_left) {
        var items_left_text = Shopify.translation.product_count_other;

        if (variant.inventory_quantity == 1) {
          items_left_text = Shopify.translation.product_count_one;
        }

        var inventoryThreshold = Shopify.theme_settings.inventory_threshold;

        if (variant.inventory_quantity <= inventoryThreshold) {
          $('.items_left', $product).html(variant.inventory_quantity + " " + items_left_text);
        } else {
          $('.items_left', $product).html("");
        }
      }

      if (Shopify.theme_settings.limit_quantity) {
        if (variant.inventory_policy == "deny") {
          $('.quantity', $product).attr('max', variant.inventory_quantity);
        }
      }
    } else {
      $('.items_left', $product).text('');
      $('.quantity', $product).removeAttr('max');
    }

    $('.sold_out', $product).text('');
    $('.cart-warning', $product).text('');

    if (variant.price > 0) {
      $('.current_price', $product).html('<span class="money">' + Shopify.formatMoney(variant.price, $('body').data('money-format')) + '</span>');
    } else {
      $('.current_price', $product).html(Shopify.translation.free_price_text);
    }

    $('[data-add-to-cart-trigger]', $product).removeClass('disabled').removeAttr('disabled').find('span:not(.icon)').text($('[data-add-to-cart-trigger]', $product).data('label'));
    $('.shopify-payment-button', $product).show();
    $('.purchase-details__quantity', $product).show();
    $notify_form.hide();
    $notifyFormInputs.empty();
    $notifyFormInputs.append(notifyFormHTML);

    if (Shopify.theme_settings.show_multiple_currencies) {
      convertCurrencies();
    }
  } else {
    var message = variant ? Shopify.translation.soldOut : Shopify.translation.unavailable;
    $('.was-price', $product).text('');
    $('.savings', $product).text('');
    $('.current_price', $product).text('');
    $('.items_left', $product).text('');
    $('.quantity', $product).removeAttr('max');
    $('.sold_out', $product).text(message);
    $('[data-add-to-cart-trigger]', $product).addClass('disabled').attr('disabled', 'disabled').find('span:not(.icon)').text(message);
    $('.shopify-payment-button', $product).hide();
    $('.purchase-details__quantity', $product).hide();
    $notify_form.hide();
    $notifyFormInputs.empty();

    if (variant && !variant.available) {
      $notify_form.fadeIn();
      $notifyFormInputs.empty();
      $notifyFormInputs.append(notifyFormHTML);
    }
  }
};

Shopify.theme.predictiveSearch = {
  init: function init() {
    // Clear inputs on load
    $('.search-form input#q').val(''); // On entering text

    $('.search-form input#q').on('keyup', function () {
      var currentAjaxRequest = null;
      var queryText = $(this).val();
      var inputField = $(this);
      var searchURL; // Create the URLs to query

      if (Shopify.theme_settings.search_option == 'products') {
        searchURL = "".concat($('body').data('shop-url'), "/search?type=product&q=").concat(encodeURI(queryText));
      } else {
        searchURL = "".concat($('body').data('shop-url'), "/search?q=").concat(encodeURI(queryText));
      } //Submit wildcard searches


      $('.search-form').on('submit', function (e) {
        var cleanFormValue = encodeURI(queryText);
        e.preventDefault();

        if (cleanFormValue == null) {
          window.location.href = '/search';
        } else {
          window.location.href = "".concat(searchURL, "*");
        }
      });

      if (queryText == '') {
        $(this).find('.predictive-results').empty().css('opacity', 0);
      } // Predicitive loop


      if (queryText.length > 3) {
        if (currentAjaxRequest != null) currentAjaxRequest.abort(); // Ajax call

        currentAjaxRequest = $.getJSON(searchURL + '*&view=json', function (data) {
          // Get results and display them
          Shopify.theme.predictiveSearch.displayResults(data.results, searchURL, queryText, inputField);
        });
      } else {
        $('.search-form').find('.predictive-results').empty().css('opacity', 0);
      }
    }); // Clicking outside makes the results disappear.

    $(document).on('click', function (e) {
      var $container = $('.search-form input#q');

      if (!$container.is(e.target) && $container.has(e.target).length === 0) {
        $('.predictive-results').css('opacity', 0).empty();
      }
    });
  },
  displayResults: function displayResults(results, searchURL, queryText, inputField) {
    var resultList = inputField.parents('.search-form').find('.predictive-results'); // Clear out list and make it visible

    resultList.empty().css('opacity', 1);

    if (results.length > 0) {
      // Loop through results
      for (var _i3 = 0; _i3 < Shopify.theme_settings.search_to_display; _i3++) {
        if (results[_i3] != null) {
          var result = results[_i3];
          var resultInfo = void 0;
          var resultPrice = void 0;
          var resultImage = void 0; // Determine result type

          if (result.object_type == 'product') {
            if (result.available == true) {
              // If free display text instead of value
              if (result.raw_price == 0) {
                resultPrice = Shopify.translation.free;
              } else {
                resultPrice = result.price;
              }
            } else {
              resultPrice = Shopify.translation.sold_out;
            } // If product is on sale


            if (result.raw_compare > result.raw_price) {
              resultInfo = "\n              <span class='money'>".concat(resultPrice, "</span>\n              <span class='product-thumbnail__was-price was-price'>\n                <span class='money'>").concat(result.compare, "</span>\n              </span>");
            } else {
              resultInfo = "<span class='money'>".concat(resultPrice, "</span>");
            }
          } else {
            resultInfo = "<span>".concat(result.text_content);
          } // If result has image


          if (result.thumbnail != '') {
            resultImage = "<img class='lazyload transition--".concat(Shopify.theme_settings.image_loading_style, " result-image' src='").concat(result.thumbnail, "' alt='").concat(result.title, "'>");
          } else {
            resultImage = '';
          } // Append result


          resultList.append("\n          <li>\n            <a class='result-link' href='".concat(result.url, "'>\n              ").concat(resultImage, "\n              <div class='result-info'>\n                <p>").concat(result.title, "</p>\n                ").concat(resultInfo, "\n              </div>\n            </a>\n          </li>\n          "));
        }
      } // Display view all link


      if (results.length > Shopify.theme_settings.search_to_display) {
        resultList.append("<li><a class='result-link' href='".concat(searchURL, "*'>").concat(Shopify.translation.all_results, "</a></li>"));
      }
    } else {
      resultList.append("<li>".concat(Shopify.translation.no_results, "</li>"));
    }
  },
  unload: function unload() {
    $('.search-form').off();
    $('.search-form input#q').off();
  }
};

function isScreenSizeLarge() {
  // if ($(window).width() > Shopify.breakpoints.medium) {
  if ($(window).width() > 1024) {
    return true;
  }
}

Shopify.theme.scrollToTop = function (element, height) {
  // Check if height argument is present
  if (height != undefined) {
    $('html, body').animate({
      scrollTop: $(element).offset().top - height
    }, 1000);
  } else {
    $('html, body').animate({
      scrollTop: $(element).offset().top
    }, 1000);
  }
};

Shopify.theme.tabs = {
  enableTabs: function enableTabs() {
    var $tabs = $('.tabs li, .tabs li a');
    $tabs.on('click', function (el) {
      el.preventDefault(); // toggle active tab

      $tabs.removeClass('is-active active');
      $(this).addClass('is-active');
      var $tabIndex = $(this).index();
      var $tabContent = $(this).parents('.tabs').next('.tabs-content'); // toggle corresponding tab content

      $tabContent.children('li, li a').removeClass('is-active active');
      $tabContent.children('li, li a').eq($tabIndex).addClass('is-active').show().css({
        'display': 'block'
      }).siblings().hide().removeClass('is-active');
    });
  },
  unload: function unload() {
    $('.tabs li, .tabs li a').off();
  }
};
var globalQuickShopProduct;
Shopify.theme.thumbnail = {
  enableSwatches: function enableSwatches() {
    if (isScreenSizeLarge()) {
      $('body').on('mouseenter', '.thumbnail-swatch', function () {
        $('.swatch span', $(this)).each(function () {
          if ($(this).data('image').indexOf('no-image') == -1) {
            $(this).find('.swatch__image').attr('src', $(this).data('image'));
          }
        });
      });
      $('body').on('mouseenter', '.swatch span', function () {
        if ($(this).data('image').indexOf('no-image') == -1) {
          $(this).parents('.thumbnail').find('.product__imageContainer img:not(.secondary)').attr('src', $(this).data('image'));
          $(this).parents('.thumbnail').find('.product__imageContainer img:not(.secondary)').attr('srcset', $(this).data('image'));
        }
      });
    }
  },
  showVariantImage: function showVariantImage() {
    if (isScreenSizeLarge()) {
      $('body').on('mouseenter', '.has-secondary-image-swap', function () {
        $(this).find('.product-image__wrapper img').toggleClass('swap--visible');
      });
      $('body').on('mouseleave', '.has-secondary-image-swap', function () {
        $(this).find('.product-image__wrapper img').toggleClass('swap--visible');
      });
    }
  },
  showQuickShop: function showQuickShop() {
    //EVENT - click on quick-shop
    $('body').on('click', '.js-quick-shop-link', function (e) {
      e.preventDefault(); //Set productData object based on data attributes

      var productData = {
        handle: $(this).data('handle'),
        product_id: $(this).data('id'),
        single_variant: $(this).attr('data-single-variant'),
        product_in_collection_url: $(this).data('url'),
        escaped_title: $(this).data('title'),
        details_text: $(this).data('details-text'),
        full_description: $(this).data('full-description'),
        regular_description: $(this).data('regular-description'),
        featured_image: $(this).data('featured-image'),
        image_array: Shopify.theme.thumbnail.createImageObjects($(this).data('images')),
        collection_handles: $(this).data('collection-handles').trim(',').split(','),
        money_format: $('body').data('money-format')
      }; //Find current product and notify forms

      var $notifyForm = $(this).next('.js-quickshop-forms__container').find('.notify_form');
      var $productForm = $(this).next('.js-quickshop-forms__container').find('.product_form');
      $.fancybox.open($('.js-quick-shop'), {
        baseClass: 'quick-shop__lightbox product-' + productData.product_id,
        hash: false,
        infobar: false,
        toolbar: false,
        loop: true,
        smallBtn: true,
        mobile: {
          preventCaptionOverlap: false,
          toolbar: true
        },
        beforeLoad: function beforeLoad() {
          Shopify.theme.thumbnail.beforeOpen(productData);
        },
        afterLoad: function afterLoad() {
          Shopify.theme.thumbnail.afterContent($productForm, $notifyForm, productData);

          if ($('.tabs').length > 0) {
            Shopify.theme.tabs.enableTabs();
          }

          Shopify.theme.jsProduct.enableProductSwatches();
        },
        afterShow: function afterShow() {
          $('.quick-shop').addClass('quick-shop--loaded');
          Shopify.theme.responsiveVideo.init();
        },
        beforeClose: function beforeClose() {
          Shopify.theme.thumbnail.beforeClose(productData);
          $('.quick-shop').removeClass('quick-shop--loaded');
        }
      });
    });
  },
  beforeClose: function beforeClose(productData) {
    var $insertedNotifyForm = $('.quick-shop__lightbox .notify_form');
    var $insertedProductForm = $('.quick-shop__lightbox .product_form'); //Copy form data back to product loop and add .viewed

    $('.js-quickshop-forms--' + productData.product_id).append($insertedProductForm);
    $('.js-quickshop-forms--' + productData.product_id).append($insertedNotifyForm);
    $('.js-quickshop-forms--' + productData.product_id + ' .product_form').addClass('viewed');
    $('.js-quickshop-forms--' + productData.product_id + ' .notify_form').addClass('viewed'); // Clear stickers

    $('.quick-shop .thumbnail-sticker span').empty().parent().addClass('is-hidden'); //Find gallery and carousel

    var $gallery = $('.js-gallery-modal');
    var $carousel = $('.js-gallery-carousel');
    $('.js-gallery-carousel .gallery-cell').off('click'); //Remove image slides from gallery

    $gallery.flickity('remove', $('.gallery-cell', $gallery)); //Destroy sliders when modal closes

    $gallery.flickity('destroy');

    if ($carousel.hasClass('flickity-enabled')) {
      $carousel.flickity('remove', $('.gallery-cell', $carousel));
      $carousel.flickity('destroy');
    } else {
      $carousel.find('.gallery-cell').remove();
    }

    var variantPrice = $('.js-current-price .money').text();
    $('.js-quick-shop-link[data-id=' + productData.product_id + ']').attr('data-initial-modal-price', variantPrice);
    $('.js-current-price, .js-was-price, .js-savings').empty();

    if ($('.js-gallery-modal').data('zoom') === true) {
      $('.js-gallery-modal').trigger('zoom.destroy'); // remove zoom
    }
  },
  afterContent: function afterContent($productForm, $notifyForm, productData) {
    Shopify.theme.thumbnail.retrieveProductInfo(productData);
    var prevNext = false;
    var draggable = false;
    var fade = false;

    if ($('.js-gallery-modal').hasClass('slideshow_animation--fade')) {
      fade = true;
    }

    if (productData.image_array.length > 5) {
      prevNext = true;
      draggable = true;
    } //Add main gallery


    $('.js-gallery-modal').flickity({
      "adaptiveHeight": true,
      "wrapAround": "true",
      "cellAlign": "left",
      "draggable": true,
      "contain": true,
      "imagesLoaded": true,
      "lazyLoad": 2,
      "pageDots": true,
      "dragThreshold": 10,
      "prevNextButtons": productData.image_array.length > 1 ? true : false,
      "arrowShape": arrowShape,
      "fade": fade

    }); //Initialize carousel flickity

    $('.js-gallery-carousel').flickity({
      "asNavFor": ".js-gallery-modal",
      "adaptiveHeight": false,
      "cellAlign": 'center',
      "draggable": draggable,
      "contain": true,
      "imagesLoaded": true,
      "lazyLoad": 2,
      "pageDots": false,
      "dragThreshold": 10,
      "arrowShape": arrowShape,
      "prevNextButtons": prevNext

    }); // Removes carousel if there is only one product image

    if ($('.product-gallery__nav .gallery-cell').length <= 1) {
      var $carousel = $('.js-gallery-carousel');
      $carousel.flickity('remove', $('.gallery-cell', $carousel));
      $carousel.flickity('destroy');
    } //Copy form data to modal


    $('.quick-shop__lightbox .js-notify-form').append($notifyForm);
    $('.quick-shop__lightbox .js-product-form').append($productForm); //Initiate selectCallback

    if ($productForm.hasClass("product_form_options") && !$productForm.hasClass("viewed")) {
      //If form hasn't been viewed previously, run OptionSelectors function
      new Shopify.OptionSelectors($productForm.data("select-id"), {
        product: $productForm.data("product"),
        onVariantSelected: selectCallback,
        enableHistoryState: $productForm.data("enable-state")
      });
    } else {
      //If form has been previously viewed, just convert currencies
      if (Shopify.theme_settings.show_multiple_currencies) {
        convertCurrencies();
      }
    } //Link sold out options when there is more than one option available (eg. S is selected and Yellow option appears as sold out)


    if (Shopify.theme_settings.product_form_style == 'swatches') {
      var JSONData = $productForm.data('product');
      var productID = productData.section_id;
      var productSection = '.product-' + productID + ' .js-product_section';
      var swatchOptions = $productForm.find('.swatch_options .swatch');

      if (swatchOptions.length > 1) {
        Shopify.linkOptionSelectors(JSONData, productSection);
      }
    }

    if ($('.single-option-selector').length > 0) {
      $('.selector-wrapper').wrap('<div class="select"></div>');
      $('#product-form-' + productData.product_id + ' .select-container').children().first().removeClass('select').addClass('select-container');
    }

    $('.js-quick-shop select[name="id"]').trigger('change');
  },
  createImageObjects: function createImageObjects($images) {
    //split image info
    var image_paths_alts = $images.split('~'); //Create new array with image objects

    var imageArray = image_paths_alts.map(function (image) {
      var imageInfo = image.split('^');
      return {
        path: imageInfo[0],
        alt: imageInfo[1],
        id: imageInfo[2],
        width: imageInfo[3]
      };
    });
    return imageArray;
  },
  beforeOpen: function beforeOpen(productData) {
    //Add image elements before gallery is opened
    Shopify.theme.thumbnail.populateGallery(productData);
    $('.js-sale-sticker, .js-sold-out, .js-current-price, .js-was-price, .js-savings, .js-new-sticker, .js-pre-order-sticker').empty();
    $('.modal_price, .js-notify-form').show();
  },
  retrieveProductInfo: function retrieveProductInfo(productData) {
    $.ajax({
      dataType: "json",
      async: false,
      cache: false,
      url: "/products/" + productData.handle + ".js",
      success: function success(product) {
        //Create new object combining info
        product = $.extend({}, product, productData);
        globalQuickShopProduct = product;
        Shopify.theme.thumbnail.updateVariant(product.variants[0].id.toString(), product);
      }
    });
  },
  populateGallery: function populateGallery(productData) {
    //Find gallery and carousel
    var $gallery = $('.js-gallery-modal');
    var $carousel = $('.js-gallery-carousel'); //Add gallery images based on product info from API

    function addMainGalleryImages() {
      $.each(productData.image_array, function (i, image) {
        if (image.path == '') {
          var imgPath = productData.featured_image;
          var alt = '';
        } else {
          var imgPath = image.path;
          var alt = image.alt;
        }

        var img2048x2048 = imgPath.replace(/(\.[^.]*)$/, "_2048x2048$1").replace('http:', '');
        var cellContent;

        if (alt.indexOf("youtube") >= 0) {
          cellContent = '<div class="video-container youtube"><div>' + alt + '</div></div>';
        } else if (alt.indexOf("vimeo") >= 0) {
          cellContent = '<div class="video-container vimeo"><div>' + alt + '</div></div>';
        } else {
          cellContent = "\n            <div class=\"image__container\" style=\"max-width: ".concat(image.width, "px\">\n              <img src=\"").concat(imgPath, "\" alt=\"").concat(alt, "\" data-image-id=\"").concat(image.id, "\" data-index=\"").concat(i, "\" />\n            </div>\n          ");
        }

        var $cellElems = $('<div class="gallery-cell">' + cellContent + '</div>');
        $('.js-gallery-modal').append($cellElems);
      });
    } //Add carousel images based on product info from API


    function addCarouselGalleryImages() {
      $.each(productData.image_array, function (i, image) {
        if (image.path != '') {
          var imgPath = image.path;
          var carouselSizedImg = imgPath.replace(/(\.[^.]*)$/, "_grande$1").replace('http:', '');
        }

        var img = '<img src="' + carouselSizedImg + '" alt="' + escape(image.alt) + '" />';
        var $carouselCellElems = $('<div class="gallery-cell">' + img + '</div>');
        $carousel.append($carouselCellElems);
      });
      var groupCells = true;
      var navPrevNextButtons = false;
      var navCellAlign = "center";
      var navWrapAround = false;

      if ($('.product-gallery__nav .gallery-cell').length >= 5) {
        groupCells = false;
        navPrevNextButtons = true;
        navCellAlign = "left";
        navWrapAround = true;
      }
    }

    addMainGalleryImages();
    addCarouselGalleryImages();

    if ($('.js-gallery-modal').data('zoom') === true) {
      $('.js-gallery-modal').find('img').wrap('<span class="zoom-container"></span>').css('display', 'block').parent().zoom({
        touch: false
      });
    }
  },
  updateVariant: function updateVariant(variant) {
    if (globalQuickShopProduct != 'undefined') {
      var getQuickShopInfo = function getQuickShopInfo(variant) {
        if (variant.id == variant.id.toString()) {
          //Sale sticker
          if (Shopify.theme_settings.stickers_enabled) {
            if (variant.compare_at_price > variant.price) {
              $('.sale-sticker span').html(Shopify.translation.sale).parent().removeClass('is-hidden');
            }
          } //Sale


          if (variant.compare_at_price > variant.price) {
            $('.js-current-price').addClass('sale');
          } else {
            $('.js-current-price').removeClass('sale');
          } //Availability


          if (variant.available == false) {
            if (product.collection_handles.indexOf('coming-soon') != -1) {
              // If product tags includes 'coming-soon', replace with Coming soon text
              if (!Shopify.theme_settings.stickers_enabled) {
                // Only show Coming soon text if stickers are disabled
                $('.js-sold-out').html(Shopify.translation.coming_soon);
              }
            } else {
              $('.js-sold-out').html(Shopify.translation.sold_out);
            }
          } else {
            $('.js-sold-out').html('');
          } //Price


          if (variant.available == true) {
            $('.js-notify-form').hide();

            if (variant.compare_at_price > variant.price) {
              $('.js-was-price').html('<span class="money">' + Shopify.formatMoney(variant.compare_at_price, product.money_format) + '</span>');
              $('.js-savings').html(Shopify.translation.savings + ' ' + parseInt((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price) + '% (' + '<span class="money">' + Shopify.formatMoney(variant.compare_at_price - variant.price, product.money_format) + '</span>)');
            }

            if (product.price == Shopify.translation.coming_soon) {
              $('.js-current-price').html(Shopify.translation.coming_soon);
            } else if (variant.price) {
              $('.js-current-price').html('<span class="money">' + Shopify.formatMoney(variant.price, product.money_format) + '</span>');
            } else {
              $('.js-current-price').html(Shopify.translation.free_price_text);
            }

            if (Shopify.theme_settings.show_multiple_currencies) {
              convertCurrencies();
            }
          } else {
            $('.js-notify-form').show();
          }
        }
      };

      var product = globalQuickShopProduct;
      $('.js-current-price').html('');
      $('.js-was-price').html('');
      $('.js-savings').html(''); //Title and Vendor

      $('.js-product-title').html('<a href="' + product.product_in_collection_url + '" title="' + product.escaped_title + '">' + product.title + '</a>');
      $('.js-product-vendor').html('<a href="/collections/vendors?q=' + product.vendor + '">' + product.vendor + '</a>'); //Product Description

      $('.js-full-description').html(product.full_description);
      $('.js-regular-description').html(product.regular_description);
      var productDetails = '<a href="' + product.product_in_collection_url + '" class="secondary_button" title="' + product.escaped_title + ' Details">' + product.details_text + '</a>';
      $('.js-product-details').html(productDetails); //Collection stickers

      if (Shopify.theme_settings.stickers_enabled) {
        $.each(product.collection_handles, function (value, index) {
          switch (this.toString()) {
            case 'best-seller':
              $('.best-seller-sticker span').html(Shopify.translation.best_seller).parent().removeClass('is-hidden');
              break;

            case 'coming-soon':
              $('.coming-soon-sticker span').html(Shopify.translation.coming_soon).parent().removeClass('is-hidden');
              break;

            case 'new':
              $('.new-sticker span').html(Shopify.translation.new_sticker).parent().removeClass('is-hidden');
              break;

            case 'pre-order':
              $('.pre-order-sticker span').html(Shopify.translation.pre_order).parent().removeClass('is-hidden');
              break;

            case 'staff-pick':
              $('.staff-pick-sticker span').html(Shopify.translation.staff_pick).parent().removeClass('is-hidden');
          }
        });
      }

      if (product.single_variant == 'true') {
        getQuickShopInfo(product);
      } else {
        for (var i = 0; i < product.variants.length; i++) {
          getQuickShopInfo(product.variants[i]);
        }
      }
    }
  }
};