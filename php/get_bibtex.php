<?php

include 'vendor/autoload.php';

if (defined('STDIN')) {
	$doi = $argv[1];
} else {
	$doi = $_GET["doi"];
}

libxml_use_internal_errors(true); //don't want silly warnings polluting our output

$response = Requests::get("http://api.crossref.org/works/$doi/transform/application/x-bibtex");
echo $response->body;

?>
