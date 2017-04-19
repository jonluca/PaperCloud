<?php

include 'vendor/autoload.php';
include 'parse_pdf.php';

if (defined('STDIN')) {
	$arnumber = $argv[1];
} else {
	$arnumber = $_GET["arnumber"];
}

libxml_use_internal_errors(true); //don't want silly warnings polluting our output

$headers = array(
	'Pragma' => 'no-cache',
	'DNT' => '1',
	'Accept-Encoding' => 'gzip, deflate, sdch',
	'Accept-Language' => 'en-US,en;q=0.8,el;q=0.6,ro;q=0.4',
	'Upgrade-Insecure-Requests' => '1',
	'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
	'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'Cache-Control' => 'no-cache',
	'Referer' => 'http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=1159142&tag=1',
	'Connection' => 'keep-alive',
	'Cookie' => 'ERIGHTS=pNiIrEO2V9Az1PKhYx2BssyaYnzMN39Sdm*lWx2Bx2Bx2B0LYRjWVOmhHFAMbUwx3Dx3D-18x2d9x2FV7nvNvop3soix2BefrHXeAx3Dx3Dx2BpQynceGfzL7UTgZx2FLEJXQx3Dx3D-Nh58IAtjU5V4tCdOBZsedAx3Dx3D-zuhpjyS1HTx2F4tcGXU8dpZwx3Dx3D; JSESSIONID=lypkYnkY1CqJM6c9zs3D3bWLLD77R6pf7Wqm3snXnzJvLTt0Nw7f!-889963758; seqId=6031; xploreCookies=eyJjb250YWN0RW1haWwzIjoiTkEiLCJpc0RlbGVnYXRlZEFkbWluIjoiZmFsc2UiLCJjb250YWN0UGhvbmUiOiIyMTMgNzQwIDMzODgiLCJpc0NvbnRhY3RXZWJBZGRyRW5hYmxlZCI6ImZhbHNlIiwic3RhbmRhcmRzTGljZW5zZUlkIjoiMCIsIm9wZW5VcmxJbWdMb2MiOiJodHRwOi8vd3d3LnVzYy5lZHUvbGlicmFyaWVzL2ltZy9icmFuZGluZy91c2NfZmluZGl0X3JlZDcweDUwLmdpZiIsImNvbnRhY3RFbWFpbDIiOiJOQSIsImlzRGVza3RvcFVzZXIiOiJmYWxzZSIsImlzQ29udGFjdE5hbWVFbmFibGVkIjoiZmFsc2UiLCJpbnN0VHlwZSI6IkEiLCJpc0NvbnRhY3RGYXhFbmFibGVkIjoiZmFsc2UiLCJpc1Byb3Zpc2lvbmVkIjoiZmFsc2UiLCJvcGVuVXJsIjoiaHR0cDovL1pCNUxIN0VEN0Euc2VhcmNoLnNlcmlhbHNzb2x1dGlvbnMuY29tIiwiY3VzdG9tZXJTdXJ2ZXkiOiJOQSIsInVzZXJJZHMiOiI2MDMxIiwiaW5zdEltYWdlIjoiNjAzMV9MaWJyYXJpZXMtQ2FyZE9uR29sZDE0NXg1MC5naWYiLCJpc0luc3QiOiJ0cnVlIiwib3BlblVybFR4dCI6Ik5BIiwiaXNSb2FtaW5nRW5hYmxlZCI6InRydWUiLCJjb250YWN0V2ViQWRkciI6Ik5BIiwiY29udGFjdEZheCI6Ik5BIiwic21hbGxCdXNpbmVzc0xpY2Vuc2VJZCI6IjAiLCJpc0NoYXJnZWJhY2tVc2VyIjoiZmFsc2UiLCJwcm9kdWN0cyI6IklCTXxFQk9PS1M6MjAxMjoyMDE1fE1JVFA6MjAxMzoyMDE2fERyYWZ0fElTT0w1NXxJU09MNTJ8SVNPTDUzfElTT0w1NHxJU09MNTZ8SVNPTDU4fElTT0w1N3xJRUx8ZUxlYXJuaW5nUGFja2FnZSNFNEV8VkRFfEFMQ0FURUwtTFVDRU5UfCIsImNvbnRhY3ROYW1lIjoiTEFOQSBMSVRWQU4iLCJpc0NvbnRhY3RQaG9uZUVuYWJsZWQiOiJmYWxzZSIsImlzTWVtYmVyIjoiZmFsc2UiLCJpc0NvbnRhY3RFbWFpbEVuYWJsZWQiOiJmYWxzZSIsIm9sZFNlc3Npb25LZXkiOiJwTmlJckVPMlY5QXoxUEtoWXgyQnNzeWFZbnpNTjM5U2RtKmxXeDJCeDJCeDJCMExZUmpXVk9taEhGQU1iVXd4M0R4M0QtMTh4MmQ5eDJGVjdudk52b3Azc29peDJCZWZySFhlQXgzRHgzRHgyQnBReW5jZUdmekw3VVRnWngyRkxFSlhReDNEeDNELU5oNThJQXRqVTVWNHRDZE9CWnNlZEF4M0R4M0QtenVocGp5UzFIVHgyRjR0Y0dYVThkcFp3eDNEeDNEIiwiY29udGFjdEVtYWlsIjoibGl0dmFuQHVzYy5lZHUiLCJpc0NpdGVkQnlFbmFibGVkIjoidHJ1ZSIsImVudGVycHJpc2VMaWNlbnNlSWQiOiIwIiwiaXNJcCI6InRydWUiLCJpbnN0TmFtZSI6IlVuaXZlcnNpdHkgb2YgU291dGhlcm4gQ2FsaWZvcm5pYSJ9; ipList=68.181.207.140; TS01f64340=012f35062336c670c5c21515289cb67f39fdd37df13c2bc767faa2ce0471e0675e4a4335b24489388f9dec9ff5776c1fdde25d3344b9d06d1c7dfc2871903b83d5aca8f5583f41ef7cfee9de6f9f14c2180fe33a4969b61615a86cd296cf2f847ac6b16ce6; unicaID=AZ8cEJrPKB1-aQnsdsM; utag_main=v_id:015b652d6fe3001dd6c6919c985c0407900410710093c$_sn:1$_ss:1$_st:1492052928293$ses_id:1492051128293%3Bexp-session$_pn:1%3Bexp-session; cmTPSet=Y; CoreID6=14481967487414920511284&ci=52820000; 52820000_clogin=v=1&l=1492051128&e=1492052928484; WLSESSION=891445900.20480.0000; TS011813a0=012f350623bcdd7f5e6c71351389c30d355a33c361bf7904e76a2de57bfe93ad98e1a427b56758735de05b11504f1ff744072931e4fb82927af0d5187697ecddb823ee1c5c; visitstart=19:39',
);

// Define a timeout of 2.5 seconds
$options = array(
	'timeout' => 30,
	'connect_timeout' => 30,
);

$response = Requests::get("http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=$arnumber", $headers, $options);
$dom = new DOMDocument();
$dom->loadHTML($response->body);
$frames = $dom->getElementsByTagName('frame');
$url = $frames->item(1)->getAttribute('src');

$response = Requests::get($url, $headers);
$file = "pdfs/IEEE-$arnumber.pdf";
file_put_contents($file, $response->body); // write the PDF to file
if (array_key_exists("word", $_GET)) {
	$word = $_GET["word"];
	$doc = add_javascript(load_document($file), $word); // if we specify word, put annotations in file
	file_put_contents("pdfs/IEEE-$arnumber-$word.pdf", $doc->Output('', 'S'));
}
echo get_raw_text($file);

?>
