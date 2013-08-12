var decode = {"a":"a1", "i":"a2", "q":"a3", "y":"a4", "G":"a5", "O":"a6", "W":"a7", "4":"a8", "b":"b1", "j":"b2", "r":"b3", "z":"b4", "H":"b5", "P":"b6", "X":"b7", "5":"b8", "c":"c1", "k":"c2", "s":"c3", "A":"c4", "I":"c5", "Q":"c6", "Y":"c7", "6":"c8", "d":"d1", "l":"d2", "t":"d3", "B":"d4", "J":"d5", "R":"d6", "Z":"d7", "7":"d8", "e":"e1", "m":"e2", "u":"e3", "C":"e4", "K":"e5", "S":"e6", "0":"e7", "8":"e8", "f":"f1", "n":"f2", "v":"f3", "D":"f4", "L":"f5", "T":"f6", "1":"f7", "9":"f8", "g":"g1", "o":"g2", "w":"g3", "E":"g4", "M":"g5", "U":"g6", "2":"g7", "!":"g8", "h":"h1", "p":"h2", "x":"h3", "F":"h4", "N":"h5", "V":"h6", "3":"h7", "?":"h8"};

var promotions = {
	"{": [-1, 'q'], //cap to q -1
	"~":[0, 'q'], //Q
	"}":[1, 'q'], //cap to q +1
	"(":[-1, 'n'], // cap to n -1
	"^":[0, 'n'], //N
	")":[1, 'n'], // cap to n +1
	"[":[-1, 'r'], //cap r -1
	"_":[0, 'r'], //R
	"]":[1, 'r'], //cap r +1
	"@":[-1, 'b'], //cap to b -1
	"#":[0, 'b'], //B
	"$":[1, 'b'] //cap to b +1
};

function decodeMoves(moves) {
	var game = new Chess();
	var is_white = true;
	for(var i=0; i<moves.length-1; i+=2) {
		var from = moves[i];
		from = decode[from];

		var to = moves[i+1];
		var promotion = '';
		var direction = (is_white ? 1 : -1);
		if(to in promotions) {
			promotion = promotions[to][1];
			to_file = String.fromCharCode(from.charCodeAt(0) + (promotions[to][0]));
			to_rank = String.fromCharCode(from.charCodeAt(1) + (direction));
			to = to_file + to_rank;
		} else {
			to = decode[to];
		}

		/*console.log(is_white, {from: from, to: to, promotion: promotion});
		console.log(game.move({from: from, to: to, promotion: promotion}));
		console.log(game.ascii());
		console.log('-------------');*/
		game.move({from: from, to: to, promotion: promotion});
		is_white = !is_white;
	}
	return game;
}

var end_game_channel_sub;
var games = {};
//var game_times = {};

function save_button() {
	/*var g = decodeMoves("mCZJCK6ZpF1LKTXHFNWGT2YI2)0KoEIAEMAsMUHzU3zr3@ri?Ui}NVsjV3j(3^GykAyqAIqiIQarQYi_Y)KCnDCv7Svnemn$SY87YSZS!SrcmectembdmtdftsJBsrBtU95Qhgfg");
	console.log(g.pgn());
	return;*/

	if($('#savepgn_btn').hasClass('saving')) {
		$('#savepgn_btn')
		.html('SavePGN: Off')
		.removeClass('saving')
		.css('color', 'white');

		cometd.unsubscribe(end_game_channel_sub);
	} else {
		$('#savepgn_btn')
		.html('SavePGN: Saving')
		.addClass('saving')
		.css('color', 'green');

		end_game_channel_sub = cometd.subscribe(
			'/service/game',
			function(msg) {
				console.log('msg', msg);
				/*if(msg.data.game.time) {
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
				}*/

				if(msg.data.game.status == 'finished') {
					var game = decodeMoves(msg.data.game.moves);

					var date = new Date();
					var month = date.getMonth()+1;
					var day = date.getDate();

					var date_str = date.getFullYear() + '.' +
						((''+month).length<2 ? '0' : '') + month + '.' +
						((''+day).length<2 ? '0' : '') + day;

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
					}

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
					games[msg.data.game.id] = game;
					console.log('games ', games);
					/*$.ajax({
						url: 'http://localhost/a/write.php',
						type: 'post',
						data: {'pgn': game.pgn()}
					});*/
				}
			}
		);
	}
}

(function() {
	var li = $('<li/>');
	var a = $('<a/>')
	.html('SavePGN: Off')
	.attr({'href': '#', 'id': 'savepgn_btn'})
	.addClass('bold')
	.click(save_button);
    $('#top_bar_settings').append(li.append(a));
})();