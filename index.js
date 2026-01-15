const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');
const os = require('os');

function getTool(){
  const operatingSystem = os.type().toLowerCase();
  console.log("Operating system: " + operatingSystem);
  
  if(operatingSystem.includes("windows")){
    console.log("Installing UiPath.CLI.Windows");
    return "UiPath.CLI.Windows";
  }
  if(operatingSystem.includes("linux")) {
    console.log("Installing UiPath.CLI.Linux");
    return "UiPath.CLI.Linux";
  }
  if(operatingSystem.includes("darwin")) {
    console.log("Installing UiPath.CLI.macOS");
    return "UiPath.CLI.macOS";
  }
  throw new Error(`Unsupported operating system: ${operatingSystem}`);
}

function getVersion() {
  const version = core.getInput('version');
  const platformVersion = core.getInput('platform-version');
  
  if (version) {
    console.log('Using specified CLI Version: ' + version);
    return version;
  }
  
  // Map platform-version to specific CLI versions
  const versionMap = {
    '25.10': '25.10.5',
    '25.4': '25.4.9414.17608',
    '24.12': '24.12.9166.24491',
    '24.10': '24.10.9050.17872',
    '23.10': '23.10.9076.19285',
    '23.4': '23.4.8951.9936',
    '22.10': '22.10.8467.18097'
  };
  
  if (platformVersion && versionMap[platformVersion]) {
    console.log(`Using CLI Version for platform ${platformVersion}: ${versionMap[platformVersion]}`);
    return versionMap[platformVersion];
  }
  
  console.log('Using latest CLI version');
  return null; // Will install latest
}

async function installUiPathCLI(toolPackage, version) {
  try {
    console.log(`Installing ${toolPackage}${version ? ` version ${version}` : ' (latest)'}...`);
    
    const args = ['tool', 'install', '--global', toolPackage];
    
    if (version) {
      args.push('--version', version);
    }
    
    await exec.exec('dotnet', args);
    console.log(`${toolPackage} installed successfully`);
  } catch (error) {
    console.error(`Failed to install UiPath CLI: ${error.message}`);
    throw error;
  }
}

async function setup() {
  try {
    const tool = getTool();
    const version = getVersion();
    
    core.setOutput('cliToolName', tool);
    core.setOutput('cliVersion', version || 'latest');
    
    await installUiPathCLI(tool, version);
    
    // Add .NET tools to PATH
    const homeDir = os.homedir();
    const dotnetToolsPath = path.join(homeDir, '.dotnet', 'tools');
    console.log('Adding .NET tools directory to PATH: ' + dotnetToolsPath);
    core.addPath(dotnetToolsPath);
    
    console.log('UiPath CLI setup complete - uipcli command is now available');
  } catch (error) {
    console.error('Error: ' + error);
    core.setFailed(error.message);
  }
}

module.exports = setup

if (require.main === module) {
  setup();
}