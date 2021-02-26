$(document).ready(function(){
  initMobileMenuTab();
  initMobileFormControl();
})

var initMobileMenuTab = function(){
  var $tabHeader = $(".mobile-menu-tabs [data-tab-header]");
  $tabHeader.on('click', function(){
    var tabHandle = $(this).attr('data-tab');
    $(this).prevAll().removeClass('is_active');
    $(this).nextAll().removeClass('is_active');
    if($(this).hasClass('is_active')){
      $(".mobile_menu_back").hide();
      $(".mobile-header__close-menu").show();
      $("body").removeClass("mobile-tab-header");
    }
    else {
      $(".mobile_menu_back").show();
      $(".mobile-header__close-menu").hide();
      $("body").addClass("mobile-tab-header");
    }
    $(this).toggleClass('is_active');
    var $target = $(".mobile-menu-tabs [data-tab-content='" + tabHandle + "']");
    $target.prevAll().removeClass('is_active');
    $target.nextAll().removeClass('is_active');
    $target.toggleClass('is_active');
  })

  $(".mobile_menu_back").on('click', function(e){
    e.preventDefault();
    console.log("back button clicked");
    $(".mobile-menu-tabs .tab-header.is_active").click();
    $(".mobile-menu__toggle-icon").toggleClass("is-active");
    // $(".mobile-menu .mobile-menu__content").css("transform", "unset");
  })
}

var initMobileFormControl = function(){
  $("[data-form]").on('click', function(){
    var formHandle = $(this).attr('data-form');
    $("[data-form-content]").addClass("is-hidden");
    $("[data-form-content='"+ formHandle +"']").removeClass('is-hidden');
  })
}

$('.header__icons .tab-header').on('click', function(evt) {
  var id = $(this).attr('id');
  if(id == "header__account_icon") {
    return;
  }
  evt.preventDefault();
  if($(this).hasClass("is_active")){
    $(this).toggleClass('is_active');
    $(".tab-contents").removeClass("active-tab-content");
    $(".tab-contents").find(".tab-content").removeClass('is_active');
    $("html").removeClass("no-scroll");
    $("body").toggleClass("enable-tab-header");
    if(this.getAttribute('data-toggle-target') == '.data-tab-content-cart') {
      hide_overlay();
    }
  }else{
    $(".header__icons").find(".tab-header").removeClass("is_active");
    $(this).toggleClass('is_active');
    $("body").toggleClass("enable-tab-header");
    $(".tab-contents").addClass("active-tab-content");
    var sel = this.getAttribute('data-toggle-target');
    if(sel == '.data-tab-content-cart') {
      Shopify.theme.jsAjaxCart.updateView();
      show_overlay();
      $("#main_overlay").css('top', topSpacing() + 'px');
      if($(window).width() > 1024) {
        $(".theme-ajax-cart").css('top', topSpacing() + 'px');
      }
    }
    else {
      hide_overlay();
    }
    $('.tab-content').removeClass('is_active').filter(sel).addClass('is_active');
    $("html").addClass("no-scroll");
  }
  
});
// $(document).on('mouseover', '.navbar-item.has-dropdown', function(){
//   $(".tab-contents").find(".tab-content").removeClass('is_active');
//   $(".header__icons").find(".tab-header").removeClass("is_active");
//   $("html").addClass("no-scroll");
//   $("html").addClass("enable_dropdown");
//   $(".dropdown_overlay").removeClass("is_show");
//   $(".tab-contents").removeClass("active-tab-content");
//   $("#main_overlay").css('top', topSpacing() + 'px');
//   show_overlay();
//   $(this).find('.navbar-dropdown').css('z-index', '20');
// });

$(document).on('click', '.ws_type', function(){
  $(this).find(".ws_radio_btn")[0].click();
});
$(".data-tab-content-search #q").keyup(function(){
  var target = $(this);
  if(target.val() != "") target.next().addClass("is_typing");
  else target.next().removeClass("is_typing");
});

$(".tab-content-overlay").click(function(){
  $(this).closest(".navbar").find(".is_active").removeClass("is_active");
  $(this).closest(".navbar").find(".tab-contents").removeClass("active-tab-content");
  console.log($(this).closest('#theme-ajax-cart').length == 0);
  if($(this).closest('#theme-ajax-cart').length == 0) {
    $("html").removeClass("no-scroll");
  }
  $("html").removeClass("enable_dropdown");
  $("[data-ajax-cart-trigger].show-mini-cart [data-toggle-cart]").click();
});

$("#main_overlay").on('click', function(){
  console.log("Main overlay clicked");
  $(".header-cart.show-mini-cart").removeClass('show-mini-cart');
  $("html, body").removeClass('no-scroll');
  hide_overlay();
  $(".mobile-menu__toggle-icon.is-active").removeClass('is-active');
  $(".mobile-menu").css('overflow-y', 'hidden');
  $(".mobile_menu_back").hide();
  $("body").removeClass("mobile-tab-header");
  $(".mobile-header__close-menu").addClass('is_hidden').show();
  $("html.mobile-menu--opened, body.mobile-menu--opened").removeClass('mobile-menu--opened');
  $(".tab-header.header--cart.is_active").click();
  setTimeout(function(){
    $('.mobile-menu').css('width', '0px');
  }, 400);
})

// $(".drop-down-overlay").click(function(){
//   setTimeout(function(){
//     $(".navbar-item.has-dropdown .navbar-dropdown").css('z-index', '-1');
//   }, 300);
//   $(this).css("display", "none");
//   $("html").removeClass("no-scroll");
//   $("html").removeClass("enable_dropdown");
// });

var menu_show = false;
$(document).on('mouseleave', '.navbar-item.has-dropdown', function(){
  $("html").removeClass("no-scroll");
  $("html").removeClass("enable_dropdown");
  hide_overlay();
  var target = $(this).find('.navbar-dropdown');
  $(this).find('.dropdown-menu-wrapper').removeClass('is_visible');
  console.log("navbar leave");
  $(".navigation-overlay").removeClass("is-active");
  // setTimeout(function(){
    target.hide();
    menu_show = false;
  // }, 300);
})
$(document).on('mouseenter', '.navbar-item.has-dropdown', function(){
  if(menu_show == false) {
    $(this).find('.navbar-dropdown').css('display', 'flex');
    var target = $(this).find('.dropdown-menu-wrapper');
    $(".navigation-overlay").addClass("is-active");
    setTimeout(function(){
      target.addClass('is_visible');
      menu_show = true;
    }, 10);
  }
  $(".navbar-item.has-dropdown .navbar-dropdown").css('z-index', '20');
  $(".drop-down-overlay").css("display", "block");
});

$(".mobile-menu-overlay").click(function(){
  $(".mobile-menu__toggle-button").trigger("click");
});

function topSpacing(){
  var headerHeight = $("#shopify-section-header-classic").height();
  var topbarHeight = $("#shopify-section-header__top-bar").height();
  var scrollTop = $(window).scrollTop();
  return headerHeight + topbarHeight - scrollTop;
}

function hide_overlay(){
  $("html, body").removeClass('show-overlay');
  setTimeout(function(){
    $("#main_overlay").css('z-index', '-1');
  }, 300);
}

function show_overlay(){
  $("#main_overlay").css('z-index', '8');
  $("html, body").addClass('show-overlay');
}

$(window).scroll(function() {
  // if(formElement == undefined || !is_window_ready) return;
  // productModalTogglShow();
});

// var formElement = "";
// $(document).ready(function() {
//   formElement = $('.product-form-container').html();
//   if(formElement == undefined) return;
//   if(!$("body").hasClass("product--unavailable") && formElement.includes("<script>") && formElement.includes("</script>")) {
//     formElement = formElement.split("<script>")[0] + $('.product-form-container').html().split("<script>")[1].split("</script>")[1]
//   }
// });

// function productModalTogglShow() {
//   // var product_form = $(".product-form-container").get(0);
//   // if($("body").hasClass("product--unavailable")) var target = $(".product-info__block");;
//   // else var target = $(".button--add-to-cart.ws-bt");
//   var scrollTop = $(window).scrollTop();
//   var target = $(".product-form-container");
//   var target_h = target.offset().top + target.height();
//   if ( scrollTop > target_h ) { 
//     // display add
//     console.log("true");
//     $(".ik-product-modal-wrap .bottom-bar").addClass("is--active");
//     if($("body").hasClass("product--unavailable")) return;
//     $(".ik-product-modal .ik-content").html(formElement);
//     target.html("");
//   }else {
//     console.log("false");
//     $(".ik-product-modal .ik-close-button").click();
//     $(".ik-product-modal-wrap .bottom-bar").removeClass("is--active");
//     if($("body").hasClass("product--unavailable")) return;
//     $(".ik-product-modal .ik-content").html("");
//     target.html(formElement);
//   }
// }

// $(".ik-btn-buy-modal").click(function() {
//   $(".ik-product-modal").addClass("is--active");
// });
// $(".ik-product-modal .ik-close-button").click(function() {
//   $(".ik-product-modal").removeClass("is--active");
// });
// $(".ik-product-modal.is--active").click(function() {
//   $(".ik-product-modal").removeClass("is--active");
// });

$(document).on('click', '.mobile-menu', function(){
  // alert();
  // $(".mobile-header__close-menu").click();
});

window.addEventListener('click', function(e) {
  var modal = document.querySelector('.ik-product-modal');
  if(e.target == modal) {
    modal.classList.toggle('is--active');
  }
});

// // Disable scrolling.
// document.ontouchmove = function (e) {
//   e.preventDefault();
// }

// // Enable scrolling.
// document.ontouchmove = function (e) {
//   return false;
// }