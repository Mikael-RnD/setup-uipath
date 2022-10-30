//const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path')

function getDownloadURL(version)
{
  const downloadURL = encodeURI('https://pkgs.dev.azure.com/uipath/Public.Feeds/_apis/packaging/feeds/UiPath-Official/nuget/packages/UiPath.CLI/versions/'+version+'/content');
  console.log("Download URL: " + downloadURL);
  return downloadURL;
}

function getCliPath(version,extractPath){
  console.log('Version ' + version);
  const versionParts = version.split('.');
  console.log(versionParts[0]);
  var fullPathToCli;
  if(parseInt(versionParts[0]) > 21){
    fullPathToCli = path.combine(extractPath,'tools');
    console.log('uipcli path: ' + fullPathToCli);
    return fullPathToCli;
  } else {
    fullPathToCli = path.combine(extractPath,'lib','net461');
    console.log('uipcli path: ' + fullPathToCli);
    return fullPathToCli;
  }
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
    console.log('Tool extracted to ' + extractPath);

    const pathToCLI = getCliPath(version,extractPath); 
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