/**
 * Tab Counter Extension - Popup Script
 *
 * This script handles the popup UI functionality, including displaying
 * the tab count and detailed information about each open tab.
 */

import { getFirstLink } from "../utils/tabUtils.js";

/**
 * TabInfoDisplay class to manage the popup UI
 */
class TabInfoDisplay {
  constructor() {
    // DOM element references
    this.tabCountElement = document.getElementById("tab-count");
    this.tabsContainer = document.getElementById("tabs-container");

    // Initialize the popup
    this.initialize();
  }

  /**
   * Initialize the popup display
   */
  initialize() {
    try {
      // Update tab info when popup is opened
      this.updateTabInfo();

      // Set up event listeners for real-time updates
      this.setupEventListeners();
    } catch (error) {
      console.error("Error initializing popup:", error);
      this.showError("Failed to initialize popup");
    }
  }

  /**
   * Update the tab information displayed in the popup
   */
  async updateTabInfo() {
    try {
      // Update the count from storage
      await this.updateTabCount();

      // Get and display detailed tab information
      await this.displayTabDetails();
    } catch (error) {
      console.error("Error updating tab info:", error);
      this.showError("Failed to update tab information");
    }
  }

  /**
   * Update the tab count display from storage
   */
  async updateTabCount() {
    try {
      const result = await chrome.storage.local.get(["tabCount"]);
      if (result.tabCount !== undefined) {
        this.tabCountElement.textContent = result.tabCount;
      }
    } catch (error) {
      console.error("Error getting tab count from storage:", error);
      throw error;
    }
  }

  /**
   * Display detailed information about each open tab
   */
  async displayTabDetails() {
    try {
      // Clear existing tab elements
      this.tabsContainer.innerHTML = "";

      // Get all tabs
      const tabs = await chrome.tabs.query({});

      // Get the current active tab
      const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTabId = activeTabs[0]?.id;

      // Process each tab
      for (const tab of tabs) {
        await this.createTabElement(tab, activeTabId);
      }
    } catch (error) {
      console.error("Error displaying tab details:", error);
      throw error;
    }
  }

  /**
   * Create and append a tab element to the container
   * @param {object} tab - The tab object
   * @param {number} activeTabId - The ID of the active tab
   */
  async createTabElement(tab, activeTabId) {
    try {
      // Create tab element
      const tabElement = document.createElement("div");
      tabElement.className = `tab-item${tab.id === activeTabId ? " active-tab" : ""}`;

      // Create and add title element
      const title = document.createElement("span");
      title.className = "tab-title";
      title.textContent = tab.title;
      tabElement.appendChild(title);

      // Create and add URL element
      const url = document.createElement("span");
      url.className = "tab-url";
      url.textContent = tab.url;
      tabElement.appendChild(url);

      // Try to get the first link from the tab
      try {
        const firstLinkUrl = await getFirstLink(tab.id);

        // Create and add first link element
        const firstLink = document.createElement("span");
        firstLink.className = "tab-first-link";
        firstLink.textContent = firstLinkUrl || "No links found";
        tabElement.appendChild(firstLink);
      } catch (error) {
        // Handle error getting first link
        const firstLink = document.createElement("span");
        firstLink.className = "tab-first-link tab-error";
        firstLink.textContent = "Unable to access page content";
        tabElement.appendChild(firstLink);
      }

      // Add the tab element to the container
      this.tabsContainer.appendChild(tabElement);
    } catch (error) {
      console.error(`Error creating element for tab ${tab.id}:`, error);
    }
  }

  /**
   * Set up event listeners for tab events
   */
  setupEventListeners() {
    // Use arrow functions to preserve 'this' context
    chrome.tabs.onCreated.addListener(() => this.updateTabInfo());
    chrome.tabs.onRemoved.addListener(() => this.updateTabInfo());
    chrome.tabs.onReplaced.addListener(() => this.updateTabInfo());
    chrome.tabs.onUpdated.addListener(() => this.updateTabInfo());
    chrome.tabs.onActivated.addListener(() => this.updateTabInfo());
  }

  /**
   * Display an error message in the popup
   * @param {string} message - The error message to display
   */
  showError(message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    // Clear container and show error
    this.tabsContainer.innerHTML = "";
    this.tabsContainer.appendChild(errorElement);
  }
}

// Initialize the popup when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    new TabInfoDisplay();
  } catch (error) {
    console.error("Failed to initialize TabInfoDisplay:", error);
    document.body.innerHTML = `<div class="error-message">Failed to load popup: ${error.message}</div>`;
  }
});
