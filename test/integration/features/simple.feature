Feature: Simple hapi application

  Scenario: simple
    When the project is scaffolded
    Then the expected files are generated
    And the expected results are returned to the js scaffolder
