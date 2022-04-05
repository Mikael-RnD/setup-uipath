//const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
// const { getDownloadObject } = require('./lib/utils');

async function getDownloadURL(version)
{
  const downloadURL = "https://www.myget.org/F/uipath-dev/api/v2/package/UiPath.CLI/" + version
  console.log("Download URL: " + downloadURL);
  return downloadURL
}

async function setup() {
  try {
    // Get version of tool to be installed
    const version = core.getInput('version');
    console.log(version);


    // Download the specific version of the tool, e.g. as a tarball
    const pathToTarball = await tc.downloadTool(getDownloadURL(version));
    console.log(pathToTarball);

    // Extract the tarball/zipball onto host runner
    const extract = await tc.downloadTool(getDownloadURL(version))
    const pathToCLI = await extract(pathToTarball);
    
    // Logging!
    console.log(pathToCLI);

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