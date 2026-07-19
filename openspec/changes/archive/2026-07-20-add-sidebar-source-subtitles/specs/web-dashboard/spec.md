## ADDED Requirements

### Requirement: Wiki sidebar source subtitles
The dashboard SHALL display the source filename returned for every Project Wiki sidebar page as a subtitle below its page title. The subtitle SHALL use visually muted styling and SHALL preserve the filename extension.

#### Scenario: Displaying a root master file
- **WHEN** the wiki API returns `ARCHITECTURE.md`
- **THEN** the sidebar shows the page title and `ARCHITECTURE.md` as its muted subtitle

#### Scenario: Displaying a wiki MDX file
- **WHEN** the wiki API returns `USER_MANUAL.mdx`
- **THEN** the sidebar shows the page title and `USER_MANUAL.mdx` as its muted subtitle
