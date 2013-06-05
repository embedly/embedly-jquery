Embedly jQuery
==============
Embedly jQuery is a jQuery Library for interacting with the Embedly API.

Basic Setup
-----------
Embedly jQuery requires jQuery 1.5 or greater as it uses `Deferred Objects
<http://api.jquery.com/category/deferred-object/>`_. For older versions of
jQuery see version `2.2.2
<https://github.com/embedly/embedly-jquery/tree/v2.2.0>`_. Add jQuery and
Embedly jQuery to your document.
::

  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js" type="text/javascript"></script>
    <script src="http://cdn.embed.ly/jquery.embedly-3.1.1.min.js" type="text/javascript"></script>
  </head>


You can now use jQuery selectors to replace links with embedded content::

  $('#content a').embedly({key: 'Your Embedly Key'});


Or can now use the client directly::

  $.embedly.extract('http://embed.ly', {key: 'Your Embedly Key'}).progress(function(data){
    alert(data.title);
  });


Key
---
Embedly requires that you pass a key with every request. To signup for a key
please visit `app.embed.ly/signup <http://app.embed.ly/signup>`_. To avoid adding your
key to every ``$.embedly`` call you can add it to the ``defaults`` like so::

  $.embedly.defaults.key = 'Your Embedly Key';

  # Directly
  $.embedly.extract('http://embed.ly').progress(function(data){alert(data.title)});

  # CSS Selector
  $('a').embedly();

Otherwise you must add it to every request like so::

  # Directly
  $.embedly.extract('http://embed.ly', {key:'Your Embedly Key'})
    .progress(function(data){alert(data.title)});

  # CSS Selector
  $('a').embedly({key:'Your Embedly Key'});

For the rest of the documentation we will assume that you set up the defaults
or passing the ``key`` directly into the call.


Selector
--------
Use a CSS selector to replace every valid link with an embed on the page.
::

  $('a').embedly( options );

  # Replace all valid links
  $('a').embedly();

  # Replace a subset of links
  $('a.oembed').embedly();

  # Replace with maxWidth option set to 600px and method option set
  # to 'after'
  $('a').embedly({query: {maxwidth: 600}, 'method':'after'});

  # Replace only Hulu links
  $('a').embedly({
    query: {maxwidth: 600},
    urlRe: /http:\/\/(www\.hulu\.com\/watch.*)/i,
    method:'after'
  });

  # Embedly supports chaining, so you can modify your original jQuery set
  # after triggering Embedly
  $('a').embedly().css('backgroundColor','#dadada');


Client
------
The Selector is excellent for inserting Embedly data into the DOM, but if you
would like even more control on how you use Embedly data, then use the Client
directly.

The client follows jQuery's Promise pattern. You should be familiar with the
concept of `Deferred Objects
<http://api.jquery.com/category/deferred-object/>`_.
before using the Client, but we will explain in a simple example here.
::

  var deferred = $.embedly.extract(['http://embed.ly', 'http://google.com'], {
    key: 'xxxxxx',
    query: {
      words: 20,
    }
  }).progress(function(data){
    // Called after each URL has been returned from the Embedly server. Order
    // is not preserved for this method, so for long lists where URLs need to
    // be batched the data results will likely be out of order.
    console.log(data.url, data.title);
  }).done(function(results){
    // Called after the call has been completed with every data result in a
    // list. Order is preserved in this method regardless of batching.
    $.each(results, function(i, data){
      console.log(data.original_url)
    });
  });

  // Deferred objs retain information, so you can register callbacks even after
  // the ajax call was completed.
  deferred.done(function(results){
    // This will execute immediately if the ajax call is complete
    console.log('done', results.length);
  });

  deferred.progress(function(data){
    // If the call has been completed, the deferred object will only pass back
    // the last object that was sent to the notify function. You should
    // register a progress function immediately after the embedly client call
    // to catch all notify events.
    alert('last object', data.url);
  });

You can also pass a single URL to the client, but the ``done`` method will
always be passed a list of results.
::

  $.embedly.oembed('http://embed.ly').progress(function(data){
    // Will only be called once in this case.
    console.log(data.url, data.title);
  }).done(function(results){
    // Even though there was only one url, this will still be a list of
    // results.
    var data = results[0];
  });

Methods
"""""""
The client only has 4 methods

``oembed``
  Corresponds to Embedly's `oEmbed
  <http://embed.ly/docs/endpoints/1/oembed>`_ API Endpoint.
  Available with `Embed product <http://embed.ly/embed>`_.

``extract``
  Corresponds to Embedly's `Extract
  <http://embed.ly/docs/extract/api/endpoints/1/extract>`_ API Endpoint.
  Available with `Extract product <http://embed.ly/extract>`_.

``preview``
  Corresponds to Embedly's `Preview
  <http://embed.ly/docs/endpoints/1/preview>`_ API Endpoint.
  Available with `Legacy plans <http://embed.ly/docs/endpoints>`_.

``objectify``
  Corresponds to the Embedly's `Objectify
  <http://embed.ly/docs/endpoints/2/objectify>`_ API Endpoint.
  Available with `Legacy plans <http://embed.ly/docs/endpoints>`_.

Batching
""""""""
Embedly's API only accepts a maximum of 20 URLs per API request, because of
this the ``ajax`` method automatically batches URLs into groups of 20. The
``progress`` method will still return when the data of a URL is ready and the
``done`` method will retain order. If you would like a smaller batch size you
can specify ``batch`` in the options like so::

  $.embedly.oembed(['http://embed.ly', ....], {batch:10}).done(function(results){
    console.log(results.length);
  });

Data
""""
The data passed back by the client is a JSON Object of the data return by the
Embedly API. For more information on responses see the Response documentation.

The only difference is that the ``oEmbed`` data object contains an
``original_url`` attribute that is used for book keeping purposes.


Options
-------
``key`` [`string:''`]
  You can `sign up <http://app.embed.ly/signup>`_ or `log in
  <http://app.embed.ly/login>`_ as an existing user to retrieve your Embedly
  key. A key will allow higher usage levels and extra features, see `products
  <http://embed.ly/products>`_.

``query`` [`Object:default object`]
  A direct pass though to all the Query Arguments that the Embedly API accepts.
  These will be combined with the ``key``, ``endpoint`` and the ``urls`` to
  form the request to Embedly.::

    query: {
      maxwidth: 400,
      maxheight: 400,
      chars: 200,
      autoplay: true
      ...
    }

  For more information, read the `Query Arguments
  <http://embed.ly/docs/embed/api/arguments>`_ documentation.

``display`` [`Function:default function`]

  This method will embed the content on the page. As a convenience Embedly has
  a simple display function built in if you are using the ``oembed`` endpoint.
  It will create an image for ``photo`` types, a simple title and description
  embed for ``link`` types and directly embed the html for ``rich`` and
  ``video`` types.

  Generally you will want to overwrite this function for a more customized look
  and feel.

  ``display`` should accept a data object::

    $('a').embedly({display:function(data){
      $(this).text(data.title);
    });

``method`` [`String:'replace'`]
  A string value to tell Embedly how to place the content in your page when
  using the default display function.

  * `replace` - replaces the link with the content
  * `after` - inserts the content after the link
  * `afterParent` - inserts the content after the parent element
  * `replaceParent` - replaces parent element with the embed content

``wrapElement`` [`String:'div'`]
  A string value representing the valid HTML element to wrap the content in.

``className`` [`String:'embed'`]
  A string value representing a CSS class you would like to assign to the
  wrapElement.

``addImageStyles`` [`Boolean:true`]
  A boolean value representing whether or not Embedly should use the style
  element to resize images based on the maxWidth and maxHeight parameters.

``endpoint`` [`String:oembed`]
  A string value that maps to our Embedly endpoints. The Preview and
  Objectify endpoints are only available for
  `Legacy plans <http://embed.ly/docs/endpoints>`_.

  * `oembed <http://embed.ly/docs/endpoints/1/oembed>`_ - a standard in 3rd
    party embedding, contains a finite set of attributes.
  * `extract <http://embed.ly/docs/extract/api/endpoints/1/extract>`_ - returns
    a wide variety of attributes (article text, images, dominant colors,
    keywords, related links, and embeds in page) for creating an experience
    with your links.
  * `preview <http://embed.ly/docs/endpoints/1/preview>`_ - returns a larger
    set of attributes (multiple images, RSS content, and embeds in page) for
    customizing your embeds.
  * `objectify <http://embed.ly/docs/endpoints/2/objectify>`_ - returns all of
    the meta and API data Embedly has for a link. Advanced users.

  Developers intending to use Extract, Preview, or Objectify will have to
  include their own ``display`` callback function for handling the embeds.
  Our default ``display`` callback is designed to work with ``oembed`` only.

``urlRe`` [`RegEx:`]
  A regular expression representing what links to show content for. Use our
  `generator <http://embed.ly/tools/generator>`_ to generate a regular
  expression for a specific set of sources.

``secure`` [`Boolean:null`]
  By default Embedly jQuery will use ``window.location.protocol`` to figure out
  whether your request needs to be made to the HTTPS endpoint or the HTTP. You
  can override this by explicitly setting the secure parameter to ``true`` for
  ``https`` or ``false`` for HTTP.

``batch`` [`Integer:20`]
  Embedly's API only accepts a maximum of 20 URLs per request, so the Client
  batches these up into groups of 20. If you would like to set a custom size,
  you can do so with this argument.

``progress`` [`Function:null`]
  Added directly to the Deferred object and will be called when the API returns
  JSON data for this URL. ``progress`` should accept a single data object and
  does not contain any information about the element that is being operated on.
  ::

    $('a').embedly({progress:function(data){
      console.log(data.type)
    });

``done`` [`Function:null`]
  Added directly to the Deferred object and will be called when every URL has
  been processed by the Embedly API. ``done`` should accept a list of data
  objects.
  ::

    $('a').embedly({progress:function(data){
      console.log(data.type)
    });


Errors and Invalid URLs
-----------------------
It's more than likely with user generated content that there will be a number
of invalid URLs passed to the client. If you also use a specific URLRe, you
will receive even more invalid URLs. The Client and the Selector treat these
the came and they are still passed to the ``progress``, ``done`` and
``display`` functions. It's very easy to handle these::

  $.embedly.objectify('notaurl').progress(function(data){
    if (data.invalid === true){
      // The URL that you passed in was not a good one.
      console.log(data.error, data.error_message);
    } else if (data.type === 'error'){
      // The API passed back an error.
      console.log(data.type, data.error_message);
    } else {
      // Everything is good to go. Proceed Captain.
    }
  })


Data / Custom Events
--------------------
Starting in revision 2.0.0 we have started writing the Embedly data to the DOM
elements using jQuery.data(). You can read more about the data function `here
<http://api.jquery.com/jQuery.data/>`_, but basically saves the Embedly data on
the element for retrieval later.  For example::

  # $('a').embedly()
  # ... after the AJAX returns an oembed ...
  $('a').data('embedly')

This call returns the ``embedly`` object for each a tag, so you can access the
data later on. Because this data is not written to the DOM until the AJAX
requests are complete we have added a custom event listener called
``displayed.`` This event fires for each node when the oEmbed object is
written to the node using jQuery.data(). We did this so that developers could
continue to use our default callback function for writing embeds to the page
and still have access to the ``embedly`` data for customization.
::

  # version 1
  $('a').embedly().bind('displayed', function(e){
    var data = $(this).data('embedly');
    alert(data.title);
  });

  # version 2
  $('a').embedly().bind('displayed', function(e, data){
    alert(data.title);
  });

The event handler gets the embedly object passed in as a parameter as well if
you don't want to use jQuery.data(); The two are equivalent.

It's possible to get yourself into a race condition using the ``embedly`` data
where the using initiates an event and the data has yet to be returned. To get
around this there is a ``loaded`` Deferred Object on the data that will resolve
when everything is ready. Here is a simple example::

  $('a').embedly().on('click', function(){
    var embed = $(this).data('embedly');
    // Attach a done event to the loaded object that will be called when
    // everything is ready.
    embed.loaded.done(function(data){
      alert(data.url);
    });
  });


Image Proxy and Resizing
------------------------

`Embedly Display <http://embed.ly/display>`_  gives you access to
an image proxy and resizing endpoints that allow you to scale images
to any size. You can use `$.embedly.defaults` to set keys or query
resize parameters::

  $.embedly.defaults.key = 'Your Embedly Key';
  $.embedly.defaults.query = {width: 300};

You can use selectors to resize or proxy images, we will look for all images with the data-src attribute::
  
  e.g. <img data-src="http://embed.ly/static/images/logos/logo_color.png"></img>

  $('img').display('resize', {query: {width: 300}});

Or generate image urls with the client::

  $.embedly.display.resize('http://embed.ly/static/images/logos/logo_color.png', {width: 300});

Image Methods
"""""""""""""
The Image Display client has 4 methods that each take
2 parameters: url, options. Each method returns an image
url that can be added to the DOM.

``display``
  Corresponds to Embedly's `Display
  <http://embed.ly/docs/display/api/endpoints/1/display>`_ API Endpoint
  used to simply proxy an image. Add `secure` to proxy through HTTPS.

``resize``
  Corresponds to Embedly's `Resize
  <http://embed.ly/docs/display/api/endpoints/1/resize>`_ API Endpoint
  used to resize an image by scaling it to a specific width or height
  preserving aspect ratio.
  Required query parameters: width or height. Optional: grow.

``crop``
  Corresponds to Embedly's `Crop
  <http://embed.ly/docs/display/api/endpoints/1/crop>`_ API Endpoint used
  to crop an image to a specific width and height.
  Required query parameters: width, height.

``fill``
  Corresponds to Embedly's `Fill
  <http://embed.ly/docs/display/api/endpoints/1/resize>`_ API Endpoint used
  to fit an image to a specific canvas size filled with a specific color.
  Required query parameters: width, height, color.

Display Method Parameters
-------------------------
``endpoint`` [`string:'display'`]
  The image methods: display, resize, crop or fill. (required)

``options`` [`Object:default object`]
  A direct pass though to all the Query Arguments that the Embedly Display
  endpoints accept. These will be combined with the ``key`` and  ``url`` to
  form the request to Embedly. See Query section below. arguments.::

    options: {
      key: 'your Embedly key',
      query: {
        width: 400,
        height: 400,
        color: #fff,
        ...
      }
    }

  Required query arguments vary between endpoints, you can consult the `Display
  endpoints documentation <http://embed.ly/docs/display/api#endpoints>`_.

Image Query Parameters
----------------------
These are the query arguments that can be passed via the
options. These arguments should be added to the 
`options.query`:

``width`` [`integer:null`]
  The width you would like to scale the image.

``height`` [`integer:null`]
  The height you would like to scale the image.

``color`` [`string:null`]
  The color to fill the image with 3 or 6 hexadecimal
  characters. (fff, 4f2a55)

``grow`` [`Boolean:false`]
  By default the API will not increase the size of images.
  Set to ``true`` to allow images to be increased in size.

``errorurl`` [`string:null`]
  The fall back image url that will be used if the original
  image is invalid or cannot be processed. Ensure this image
  exists.

CDN
---
To get you going even faster, Embedly hosts all the files you need on
cdn.embed.ly. Also available over HTTPS. The latest version is available here::

    http://cdn.embed.ly/jquery.embedly-3.1.1.js
    http://cdn.embed.ly/jquery.embedly-3.1.1.min.js


Licensing
---------
BSD License can be found at - http://github.com/embedly/embedly-jquery/tree/master/LICENSE/

Embedly URLs
------------

* Git location:       http://github.com/embedly/embedly-jquery/
* Home Page:          http://embed.ly
* Support:            http://support.embed.ly

Changelog
---------

3.1.1
"""""
* Makes $.embedly.defaults.key work with $.embedly.display.build

3.1.0
"""""
* Add Display Image Proxy and Resizing endpoint.
* Add $.display for dealing with image resizing and proxying.
* Updated the README.rst.

3.0.5
"""""
* Fixes bad deployment.

3.0.4
"""""
* Add extract endpoint.

3.0.3
"""""
* Use $.map instead of array.map for IE support

3.0.2
"""""
* Implemented the urlRe back into the options.

3.0.1
"""""
* Fixed a bug in bad batching.

3.0.0
"""""
* Complete rewrite of the existing plugin to be easier to use.
* Removed $.browser dependency. (#30)

2.2.0
"""""
* Fixing bug that was causing callbacks to be overwritten (#23)

2.1.9
"""""
* Updated Image styles to work on all images, including thumbnails
* hide empty descriptions

2.1.8
"""""
* Fixed how default values/settings are handled

2.1.7
"""""
* Added secure and frame as a query param
* Move qunit to lib
* Removed jQuery as we weren't using it.

2.1.6
"""""
* Updated the README.rst
* Added ``$.embedly.defaults``
* Added ``char`` setting and ``description`` class to the embed. Thanks `Daniel
  Levitt <https://github.com/bluedaniel>`_
* Added ``word`` setting

2.1.5
"""""
* added secure flag for https requests
