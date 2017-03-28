Feature: Word Cloud
    As a user, I want to be able to view a word cloud of all the lyrics
    
    @display
    Scenario: Display Word Cloud
        Given I have searched for an author's last name
        When I view the word cloud page
        Then I will see a word cloud of colors

    @addart
    Scenario: Add Artist
        Given I have selected another artist
        When I click the add button
        Then I will see a merged word cloud

    @share
    Scenario: Share Word Cloud
        Given I have a word cloud
        When I click the share button
        Then an image of the word cloud will be shared on Facebook

    @wordsize
    Scenario: Word Size
        Given I am on the artist page
        When I view the word cloud
        Then the words' size will correspond to their frequency
