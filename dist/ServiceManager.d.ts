/// <reference types="node" />
import { EventEmitter } from 'events';
import CPService from './Service';
declare class ServiceManager extends EventEmitter {
    getServices(): CPService[];
    setServices(_services: CPService[]): void;
    addService(service: CPService): boolean;
    updateService(index: number, newService: CPService): boolean;
    removeService(index: number): boolean;
    sortService(oldIndex: number, newIndex: number): boolean;
    exportServices(): object[];
    importServices(json: object[]): number;
}
declare const _default: ServiceManager;
export default _default;
