/*
 * Licensed under the MIT license
 */

(function($) {
  "use strict";

  var ImageSelector = function(select, options) {
    this.options = options;
    this.$select = $(select);
    this._init();
  };

  ImageSelector.prototype = {

    constructor : ImageSelector,

    _init : function() {

      var callback = this.options.callback;

      var selectValue = this.$select.val();
      var selectImage = this.$select.find("option:selected").data("image");

      var $markupUl = $("<ul>").addClass("dropdown-menu").addClass("dropdown-caret");
      var $markupDiv = $("<div>").addClass("dropdown").addClass("dropdown-imageselector");
      var $markupSpan = $('<img src="' + selectImage + '" >').addClass("btn-imageselector");
      var $markupA = $("<a>").attr("data-toggle", "dropdown").addClass("dropdown-toggle").attr("href", "#").append($markupSpan);

      // create an li-tag for every option of the select
      $("option", this.$select).each(function() {

        var option = $(this);
        var value = option.attr("value");
        var image = option.data("image");
        var title = option.text();

        // create a-tag
        var $markupA = $("<a>").addClass("image-btn");
        if (option.prop("selected") === true || selectValue === image) {
          $markupA.addClass("selected");
        }
        //$markupA.css("background-image", 'url(' + image + ')');
        $markupA.attr("href", "#").attr("data-image", image).attr("data-value", value).attr("title", title);

        var $markupImg = $('<img src="' + image + '" >');
        $markupA.append($markupImg);

        // create li-tag
        $markupUl.append($("<li>").append($markupA));
      });

      // append the imageselector
      $markupDiv.append($markupA);
      // append the imageselector-dropdown
      $markupDiv.append($markupUl);

      // hide the select
      this.$select.hide();

      // insert the imageselector
      this.$selector = $($markupDiv).insertAfter(this.$select);

      // register change handler
      this.$select.on("change", function() {

        var value = $(this).val();
        var image = $(this).find("option[value='" + value + "']").data("image");
        var title = $(this).find("option[value='" + value + "']").text();

        // remove old and set new selected image
        $(this).next().find("ul").find("li").find(".selected").removeClass("selected");
        $(this).next().find("ul").find("li").find("a[data-image='" + image + "']").addClass("selected");

        $(this).next().find(".btn-imageselector").attr("src", image);

        callback(value, image, title);
      });

      // register click handler
      $markupUl.on('click.imageselector', $.proxy(this._clickImage, this));
    },

    _clickImage : function(e) {

      var a = $(e.target).parent();

      if (!a.is(".image-btn")) {
        return false;
      }

      this.$select.val(a.data("value")).change();

      e.preventDefault();
      return true;
    },

    setImage : function(image) {
      // find value for image
      var value = $(this.$selector).find("li").find("a[data-image='" + image + "']").data("value");
      this.setValue(value);
    },

    setValue : function(value) {
      this.$select.val(value).change();
    },

  };

  $.fn.imageselector = function(option) {
    var args = Array.apply(null, arguments);
    args.shift();

    return this.each(function() {

      var $this = $(this), data = $this.data("imageselector"), options = $.extend({}, $.fn.imageselector.defaults, $this.data(), typeof option == "object" && option);

      if (!data) {
        $this.data("imageselector", (data = new ImageSelector(this, options)));
      }
      if (typeof option == "string") {
        data[option].apply(data, args);
      }
    });
  };

  $.fn.imageselector.defaults = {
    callback : function(value, image, title) {
    },
    imagesPerRow : 1
  };

  $.fn.imageselector.Constructor = ImageSelector;

})(jQuery, window, document);
