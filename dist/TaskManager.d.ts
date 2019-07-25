/// <reference types="node" />
import { EventEmitter } from 'events';
import CPConfig from './Config';
import { ChildProcess } from 'child_process';
import CPService from './Service';
import { Stream } from 'stream';
declare class TaskManager extends EventEmitter {
    getRunningTasks(): {
        [key: string]: number;
    };
    run(service: CPService, config: CPConfig, stdout?: Stream, stderr?: Stream): ChildProcess | null;
    stop(configId: string): void;
    stopAll(): void;
    exportRunningTasks(): object;
    importRunningTasks(json: {
        [key: string]: any;
    }): void;
}
declare const _default: TaskManager;
export default _default;
