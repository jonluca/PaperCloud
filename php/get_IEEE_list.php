<?php

function performQuery($author) {
    $url = "https://ieeexplore.ieee.org/gateway/ipsSearch.jsp?au=$author";
    return file_get_contents($url);
}

// not sure if we should parse in PHP but it's easy with: new SimpleXMLElement("..");

?>
