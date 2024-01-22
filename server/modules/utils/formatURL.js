/**
 * Formats input URL to a static format:
 *
 * &nbsp;&nbsp;- "/" used to indicate nesting structure
 * &nbsp;&nbsp;- always starts and ends by "/"
 *
 * @param {string} url the URL to format .
 * @returns The formated URL.
 */
function formatURL(url) {
  url = url.replace(new RegExp("\\\\", "g"), "/");

  if (url[0] != "/") url = "/" + url;
  if (url[url.length != "/"]) url += "/";

  return url;
}

module.exports = formatURL;
