all:
	uglifyjs bookmarklet.js -o bookmarklets/bookmarklet.txt
	uglifyjs bookmarklet-online.js -o bookmarklets/bookmarklet-online.txt
	uglifyjs chess.js mousetrap.js ccutils-core.js -o ccutils-bundled.min.js