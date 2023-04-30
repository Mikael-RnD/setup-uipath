//const path = require('path');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path');
const os = require('os');

function getDownloadURL(version,tool)
{
  const downloadURL = encodeURI('https://pkgs.dev.azure.com/uipath/Public.Feeds/_apis/packaging/feeds/UiPath-Official/nuget/packages/'+tool+'/versions/'+version+'/content');
  console.log("Download URL: " + downloadURL);
  return downloadURL;
}

function getTool(){
  var operatingSystem = os.type();
  console.log("Operating system: " + operatingSystem);
  if(operatingSystem.toLowerCase().includes("windows")){
    console.log("Retrieving Windows cli tool")
    return "UiPath.CLI.Windows";
  }
  else {
    return "UiPath.CLI";
  }
}

function getCliPath(extractPath){
  var fullPathToCli;
  console.log('extractPath: ' + extractPath);
  fullPathToCli = path.join(extractPath,'tools');
  console.log('uipcli path: ' + fullPathToCli);
  return fullPathToCli;
}

async function setup() {
  try {
    
    // Get version of tool to be installed
    const version = core.getInput('version');
    console.log(version);

    // Get CLI for the correct operating system
    const tool = getTool();

    // Download the specific version of the tool
    const downloadPath = await tc.downloadTool(getDownloadURL(version,tool));
    const filename = path.basename(downloadPath);
    console.log('Filename: ' + filename);

    console.log('Download Path: ' + downloadPath);

    var operatingSystem = os.type();
    console.log("Operating system: " + operatingSystem);
    if(operatingSystem.toLowerCase().includes("windows")){
      extractPath = tc.extractZip(downloadPath);
    }
    else {
      extractPath = tc.extractTar(downloadPath);
    }
    console.log('Tool extracted to ' + extractPath);

    const pathToCLI = getCliPath(extractPath); 
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