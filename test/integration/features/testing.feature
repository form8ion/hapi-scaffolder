Feature: Testing

  Scenario: Project will be integration tested
    Given the project will be integration tested
    When the project is scaffolded
    Then cucumber is configured

  Scenario: Project will not be integration tested
    Given the project will not be integration tested
    When the project is scaffolded
    Then cucumber is not configured
