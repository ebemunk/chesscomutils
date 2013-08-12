<?php
header("Access-Control-Allow-Origin: http://live.chess.com");

file_put_contents('C:\\Users\\ebemunk\\Desktop\\chessdb.pgn', $_POST['pgn'], FILE_APPEND);