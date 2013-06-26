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
      events: []
    },
    config = {
      track: {
        keyup: true
      }
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
        elements.toolbar.container.html(elements.toolbar.btnContainer);
        $('body').append(elements.toolbar.container);
      },
      updateToolbar: function() {
        if (vars.isRecording) {
          elements.toolbar.btns.record.addClass('is-recording').removeClass('not-recording');
        } else {
          elements.toolbar.btns.record.addClass('not-recording').removeClass('is-recording');
        }
        
        if (vars.isPlaying) {
          elements.toolbar.btns.play.addClass('is-playing').removeClass('not-playing');
        } else {
          elements.toolbar.btns.play.addClass('not-playing').removeClass('is-playing');
        }
        methods.updateVars();
      },
      updateVars: function() {
        if (vars.isRecording) {
          vars.isPlaying = false;
        } else if (vars.isPlaying) {
          vars.isRecording = false;
        }
      },
      record: function(btn) {
        btn.toggleClass('not-recording is-recording');
        if (btn.hasClass('not-recording')) {
          vars.isRecording = false;
          methods.events('unbind');
        } else if(btn.hasClass('is-recording')) {
          vars.isRecording = true;
          methods.events('bind');
        }
      },
      play: function(btn) {
        btn.toggleClass('not-playing is-playing');
        if (btn.hasClass('not-playing')) {
          vars.isPlaying = false;
        } else if(btn.hasClass('is-playing')) {
          vars.isPlaying = true;
          $.each(vars.events, function(i, o) {
            methods.playEvent(o);
          });
        }
      },
      playEvent: function(e) {
        console.log(e);
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
      keyup: true
    }
  });
});
