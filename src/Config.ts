import { v4 as uuid } from 'uuid'

export default class CPConfig {
  uuid: string
  name: string
  configs: { [key: string]: string | number }
  group?: string

  constructor (name: string, configs: { [key: string]: string | number }, group?: string) {
    this.uuid = uuid()
    this.name = name
    this.configs = configs
    this.group = group
  }

  // 是否相等
  isEqual (another: CPConfig): boolean {
    return Object.keys(this.configs).every(key => {
      return another.configs[key] === this.configs[key]
    })
  }
  // 是否有效
  isValid (): boolean {
    return !!(this.uuid && this.name && Object.keys(this.configs).length)
  }
  // 转json
  static toJSON (config: CPConfig): object {
    return config
  }
  // 从json转回来
  static fromJSON (json: object): CPConfig {
    const config: CPConfig = Object.create(CPConfig.prototype)
    Object.assign(config, json)
    return config
  }
}
