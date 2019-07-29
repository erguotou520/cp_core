import CPService, { CPServiceArg } from './Service'
import CPConfig from './Config'
import ServiceManager from './ServiceManager'
import ConfigManager from './ConfigManager'

function genConfig (key: string, value: string, configs: { [key: string]: string | number }, args: CPServiceArg[]) {
  const isNumber = value.match(/^\d+$/)
  args.push({
    key,
    value: {
      origin: 'input',
      type: isNumber ? 'number' : 'string'
    }
  })
  configs[key] = isNumber ? +value : value
}

/*
 * 根据命令行字符串猜测生成一个服务，支持多个命令，先拆分回车，然后每行先拆分空格，取首个为命令，其余为参数
 * 然后在参数中解析配置
 */
export function guessFromCommandString (commands: string): [number, number] {
  if (!commands) return [0, 0]
  const lines = commands.split(/\r?\n/)
  const argRegex = /^[-/\\]/
  let insertedServices = 0
  let insertedConfigs = 0
  for (const line of lines) {
    const [command, ...rest] = line.split(' ')
    const args: CPServiceArg[] = []
    const configs: { [key: string]: string | number } = {}
    for (let i = 0; i < rest.length;) {
      // 以 - / \ 开头的认为是参数开始
      if (rest[i].match(argRegex)) {
        // 如果这一段是-xxx=xxx的形式，那么解析它
        if (rest[i].includes('=')) {
          const index = rest[i].indexOf('=')
          genConfig(rest[i].slice(0, index), rest[i].slice(index + 1), configs, args)
          i++
          continue
        } else if (rest[i + 1] && !rest[i + 1].match(argRegex)) {
          genConfig(rest[i], rest[i + 1], configs, args)
          i += 2
          continue
        }
      }
      args.push({ key: rest[i] })
      i++
    }
    let serviceName: string | undefined = command.split(/\\|\//).pop()
    if (!serviceName) {
      serviceName = command
    }
    const service = new CPService(serviceName, command, args)
    const services = ServiceManager.getServices()
    const foundService = services.find(serv => serv.isEqual(service))
    const config = Object.keys(configs).length ? new CPConfig('', configs) : null
    // 服务已存在
    if (foundService) {
      if (config) {
        const configs = ConfigManager.getConfigMap().get(foundService.uuid)
        if (configs) {
          // 配置已存在
          if (configs.some(conf => conf.isEqual(config))) {
            continue
          }
          config.name = `imported-${configs.length + 1}`
        } else {
          config.name = `imported-1`
        }
        // 添加配置
        ConfigManager.addConfig(foundService.uuid, config)
        insertedConfigs++
      }
    } else {
      // 添加服务
      ServiceManager.addService(service)
      if (config) {
        config.name = `imported-1`
        ConfigManager.addConfig(service.uuid, config)
        insertedServices++
        insertedConfigs++
      } else {
        insertedServices++
      }
    }
  }
  return [insertedServices, insertedConfigs]
}
