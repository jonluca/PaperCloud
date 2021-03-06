let currFileList = [];
let list_of_words = "";
let counter = 0;
let num_papers = 0;
let titles = [];
let papers = [];
let previousSearches = [];
let clickedWord = "";
let all_items;
let line;

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

    $('#exportTXT').on('click', function() {
        downloadListAsText();
    });

    $('#searchTypeButton').on('click', function() {
        if ($('#searchTypeButton')[0].textContent == "Author") {
            $('#searchTypeButton').text("Keyword");
        } else {
            $('#searchTypeButton').text("Author");
        }
    });

    //Search history dropdown - disable
    $('#search').on('focus', function() {
        $('.dropdown-content').addClass('dropdown-is-active');
    });

    //Search history dropdown - enable
    $('#search').on('focusout', function() {
        setTimeout(function() {
            $('.dropdown-content').removeClass('dropdown-is-active');
        }, 250);

    });

    //Makes enter search on num papers input box
    $('#number_papers').bind("enterKey", function(e) {
        search();
    });

    $('#number_papers').keyup(function(e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

    //Added back button after clicking on word in wordcloud
    $("#goBack").on('click', function() {
        $('#paperList').css('display', 'none');
        $('#searchPage').css('display', 'block');
        $('#wordcloudPage').css('display', 'block');
        $(".backList").css('display', 'none');
    });

    //Export table as PDF
    $("#exportPDF").on('click', function() {
        let pdf = new jsPDF('p', 'pt', 'letter');
        pdf.canvas.height = 72 * 11;
        pdf.canvas.width = 72 * 8.5;
        html2pdf(document.getElementById('listPapers'), pdf, function(pdf) {
            pdf.output('dataurlnewwindow');
        });
    });

    //Export table as TXT
    $("#exportTXT").on('click', function() {});


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

    //get subset word cloud from selected words
    $("#getSubset").on('click', function() {
        let array = [];

        $('.getSubsetCheckbox').each(function(index, element) {
            console.log($(element).prop('checked'));
            if ($(element).prop('checked')) {
                array.push($(element).data('title'));
            }
        });

        console.log(array);
        console.log(getSubsetWordCloud(array));
        getWordFrequency(getSubsetWordCloud(array));
        $('#paperList').css('display', 'none');
        $('#searchPage').css('display', 'block');
        $('#wordcloudPage').css('display', 'block');
    });

    /*
    * Search
    */
    //called when search button searches
    $('#searchButton').on('click', function() {
        search();
    });
    //register download button with download action
    if (typeof mocha !== 'undefined') {
        mocha.run();
    } else {
        document.getElementById("download").addEventListener('click', dlCanvas, false);
    }
    if (window.location.href.indexOf("word") > -1) {
        generateWordList([["test", "test2"]]);
    }
});

//downloads canvas
function dlCanvas() {
    //get canvas
    let canvas = document.getElementById("wordcloud");
    //call function defined by hacky github js code
    canvas.toBlob(function(blob) {
        saveAs(blob, "output.png");
    }, "image/png");
}

//function called when a previous search item is clicked
function historyItemClicked(target) {
    console.log('a history item was clicked');
    //get text, set search box to that text, then search again
    let text = target.textContent;
    $('#search').val(text);
    search();
}

function generateWordList(item, dimension, event) {
    //item[0] is the word being search for. getPaperListByName looks for all occurences of that word in all papers
    all_items = item;
    papers = getPaperListByName(item[0]);
    createPaperList(papers);
}

//Returns Bibtex in a string format (with newlines already)
function getBibtex(doi) {
    let url = "php/get_bibtex.php";

    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'text',
        data: {
            doi: doi
        },
        success: function(data, code, jqXHR) {
            $("#pop-up-info").text(data);
            $('#pop-up-info').css('display', 'block');
            $("#pop-up-info").dialog();
            $("#pop-up-info").dialog('option', 'title', 'BibTeX');

        }
    });
}

function getWordFrequency(text) {
    //Options for word counter
    let wordFreqOptions = {
        workerUrl: './js/wordCounter/wordfreq.worker.js',
        language: 'english',
        stopWordSets: ['cjk', 'english1', 'english2']
    };

    //callbacks generates a wordcloud
    let wordfreq = WordFreq(wordFreqOptions).process(text, function(list) {
        //Word cloud options
        if (list.length > 250) {
            list = list.slice(0, 250);
        }
        let options = {
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
            minRotation: 0,
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
    let duration = 400000;

    line.animate(1, {
        // Duration for animation in milliseconds
        // Default: 800
        duration: duration,

        // Easing for animation. See #easing section.
        // Default: 'linear'
        easing: function(pos) {
            let val = Math.log(pos * duration + 1) / 14;
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
    let url = "php/get_IEEE_text.php";
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
    let url = "php/get_IEEE_text.php";
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
    let url = "php/get_IEEE_list.php";

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
    let url = "php/get_ACM_list.php";

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
    let results = [];
    clickedWord = word;
    //Iterate over array of objects
    for (let i = 0; i < currFileList.length; i++) {
        //If abstract of current object contains the word (guaranteed at least one!)
        let re = new RegExp(word, "g");
        let count = (currFileList[i].abstract.match(re) || []).length;
        if (count > 0) {
            //Create object to insert to results, initiate with title
            let results_object = {
                title: currFileList[i].title
            };
            results_object.frequency = count;
            //If IEEE inserted it, the url is in a key called pdf
            if (currFileList[i].hasOwnProperty("pdf")) {
                //results_object.url = currFileList[i].pdf;
                results_object.url = IEEEGetPdfUrl(currFileList[i].arnumber, word);
            //If ACM returned it, the url will be in a key called url
            } else if (currFileList[i].hasOwnProperty("url")) {
                results_object.url = currFileList[i].url;
            } else {
                //If url object does not exist, then default to dl.acm.org
                results_object.url = "http://dl.acm.org";
            }

            if (currFileList[i].hasOwnProperty('url')) {
                results_object.libURL = currFileList[i].url;
            } else if (currFileList[i].hasOwnProperty('pdf')) {
                results_object.libURL = currFileList[i].pdf;
            }


            if (currFileList[i].hasOwnProperty("doi")) {
                results_object.doi = currFileList[i].doi;
            }

            if (currFileList[i].hasOwnProperty("abstract")) {
                results_object.abstract = currFileList[i].abstract;
            }

            if (currFileList[i].hasOwnProperty("authors")) {
                results_object.authors = currFileList[i].authors.toString();
            }

            if (currFileList[i].hasOwnProperty("pubtitle")) {
                results_object.pubtitle = currFileList[i].pubtitle;
            }

            if (currFileList[i].hasOwnProperty("arnumber")) {
                results_object.arn = currFileList[i].arnumber;
            }
            if (currFileList[i].hasOwnProperty("org")) {
                results_object.org = currFileList[i].org;
            }
            //add object to results array
            results.push(results_object);
        }

    }
    /*return array of objects. formatted like so:
    [{
        title: 'title',
        url: 'url'
    }, {
        title: 'title2',
        url: 'url2'
    }];*/
    return results;
}

function showAbstract(abstract, url) {


    let aElement = "<a id=\"abstract_link\" href='" + url + "'>Download PDF</a>";
    $("#pop-up-info").html(abstract + "<br/>" + aElement);
    if (clickedWord.length > 0) {
        $("#pop-up-info").mark(clickedWord);
    }
    $('#pop-up-info').css('display', 'block');
    $("#pop-up-info").dialog();
    $("#pop-up-info").dialog('option', 'title', 'Abstract');
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
    //for testing
    if (window.location.href.indexOf("word") > -1) {
        papers = [
            {
                "title": "Heterogeneous multiprocessor implementations for JPEG:: a case study",
                "frequency": 2,
                "url": "php/pdfs/IEEE-4278518-model.pdf",
                "libURL": "http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=4278518",
                "doi": "10.1145/1176254.1176307",
                "abstract": "Heteregenous multiprocessor SoCs are becoming a reality, largely due to the abundance of transistors, intellectual property cores and powerful design tools. In this project, we explore the use of multiple cores to speed up the JPEG compression algorithm. We show two methods to parallelize this algorithm: one, a master-slave model; and two, a pipeline model. The systems were implemented using Tensilica's Xtensa LX processors with queues. We show that even with this relatively simple application, parallelization can be carried out with up to nine processors with utilization of between 50% to 80%. We obtained speed ups of up to 4.6X with a seven core system with an area increase of 3. 1X.",
                "authors": "Andrea Erdos;  Sri Parameswaran;  Seng Lin Shee",
                "pubtitle": "Proceedings of the 4th International Conference on Hardware/Software Codesign and System Synthesis (CODES+ISSS '06)",
                "arn": "4278518",
                "org": "IEEE"
            },
            {
                "title": "Density of states of one-dimensional random potentials",
                "frequency": 1,
                "url": "php/pdfs/IEEE-5390029-model.pdf",
                "libURL": "http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=5390029",
                "doi": "10.1147/rd.321.0047",
                "abstract": "Following an introduction to the early history of the theories of the density of electronic states in one-dimensional structures, pioneered, among others, by R. Landauer and J. C. Helland, a particular model, that of a multistep random potential, is discussed. It is shown that Kolmogorov-type equations can be obtained for the probability distribution of the phase of the wave function, and, by solving these equations, the density of states may be calculated. An analogy with the classical rotator in a random force field is worked out, and helps in visualizing the results.",
                "authors": "Paul Erdos",
                "pubtitle": "IBM Journal of Research and Development",
                "arn": "5390029",
                "org": "IEEE"
            },
            {
                "title": "Extended Petri-net modeling for re-manufacturing line simulation",
                "frequency": 8,
                "url": "php/pdfs/IEEE-747587-model.pdf",
                "libURL": "http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=747587",
                "doi": "10.1109/ECODIM.1999.747587",
                "abstract": "We address the problem of building, simulating and improving the performance of a remanufacturing line computer model. We present a parametric Petri net model of a remanufacturing line: places represent precedence constraints on operations, while transitions model remanufacturing operations. Basic parameters of the Petri net model are the token type (its color), the capacity of places and the priority and firing duration of transitions. We use different token colors to model the different states of a product through the test and repair loop. The capacity parameter is used to model the grouping of products into boxes, that facilitate transportation. The priority of operations is used to resolve conflicts among alternative operations. We simulate the operation of the parametric Petri net model using the software POSES++ for a semi-automated telephone remanufacturing line test case. From the simulation experiments of the case study it turns out that throughput performance is not very sensitive to the duration of testing, cleaning or packing and optimal performance can be achieved when the ratio of disassembly to reassembly duration is close to one. We extend our previous base model to also include the effects of feeding the line with new covers and electronic circuits to avoid line starvation",
                "authors": "G. Erdos;  P. Xirouchakis",
                "pubtitle": "Proceedings First International Symposium on Environmentally Conscious Design and Inverse Manufacturing",
                "arn": "747587",
                "org": "IEEE"
            }
        ];
    }
    let titles = [];
    for (let key in papers) {
        titles.push([]);
        titles[titles.length - 1].push(papers[key].title);
        titles[titles.length - 1].push(papers[key].title);
        titles[titles.length - 1].push(papers[key].authors);
        titles[titles.length - 1].push(papers[key].pubtitle);
        titles[titles.length - 1].push(papers[key].frequency);
        titles[titles.length - 1].push(papers[key].doi);
        titles[titles.length - 1].push(papers[key].libURL);
        titles[titles.length - 1].push(papers[key].arn);
    }
    //Create data table fromt titles, use render function to make them link to to their download
    if ($.fn.dataTable.isDataTable('.paperTable')) {
        let table = $('.paperTable').DataTable();
        table.destroy();
    }

    $('.paperTable').DataTable({
        data: titles,
        order: [[4, "desc"]],
        columns: [{
            title: '',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                $(nTd).html("<input type='checkbox' class='getSubsetCheckbox' data-title='" + papers[iRow].title + "'>");
            }
        }, {
            title: 'Title',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                $(nTd).html("<a href=\"#\" onClick='showAbstract(\"" + papers[iRow].abstract + "\",\"" + papers[iRow].url + "\")'>" + papers[iRow].title + "</a>");

            }
        }, {
            title: 'Author',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                let authorString = papers[iRow].authors;
                let authorArray = authorString.split(';');
                $(nTd).html('');
                for (let i = 0; i < authorArray.length; i++) {
                    $(nTd).append("<a class='author-link' onClick='authorClicked(this)' href='#'>" + authorArray[i] + "</a></br>");
                }
            }
        }, {
            title: 'Conference',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                $(nTd).html("<a href='#' onClick='conferenceSearch(\"" + papers[iRow].pubtitle + "\")'>" + papers[iRow].pubtitle + "</a>");
            }
        }, {
            title: 'Frequency',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                //$(nTd).html(papers[iRow].frequency);
            }
        }, {
            title: 'BibTeX',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                $(nTd).html("<a href=\"#\" onClick='getBibtex(\"" + papers[iRow].doi + "\")'>BibTeX</a>");
            }
        }, {
            title: 'PDF',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                $(nTd).html("<a href=\"" + papers[iRow].libURL + "\">PDF</a>");
            }
        }, {
            title: 'TXT',
            "fnCreatedCell": function(nTd, sData, oData, iRow) {
                if (papers[iRow].org == "IEEE") {
                    $(nTd).html("<a href=\"#\" onClick=\"downloadAsText(0," + papers[iRow].arn + ")\">TXT</a>");
                } else {
                    $(nTd).html("<a href=\"#\" onClick=\"downloadAsText(1," + papers[iRow].doi + ")\">TXT</a>");
                }
            }
        }]
    });
}

function saveAsTextIEEE(data) {
    $(".sk-cube-grid").css('display', 'none');

    let blob = new Blob([data], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "download.txt");
}
function downloadAsText(type, uniquenum) {
    $(".sk-cube-grid").css('display', 'block');
    if (type == 0) {
        //IEEE

        $.when(IEEEGetText(uniquenum)).done(saveAsTextIEEE);
    } else {
        //ACM - iterate over papers, if doi match save text
        for (key in currFileList) {
            if (currFileList[key].doi == uniquenum) {
                $(".sk-cube-grid").css('display', 'none');
                let blob = new Blob([currFileList[key].paper], {
                    type: "text/plain;charset=utf-8"
                });
                saveAs(blob, "download.txt");
                break;
            }
        }
    }
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

    let results = JSON.parse(a1);
    console.log(results);

    let papers = results.document;

    //list_of_words is space delimited string of every word in every title
    //IEEE returns more information than ACM, so it must be in subkey document, and then pull title for each
    for (key in papers) {
        //Get paper title, add to title list
        let title = papers[key].title;
        titles.push(title);
        //If it has an abstract add it to list_of_words, the large string containing all words for word cloud
        if (papers[key].hasOwnProperty("abstract")) {
            list_of_words += papers[key].abstract;
        }
        //Add space between abstracts so that the end of one abstract doesnt turn into the beginning of another
        //i.e. ... ending word.Start of other ...
        list_of_words += " ";
        papers[key].org = "IEEE";

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

    //Only parse them if we don't have enough papers in our paper list yet
    if (counter < num_papers) {
        let results2 = JSON.parse(a2[0]);
        console.log(results2);
        //ACM search returns array of titles, very little parsing needed
        for (key in results2) {
            let title = results2[key].title;
            //Add title to list of titles
            titles.push(title);
            //If it has an abstract, add it to the full list of them
            if (results2[key].hasOwnProperty("abstract")) {
                list_of_words += results2[key].abstract;
            }
            results2[key].org = "ACM";
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
    let search_param = $("#search").val();
    num_papers = $("#number_papers").val();

    //Add the search to the history
    addSearchToHistory(search_param);

    //reinit the file list so that we don't use the old stuff
    currFileList = [];
    list_of_words = "";
    if (parseInt(num_papers) <= 20) {
        //recycled code from IEEESearch function so we don't have to deal with promises for a single ajax call
        let url = "php/get_IEEE_list.php";
        let type = $('#searchTypeButton')[0].textContent;
        $.ajax({
            method: 'GET',
            url: url,
            dataType: 'text',
            data: {
                search: search_param,
                type: type
            },
            success: function(data, code, jqXHR) {
                //parse data
                parseIEEE(data);
                //generate word cloud
                getWordFrequency(list_of_words);
                $('#wordcloudPage').css('display', 'block');

            }
        });
    } else {
        //IEEE search returns 20 ish results. Only search ACM (which takes a lot longer) if search query is >20
        //Only search for num_papers - 20 amount
        let acm_amount = num_papers - 20;
        $.when(IEEESearch(search_param), ACMSearch(search_param, acm_amount)).done(parseTwoResults);
        $('#wordcloudPage').css('display', 'block');

    }
}

function downloadListAsText() {
    let textToSave = '';

    for (let i = 0; i < papers.length; i++) {
        let paper = papers[i];
        textToSave += 'Title: ' + paper.title + '\n';
        textToSave += 'Authors: ' + paper.authors + '\n';
        textToSave += 'Conference: ' + paper.pubtitle + '\n \n';
    }

    let blob = new Blob([textToSave], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, 'myText.txt');
}

function authorClicked(el) {
    let searchAuthor = $(el)[0].innerText;
    $('#paperList').css({
        display: 'none'
    });
    $('#searchPage').css('display', 'block');
    $('#wordcloudPage').css('display', 'block');
    $(".backList").css('display', 'none');
    $('#search').val(searchAuthor);
    search();
}

function conferenceSearch(conference) {
    $(".backList").css('display', 'none');

    $('#paperList').css({
        display: 'none'
    });

    initiateProgressBar();

    let url = "php/get_IEEE_conference_list.php";
    $.ajax({
        method: 'GET',
        url: url,
        data: {
            search: conference
        },
        success: function(data, code, jqXHR) {
            let papers;
            try {
                papers = JSON.parse(data);
            } catch ( e ) {
                console.log("Error parsing conferences!");
            }
            console.log(papers);
            //reinit the file list so that we don't use the old stuff
            currFileList = [];
            list_of_words = "";
            //parse data
            parseIEEE(data);
            //generate word cloud
            getWordFrequency(list_of_words);
            $('#wordcloudPage').css('display', 'block');

            $('#searchPage').css('display', 'block');
            $('#wordcloudPage').css('display', 'block');


            // papers = papers.document;
            // $("#pop-up-info").html("<ul id='popup-table'></ul>");
            // for (key in papers) {
            //     $("#popup-table").append('<li>' + papers[key].title + '</li>');
            // }
            // $('#pop-up-info').css('display', 'block');
            // $("#pop-up-info").dialog();
            // $("#pop-up-info").dialog('option', 'title', conference);

        }
    });
}
function getSubsetWordCloud(array) {
    let totalString = "";

    let newArray = [];
    for (let i = 0; i < array.length; i++) {

        for (let j = 0; j < currFileList.length; j++) {
            if (currFileList[j].title === array[i] && currFileList[j].hasOwnProperty("abstract")) {
                totalString += currFileList[j].abstract;
                newArray.push(currFileList[j]);
                break;
            }
        }
    }

    currFileList = newArray;
    return totalString;
}

function download_pdf_testing() {
    let url = $("#pop-up-info > a");
    return url[0].href;
}