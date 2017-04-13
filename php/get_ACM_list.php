<?php
ini_set('memory_limit', '1024M');

include 'vendor/rmccue/requests/library/Requests.php';
require "vendor/rolling-curl/RollingCurl.php";
include 'vendor/autoload.php';
include 'parse_pdf.php';

Requests::register_autoloader();

$num = 0;

if (defined('STDIN')) {
	$search = $argv[1];
	$num = $argv[2];
} else {
	$search = $_GET["search"];
 $num = $_GET["num_papers"];
}

$results = array();

$headers = array(
	'DNT' => '1',
	'Accept-Encoding' => 'gzip, deflate, sdch',
	'Accept-Language' => 'en-US,en;q=0.8,it;q=0.6',
	'Upgrade-Insecure-Requests' => '1',
	'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
	'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Connection' => 'keep-alive',
	'Cookie' => '_vwo_uuid_v2=FED9B97519596F037D3BAF9E00E0A35A|faa55d1305647a8d9101f8b793fc940d; desktopCookie=uschomepage; __unam=79ac26c-15b3098e021-28bf8866-1; _ga=GA1.2.1626331614.1487707542; ezproxy=http://libproxy1.usc.edu,2yCbjI2OuWSy6Kh; CFID=750264237; CFTOKEN=97162500; IP_CLIENT=9941550; SITE_CLIENT=5598578; mp_mixpanel__c=3; mp_d2557637bad0bf1520733bad76dd4c3d_mixpanel=%7B%22distinct_id%22%3A%20%2215b01486cb6253-00ba23a9b4b492-1d3c6853-232800-15b01486cb77a3%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%7D',
);

function downloadPDFFromDOI($doi) {

	//Headers that we probably don't even need
	global $headers;

	if ($doidot = strstr($doi, '/')) {
		$doidot = str_replace("/", "", $doidot);
		try {
			$query = "http://dl.acm.org/citation.cfm?doid=$doidot";
			$response = Requests::get($query);
		} catch (Requests_Exception $e) {
			print($e->getMessage());
		}
		$document = new DOMDocument();

		libxml_use_internal_errors(TRUE); //disable libxml errors

		if (!empty($response->body)) {
			//if any html is actually returned

			$document->loadHTML($response->body);
			libxml_clear_errors(); //remove errors

			$fulltext_xpath = new DOMXPath($document);

			$full_text_link = $fulltext_xpath->query("//a[contains(@name,'FullTextPDF')]/@href");
			if ($full_text_link->length > 0) {
				return "http://dl.acm.org/" . $full_text_link[0]->textContent;
			}
		}
	} else {
		return null;
	}

}

function performQuery($author, $num) {
	/*You MUST get new Headers every time you want to test this code. The steps to do it:
		    1. Right click on your page and click Inspect Element then go to the Network tab
		    2. Go to http://dl.acm.org.libproxy1.usc.edu/results.cfm?query=richard+feynman&Go.x=0&Go.y=0
		    3. Sign in to your myUSC if it asks you too, make sure to not close the Network tab in the Developer Tools
		    4. Once the page has loaded, scroll to the top of the Network results. It should look like https://i.imgur.com/amCDjAV.png
		    5. Right click on the one that says "results.cfm?query=richard+feynman&Go.x=0&Go.y=0"
		    6. Click Copy -> Copy as CURL
		    7. Go to https://curl.trillworks.com/ and paste the curl request into the left box
		    8. Select PHP from the drop down of languages
		    9. Copy only the Headers variable, replace it below
		    10. Done!
	*/

	$actualnum = intval($num);

	//Headers that we probably don't even need
	global $headers;

	$success = false;
	//Continue trying to get the URL, as it'll fail sometimes
	while (!$success) {
		try {
			$query = "http://dl.acm.org/exportformats_search.cfm?query=$author&filtered=&within=owners%2Eowner%3DHOSTED&dte=&bfr=&srt=%5Fscore&expformat=csv";
			$response = Requests::get($query, $headers);
			$success = true;
		} catch (Requests_Exception $e) {
			$success = false;
		}
	}
	//Parse results as CSV
	$csv = str_getcsv($response->body);
	$lines = explode(PHP_EOL, $response->body);
	$csv_to_array = array();
	foreach ($lines as $line) {
		$csv_to_array[] = str_getcsv($line);
	}

	$counter = 0;
	//multithreaded curl
	$rc = new RollingCurl("request_callback");
//concurrent connections
	$rc->window_size = $actualnum;

	$rc->options = array(CURLOPT_RETURNTRANSFER => true, CURLOPT_FOLLOWLOCATION => true, CURLOPT_HTTPHEADER => $headers);
	//This will be the results array
	foreach ($csv_to_array as $line) {

		if (array_key_exists(1, $line) && array_key_exists(11, $line) && array_key_exists(6, $line) && $line[1] != "" && $line[1] != "id") {
			$counter += 1;
			if ($counter >= $actualnum) {
				break;
			}
			$id = $line[1];
			$doi = $line[11];
			$download_url = downloadPDFFromDOI($doi);
			global $results;
			$results[$id]["title"] = $line[6];
			if (is_null($download_url)) {
				continue;
			}
			$request = new RollingCurlRequest($download_url);
			$rc->add($request);
		}
	}
	$rc->execute();

}

function request_callback($data, $info) {
	$id = strstr($info["url"], 'id=');
	$id = strstr($id, '&', true);
	$id = str_replace("id=", "", $id);

	$path = 'pdfs/' . $id . '.pdf';
	$result = file_put_contents($path, $data);
	try {
		global $results;
		$parser = new \Smalot\PdfParser\Parser();
		$pdf = $parser->parseFile($path);

		$text = $pdf->getText();
		$results[$id]["paper"] = $text;
		$results[$id]["url"] = $path;
	} catch (Exception $e) {
		print($e->getMessage());
	}
}
performQuery($search, $num);

echo json_encode($results);

?>
