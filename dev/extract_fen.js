	function test() {
		var obj = {};
		$.each(CC.openings, function(key, val) {
			var moves = val.moves.replace(/[0-9]\./g, '').split(' ');
			op = new Chess();
			$.each(moves, function(i, v) {
				op.move(v);
			});
			val.fen = op.fen();
			obj[val.fen] = {
				eco: val.eco,
				name: val.name,
				moves: val.moves
			};
		});
		console.log(JSON.stringify(obj));
	}