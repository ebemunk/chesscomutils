(function() {
	/* jshint -W110, -W043 */
	/* jshint unused: false */
	/* global $: true, CC: true, Chess: true, console: true, body: true, cometd: true, Mousetrap: true */
	"use strict";

	$.extend(CC, {
		//list of random messages to write to chat
		message_list: [
			'what??',
			'lol!',
			'whoa',
			'amazing',
			'...'
		],
		//get random number between range
		random_minute: function (min, max) {
			return (Math.floor(Math.random() * (max - min + 1)) + min) * 60000;
		},
		// classify opening given an array of moves from the SCID opening book
		classify_opening: function(moves) {
			var game = new Chess(); //used to get FEN for every move
			var movetext = ''; //used to directly search by move order
			var op_moves, op_fen;
			$.each(moves, function(i, v) {
				//write move number
				if(i === 0) {
					movetext += '1.';
				} else if(i % 2 === 0) {
					movetext += (i/2)+1 + '.';
				}
				movetext += v + ' '; //append move text

				game.move(v);

				//assign only if found
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
		// get the opening of the game that has a visible notation window
		get_opening: function() {
			var notation = $('div[id^="notation_"]:visible');
			if(!notation.length) { //clear if no visible notation
				$('#ccutils_opening_moves').text('Notation window not visible.');
				$('#ccutils_opening_fen').text('');
				return;
			}
			//console.log('notation', notation);

			//var id = notation.attr('id').replace('notation_', '');
			//console.log('id', id);

			var moves = [];
			notation.find('.notationVertical').each(function(i, v) {
				$(v).find('.gotomove').each(function(ii, n) {
					moves.push($(n).text());
				});
			});

			var opening = CC.classify_opening(moves);

			var new_opening_text, new_fen_text;
			// write to green bar
			if(opening.moves) {
				new_opening_text = 'Opening: ' + opening.moves.eco + ': ' + ' ' + opening.moves.name + ' (' + opening.moves.moves + ')';
				if($('#ccutils_opening_moves').text() != new_opening_text) {
					$('#ccutils_opening_moves').text(new_opening_text);
				}
			} else {
				$('#ccutils_opening_moves').text('Opening: N/A');
			}

			if(opening.fen) {
				new_fen_text = 'Position: ' + opening.fen.eco + ': ' + ' ' + opening.fen.name + ' (' + opening.fen.moves + ')';
				if($('#ccutils_opening_fen').text() != new_fen_text) {
					$('#ccutils_opening_fen').text(new_fen_text);
				}
			} else {
				$('#ccutils_opening_fen').text('Position: N/A');
			}
		},
		//subscribe to /game/* to refresh opening checker
		opening_refresh: function(msg) {
			//run the opening checker
			//every move comes in the /game/<id> channel, so don't rely on the timer
			CC.game_all_channel = cometd.subscribe('/game/*', CC.get_opening);
		},
		//flash keyboard icon for feedback
		flash_keyboard_icon: function() {
			$('#ccutils_keyboard_icon')
				.animate({opacity: 1}, 100)
				.animate({opacity: 0.3}, 100);
		},
		//avoid idle disconnect
		avoid_idle: function() {
			if($('#ccutils_noafk_icon').is(':visible')) {
				$('.chatInputGameWrapper input[id^=chatInput_]').first().val(CC.message_list[Math.floor(Math.random()*CC.message_list.length)]);
				$('.chatInputGameWrapper button[id^=chatInputButton_]').click();
				CC.idle_avoidance = setTimeout(CC.avoid_idle, CC.random_minute(30, 50));
			}
		}
	});

	//remove old ui components if bookmarklet is refreshed
	if($('#ccutils_wrapper').length) {
		$('#ccutils_opening').off();
		$('#ccutils_wrapper').remove();
		$('#ccutils_capture').off().parent().remove();
		$('#ccutils_keyboard_icon').off().remove();

		//unbind Mousetrap events
		Mousetrap.unbind([
			'shift+c s',
			'shift+c d',
			'shift+c r',
			'shift+c shift+r'
		]);
	} else {
		$('#main_bc').css('margin-top', '25px');
	}

	//timer to classify openings
	CC.opening_checker = setInterval(CC.get_opening, 5000);

	//start off avoid idle
	CC.idle_avoidance = setTimeout(CC.avoid_idle, CC.random_minute(30, 50));

	//subscribe to /game/*
	CC.opening_refresh();

	//ui additions
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
		.click(CC.get_opening);

	var div_opening_moves = $('<p/>')
		.attr({
			'id': 'ccutils_opening_moves',
			'title': 'Opening classification according to the move order.'
		})
		.css({
			'font-size': '12px',
			'line-height': '14px',
		})
		.appendTo(div_opening);

	var div_opening_fen = $('<p/>')
		.attr({
			'id': 'ccutils_opening_fen',
			'title': 'Opening classification according to the game position.'
		})
		.css({
			'font-size': '12px',
			'line-height': '14px'
		})
		.appendTo(div_opening);

	var keyboard_icon = $('<div/>')
		.attr('id', 'ccutils_keyboard_icon')
		.css({
			'background-image': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACEUlEQVRYhe3WMUhVURgH8N8xEZGIBgmRiKjFJFpqiIoWy6GhNVocm4qWkJpEJGoLXJormhtU2iKCBhscKiJaopJKCbEQCTFPw/2eXV/vYQ96vOV9l8O9/+/7zjn/+53/PeemLGuldbR09jaBNoE2AXRWHpJ0CuM40MT51nAPk1legVTZiJL0GMN400QCe9CDoSy/oFQB7MUKTuJnkwhMYBS7K45aGliP1oGNLK+V8HpgkOW1wOXcjarc6tgWqyfCM/iCa4EvYwHnk9SLKcwmqTdJxyM2kaQO3Im+A5G7gIf1StJZx7+MOXwO/DXwkkJI77AYlVmJ2IfIfR94NcbfhZ31CMhx4RW+oydwR6WVcrbFVbF+ZMyE71bg4UpezQokaRBXSngmy9MYwaEk3cUP3MAnTCbpNC4k6UFU4DoO1n3zsHpLsB+X/NHIEqZxVqGPRwpBjeA1JnEk+syG7yIGov96owSeVLFfjvtVdCvWfwNHS4PfD5LfFOs/hK6IrTZKoBt9mM/yfJL6knSiFN9XTk5SeffsD3IvFYI9pqjgYs2ZaokQ5xRiGY/YaOBG2mHFzpcx1ZAIFZ/ZGJ4GfhZ4O9uBX1GBRcUnOoa39TrUItCFj7gNSepSqHruHwjUsvI4f81XdsxjEM/V2DL/k/UpqlIR9RYCNxVv38zjeElxHG+euJvHcaus5X9EbQJtAm0CvwEi8Mhr8HnPPAAAAABJRU5ErkJggg==')",
			'position': 'fixed',
			'top': 34,
			'right': 10,
			'z-index': 9,
			'height': 32,
			'width': 32,
			'opacity': 0.3
		})
		.attr('title', ' \
Key Bindings:\n \
  "shift+c s" Seek Game\n \
  "shift+c d" Offer Draw\n \
  "shift+c r" Resign\n \
  "shift+c shift+r" Clean Refresh\n \
  "shift+c shift+n" Toggle Avoid Idle Disconnection')
		.appendTo(body);

	var noafk_icon = $('<div/>')
		.attr({
			'id': 'ccutils_noafk_icon',
			'title': 'Will post a message to chat every 30-50 minutes to avoid idle disconnection.'
		})
		.css({
			'background-image': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACf0lEQVRYhe3WTYhNYRgH8N+9TTdJkyZJbKRpFkMWkoTlJEmysJBkIUkSFlYSWchCVhaSlWRhMUmSpFlYjBI1U8KGGIN8JB/jIy6OxftcjtO9c4+FxmLe21u39z3P//k//+fjnEomM5GrOqHeJwlMEvgfCHT8zcMVlRo6MQNz0YUa3uIxnuN9JvtQGjQr8cMU9OEkbuMLssL+jlGcx2bMKIVdwvEqXMW7gsNR3MAd1At3n+N8ezsi4zmfjsN4HdE1oq6jH0swDesxViBQz+1+9P4VAczDYDi+h70RbYbTkftDoUIxFVmQ3Y9z8f8VVqKjLQH0hOR1DGAhVkQKnmJZEPrcwnljnwkVD4TtCNai2pJAGFwOgH7MjvONcTYQBG+2cZ7hdtjWsCUCGsGSpgTiwSMh2SC6cnebAnQowN6UIHAnZ98RKfmIa5jVjEBPAI9gWUGZPr8rvVjxrfaVAkYXLkRdbWuc5ydhp1TVX1EcJPdxN/6XGV4/wll+NXCrmPPrtJD/ixHhJUwtSLgv2JeJfgjdOfsqdkntOooFrYpwAR4GyHFMz91NlbqjHYkx9BWcr5Xy/xFb5TrhDwJhsCZYfpF6flbubjZOaV6Edak71jUcSJN0B15IbXsEtXZzoCNAxgL0KhYWlFiNE1K3DEXqdmFe7rlOHPN7Sh7NK9qSQA5gqdQyDVlPYjGmjGNTld6Se/AgbEews5VNJQybrorKXOzGBszEE6kbBjGMl/gmFXAPlmMRuqWqv46DuJXJvjV10opZIbJFIeED7YvwDc5GGmvtsMdVoKBGTRomvdKbcH5E3vggeSQV4TCeZbJPpXDLEvhXa8K/CScJTBKYcAI/Ab4bLoV1rpZtAAAAAElFTkSuQmCC')",
			'position': 'fixed',
			'top': 34,
			'right': 42,
			'z-index': 9,
			'height': 32,
			'width': 32,
			'opacity': 0.3
		})
		.appendTo(body);

	//key bindings - check until Mousetrap becomes available
	var checkmousetrap = setInterval(function() {
		if(Mousetrap) {
			clearInterval(checkmousetrap);

			//create seek
			Mousetrap.bind('shift+c s', function() {
				CC.flash_keyboard_icon();
				$('#new_game_pane_create_button').click();
			});

			//offer draw
			Mousetrap.bind('shift+c d', function() {
				if(!$('input[id^=b-draw]:visible').get(0)) {
					return;
				}
				CC.flash_keyboard_icon();
				$('input[id^=b-draw]:visible').click();
			});

			//resign
			Mousetrap.bind('shift+c r', function() {
				if(!$('input[id^=b-resign-abort]:visible').get(0)) {
					return;
				}
				CC.flash_keyboard_icon();
				$('input[id^=b-resign-abort]:visible').click();
			});

			//close all game tabs & refresh
			Mousetrap.bind('shift+c shift+r', function() {
				CC.flash_keyboard_icon();
				$('.nowrapTabStrip .dijitTabCloseButton').click();
				setTimeout(function() {
					window.location = 'http://live.chess.com/live';
				}, 350);
			});

			//avoid idle disconnect
			Mousetrap.bind('shift+c shift+n', function() {
				$('#ccutils_noafk_icon').toggle();
				if($('#ccutils_noafk_icon').is(':visible')) {
					CC.idle_avoidance = setTimeout(CC.avoid_idle, CC.random_minute(30, 50));
				} else {
					clearTimeout(CC.idle_avoidance);
				}
			});
		}
	}, 300);
})();