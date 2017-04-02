<?php
include('vendor/rmccue/requests/library/Requests.php');
Requests::register_autoloader();


if (defined('STDIN')) {
    $search = $argv[1];
} else {
    $search = $_GET["author"];
}



function performQuery($author)
{
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
    $headers = array(
        'DNT' => '1',
        'Accept-Encoding' => 'gzip, deflate, sdch',
        'Accept-Language' => 'en-US,en;q=0.8,it;q=0.6',
        'Upgrade-Insecure-Requests' => '1',
        'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
        'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer' => 'http://dl.acm.org.libproxy1.usc.edu/results.cfm?query=richard+feynman&Go.x=0&Go.y=0',
        'Connection' => 'keep-alive',
        'Cookie' => '_vwo_uuid_v2=FED9B97519596F037D3BAF9E00E0A35A|faa55d1305647a8d9101f8b793fc940d; desktopCookie=uschomepage; _ga=GA1.2.1626331614.1487707542; __unam=79ac26c-15b3098e021-28bf8866-1; ezproxy=http://libproxy1.usc.edu,vuJPgSpsPbWgcHl; CFID=919247958; CFTOKEN=12248472; IP_CLIENT=9941550; SITE_CLIENT=5598578; mp_d2557637bad0bf1520733bad76dd4c3d_mixpanel=%7B%22distinct_id%22%3A%20%2215b01486cb6253-00ba23a9b4b492-1d3c6853-232800-15b01486cb77a3%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%7D; mp_mixpanel__c=7'
	);

	$success = false;
	while(!$success){
		try{
			$query    = "http://dl.acm.org.libproxy1.usc.edu/exportformats_search.cfm?query=$author&filtered=&within=owners%2Eowner%3DHOSTED&dte=&bfr=&srt=%5Fscore&expformat=csv";
		    $response = Requests::get($query, $headers);
		    $success = true;
		}catch(Requests_Exception $e){
			$success = false;
		}
	}
    
    //we need to get the DOI somehow from this csv
    $csv          = str_getcsv($response->body);
    $lines        = explode(PHP_EOL, $response->body);
    $csv_to_array = array();
    foreach ($lines as $line) {
        $csv_to_array[] = str_getcsv($line);
    }

    $titles = array();
    foreach ($csv_to_array as $line) {
    	if(array_key_exists(6, $line)){
	        $titles[] = $line[6];
    	}
    }
    return json_encode($titles);

    // foreach($ids as $id){
    // 	if(empty($id)){
    // 		continue;
    // 	}
    // 	$pdf_url = "http://dl.acm.org.libproxy1.usc.edu/ft_gateway.cfm?id=$id";
    // 	$response = Requests::get($pdf_url, $headers);
    // 	print_r($response);
    // }

}

echo performQuery($search);

?>
<?php

