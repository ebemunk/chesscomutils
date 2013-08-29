(function() {
	function classify_opening(notation) {
		var opening;
		var movetext = '';
		notation.find('.notationVertical').each(function(i, v) {
			movetext += $(v).find('.num').text();
			$(v).find('.gotomove').each(function(ii, n) {
				movetext += $(n).text() + ' ';
				var cur_opening = CC.openings[movetext.trim()];
				if(!cur_opening && opening) {
					return false;
				}
				if(cur_opening) {
					opening = cur_opening;
				}
			});
		});
		return opening;
		//console.log(movetext.trim()); 
		//console.log(CC.openings[movetext.trim()]);
	}


	function test_os() {
		var notation = $('div[id^="notation_"]:visible');
		console.log('notation', notation);

		var id = notation.attr('id').replace('notation_', '');
		console.log('id', id);

		var opening = undefined;
		var observer = new MutationObserver(function(mutations) {
		    /*mutations.forEach(function(mutation) {
		    	console.log('der');
		        for(var i = 0; i < mutation.addedNodes.length; i++) {
		            insertedNodes.push(mutation.addedNodes[i]);
		            console.log($(mutation.addedNodes[i]));
		        }
		    })*/
			//console.log(id, 'mut', opening);
			opening = classify_opening(notation);
			console.log(opening);
			//console.log(notation);
			//console.log(times);
			//console.log(id, 'mt fired', times);
			/*if(times > 4) {
				console.log(id, 'mt off', times);
				observer.disconnect();
			}*/
			observer.disconnect();
		});
		observer.observe(notation[0], {
		    childList: true,
		    subtree: true
		});
	}
	
	CC.myval = 1;
	if($('#ccutils_opening').length) {
		$('#ccutils_opening').off().remove();
	}
	CC.div_opening = $('<div/>')
	.text('Opening: ')
	.css({
		'position': 'fixed',
		'top': 38,
		'left': 5,
		'background-color': '#6a943f',
		'z-index': 9,
		'color': 'White'
	})
	.attr('id', 'ccutils_opening')
	.appendTo($(body))
	.click(test_os);
/*
	var typedArray = 'hello milord';
var blob = new Blob([typedArray], {type: "application/octet-binary"}); // pass a useful mime type here
var url = URL.createObjectURL(blob);
console.log(url);

$('<a/>').css({
		'position': 'fixed',
		'top': 38,
		'left': 5,
		'background-color': '#6a943f',
		'z-index': 9,
		'color': 'White'
	}).attr('href', url).attr('download', 'amci.pgn').text('ELAO').appendTo($(body));
*/
})();