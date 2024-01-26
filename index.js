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

async function unpackTool(tool, downloadPath) {
  var extractPath;
  console.log('Download Path: ' + downloadPath);
  if(tool == "UiPath.CLI.Windows") {
    extractPath = await tc.extractZip(downloadPath);
  }
  else if(tool == "UiPath.CLI") {
    extractPath = await tc.extractTar(downloadPath);
  }
  else {
    throw new Error("Invalid version of the UiPath CLI tool");
  }
  console.log('Tool extracted to ' + extractPath);
  return extractPath;
}

async function setup() {
  try {
    
    // Get version of tool to be installed
    const version = core.getInput('version');
    console.log(version);

    // Get CLI for the correct operating system
    const tool = getTool();

    // Download the specific version of the tool
    const downloadPath = await tc.downloadTool(getDownloadURL(version, tool));
    const filename = path.basename(downloadPath);
    console.log('Filename: ' + filename);

    extractPath = await unpackTool(tool, downloadPath);
    
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