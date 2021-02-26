"use strict";

Shopify.theme.jsVideo = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsVideo = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    var $videoElement = $section.find('[data-video-element]');
    var $playButton = $section.find('[data-play-button]');
    var $videoTextContainer = $section.find('[data-video-text-container]'); // Checks whether YouTube/Vimeo (iframe) or HTML5 video

    if (this.iframe_video) {
      this.loadIframeVideo($videoElement, $playButton, $videoTextContainer);
    } else if (this.html5_video) {
      this.loadHTML5Video($videoElement, $playButton, $videoTextContainer);
    }
  },
  loadIframeVideo: function loadIframeVideo($video, $playButton, $videoTextContainer) {
    var _this = this;

    // Get video type (Youtube or Vimeo)
    var videoType = this.video_type; // Set up autoplay and autoloop variables

    var autoplay = this.autoplay ? 1 : 0;
    var autoloop = this.autoloop ? 1 : 0; // Get the source of the video

    var src;

    if (videoType == 'youtube') {
      src = "https://www.youtube.com/embed/".concat(this.video_id, "?&autoplay=").concat(autoplay, "&loop=").concat(autoloop, "&playlist=").concat(this.video_id);
    } else {
      src = "https://player.vimeo.com/video/".concat(this.video_id, "?autoplay=").concat(autoplay, "&loop=").concat(autoloop);
    } // Set up element specific options


    var videoOptions = {
      src: src,
      initinview: this.autoplay ? true : false,
      ratio: this.aspect_ratio
    }; // Set data attributes on video element using videoOptions

    Object.keys(videoOptions).forEach(function (key) {
      var value = videoOptions[key];
      $video.attr("data-".concat(key), value);
    }); // Call lazyframe library to load video

    lazyframe($video, {
      onAppend: function onAppend() {
        if ($video.find('iframe').length > 1) {
          $($video.find('iframe').first().remove());
        }
      }
    }); // Set poster image if it exists

    if (this.poster) {
      $video.css('background-image', "url(".concat(this.poster, ")"));
      $video.addClass('poster-enabled');
    }
    /* If button exists, hide text and poster
     * Note: Autoplay won't work with YouTube iframe videos
     */


    if (this.button) {
      $playButton.on('click', function () {
        _this.hideTextOnVideo($videoTextContainer);

        _this.hidePoster($videoTextContainer);
      });
    } // Clicking anywhere on video should play the video


    if (!this.button) {
      $videoTextContainer.on('click', function () {
        _this.hideTextOnVideo($videoTextContainer);

        _this.hidePoster($videoTextContainer);
      });
    } // If autoplay is true, hide text and poster


    this.isAutoplayEnabled($videoTextContainer);
  },
  loadHTML5Video: function loadHTML5Video($video, $playButton, $videoTextContainer) {
    var _this2 = this;

    // Set up autoplay and autoloop variables
    var autoplay = this.autoplay ? 'autoplay muted' : false;
    var autoloop = this.autoloop ? 'loop' : false;
    var videoType = this.html5_video.indexOf('mp4') !== -1 ? 'mp4' : 'ogg'; // Set attributes on video element

    $video.attr('autoplay', autoplay);
    $video.attr('loop', autoloop);
    $video.find('source').attr('type', "video/".concat(videoType)); // Set poster image if it exists

    if (this.poster) {
      $video.attr('poster', this.poster);
    } // If button exists, click to play video and hide text


    if (this.button) {
      $playButton.on('click', function () {
        _this2.hideTextOnVideo($videoTextContainer);

        _this2.hidePoster($videoTextContainer);

        $video.get(0).play();
      });
    } // Clicking anywhere on video should play the video


    if (!this.button) {
      $videoTextContainer.on('click', function () {
        _this2.hideTextOnVideo($videoTextContainer);

        _this2.hidePoster($videoTextContainer);

        $video.get(0).play();
      });
    } // If autoplay is true, hide text and poster


    this.isAutoplayEnabled($videoTextContainer);
  },
  isAutoplayEnabled: function isAutoplayEnabled($videoTextContainer) {
    if (this.autoplay) {
      Shopify.theme.jsVideo.hideTextOnVideo($videoTextContainer);
      Shopify.theme.jsVideo.hidePoster($videoTextContainer);
    }
  },
  hidePoster: function hidePoster($videoTextContainer) {
    if ($videoTextContainer.parent().find('.lazyvideo').hasClass('poster-enabled')) {
      $videoTextContainer.parent().find('.lazyvideo').removeClass('poster-enabled');
    } else {
      $videoTextContainer.parent().find('.lazyvideo').attr('poster', null);
    }
  },
  hideTextOnVideo: function hideTextOnVideo($videoTextContainer) {
    $videoTextContainer.hide();
  },
  unload: function unload($section) {
    var $playButton = $section.find('[data-play-button]');
    var $videoTextContainer = $section.find('[data-video-text-container]');
    $playButton.off();
    $videoTextContainer.off();
  }
};