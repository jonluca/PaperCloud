<?php

require("vendor/rolling-curl/RollingCurl.php");

if (defined('STDIN')) {
    $artist = $argv[1];
    $songs = unserialize($argv[2]);
} else { 
    $artist = $_GET["artist"];
    $songs = json_decode(base64_decode($_GET["songs"]));
}

$result = array();

//multithreaded curl
$rc = new RollingCurl("request_callback");
//concurrent connections
$rc->window_size = 10;
//only use IPV4
$rc->options = array(CURLOPT_IPRESOLVE=> CURL_IPRESOLVE_V4);

foreach ($songs as $song) {
    //optimized azlyrics out to cut down on dns look up times - a couple 100 ms
    $url = "http://www.azlyrics.com/lyrics/$artist/$song.html";
    $request = new RollingCurlRequest($url);
    $rc->add($request);
}
$rc->execute();


function request_callback($data, $info) {
    //beginning string - kind of ironic
    $starting_stuff = "<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->";
    $starting_pos = strpos($data, $starting_stuff);
    if ($starting_pos === false) {
        //we didn't get a valid response
    } else {
        $lyrics = substr($data, $starting_pos + strlen($starting_stuff) + 1);
        $ending_pos = strpos($lyrics, "</div>");
        $lyrics = str_replace("<br>", "", substr($lyrics, 0, $ending_pos));
        $song = str_replace('"', "", str_replace(".html", "", basename($info['url'])));
        $lyrics = str_replace('"', "", $lyrics);
        global $result;
        $result[$song] = $lyrics;
    }
}

echo json_encode($result);

?>
