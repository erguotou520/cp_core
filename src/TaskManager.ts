import { EventEmitter } from 'events'
import CPConfig from './Config'
import { ChildProcess, spawn } from 'child_process'
import CPService from './Service'
import kill from 'tree-kill'
import { Stream } from 'stream';

const runningTasks: { [key: string]: number } = {}

class TaskManager extends EventEmitter {

  // 获取正在运行的任务
  getRunningTasks (): { [key: string]: number } {
    return runningTasks
  }

  // 运行制定配置的服务
  run (service: CPService, config: CPConfig, stdout: Stream = process.stdout, stderr: Stream = process.stderr): ChildProcess | null {
    // 是否已经在运行
    if (runningTasks[config.uuid]) {
      return null
    }
    // 组合命令参数
    const args = service.args.reduce<string[]>((arr, arg) => {
      const value = config.configs[arg.key]
      arr.push(arg.key)
      // tslint:disable-next-line
      if (value !== null && value !== undefined && value !== '') {
        arr.push(`${value}`)
      }
      return arr
    }, [])
    const child = spawn(service.command, args, {
      env: process.env,
      windowsHide: true,
      detached: true,
      shell: true,
      stdio: [ 'ignore', stdout, stderr ]
    })
    child.unref()
    this.emit('running', config.uuid, child.pid, `${service.command} ${args.join(' ')}\n PID: ${child.pid}`)
    child
      .on('exit', () => {
        this.emit('exit', config.uuid, child.pid)
        delete runningTasks[config.uuid]
        if (!Object.keys(runningTasks).length) {
          this.emit('exit:all')
        }
      })
      .on('error', (error) => {
        this.emit('error', config.uuid, child.pid, error)
      })
    runningTasks[config.uuid] = child.pid
    return child
  }

  // 结束某个运行的服务
  stop (configId: string) {
    const pid = runningTasks[configId]
    if (pid !== undefined) {
      // 先以SIGTERM关闭
      kill(pid, 'SIGTERM', err => {
        if (err) {
          // 不行则使用SIGKILL关闭
          kill(pid, 'SIGKILL', err1 => {
            if (err1) {
              this.emit('close:fail', configId, pid)
            } else {
              this.emit('closed', configId, pid)
            }
          })
        } else {
          this.emit('closed', configId, pid)
        }
      })
    }
  }

  // 结束所有
  stopAll () {
    for (const configId in runningTasks) {
      this.stop(configId)
    }
  }

  // 导出正在运行的任务
  exportRunningTasks (): object {
    return runningTasks
  }

  // 导入正在运行的任务
  importRunningTasks (json: { [key: string]: any }) {
    for (const key in json) {
      runningTasks[key] = parseInt(json[key])
    }
  }
}

export default new TaskManager()
