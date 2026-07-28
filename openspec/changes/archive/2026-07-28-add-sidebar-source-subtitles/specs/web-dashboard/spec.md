## ADDED Requirements

### Requirement: Wiki sidebar title transformation
The dashboard SHALL display each Project Wiki sidebar page using a human-readable Sentence Case title derived from its SNAKE_CASE filename, without displaying the source filename separately.

#### Scenario: Displaying a root master file
- **WHEN** the wiki IPC returns `ARCHITECTURE.md`
- **THEN** the sidebar displays `Architecture` without a separate filename subtitle

#### Scenario: Displaying a wiki MDX file
- **WHEN** the wiki IPC returns `USER_MANUAL.mdx`
- **THEN** the sidebar displays `User Manual` without a separate filename subtitle
