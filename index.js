const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { get } = require('http');

async function getLatestVersionFromFeed(tool) {
  console.log('Fetching latest version from feed for tool: ' + tool);
  const url = 'https://feeds.dev.azure.com/uipath/Public.Feeds/_apis/packaging/Feeds/UiPath-Official/packages?packageNameQuery=' + tool + '&isLatest=true&includeDescription=true&isRelease=true&isListed=true';
  const options = { method: 'GET' };

  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
  }

  const toolData = data.value.find(item => item.name === tool);
  if (!toolData || !toolData.versions) {
    throw new Error(`Tool "${tool}" not found or does not have versions.`);
  }

  const latestVersion = toolData.versions.find(item => item.isLatest === true);
  if (!latestVersion) {
    throw new Error(`No latest version found for tool "${tool}".`);
  }

  return latestVersion.version;
}

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

async function getVersion(tool) {
  var version = core.getInput('version');
  var platformVersion = core.getInput('platform-version');
  if (version == '') {
    switch(platformVersion) {
      case '25.4':
        version = '25.4.9337.28376';
        break;
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
        version = await getLatestVersionFromFeed(tool);
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
    // Get CLI for the correct operating system
    const tool = getTool();
    core.setOutput('cliToolName', tool);
    
    // Get version of tool to be installed
    const version = await getVersion(tool);
    core.setOutput('cliVersion', version);

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

    // Add alias for Linux (Ubuntu)
    if (os.type().toLowerCase().includes('linux')) {
      console.log('Creating uipcli symlink for Linux');
      const symlinkPath = path.join(pathToCLI, 'uipcli');
      const targetPath = path.join(pathToCLI, 'uipcli.dll');
      console.log('Creating symlink at ' + symlinkPath + ' pointing to ' + targetPath);

      // Create a symlink to run "dotnet uipcli.dll" as "uipcli"
      const symlinkCommand = `#!/bin/bash\ndotnet "${targetPath}" "$@"\n`;
      fs.writeFileSync(symlinkPath, symlinkCommand, { mode: 0o755 });
      console.log('Symlink created at ' + symlinkPath);

      // Add the symlink directory to PATH
      core.addPath(symlinkPath);
    }

  } catch (error) {
    console.error('Error: ' + error);
    core.setFailed(error.Message);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}