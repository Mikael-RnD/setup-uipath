//const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path')
const fs = require('fs')
// const { getDownloadObject } = require('./lib/utils');

function getDownloadURL(version)
{
  const downloadURL = encodeURI('https://www.myget.org/F/uipath-dev/api/v2/package/UiPath.CLI/' + version);
  console.log("Download URL: " + downloadURL);
  return downloadURL;
}

async function setup() {
  try {
    // Get version of tool to be installed
    const version = core.getInput('version');
    console.log(version);

    // Download the specific version of the tool
    const downloadPath = await tc.downloadTool(getDownloadURL(version));
    const filename = path.basename(downloadPath);
    console.log('Filename: ' + filename);

    console.log('Download Path: ' + downloadPath);
    const extractPath = await tc.extractZip(downloadPath);
    console.log('Tool extracted. ');

    const pathToCLI = path.join(extractPath,'lib','net461'); 
    console.log('Adding ' + pathToCLI + ' to PATH');
    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI);

  } catch (error) {
    core.setFailed(error.Message);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}