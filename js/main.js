var currFileList = [];
var previousSearches = [];
var list_of_words = "";
var counter = 0;
var num_papers = 0;
var titles = [];

var line;

$(document).ready(function() {

    //create a progress bar
    line = new ProgressBar.Line('#progressbar');

    //enables/disables search button based on if there is text in box
    $('#search').keyup(function() {
        if ($(this).val().length != 0) {
            $('#searchButton').attr('disabled', false);
        } else {
            $('#searchButton').attr('disabled', true);
        }
    });

    //Search history dropdown - disable
    $('#search').on('focus', function() {
        $('.dropdown-content').addClass('dropdown-is-active');
    });

    //Search history dropdown - enable
    $('#search').on('focusout', function() {
        $('.dropdown-content').removeClass('dropdown-is-active');
    });

    //Added back button after clicking on word in wordcloud
    $(".backList").on('click', function() {
        $('#paperList').css('display', 'none');
        $('#searchPage').css('display', 'block');
        $('#wordcloudPage').css('display', 'block');
        $(".backList").css('display', 'none');
    });

    //Stops progress bar after loading is done
    $('#wordcloud').on('wordcloudstop', function() {
        line.stop();
        line.animate(1, {
            duration: 175
        }, function() {});
        setTimeout(function() {
            line.set(0);
        }, 900);
        $('#download').css('display', 'inline');
    });

    /*
    * Search
    */
    //called when search button searches
    $('#searchButton').on('click', function() {
        search();
    });
    //register download button with download action
    document.getElementById("download").addEventListener('click', dlCanvas, false);
    if (typeof mocha !== 'undefined') {
        mocha.run();
    }
});

//downloads canvas
function dlCanvas() {
    //get canvas
    var canvas = document.getElementById("wordcloud");
    //call function defined by hacky github js code
    canvas.toBlob(function(blob) {
        saveAs(blob, "output.png");
    }, "image/png");
}

//function called when a previous search item is clicked
function historyItemClicked(target) {
    //get text, set search box to that text, then search again
    var text = target.textContent;
    $('#search').val(text);
    search();
}

function generateWordList(item, dimension, event) {
    //item[0] = word being search for. getPaperListByName looks for all occurences of that word in all papers
    var papers = getPaperListByName(item[0]);
    createPaperList(papers);
}

function getWordFrequency(text) {
    //Options for word counter
    var wordFreqOptions = {
        workerUrl: './js/wordCounter/wordfreq.worker.js',
        language: 'english',
        stopWordSets: ['cjk', 'english1', 'english2']
    };

    //callbacks generates a wordcloud
    var wordfreq = WordFreq(wordFreqOptions).process(text, function(list) {
        //Word cloud options
        var options = {
            list: list,
            gridSize: Math.round(24 * $('#wordcloud').width() / 1024),
            weightFactor: function(size) {
                return Math.pow(size, 2.3) * $('#wordcloud').width() / 1024;
            },
            color: 'random-dark',
            // on click callback
            click: generateWordList,
            backgroundColor: '#fff',
            minSize: 4,
            maxRotation: 0,
            drawOutOfBound: false
        };
        listOfWords = list;
        //generate a wordcloud with the documents
        WordCloud(document.getElementById('wordcloud'), options);

        //debug code for testing
        if (window.location.href.indexOf("getword") > -1) {
            generateWordList(["me"]);
        }
    });
}

function initiateProgressBar() {
    //Logarithmic decay progress bar
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
    }, function() {});
}

//Returns a promise for $.when...
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

//Get URL of each PDF
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

//Actual search - returns promise for $.when...
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
//REturns promise of search. ACM has one query field, so no differentiation needed between author and keyword
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

//Looks in array of abstract to see if search word is there. If it is, push the title of that abstract into array 
//return array after checking every abstract. This is to build the list of papers
function getPaperListByName(word) {
    var results = [];
    //Iterate over array of objects
    for (var i = 0; i < currFileList.length; i++) {
        //If abstract of current object contains the word (guaranteed at least one!)
        if (currFileList[i].abstract.includes(word)) {
            //Create object to insert to results, initiate with title
            var results_object = {
                title: currFileList[i].title
            };
            //If IEEE inserted it, the url is in a key called pdf
            if (currFileList[i].hasOwnProperty("pdf")) {
                results_object.url = currFileList[i].pdf;
            //If ACM returned it, the url will be in a key called url
            } else if (currFileList[i].hasOwnProperty("url")) {
                results_object.url = currFileList[i].url;
            } else {
                //If url object does not exist, then default to dl.acm.org 
                results_object.url = "http://dl.acm.org";
            }
            //add object to results array
            results.push(results_object);
        }

    }
    //return array of objects. formatted like so:
    // [{
    //     title: 'title',
    //     url: 'url'
    // }, {
    //     title: 'title2',
    //     url: 'url2'
    // }];
    return results;
}

//Take in results of getPaperListByName and generate view of papers
function createPaperList(papers) {
    //Show paper list table
    $('#paperList').css('display', 'block');
    //Hide search
    $('#searchPage').css('display', 'none');
    //Hide wordcloud
    $('#wordcloudPage').css('display', 'none');
    //show back button
    $(".backList").css('display', 'block');
    //Create titles array from papers object
    var titles = [];
    for (var key in papers) {
        titles.push(papers[key].title);
    }
    //Create data table fromt titles, use render function to make them link to to their download
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

//Add each unique search to history for dropdown history
function addSearchToHistory(search_param) {
    if (!previousSearches.includes(search_param)) {
        previousSearches.push(search_param);
        $('.dropdown-content').prepend('<div class="search-item" onClick="historyItemClicked(this)">' + search_param + '</div>');
    }
}

//Parses returned IEEE results
function parseIEEE(a1) {
    console.log("IEEE:");
    console.log(a1);

    var results = JSON.parse(a1);

    var papers = results.document;

    //list_of_words is space delimited string of every word in every title
    //IEEE returns more information than ACM, so it must be in subkey document, and then pull title for each
    for (key in papers) {
        //Get paper title, add to title list
        var title = papers[key].title;
        titles.push(title);
        //If it has an abstract add it to list_of_words, the large string containing all words for word cloud
        if (papers[key].hasOwnProperty("abstract")) {
            list_of_words += papers[key].abstract;

        }
        //Add space between abstracts so that the end of one abstract doesnt turn into the beginning of another
        //i.e. ... ending word.Start of other ...
        list_of_words += " ";

        currFileList.push(papers[key]);
        //Inc counter - if we have enough papers, break
        ++counter;
        if (counter >= num_papers) {
            break;
        }
    }
}

//Parses returned ACM search results
function parseACM(a2) {
    console.log("ACM: ");
    console.log(a2);

    //Only parse them if we don't have enough papers in our paper list yet
    if (counter < num_papers) {
        var results2 = JSON.parse(a2[0]);
        //ACM search returns array of titles, very little parsing needed
        for (key in results2) {
            var title = results2[key].title;
            //Add title to list of titles
            titles.push(title);
            //If it has an abstract, add it to the full list of them
            if (results2[key].hasOwnProperty("abstract")) {
                list_of_words += results2[key].abstract;
            }
            //Add the entire object (And all associated information to the file list)
            currFileList.push(results2[key]);
            //Increment counter. If we have enough, break
            ++counter;
            if (counter > num_papers) {
                break;
            }
        }
    }
}
function parseTwoResults(a1, a2) {
    //reinitialize the paper amount counter to 0 and all the words to empty string
    counter = 0;
    list_of_words = "";
    //If both searches succeeded, parse them
    if (a1[1] == "success" && a2[1] == "success") {
        //reinit titles arrray
        titles = [];
        //parse IEEE results
        parseIEEE(a1[0]);
        //if we still dont have enough papers
        parseACM(a2);
        //Create actual word cloud
        getWordFrequency(list_of_words);
    }
}
function search() {
    //Start top progress bar
    initiateProgressBar();
    //Get contents of search bar & num papers
    var search_param = $("#search").val();
    num_papers = $("#number_papers").val();

    addSearchToHistory(search_param);

    currFileList = [];
    if (parseInt(num_papers) <= 20) {
        var url = "php/get_IEEE_list.php";
        $.ajax({
            method: 'GET',
            url: url,
            dataType: 'text',
            data: {
                search: search_param
            },
            success: function(data, code, jqXHR) {
                parseIEEE(data);
                getWordFrequency(list_of_words);
            }
        });
    } else {
        //IEEE search returns 20 ish results. Only search ACM (which takes a lot longer) if search query is >20
        //Only search for num_papers - 20 amount
        var acm_amount = num_papers - 20;
        $.when(IEEESearch(search_param), ACMSearch(search_param, acm_amount)).done(parseTwoResults);

    }
    //display word cloud
    $('#wordcloudPage').css('display', 'block');
}
