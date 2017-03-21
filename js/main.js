//Will contain all the authors (?)
var totalLyrics = "";
//Song array contains each song, with its respective lyrics and artist
var songArray = [];
var lyricToSongDictionary = {};
var cleanToDirtySongMap = {};

$(document).ready(function() {

    //generates a wordcloud from the raw lyrics text
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
                weightFactor: 10,
                color: 'random-dark',
                hover: window.drawBox,

                // on click callback
                click: generateWordList,
                backgroundColor: '#fff',
                minSize: 12,
                minRotation: 0,
                maxRotation: 0,
                shape: function(phi) {
                    phi = ((phi + 45) % 90 - 45) / 180 * Math.PI;
                    return 1 / Math.cos(phi);
                }
            };
            listOfWords = list;
            //generate a wordcloud with the documents
            WordCloud(document.getElementById('canvas'), options);
            if (window.location.href.indexOf("getword") > -1) {
                generateWordList(["me"]);
            }
        });
    };

    function getLyrics(artist, song) {

        //cleans up artist names, removes not accepted chars
        artist = artist.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, '');
        if (artist.startsWith('the')) {
            artist = artist.substr(3);
        }
        var url = "php/get_lyrics.php";
        //json encoded array of songs (i.e. ["hello", "goodbye"])
        var jsonSong = JSON.stringify(song);
        //to base64
        var b64songs = window.btoa(jsonSong);

        $.ajax({
            method: 'GET',
            url: url,
            type: 'json',
            data: {
                artist: artist,
                songs: b64songs
            },
            success: function(data, code, jqXHR) {
                //artist name
                var artistName = $('#select2-searchbar-container > option').html();

                //json array of returned lyrics
                var songLyrics = JSON.parse(data);

                //parse the returned json
                parseLyrics(songLyrics, artistName);

                //SO NOW WE HAVE ALL THE SONGS!
                //stop loading bar
                var artistId = $('#searchbar').val();
                $('.loading').css('display', 'none');
                getWordFrequency(totalLyrics);
                //change view
                $('#artistname').html(artistName);
                $('.canvaspage').css('display', 'block');
                $('.canvaspagebtn').css('display', 'inline-block');

            }
        });
    }

    function parseLyrics(songLyrics, artistName) {
        //lyrics are returned as a dictionary with name as key and lyrics as val
        for (var key in songLyrics) {
            //get words - stem/stop
            var words = songLyrics[key].toLowerCase();
            //add all words to total lyrics
            totalLyrics += words;
            var songStruct = {
                artist: artistName,
                song: key,
                lyrics: words
            };
            //Song array contains each song, with its artist and lyrics
            songArray.push(songStruct);
            fillLyricToSongArray(songStruct);
        }
    }

    //function called when a word is clicked on
    //note this needs to be above the options var
    //as we pass it as a callback
    var generateWordList = function(item) {
        $('.canvaspage').css('display', 'none');
        $('.wordpage').css('display', 'block');
        $('#word').html(item[0]);
        $(document).attr('title', item[0]);
        $('.canvaspagebtn').css('display', 'none');
        $('.searchpage').css('display', 'none');

        $('.songlist').empty();

        //TODO: get list of songs and write them to .songlist div
        lyricToSongDictionary[item[0]].sort(function(a, b) {
            return a.count < b.count;
        });

        lyricToSongDictionary[item[0]].forEach(function(song) {
            $('.songlist').append('<span class="song-name" data-artist="' + song.artist.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, '') + '" data-song="' + song.title + '"> #count: ' + song.count + ': ' + cleanToDirtySongMap[song.title] + '</span>');
        });

    };

    $('.songlist').on('click', '.song-name', function(event) {

        $('.songpage').css('display', 'block');
        $('#songname').html(cleanToDirtySongMap[event.target.dataset.song]);
        $(document).attr('title', cleanToDirtySongMap[event.target.dataset.song]);
        $('.wordpage').css('display', 'none');

        $('#songlyrics').append('<div class="loading" id="songloader"><div class="spinner"></div></div>');
        $('#songloader').css({
            'display': 'block'
        });

        getRawLyrics(event.target.dataset.artist, event.target.dataset.song, injectLyrics);
    });

    var injectLyrics = function(htmlLyrics) {
        var word = $('#word').text();
        var highlightedSong = highlightSong(htmlLyrics, word);
        $('#songlyrics').empty();
        $('#songlyrics').append(highlightedSong);
    };

    function getRawLyrics(artist, song, callback) {
        var url = "../php/get_raw_lyrics.php?artist=" + artist + "&song=" + song;
        $.get(url, function(data) {
            callback(data);
        });
    }

    function highlightSong(songLyrics, word) {
        var regex = new RegExp('\\b' + word + '\\b', 'gi');
        var splitted = songLyrics.split(regex);
        var joined = splitted.join('<span class="highlight-word" > ' + word + '</span>');
        return joined;
    }

    function fillLyricToSongArray(songStruct) {
        var splitted = songStruct.lyrics.split(/\s+/);

        //add words to global dictionary from lyrics to songs
        splitted.forEach(function(lyric) {
            lyric.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, '');

            if (lyricToSongDictionary[lyric] === undefined) {
                lyricToSongDictionary[lyric] = [];
                lyricToSongDictionary[lyric].push({
                    title: songStruct.song,
                    count: 1,
                    artist: songStruct.artist
                });
            } else {
                var added = false;
                for (var i = 0; i < lyricToSongDictionary[lyric].length; i++) {
                    if (lyricToSongDictionary[lyric][i].title === songStruct.song) {
                        lyricToSongDictionary[lyric][i].count = lyricToSongDictionary[lyric][i].count + 1;
                        added = true;
                    }
                }

                if (!added) {
                    lyricToSongDictionary[lyric].push({
                        title: songStruct.song,
                        count: 1,
                        artist: songStruct.artist
                    });
                }
            }

        });
    }

    //formats the artist search suggestions
    function formatArtist(artist) {
        var markup;
        if (!artist.loading) {
            if (artist.images.length >= 1) {
                markup = "<div class='artist-searchbar-name'>" + artist.name + "</div>" +
                    "<div class='artist-searchbar-image'><img width='64' height='64' src='" + artist.images[0].url + "' /></div>";
            } else {
                markup = "<div class='artist-searchbar-name'>" + artist.name + "</div>";
            }
        } else {
            markup = "<p>Loading...</p>";
        }
        return markup;
    }


    //formats the artist once selected in search bar
    function formatArtistSelection(artist) {
        var markup;
        if (artist.name) {
            markup = '<option value="' + artist.id + '" selected="selected">' + artist.name + '</option>';
        } else {
            markup = 'Search for an artist!';
        }
        return markup;
    }

    //retrieves the top songs for a given artist id
    var getSongs = function(artistId, callback) {
        $.ajax({
            method: 'GET',
            url: 'php/get_songs.php',
            type: 'json',
            data: {
                artistid: artistId
            },
            success: function(data, code, jqXHR) {
                callback(data, code, jqXHR);
            }
        });
    };

    function cleanSong(song) {
        if (song.name.includes('feat.')) {
            var index = song.name.indexOf('feat.');
            song.name = song.name.substring(0, index);
        }

        var dirty = song.name;
        var clean = song.name.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s/g, '');
        cleanToDirtySongMap[clean] = dirty;
        return clean;
    }


    $('#searchbar').select2({
        ajax: {
            url: "php/artist_search.php",
            dataType: 'json',
            delay: 250,
            data: function(params) {
                return {
                    artist: params.term, // search term
                };
            },
            processResults: function(data, params) {
                // parse the results into the format expected by Select2

                return {
                    results: data.items
                };
            },
            cache: true
        },
        escapeMarkup: function(markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 3,
        templateResult: formatArtist, // omitted for brevity, see the source of this page
        templateSelection: formatArtistSelection // omitted for brevity, see the source of this page
    });

    $('#searchbar').on("select2:select", function(e) {
        $('#search').removeAttr('disabled');
    });

    //search button on click
    $('#search').click(function() {


        //t add loading bar
        $('.loading').css('display', 'block');

        var artistId = $('#searchbar').val();
        var artistName = $('#select2-searchbar-container > option').html();

        totalLyrics = "";
        getSongs(artistId, function(data, code, jqXHR) {
            //should return up to 10 elements in json array
            var songs = JSON.parse(data);
            var fullSongList = [];
            for (var i = 0; i < songs.length; i++) {
                //remove unaccepted chars, remove featured
                var song = cleanSong(songs[i]);
                //add song to json array
                fullSongList.push(song);
            }
            getLyrics(artistName, fullSongList);
        });
    });

    //go back to canvas
    $('.backToCanvas').click(function() {
        $(document).attr('title', 'SuperLyrics');
        $('.canvaspage').css('display', 'block');
        $('.wordpage').css('display', 'none');
        $('.canvaspagebtn').css('display', 'inline-block');
        $('.searchpage').css('display', 'block');
        $('.songpage').css('display', 'none');
        $('#songlyrics').empty();
        console.log('back to canvas is getting fired');
    });

    //go back to wordpage
    $('#backToWordpage').click(function() {
        $(document).attr('title', $('#word').text());
        $('.songpage').css('display', 'none');
        $('.wordpage').css('display', 'block');
        $('#songlyrics').empty();
    });

    //merge function

    $('#add').click(function() {
        $('.loading').css('display', 'block');
        $('.canvaspage').css('display', 'none');
        var artistId = $('#searchbar').val();
        var artistName = $('#select2-searchbar-container > option').html();
        var songsRecieved = 0;
        var numSongs = 1;
        getSongs(artistId, function(data, code, jqXHR) {
            //data equals an array of 10 songs
            var songs = JSON.parse(data);
            var fullSongList = [];
            for (var i = 0; i < songs.length; i++) {
                //remove unaccepted chars, remove featured
                var song = cleanSong(songs[i]);
                //add song to json array
                fullSongList.push(song);
            }
            getLyrics(artistName, fullSongList);

            //SO NOW WE HAVE ALL THE SONGS!
            //todo: stop loading bar
            $('#artistname').append(' and ' + artistName);
            $('.canvaspage').css('display', 'block');
            $('.loading').css('display', 'none');
        });
    });

    //http://gorigins.com/posting-a-canvas-image-to-facebook-and-twitter/
    function postImageToFacebook(token, filename, mimeType, imageData, message) {
        var fd = new FormData();
        fd.append("access_token", token);
        fd.append("source", imageData);
        fd.append("no_story", false);

        // Upload image to facebook without story(post to feed)
        $.ajax({
            url: "https://graph.facebook.com/me/photos?access_token=" + token,
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: function(data) {

                // Get image source url
                FB.api(
                    "/" + data.id + "?fields=images", function(response) {
                        if (response && !response.error) {

                            // Create facebook post using image
                            FB.api(
                                "/me/feed",
                                "POST", {
                                    "message": "",
                                    "picture": response.images[0].source,
                                    "link": window.location.href,
                                    "name": 'Look at the wordcloud',
                                    "description": message,
                                    "privacy": {
                                        value: 'SELF'
                                    }
                                }, function(response) {
                                    if (response && !response.error) {
                                        /* handle the result */
                                        console.log("Posted story to facebook");
                                        console.log(response);
                                    }
                                }
                            );
                        }
                    }
                );
            },
            error: function(shr, status, data) {
                console.log("error " + data + " Status " + shr.status);
            },
            complete: function(data) {
                console.log('Post to facebook Complete');
            }
        });
    }

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {
            type: 'image/png'
        });
    }

    $('#share').click(function() {

        var cloudDataURL = canvas.toDataURL("wordcloud.png");
        blob = dataURItoBlob(cloudDataURL);
        FB.getLoginStatus(function(response) {
            console.log(response);
            if (response.status === "connected") {
                postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
            } else if (response.status === "not_authorized") {
                FB.login(function(response) {
                    postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
                }, {
                    scope: "publish_actions"
                });
            } else {
                FB.login(function(response) {
                    postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob, window.location.href);
                }, {
                    scope: "publish_actions"
                });
            }
        });
    });
});