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

### Example usage, with default CLI version

Copy the snippet below for using the setup-uipath action, with the UiPath.CLI based on default inputs, see [action.yml](action.yml) and [Inputs](#inputs) section below for more details.

```yml
      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@v2
```

### Example usage, with specific UiPath CLI version

Copy the snippet below for using the setup-uipath action, with a UiPath CLI version of your choosing. In the example below, version [24.12.9111.31003](https://docs.uipath.com/automation-ops/automation-cloud/latest/USER-GUIDE/release-notes-uipath-cli#v2412911131003) is used.

```yml
      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@v2
        with:
          version: 24.12.9111.31003
```

### Example usage, with specific UiPath Platform version

Copy the snippet below for using the setup-uipath action, with a UiPath CLI version selected based on the version of UiPath used in your environment (Studio and/or Robot versions based on their Major/Minor version). In the example below, version **24.10** is used.

```yml
      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@v2
        with:
          platform-version: '24.10'
```

## Using uipcli on Ubuntu

When running this action on Linux runners, the `uipcli` is a reference to symlink for running `dotnet uipcli.dll`.
This means that dotnet is required to have been setup on the runner. This can be achieved by running [actions/setup-dotnet](https://github.com/actions/setup-dotnet), providing the required dotnet-version (see UiPath CLI [docs](https://docs.uipath.com/automation-ops/automation-cloud/latest/user-guide/about-uipath-cli#prerequisites) for required version) as part of the job before any UiPath CLI commands. Once that has been done, you can run uipcli exactly as you would on a Windows runner.

See code block below for an example job performing this setup.

```yml
  uipcli-wf-analysis-ubuntu:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: uipath-setup
        uses: Mikael-RnD/setup-uipath@v2

      - name: setup-dotnet
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: |
            8.0.x
            6.0.x

      - name: Run CLI Task Analyze
        run: uipcli package analyze ${{ github.workspace }}/project.json
```

## Inputs

See [action.yml](action.yml) for default values on inputs.

|Name|Description|Required|Example value|
|:--|:--|:--|:--|
|**version**|Specific version of the UiPath CLI to download from the [UiPath-Official Feed](https://uipath.visualstudio.com/Public.Feeds/_artifacts/feed/UiPath-Official/NuGet/UiPath.CLI.Windows/versions/)|False|23.10.8753.32995|
|**platform-version**|Version of the UiPath platform used (e.g. version of robots and Studio used) in major and minor version, such as "24.10" or "23.10". If **version** is provided, this input will be ignored.|False|23.10|