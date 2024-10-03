# Centreon Chrome Extension

Centreon Chrome Extension is a Google Chrome extension designed to enhance the UI and UX of the Centreon platform. It offers real-time version checks and notifications, ensuring users are always aware when updates are available for their Centreon web instance. This helps maintain platform security, performance, and access to the latest features.

## Features

- Version Monitoring: Automatically checks the current version of the Centreon web platform.
- GitHub Release Integration: Fetches the latest Centreon-web releases from GitHub and compares them with the current version.
- Update Notification Banner: Displays a banner warning on top of the Centreon UI if there are minor or major updates available, keeping users informed about potential upgrades.
- Seamless UI Enhancement: Runs in the background without affecting your existing workflows, while providing an enhanced user experience.

## How It Works

The extension is triggered when a Centreon web page is loaded.
It verifies if the webpage is a Centreon instance by checking for specific variables.
The extension fetches the current version of the Centreon-web component using the platform's API.
It then retrieves the latest available Centreon-web versions from the GitHub releases API.
If the current version is outdated, a banner is displayed at the top of the webpage, alerting the user of both minor and major updates.
The banner provides direct information about the latest available versions, ensuring users know when to update.

## Installation

### From the Chrome Web Store

_Not yet available_

### Manual Installation

1. Clone this repository to your local machine.
```bash
git clone https://github.com/Nohzoh/centreon-chrome-extension.git
```
1. Open Chrome and go to chrome://extensions/.
1. Enable Developer Mode in the top-right corner.
1. Click the Load unpacked button and select the folder where you cloned the repository.
1. The extension should now appear in your list of installed extensions.

## Usage

Once installed, the extension will automatically run in the background whenever you visit a Centreon instance. The extension checks for updates and will display a banner on top of the page if your current Centreon version is outdated.

No further action is required from the user; the extension is designed to work seamlessly and keep you informed.

## Troubleshooting

- No Banner Displayed: If no banner is displayed, it could mean that your Centreon version is up-to-date, or the page you are visiting is not recognized as a Centreon instance.
- API Issues: Ensure you have internet access, as the extension relies on both the Centreon API and GitHub API to fetch version information.
- Permissions: The extension requires permission to read the contents of the Centreon platform to access its version information. No personal data is collected or stored.

## Development

If you'd like to contribute to the project or modify it, follow these steps:

1. Clone the repository and make your changes in the source code.
1. To test your changes, load the unpacked extension in Chrome by following the Manual Installation steps above.
1. Reload the extension after making changes to see the effect.

## Key Files:
- content.js: Contains the logic for checking versions, fetching release data from GitHub, and displaying the banner.
- manifest.json: Defines the extension's metadata, permissions, and background scripts.
- background.js: Handles any background tasks the extension might need.
- popup.html & popup.js: Files for the extension's popup UI (if applicable).

## Contribution

Feel free to open issues, create pull requests, or submit feature requests. Contributions to improve the extension are always welcome!
