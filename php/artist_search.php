<?php

//Required for spotify wrapper
require 'vendor/autoload.php';


if (defined('STDIN')) {
    $artist = $argv[1];
} else { 
    $artist = $_GET["artist"];
}

$session = new SpotifyWebAPI\Session('c836caf275724301a9a9d5c0bd7de1ac', 'ce14fb6c8b7048faacdce4be530409a3', 'http://localhost');
$api = new SpotifyWebAPI\SpotifyWebAPI();

// Request a access token with optional scopes
$scopes = array(
    'playlist-read-private',
    'user-read-private'
);

//get credentials
$session->requestCredentialsToken($scopes);
$accessToken = $session->getAccessToken(); // We're good to go!

// Set the code on the API wrapper
$api->setAccessToken($accessToken);


//Utilize api to search
$artistsObject = $api->search($artist, 'artist');
$artists = $artistsObject->artists;

//return json array of artists
echo json_encode($artists);

?>
