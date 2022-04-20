function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("CMS")
    .addItem("Publiser", "onPublish")
    .addToUi();
}

function onPublish() {
  var sheet = SpreadsheetApp.getActiveSheet();

  var sheetData = sheet.getDataRange().getValues();
  var jsonData = transformTableDataToJson(sheetData);

  var filename = sheet.getName() + ".json";

  upload(filename, jsonData);
}




var githubUsername = "cms30minutes";
var githubRepo = "cms-30-minutes-cdn";
var githubToken = "YOUR TOKEN HERE";

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
    existingFile = JSON.parse(UrlFetchApp.fetch(`https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/${filename}`, {
      method: "get",
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json'
      }
    }));
  } catch (e) { }

  var githubData = JSON.stringify({
    "message": "Update json file",
    "sha": existingFile?.sha,
    "content": Utilities.base64Encode(JSON.stringify(data), Utilities.Charset.UTF_8),
  });


  UrlFetchApp.fetch(`https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/${filename}`, {
    method: "put",
    payload: githubData,
    headers: {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json'
    }
  });
}
