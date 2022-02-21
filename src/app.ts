'use strict';

import { App } from "lando";
import { Logger } from "./Logger";
import { Mutagen } from "./Mutagen";
import { MutagenConfigManipulator } from "./MutagenConfigManipulator";

export default (app: App) => {
    const logger = new Logger(app);
    const mutagen = new Mutagen(logger);
    const mutagenConfigManipulator = new MutagenConfigManipulator(logger);

    if (!mutagen.availableOnSystem()) {
        return;
    }

    if (!mutagen.availableInProject(app.config)) {
        logger.warn('Your system does not have mutagen installed, this project will not run very fast :(');
        return;
    }

    app.events.on('post-start', () => {
        logger.info('starting mutagen');
        mutagenConfigManipulator.createManipulatedMutagenConfigFile(app.project, app.config);
        mutagen.start();
        logger.info('started mutagen');
    });

    app.events.on('pre-stop', () => {
        logger.info('stopping mutagen');
        mutagen.stop();
        mutagenConfigManipulator.removeManipulatedMutagenConfigFile();
        logger.info('stopped mutagen');
    });
};
