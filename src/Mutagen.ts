'use strict';

import * as process from 'child_process';
import * as fs from 'fs';
import { ProjectConfig } from 'lando';
import { Logger } from './Logger';

export class Mutagen {
    constructor(
        private logger: Logger,
        private mutagenConfigFile = '.lando.mutagen.yml',
        private manipulatedMutagenConfigFile = '.lando.mutagen.yml.tmp'
    ) {

    }

    availableOnSystem(): boolean {
        try {
            process.execSync(`which lando`);
            return true;
        } catch (e) {
            this.logger.verbose(`error occurred while finding mutagen: ${e}`);
            return false;
        }
    }

    availableInProject(projectConfig: ProjectConfig): boolean {
        const services = Object.keys(projectConfig.services);
        const excludes = projectConfig.excludes;

        if (!Array.isArray(services) || services.length === 0) {
            this.logger.verbose('Not using mutagen, as there are no services in the Lando config');
            return false;
        }

        if (!Array.isArray(excludes) || excludes.length === 0) {
            this.logger.verbose('Not using mutagen, as there are no excludes in the Lando config');
            return false;
        }

        if (!fs.existsSync(this.mutagenConfigFile)) {
            this.logger.verbose(`Not using mutagen, as there is no ${this.mutagenConfigFile} file`);
            return false;
        }

        return true;
    }

    start() {
        try {
            const stdout = process.execSync(`mutagen project start -f ${this.manipulatedMutagenConfigFile}`);
            this.logger.info(`started mutagen: ${stdout}`);
        } catch (e) {
            if (e) {
                this.logger.error(`error starting mutagen: ${e}`);
                return;
            }
        }
    }
    stop() {
        try {
            const stdout = process.execSync(`mutagen project terminate -f ${this.manipulatedMutagenConfigFile}`);
            this.logger.info(`stopped mutagen: ${stdout}`);
        } catch (e) {
            if (e) {
                this.logger.error(`error stopping mutagen: ${e}`);
                return;
            }
        }
    }
}
