# UiPath CLI Setup Action

A GitHub Action for setting up the [UiPath CLI](https://docs.uipath.com/automation-ops/automation-cloud/latest/user-guide/about-uipath-cli) on GitHub Actions runners.

**Note on compatibility:** This action is compatible with both Windows and Ubuntu runners. UiPath offers two separate command line tools for the different operating systems, UiPath.CLI and UiPath.CLI.Windows installed on Ubuntu and Windows respectively. These have different capabilities in terms of project compatibility, noted in the [Compatiblity Matrix sections of this documentation page](https://docs.uipath.com/automation-ops/automation-cloud/latest/USER-GUIDE/about-uipath-cli#prerequisites)

## How to use

Copy one of the example usage snippets from the sections below into your GitHub Actions workflow.

In further steps of your workflow, you can now use the UiPath CLI (uipcli):

- Packing Studio projects into NuGet packages.
- Deploying NuGet packages to Orchestrator.
- Running jobs in Orchestrator.
- Running Test Sets in Orchestrator.

[See the UiPath documentation for reference on tasks that can be performed with the command line tool](https://docs.uipath.com/automation-ops/automation-cloud/latest/user-guide/executing-tasks-cli)

### Example usage, with default version

Copy the snippet below for using the setup-uipath action, with the UiPath.CLI version set as default in [action.yml](action.yml).

```yml
      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@v1
```

### Example usage, with specific version

Copy the snippet below for using the setup-uipath action, with a UiPath CLI version of your choosing. In the example below, version [24.12.9111.31003](https://docs.uipath.com/automation-ops/automation-cloud/latest/USER-GUIDE/release-notes-uipath-cli#v2412911131003) is used

```yml
      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@v1
        with:
          version: 24.12.9111.31003
```
## Inputs

|Name|Description|Required|Example value|
|:--|:--|:--|:--|
|version|Version of the UiPath CLI to retrieve from the [UiPath Official feed](https://uipath.visualstudio.com/Public.Feeds/_artifacts/feed/UiPath-Official/NuGet/UiPath.CLI.Windows/versions/23.10.8753.32995). If not provided, the default version set in [action.yml](action.yml) is used|False|23.10.8753.32995|
