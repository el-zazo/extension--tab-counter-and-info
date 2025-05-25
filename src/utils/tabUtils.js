/**
 * Tab Counter Extension - Utility functions for tab operations
 *
 * This module contains utility functions for working with browser tabs,
 * including counting, querying, and processing tab information.
 */

/**
 * Gets the current tab count from all windows
 * @returns {Promise<number>} The total number of open tabs
 */
const getTabCount = async () => {
  try {
    const tabs = await chrome.tabs.query({});
    return tabs.length;
  } catch (error) {
    console.error("Error getting tab count:", error);
    return 0;
  }
};

/**
 * Updates the extension badge with the current tab count
 * @param {number} count - The number to display on the badge
 * @returns {Promise<void>}
 */
const updateBadge = async (count) => {
  try {
    await chrome.action.setBadgeText({ text: count.toString() });
    await chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });
  } catch (error) {
    console.error("Error updating badge:", error);
  }
};

/**
 * Stores the tab count in local storage
 * @param {number} count - The tab count to store
 * @returns {Promise<void>}
 */
const storeTabCount = async (count) => {
  try {
    await chrome.storage.local.set({ tabCount: count });
  } catch (error) {
    console.error("Error storing tab count:", error);
  }
};

/**
 * Gets the first link from a tab's content
 * @param {number} tabId - The ID of the tab to query
 * @returns {Promise<string|null>} The first link found or null if none
 */
const getFirstLink = async (tabId) => {
  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        const links = document.getElementsByTagName("a");
        return links.length > 0 ? links[0].href : null;
      },
    });
    return result[0]?.result || null;
  } catch (error) {
    console.error(`Error getting first link from tab ${tabId}:`, error);
    return null;
  }
};

// Export the utility functions
export { getTabCount, updateBadge, storeTabCount, getFirstLink };
