/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
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
      $.embedly.build('oembed', ['http://embed.ly', 'http://google.com'], {key:'4d1f889c20ed11e1abb14040d3dc5c07'}),
      "http://api.embed.ly/1/oembed?key=4d1f889c20ed11e1abb14040d3dc5c07&urls=http%3A%2F%2Fembed.ly,http%3A%2F%2Fgoogle.com");

    equal(
      $.embedly.build('objectify', ['http://embed.ly'], {key:'4d1f889c20ed11e1abb14040d3dc5c07', secure:true, query: {maxwidth:500}}),
      "https://api.embed.ly/2/objectify?maxwidth=500&key=4d1f889c20ed11e1abb14040d3dc5c07&urls=http%3A%2F%2Fembed.ly");
  });

  asyncTest('invalid url', 6, function() {
    $.embedly.oembed(['http', 'embedly'], {key:'4d1f889c20ed11e1abb14040d3dc5c07'})
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
    $('#basic').embedly({
      key:'4d1f889c20ed11e1abb14040d3dc5c07',
      progress: function(obj){
        equal(obj.type, 'photo');
      },
      done: function(objs){
        equal(objs.length, 1);
        equal($('#basic div.embed a img').length, 1);
        start();
      }});
  });


  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.awesome(), this.elems, 'should be chaninable');
  });

  test('is awesome', 1, function() {
    strictEqual(this.elems.awesome().text(), 'awesomeawesomeawesome', 'should be thoroughly awesome');
  });

  module('jQuery.awesome');

  test('is awesome', 1, function() {
    strictEqual($.awesome(), 'awesome', 'should be thoroughly awesome');
  });

  module(':awesome selector', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', 1, function() {
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });

}(jQuery));
