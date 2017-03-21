<?php

use Behat\Behat\Tester\Exception\PendingException;
use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\MinkExtension\Context\MinkContext;


/**
 * Defines application features from the specific context.
 */
class FeatureContext extends MinkContext
{
    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct()
    {
    }

    /**
     * @Given the search bar has no selected artist
     */
    public function theSearchBarHasNoSelectedArtist()
    {

        //get the session
        $session = $this->getSession();
        //the search bar has no selected artist initially
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();
    }

    /**
     * @When I click on the Search Button
     */
    public function iClickOnTheSearchButton()
    {
        //get the search button
        $GLOBALS['searchButton'] = $this->page->findById('search');
    }

    /**
     * @Then the button will be deactivated
     */
    public function theButtonWillBeDeactivated()
    {
        //check if the search button is disabled, if not, then we can click on it, so test fails
        if (!$GLOBALS['searchButton']->hasAttribute('disabled')) {
            throw new Exception;
        }
    }

    /**
     * @Given the search bar has two or more letters
     */
    public function theSearchBarHasTwoOrMoreLetters()
    {
        //get session
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //click on search bar to have it open
        $GLOBALS['searchBar'] = $this->page->find('css', '#select2-searchbar-container')->click();

        //enter two letters into search bar
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('ad');

        //open search bar and focus (there will be no search results)
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();

        sleep(1);
    }

    /**
     * @When I type another letter
     */
    public function iTypeAnotherLetter()
    {
        //grab search bar and enter another letter
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('ade');
    }

    /**
     * @Then a Spotify API call will return matching artists
     */
    public function aSpotifyApiCallWillReturnMatchingArtists()
    {

        //open search bar and view search results
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();

        //wait two seconds for search results
        sleep(2);

        //check if we have recieved search results, otherwise throw and error
        $searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        if ($searchResult == null)
            throw new Exception;

    }

    /**
     * @Given a drop down list of artists
     */
    public function aDropDownListOfArtists()
    {

        //get session
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //get search bar and type adele into it
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();

        //wait for drop down of artists and select first one
        sleep(2);
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
    }

    /**
     * @When I click on an artist
     */
    public function iClickOnAnArtist()
    {
        //click on first result
        $this->searchResult->click();
    }

    /**
     * @Then the artist will be selected in the search bar
     */
    public function theArtistWillBeSelectedInTheSearchBar()
    {
        //get name in search bar
        $artistName = $this->page->find('css', '#select2-searchbar-container > option')->getHtml();

        //check if name is equal to the one we searched

        if ($artistName != 'Adele') {
            throw new Exception;
        }
    }

    /**
     * @Given I have selected an artist
     */
    public function iHaveSelectedAnArtist()
    {

        // get sessions
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
    }

    /**
     * @When I click the Search button
     */
    public function iClickTheSearchButton()
    {
        // click the search button
        $this->page->findById('search')->click();
    }

    /**
     * @Then I will be brough to the wordcloud page
     */
    public function iWillBeBroughToTheWordcloudPage()
    {
        //wait 7 seconds for word cloud page to loud
        sleep(7);

        //check if the word cloud page is visible
        if (!$this->page->find('css', '#canvas-container')->isVisible())
            throw new Exception($this->page->find('css', '.canvaspage')->getAttribute('style'));
    }

    /**
     * @Given I have clicked on a word
     */
    public function iHaveClickedOnAWord()
    {
    // get sessions
        $session = $this->getSession();
            //hacky way of clicking word - since element is in HTMLCanvas, no way of getting it with js or by clicking coordinates
            //So we tell js to autoclick word if url contains getword
        $session->visit('http://localhost/SuperLyrics&getword=true');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();

  }

    /**
     * @When I view the page
     */
    public function iViewThePage()
    {
        sleep(7);
        if (!$this->page->find('css', '.wordpage')->isVisible()){
            throw new Exception($this->page->find('css', '.wordpage')->getAttribute('style'));
        }
    }

    /**
     * @Then I will see a list of songs
     */
    public function iWillSeeAListOfSongs()
    {
        $songs = $this->page->find('css', '.song-name');
        $counter = count($songs);
        if($counter > 0){
            //yay
        }else{
            var_dump($counter);
            throw new Exception();
        }
    }

    /**
     * @Given there is more than one song with a word
     */
    public function thereIsMoreThanOneSongWithAWord()
    {
        $session = $this->getSession();
            //hacky way of clicking word - since element is in HTMLCanvas, no way of getting it with js or by clicking coordinates
            //So we tell js to autoclick word if url contains getword
        $session->visit('http://localhost/SuperLyrics&getword=true');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();
        sleep(7);
        if (!$this->page->find('css', '.wordpage')->isVisible()){
            throw new Exception($this->page->find('css', '.wordpage')->getAttribute('style'));
        }

        $songs = $this->page->findAll('css', '.song-name');
        $GLOBALS['counter'] = count($songs);
        if($GLOBALS['counter'] > 1){
            //yay
        }else{
            var_dump($GLOBALS['counter']);
            throw new Exception('Less than 1 song!');
        }
    }

    /**
     * @Then the songs will be in ascending order
     */
    public function theSongsWillBeInAscendingOrder()
    {
        $words = $this->getSession()->getDriver()->evaluateScript("function(){ return isDescending(); }()");
        if(!$words){
            throw new Exception('Not descending!');
        }

    }

    /**
     * @Given I am on the song list page
     */
    public function iAmOnTheSongListPage()
    {
        $session = $this->getSession();
            //hacky way of clicking word - since element is in HTMLCanvas, no way of getting it with js or by clicking coordinates
            //So we tell js to autoclick word if url contains getword
        $session->visit('http://localhost/SuperLyrics&getword=true');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();
        sleep(7);
        if (!$this->page->find('css', '.wordpage')->isVisible()){
            throw new Exception($this->page->find('css', '.wordpage')->getAttribute('style'));
        }
    }

    /**
     * @When I click on a song
     */
    public function iClickOnASong()
    {
        if($this->page->find('css', '.song-name') == null){
            throw new Exception('No songs on song list!');
        }
        $songs = $this->page->find('css', '.song-name')->click();
    }

    /**
     * @Then I will be brought to the song lyrics page
     */
    public function iWillBeBroughtToTheSongLyricsPage()
    {
        if (!$this->page->find('css', '#songlyrics')->isVisible()){
            throw new Exception($this->page->find('css', '#songlyrics')->getAttribute('style'));
        }
    }

    /**
     * @Given I have selected a song from the song list
     */
    public function iHaveSelectedASongFromTheSongList()
    {
        $session = $this->getSession();
            //hacky way of clicking word - since element is in HTMLCanvas, no way of getting it with js or by clicking coordinates
            //So we tell js to autoclick word if url contains getword
        $session->visit('http://localhost/SuperLyrics&getword=true');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();
        sleep(7);
        if (!$this->page->find('css', '.wordpage')->isVisible()){
            throw new Exception($this->page->find('css', '.wordpage')->getAttribute('style'));
        }
        if($this->page->find('css', '.song-name') == null){
            throw new Exception('No songs on song list!');
        }
        $songs = $this->page->find('css', '.song-name')->click();
        sleep(2);
    }

    /**
     * @Then the song lyrics of that song will be displayed
     */
    public function theSongLyricsOfThatSongWillBeDisplayed()
    {
        $lyricsdiv = $this->page->find('css', '#songlyrics');
        if($lyricsdiv->getText() == ""){
            throw new Exception("Empty lyrics!");
        }
    }

    /**
     * @When I view the song lyrics
     */
    public function iViewTheSongLyrics()
    {
        $lyricsdiv = $this->page->find('css', '#songlyrics');
        if($lyricsdiv->getText() == ""){
            throw new Exception("Empty lyrics!");
        }
    }

    /**
     * @Then all instances of that word will be highlighted
     */
    public function allInstancesOfThatWordWillBeHighlighted()
    {
        $songs = $this->page->findAll('css', '.highlight-word');
        $GLOBALS['counter'] = count($songs);
        if($GLOBALS['counter'] > 1){
            //yay
        }else{
            var_dump($GLOBALS['counter']);
            throw new Exception('No Highlighted Words!');
        }
    }

    /**
     * @Given I have searched an artist
     */
    public function iHaveSearchedAnArtist()
    {
        // get sessions
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        if($this->page->findById('search') == null){
            throw new Exception('No Search');
        }
        $this->page->findById('search')->click();

    }

    /**
     * @When I view the word cloud page
     */
    public function iViewTheWordCloudPage()
    {
        //wait 7 seconds for word cloud page to loud
        sleep(7);
        if (!$this->page->find('css', '#canvas-container')->isVisible()) {
            throw new Exception($this->page->find('css', '.canvaspage')->getAttribute('style'));
        }
    }

    /**
     * @Then I will see a word cloud of colors
     */
    public function iWillSeeAWordCloudOfColors()
    {
        //crazy cool function that checks pixel values for color!!!
        $colors = $this->getSession()->getDriver()->evaluateScript("function(){ return checkColor(); }()");
        if(!$colors){
            throw new Exception($colors);
        }
    }

    /**
     * @Given I have selected another artist
     */
    public function iHaveSelectedAnotherArtist()
    {
        // get sessions
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();
        //wait 7 seconds for word cloud page to loud
        sleep(7);
        if (!$this->page->find('css', '#canvas-container')->isVisible()) {
            throw new Exception($this->page->find('css', '.canvaspage')->getAttribute('style'));
        }
//get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('nickelback');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();
        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        if($this->searchResult == null){
            throw new Exception();
        }else{
            $this->searchResult->click();
            sleep(1);
        }

    }

    /**
     * @When I click the add button
     */
    public function iClickTheAddButton()
    {
        if($this->page->findById('add') == null){
            throw new Exception();
        }
        $this->page->findById('add')->click();
        sleep(7);
    }

    /**
     * @Then I will see a merged word cloud
     */
    public function iWillSeeAMergedWordCloud()
    {
        $words = $this->getSession()->getDriver()->evaluateScript("function(){ return listOfWords; }()");
        if ($words[0][0] == "me" && $words[1][0] == "all") {
            //good!
        } else {
            throw new Exception();
        }
    }

    /**
     * @Given I have a word cloud
     */
    public function iHaveAWordCloud()
    {
        // get sessions
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();
        //wait 7 seconds for word cloud page to loud
        sleep(10);
        if (!$this->page->find('css', '#canvas-container')->isVisible()) {
            throw new Exception($this->page->find('css', '.canvaspage')->getAttribute('style'));
        }

    }

    /**
     * @When I click the share button
     */
    public function iClickTheShareButton()
    {
        if ($this->page->findById('share') == NULL) {
            throw new Exception();
        } else {
            $this->page->findById('share')->click();
        }

    }

    /**
     * @Then an image of the word cloud will be shared on Facebook
     */
    public function anImageOfTheWordCloudWillBeSharedOnFacebook()
    {
        $windowNames = $this->getSession()->getWindowNames();
        //It'll only open a new page if the image is valid, and FB share works due to their API, so an ingenious way to check if it works!
        if (count($windowNames) > 1) {
            $this->getSession()->switchToWindow($windowNames[1]);
        } else {
            throw new Exception();
        }
    }

    /**
     * @Given I am on the artist page
     */
    public function iAmOnTheArtistPage()
    {
        // get sessions
        $session = $this->getSession();
        $session->visit('http://localhost/SuperLyrics');
        $this->page = $session->getPage();

        //get search bar and search adele
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->setValue('adele');
        $GLOBALS['searchBar']     = $this->page->find('css', '#select2-searchbar-container')->click();
        $GLOBALS['searchBarText'] = $this->page->find('css', 'body > span > span > span.select2-search.select2-search--dropdown > input')->focus();


        sleep(2);

        //select adele as the result
        $this->searchResult = $this->page->find('css', '#select2-searchbar-results > li:nth-child(1)');
        $this->searchResult->click();
        sleep(1);
        $this->page->findById('search')->click();
        //wait 7 seconds for word cloud page to loud
        sleep(7);
        if (!$this->page->find('css', '#canvas-container')->isVisible()) {
            throw new Exception($this->page->find('css', '.canvaspage')->getAttribute('style'));
        }

    }

    /**
     * @When I view the word cloud
     */
    public function iViewTheWordCloud()
    {
        //check if the word cloud page is visible
        if (!$this->page->find('css', '#canvas-container')->isVisible()) {
            throw new Exception($this->page->find('css', '.canvaspage')->getAttribute('style'));
        }
    }

    /**
     * @Then the words' size will correspond to their frequency
     */
    public function theWordsSizeWillCorrespondToTheirFrequency()
    {
        $words = $this->getSession()->getDriver()->evaluateScript("function(){ return listOfWords; }()");
        if ($words[0][0] == "me") {
            //good!
        } else {
            throw new Exception($words[0][0]);
        }
    }


}
