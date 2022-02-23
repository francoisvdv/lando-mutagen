'use strict';

import { App } from "lando";
import { BaseError } from "./BaseError";
import { Logger } from "./Logger";
import { Mutagen, MutagenProcessError } from "./Mutagen";
import { MutagenConfigInvalidError, MutagenConfigManipulator, MutagenConfigNotFoundError, MutagenConfigWriteError } from "./MutagenConfigManipulator";

const handleError = (e: BaseError, logger: Logger) => {
    if (e instanceof MutagenConfigNotFoundError) {
        logger.error('mutagen config not found: ' + e.message);
    } else if (e instanceof MutagenConfigInvalidError) {
        logger.error('mutagen config is invalid: ' + e.originalError);
    } else if (e instanceof MutagenConfigWriteError) {
        logger.error('mutagen config could not be written: ' + e.originalError);
    } else if (e instanceof MutagenProcessError) {
        logger.error('mutagen process error: ' + e.originalError);
    } else {
        logger.error('unknown error ocurred: ' + JSON.stringify(e));
    }

    throw e;
};

export = (app: App) => {
    const mutagenConfigInputFile = '.lando.mutagen.yml';
    const mutagenConfigManipulatedFile = '.lando.mutagen.yml.tmp';

    const logger = new Logger(app);
    const mutagen = new Mutagen(logger);
    const mutagenConfigManipulator = new MutagenConfigManipulator(logger);

    if (!mutagen.availableInProject(app.config, mutagenConfigInputFile)) {
        logger.verbose('No mutagen-compatible configuration detected in project');
        return;
    }

    if (!mutagen.availableOnSystem()) {
        logger.warn('Your system does not have mutagen installed, this project will not run very fast :(');
        return;
    }

    app.events.on('post-start', () => {
        try {
            logger.info('starting mutagen');
            mutagenConfigManipulator.createManipulatedMutagenConfigFile(
                app.project,
                app.config,
                mutagenConfigInputFile,
                mutagenConfigManipulatedFile
            );
            mutagen.start(mutagenConfigManipulatedFile);
            logger.info('started mutagen');
        }
        catch (e) {
            handleError(e, logger);
        }
    });

    app.events.on('pre-stop', () => {
        try {
            logger.info('stopping mutagen');
            mutagen.stop(mutagenConfigManipulatedFile);
            mutagenConfigManipulator.removeManipulatedMutagenConfigFile(mutagenConfigManipulatedFile, true);
            logger.info('stopped mutagen');
        }
        catch (e) {
            if (e instanceof MutagenConfigNotFoundError) {
                logger.verbose('mutagen config not found: ' + e.message);
            } else {
                handleError(e, logger);
            }
        }
    });
};
