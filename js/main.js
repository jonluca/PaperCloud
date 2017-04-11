$(document).ready(function() {
    $('#search').keyup(function() {
        if ($(this).val().length != 0) {
            $('#searchButton').attr('disabled', false);
        } else {
            $('#searchButton').attr('disabled', true);
        }
    });

    //This is the function that gets called when you click on an invidual word in the word cloud. Not sure how we're doing it now, though, so it only returns true;
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
    var url_download_template1 = "http://dl.acm.org.libproxy1.usc.edu/ft_gateway.cfm?id=";
    var url_download_template2 = "&ftid=1715440&dwn=1&#URLTOKEN#";
    //called when search button searches
    $('#searchButton').on('click', function() {
        //Get contents of serach bar
        var search_param = $("#search").val();

        //Two promises for two searches. Might want to refactor in future
        $.when(IEEESearch(search_param), ACMSearch(search_param)).done(function(a1, a2) {

            //If both searches succeeded
            if (a1[1] == "success" && a2[1] == "success") {
                var results = JSON.parse(a1[0]);
                var papers = results.document;

                //titles is array of titles
                var titles = [];
                //all_titles is space delimited string of every word in every title
                var all_titles = "";
                //IEEE returns more information than ACM, so it must be in subkey document, and then pull title for each
                for (key in papers) {
                    titles.push(papers[key].title);
                    all_titles += papers[key].title;
                    all_titles += " ";
                }

                console.log(a1)
                console.log(a2)
                var results2 = JSON.parse(a2[0]);
                var titles = [];
                //ACM search returns array of titles, very little parsing needed
                for (key in results2) {
                    titles.push(results2[key]);
                    all_titles += results2[key];
                    all_titles += " ";
                }
                console.log(results2);
                var paperList = $("#paperList");
                paperList.css('display', 'block');
                for (key in titles) {
                    var paper_name = titles[key];
                    paperList.append("<li>" + paper_name + "</li>");
                }

                //Create actual word cloud
                getWordFrequency(all_titles);
            }
        //TODO add else statement showing an error
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

    //ACM search which takes in the actual search query by user
    //TODO differentiate between author and keyword, should be done in PHP based on what GET param is passed
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
