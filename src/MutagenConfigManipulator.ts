import { ProjectConfig } from "lando";

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Logger } from "./Logger";
import { BaseError } from "./BaseError";

export type SyncConfig  = {
    [name: string]: {
        alpha: string;
        beta: string;
        mode: 'two-way-resolved';
    };
} & {
    defaults: {
        test: string;
    };
}
export interface MutagenConfig {
    sync: SyncConfig;
}

export class MutagenConfigNotFoundError extends BaseError {
    constructor(public message: string) { super(); }
}

export class MutagenConfigInvalidError extends BaseError {
    constructor(public originalError: unknown|string) { super(); }
}

export class MutagenConfigWriteError extends BaseError {
    constructor(public originalError: unknown) { super(); }
}

export class MutagenConfigManipulator {
    constructor(
        private logger: Logger
    ) {
    }

    validateMutagenConfig(config: MutagenConfig): boolean {
        return config.sync !== undefined;
    }

    createManipulatedMutagenConfigFile(
        projectName: string,
        projectConfig: ProjectConfig,
        mutagenConfigInputFile: string,
        mutagenConfigOutputFile: string
    ) {
        if (!fs.existsSync(mutagenConfigInputFile)) {
            throw new MutagenConfigNotFoundError(mutagenConfigInputFile + ' does not exist');
        }

        const services = Object.keys(projectConfig.services);
        const excludes = projectConfig.excludes;
    
        const mutagenConfig = this.readMutagenConfigFile(mutagenConfigInputFile);
    
        // For each exclude, a docker volume is created. This docker volume is shared
        // across all containers for the project. We use the first service to create the
        // mutagen sync on, after all it doesn't matter on which one we do so.
        const service = services[0];
        excludes.forEach(exclude => {
            const syncName = projectName + exclude;
            const containerName = `${projectName}_${service}_1`;
            mutagenConfig.sync[syncName] = {
                alpha: './' + exclude,
                beta: `docker://www-data@${containerName}/app/${exclude}`,
                mode: 'two-way-resolved',
            };
        });
    
        this.writeMutagenConfigFile(mutagenConfig, mutagenConfigOutputFile);
    }

    removeManipulatedMutagenConfigFile(file: string) {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        } else {
            throw new MutagenConfigNotFoundError(file + ' does not exist');
        }
    }


    private readMutagenConfigFile(file: string): MutagenConfig {
        if (!fs.existsSync(file)) {
            throw new MutagenConfigNotFoundError(file + ' does not exist');
        }

        // Read mutagen yaml file
        let mutagenConfig = null;
        try {
            mutagenConfig = yaml.load(fs.readFileSync(file, 'utf-8'));
        } catch (e) {
            this.logger.error(`error while reading ${file}: ${e}`);
            throw new MutagenConfigInvalidError(e);
        }

        if (!this.validateMutagenConfig(mutagenConfig)) {
            throw new MutagenConfigInvalidError('Configuration not valid');
        }

        return mutagenConfig;
    }

    private writeMutagenConfigFile(mutagenConfig: MutagenConfig, outputFile: string) {
        // Write mutagen config to a result file
        try {
            fs.writeFileSync(outputFile, yaml.dump(mutagenConfig));
        } catch (e) {
            this.logger.error(`error while writing ${outputFile}: ${e}`);
            throw new MutagenConfigWriteError(e);
        }
    }
}
