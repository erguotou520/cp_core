import { EventEmitter } from 'events'
import CPService from './Service'

let services: CPService[] = []

class ServiceManager extends EventEmitter {

  // 获取服务列表
  getServices (): CPService[] {
    return services
  }

  // 初始化设置服务-配置列表
  setServices (_services: CPService[]) {
    services = _services
  }

  // 添加服务
  addService (service: CPService): boolean {
    if (services.some(serv => serv.isEqual(service))) {
      return false
    }
    services.push(service)
    this.emit('insert', service)
    return true
  }

  // 更新服务
  updateService (index: number, newService: CPService): boolean {
    if (index < 0 || index > services.length - 1) {
      return false
    }
    services.splice(index, 1, newService)
    this.emit('update', index, newService)
    return true
  }

  // 删除服务
  removeService (index: number): boolean {
    if (index < 0 || index > services.length - 1) {
      return false
    }
    const service = services.splice(index, 1)[0]
    this.emit('remove', index, service)
    return true
  }

  // 服务排序
  sortService (oldIndex: number, newIndex: number): boolean {
    if (oldIndex < 0 || oldIndex > services.length - 1 || newIndex < 0 || newIndex > services.length - 1) {
      return false
    }
    const serv = services.splice(oldIndex, 1)[0]
    services.splice(newIndex, 0, serv)
    this.emit('update:all', services)
    return true
  }

  // 导出服务列表
  exportServices (): object[] {
    return services.map(service => CPService.toJSON(service))
  }

  // 导入服务列表
  importServices (json: object[]): number {
    const validServices = json.reduce<CPService[]>((arr, obj) => {
      const service = CPService.fromJSON(obj)
      if (service.isValid()) {
        arr.push(service)
      }
      return arr
    }, [])
    services.push(...validServices)
    return validServices.length
  }
}

export default new ServiceManager()
