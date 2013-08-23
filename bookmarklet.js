(function(files){
	$.each(files, function(index, file) {
		$('#'+file.id).remove(); //keep dom clean on refresh
		$('<script/>')
		.attr('src', file.url)
		.attr('id', file.id)
		.appendTo(body);
	});
})
([
	{
		url: 'http://localhost/ccpgncapture/chess.min.js',
		id: 'chessjs'
	},
	{
		url: 'http://localhost/ccpgncapture/openings.js',
		id: 'openings'
	},
	{
		url: 'http://localhost/ccpgncapture/listen.js',
		id: 'inject'
	}
]);