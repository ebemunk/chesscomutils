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
		url: 'http://localhost/chesscomutils/chess.min.js',
		id: 'chessjs'
	},
	{
		url: 'http://localhost/chesscomutils/openings.js',
		id: 'openings'
	},
	{
		url: 'http://localhost/chesscomutils/listen.js',
		id: 'inject'
	}
]);