<?php

if (defined('STDIN')) {
    $search = $argv[1];
} else { 
    $search = $_GET["uthor"];
}

function performQuery($author) {

    $url = "https://ieeexplore.ieee.org/gateway/ipsSearch.jsp?au=$author";
    $xml_result = file_get_contents($url);
    $xml = simplexml_load_string($xml_result, 'SimpleXMLElement', LIBXML_NOCDATA);
	$json = json_encode($xml);
    return $json;
}


echo (performQuery($search));

// not sure if we should parse in PHP but it's easy with: new SimpleXMLElement("..");

?>
