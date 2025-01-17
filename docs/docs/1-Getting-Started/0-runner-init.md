---
description: Quickly generate a new UrTurn Game
---

# Generate a Game

:::success

Understand what [UrTurn is and isn't](/docs).

:::

## Create Game

```bash
npx @urturn/runner init my-game # generates new game files
cd my-game
npm run dev # run the game locally
```

:::caution

**Windows** users must use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install). We currently do not support powershell/command prompt.

Make sure to keep files and folders in your WSL directories (they should **NOT** be under `/mnt/c`, use `/home/<user>/` instead).

:::

## File/Folder structure

```bash
game
│   package.json # npm package specification for dependencies for your room functions (includes @urturn/runner for local development)
│
└───.github/workflows # contains important GitHub actions that create a build artifact for UrTurn to use
│
└───src
│   │   main.js # room functions (e.g. onRoomStart, onPlayerMove, etc.)
│   
└───frontend # holds all the files related to your game frontend
    │   package.json  # npm package specification for dependencies on your frontend (includes @urturn/client)
    │   ...your frontend files
```

## GitHub Actions in `.github/workflows`

:::success

No [GitHub Actions](https://github.com/features/actions) experience needed!

We've already done the hard work for you. When you ran `npx @urturn/runner init my-game`, the correct github actions were created for you.

:::

When you `push` to `main` branch of your repo on GitHub, the actions will automatically create the correct [Artifact structure](/docs/Getting-Started/Deploying-Your-Game#build-artifact-spec) on the `published` branch, which you will use to [deploy to production](/docs/Getting-Started/Deploying-Your-Game).
