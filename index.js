const core = require('@actions/core');
const tc = require('@actions/tool-cache');

async function getDownloadURL(version)
{
  return "https://www.myget.org/F/uipath-dev/api/v2/package/UiPath.CLI/" + version
}

async function setup() {
  try {
    // Get version of tool to be installed
    const version = core.getInput('version');
    console.log(version);
    
    // Download the specific version of the tool, e.g. as a tarball
    const pathToTarball = await tc.downloadTool(getDownloadURL(version));
    console.log(pathToTarball);

    // Extract the tarball onto the runner
    const pathToCLI = await tc.extractTar(pathToTarball);

    console.log(pathToCLI);

    // Expose the tool by adding it to the PATH
    core.addPath(pathToCLI)
  } catch (error) {
    core.setFailed(error.Message);
  }
}

module.exports = setup