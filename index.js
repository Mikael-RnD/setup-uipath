//const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path')
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

    // Download the specific version of the tool, e.g. as a tarball
    const downloadPath = await tc.downloadTool(getDownloadURL(version));
    const filename = path.basename(downloadPath);
    //console.log('Directories: ' + path.dirname());
    console.log('Filename: ' + filename);
    console.log('Download Path: ' + downloadPath);
    const pathToCLI = await tc.extractZip(downloadPath);

    console.log('Directories: ' + pathToCLI.dirname())
    // Extract the tarball/zipball onto host runner
    //const extract = await tc.downloadTool(getDownloadURL(version))
    //const pathToCLI = await extract(pathToTarball);
    
    // Logging!
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