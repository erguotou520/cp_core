import CPConfig from './Config'
import { EventEmitter } from 'events'
import CPService from './Service'

// serviceUuid -> config
let configMap: Map<string, CPConfig[]> = new Map()

class ConfigManager extends EventEmitter {

  // 获取服务列表
  getConfigMap (): Map<string, CPConfig[]> {
    return configMap
  }

  // 初始化设置服务-配置列表
  setConfigMap (_configMap: Map<string, CPConfig[]>) {
    configMap = _configMap
  }

  // 添加服务-配置
  addConfig (serviceId: string, config: CPConfig): boolean {
    let configs = configMap.get(serviceId)
    if (!configs) {
      configMap.set(serviceId, [config])
      this.emit('insert', serviceId, config)
      return true
    }
    if (configs.some(conf => conf.isEqual(config))) {
      return false
    }
    configs.push(config)
    this.emit('insert', serviceId, config)
    return true
  }

  // 更新服务-配置
  updateConfig (serviceId: string, index: number, newConfig: CPConfig): boolean {
    let configs = configMap.get(serviceId)
    if (!configs || !newConfig) {
      return false
    }
    if (index < 0 || index > configs.length - 1) {
      return false
    }
    configs.splice(index, 1, newConfig)
    this.emit('update', serviceId, index, newConfig)
    return true
  }

  // 删除服务-配置
  removeConfig (serviceId: string, index: number): boolean {
    let configs = configMap.get(serviceId)
    if (!configs) {
      return false
    }
    if (index < 0 || index > configs.length - 1) {
      return false
    }
    const config = configs.splice(index, 1)[0]
    this.emit('remove', serviceId, index, config)
    return true
  }

  // 服务-配置排序
  sortConfig (serviceId: string, oldIndex: number, newIndex: number): boolean {
    let configs = configMap.get(serviceId)
    if (!configs) {
      return false
    }
    if (oldIndex < 0 || oldIndex > configs.length - 1 || newIndex < 0 || newIndex > configs.length - 1) {
      return false
    }
    const serv = configs.splice(oldIndex, 1)[0]
    configs.splice(newIndex, 0, serv)
    this.emit('update:all', serviceId, configs)
    return true
  }

  // 导出服务-配置
  exportConfigMap (): object {
    const data: { [key: string]: any } = {}
    configMap.forEach((configs, serviceId) => {
      data[serviceId] = configs.map(config => CPConfig.toJSON(config))
    })
    return data
  }

  // 导入服务-配置
  importConfigMap (services: CPService[], json: { [key: string]: object[] }): number {
    let imported: number = 0
    for (const key in json) {
      // 从json中获取有效的配置
      const validConfigs = json[key].reduce<CPConfig[]>((arr, item) => {
        const config = CPConfig.fromJSON(item)
        if (config.isValid()) {
          arr.push(config)
        }
        return arr
      }, [])
      const service = services.find(serv => serv.uuid === key)
      if (service) {
        let configs = configMap.get(key)
        if (configs) {
          configs.push(...validConfigs)
        } else {
          configMap.set(key, validConfigs)
        }
        imported += validConfigs.length
      }
    }
    return imported
  }
}

export default new ConfigManager()
