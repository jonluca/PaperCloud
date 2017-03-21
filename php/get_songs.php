<?php
//spotify wrapper requirements
require 'vendor/autoload.php';


//get artistid as get parameter
//
if (defined('STDIN')) {
    $artistid = $argv[1];
} else { 
    $artistid = $_GET["artistid"];
}

//our private key/client id ¯\_(ツ)_/¯
$session = new SpotifyWebAPI\Session('c836caf275724301a9a9d5c0bd7de1ac', 'ce14fb6c8b7048faacdce4be530409a3', 'http://localhost');
$api = new SpotifyWebAPI\SpotifyWebAPI();

// Request a access token with optional scopes
$scopes = array(
    'playlist-read-private',
    'user-read-private'
);

$session->requestCredentialsToken($scopes);
$accessToken = $session->getAccessToken(); // We're good to go!

// Set the code on the API wrapper
$api->setAccessToken($accessToken);


//requires country for which you wan the top tracks
$topTracks = $api->getArtistTopTracks($artistid, ['country' => 'us']);

//Tracks object without the outermost wrapper
$tracksObject = $topTracks->tracks;

echo json_encode($tracksObject);



?>
