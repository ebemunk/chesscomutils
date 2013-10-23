(function(files){
	if(CC) {
		if(CC.service_game_channel) {
			cometd.unsubscribe(CC.service_game_channel);
		}

		if(CC.game_all_channel) {
			cometd.ubsubscribe(CC.game_all_channel);
		}

		clearInterval(CC.opening_checker);
		clearTimeout(CC.idle_avoidance);
	}

	CC = {};

	$.each(files, function(index, file) {
		$('#'+file.id).remove();
		$('<script/>')
		.attr('src', file.url)
		.attr('id', file.id)
		.appendTo(body);
	});

})
([
	{
		url: 'http://localhost/chesscomutils/chess.min.js',
		id: 'chessjs'
	},
	{
		url: 'http://localhost/chesscomutils/src/mousetrap.min.js',
		id: 'mousetrap'
	},
	{
		url: 'http://localhost/chesscomutils/openings.min.js',
		id: 'openings'
	},
	{
		url: 'http://localhost/chesscomutils/openings_fen.min.js',
		id: 'openings_fen'
	},
	{
		url: 'http://localhost/chesscomutils/src/ccutils-core.js',
		id: 'ccutils-core'
	},
	{
		url: 'http://localhost/chesscomutils/src/ccutils-pgn.js',
		id: 'ccutils-pgn'
	}
]);