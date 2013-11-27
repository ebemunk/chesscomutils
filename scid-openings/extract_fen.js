// extract FEN positions from the openings to construct openings_fen.js
function extract_fen() {
	var obj = {};
	$.each(CC.openings, function(key, val) {
		var moves = val.moves.replace(/[0-9]\./g, '').split(' ');
		op = new Chess();
		$.each(moves, function(i, v) {
			op.move(v);
		});
		val.fen = op.fen(); //.replace(/ (w|b) (-|[0-9a-zA-z]*) (-|[0-9a-zA-z]*) [0-9]* [0-9]*/, '');
		// obj[val.fen] = {
		// 	eco: val.eco,
		// 	name: val.name,
		// 	moves: val.moves
		// };
		obj[val.fen] = key;
	});
	document.write(JSON.stringify(obj));
}