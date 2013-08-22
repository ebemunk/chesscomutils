/////////////////////////////////////////////////////////////////////
//listener for cometd packets containing finished game information //
/////////////////////////////////////////////////////////////////////

//square mappings for encoded moves string
var decode = {"a":"a1", "i":"a2", "q":"a3", "y":"a4", "G":"a5", "O":"a6", "W":"a7", "4":"a8", "b":"b1", "j":"b2", "r":"b3", "z":"b4", "H":"b5", "P":"b6", "X":"b7", "5":"b8", "c":"c1", "k":"c2", "s":"c3", "A":"c4", "I":"c5", "Q":"c6", "Y":"c7", "6":"c8", "d":"d1", "l":"d2", "t":"d3", "B":"d4", "J":"d5", "R":"d6", "Z":"d7", "7":"d8", "e":"e1", "m":"e2", "u":"e3", "C":"e4", "K":"e5", "S":"e6", "0":"e7", "8":"e8", "f":"f1", "n":"f2", "v":"f3", "D":"f4", "L":"f5", "T":"f6", "1":"f7", "9":"f8", "g":"g1", "o":"g2", "w":"g3", "E":"g4", "M":"g5", "U":"g6", "2":"g7", "!":"g8", "h":"h1", "p":"h2", "x":"h3", "F":"h4", "N":"h5", "V":"h6", "3":"h7", "?":"h8"};

//promotion mappings for encoded moves
var promotions = {
	"{": [-1, 'q'], //capture to queen on prev file
	"~":[0, 'q'], //move to queen (same file)
	"}":[1, 'q'], //capture to queen on next file
	"(":[-1, 'n'], //capture to knight on prev file
	"^":[0, 'n'], //move to knight (same file)
	")":[1, 'n'], //capture to knight on next file
	"[":[-1, 'r'], //capture to rook on prev file
	"_":[0, 'r'], //move to rook
	"]":[1, 'r'], //capture to rook on next file
	"@":[-1, 'b'], //capture to bishop on prev file
	"#":[0, 'b'], //move to bishop
	"$":[1, 'b'] //capture to bishop on next file
};

//decodes the "moves" string (acquired from cometd subscription) and returns a Chess() game with those moves
function decodeMoves(moves) {
	var game = new Chess();
	var is_white = true;
	for(var i=0; i<moves.length-1; i+=2) {
		var from = moves[i];
		from = decode[from];

		var to = moves[i+1];
		var promotion = '';
		var direction = (is_white ? 1 : -1); //pawn movement direction in the file
		if(to in promotions) {
			promotion = promotions[to][1];
			to_file = String.fromCharCode(from.charCodeAt(0) + (promotions[to][0]));
			to_rank = String.fromCharCode(from.charCodeAt(1) + (direction));
			to = to_file + to_rank;
		} else {
			to = decode[to];
		}

		/* quick test for move output details
		console.log(is_white, {from: from, to: to, promotion: promotion});
		console.log(game.move({from: from, to: to, promotion: promotion}));
		console.log(game.ascii());
		console.log('-------------');
		*/
		game.move({from: from, to: to, promotion: promotion}); //make the move
		is_white = !is_white;
	}
	return game;
}

//keep track of cometd channel to unsubscribe later
var end_game_channel_sub;
//keep track of games captured
var games = {};
//var game_times = {};

//captures messages sent by cometd and parses the games
function capture_button() {
	/* quick test moves function
	var g = decodeMoves("mCZJCK6ZpF1LKTXHFNWGT2YI2)0KoEIAEMAsMUHzU3zr3@ri?Ui}NVsjV3j(3^GykAyqAIqiIQarQYi_Y)KCnDCv7Svnemn$SY87YSZS!SrcmectembdmtdftsJBsrBtU95Qhgfg");
	console.log(g.pgn());
	return;
	*/

	if($('#ccpgn_btn').hasClass('saving')) { //turn off
		$('#ccpgn_btn')
		.html('PGNcapture: Off')
		.removeClass('saving')
		.css('color', 'white');

		cometd.unsubscribe(end_game_channel_sub);
	} else { //turn on
		$('#ccpgn_btn')
		.html('PGNcapture: Saving')
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
		end_game_channel_sub = cometd.subscribe(
			'/service/game',
			function(msg) {
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
					var game = decodeMoves(msg.data.game.moves); //decode moves

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
						//TODO: 3-fold repetition, stalemate, what else?
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
						'Mode', 'ICS'
					);

					//console.log('pgn', game.pgn());
					
					//put game into games list
					games[msg.data.game.id] = game;
					//console.log('games ', games);
					
					//send to writer for file output
					$.ajax({
						url: 'http://localhost/ccpgncapture/write.php',
						type: 'post',
						data: {'pgn': game.pgn()}
					});
				}
			}
		);
	}
}

function test_os() {
	console.log('a',$('.notation'));
};

//init function, sets up the link for the script
(function() {
	//console.log('ye', window.ccpgn_active);
	if(window.ccpgn_active) {
		if($('#ccpgn_btn').hasClass('saving')) {
			$('#ccpgn_btn').click();
		}
		$('#ccpgn_btn').off('click').click(test_os);
		return;
	}
	window.ccpgn_active = true;
	var li = $('<li/>');
	var a = $('<a/>')
	.html('PGNcapture: Off')
	.attr({'href': '#', 'id': 'ccpgn_btn'})
	.addClass('bold')
	.click(test_os);
    $('#top_bar_settings').append(li.append(a));
})();