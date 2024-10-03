/**
 * This script checks the current version of the Centreon platform and compares it with the latest
 * available versions of the Centreon-web component from GitHub releases. If the current version is 
 * outdated (either a minor or major update is available), a banner is displayed at the top of the 
 * page, notifying the user about the available updates.
 * 
 * Key functionalities:
 * - Fetches the current Centreon-web version from the platform's API.
 * - Retrieves the latest Centreon-web releases from GitHub.
 * - Compares the current version with the latest available versions.
 * - Displays a notification banner if a newer version (minor or major) is available.
 */

/**
 * @typedef {Object} Version
 * @property {string} major - The major version string (e.g., "24.04")
 * @property {number} minor - The minor version number (e.g., 5)
 */

/**
 * Fetches the current Centreon instance version and returns the centreon-web component version.
 *
 * @returns {Promise<Version>} A promise resolving to an object representing the current Centreon version.
 */
async function getCurrentCentreonVersion() {
  try {
    const response = await fetch('./api/latest/platform/versions');
    if (!response.ok) {
      throw new Error(`HTTP Error! Statut : ${response.status}`);
    }
    const data = await response.json();
    return {
      major: `${data.web.major}.${data.web.minor}`,
      minor: data.web.fix
    };
  } catch (error) {
    console.error(`Failed to fetch Centreon version: ${error.message}`);
    throw error;
  }
}

/**
 * Converts a version string to a Version object containing major and minor values.
 * Expected format: "YY.MM.minor" (e.g., "24.04.5").
 *
 * @param {string} versionString - The version string to convert.
 * @returns {Version} The parsed version object.
 */
function parseVersionString(versionString) {
  var major = versionString.substring(0, 5);
  var minor = parseInt(versionString.substring(6));
  if( isNaN(minor) ) {
    throw new Error(`Wrong version format: ${versionString}`);
  }
  return { major, minor };
}

/**
 * Fetches the latest Centreon-web versions from GitHub and returns an object containing 
 * the highest minor versions for each major version.
 * 
 * @returns {Promise<Object<string, number>>} An object mapping major versions to their highest minor versions.
 */
async function fetchLatestCentreonWebVersions() {
  const apiURL = 'https://api.github.com/repos/centreon/centreon/releases';

  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }

    const releases = await response.json();
    const centreonWebReleases = releases.filter(release => {
      const releaseName = release.name.toLowerCase();
      return releaseName.includes('centreon-web') &&
        ((releaseName.includes('.04.') || releaseName.includes('.10.')));
    });

    const latestVersions = centreonWebReleases.reduce((acc, release) => {
      try {
        const { major, minor } = parseVersionString(release.name.substring(13));

        if (!acc[major] || minor > acc[major]) {
          acc[major] = minor;
        }
      } catch (error) {
      }

      return acc;
    }, {});

    if (Object.keys(latestVersions).length === 0) {
      throw new Error('No valid Centreon-web versions found');
    }

    return latestVersions;

  } catch (error) {
    console.error(`Failed to fetch versions from GitHub: ${error.message}`);
    throw error;
  }
}

/**
 * Displays a warning banner if the current Centreon version is outdated.
 *
 * @param {boolean} minorUpdateAvailable - Whether a minor update is available.
 * @param {boolean} majorUpdateAvailable - Whether a major update is available.
 * @param {Version} currentVersion - The current Centreon version.
 * @param {string} [latestMinorVersion] - The latest minor version available.
 * @param {string} [latestMajorVersion] - The latest major version available.
 */
function displayUpdateBanner(minorUpdateAvailable, majorUpdateAvailable, currentVersion, latestMinorVersion, latestMajorVersion) {
  if (!minorUpdateAvailable && !majorUpdateAvailable) return;

  const banner = document.createElement('div');
  banner.style.cssText = `
    color: white;
    background: darkred;
    height: 25px;
    text-align: center;
    font-weight: bold;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  `;

  let message = `Your Centreon version ${currentVersion.major}.${currentVersion.minor} is not up to date. `;
  if (minorUpdateAvailable) {
    message += `The latest minor version available is ${latestMinorVersion}. `;
  }
  if (majorUpdateAvailable) {
    message += `The latest major version available is ${latestMajorVersion}.`;
  }

  banner.textContent = message;
  document.body.prepend(banner);
}

/**
 * Compares the current Centreon version against the latest available versions.
 * If updates are available, displays a banner notification.
 */
async function checkCentreonWebVersion() {
  try {
    // Exit if the current page is not a Centreon instance
    if (!window.webpackChunkcentreon) {
      //return;
    }

    const currentVersion = await getCurrentCentreonVersion();
    const latestVersions = await fetchLatestCentreonWebVersions();

    // Check for minor updates
    const latestMinorForCurrentMajor = latestVersions[currentVersion.major];
    const minorUpdateAvailable = latestMinorForCurrentMajor > currentVersion.minor;
    const latestMinorVersion = minorUpdateAvailable ? `${currentVersion.major}.${latestMinorForCurrentMajor}` : null;

    // Check for major updates
    const majorUpdateAvailable = Object.keys(latestVersions).some(major => major > currentVersion.major);
    const latestMajorVersion = majorUpdateAvailable
      ? `${Math.max(...Object.keys(latestVersions))}.${latestVersions[Math.max(...Object.keys(latestVersions))]}`
      : null;

    // Display update banner if any updates are available
    displayUpdateBanner(minorUpdateAvailable, majorUpdateAvailable, currentVersion, latestMinorVersion, latestMajorVersion);

  } catch (error) {
    console.error(`Error checking Centreon version: ${error.message}`);
  }
}

if (typeof window !== 'undefined') {
  // Browser context

  // Run the check on page load
  window.onload = function () {
    setTimeout(checkCentreonWebVersion, 1000); // Delay by 1 seconds
  }
} else {
  // Jest test context

  // Export the function for testing
  module.exports = { parseVersionString, fetchLatestCentreonWebVersions };
};