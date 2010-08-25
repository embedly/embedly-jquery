/*
 * Embedly JQuery v1.4.2
 * ==============
 * This library allows you to easily embed objects on any page.
 * 
 * Requirements:
 * -------------
 * jquery-1.3 or higher
 *
 * Usage:
 * ------
 * There are two ways to interact with this lib. One exposes a simple method to call embedly directly
 *
 * >>> $.embedly('http://www.youtube.com/watch?v=LfamTmY5REw', {}, function(oembed){ alert(oembed.title);});
 * 
 * The oembed is either a json object or null
 * 
 * You can also reference it this way, which will try and replace every link on the page with an embed
 * 
 * Documentation is availiable at http://github.com/embedly/embedly-jquery
 *
 * $('a').embedly();
 * 
 * The Options Are as Follows
 * 
 *  maxWidth : null,
 *  maxHeight: null,
 *  urlRe : null,
 *  method : 'replace',
 *  wrapElement : 'div', 
 *  className : 'embed',
 *  addImageStyles : true,
 *  wmode : null} //after
 * 
 * http://api.embed.ly/tools/generator - generate your own regex for only sources you want
 * 
 */
(function($) {
  
  $.embedly = function(url, options, callback){
    options = extendOptions(options);
    
    // maintain a dictionary for each of the embeds with the original url, and a reference to the DOM node
    $.fn.embedly.embedArray = [];
    if (typeof url == "object") {
      for(var i in url) {
        if (urlValid(url[i], options)){
          $.fn.embedly.embedArray.push({"url":url[i]});
        } else {
          callback(null);
        }
      }
      embed($.fn.embedly.embedArray, options, callback);
    } else if (url !== null && urlValid(url, options)){
      $.fn.embedly.embedArray.push({"url":url});
      embed($.fn.embedly.embedArray, options, callback);
    }
    else {
      callback(null);
    }
  };
  
  $.fn.embedly = function(options, callback) {

    options = extendOptions(options);
    callback = (callback != null) ? callback : defaultCallback;
    $.fn.embedly.embedArray = [];
    
    var nodes = this.each(function() {
      // Handles A tags 
      if ($(this).attr('href')){
        //Get the URL
        var elem = $(this);
        var url = elem.attr('href');
        //Make a Callback wrapper
        function wrap(oembed){
          callback(oembed, elem, options);
        }
        // Make sure the URL pass the regex.
        if (url !== null && urlValid(url, options)){
          $.fn.embedly.embedArray.push({"url":url, "node":$(this)});
          //Nope so pass a null to the callback
        } else {
          wrap(null);
        }
      } else {
        // If it's not an a tag find all the urls in the elem
        $(this).find('A').each(function(index, elem){
          elem = $(elem);
          var url = elem.attr('href');
          //Make a Callback wrapper
          function wrap(oembed){ callback(oembed, elem, options); }
          // Make sure the URL pass the regex.
          if (url !== null && urlValid(url, options)){
            $.fn.embedly.embedArray.push({"url":url, "node":$(this)});
            //embed(url, options, wrap);
            //Nope so pass a null to the callback
          } else {
            wrap(null);
          }
        });
      }
    });
    embed($.fn.embedly.embedArray, options, callback);
    return nodes;
  };

  $.fn.embedly.defaults = {
    maxWidth:          null,
    maxHeight:         null,
    method:            "replace", 
    addImageStyles:    true,
    wrapElement:       'div',
    className:         'embed',
    urlRe:             null
  };

  function extendOptions(options){
    // JQuery 1.3 will destroy the urlRe in the $extend. 
    // We have to do a little hack so it doesn't.
    var overrideUrlRe = (typeof options.urlRe == 'undefined')?$.fn.embedly.defaults.urlRe:options.urlRe;
    options = $.extend(true, $.fn.embedly.defaults, options);
    options.urlRe = overrideUrlRe;
    return options;
  }
  
  function defaultCallback(oembed, dict, options){
    var elem = dict.node;
    if(typeof options == "undefined") {options = oembed.options;}
    if (oembed === null) {return;}
 
    switch(options.method)
    {
      case "replace":
        elem.replaceWith(oembed.code);
        break;
      case "after":
        elem.after(oembed.code);
        break;
      case "afterParent":
        elem.parent().after(oembed.code);
        break;
    }
  }

  function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {return false;}
    }
    return true;
  }
    
  function urlValid(url, options) {
    var urlRe = /http:\/\/(.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|youtu\.be\/.*|.*\.youtube\.com\/user\/.*#.*|.*\.youtube\.com\/.*#.*\/.*|.*justin\.tv\/.*|.*justin\.tv\/.*\/b\/.*|www\.ustream\.tv\/recorded\/.*|www\.ustream\.tv\/channel\/.*|www\.ustream\.tv\/.*|qik\.com\/video\/.*|qik\.com\/.*|.*revision3\.com\/.*|.*\.dailymotion\.com\/video\/.*|.*\.dailymotion\.com\/.*\/video\/.*|www\.collegehumor\.com\/video:.*|.*twitvid\.com\/.*|www\.break\.com\/.*\/.*|vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*|www\.myspace\.com\/index\.cfm\?fuseaction=.*&videoid.*|www\.metacafe\.com\/watch\/.*|blip\.tv\/file\/.*|.*\.blip\.tv\/file\/.*|video\.google\.com\/videoplay\?.*|.*revver\.com\/video\/.*|video\.yahoo\.com\/watch\/.*\/.*|video\.yahoo\.com\/network\/.*|.*viddler\.com\/explore\/.*\/videos\/.*|liveleak\.com\/view\?.*|www\.liveleak\.com\/view\?.*|animoto\.com\/play\/.*|dotsub\.com\/view\/.*|www\.overstream\.net\/view\.php\?oid=.*|www\.livestream\.com\/.*|www\.worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|worldstarhiphop\.com\/videos\/video.*\.php\?v=.*|teachertube\.com\/viewVideo\.php.*|teachertube\.com\/viewVideo\.php.*|bambuser\.com\/v\/.*|bambuser\.com\/channel\/.*|bambuser\.com\/channel\/.*\/broadcast\/.*|www\.schooltube\.com\/video\/.*\/.*|.*yfrog\..*\/.*|tweetphoto\.com\/.*|www\.flickr\.com\/photos\/.*|.*twitpic\.com\/.*|.*imgur\.com\/.*|.*\.posterous\.com\/.*|post\.ly\/.*|twitgoo\.com\/.*|i.*\.photobucket\.com\/albums\/.*|gi.*\.photobucket\.com\/groups\/.*|phodroid\.com\/.*\/.*\/.*|www\.mobypicture\.com\/user\/.*\/view\/.*|moby\.to\/.*|xkcd\.com\/.*|www\.xkcd\.com\/.*|www\.asofterworld\.com\/index\.php\?id=.*|www\.qwantz\.com\/index\.php\?comic=.*|23hq\.com\/.*\/photo\/.*|www\.23hq\.com\/.*\/photo\/.*|.*dribbble\.com\/shots\/.*|drbl\.in\/.*|.*\.smugmug\.com\/.*|.*\.smugmug\.com\/.*#.*|emberapp\.com\/.*\/images\/.*|emberapp\.com\/.*\/images\/.*\/sizes\/.*|emberapp\.com\/.*\/collections\/.*\/.*|emberapp\.com\/.*\/categories\/.*\/.*\/.*|embr\.it\/.*|picasaweb\.google\.com.*\/.*\/.*#.*|picasaweb\.google\.com.*\/lh\/photo\/.*|picasaweb\.google\.com.*\/.*\/.*|dailybooth\.com\/.*\/.*|brizzly\.com\/pic\/.*|pics\.brizzly\.com\/.*\.jpg|img\.ly\/.*|www\.facebook\.com\/photo\.php.*|www\.tinypic\.com\/view\.php.*|tinypic\.com\/view\.php.*|www\.tinypic\.com\/player\.php.*|tinypic\.com\/player\.php.*|www\.tinypic\.com\/r\/.*\/.*|tinypic\.com\/r\/.*\/.*|.*\.tinypic\.com\/.*\.jpg|.*\.tinypic\.com\/.*\.png|meadd\.com\/.*\/.*|meadd\.com\/.*|.*\.deviantart\.com\/art\/.*|.*\.deviantart\.com\/gallery\/.*|.*\.deviantart\.com\/#\/.*|fav\.me\/.*|.*\.deviantart\.com|.*\.deviantart\.com\/gallery|.*\.deviantart\.com\/.*\/.*\.jpg|.*\.deviantart\.com\/.*\/.*\.gif|.*\.deviantart\.net\/.*\/.*\.jpg|.*\.deviantart\.net\/.*\/.*\.gif|www\.whitehouse\.gov\/photos-and-video\/video\/.*|www\.whitehouse\.gov\/video\/.*|wh\.gov\/photos-and-video\/video\/.*|wh\.gov\/video\/.*|www\.hulu\.com\/watch.*|www\.hulu\.com\/w\/.*|hulu\.com\/watch.*|hulu\.com\/w\/.*|movieclips\.com\/watch\/.*\/.*\/|movieclips\.com\/watch\/.*\/.*\/.*\/.*|.*crackle\.com\/c\/.*|www\.fancast\.com\/.*\/videos|www\.funnyordie\.com\/videos\/.*|www\.vimeo\.com\/groups\/.*\/videos\/.*|www\.vimeo\.com\/.*|vimeo\.com\/groups\/.*\/videos\/.*|vimeo\.com\/.*|www\.ted\.com\/talks\/.*\.html.*|www\.ted\.com\/talks\/lang\/.*\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/lang\/.*\/.*\.html.*|.*omnisio\.com\/.*|.*nfb\.ca\/film\/.*|www\.thedailyshow\.com\/watch\/.*|www\.thedailyshow\.com\/full-episodes\/.*|www\.thedailyshow\.com\/collection\/.*\/.*\/.*|movies\.yahoo\.com\/movie\/.*\/video\/.*|movies\.yahoo\.com\/movie\/.*\/info|movies\.yahoo\.com\/movie\/.*\/trailer|www\.colbertnation\.com\/the-colbert-report-collections\/.*|www\.colbertnation\.com\/full-episodes\/.*|www\.colbertnation\.com\/the-colbert-report-videos\/.*|www\.comedycentral\.com\/videos\/index\.jhtml\?.*|www\.theonion\.com\/video\/.*|theonion\.com\/video\/.*|wordpress\.tv\/.*\/.*\/.*\/.*\/|www\.traileraddict\.com\/trailer\/.*|www\.traileraddict\.com\/clip\/.*|www\.traileraddict\.com\/poster\/.*|www\.escapistmagazine\.com\/videos\/.*|www\.trailerspy\.com\/trailer\/.*\/.*|www\.trailerspy\.com\/trailer\/.*|www\.trailerspy\.com\/view_video\.php.*|www\.atom\.com\/.*\/.*\/|fora\.tv\/.*\/.*\/.*\/.*|www\.spike\.com\/video\/.*|www\.gametrailers\.com\/video\/.*|gametrailers\.com\/video\/.*|www\.koldcast\.tv\/video\/.*|www\.koldcast\.tv\/#video:.*|techcrunch\.tv\/watch.*|techcrunch\.tv\/.*\/watch.*|www\.godtube\.com\/featured\/video\/.*|www\.tangle\.com\/view_video.*|soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|www\\.last\\.fm\/music\/.*|www\\.last\\.fm\/music\/+videos\/.*|www\\.last\\.fm\/music\/+images\/.*|www\\.last\\.fm\/music\/.*\/_\/.*|www\\.last\\.fm\/music\/.*\/.*|www\.mixcloud\.com\/.*\/.*\/|espn\.go\.com\/video\/clip.*|espn\.go\.com\/.*\/story.*|cnbc\.com\/id\/.*|cbsnews\.com\/video\/watch\/.*|www\.cnn\.com\/video\/.*|edition\.cnn\.com\/video\/.*|money\.cnn\.com\/video\/.*|today\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/vp\/.*|www\.msnbc\.msn\.com\/id\/.*\/ns\/.*|today\.msnbc\.msn\.com\/id\/.*\/ns\/.*|multimedia\.foxsports\.com\/m\/video\/.*\/.*|msn\.foxsports\.com\/video.*|.*amazon\..*\/gp\/product\/.*|.*amazon\..*\/.*\/dp\/.*|.*amazon\..*\/dp\/.*|.*amazon\..*\/o\/ASIN\/.*|.*amazon\..*\/gp\/offer-listing\/.*|.*amazon\..*\/.*\/ASIN\/.*|.*amazon\..*\/gp\/product\/images\/.*|www\.amzn\.com\/.*|amzn\.com\/.*|www\.shopstyle\.com\/browse.*|www\.shopstyle\.com\/action\/apiVisitRetailer.*|www\.shopstyle\.com\/action\/viewLook.*|gist\.github\.com\/.*|twitter\.com\/.*\/status\/.*|twitter\.com\/.*\/statuses\/.*|www\.crunchbase\.com\/.*\/.*|crunchbase\.com\/.*\/.*|www\.slideshare\.net\/.*\/.*|.*\.scribd\.com\/doc\/.*|screenr\.com\/.*|polldaddy\.com\/community\/poll\/.*|polldaddy\.com\/poll\/.*|answers\.polldaddy\.com\/poll\/.*|www\.5min\.com\/Video\/.*|www\.howcast\.com\/videos\/.*|www\.screencast\.com\/.*\/media\/.*|screencast\.com\/.*\/media\/.*|www\.screencast\.com\/t\/.*|screencast\.com\/t\/.*|issuu\.com\/.*\/docs\/.*|www\.kickstarter\.com\/projects\/.*\/.*|www\.scrapblog\.com\/viewer\/viewer\.aspx.*|my\.opera\.com\/.*\/albums\/show\.dml\?id=.*|my\.opera\.com\/.*\/albums\/showpic\.dml\?album=.*&picture=.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*|www\.polleverywhere\.com\/polls\/.*|www\.polleverywhere\.com\/multiple_choice_polls\/.*|www\.polleverywhere\.com\/free_text_polls\/.*|www\.quantcast\.com\/wd:.*|www\.quantcast\.com\/.*|siteanalytics\.compete\.com\/.*|statsheet\.com\/statplot\/charts\/.*\/.*\/.*\/.*|statsheet\.com\/statplot\/charts\/e\/.*|statsheet\.com\/.*\/teams\/.*\/.*|statsheet\.com\/tools\/chartlets\?chart=.*|.*\.status\.net\/notice\/.*|identi\.ca\/notice\/.*|shitmydadsays\.com\/notice\/.*)/i;
    return (url.match(urlRe) !== null && (options.urlRe ===null || url.match(options.urlRe) !== null));
  }
    
  function embed(urlArray, options, callback){
    var BATCH_SIZE = 20;         // we want to limit our batch size to 20 links at a time
    var total = urlArray.length;
    var batches = Math.ceil(total / BATCH_SIZE);    
    
    for (var b=1; b <= batches; b++){
      var urls = '';
      var start = (b * BATCH_SIZE) - BATCH_SIZE;
      var end = start + (BATCH_SIZE-1);
      if (b >= (batches - 1) ) { end = start + total; }
      for (var i=start; i<end; i++){
        urls += escape(urlArray[i].url);
        if( i < (end - 1 ) ) {urls += ","; }
      }
      //Build The URL
			if(typeof urlArray[0].node == "object"){
      	var dimensions = { "width": urlArray[0].node.parent().width(), "height": urlArray[0].node.parent().height()};
			}
      var fetchUrl = 'http://api.embed.ly/v1/api/oembed?';
      fetchUrl += "format=json&urls=" + urls;

      //Deal with maxwidth and max height
      if (options.maxWidth !== null) { fetchUrl += "&maxwidth=" + options.maxWidth; }
      else if(typeof dimensions != "undefined" ){ fetchUrl += "&maxwidth=" + dimensions.width; }                            // we really only need to limit the width. 
      if (options.maxHeight !== null) { fetchUrl += "&maxheight=" + options.maxHeight; }  // Most containers have variable height
      if (options.wmode !== null) { fetchUrl += "&wmode=" + options.wmode; } // If you're concerned about height, set a maxheight
      fetchUrl += "&callback=?";

      //Make the call to Embedly
      $.ajax( {
        url: fetchUrl,
        dataType: 'json',
        success: function(data){ ajaxSuccess(data, options, callback); },
        error : function(){ callback(null); }
      });
      total = Math.max((total - BATCH_SIZE), 0);
    }
  }

  function ajaxSuccess(data, options, callback){
    //Make sure the response isn't empty
    if (isEmpty(data) || data.hasOwnProperty('error_code')){
      callback(null);
      return;
    }
    for (var i in data){
      if( data[i].hasOwnProperty('title')){   // if the returned object has the necessary oembed data
        var node = $.fn.embedly.embedArray[i];
        // pass in the dictionary for the embed with the original url and node reference
        handleEmbed(node, data[i], options, callback );
      }
    }
  }
  
  function handleEmbed(dict, data, options, callback){
    //Wrap The Element
    var code = '', title = '';
    if (options.wrapElement !==null) { code += '<'+options.wrapElement+' class="'+options.className+'">'; }
    
    switch (data.type) {
      case "photo":
        title = data.title ? data.title : '';
        //Because of photos like twitpic and tweetphoto we need to let the browser do some of the work
        var style = '';
        if (options.addImageStyles) {
          if (options.maxWidth !== null) { style += 'max-width:'+options.maxWidth+'px; '; }
          if (options.maxHeight !== null) { style += 'max-height:'+options.maxHeight+'px; '; }
        }
        code += '<a href="' + dict.url + '" target="_blank"><img style="'+style+'" src="' + data.url + '" alt="' + title + '"/></a>';
        break;
      case "video":
        code += data.html;
        break;
      case "rich":
        code += data.html;
        break;
      default :
        title = data.title ? data.title : dict.url; 
        code += '<a href="' + dict.url + '">' + title + '</a>';
        break;
    }
    
    if (options.wrapElement !==null) {
      code += '</'+options.wrapElement+'>';
    }

    data.code = code;
    callback(data, dict, options);
  }
})(jQuery);
