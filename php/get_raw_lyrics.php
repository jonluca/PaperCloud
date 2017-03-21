<?php

if (defined('STDIN')) {
	$artist = $argv[1];
	$song = $argv[2];
} else{
	$artist = $_GET["artist"];
	$song = $_GET["song"];
}

$curl_handle = curl_init();
curl_setopt($curl_handle, CURLOPT_URL, "http://www.azlyrics.com/lyrics/$artist/$song.html");
curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 20);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.102011-10-16 20:23:10");
$data = curl_exec($curl_handle);
curl_close($curl_handle);

$starting_stuff = "<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->";
$starting_pos = strpos($data, $starting_stuff);
if ($starting_pos === false) {
 echo "";
} else {
 $lyrics = substr($data, $starting_pos + strlen($starting_stuff) + 1);
 $ending_pos = strpos($lyrics, "</div>");
 $lyrics = substr($lyrics, 0, $ending_pos);
 echo $lyrics;
}

?>