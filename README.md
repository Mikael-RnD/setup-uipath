# UiPath CLI Setup Action
A GitHub Action for setting up the [UiPath CLI](https://docs.uipath.com/test-suite/automation-suite/2022.10/user-guide/uipath-command-line-interface) on GitHub Actions runners.

**Note on compatibility:** This action is compatible with both Windows and Ubuntu runners. UiPath offers two separate command line tools for the different operating systems, UiPath.CLI and UiPath.CLI.Windows installed on Ubuntu and Windows respectively. These have different capabilities in terms of project compatibility, noted in the [Compatiblity Matrix sections of this documentation page](https://docs.uipath.com/test-suite/automation-suite/2022.10/user-guide/uipath-command-line-interface#uipathcliwindows-compatibility-matrix)

## How to use
Example usage:

      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@v1

In further steps of your workflow, you can now use the UiPath CLI (uipcli):
- Packing Studio projects into NuGet packages.
- Deploying NuGet packages to Orchestrator.
- Running jobs in Orchestrator.
- Running Test Sets in Orchestrator.

[See the UiPath documentation for reference on tasks that can be performed with the command line tool](https://docs.uipath.com/test-suite/automation-suite/2022.10/user-guide/executing-tasks-cli)
