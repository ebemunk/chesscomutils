chesscomutils
=============
Provides a couple of convenience functions for the Live Chess in Chess.com

#About
chesscomutils is a (sort-of) javascript bookmarklet that adds some additional functionality for [chess.com]()'s [live chess](http://live.chess.com) app.

It uses [SCID](http://sourceforge.net/projects/scid) opening databases [scid.eco](http://sourceforge.net/p/scid/code/ci/master/tree/scid.eco) to determine the opening of the current game. It can also capture games in PGN format and save them locally.

#Requirements
- Local server with PHP support ([WAMPServer](http://www.wampserver.com/en) is relatively pain-free)
- Modern browser

#Installation
- Clone the repository in your localhost root (files should be accessible from localhost/chesscomutils if you want to use as-is).
- Create a bookmark from the contents of `bookmarklet.txt`.
- Change the save path in `write.php`.
- Click on the bookmark after the live chess page loads.

#Usage
chesscomutils creates two new elements in the UI. It extends the green divider below the top menu to include the opening classification. It also adds a `Capture PGN` link on the top menu.

##Opening Classification
chesscomutils uses SCID's opening database to classify the current game. It will display ECO Code, Opening Name and the moves. It will also get the opening by position (by looking at FEN). This is more helpful when the game transposes to a common opening from a more unorthodox opening - seen quite a bit on chess.com. **Note:** The classification will only be shown when the game which has its notation window visible on the screen. Currently it can't support multiple games. It will probably cry if you open (pop-out) more than 1 game.

The opening checker is run every 5 seconds by default, but you can force it to run by clicking on the green bar.

##PGN Capture
By clicking on the `Capture PGN` button you can toggle capturing the games as PGN. Any game that finishes while PGN Capture is on will be saved to your defined location on disk (via an AJAX call to `write.php`). It will provide all the standards headers (except `Time Control`, which is bit tricky to get) and also `ECO` and `Opening` headers, as well as a non-standard `Position` header with the FEN classification. **Note:** Unlike opening classification, ccutils will capture all games that finish while its active. This means having multiple games open will save all of them once they finish.

#Todo
- Ability to save to multiple different files?
- Ability to download PGN of single game
- ~~Opening classification~~