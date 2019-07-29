import { v4 as uuid } from 'uuid'

export interface CPServiceArgValue {
  origin: 'input' | 'select'
  type: 'string' | 'number'
  min?: number
  max?: number
  list?: ReadonlyArray<string | number>
  default?: string | number
}

export interface CPServiceArg {
  key: string
  value?: CPServiceArgValue
}

export default class CPService {
  uuid: string
  name: string
  command: string
  args: CPServiceArg[]

  constructor (name: string, command: string, args: CPServiceArg[]) {
    this.name = name
    this.uuid = uuid()
    this.command = command
    this.args = args
  }

  // 是否相等
  isEqual (another: CPService) {
    // 命令相同且key的列表都一样
    return this.command === another.command && this.args.length === another.args.length && this.args.every(arg => another.args.map(a => a.key).includes(arg.key))
  }
  // 是否有效
  isValid (): boolean {
    return !!this.command
  }
  // 转json
  static toJSON (service: CPService): object {
    return service
  }
  // 从json转回来
  static fromJSON (json: object): CPService {
    const service: CPService = Object.create(CPService.prototype)
    Object.assign(service, json)
    return service
  }
}
