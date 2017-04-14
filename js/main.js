var currFileList = [];
var previousSearches = [];

var line;

$(document).ready(function() {

    //create a progress bar
    line = new ProgressBar.Line('#progressbar');


    $('#search').keyup(function() {
        if ($(this).val().length != 0) {
            $('#searchButton').attr('disabled', false);
        } else {
            $('#searchButton').attr('disabled', true);
        }
    });

    $('#wordcloud').on('wordcloudstop', function() {
        line.stop();
        line.animate(1, {
            duration: 175
        }, function() {
            console.log('Animation has finished');
        });
        setTimeout(function() {
            line.set(0);
        }, 900);
    });

    //This is the function that gets called when you click on an invidual word in the word cloud. Not sure how we're doing it now, though, so it only returns true;
    function generateWordList() {
        return true;
    }
    /*
    * Wordcloud
    */


    function generateWordList(item, dimension, event) {
        var papers = getPaperListByName(item[0]);
        console.log('test');
        createPaperList(papers);
    }

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


    var initiateProgressBar = function() {

        var duration = 400000;

        line.animate(1, {
            // Duration for animation in milliseconds
            // Default: 800
            duration: duration,

            // Easing for animation. See #easing section.
            // Default: 'linear'
            easing: function(pos) {
                var val = Math.log(pos * duration + 1) / 14;
                return val;
            },

            // See #custom-animations section
            // Built-in shape passes reference to itself and a custom attachment
            // object to step function
            from: {
                color: '#ededed'
            },
            to: {
                color: '#33C3F0'
            },
            step: function(state, circle, attachment) {
                circle.path.setAttribute('stroke', state.color);
            }
        }, function() {
            console.log('Animation has finished');
        });
    };

    /*
    * Search
    */
    //called when search button searches
    $('#searchButton').on('click', function() {
        search();
    });

});


function IEEEGetText(arnumber) { // arnumber is taken from the search JSON
    var url = "php/get_IEEE_text.php";
    return $.ajax({
        method: "GET",
        url: url,
        dataType: 'text',
        data: {
            arnumber: arnumber
        }
    });
}

function IEEEGetPdfUrl(arnumber, word) {
    var url = "php/get_IEEE_text.php";
    $.ajax({
        method: "GET",
        url: url,
        dataType: 'text',
        data: {
            arnumber: arnumber,
            word: word
        }
    });
    return "php/pdfs/IEEE-" + arnumber + "-" + word + ".pdf";
}

function IEEESearch(search_param) {
    var url = "php/get_IEEE_list.php";

    return $.ajax({
        method: 'GET',
        url: url,
        dataType: 'text',
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
        dataType: 'text',
        data: {
            search: search_param
        }
    });
}

function getPaperListByName(search_param) {
    var results = [];

    for (var i = 0; i < currFileList.length; i++) {
        if (currFileList[i].includes(search_param)) {
            resultEntry = [];
            resultEntry.push(currFileList[i]);
            results.push(resultEntry);
        }
    }

    return results;
}

function createPaperList(papers) {
    console.log('test');
    $('#paperList').css('display', 'block');
    $('#searchPage').css('display', 'none');
    $('#wordcloudPage').css('display', 'none');

    $('.paperTable').DataTable({
        data: papers,
        columns: [{
            title: 'Title'
        }],
        'bDestroy': true
    });
}


function search(){
    initiateProgressBar();
    //Get contents of serach bar
    var search_param = $("#search").val();

    previousSearches.push(search_param);

    currFileList = [];
    //Two promises for two searches. Might want to refactor in future
    $.when(IEEESearch(search_param), ACMSearch(search_param)).done(function(a1, a2) {

        console.log(a1);
        console.log(a2);
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
                currFileList.push(papers[key].title);
            }


            // var results2 = JSON.parse(a2[0]);
            // var titles = [];
            // //ACM search returns array of titles, very little parsing needed
            // for (key in results2) {
            //     titles.push(results2[key]);
            //     all_titles += results2[key];
            //     all_titles += " ";
            //     currFileList.push(results2[key]);
            // }
            // console.log(results2);
            /*
            var paperList = $("#paperList");
            paperList.css('display', 'block');
            for (key in titles) {
                var paper_name = titles[key];
                paperList.append("<li>" + paper_name + "</li>");
            }
            */

            //Create actual word cloud
            getWordFrequency(all_titles);
        }

    //TODO add else statement showing an error
    });

    //display word cloud
    $('#wordcloudPage').css('display', 'block');
}