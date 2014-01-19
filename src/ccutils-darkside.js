(function() {
	"use strict";
	/* global $: true, CC: true, Chess: true, console: true, body: true, cometd: true, Mousetrap: true */

	$.extend(CC, {
		random_sec: function (min, max) {
			return (Math.floor(Math.random() * (max - min + 1)) + min) * 100;
		},
		listen_games: function() {
			console.log('bot active');
			CC.ds_game_all_channel = cometd.addListener("/game/*", function(msg) { CC.magic(msg); });
			console.log('bot bound');
		},
		unlisten_games: function() {
			cometd.removeListener(CC.ds_game_all_channel);
		},
		im_white: 'duno',
		panick: false,
		my_id: 'duno',
		magic: function(msg) {
			if(msg.data.tid == 'FullGame') {
				if(msg.data.game.players[0].uid != 'abii_91') {
					CC.im_white = false;
				} else {
					CC.im_white = true;
				}
			}

			if(msg.data.tid == 'GameState') {
				if(CC.im_white == 'duno') {
					if(msg.data.game.players[0].uid != 'abii_91') {
						CC.im_white = false;
					} else {
						CC.im_white = true;
					}
				}

				console.log('clocks', msg.data.game.clocks[!CC.im_white + 0]);
				if(msg.data.game.clocks[!CC.im_white + 0] < 175) {
					CC.panick = true;
					console.log('PANICKING');
				} else {
					CC.panick = false;
					console.log('NOT PANICKING');
				}

				if( (msg.data.game.seq % 2 == 0 && !CC.im_white) ||
					(msg.data.game.seq % 2 == 1 && CC.im_white) ) {
					console.log('not sending', CC.im_white, msg.data.game.seq);
				} else {
					console.log('sending, my turn next', CC.im_white, msg.data.game.seq);
					CC.to_engine(msg);
				}
			}
		},
		to_engine: function(msg) {
			var notation = $('div[id^="notation_"]:visible');

			var moves = [];
			var notations;
			notations = notation.find('.notationVertical');
			notations.each(function(i, v) {
				$(v).find('.gotomove').each(function(ii, n) {
					moves.push($(n).text());
				});
			});

			var game = new Chess();
			$.each(moves, function(i, v) {
				game.move(v);
			});

			var fen = game.fen();
			console.log('heli', msg);

			$.ajax({
				url: 'http://localhost/chesscomutils/darkside/darkside.php',
				data: {
					'fen': fen,
					// 'persona': 'hermann',
					'wtime': msg.data.game.clocks[0],
					'btime': msg.data.game.clocks[1]
					},
					crossDomain: true,
					dataType: "jsonp",
				success: function(data) {
					console.log('onceki', data);
					var square_size = parseInt($('div[id^=letter_chessboard][id$=1]')
						.not('.chessboard_dummy_piece')
						.css('width'));
// console.log('sqsiz', square_size);

					var raw = data.bestmove.split('');
					var from_coord = [raw[0], raw[1]];
					var to_coord = [raw[2], raw[3]];

					var from = $('img[id^=img_chessboard][id$='+data.bestmove.substr(0,2)+']:visible').not('.chessboard_dummy_piece');
// console.log('from', from);

// console.log('to', to_coord);

					var filemap = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};

					var dleft = filemap[to_coord[0]] - filemap[from_coord[0]];
					var dtop = to_coord[1] - from_coord[1];

					var fpos = from.offset();
					var tpos = {top: -dtop*square_size, left: dleft*square_size};
					if(!CC.im_white) {
						tpos.top = -tpos.top;
						tpos.left = -tpos.left;
					}
// console.log('fpos tpos', fpos, tpos);
					// from.simulate('drag', {dx:tpos.left, dy:tpos.top});
					var play_time = CC.random_sec(7, 17)*1*1;
					if(CC.panick) {
						play_time = CC.random_sec(0, 0.3);
					}

					console.log('playtime', play_time, CC.panick);

					window.setTimeout(function() {
						from.simulate('drag', {dx:tpos.left, dy:tpos.top});
					}, play_time);
					// console.log(fpos, tpos, d.x, d.y);

				},
				error: function(data) {
					console.log('er', data);
				}
			});
		}
	});

	CC.listen_games();
})();