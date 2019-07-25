export interface CPServiceArgValue {
    origin: 'input' | 'select';
    type: 'string' | 'number';
    min?: number;
    max?: number;
    list?: ReadonlyArray<string | number>;
    default?: string | number;
}
export interface CPServiceArg {
    key: string;
    value?: CPServiceArgValue;
}
export default class CPService {
    uuid: string;
    command: string;
    args: CPServiceArg[];
    constructor(command: string, args: CPServiceArg[]);
    isEqual(another: CPService): boolean;
    isValid(): boolean;
    static toJSON(service: CPService): object;
    static fromJSON(json: object): CPService;
}
