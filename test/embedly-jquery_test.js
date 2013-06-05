/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*globals jQuery:true*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#embedly', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('build url', 2, function() {
    equal(
      $.embedly.build('oembed', ['http://embed.ly', 'http://google.com'], {key: '4d1f889c20ed11e1abb14040d3dc5c07'}),
      "http://api.embed.ly/1/oembed?key=4d1f889c20ed11e1abb14040d3dc5c07&urls=http%3A%2F%2Fembed.ly,http%3A%2F%2Fgoogle.com");

    equal(
      $.embedly.build('objectify', ['http://embed.ly'], {key:'4d1f889c20ed11e1abb14040d3dc5c07', secure:true, query: {maxwidth:500}}),
      "https://api.embed.ly/2/objectify?maxwidth=500&key=4d1f889c20ed11e1abb14040d3dc5c07&urls=http%3A%2F%2Fembed.ly");
  });


  test('zip', 8, function(){
    // Just copying the function in here instead of making it a global elsewhere.
    function zip(arrays) {
      return $.map(arrays[0], function(_,i){
        return [$.map(arrays, function(array){return array[i];})];
      });
    }
    var zipped = zip([[1,2], [3,4]]);
    equal(zipped[0][0], 1);
    equal(zipped[0][1], 3);
    equal(zipped[1][0], 2);
    equal(zipped[1][1], 4);

    zipped = zip([[5,6], [7,8,9]]);
    equal(zipped[0][0], 5);
    equal(zipped[0][1], 7);
    equal(zipped[1][0], 6);
    equal(zipped[1][1], 8);
  });


  asyncTest('invalid url', 6, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $.embedly.oembed(['http', 'embedly'])
      .progress(function(obj){
        equal(obj.error, true);
      })
      .done(function(objs){
        $.each(objs, function(i, obj){
          equal(obj.error, true);
        });
        equal(objs[0].url, 'http');
        equal(objs[1].url, 'embedly');
        start();
      });
  });

  asyncTest('deferred', 4, function() {
    $.embedly.oembed('url', {key:'4d1f889c20ed11e1abb14040d3dc5c07'})
      .progress(function(obj){equal(obj.url, 'url');})
      .done(function(objs){
        equal(objs.length, 1);
        equal(objs[0].error, true);
        equal(objs[0].url, 'url');
        start();
      });
  });

  asyncTest('basic', 3, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $('#basic').embedly({
      progress: function(obj){
        equal(obj.type, 'photo');
      },
      done: function(objs){
        equal(objs.length, 1);
        equal($('#basic div.embed a img').length, 1);
        start();
      }});
  });

  asyncTest('photo', 4, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $('#photo').embedly({
      addImageStyles: true,
      method: 'after',
      progress: function(obj){
        equal(obj.type, 'photo');
      },
      done: function(objs){
        equal(objs.length, 1);
        equal($('#photo > a ').length, 1);
        equal($('#photo div.embed a img').length, 1);
        start();
      }});
  });

  asyncTest('video', 3, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $('#video').embedly({
      className: 'video',
      progress: function(obj){
        equal(obj.type, 'video');
      },
      done: function(objs){
        equal(objs.length, 1);
        equal($('#video div.video iframe').length, 1);
        start();
      }});
  });

  asyncTest('rich', 3, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $('#rich').embedly({
      className: 'rich',
      wrapElement: 'span',
      progress: function(obj){
        equal(obj.type, 'rich');
      },
      done: function(objs){
        equal(objs.length, 1);
        equal($('#rich span.rich iframe').length, 1);
        start();
      }});
  });

  asyncTest('preview', 3, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $.embedly.preview('http://embed.ly').
      progress(function(obj){
        equal(obj.type, 'html');
        equal(obj.safe, true);
      }).
      done(function(results){
        equal(results.length, 1);
        start();
      });
  });

  asyncTest('objectify', 3, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $.embedly.objectify('http://embed.ly').
      progress(function(obj){
        equal(obj.type, 'html');
        equal(obj.open_graph.site_name, 'Embedly');
      }).
      done(function(results){
        equal(results.length, 1);
        start();
      });
  });

  asyncTest('batch', 61, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';

    var urls = [], i=0;
    while(i < 30){
      urls.push('http://embed.ly/?'+i);
      i++;
    }
    $.embedly.objectify(urls).
      progress(function(obj){
        equal(obj.type, 'html');
        equal(obj.open_graph.site_name, 'Embedly');
      }).
      done(function(results){
        equal(results.length, 30);
        start();
      });
  });

  asyncTest('extract', 2, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $.embedly.extract('http://embed.ly').
      progress(function(obj){
        equal(obj.type, 'html');
      }).
      done(function(results){
        equal(results.length, 1);
        start();
      });
  });

  asyncTest('urlRe client', 4, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $.embedly.defaults.urlRe = /http:\/\/embed\.ly.*/gi;

    var urls = ['http://google.com', 'http://embed.ly'];

    $.embedly.objectify(urls, {}).
      done(function(results){
        equal(results.length, 2);
        equal(results[0].type, 'error');
        equal(results[0].error_message.indexOf('Invalid URL'), 0);
        equal(results[1].type, 'html');
        //set it back.
        $.embedly.defaults.urlRe = null;
        start();
      });
  });

  asyncTest('urlRe selector', 3, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';

    $('#urlRe').embedly({
      className: 'link',
      wrapElement: 'span',
      urlRe: /http:\/\/embed\.ly.*/gi,
      done: function(objs){
        equal(objs.length, 2);
        equal($('#urlRe span.link').length, 1);
        equal($('#urlRe span.link a.provider').attr('href'), 'http://embed.ly');
        start();
      }});

  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.embedly(), this.elems, 'should be chaninable');
  });

  /**
  Start of Embedly Display Tests (Image Proxy and API)
  **/

  test('build image url', 2, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';

    equal(
      $.embedly.display.build('display', 'http://embed.ly/static/images/logos/logo_color.png'),
      "http://i.embed.ly/1/display?key=4d1f889c20ed11e1abb14040d3dc5c07&url=http%3A%2F%2Fembed.ly%2Fstatic%2Fimages%2Flogos%2Flogo_color.png");

    equal(
      $.embedly.display.build('resize', ['http://embed.ly/static/images/logos/logo_color.png'], {key:'4d1f889c20ed11e1abb14040d3dc5c07', secure:true, query: {grow: true, width:500}}),
      "https://i.embed.ly/1/display/resize?grow=true&width=500&key=4d1f889c20ed11e1abb14040d3dc5c07&url=http%3A%2F%2Fembed.ly%2Fstatic%2Fimages%2Flogos%2Flogo_color.png");
  });

  test('crop image', 1, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $('#crop').display('crop', {'query': {'width': 100, 'height': 50}});
    //check img src was set to crop
    equal($('#crop img').attr('src'),
    "http://i.embed.ly/1/display/crop?width=100&height=50&key=4d1f889c20ed11e1abb14040d3dc5c07&url=http%3A%2F%2Fembed.ly%2Fstatic%2Fimages%2Flogos%2Flogo_color.png");

  });

  test('fill image', 1, function() {
    $.embedly.defaults.key = '4d1f889c20ed11e1abb14040d3dc5c07';
    $('#crop').display('fill', {'query': {'width': 100, 'height': 50, 'color': 'fff'}});
    //check img src was set to crop
    equal($('#crop img').attr('src'),
    "http://i.embed.ly/1/display/fill?width=100&height=50&color=fff&key=4d1f889c20ed11e1abb14040d3dc5c07&url=http%3A%2F%2Fembed.ly%2Fstatic%2Fimages%2Flogos%2Flogo_color.png");
  });

  module('jQuery.embedly');
}(jQuery));
