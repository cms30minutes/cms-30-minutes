/**
 * Add menu-option for publishing a sheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CMS')
    .addItem('Publiser endringer', 'publish')
    .addToUi();
}

/**
 * Publish changes in the active sheet
 */
function publish() {
  var sheet = SpreadsheetApp.getActiveSheet();

  // Get the 2D array of cell values (CSV-data) from the active sheet
  var sheetData = sheet.getDataRange().getValues();

  var sheetName = sheet.getName();
  var filename = sheetName + ".json";

  var parsedData = transformTableDataToJson(sheetData);

  // Upload to external CDN / Storage
  upload(filename, parsedData);
}

/**
 * Transforms table data (2D array of cell values) to an array of JSON objects, 
 * where the columns of the first row is treated as keys for that column in the other rows. 
 */
function transformTableDataToJson(data) {
  var keys = data.slice(0, 1)[0];

  return data
    .slice(1)
    .map((x) =>
      x.reduce((acc, cur, i) => {
        if (cur === "") return acc;
        acc[keys[i]] = cur;
        return acc;
      }, {}));
}

/**
 *  Uploads the data of a sheet to a file somewhere in the cloud (in this case, github).
 */
function upload(filename, data) {
  var existingFile = null;

  try {
    existingFile = JSON.parse(UrlFetchApp.fetch("https://api.github.com/repos/cms30minutes/cms-30-minutes-cdn/contents/" + filename, {
      method: "get",
      headers: {
        'Authorization': `Bearer ${getGithubApiToken()}`,
        'Content-Type': 'application/json'
      }
    }));
  } catch (e) { }

  var githubData = JSON.stringify({
    "message": "Update json file",
    "sha": existingFile?.sha,
    "content": Utilities.base64Encode(JSON.stringify(data), Utilities.Charset.UTF_8),
  });


  UrlFetchApp.fetch("https://api.github.com/repos/cms30minutes/cms-30-minutes-cdn/contents/" + filename, {
    method: "put",
    payload: githubData,
    headers: {
      'Authorization': `Bearer ${getGithubApiToken()}`,
      'Content-Type': 'application/json'
    }
  });
}

function getGithubApiToken() {
  return "TOKEN HERE";
}
