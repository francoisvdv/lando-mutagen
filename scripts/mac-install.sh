#!/bin/sh

PLUGINS_DIR="$HOME/.lando/plugins"
PLUGIN_PATH="$PLUGINS_DIR/lando_mutagen"
ZIP_DOWNLOAD_PATH="$PLUGINS_DIR/lando_mutagen.zip"
ZIP_DOWNLOAD_URL="https://github.com/francoisvdv/lando-mutagen/releases/latest/download/release.zip"

check_if_command_exists()
{
    COMMAND=$1
    if ! command -v "$COMMAND" &> /dev/null
    then
        if [ $# -ge 2 ]
        then
            echo $2
        else
            echo "'$COMMAND' is not available as as command, please fix and run then script again"
        fi
        exit
    fi
}

# Ensure necessary commands are available
check_if_command_exists lando
check_if_command_exists curl
check_if_command_exists unzip
check_if_command_exists mutagen "Mutagen is necessary to use this plugin - https://mutagen.io/documentation/introduction/installation"

if [ ! -d $PLUGINS_DIR ]
then
    echo "$PLUGINS_DIR does not exist."
    exit 1
fi

curl -L "$ZIP_DOWNLOAD_URL" -o "$ZIP_DOWNLOAD_PATH"
# Check to make sure file downloaded and is not 0 bytes
if [ ! -s $ZIP_DOWNLOAD_PATH ]
then
    echo "There was an issue downloading $ZIP_DOWNLOAD_URL."
    exit 1
fi
echo "Plugin downloaded"

# Unzip to lando plugins directory
unzip -q $ZIP_DOWNLOAD_PATH -d $PLUGINS_DIR
# Delete zip file
rm -rf $ZIP_DOWNLOAD_PATH
# Remove old version of plugin
rm -rf $PLUGIN_PATH
# Rename directory to use underscore instead of dash
mv "$PLUGINS_DIR/lando-mutagen" $PLUGIN_PATH

# Check to make sure then plugin is detected by lando
if lando config | grep '.lando/plugins/lando_mutagen/app.js' &> /dev/null
then
    echo "Plugin installed and detected in 'lando config'"
    exit
fi

