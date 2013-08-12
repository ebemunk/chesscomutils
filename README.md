ccpgncapture
============

ccpgncapture is a 'bookmarklet' (might be pushing it a little) for saving Live Chess games on Chess.com to one dedicated local file.

As a newbie player myself, I think one of the most important features would be to have local copies of my own games appended to a common PGN file (instead of downloading it one by one), similar to ICC's client.

So, I made this to capture and save games as they come in the window.

## Dependencies

You will need a Local HTTP Server with PHP to be able to use this. The PHP is only used to write the PGN file into the filesystem, as pure JavaScipt has no such access.

## Quick Start

Create a folder (default `ccpgncapture`) in your `www` or `public_html` folder and extract. Use `bookmarklet.txt` to create a new bookmark.

When you visit the Live Chess website on Chess.com, click on the bookmark. You will see a new menu item added to the top, called `PGNcapture: Off`. Clicking on this will toggle capture.

Please note that by default ccpgncapture will save ALL games you can see in the window (not just your own), for now.

## Anatomy

```
.
|- chess.min.js: Contains the Chess.js library in minified form. This library is required by ccpgncapture
|- listen.js: Main JS injected into the Live Chess page that handles move decoding and saving
|- write.php: Writes passed PGNs into the destination file
|- bookmarklet.js: Readable form of the bookmarklet
|- bookmarklet.txt: Compressed bookmarklet for browsers
```

ccpgncapture bookmarklet injects 2 pieces of Javascript code into the Live Chess page. Firstly, `chess.min.js`, the chess library for making moves, adding PGN headers and PGN output, and secondly `listen.js` which subscribes to the CometD service channel to get information about finished games and decodes the moves.

Once the PGN is constructed, `listen.js` sends a request to `write.php` which lives in the localhost and writes/appends the new PGN to the specified file.

## Bugs/Missing

* TimeControl PGN header not supplied
* Nice to have: Classify Opening