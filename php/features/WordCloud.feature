Feature: Word Cloud
    As a user, I want to be able to view a word cloud of all the lyrics
    
    @display
    Scenario: Display Word Cloud
        Given I have searched for an author's last name
        When I view the word cloud page
        Then I will see a word cloud of the top X papers

    @display
    Scenario: Download image Word Cloud
        Given I have a valid search and paper cloud
        When I click save as image
        Then the image download will begin

    @export-pdf
    Scenario: Export list of papers as pdf
        Given I have a valid search and paper cloud
        When I click export as pdf
        Then I will get a download of all papers as pdf

    @export-txt
    Scenario: Export list of papers as txt
        Given I have a valid search and paper cloud
        When I click export as txt
        Then I will get a download of all papers as txt

    @download-library
    Scenario: Download from digital library
        Given I have a valid search and paper cloud
        When I click download from library for a paper
        Then I will get redirected to the library page for that paper
 
    @bibtex
    Scenario: See bibtex of paper
        Given I have a valid search and paper cloud
        When I click view bibtex for a paper
        Then I will get redirected to its corresponding bibtex view

    @abstract
    Scenario: See abstract of paper
        Given I am on the paper list page
        When I click the title of a paper
        Then I will get be shown the abstract
