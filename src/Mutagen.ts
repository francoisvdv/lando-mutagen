'use strict';

import * as process from 'child_process';
import * as fs from 'fs';
import { ProjectConfig } from 'lando';
import { BaseError } from './BaseError';
import { Logger } from './Logger';

export class MutagenProcessError extends BaseError {
    constructor(public originalError: unknown) { super(); }
}

export class Mutagen {
    constructor(
        private logger: Logger
    ) {

    }

    availableOnSystem(): boolean {
        try {
            process.execSync(`which mutagen`);
            return true;
        } catch (e) {
            this.logger.verbose(`error occurred while finding mutagen: ${e}`);
            return false;
        }
    }

    availableInProject(projectConfig: ProjectConfig, mutagenConfigFile: string): boolean {
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

        if (!fs.existsSync(mutagenConfigFile)) {
            this.logger.verbose(`Not using mutagen, as there is no ${mutagenConfigFile} file`);
            return false;
        }

        return true;
    }

    isRunning(mutagenConfigFile: string): boolean {
        try {
            // Check if the mutagen project is running
            process.execSync(`mutagen project list -f ${mutagenConfigFile}`);
        }
        catch (e) {
            return false;
        }
        return true;
    }

    start(mutagenConfigFile: string) {
        if (this.isRunning(mutagenConfigFile)) {
            this.logger.info(`mutagen already seems to be running, not starting it again`);
            return;
        }

        try {
            this.logger.verbose(`starting mutagen`);
            const stdout = process.execSync(`mutagen project start -f ${mutagenConfigFile}`);
            this.logger.verbose(`started mutagen: ${stdout}`);
        } catch (e) {
            throw new MutagenProcessError(e);
        }
    }
    stop(mutagenConfigFile: string) {
        if (!this.isRunning(mutagenConfigFile)) {
            this.logger.info(`mutagen not running, nothing to stop`);
            return;
        }

        try {
            this.logger.verbose(`stopping mutagen`);
            const stdout = process.execSync(`mutagen project terminate -f ${mutagenConfigFile}`);
            this.logger.verbose(`stopped mutagen: ${stdout}`);
        } catch (e) {
            throw new MutagenProcessError(e);
        }
    }
}
