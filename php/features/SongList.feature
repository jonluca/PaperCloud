Feature: SongList
    As I user I want to be able to click on a word and see a list of songs with that word in it.

    @selectword
    Scenario: Select Word
        Given I have clicked on a word
        When I view the page
        Then I will see a list of songs
        
    @songs
    Scenario: More than one song
        Given there is more than one song with a word
        When I view the page
        Then the songs will be in ascending order

    @selectsong
    Scenario: Select a Song
        Given I am on the song list page
        When I click on a song
        Then I will be brought to the song lyrics page
