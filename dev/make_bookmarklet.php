<?php
//compress bookmarklet.js to one line so browsers don't complain

$bookmarklet = file_get_contents('bookmarklet.js');

$compressed = 'javascript:';

//replace all whitespace except after var
$compressed .= preg_replace('/(?<!var)\s+/', '', $bookmarklet);

file_put_contents('../bookmarklet.txt', $compressed);