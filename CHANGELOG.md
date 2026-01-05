
# Changelog

All notable changes to the Sun AI Agency Platform will be documented in this file.

## [Unreleased]

### Added
- **Edge Functions**: Added Fintech, Healthcare, and Manufacturing blueprints to `generate-questions`.
- **Edge Functions**: Added logic to `generate-questions` to ask clarifying questions for generic industries (e.g., "Technology", "Services").
- **Docs**: Created `progress-tracker.md` to track wizard and dashboard development status.

### Changed
- **Edge Functions**: Updated `analyze-business` prompt to specifically instruct Google Search to look for 'About Us' and 'Product/Service' pages for better industry niche detection.
- **Edge Functions**: Refined `system_hint` generation in `generate-questions` to ensure specific snake_case tags (e.g., `kyc_auto` vs `growth`).
- **Frontend**: Verified `Other` option exists in Wizard Step 1 industry list.

### Fixed
- **Edge Functions**: Improved prompt instruction for `analyze-business` to avoid generic industry classifications.
