/* global $: true, CC: true, console: true, body: true, cometd: true, Mousetrap: true */
'use strict';
(function(files){
	//if the object exists, close old connections and clear timeouts
	if(typeof window.CC != 'undefined') {
		if(CC.service_game_channel) {
			cometd.unsubscribe(CC.service_game_channel);
			CC.service_game_channel = null;
		}

		if(CC.game_all_channel) {
			cometd.unsubscribe(CC.game_all_channel);
			CC.game_all_channel = null;
		}

		clearInterval(CC.opening_checker);
		clearTimeout(CC.idle_avoidance);
	}

	//remove old ui components if bookmarklet is refreshed
	if($('#ccutils_wrapper').length) {
		$('#ccutils_opening').off();
		$('#ccutils_wrapper').remove();
		$('#ccutils_capture').off().parent().remove();
		$('#ccutils_keyboard_icon').off().remove();
	} else {
		$('#main_bc').css('margin-top', '25px');
	}

	//unbind Mousetrap events
	if(typeof window.Mousetrap != 'undefined') {
		Mousetrap.reset();
	}

	//create fresh object, to $.extend() later in the injected files
	window.CC = {};

	//inject files to body
	$.each(files, function(index, file) {
		$('#'+file.id).remove();
		$('<script/>')
		.attr('src', file.url)
		.attr('id', file.id)
		.appendTo(body);
	});
})
//files to inject passed as an array into our anonymous injector function above
([
	{
		url: 'http://localhost/chesscomutils/chess.js',
		id: 'chessjs'
	},
	{
		url: 'http://localhost/chesscomutils/mousetrap.js',
		id: 'mousetrap'
	},
	{
		url: 'http://localhost/chesscomutils/openings.min.js',
		id: 'openings'
	},
	{
		url: 'http://localhost/chesscomutils/ccutils-core.js',
		id: 'ccutils-core'
	},
	{
		url: 'http://localhost/chesscomutils/ccutils-pgn.js',
		id: 'ccutils-pgn'
	}
]);