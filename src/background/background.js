/**
 * Tab Counter Extension - Background Script
 *
 * This background script manages the tab counting functionality and
 * communicates with the popup. It initializes the tab counter, listens for
 * tab events, and updates the badge and storage accordingly.
 */

import { getTabCount, updateBadge, storeTabCount } from "../utils/tabUtils.js";

/**
 * TabCounter class to manage tab counting functionality
 */
class TabCounter {
  constructor() {
    this.tabCount = 0;
    this.initialize();
  }

  /**
   * Initialize the tab counter
   */
  async initialize() {
    try {
      // Set up initial tab count
      await this.updateCount();

      // Set up event listeners
      this.setupEventListeners();

      // Set up message listeners
      this.setupMessageListeners();

      console.log("Tab Counter Background script initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Tab Counter:", error);
    }
  }

  /**
   * Update the tab count and related UI elements
   */
  async updateCount() {
    try {
      // Get current tab count
      this.tabCount = await getTabCount();

      // Update badge with current count
      await updateBadge(this.tabCount);

      // Store count in local storage for popup access
      await storeTabCount(this.tabCount);
    } catch (error) {
      console.error("Error updating tab count:", error);
    }
  }

  /**
   * Set up event listeners for tab events
   */
  setupEventListeners() {
    // Use arrow functions to preserve 'this' context
    chrome.tabs.onCreated.addListener(() => this.updateCount());
    chrome.tabs.onRemoved.addListener(() => this.updateCount());
    chrome.tabs.onReplaced.addListener(() => this.updateCount());
  }

  /**
   * Set up message listeners for communication with popup
   */
  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      try {
        if (message.action === "getTabCount") {
          sendResponse({ tabCount: this.tabCount });
        }
      } catch (error) {
        console.error("Error handling message:", error);
        sendResponse({ error: error.message });
      }
      return true; // Keep the message channel open for async response
    });
  }
}

// Initialize the tab counter when the extension loads
const tabCounter = new TabCounter();
