import { Logger } from "./Logger";

import * as process from 'child_process';

export class Lando {
    constructor(
        private logger: Logger
    ) {

    }

    availableOnSystem() {
        try {
            process.execSync(`which lando`);
            return true;
        } catch (e) {
            this.logger.verbose(`error occurred while finding lando: ${e}`);
            return false;
        }
    }
}