<?php
/////////////////////////////////////////////////////////////////////
//compress bookmarklet.js to one line so browsers doesn't complain //
/////////////////////////////////////////////////////////////////////

$bookmarklet = file_get_contents('bookmarklet.js');

$compressed = 'javascript:';
//replace all whitespace
$compressed .= preg_replace('/\s+/', '', $bookmarklet);

file_put_contents('../bookmarklet.txt', $compressed);