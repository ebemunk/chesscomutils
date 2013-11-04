chesscomutils
=============
Provides a couple of convenience functions for the Live Chess in Chess.com

#About
chesscomutils is a javascript bookmarklet that adds some additional functionality for [chess.com]()'s [live chess](http://live.chess.com) app.

It uses [SCID](http://sourceforge.net/projects/scid) opening databases [scid.eco](http://sourceforge.net/p/scid/code/ci/master/tree/scid.eco) to determine the opening of the current game. It can also capture games in PGN format and save them locally along with keyboard shortcuts.

#Requirements
- Local server with PHP support ([WAMPServer](http://www.wampserver.com/en) is relatively pain-free)
- Modern browser

#Installation
- Clone the repository in your localhost root (files should be accessible from localhost/chesscomutils if you want to use as-is).
- Create a bookmark from the contents of `bookmarklet.txt`.
- Change the save path in `write.php`.
- Click on the bookmark after the live chess page loads.

The online version uses `ccutils-bundled.min.js` which contains `chess.js`, `mousetrap.js` and `ccutils-core.js` minified using UglifyJS.

#Usage
See [http://ebemunk.github.io/chesscomutils/](http://ebemunk.github.io/chesscomutils/)

#Changelog
##4 Nov 2013
- Opening checker can now also read Analysis tabs.
- Small performance improvement for opening classifier: rudimentary cache prevents re-calculating opening many times after opening has been established. This should cut down resource-hogging for long/fast games.

#Todo
- Ability to save to multiple different files?
- Ability to download PGN of single game
- ~~Opening classification~~