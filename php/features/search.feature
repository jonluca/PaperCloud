Feature: Search
    As a user of PaperCloud, one needs to be able to search for papers in the IEEE and ACM database.

    @nosearch
    Scenario: No Search Query has been made
        Given the search bar has nothing in it
        When I click on the Search Button
        Then the button will be deactivated

    @loadingbar
    Scenario: Loading Bar
        Given I have searched for an author
        When I click search
        Then a loading bar will appear

    @prevsearch
    Scenario: See previous searches
        Given I have searched for something before
        When I click on the history list
        Then The previously searched artist will be there

    @search-keyword
    Scenario: Search
        Given I have selected a search keyword
        When I click the Search button
        Then I will be brough to the papercloud page

    @search-author
    Scenario: Search
        Given I have selected a search lastname
        When I click the Search button
        Then I will be brough to the papercloud page
