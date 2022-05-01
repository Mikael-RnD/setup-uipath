# UiPath CLI Setup Action
A GitHub Action for setting up the UiPath CLI tool available from this link: https://www.myget.org/feed/uipath-dev/package/nuget/UiPath.CLI.

**Note: This action is only compatible with Windows runners

<p align="center">
  <a href="https://github.com/actions/javascript-action/actions"><img alt="javscript-action status" src="https://github.com/actions/javascript-action/workflows/units-test/badge.svg"></a>
</p>

## How to use
Example usage:

      # Set up the UiPath CLI (uipcli) and add it to PATH on your runner
      - name: Setup UiPath (uipcli) command line tool
        uses: Mikael-RnD/setup-uipath@main
        with:
          version: # Version number, defaults to 1.0.7985.19721 which was the latest version available at 2021-05-01

For further steps in your workflow you can now use uipcli commands.
