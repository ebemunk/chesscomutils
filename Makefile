all: bookmarklets/bookmarklet.txt bookmarklets/bookmarklet-online.txt ccutils-bundled.min.js openings.min.js

bookmarklets/bookmarklet.txt: bookmarklet.js
	uglifyjs bookmarklet.js -o bookmarklets/bookmarklet.txt

bookmarklets/bookmarklet-online.txt: bookmarklet-online.js
	uglifyjs bookmarklet-online.js -o bookmarklets/bookmarklet-online.txt

ccutils-bundled.min.js: chess.js mousetrap.js ccutils-core.js
	uglifyjs chess.js mousetrap.js ccutils-core.js -o ccutils-bundled.min.js

openings.min.js: scid-openings/openings.js scid-openings/openings_fen.js
	uglifyjs scid-openings/openings.js scid-openings/openings_fen.js -o openings.min.js