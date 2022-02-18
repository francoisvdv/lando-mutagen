import { App } from "lando";

export class Logger {
    constructor(private app: App) {
    }

    verbose(msg: string) {
        this.app.log.verbose(msg);
    }
    warn(msg: string) {
        this.app.log.warn(msg);
    }
    info(msg: string) {
        this.app.log.info(msg);
    }
    error(msg: string) {
        this.app.log.error(msg);
    }
}