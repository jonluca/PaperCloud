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
    Scenario: Search based on author
        Given I am on the paper list page
        When I click on an author
        Then a new search will begin querying that author

    @conference
    Scenario: View papers within same conference
        Given I am on the paper list page
        When I click on it's conference
        Then the page will display papers from that conference

    @highlight
    Scenario: Words in abstract are highlighted
        Given I have a valid search and paper cloud
        When I click the title of a paper
        Then the words in the abstract will be highlighted

    @download-highlight
    Scenario: Words in abstract are highlighted in the pdf download
        Given I have clicked the title of a paper
        When I click download as PDF
        Then the occurences of the searched word in the pdf will be highlighted

    @subset
    Scenario: Select subset of papers to create new word cloud
        Given I am on the paper list page
        When I select a subset of papers
        Then a new word cloud will appear with the selected papers as its source