"use strict";

Shopify.theme.jsMegaMenu = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsMegaMenu = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    var parentLink = this.parent_link;
    var sectionId = this.section_id;
    var $megaMenu = $section.find('.mega-menu__' + sectionId);
    var $parentElement = $('.header__menu [data-navlink-handle="' + parentLink + '"], .sticky-header__menu [data-navlink-handle="' + parentLink + '"]');
    var $parentMobileElement = $('.mobile-menu [data-navlink-handle="' + parentLink + '"]');
    var $parentElementLink = $parentElement.children('.header__link'); // Remove old mega menus

    $parentElement.find('.mega-menu__section').remove();
    $parentMobileElement.find('.mega-menu__section').remove(); // Mobile

    if (!$parentMobileElement.next('ul').length) {
      // Assign class to display dropdown arrow
      $parentMobileElement.find('a').addClass('mobile-menu-link'); // Create dropdown elements

      $('.has-no-menu').each(function () {
        $(this).parent('li').wrap('<div class="has-submenu"></div>');
      });
      $('<span class="close-dropdown"></span>').insertAfter($parentMobileElement.find('a'));
      $('<ul class="mobile-menu__submenu animated slideInDown"></ul>').insertAfter($parentMobileElement); // Insert mega menu

      var $parentList = $parentMobileElement.next('ul');
      $parentList.addClass('has-mega-menu');
      $megaMenu.clone().appendTo($parentList);
    } else {
      var _$parentList = $parentMobileElement.next('ul');

      _$parentList.empty().addClass('has-mega-menu').removeClass('has-dropdown'); // Insert mega menu


      $megaMenu.clone().appendTo(_$parentList);
    } // Desktop


    if ($parentElement.hasClass('header__item') || $parentElement.hasClass('vertical-header__first-level')) {
      // Hide default dropdown
      $parentElement.find('.navbar-dropdown').addClass('is-invisible is-hidden'); // Add arrow to parent link to indicate dropdown

      $parentElementLink.removeClass('is-arrowless');
      $megaMenu.clone().appendTo('.vertical-header__first-level[data-navlink-handle="' + parentLink + '"], .header__item[data-navlink-handle="' + parentLink + '"]'); // Add/remove classes for proper styling and append mega menu instance

      $parentElement.addClass('has-mega-menu');
    }

    $('.navbar-item').on('mouseover', function () {
      //Close any mega menus on hover
      $('.mega-menu__section').removeClass('is-active');

      if ($(this).hasClass('has-mega-menu')) {
        //Toggle corresponding mega menu
        $(this).find('.mega-menu__section').addClass('is-active');
      }
    });
    $('.mega-menu__section, .navbar, .navbar-item, .header__brand').on('mouseleave', function () {
      //Hide mega menu upon leaving mega menu, logo or navbar
      $('.mega-menu__section').removeClass('is-active');
    });
  },
  showThemeEditorState: function showThemeEditorState(id, $section) {
    $('.mega-menu__' + id + ' .mega-menu').addClass('mega-menu--force-show');
    $('.mega-menu__' + id + ' .mega-menu').prev('.header__link').addClass('is-active');
  },
  hideThemeEditorState: function hideThemeEditorState(id, $section) {
    $('.mega-menu__' + id + ' .mega-menu').removeClass('mega-menu--force-show');
    $('.mega-menu__' + id + ' .mega-menu').prev('.header__link').removeClass('is-active');
  },
  displayMenu: function displayMenu(id) {
    $('.mega-menu').removeClass('mega-menu--show');
    $('.mega-menu__' + id + ' .mega-menu').addClass('mega-menu--show');
  },
  hideMenu: function hideMenu(id) {
    $('.mega-menu__' + id + ' .mega-menu').removeClass('mega-menu--show');
  },
  unload: function unload($section) {
    var parentLink = $section.find('.mega-menu').data('parent-link');
    var navLink = $('[data-navlink-handle="' + parentLink + '"]');
    navLink.off();
    navLink.find('.mega-menu__section').remove();
    $('.mega-menu__section, .navbar, .navbar-item, .header__brand').off();
  }
};