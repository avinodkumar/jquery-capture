jQuery-capture
==============

A simple, lightweight jQuery plugin to record, save, and playback user actions on a webpage. Great for UI &amp; UX testing.

## Installation

Include the `jQuery.capture.js` script *after* the jQuery library (unless you are packaging scripts somehow else) then initialize the plugin:

```html
<script src="jquery.capture.js"></script>
<script>
jQuery(function() {
  jQuery.capture();
});
</script>
```

**Do not include the script directly from GitHub.** The file is being served as text/plain and as such being blocked in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

Include the `jquery.capture.css` and [Font Awesome](http://fortawesome.github.io/Font-Awesome/) CSS files in the head of the document.

```html
<link rel="stylesheet" href="css/jquery.capture.css">
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css">
```

In order to use the save feature, you must setup a database. Once created, import the `sessions.sql` file to create the database table.

## Usage

Once the scripts have been installed, you should see a toolbar at the bottom of the page. There you can start, stop, save, and load sessions by clicking on the icons.

## Configuration

Below are the available configuration options that can be set when the plugin is initialized:

```javascript
jQuery.capture({
  track: {                            // Sets what events to capture
    mousemove: true,
    click: true,
    scroll: true
  },
  mouseTimeout: 1000,                 // The number of milliseconds it takes mousemove events to disappear
  mouseFade: true,                    // Set if mousemove events should fade out
  mouseFadeDuration: 1000,            // The number of milliseconds it takes mousemove events to fade away
  mouseClickTimeout: 1000,            // The number of milliseconds it takes click events to disappear
  mouseClickFade: true,               // Set if click events should fade out
  mouseClickFadeDuration: 1000,       // The number of milliseconds it takes click events to fade away
  saveURL: 'save-jquery-capture.php'  // The URL to post the saved data to
});
```

### Available Configuration Options

| Option | Description |
| --- | --- |
| `track.mousemove` | *Boolean.* Capture mousemove events. *Default: true* |
| `track.click` | *Boolean.* Capture click events. *Default: true* |
| `track.scroll` | *Boolean.* Capture scroll events. *Default: true* |
| `mouseTimeout` | *Integer.* The number of milliseconds it takes mousemove events to disappear. *Default: 1000* |
| `mouseFade` | *Boolean.* Set if mousemove events should fade out. *Default: true* |
| `mouseFadeDuration` | *Integer.* The number of milliseconds it takes mousemove events to fade away. *Default: 1000* |
| `mouseClickTimeout` | *Integer.* The number of milliseconds it takes click events to disappear. *Default: 1000* |
| `mouseClickFade` | *Boolean.* Set if click events should fade out *Default: true* |
| `mouseClickFadeDuration` | *Integer.* The number of milliseconds it takes click events to fade away. *Default: 1000* |
| `saveURL` | *String.* The URL to post the saved data to. *Optional* |

## Browser Compatibility

This plugin has been tested in the following browsers:

* Google Chrome
 * Version 27.0.1453.110

## Development

* Source hosted at [GitHub](https://github.com/bmarshall511/jquery-capture)
* Report issues, questions, feature requests on [GitHub Issues](https://github.com/bmarshall511/jquery-capture/issues)

### Changelog

## Authors

[Ben Marshall](http://www.benmarshall.me)