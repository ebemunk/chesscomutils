<?php
//converts scid.eco from SCID openings database to a JS object
//open file
$lol = file_get_contents('scid.eco', 'r');
//remove comments from .eco
$lol = preg_replace('/#.*\n/', '', $lol);
//remove all newlines except * (which marks end of opening def)
$lol = preg_replace('/(?<!\*)\n/', '', $lol);
//remove the * at the end of line
$lol = str_replace(' *', '', $lol);
//convert multiple spaces to single space
$lol = preg_replace('/  +/', ' ', $lol);
//remove spaces before and after " (" char will be separator)
$lol = str_replace(' "', '"', $lol);
$lol = str_replace('" ', '"', $lol);

//get as separate lines each representing one opening
$lines = explode("\n", $lol);

//start constructing the js file
$final = '$.extend(CC, {openings: {' . PHP_EOL;

$count = 0;

foreach($lines as $line) {
	$obj = explode('"', $line);
	var_dump($obj); echo "<br><br>";
	$final .= "\t" . '"' . $obj[2] . '": {' . PHP_EOL;
	$final .= "\t\t" . '"eco": "' . $obj[0] . '",' . PHP_EOL;
	$final .= "\t\t" . '"name": "' . $obj[1] . '",' . PHP_EOL;
	$final .= "\t\t" . '"moves": "' . $obj[2] . '"' . PHP_EOL;
	$final .= "\t" . '},' . PHP_EOL;
	$count++;
}

$final .= '}});';

//massive regex - remove all PGN notation from opening name
$final = preg_replace('/[,:](( )?(\d+)(\.)(\.\.)*((\w+)(\d)((\+)?)|O-O|O-O-O)( ((\w+)(\d)((\+)?)|O-O|O-O-O))?)+(?=",)/', '', $final);

file_put_contents('openings.js', $final);

echo $count . ' openings parsed.';