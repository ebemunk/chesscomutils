chesscomutils
=============
Provides a couple of convenience functions for the Live Chess in Chess.com

#About
chesscomutils is a javascript bookmarklet that adds some additional functionality for [chess.com]()'s [live chess](http://live.chess.com) app.

It uses [SCID](http://sourceforge.net/projects/scid) opening databases [scid.eco](http://sourceforge.net/p/scid/code/ci/master/tree/scid.eco) to determine the opening of the current game. It can also capture games in PGN format and save them locally along with keyboard shortcuts.

#Requirements
- Local web server with PHP support
- Modern browser

#Installation
- Clone the repository in your localhost root (files should be accessible from localhost/chesscomutils if you want to use as-is).
- Create a bookmark on your browser using the contents of `bookmarklet.txt`.
- Change the save path in `write.php`.
- Click on the bookmark after the live chess page loads.

#Usage
See [http://ebemunk.github.io/chesscomutils/](http://ebemunk.github.io/chesscomutils/)

#Changelog
##28 Nov 2013
- Fixed some non-standard SAN values in scid.eco, there are a total of 10,358 openings/positions now.
- Better opening announcement (less text jumble).

##27 Nov 2013
- Fixed some parsing bugs in scid.eco, now more Reti openings and transpositions should be available.
- Reduced size of openings.min.js for online version (from 3.2MB to 2.6MB)

##4 Nov 2013
- Opening checker can now also read Analysis tabs.
- Small performance improvement for opening classifier: rudimentary cache prevents re-calculating opening many times after opening has been established. This should cut down resource-hogging for long/fast games.

#Todo
- Ability to save to multiple different files?
- Ability to download PGN of single game
- ~~Opening classification~~