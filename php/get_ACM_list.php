<?php

function performQuery($author) {

    $url = "https://ieeexplore.ieee.org/gateway/ipsSearch.jsp?au=$author";
    $xml = simplexml_load_string(file_get_contents($url), "SimpleXMLElement", LIBXML_NOCDATA);
	$json = json_encode($xml);
	$array = json_decode($json,TRUE);
    return $array;
}

echo performQuery($_GET["author"]);

// not sure if we should parse in PHP but it's easy with: new SimpleXMLElement("..");

?>
