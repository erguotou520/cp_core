"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var child_process_1 = require("child_process");
var tree_kill_1 = __importDefault(require("tree-kill"));
var runningTasks = {};
var TaskManager = /** @class */ (function (_super) {
    __extends(TaskManager, _super);
    function TaskManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 获取正在运行的任务
    TaskManager.prototype.getRunningTasks = function () {
        return runningTasks;
    };
    // 运行制定配置的服务
    TaskManager.prototype.run = function (service, config, stdout, stderr) {
        var _this = this;
        if (stdout === void 0) { stdout = process.stdout; }
        if (stderr === void 0) { stderr = process.stderr; }
        // 是否已经在运行
        if (runningTasks[config.uuid]) {
            return null;
        }
        // 组合命令参数
        var args = service.args.reduce(function (arr, arg) {
            var value = config.configs[arg.key];
            arr.push(arg.key);
            // tslint:disable-next-line
            if (value !== null && value !== undefined && value !== '') {
                arr.push("" + value);
            }
            return arr;
        }, []);
        var child = child_process_1.spawn(service.command, args, {
            env: process.env,
            windowsHide: true,
            detached: true,
            shell: true,
            stdio: ['ignore', stdout, stderr]
        });
        child.unref();
        this.emit('running', config.uuid, child.pid, service.command + " " + args.join(' ') + "\n PID: " + child.pid);
        child
            .on('exit', function () {
            _this.emit('exit', config.uuid, child.pid);
            delete runningTasks[config.uuid];
            if (!Object.keys(runningTasks).length) {
                _this.emit('exit:all');
            }
        })
            .on('error', function (error) {
            _this.emit('error', config.uuid, child.pid, error);
        });
        runningTasks[config.uuid] = child.pid;
        return child;
    };
    // 结束某个运行的服务
    TaskManager.prototype.stop = function (configId) {
        var _this = this;
        var pid = runningTasks[configId];
        if (pid !== undefined) {
            // 先以SIGTERM关闭
            tree_kill_1.default(pid, 'SIGTERM', function (err) {
                if (err) {
                    // 不行则使用SIGKILL关闭
                    tree_kill_1.default(pid, 'SIGKILL', function (err1) {
                        if (err1) {
                            _this.emit('close:fail', configId, pid);
                        }
                        else {
                            _this.emit('closed', configId, pid);
                        }
                    });
                }
                else {
                    _this.emit('closed', configId, pid);
                }
            });
        }
    };
    // 结束所有
    TaskManager.prototype.stopAll = function () {
        for (var configId in runningTasks) {
            this.stop(configId);
        }
    };
    // 导出正在运行的任务
    TaskManager.prototype.exportRunningTasks = function () {
        return runningTasks;
    };
    // 导入正在运行的任务
    TaskManager.prototype.importRunningTasks = function (json) {
        for (var key in json) {
            runningTasks[key] = parseInt(json[key]);
        }
    };
    return TaskManager;
}(events_1.EventEmitter));
exports.default = new TaskManager();
//# sourceMappingURL=TaskManager.js.map