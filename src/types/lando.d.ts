declare module 'lando' {
    class Log {
        verbose(string: string);
        warn(msg: string);
        error(msg: string);
        info(msg: string);
        debug(msg: string);
    }
    class ProjectConfig {
        excludes: string[];
        services: object;
    }
    class App {
        project: string;
        log: Log;
        config: ProjectConfig;
        events: {
            on: (eventName: string, handler: () => void) => void;
        };
        root: string;
    }
    class Lando {
        
    }
}