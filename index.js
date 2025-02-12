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
    console.log("Retrieving UiPath.CLI.Windows");
    return "UiPath.CLI.Windows";
  }
  else {
    console.log("Retrieving UiPath.CLI");
    return "UiPath.CLI";
  }
}

function getVersion() {
  var version = core.getInput('version');
  var platformVersion = core.getInput('platform-version');
  if (version == '') {
    switch(platformVersion) {
      case '24.12':
        version = '24.12.9166.24491';
        break;
      case '24.10':
        version = '24.10.9050.17872';
        break;
      case '23.10':
        version = '23.10.9076.19285';
        break;
      case '23.4':
        version = '23.4.8951.9936';
        break;
      case '22.10':
        version = '22.10.8467.18097';
        break;
      default:
        version = '24.12.9166.24491';
        break;
    }
  }
  console.log('Using CLI Version: ' + version);
  return version;  
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
    const version = getVersion();

    // Get CLI for the correct operating system
    const tool = getTool();

    // Download the specific version of the tool
    const downloadPath = await tc.downloadTool(getDownloadURL(version,tool));
    const filename = path.basename(downloadPath);
    console.log('Filename: ' + filename);

    console.log('Download Path: ' + downloadPath);
    const extractPath = await tc.extractZip(downloadPath);
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