//http://www.geocities.com/siliconvalley/lab/7378/eco.htm
function opening(eco, name, moves) {
	this.eco = eco;
	this.name = name;
	this.moves = moves;
}
var opening_dic = {};
$('tr').each(function(i, v) {
	var cols = $(v).find('td');
	var nl = new RegExp('\r?\n|\r', 'g');
	var ds = new RegExp(' +', 'g');
	
	var eco = $(cols[0]).text().replace(nl, '');
	var name = $(cols[1]).text().replace(nl, '');
	var moves = $(cols[2]).text().replace(nl, '').replace(ds, ' ').trim();

	opening_dic[moves] = new opening(eco, name, moves);
});

console.log(JSON.stringify(opening_dic));