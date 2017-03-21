function jsonCallback(json) {
    console.log(json);
}

$('#ajaxTest').click(function () {
    console.log("hey!");
    var baseURL = "http://api.genius.com";
    var headers = {
        'Authorization': 'Bearer kS_kCXr1LpczwH4BSBS4Ck14fcyPrygEmkD6RgidSneI_rNEPgzO13X8dIYKG1jQ',
    };
    var searchURL = baseURL + "/search";
    var songTitle = "Capsized";
    var artistName = "Andrew Bird";
    var data = {'q': songTitle};


    $.ajax({
        url: searchURL,
        dataType: "jsonp",
        headers: headers,
        data: data,
    });
    /*
     $.ajax({
     dataType: "jsonp",
     jsonp: "callback",
     url: searchURL,
     data: data,
     headers: headers,
     success: function(resp) {
     console.log(resp);
     }
     });
     */
});

