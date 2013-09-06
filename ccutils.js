(function() {
	function get_opening() {
		var notation = $('div[id^="notation_"]:visible');
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
				//console.log(cur_opening, cur_fen, game.fen());
			});
		});

		if(op_moves) {
			CC.div_opening_moves.text('Opening: ' + op_moves.eco + ': ' + ' ' + op_moves.name + ' (' + op_moves.moves + ')');
		} else {
			CC.div_opening_moves.text('Opening: N/A');
		}

		if(op_fen) {
			CC.div_opening_fen.text('Position: ' + op_fen.eco + ': ' + ' ' + op_fen.name + ' (' + op_fen.moves + ')');
		} else {
			CC.div_opening_fen.text('Position: N/A');
		}
	}

	if($('#ccutils_opening_wrapper').length) {
		$('#ccutils_opening').off();
		$('#ccutils_opening_wrapper').remove();
		window.clearInterval(CC.interval);
	} else {
		$('#main_bc').css('margin-top', '25px');
	}

	CC.div_opening_wrapper = $('<div/>')
	.attr('id', 'ccutils_opening_wrapper')
	.css({
		'position': 'fixed',
		'top': 35,
		'z-index': 9,
		'color': 'white',
		'height': '28px',
		'width': '100%'
	})
	.appendTo(body);

	CC.div_opening = $('<div/>')
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
	.appendTo($('#ccutils_opening_wrapper'))
	.click(get_opening);

	CC.div_opening_moves = $('<p/>')
	.attr('id', 'ccutils_opening_moves')
	.css({
		'font-size': '12px',
		'line-height': '14px',
	})
	.appendTo($('#ccutils_opening'));

	CC.div_opening_fen = $('<p/>')
	.attr('id', 'ccutils_opening_fen')
	.css({
		'font-size': '12px',
		'line-height': '14px'
	})
	.appendTo($('#ccutils_opening'));

	//CC.interval = window.setInterval(get_opening, 5000);
})();