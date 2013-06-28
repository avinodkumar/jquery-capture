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
/*jslint browser: true, devel: true, indent: 2 */
/*global window, jQuery, $, define */
(function (factory) {
  'use strict';
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
      eventCounter: 0,
      startingPosition: 0
    },
    config = {
      track: {
        mousemove: true,
        click: true,
        scroll: true
      },
      mouseTimeout: 1000,
      mouseFade: true,
      mouseFadeDuration: 1000,
      mouseClickTimeout: 1000,
      mouseClickFade: true,
      mouseClickFadeDuration: 1000,
      saveURL: false,
      loadURL: false
    },
    elements = {
      toolbar: {
        container: $('<div />').attr('id', 'capture-toolbar').addClass('capture-toolbar'),
        btnContainer: $('<ul />').attr('id', 'capture-list').addClass('capture-list'),
        btns: {
          record: $('<li />').attr({
            'id': 'capture-record',
            'data-description': 'Start/Stop Recording'
          }).addClass('capture-record icon-microphone btn'),
          play: $('<li />').attr({
            'id': 'capture-play',
            'data-description': 'Play/Stop Capture Session'
          }).addClass('capture-play icon-play btn'),
          save: $('<li />').attr({
            'id': 'capture-save',
            'data-description': 'Save Capture Session'
          }).addClass('capture-save icon-save btn'),
          load: $('<li />').attr({
            'id': 'capture-load',
            'data-description': 'Load Capture Session'
          }).addClass('capture-load icon-folder-open btn'),
          trash: $('<li />').attr({
            'id': 'capture-trash',
            'data-description': 'Trash Capture Session'
          }).addClass('capture-trash icon-trash btn')
        }
      },
      modal: {
        overlay: $('<div />').attr('id', 'capture-overlay').addClass('capture-overlay'),
        modal: $('<div />').attr('id', 'capture-modal').addClass('capture-modal'),
        save: '<h2 class="title">Save Current Capture Session</h2>' +
          '<div class="inner"><p><b>Session Start Time:</b> <span id="capture-start-time"></span><br>' +
          '<b>URL:</b> <span id="capture-url"></span><br>' +
          '<b>User Events:</b> <span id="capture-num-events">0</span></p>' +
          '<form method="post" action="" id="capture-save-frm" class="capture-save-frm">' +
          '<input type="hidden" name="URL" value="">' +
          '<input type="hidden" name="events" value="">' +
          '<input type="hidden" name="time" value="">' +
          '<label for="capture-name">Session Name</label>' +
          '<input type="text" name="capture-name" id="capture-name" placeholder="Enter a name for this session...">' +
          '<label for="capture-notes">Session Notes</label>' +
          '<textarea name="capture-notes" id="capture-notes"></textarea>' +
          '<div class="divider"></div>' +
          '<h3 class="subtitle">Need help?</h3>' +
          '<p>Visit <a href="http://www.benmarshall.me/jquery-capture/" target="_blank">http://www.benmarshall.me/jquery-capture/</a> for full documentation.</p>' +
          '</div>' +
          '<div class="btns">' +
          '<input type="checkbox" name="capture-trash-it" id="capture-trash-it"> <label for="capture-trash-it">Reset session after save</label>' +
          '<input type="submit" value="Save Session" id="capture-save-btn"></div>' +
          '</form>',
        load: '<h2 class="title">Load Saved Captured Session</h2>' +
          '<div class="inner">' +
          '<div id="capture-sessions">' +
          '<div class="capture-loading"><i class="icon-spinner icon-spin"></i></div>' +
          '</div>' +
          '<div class="divider"></div>' +
          '<h3 class="subtitle">Need help?</h3>' +
          '<p>Visit <a href="http://www.benmarshall.me/jquery-capture/" target="_blank">http://www.benmarshall.me/jquery-capture/</a> for full documentation.</p>' +
          '</div>' +
          '</div>'
      }
    },
    methods = {
      init: function(options) {
        config = $.extend({}, config, options);
        methods.buildToolbar();
        $(window).resize(function() {
          if ($('#capture-modal').length) {
            methods.positionModal();
          }
        });
        $('body').delegate('#capture-save-btn', 'click', function(e) {
          e.preventDefault();
          methods.saveSession();
        }).delegate('#capture-overlay', 'click', function() {
          methods.closeModal();
        });
        $('#capture-toolbar').delegate('.btn', 'mouseover', function() {
          var desc = $(this).data('description');
          $(this).append('<div class="capture-tooltip">' + desc + '</div>');
        }).delegate('.btn', 'mouseout', function() {
          $('.capture-tooltip', this).remove();
        });
      },
      buildToolbar: function() {
        $.each(elements.toolbar.btns, function(i, o) {
          switch (i) {
          case 'record':
            o.bind('click', function(e) {
              e.preventDefault();
              if (!$(this).hasClass('disabled')) {
                methods.record(o);
                methods.updateVars();
              }
            });
            elements.toolbar.btnContainer.append(o);
            break;
          case 'play':
            o.bind('click', function(e) {
              e.preventDefault();
              if (!$(this).hasClass('disabled')) {
                methods.play(o);
                methods.updateVars();
              }
            });
            elements.toolbar.btnContainer.append(o);
            break;
          case 'trash':
            o.bind('click', function(e) {
              e.preventDefault();
              if (!$(this).hasClass('disabled')) {
                methods.trash();
                methods.updateVars();
              }
            });
            elements.toolbar.btnContainer.append(o);
            break;
          case 'save':
            o.bind('click', function(e) {
              e.preventDefault();
              if (!$(this).hasClass('disabled')) {
                methods.save(o);
                methods.updateVars();
              }
            });
            elements.toolbar.btnContainer.append(o);
            break;
          case 'load':
            o.bind('click', function(e) {
              e.preventDefault();
              if (!$(this).hasClass('disabled')) {
                methods.load(o);
                methods.updateVars();
              }
            });
            elements.toolbar.btnContainer.append(o);
            break;
          }
        });
        methods.updateVars();
        elements.toolbar.container.html(elements.toolbar.btnContainer);
        $('body').append(elements.toolbar.container);
      },
      load: function() {
        if (config.loadURL) {
          methods.showModal(elements.modal.load);
        } else {
          alert('Error: jQuery.capture loadURL has not been set. To load sessions, you must define a loadURL.');
        }
      },
      updateToolbar: function() {
        if (vars.isRecording) {
          methods.btnStatus('record', 'is-recording');
          elements.toolbar.btns.play.addClass('disabled');
        } else {
          methods.btnStatus('record', 'not-recording');
          elements.toolbar.btns.play.removeClass('disabled');
        }

        if (vars.isPlaying) {
          methods.btnStatus('play', 'is-playing');
          elements.toolbar.btns.record.addClass('disabled');
        } else {
          methods.btnStatus('play', 'not-playing');
          elements.toolbar.btns.record.removeClass('disabled');
        }

        if (!vars.events.length) {
          elements.toolbar.btns.play.addClass('disabled');
          elements.toolbar.btns.trash.addClass('disabled');
          elements.toolbar.btns.save.addClass('disabled');
        } else {
          elements.toolbar.btns.trash.removeClass('disabled');
          elements.toolbar.btns.save.removeClass('disabled');
        }

        if (!config.saveURL) {
          elements.toolbar.btns.save.hide();
        }

        if (!config.loadURL) {
          elements.toolbar.btns.load.hide();
        }
      },
      updateVars: function() {
        if (elements.toolbar.btns.record.hasClass('is-recording')) {
          vars.isRecording = true;
        } else if (elements.toolbar.btns.record.hasClass('not-recording')) {
          vars.isRecording = false;
        }
        if (elements.toolbar.btns.play.hasClass('is-playing')) {
          vars.isPlaying = true;
        } else if (elements.toolbar.btns.play.hasClass('not-playing')) {
          vars.isPlaying = false;
        }

        methods.updateToolbar();
      },
      trash: function() {
        vars.events = [];
        methods.updateVars();
      },
      save: function() {
        if (config.saveURL) {
          methods.showModal(elements.modal.save);
          $('#capture-url', elements.modal.modal).html(document.URL);
          $('#capture-start-time', elements.modal.modal).html(vars.startTime.toUTCString());
          $('#capture-num-events', elements.modal.modal).html(methods.comma(vars.events.length));
          $('#capture-save-frm', elements.modal.modal).attr('href', config.saveURL);
          $('input[name="URL"]', elements.modal.modal).attr('value', document.URL);
          $('input[name="events"]', elements.modal.modal).attr('value', JSON.stringify(vars.events));
          $('input[name="time"]', elements.modal.modal).attr('value', vars.startTime);
        } else {
          alert('Error: jQuery.capture saveURL has not been set. To save sessions, you must define a saveURL.');
        }
      },
      saveSession: function() {
        $.post(config.saveURL, $("#capture-save-frm").serialize(), function(d) {
          if ($('#capture-trash-it', elements.modal.modal).is(':checked')) {
            methods.trash();
            methods.updateVars();
          }
          methods.closeModal();
        });
      },
      showModal: function(html) {
        if (!$('#capture-overlay').length) {
          elements.modal.modal.html(html);
          $('body').append(elements.modal.overlay).append(elements.modal.modal);
          if (elements.modal.overlay.is(':hidden')) {
            elements.modal.overlay.fadeIn();
          }
          if (elements.modal.modal.is(':hidden')) {
            elements.modal.modal.fadeIn();
          }
          methods.positionModal();

          $('body').bind('keyup', function(e) {
            if (e.keyCode === 27) {
              methods.closeModal();
            }
          });
        }
      },
      closeModal: function() {
        $('#capture-overlay').fadeOut(function() {
          $('#capture-overlay').remove();
        });
        $('#capture-modal').fadeOut(function() {
          $(this).remove();
        });
        $('body').unbind('keyup');
      },
      positionModal: function() {
        var width = $(window).width(),
          height = $(window).height(),
          w = elements.modal.modal.width(),
          h = elements.modal.modal.height();
        elements.modal.modal.css({
          top: (height - h) / 2,
          left: (width - w) / 2
        });
      },
      record: function(btn) {
        btn.toggleClass('not-recording is-recording');
        if (btn.hasClass('not-recording')) {
          methods.events('unbind');
          methods.btnStatus('record', 'not-recording');
          methods.updateVars();
        } else if (btn.hasClass('is-recording')) {
          methods.events('bind');
          methods.btnStatus('record', 'is-recording');
          methods.updateVars();
          if (!vars.events.length) {
            vars.startTime = new Date();
          }
          if (!vars.startingPosition) {
            vars.startingPosition = $(window).scrollTop();
          }
        }
      },
      play: function(btn) {
        vars.eventCounter = vars.events.length;
        btn.toggleClass('not-playing is-playing');
        if (btn.hasClass('not-playing')) {
          methods.stop();
          methods.btnStatus('play', 'not-playing');
          methods.updateVars();
        } else if (btn.hasClass('is-playing')) {
          $(window).scrollTop(vars.startingPosition);
          methods.btnStatus('play', 'is-playing');
          methods.updateVars();
          $.each(vars.events, function() {
            methods.playEvent(this);
          });
        }
        var interval = setInterval(function() {
          if (vars.eventCounter === 0) {
            methods.stop();
            window.clearInterval(interval);
          }
        });
      },
      btnStatus: function(btn, status) {
        switch (btn) {
        case 'play':
          switch (status) {
          case 'not-playing':
            elements.toolbar.btns.play.removeClass('is-playing icon-stop').addClass('not-playing icon-play');
            break;
          case 'is-playing':
            elements.toolbar.btns.play.addClass('is-playing icon-stop').removeClass('not-playing icon-play');
            break;
          }
          break;
        case 'record':
          switch (status) {
          case 'not-recording':
            elements.toolbar.btns.record.removeClass('is-recording').addClass('not-recording');
            break;
          case 'is-recording':
            elements.toolbar.btns.record.addClass('is-recording').removeClass('not-recording');
            break;
          }
          break;
        }
      },
      stop: function(c) {
        var i,
          length = vars.timeouts.length;
        methods.btnStatus('play', 'not-playing');
        methods.updateVars();
        for (i = 0; i < length; i++) {
          window.clearTimeout(vars.timeouts[i]);
        }
        vars.timeouts = [];
        methods.clearScreen();
      },
      clearScreen: function() {
        $('.capture-mouse').remove();
      },
      playEvent: function(e) {
        var id,
          diff = e.timeStamp - vars.startTime.getTime();
        switch (e.type) {
        case 'mousemove':
          id = 'capture-mouse-' + diff;
          vars.timeouts.push(setTimeout(function() {
            $('body').append($('<div />').addClass('capture-mouse').attr('id', id).css({
              top: e.pageY,
              left: e.pageX
            }));
            vars.timeouts.push(setTimeout(function() {
              vars.eventCounter = vars.eventCounter - 1;
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
        case 'click':
          id = 'capture-click-' + diff;
          vars.timeouts.push(setTimeout(function() {
            $('body').append($('<div />').addClass('capture-click').attr('id', id).css({
              top: e.pageY,
              left: e.pageX
            }));
            vars.timeouts.push(setTimeout(function() {
              vars.eventCounter = vars.eventCounter - 1;
              if (config.mouseClickFade) {
                $('#' + id).fadeOut(config.mouseClickFadeDuration, function() {
                  $(this).remove();
                });
              } else {
                $('#' + id).remove();
              }
            }, config.mouseClickTimeout));
          }, diff));
          break;
        case 'scroll':
          vars.timeouts.push(setTimeout(function() {
            $(window).scrollTop(e.windowPos);
            vars.eventCounter = vars.eventCounter - 1;
          }, diff));
          break;
        }
      },
      events: function(a) {
        if (a === 'bind') {
          $.each(config.track, function(e, v) {
            if (v) {
              $(window).bind(e, function(d) {
                var event = {};
                if ($(window).scrollTop() >= 0) {
                  event.windowPos = $(window).scrollTop();
                } else {
                  event.windowPos = 0;
                }

                event.type = d.type;
                event.pageY = d.pageY;
                event.pageX = d.pageX;
                event.timeStamp = d.timeStamp;

                vars.events.push(event);
              });
            }
          });
        } else if (a === 'unbind') {
          $.each(config.track, function(e, v) {
            if (v) {
              $(window).unbind(e);
            }
          });
        }
      },
      comma: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    };

  $.capture = function(options) {
    methods.init(options);
  };
}));

jQuery(function() {
  jQuery.capture({
    track: {
      mousemove: true,
      click: true,
      scroll: true
    },
    mouseTimeout: 1000,
    mouseFade: true,
    mouseFadeDuration: 1000,
    mouseClickTimeout: 1000,
    mouseClickFade: true,
    mouseClickFadeDuration: 1000,
    saveURL: 'TEMP-jquery-capture.php',
    loadURL: 'TEMP-jquery-capture.php'
  });
});
