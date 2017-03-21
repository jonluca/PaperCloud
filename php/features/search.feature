Feature: Search
    As a user of SuperLyrics, one needs to be able to search for artists.

    Scenario: No Artist Selected
        Given the search bar has no selected artist
        When I click on the Search Button
        Then the button will be deactivated

    Scenario: Auto Search
        Given the search bar has two or more letters
        When I type another letter
        Then a Spotify API call will return matching artists

    Scenario: Select Artist
        Given a drop down list of artists
        When I click on an artist
        Then the artist will be selected in the search bar

    Scenario: Search
        Given I have selected an artist
        When I click the Search button
        Then I will be brough to the wordcloud page
