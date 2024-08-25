Feature: Specify number of events
    Scenario: User does not type in the number-of-events field
        Given I am an user
        When I look at the events list
        Then I should see a list of 32 events

    Scenario: User types a number in the number of events field
        Given I am an user
        And I type a number in the number of events field
        When I change the number of events field
        Then I should see the specified number of events shown