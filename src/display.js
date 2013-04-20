/*globals jQuery:true*/

(function($) {

  // Defaults for Embedly Display
  // http://embed.ly/docs/display/api
  var defaults = {
    key:              null,            // key, sign up here , http://app.embed.ly/signup (required)
    endpoint:         'display',       // endpoints (display, resize, fill, crop)
    secure:           null,            // use https endpoint vs http
    query:            {}               // available query arguments for Display API see specific endpoint: http://embed.ly/docs/display/api#endpoints
  };

  function none(obj){
    return obj === null || obj === undefined;
  }

  // direct API dealing directly with Embedly's Display API.
  var ImageAPI = function () {};
  ImageAPI.prototype = {
    /*
      For dealing directly with Embedly's Display API.

      options: {
        key: 'Your API key'
        secure: false,
        'endpoint': resize,
        query: {
          width: 500,
          height: 300,
        }
      }
    */
    defaults: {},

    log: function(level, message){
      if (!none(window.console) && !none(window.console[level])){
        window.console[level].apply(window.console, [message]);
      }
    },
    // Based on the method and options, build the image url,
    build: function(method, url, options){
      options = none(options) ? {}: options;

      var secure = options.secure;
      if (none(secure)){
        // If the secure param was not see, use the protocol instead.
        secure = window.location.protocol === 'https:'? true:false;
      }

      var base = (secure ? 'https': 'http') +
        '://i.embed.ly/' + (method === 'display' ? '1/' : '1/display/') + method;

      // Base Query
      var query = none(options.query) ? {} : options.query;
      query.key = options.key;
      base += '?'+$.param(query);

      // Add the image url
      base += '&url='+ encodeURIComponent(url);
      
      return base;
    },
    // Wrappers around build image url function.
    display: function(url, options){
      return this.build('display', url, options);
    },
    resize: function(url, options){
      return this.build('resize', url, options);
    },
    fill: function(url, options){
      return this.build('fill', url, options);
    },
    crop: function(url, options){
      return this.build('crop', url, options);
    }
  };

  var EmbedlyDisplay = function (element, url, options) {
    this.init(element, url, options);
  };

  EmbedlyDisplay.prototype = {
    init: function(elem, original_url, options){
      this.elem = elem;
      this.$elem = $(elem);
      this.original_url = original_url;
      this.options = options;

      // So you can listen when the tag has been initialized;
      this.$elem.trigger('initialized', [this]);
    },

    show: function(){
      var html;
      html = "<a href='" + this.original_url + "' target='_blank'>";
      html += "<img src='" + this.url + "' /></a>";
      this.code = html;
      this.$elem.replaceWith(this.code);
    }
  };

  // Sets up a generic Image API for use.
  $.embedlyDisplay = new ImageAPI();

  // Use with selector to find img tags with data-src attribute
  // e.g. <img data-src="http://embed.ly/static/images/logo.png"></img>
  $.fn.embedlyDisplay = function ( options ) {
    if (options === undefined || typeof options === 'object') {

      // Use the defaults
      options = $.extend({}, defaults, $.embedlyDisplay.defaults, typeof options === 'object' && options);

      // Key Check.
      if (none(options.key)){
        $.embedlyDisplay.log('error', 'Embedly jQuery requires an API Key. Please sign up for one at http://embed.ly/display');
        return this.each($.noop);
      }
      // Keep track of nodes to replace Image API
      var nodes = [];

      // Create the node for all elements
      var create = function (elem){
        if (!$.data($(elem), 'embedly')) {
          var url = $(elem).attr('data-src');
          var node = new EmbedlyDisplay(elem, url, options);
          $.data(elem, 'embedly', node);
          nodes.push(node);
        }
      };

      // Find every image tag with a data-src attribute
      var elems = this.each(function () {
        if ( !none($(this).attr('data-src')) ){
          create(this);
        } else {
          $(this).find('img').each(function(){
            if ( !none($(this).attr('data-src')) ){
              create(this);
            }
          });
        }
      });

      // Set up the image.
      $.each(nodes, function(i, node){
        node.url = $.embedlyDisplay.build(options.endpoint, node.original_url, options);
        node.show();
      });

      return elems;
    }
  };

  // Custom selector.
  $.expr[':'].embedlyDisplay = function(elem) {
    return ! none($(elem).data('embedly'));
  };

}(jQuery));