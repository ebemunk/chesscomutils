<?php
//very simple php script to facilitate file output

//allow requests from live.chess.com where our script is injected
header("Access-Control-Allow-Origin: http://live.chess.com");

$folder = "/www/";
$location = (isset($_POST['filename']) ? $_POST['filename'] : 'chessdb.pgn');
//write pgn to file. create file if it doesnt exist and append to it if it does
file_put_contents($folder.$location, $_POST['pgn'] . PHP_EOL . PHP_EOL, FILE_APPEND);