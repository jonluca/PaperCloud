<?php

$type = "author"; // default

if (defined('STDIN')) {
	global $type;
	$search = $argv[1];
	if (isset($argv[2])) {
		$type = $argv[2];
	}
} else {
	$search = $_GET["search"];
	if (isset($_GET["type"])) {
		$type = $_GET["type"]; // this can be "author" or "keyword"
	}
}

function performQuery($search, $type) {
	$cmd = ($type == "keyword") ? "idxterms" : "au";
	$url = "https://ieeexplore.ieee.org/gateway/ipsSearch.jsp?$cmd=$search";
	$xml_result = file_get_contents($url);
	$xml = simplexml_load_string($xml_result, 'SimpleXMLElement', LIBXML_NOCDATA);
	$json = json_encode($xml);
	return $json;
}

echo (performQuery($search, $type));

?>
