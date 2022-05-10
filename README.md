# lando-mutagen
Automatically start and stop mutagen syncs when starting and stopping a Lando project.

One of the main issues in having your development environment fully Dockerized on Windows and Mac is performance. Jumping the filesystem boundary (e.g. Mac FS -> Linux container FS or vice versa) causes performance to tank dramatically.

Luckily, Lando provides us with a nice performance feature where directories defined in `excludes` get one-way synced from the host to Docker named volumes. These Docker named volumes are then mounted at the appropriate locations in the containers. This solves the 'jumping-filesystem-boundary' performance issue. 

A drawback of this is once files are in the named volumes, any changes to them do not get synced back to the host. This is problematic when developing, where your IDE needs the package folders (e.g. `vendor` or `node_modules`) for proper intellisense.

This is where this plugin comes in. Add a base [Mutagen](https://mutagen.io) configuration file to your project, add some `excludes` in your Lando file and the plugin will do the following:

1. On `lando start`, create an amended mutagen configuration file with the appropriate directory syncs
2. After `lando start`, start up the mutagen syncs, such that modified files in the `excludes` directories will be synced back to the host
3. On `lando stop`, stop the mutagen syncs
4. After `lando stop`, remove the temporary amended mutagen configuration file

## Requirements
1. [Mutagen](https://mutagen.io/documentation/introduction/installation) installed and running on your host
2. Lando (obviously :))

## Installation
### One-liner
```
# rm -rf ~/.lando/plugins/lando-mutagen # Delete previous install
mkdir -p ~/.lando/plugins && wget https://github.com/francoisvdv/lando-mutagen/releases/latest/download/release.zip -O /tmp/lando-mutagen.zip && unzip -o /tmp/lando-mutagen.zip -d ~/.lando/plugins && rm /tmp/lando-mutagen.zip
```

There is currently an [issue with lando](https://github.com/lando/lando/issues/3394) where dashes in a plugin's name prevent it from working. Until this is fixed, run this command to rename the plugin:
```
mv ~/.lando/plugins/lando-mutagen ~/.lando/plugins/lando_mutagen
```

### Manual
Add the plugin in `~/.lando/plugins`. Your directory will look like this:
```
 ~/.lando/plugins/lando-mutagen:
-rw-r--r--@ 1 user  group    193 Feb 21 17:07 BaseError.js
-rw-r--r--@ 1 user  group    455 Feb 21 17:07 Logger.js
-rw-r--r--@ 1 user  group   2338 Feb 21 17:07 Mutagen.js
-rw-r--r--@ 1 user  group   3766 Feb 21 17:07 MutagenConfigManipulator.js
-rw-r--r--@ 1 user  group   2465 Feb 21 17:07 app.js
-rw-r--r--@ 1 user  group    193 Feb 21 17:07 index.js
drwxr-xr-x@ 6 user  group    192 Feb 21 17:07 node_modules
-rw-r--r--@ 1 user  group   1277 Feb 21 17:07 package.json
-rw-r--r--@ 1 user  group  96577 Feb 21 17:07 yarn.lock
```

Lando will now load the plugin automatically on any `lando` CLI command. You can verify this by running `lando info -v` and searching for the line
`DEBUG ==> plugin lando-mutagen loaded from /Users/user/.lando/plugins/lando-mutagen/index.js`

## Usage
1. Have an existing Lando project containing a `.lando.yml` file
2. Add an [excludes configuration section](https://docs.lando.dev/config/performance.html) to it. E.g.
    ```
    excludes:
      - var
      - vendor
    ```
    Note that you might have to do a `lando rebuild` after this.
3. Add a `.lando.mutagen.yml` file, which contains your base [mutagen configuration](https://mutagen.io/documentation/orchestration/projects). Example contents (enough to get started):
    ```
    sync:
        defaults:
            flushOnCreate: true
            ignore:
                vcs: false
            permissions:
                defaultFileMode: 644
                defaultDirectoryMode: 755
    ```
4. Run `lando start`. This might take some time due to the file syncs.
5. Profit! File changes in the `excludes` directories will now be synced back to the host and you can enjoy close-to linux-native Docker filesystem performance.

## Development

### Setup
1. yarn install
2. lefthook install
