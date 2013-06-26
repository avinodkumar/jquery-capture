/*!
 * jQuery Capture Plugin v0.0.1
 * https://github.com/bmarshall511/jquery-capture
 * 
 * Copyright 2013, Ben Marshall
 * http://www.benmarshall.me
 * 
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function ($) {
  'use strict';
  
  var vars = {
      isRecording: false,
      isPlaying: false,
      events: [],
      diff: [],
      startTime: new Date(),
      timeouts: [],
      eventCounter: 0
    },
    config = {
      track: {
        mousemove: true
      },
      mouseTimeout: 1000,
      mouseFade: true,
      mouseFadeDuration: 1000
    },
    elements = {
      toolbar: {
        container: $('<div />').attr('id', 'capture-toolbar').addClass('capture-toolbar'),
        btnContainer: $('<ul />').attr('id', 'capture-list').addClass('capture-list'),
        btns: {
          record: $('<li />').attr('id', 'capture-record').addClass('capture-record icon-microphone btn'),
          play: $('<li />').attr('id', 'capture-play').addClass('capture-play icon-play btn')
        }
      }
    },
    methods = {
      init: function(options) {
        config = $.extend( {}, config, options);
        methods.buildToolbar();
      },
      buildToolbar: function() {
        $.each(elements.toolbar.btns, function(i, o) {
          switch(i) {
            case 'record':
              o.bind('click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
                  methods.record(o);
                  methods.updateToolbar();
                }
              });
              elements.toolbar.btnContainer.append(o);
              break;
            case 'play':
              o.bind('click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('disabled')) {
                  methods.play(o);
                  methods.updateToolbar();
                }
              });
              elements.toolbar.btnContainer.append(o);
              break;
          }
        });
        methods.updateToolbar();
        elements.toolbar.container.html(elements.toolbar.btnContainer);
        $('body').append(elements.toolbar.container);
      },
      updateToolbar: function() {
        methods.updateVars();
        if (vars.isRecording) {
          elements.toolbar.btns.record.addClass('is-recording').removeClass('not-recording');
          elements.toolbar.btns.play.removeClass('is-playing').addClass('not-playing disabled');
        } else {
          elements.toolbar.btns.record.addClass('not-recording').removeClass('is-recording');
          elements.toolbar.btns.play.removeClass('disabled');
        }
        
        if (vars.isPlaying) {
          elements.toolbar.btns.play.addClass('is-playing icon-stop').removeClass('not-playing icon-play');
          elements.toolbar.btns.record.removeClass('is-recording').addClass('not-recording disabled');
        } else {
          elements.toolbar.btns.play.addClass('not-playing icon-play').removeClass('is-playing icon-stop');
          elements.toolbar.btns.record.removeClass('disabled');
        }
      },
      updateVars: function() {
        if (elements.toolbar.btns.record.hasClass('is-recording')) {
          vars.isRecording = true;
          vars.isPlaying = false;
        }
        if (elements.toolbar.btns.play.hasClass('is-playing')) {
          vars.isRecording = false;
          vars.isPlaying = true;
        }
      },
      record: function(btn) {
        btn.toggleClass('not-recording is-recording');
        if (btn.hasClass('not-recording')) {
          methods.events('unbind');
          vars.isRecording = false;
        } else if(btn.hasClass('is-recording')) {
          methods.events('bind');
          vars.isRecording = true;
          if (!vars.events.length) {
            vars.startTime = new Date();
          }
        }
      },
      play: function(btn) {
        btn.toggleClass('not-playing is-playing');
        if (btn.hasClass('not-playing')) {
          vars.isPlaying = false;
          for (var i = 0; i < vars.timeouts.length; i++) {
            window.clearTimeout(vars.timeouts[i]);
          }
          vars.timeouts = [];
          methods.clearScreen();
        } else if(btn.hasClass('is-playing')) {
          vars.isPlaying = true;
          $.each(vars.events, function(i, o) {
            methods.playEvent(o);
          });
        }
        /*setInterval(function() {
          console.log(vars.timeouts);
        }, 1000);*/
      },
      clearScreen: function() {
        $('.capture-mouse').remove();
      },
      playEvent: function(e) {
        var id,
          diff = e.timeStamp - vars.startTime.getTime();
        switch(e.type) {
          case 'mousemove':
            id = 'capture-mouse-' + diff;
            vars.timeouts.push(setTimeout(function() {
              $('body').append($('<div />').addClass('capture-mouse').attr('id', id).css({
                top: e.pageY,
                left: e.pageX
              }));
              vars.timeouts.push(setTimeout(function() {
                if (config.mouseFade) {
                  $('#' + id).fadeOut(config.mouseFadeDuration, function() {
                    $(this).remove();
                  });
                } else {
                  $('#' + id).remove();
                }
              }, config.mouseTimeout));
              
            }, diff));
            break;
        }
      },
      events: function(a) {
        if (a === 'bind') {
          $.each(config.track, function(e, v) {
            if(v) {
              $(window).bind(e, function(d) {
                vars.events.push(d);
              });
            }
          });
        } else if (a === 'unbind') {
          $.each(config.track, function(e, v) {
            if(v) {
              $(window).unbind(e);
            }
          });
        }
      }
    }
    
  
  $.capture = function(options) {
    methods.init(options);
  }
}));

jQuery(function() {
  jQuery.capture({
    track: {
      mousemove: true
    },
    mouseTimeout: 1000,
    mouseFade: true,
    mouseFadeDuration: 1000
  });
});
