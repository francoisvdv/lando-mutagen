import { ProjectConfig } from "lando";

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Logger } from "./Logger";

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

export class MutagenConfigManipulator {
    constructor(
        private logger: Logger,
        private mutagenConfigFile = '.lando.mutagen.yml',
        private manipulatedMutagenConfigFile = '.lando.mutagen.yml.tmp'
    ) {
    }

    validateMutagenConfig(config: MutagenConfig): boolean {
        return config.sync !== undefined;
    }

    createManipulatedMutagenConfigFile(projectName: string, projectConfig: ProjectConfig) {
        const services = Object.keys(projectConfig.services);
        const excludes = projectConfig.excludes;
    
        const mutagenConfig = this.readMutagenFile();
    
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
    
        this.writeMutagenFile(mutagenConfig);
    }

    removeManipulatedMutagenConfigFile() {
        if (fs.existsSync(this.manipulatedMutagenConfigFile)) {
            fs.unlinkSync(this.manipulatedMutagenConfigFile);
        } else {
            this.logger.warn(`No mutagen result file to delete, it is possible that the` +
                `mutagen syncs cannot be stopped. You should check afterwards using 'mutagen sync list'.`);
        }
    }


    private readMutagenFile(): MutagenConfig {
        // Read mutagen yaml file
        let mutagenConfig = null;
        try {
            mutagenConfig = yaml.load(fs.readFileSync(this.mutagenConfigFile, 'utf-8'));
            if (!this.validateMutagenConfig(mutagenConfig)) {
                throw new Error('The mutagen config file is invalid');
            }
        } catch (e) {
            this.logger.error(`error while reading ${this.mutagenConfigFile}: ${e}`);
            throw e;
        }
        return mutagenConfig;
    }

    private writeMutagenFile(mutagenConfig: MutagenConfig) {
        // Write mutagen config to a result file
        try {
            fs.writeFileSync(this.manipulatedMutagenConfigFile, yaml.dump(mutagenConfig));
        } catch (e) {
            this.logger.error(`error while writing ${this.manipulatedMutagenConfigFile}: ${e}`);
            throw e;
        }
    }
}