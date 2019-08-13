export interface CPServiceArgValue {
    required?: boolean;
    origin: 'input' | 'select';
    type: 'string' | 'number';
    min?: number;
    max?: number;
    list?: ReadonlyArray<string | number>;
    default?: string | number;
}
export interface CPServiceArg {
    key: string;
    value?: CPServiceArgValue | null;
}
export default class CPService {
    uuid: string;
    name: string;
    command: string;
    args: CPServiceArg[];
    constructor(name: string, command: string, args: CPServiceArg[]);
    isEqual(another: CPService): boolean;
    isValid(): boolean;
    static toJSON(service: CPService): object;
    static fromJSON(json: object): CPService;
}
