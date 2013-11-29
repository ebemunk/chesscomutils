(function() {
	/* jshint -W110, -W043 */
	/* jshint unused: false */
	/* global $: true, CC: true, Chess: true, console: true, body: true, cometd: true, Mousetrap: true */
	"use strict";

	$.extend(CC, {
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

				var cur_fen = CC.openings[CC.openings_fen[game.fen()]];
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
		get_opening: function(override_cache) {
			var notation = $('div[id^="notation_"]:visible');
			if(!notation.length) { //clear if no visible notation
				$('#ccutils_opening_moves').text('Notation window not visible.');
				$('#ccutils_opening_fen').text('');
				return;
			}

			if(notation.length > 1) { //cannot support pop-out at this time
				$('#ccutils_opening_moves').text('Cannot run when games popped-out.');
				$('#ccutils_opening_fen').text(':(');
				return;
			}

			//check if we have this game in cache
			//get game id (either #g=<value> or #a=<value> in URL)
			var game_id = window.location.hash.replace(/#(g|a)=/, '');

			if(CC.analyzed_games_cache[game_id] &&
				CC.analyzed_games_cache[game_id].count > 4 &&
				CC.analyzed_games_cache[game_id].opening != 'N/A' &&
				CC.analyzed_games_cache[game_id].num_moves > 16 &&
				!override_cache) {
				$('#ccutils_opening_moves').text(CC.analyzed_games_cache[game_id].opening);
				$('#ccutils_opening_fen').text(CC.analyzed_games_cache[game_id].fen);
				return;
			}
			var moves = [];
			//to handle analysis tabs as well, we check both notationVertical and notationHorizontal
			var notations;
			notations = notation.find('.notationVertical');
			if(notations.length) {
				notations.each(function(i, v) {
					$(v).find('.gotomove').each(function(ii, n) {
						moves.push($(n).text());
					});
				});
			} else {
				notations = notation.find('.notationHorizontal');
				if(notations.length) {
					notations.each(function(i, v) {
						$(v).find('.gotomove').each(function(ii, n) {
							//strip out move numbers in horizontal variation
							var regx = $(n).text().match(/\d*\.\s*(.*)/);
							if(regx) {
								moves.push(regx[1]);
							} else {
								moves.push($(n).text());
							}
						});
					});
				}
			}

			var opening = CC.classify_opening(moves);
			
			//construct opening moves texts
			var new_opening_text, new_fen_text;
			if(opening.moves) {
				new_opening_text = 'Opening: ' + opening.moves.eco + ': ' + ' ' + opening.moves.name + ' (' + opening.moves.moves + ')';
			} else {
				new_opening_text = 'N/A';
			}

			if(opening.fen) {
				new_fen_text = 'Position: ' + opening.fen.eco + ': ' + ' ' + opening.fen.name + ' (' + opening.fen.moves + ')';
			} else {
				new_fen_text = 'N/A';
			}

			//count how many times weve seen the same output
			var count = 1;
			//if samea opening is already in cache, increment count
			if(CC.analyzed_games_cache[game_id] &&
				CC.analyzed_games_cache[game_id].opening == new_opening_text &&
				CC.analyzed_games_cache[game_id].fen == new_fen_text) {
				count = CC.analyzed_games_cache[game_id].count + 1;
			}

			//put to cache
			CC.analyzed_games_cache[game_id] = {
				'opening': new_opening_text,
				'fen': new_fen_text,
				'count': count,
				'num_moves': moves.length
			};

			//write text to green bar
			if($('#ccutils_opening_moves').text() != new_opening_text) {
				$('#ccutils_opening_moves').text(new_opening_text);
			}

			if($('#ccutils_opening_fen').text() != new_fen_text) {
				$('#ccutils_opening_fen').text(new_fen_text);
			}

			return opening;
		},
		//subscribe to /game/* to refresh opening checker
		//and /service/game to flush cache
		opening_refresh: function() {
			//run the opening checker
			//every move comes in the /game/<id> channel, so don't rely on the timer
			CC.game_all_channel = cometd.addListener("/game/*", function(msg) { CC.get_opening(msg); });
		},
		//flash keyboard icon for feedback
		flash_keyboard_icon: function() {
			$('#ccutils_keyboard_icon')
				.animate({opacity: 1}, 100)
				.animate({opacity: 0.3}, 100);
		},
		//announce opening for the current active window
		announce_opening: function() {
			var opening = CC.get_opening(true);
			if(!opening) { return; }

			var announce_text;console.log('ran');

			if(opening.moves.name == opening.fen.name) {
				announce_text = 'Opening: (' + opening.moves.eco + ') ' + opening.moves.name;
			} else {
				announce_text = 'Position: (' + opening.fen.eco + ') ' + opening.fen.name + ', transposed from Opening: (' + opening.moves.eco + ') ' + opening.moves.name;
			}

			$('.chatInputGameWrapper input[id^=chatInput_]:visible').first().val(announce_text);
			$('.chatInputGameWrapper button[id^=chatInputButton_]').click();
			CC.flash_keyboard_icon();
			CC.last_chat = Math.round(new Date().getTime() / 1000) + 5;
		}
	});

	//timer to classify openings
	CC.opening_checker = setInterval(CC.get_opening, 5000);
	CC.analyzed_games_cache = {};
	setInterval(function() {
		CC.analyzed_games_cache = {};
	}, 300000); //remove cache every 5 minutes

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
  "shift+c shift+a" Announce Opening')
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

			//announce opening
			Mousetrap.bind('shift+c shift+a', function() {
				CC.announce_opening();
			});
		}
	}, 300);
})();