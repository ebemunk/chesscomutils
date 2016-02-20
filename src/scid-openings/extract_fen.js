// extract FEN positions from the openings to construct openings_fen.js
function extract_fen() {
	var obj = {};
	var openings_size = 0, key;
	for (key in CC.openings) {
		if (CC.openings.hasOwnProperty(key)) openings_size++;
	}
	console.log('starting, ' + openings_size + ' openings to process.');

	var count = 0;
	for(key in CC.openings) {
		count++;
		// if(count < 8000) continue;
		var val = CC.openings[key];
		console.log('0');

		var moves = val.moves.replace(/[0-9]*\. ?/g, '').split(' ');
		op = new Chess();
		for(v in moves) {
			if(!op.move(moves[v])) {
				console.log('wrong move at: ' + moves[v] + '!', moves, val.moves);
				return;
			}
		}
		val.fen = op.fen();
		obj[val.fen] = key;
		index++;
	}
	console.log('writing to doc');
	document.write(JSON.stringify(obj));
}