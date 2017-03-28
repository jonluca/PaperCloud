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
     * @Given I have clicked on a word
     */
    public function iHaveClickedOnAWord()
    {
        throw new PendingException();
    }

    /**
     * @When I view the page
     */
    public function iViewThePage()
    {
        throw new PendingException();
    }

    /**
     * @Then I will see a list of papers it appears in
     */
    public function iWillSeeAListOfPapersItAppearsIn()
    {
        throw new PendingException();
    }

    /**
     * @Given there is more than one paper that mentions a word
     */
    public function thereIsMoreThanOnePaperThatMentionsAWord()
    {
        throw new PendingException();
    }

    /**
     * @Then all the papers which mention that word will be listed
     */
    public function allThePapersWhichMentionThatWordWillBeListed()
    {
        throw new PendingException();
    }

    /**
     * @Given I am on the paper pages
     */
    public function iAmOnThePaperPages()
    {
        throw new PendingException();
    }

    /**
     * @When I click on an author
     */
    public function iClickOnAnAuthor()
    {
        throw new PendingException();
    }

    /**
     * @Then a new search will begin querying that author
     */
    public function aNewSearchWillBeginQueryingThatAuthor()
    {
        throw new PendingException();
    }

    /**
     * @When I click on it's conference
     */
    public function iClickOnItSConference()
    {
        throw new PendingException();
    }

    /**
     * @Then the page will display papers from that conference
     */
    public function thePageWillDisplayPapersFromThatConference()
    {
        throw new PendingException();
    }

    /**
     * @Given the search bar has nothing in it
     */
    public function theSearchBarHasNothingInIt()
    {
        throw new PendingException();
    }

    /**
     * @When I click on the Search Button
     */
    public function iClickOnTheSearchButton()
    {
        throw new PendingException();
    }

    /**
     * @Then the button will be deactivated
     */
    public function theButtonWillBeDeactivated()
    {
        throw new PendingException();
    }

    /**
     * @Given I have searched for an author
     */
    public function iHaveSearchedForAnAuthor()
    {
        throw new PendingException();
    }

    /**
     * @When I click search
     */
    public function iClickSearch()
    {
        throw new PendingException();
    }

    /**
     * @Then a loading bar will appear
     */
    public function aLoadingBarWillAppear()
    {
        throw new PendingException();
    }

    /**
     * @Given I have searched for something before
     */
    public function iHaveSearchedForSomethingBefore()
    {
        throw new PendingException();
    }

    /**
     * @When I click on the history list
     */
    public function iClickOnTheHistoryList()
    {
        throw new PendingException();
    }

    /**
     * @Then The previously searched artist will be there
     */
    public function thePreviouslySearchedArtistWillBeThere()
    {
        throw new PendingException();
    }

    /**
     * @Given I have selected a search keyword
     */
    public function iHaveSelectedASearchKeyword()
    {
        throw new PendingException();
    }

    /**
     * @When I click the Search button
     */
    public function iClickTheSearchButton()
    {
        throw new PendingException();
    }

    /**
     * @Then I will be brough to the papercloud page
     */
    public function iWillBeBroughToThePapercloudPage()
    {
        throw new PendingException();
    }

    /**
     * @Given I have selected a search lastname
     */
    public function iHaveSelectedASearchLastname()
    {
        throw new PendingException();
    }

    /**
     * @Given I have searched for an author's last name
     */
    public function iHaveSearchedForAnAuthorSLastName()
    {
        throw new PendingException();
    }

    /**
     * @When I view the word cloud page
     */
    public function iViewTheWordCloudPage()
    {
        throw new PendingException();
    }

    /**
     * @Then I will see a word cloud of colors
     */
    public function iWillSeeAWordCloudOfColors()
    {
        throw new PendingException();
    }

    /**
     * @Given I have selected another artist
     */
    public function iHaveSelectedAnotherArtist()
    {
        throw new PendingException();
    }

    /**
     * @When I click the add button
     */
    public function iClickTheAddButton()
    {
        throw new PendingException();
    }

    /**
     * @Then I will see a merged word cloud
     */
    public function iWillSeeAMergedWordCloud()
    {
        throw new PendingException();
    }

    /**
     * @Given I have a word cloud
     */
    public function iHaveAWordCloud()
    {
        throw new PendingException();
    }

    /**
     * @When I click the share button
     */
    public function iClickTheShareButton()
    {
        throw new PendingException();
    }

    /**
     * @Then an image of the word cloud will be shared on Facebook
     */
    public function anImageOfTheWordCloudWillBeSharedOnFacebook()
    {
        throw new PendingException();
    }

    /**
     * @Given I am on the artist page
     */
    public function iAmOnTheArtistPage()
    {
        throw new PendingException();
    }

    /**
     * @When I view the word cloud
     */
    public function iViewTheWordCloud()
    {
        throw new PendingException();
    }

    /**
     * @Then the words' size will correspond to their frequency
     */
    public function theWordsSizeWillCorrespondToTheirFrequency()
    {
        throw new PendingException();
    }
}
