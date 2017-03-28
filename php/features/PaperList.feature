Feature: PaperList
    As I user I want to be able to click on a word and see a list of papers it appears in

    @selectword
    Scenario: Select Word
        Given I have clicked on a word
        When I view the page
        Then I will see a list of papers it appears in
        
    @papers
    Scenario: Word appears in multiple papers
        Given there is more than one paper that mentions a word
        When I view the page
        Then all the papers which mention that word will be listed

    @author
    Scenario: 
        Given I am on the paper pages
        When I click on an author
        Then a new search will begin querying that author

    @conference
    Scenario: 
        Given I am on the paper pages
        When I click on it's conference
        Then the page will display papers from that conference
