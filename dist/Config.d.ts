export default class CPConfig {
    uuid: string;
    name: string;
    configs: {
        [key: string]: string | number;
    };
    group?: string;
    constructor(name: string, configs: {
        [key: string]: string | number;
    }, group?: string);
    isEqual(another: CPConfig): boolean;
    isValid(): boolean;
    static toJSON(config: CPConfig): object;
    static fromJSON(json: object): CPConfig;
}
