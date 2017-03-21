Feature: Song Lyrics
    As a user I want to be able to view the lyrics of a song

    @seelyrics
    Scenario: Lyrics
        Given I have selected a song from the song list
        When I view the song lyrics
        Then the song lyrics of that song will be displayed
        
    @highlight
    Scenario: Highlight word
        Given I have selected a song from the song list
        When I view the song lyrics
        Then all instances of that word will be highlighted
