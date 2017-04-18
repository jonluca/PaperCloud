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

    $('#search').on('focus', function() {
        $('.dropdown-content').addClass('dropdown-is-active');
    });

    $('#search').on('focusout', function() {
        $('.dropdown-content').removeClass('dropdown-is-active');
    });

    $(".backList").on('click', function() {
        $('#paperList').css('display', 'none');
        $('#searchPage').css('display', 'block');
        $('#wordcloudPage').css('display', 'block');
        $(".backList").css('display', 'none');
    });

    $('#wordcloud').on('wordcloudstop', function() {
        line.stop();
        line.animate(1, {
            duration: 175
        }, function() {});
        setTimeout(function() {
            line.set(0);
        }, 900);
        $('#download').css('display', 'block');
    });

    /*
    * Search
    */
    //called when search button searches
    $('#searchButton').on('click', function() {
        search();
    });
    document.getElementById("download").addEventListener('click', dlCanvas, false);
    if (typeof mocha !== 'undefined') mocha.run()
});

function dlCanvas() {
    var canvas = document.getElementById("wordcloud");
    canvas.toBlob(function(blob) {
        saveAs(blob, "output.png");
    }, "image/png");
}



function itemClick(target) {
    var text = target.textContent;
    $('#search').val(text);
    search();
}

function generateWordList(item, dimension, event) {
    var papers = getPaperListByName(item[0]);
    createPaperList(papers);
}

function getWordFrequency(text) {
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
            weightFactor: 8,
            color: 'random-dark',
            hover: window.drawBox,

            // on click callback
            click: generateWordList,
            backgroundColor: '#fff',
            minSize: 16,
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
}

function initiateProgressBar() {

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
}


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
function ACMSearch(search_param, num_papers) {
    var url = "php/get_ACM_list.php";

    return $.ajax({
        method: 'GET',
        url: url,
        dataType: 'text',
        data: {
            search: search_param,
            num_papers: num_papers
        }
    });
}

function getPaperListByName(search_param) {
    var results = [];
    for (var i = 0; i < currFileList.length; i++) {
        if (currFileList[i].abstract.includes(search_param)) {
            resultEntry = [];
            resultEntry.push(currFileList[i].title);
            var results_object = {
                title: currFileList[i].title
            };
            if (currFileList[i].hasOwnProperty("pdf")) {
                results_object.url = currFileList[i].pdf;
            } else if (currFileList[i].hasOwnProperty("url")) {
                results_object.url = currFileList[i].url;
            } else {
                results_object.url = "http://dl.acm.org";
            }
            results.push(results_object);
        }

    }

    return results;
}

function createPaperList(papers) {
    $('#paperList').css('display', 'block');
    $('#searchPage').css('display', 'none');
    $('#wordcloudPage').css('display', 'none');
    $(".backList").css('display', 'block');
    var titles = [];
    for (var key in papers) {
        titles.push(papers[key].title);
    }
    $('.paperTable').DataTable({
        data: titles,
        columns: [{
            title: 'Title',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                $(nTd).html("<a href='" + papers[iRow].url + "'>" + oData + "</a>");
            }
        // render: function(data, type, row, meta) {
        //     return '<a href="' + data.url + '">' + data.title + '</a>';
        // }
        }],
        'bDestroy': true
    });
}

function addSearchToHistory(search_param) {
    if (!previousSearches.includes(search_param)) {
        previousSearches.push(search_param);
        $('.dropdown-content').prepend('<div class="search-item" onClick="itemClick(this)">' + search_param + '</div>');
    }
}


function search() {
    initiateProgressBar();
    //Get contents of serach bar
    var search_param = $("#search").val();
    var num_papers = $("#number_papers").val();

    addSearchToHistory(search_param);

    currFileList = [];
    //Two promises for two searches. Might want to refactor in future
    $.when(IEEESearch(search_param), ACMSearch(search_param, num_papers)).done(function(a1, a2) {

        console.log(a1);
        console.log(a2);
        var b = JSON.parse(a2[0]);
        console.log(b);
        //If both searches succeeded
        var counter = 0;
        if (a1[1] == "success" && a2[1] == "success") {
            var results = JSON.parse(a1[0]);
            var papers = results.document;

            //titles is array of titles
            var titles = [];
            //all_titles is space delimited string of every word in every title
            var all_titles = "";
            //IEEE returns more information than ACM, so it must be in subkey document, and then pull title for each
            for (key in papers) {

                var title = papers[key].title;
                titles.push(title);
                if (papers[key].hasOwnProperty("abstract")) {
                    all_titles += papers[key].abstract;

                }
                all_titles += " ";

                currFileList.push(papers[key]);
                ++counter;
                if (counter >= num_papers) {
                    break;
                }
            }
            //if we still dont have enough papers
            if (counter < num_papers) {
                var results2 = JSON.parse(a2[0]);
                //ACM search returns array of titles, very little parsing needed
                for (key in results2) {
                    ++counter;
                    if (counter > num_papers) {
                        break;
                    }
                    var title = results2[key].title;

                    titles.push(title);
                    if (results2[key].hasOwnProperty("abstract")) {
                        all_titles += results2[key].abstract;
                    }

                    currFileList.push(results2[key]);
                }
            }

            /*
            var paperList = $("#paperList");
            paperList.css('display', 'block');
            for (key in titles) {
                var paper_name = titles[key];
                paperList.append("<li>" + paper_name + "</li>");
            }
            */


            console.log(currFileList);
            //Create actual word cloud
            getWordFrequency(all_titles);
        }

    //TODO add else statement showing an error
    });

    //display word cloud
    $('#wordcloudPage').css('display', 'block');
}
