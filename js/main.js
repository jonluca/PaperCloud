$(document).ready(function() {

    function generateWordList() {
        return true;
    }
    /*
    * Wordcloud
    */
    var getWordFrequency = function(text) {
        var wordFreqOptions = {
            workerUrl: './js/wordCounter/wordfreq.worker.js',
            language: 'english',
            minimalCount: 250,
            stopWordSets: ['cjk', 'english1', 'english2']
        };

        //callbacks generates a wordcloud
        var wordfreq = WordFreq(wordFreqOptions).process(text, function(list) {
            //Word cloud options
            var options = {
                list: list,
                gridSize: 18, //spacing between words
                weightFactor: 6,
                color: 'random-dark',
                hover: window.drawBox,

                // on click callback
                click: generateWordList,
                backgroundColor: '#fff',
                minSize: 1,
                minRotation: 0,
                maxRotation: 0,
                shape: function(phi) {
                    phi = ((phi + 45) % 90 - 45) / 180 * Math.PI;
                    return 1 / Math.cos(phi);
                }
            };
            listOfWords = list;
            //generate a wordcloud with the documents
            WordCloud(document.getElementById('wordcloud'), options);
            if (window.location.href.indexOf("getword") > -1) {
                generateWordList(["me"]);
            }
        });
    };

    /*
    * Search
    */

    //called when search button searches
    $('#searchButton').on('click', function() {
        var search_param = $("#search").val();
        $.when(IEEESearch(search_param), ACMSearch(search_param)).done(function(a1, a2) {
            if (a1[1] == "success" && a2[1] == "success") {
                var results = JSON.parse(a1[0]);
                var papers = results.document;
                var titles = [];
                var all_titles = "";
                for (key in papers) {
                    titles.push(papers[key].title);
                    all_titles += papers[key].title;
                    all_titles += " ";
                }
                console.log(a2[0]);
                var results = JSON.parse(a2[0]);
                var titles = [];
                for (key in results) {
                    titles.push(papers[key]);
                    all_titles += papers[key];
                    all_titles += " ";
                }

                getWordFrequency(all_titles);
            }
        });

        //display word cloud
        $('#wordcloudPage').css('display', 'block');
    });

    function IEEESearch(search_param) {
        var url = "php/get_IEEE_list.php";

        return $.ajax({
            method: 'GET',
            url: url,
            type: 'json',
            data: {
                search: search_param
            }
        });
    }

    function ACMSearch(search_param) {
        var url = "php/get_ACM_list.php";

        return $.ajax({
            method: 'GET',
            url: url,
            type: 'json',
            data: {
                search: search_param
            }
        });
    }

});
