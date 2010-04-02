/*
 * Embedly JQuery
 * ==============
 * This library allows you to easily embed objects on any page.
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
 * $('a').embedly();
 * 
 * The Options Are as Follows
 * 
 * {maxWidth : null,
 *  maxHeight: null,
 *  method : 'replace',
 *  wrapElement : null, 
 *  className : 'embed',
 *  addImageStyles : true} //after
 * 
 */
(function($) {
	$.embedly = function(url, options, callback){

		options = $.extend(true, $.fn.embedly.defaults, options);

		if (url != null && url.match(options.urlRe) != null)
    		embed(url, options, callback);
    	else
    		callback(null)

	}
    $.fn.embedly = function(options, callback) {

    	options = $.extend(true, $.fn.embedly.defaults, options);

    	callback = (callback != null) ? callback : defaultCallback
    	
        return this.each(function() {
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
        		if (url != null && url.match(options.urlRe) != null){
        			embed(url, options, wrap);
        		//Nope so pass a null to the callback
        		} else {
        			wrap(null)
        		}
        	} else {
        		// If it's not an a tag find all the urls in the elem
        		$(this).find('A').each(function(index, elem){
	        		elem = $(elem);
	        		var url = elem.attr('href');
	        		//Make a Callback wrapper
	        		function wrap(oembed){
	        			callback(oembed, elem, options);
	        		}
	        		// Make sure the URL pass the regex.
	        		if (url != null && url.match(options.urlRe) != null){
	        			embed(url, options, wrap);
	        		//Nope so pass a null to the callback
	        		} else {
	        			wrap(null)
	        		}
	        	});
        	}
        });
    };

    $.fn.embedly.defaults = {
        maxWidth: null,
        maxHeight: null,
		method: "replace", // 'after'
		addImageStyles : true,
		wrapElement : 'div',
		className : 'embed',
		urlRe : /(http:\/\/.*\.youtube\.com\/watch.*|http:\/\/youtu\.be\/.*|http:\/\/www\.veoh\.com\/.*\/watch\/.*|http:\/\/www\.justin\.tv\/clip\/.*|http:\/\/www\.justin\.tv\/.*|http:\/\/www\.ustream\.tv\/recorded\/.*|http:\/\/www\.ustream\.tv\/channel\/.*|http:\/\/qik\.com\/video\/.*|http:\/\/qik\.com\/.*|http:\/\/.*revision3\.com\/.*|http:\/\/.*\.dailymotion\.com\/video\/.*|http:\/\/www\.collegehumor\.com\/video:.*|http:\/\/www\.twitvid\.com\/.*|http:\/\/www\.break\.com\/.*\/.*|http:\/\/vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*|http:\/\/www\.myspace\.com\/index\.cfm\?fuseaction=.*&videoid.*|http:\/\/www\.metacafe\.com\/watch\/.*|http:\/\/blip\.tv\/file\/.*|http:\/\/video\.google\.com\/videoplay\?.*|http:\/\/revver\.com\/video\/.*|http:\/\/video\.yahoo\.com\/watch\/.*\/.*|http:\/\/video\.yahoo\.com\/network\/.*|http:\/\/.*viddler\.com\/explore\/.*\/videos\/.*|http:\/\/yfrog\..*\/.*|http:\/\/tweetphoto\.com\/.*|http:\/\/www\.flickr\.com\/photos\/.*|http:\/\/twitpic\.com\/.*|http:\/\/.*imgur\.com\/.*|http:\/\/.*\.posterous\.com\/.*|http:\/\/twitgoo\.com\/.*|http:\/\/i.*\.photobucket\.com\/albums\/.*|http:\/\/gi.*\.photobucket\.com\/groups\/.*|http:\/\/phodroid\.com\/.*\/.*\/.*|http:\/\/xkcd\.com\/.*|http:\/\/www\.asofterworld\.com\/index\.php\?id=.*|http:\/\/www\.qwantz\.com\/index\.php\?comic=.*|http:\/\/23hq\.com\/.*\/photo\/.*|http:\/\/www\.23hq\.com\/.*\/photo\/.*|http:\/\/www\.hulu\.com\/watch\/.*|http:\/\/.*\.movieclips\.com\/watch\/.*|http:\/\/.*crackle\.com\/c\/.*|http:\/\/www\.fancast\.com\/.*\/videos|http:\/\/www\.funnyordie\.com\/videos\/.*|http:\/\/www\.vimeo\.com\/groups\/.*\/videos\/.*|http:\/\/www\.vimeo\.com\/.*|http:\/\/www\.ted\.com\/.*|http:\/\/www\.omnisio\.com\/.*|http:\/\/.*nfb\.ca\/film\/.*|http:\/\/www\.thedailyshow\.com\/watch\/.*|http:\/\/www\.thedailyshow\.com\/full-episodes\/.*|http:\/\/www\.thedailyshow\.com\/collection\/.*\/.*\/.*|http:\/\/movies\.yahoo\.com\/movie\/.*\/video\/.*|http:\/\/movies\.yahoo\.com\/movie\/.*\/info|http:\/\/movies\.yahoo\.com\/movie\/.*\/trailer|http:\/\/www\.colbertnation\.com\/the-colbert-report-collections\/.*|http:\/\/www\.colbertnation\.com\/full-episodes\/.*|http:\/\/www\.colbertnation\.com\/the-colbert-report-videos\/.*|http:\/\/wordpress\.tv\/.*\/.*\/.*\/.*\/|http:\/\/www\.traileraddict\.com\/trailer\/.*|http:\/\/www\.traileraddict\.com\/clip\/.*|http:\/\/www\.traileraddict\.com\/poster\/.*|http:\/\/.*amazon\..*\/gp\/product\/.*|http:\/\/.*amazon\..*\/.*\/dp\/.*|http:\/\/.*amazon\..*\/dp\/.*|http:\/\/.*amazon\..*\/o\/ASIN\/.*|http:\/\/.*amazon\..*\/gp\/offer-listing\/.*|http:\/\/www\.slideshare\.net\/.*\/.*|http:\/\/.*\.scribd\.com\/doc\/.*|http:\/\/screenr\.com\/.*|http:\/\/www\.5min\.com\/Video\/.*|http:\/\/www\.howcast\.com\/videos\/.*|http:\/\/www\.clearspring\.com\/widgets\/.*|http:\/\/my\.opera\.com\/.*\/albums\/show\.dml\?id=.*|http:\/\/my\.opera\.com\/.*\/albums\/showpic\.dml\?album=.*&picture=.*)/i
	};

    function defaultCallback(oembed, elem, options){
 			if (oembed == null)
 				return;
 
 			switch(options.method)
 			{
 				case "replace":	
 					elem.replaceWith(oembed.code);
 					break;
 				case "after":
 					elem.after(oembed.code);			
 					break;
 			}
    };

    function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    };

    function embed(url, options, callback){

    	//Build The URL
    	var fetchUrl = 'http://api.embed.ly/v1/api/oembed?';

    	fetchUrl += "format=json&url=" + escape(url);

    	//Deal with maxwidth and max height
		if (options.maxWidth != null)
			fetchUrl += "&maxwidth=" + options.maxWidth;	

		if (options.maxHeight != null)
			fetchUrl += "&maxheight=" + options.maxHeight;
 
		fetchUrl += "&callback=?";

		//Make the call to Embedly
    	$.ajax( {url: fetchUrl,
			  	dataType: 'json',
			  	success: function(data) {
    				//Make sure the response isn't empty
    				if (isEmpty(data) || data.hasOwnProperty('error')){
    					callback(null);
    				}
  
    				//Wrap The Element
    				var code = '';
    				if (options.wrapElement !=null)
    					code += '<'+options.wrapElement+' class="'+options.className+'">';

	                switch (data.type) {
	                    case "photo":
	                    	var title = data.title ? data.title : '';
	                    
	        				//Because of photos like twitpic and tweetphoto we need to let the browser do some of the work
	                    	var style = '';
	        				if (options.addImageStyles)
	                        	if (options.maxWidth != null)
	                        		style += 'max-width:'+options.maxWidth+'px; '
	                        	if (options.maxHeight != null)
	    	                    	style += 'max-height:'+options.maxHeight+'px; '

	                    	code += '<a href="' + url + '" target="_blank"><img style="'+style+'" src="' + data.url + '" alt="' + title + '"/></a>';
	                        break;
	                    case "video":
	                    	code += data.html;
	                        break;
	                    case "rich":
	                    	code += data.html;
	                        break;
	                    default :
	                    	code += '<a href="' + url + '">' + (data.title != null) ? data.title : url + '</a>';
	                    	break;
	                }
    				
    				if (options.wrapElement !=null)
    					code += '</'+options.wrapElement+'>';
 
    				data.code = code;
 
    				callback(data);
    			},
    			error : function(){
    				callback(null);
    			}
    	});
    };
})(jQuery);