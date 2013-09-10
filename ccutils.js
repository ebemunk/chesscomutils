(function() {
	/* jshint -W110 */
	/* global $: true, CC: true, Chess: true, console: true, body: true, cometd: true */
	"use strict";

	window.CC = {
		classify_opening: function(moves) {
			var game = new Chess();
			var movetext = '';
			var op_moves, op_fen;
			$.each(moves, function(i, v) {
				if(i == 0) {	
					movetext += '1.';
				} else if(i % 2 == 0) {
					movetext += (i/2)+1 + '.';
				}
				movetext += v + ' ';

				game.move(v);

				var cur_opening = CC.openings[movetext.trim()];
				if(cur_opening) {
					op_moves = cur_opening;
				}

				var cur_fen = CC.openings_fen[game.fen()];
				if(cur_fen) {
					op_fen = cur_fen;
				}
			});
			return {
				moves: op_moves,
				fen: op_fen
			};
		},
		get_opening: function() {
			var notation = $('div[id^="notation_"]:visible');
			if(!notation.length) {
				$('#ccutils_opening_moves').text('');
				$('#ccutils_opening_fen').text('');
				return;
			}
			//console.log('notation', notation);

			var id = notation.attr('id').replace('notation_', '');
			//console.log('id', id);

			var game = new Chess();
			var movetext = '';
			var op_moves, op_fen;

			notation.find('.notationVertical').each(function(i, v) {
				movetext += $(v).find('.num').text();
				$(v).find('.gotomove').each(function(ii, n) {
					movetext += $(n).text() + ' ';
					game.move($(n).text());

					var cur_opening = CC.openings[movetext.trim()];
					if(cur_opening) {
						op_moves = cur_opening;
					}

					var cur_fen = CC.openings_fen[game.fen()];
					if(cur_fen) {
						op_fen = cur_fen;
					}
				});
			});

			if(op_moves) {
				$('#ccutils_opening_moves').text('Opening: ' + op_moves.eco + ': ' + ' ' + op_moves.name + ' (' + op_moves.moves + ')');
			} else {
				$('#ccutils_opening_moves').text('Opening: N/A');
			}

			if(op_fen) {
				$('#ccutils_opening_fen').text('Position: ' + op_fen.eco + ': ' + ' ' + op_fen.name + ' (' + op_fen.moves + ')');
			} else {
				$('#ccutils_opening_fen').text('Position: N/A');
			}
		},
		//square mappings for encoded moves string
		decode: {
			'a':'a1', 'i':'a2', 'q':'a3', 'y':'a4', 'G':'a5', 'O':'a6', 'W':'a7', '4':'a8',
			'b':'b1', 'j':'b2', 'r':'b3', 'z':'b4', 'H':'b5', 'P':'b6', 'X':'b7', '5':'b8',
			'c':'c1', 'k':'c2', 's':'c3', 'A':'c4', 'I':'c5', 'Q':'c6', 'Y':'c7', '6':'c8',
			'd':'d1', 'l':'d2', 't':'d3', 'B':'d4', 'J':'d5', 'R':'d6', 'Z':'d7', '7':'d8',
			'e':'e1', 'm':'e2', 'u':'e3', 'C':'e4', 'K':'e5', 'S':'e6', '0':'e7', '8':'e8',
			'f':'f1', 'n':'f2', 'v':'f3', 'D':'f4', 'L':'f5', 'T':'f6', '1':'f7', '9':'f8',
			'g':'g1', 'o':'g2', 'w':'g3', 'E':'g4', 'M':'g5', 'U':'g6', '2':'g7', '!':'g8',
			'h':'h1', 'p':'h2', 'x':'h3', 'F':'h4', 'N':'h5', 'V':'h6', '3':'h7', '?':'h8'
		},
		//promotion mappings for encoded moves
		promotions: {
			'{': [-1, 'q'], //capture to queen on prev file
			'~':[0, 'q'], //move to queen (same file)
			'}':[1, 'q'], //capture to queen on next file
			'(':[-1, 'n'], //capture to knight on prev file
			'^':[0, 'n'], //move to knight (same file)
			')':[1, 'n'], //capture to knight on next file
			'[':[-1, 'r'], //capture to rook on prev file
			'_':[0, 'r'], //move to rook
			']':[1, 'r'], //capture to rook on next file
			'@':[-1, 'b'], //capture to bishop on prev file
			'#':[0, 'b'], //move to bishop
			'$':[1, 'b'] //capture to bishop on next file
		},
		decode_moves: function(moves) {
			var game = new Chess();
			var is_white = true;
			for(var i=0; i<moves.length-1; i+=2) {
				var from = moves[i];
				from = CC.decode[from];

				var to = moves[i+1];
				var promotion = '';
				var direction = (is_white ? 1 : -1); //pawn movement direction in the file

				if(to in CC.promotions) {
					promotion = CC.promotions[to][1];
					var to_file = String.fromCharCode(from.charCodeAt(0) + (CC.promotions[to][0]));
					var to_rank = String.fromCharCode(from.charCodeAt(1) + (direction));
					to = to_file + to_rank;
				} else {
					to = CC.decode[to];
				}

				game.move({from: from, to: to, promotion: promotion}); //make the move
				is_white = !is_white;

				/* quick test for move output details
				console.log(is_white, {from: from, to: to, promotion: promotion});
				console.log(game.move({from: from, to: to, promotion: promotion}));
				console.log(game.ascii());
				console.log('-------------');
				*/
			}
			return game;
		},
		listen: function(msg) {
			//console.log('msg', msg);
			/*
			TODO: keep track of game_times/better way to get time controls for game
			if(msg.data.game.time) {
				game_times[msg.data.game.id] = {time: msg.data.game.time, count: 0};

				$.each(games, function(key, value) {
					if(key in game_times) {
						console.log('write ', key);
					} else {
						game_times[key].count++;
						console.log('time not found for ', key);
					}
				});
				console.log('game_times ', game_times);
			}
			*/
			if(msg.data.game.status == 'finished') { //found a finished game
				console.log('girdi1', msg);
				var game = CC.decode_moves(msg.data.game.moves); //decode moves
				var game_opening = CC.classify_opening(game.history()); //classify opening

				//prepare PGN headers

				//date
				var date = new Date();
				var month = date.getMonth()+1;
				var day = date.getDate();

				var date_str = date.getFullYear() + '.' +
					((''+month).length<2 ? '0' : '') + month + '.' +
					((''+day).length<2 ? '0' : '') + day;

				//game result
				var result;
				var loser = false, winner = false;
				if(msg.data.game.results[0] == 'win') {
					result = '1-0';
					winner = 0;
					loser = 1;
				} else if(msg.data.game.results[1] == 'win') {
					result = '0-1';
					winner = 1;
					loser = 0;
				} else {
					result = '1/2-1/2';
				}

				//termination
				var termination;
				switch(msg.data.game.results[loser]) {
					case 'resigned':
						termination = msg.data.game.players[winner].uid + ' won by resignation.';
						break;
					case 'timeout':
						termination = msg.data.game.players[winner].uid + ' won on time.';
						break;
					case 'checkmated':
						termination = msg.data.game.players[winner].uid + ' won by checkmate.';
						break;
					case 'abandoned':
						termination = msg.data.game.players[winner].uid + ' won - game abandoned.';
						break;
					case 'agreed':
						termination = 'Game drawn by agreement.';
						break;
					case 'stalemate':
						termination = 'Game drawn by stalemate.';
						break;
					case 'repetition':
						termination = 'Game drawn by repetition.';
						break;
					case 'insufficient':
						termination = 'Game drawn - insufficient material.';
						break;
				}

				//write PGN headers to the game object
				game.header(
					'Event', 'Live Chess',
					'Site', 'Chess.com',
					'Date', date_str,
					'White', msg.data.game.players[0].uid,
					'Black', msg.data.game.players[1].uid,
					'Result', result,
					'WhiteElo', msg.data.ratings[0],
					'BlackElo', msg.data.ratings[1],
					//'TimeControl', '1|0',
					'Termination', termination,
					'ECO', game_opening.moves.eco,
					'Opening', game_opening.moves.name,
					'Variation', game_opening.fen.eco + ': ' + game_opening.fen.name,
					'Kerkuk', 'amcik'
				);

				//console.log('pgn', game.pgn());
				
				//put game into games list
				//games[msg.data.game.id] = game;
				//console.log('games ', games);
				
				//send to writer for file output
				$.ajax({
					url: 'http://localhost/chesscomutils/write.php',
					type: 'post',
					data: {'pgn': game.pgn()}
				});
			}
		},
		toggle_pgn_capture: function() {
			/* quick test moves function
			var g = decodeMoves("mCZJCK6ZpF1LKTXHFNWGT2YI2)0KoEIAEMAsMUHzU3zr3@ri?Ui}NVsjV3j(3^GykAyqAIqiIQarQYi_Y)KCnDCv7Svnemn$SY87YSZS!SrcmectembdmtdftsJBsrBtU95Qhgfg");
			console.log(g.pgn());
			return;
			*/
			if($('#ccutils_capture').hasClass('saving')) { //turn off
				$('#ccutils_capture')
				.html('Capture PGN: Off')
				.removeClass('saving')
				.css('color', 'white');

				cometd.unsubscribe(CC.service_game_channel);
			} else { //turn on
				$('#ccutils_capture')
				.html('Capture PGN: On')
				.addClass('saving')
				.css('color', 'green');

				/*cometd.subscribe('/service/*', function(msg) {
					console.log(msg);
				});
				return;*/
				/**
				 * subscribe to cometd /service/game channel. this channel seems to be used for transmitting
				 * "EndGame" packets which have information about the game that has ended (that the user was viewing).
				 *
				 * the Time Control for the game seems to be sent in a different packet, usually AFTER the game is over.
				 * this doesn't seem to be the case for your own games though. for now, Time Control is ignored.
				 *
				 * subscribe to this channel and start listening for finished games, parse moves and send request to
				 * local write.php for file output
				 */
				CC.service_game_channel = cometd.subscribe(
					'/service/game', CC.listen
				);
			}
		}
	};

	if($('#ccutils_wrapper').length) {
		$('#ccutils_opening').off();
		$('#ccutils_wrapper').remove();
		$('#ccutils_capture').off().parent().remove();
	} else {
		$('#main_bc').css('margin-top', '25px');
	}

	window.CC.opening_checker = setInterval(CC.get_opening, 5000);

	var div_wrapper = $('<div/>')
	.attr('id', 'ccutils_wrapper')
	.css({
		'position': 'fixed',
		'top': 35,
		'z-index': 9,
		'color': 'white',
		'height': '28px',
		'width': '100%'
	})
	.appendTo(body);

	var div_opening = $('<div/>')
	.attr('id', 'ccutils_opening')
	.css({
		'background-color': '#6a943f',
		'margin': '0px 5px',
		'height': '100%',
		'border-radius': '5px 5px 0px 0px',
		'border-top': '1px solid #799e52',
		'border-bottom': '1px solid #4c7637',
		'padding-left': '5px'
	})
	.appendTo(div_wrapper)
	.click(window.CC.get_opening);

	var div_opening_moves = $('<p/>')
	.attr('id', 'ccutils_opening_moves')
	.css({
		'font-size': '12px',
		'line-height': '14px',
	})
	.appendTo(div_opening);

	var div_opening_fen = $('<p/>')
	.attr('id', 'ccutils_opening_fen')
	.css({
		'font-size': '12px',
		'line-height': '14px'
	})
	.appendTo(div_opening);

	var a_capture = $('<a/>')
	.html('Capture PGN: Off')
	.attr({'href': '#', 'id': 'ccutils_capture'})
	.addClass('bold')
	.click(window.CC.toggle_pgn_capture);

	$('#top_bar_settings').append($('<li/>').append(a_capture));
})();