/// <reference types="node" />
import CPConfig from './Config';
import { EventEmitter } from 'events';
import CPService from './Service';
declare class ConfigManager extends EventEmitter {
    getConfigMap(): Map<string, CPConfig[]>;
    setConfigMap(_configMap: Map<string, CPConfig[]>): void;
    addConfig(serviceId: string, config: CPConfig): boolean;
    updateConfig(serviceId: string, index: number, newConfig: CPConfig): boolean;
    removeConfig(serviceId: string, index: number): boolean;
    sortConfig(serviceId: string, oldIndex: number, newIndex: number): boolean;
    exportConfigMap(): object;
    importConfigMap(services: CPService[], json: {
        [key: string]: object[];
    }): number;
}
declare const _default: ConfigManager;
export default _default;
