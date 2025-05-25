# Tab Counter and Info Extension

## Overview

A Chrome extension that counts and displays information about open tabs in your browser. The extension shows the total number of tabs open and provides detailed information about each tab including title, URL, and the first link found on the page.

## Features

- Displays the total number of open tabs
- Shows a badge with the tab count on the extension icon
- Lists all open tabs with their titles and URLs
- Identifies the currently active tab
- Extracts the first link from each tab's content
- Updates in real-time as tabs are opened, closed, or updated

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and visible in your browser toolbar

## Project Structure

```
/
├── manifest.json       # Extension configuration
├── src/
│   ├── background/     # Background scripts
│   ├── popup/          # Popup UI scripts and styles
│   └── utils/          # Utility functions
├── styles/             # CSS styles
└── views/              # HTML views
```

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Local Development

To make changes to the extension:

1. Modify the files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Open a new tab or click on the extension icon to see your changes

## License

MIT
