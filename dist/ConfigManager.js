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
var Config_1 = __importDefault(require("./Config"));
var events_1 = require("events");
// serviceUuid -> config
var configMap = new Map();
var ConfigManager = /** @class */ (function (_super) {
    __extends(ConfigManager, _super);
    function ConfigManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 获取服务列表
    ConfigManager.prototype.getConfigMap = function () {
        return configMap;
    };
    // 初始化设置服务-配置列表
    ConfigManager.prototype.setConfigMap = function (_configMap) {
        configMap = _configMap;
    };
    // 添加服务-配置
    ConfigManager.prototype.addConfig = function (serviceId, config) {
        var configs = configMap.get(serviceId);
        if (!configs) {
            configMap.set(serviceId, [config]);
            this.emit('insert', serviceId, config);
            return true;
        }
        if (configs.some(function (conf) { return conf.isEqual(config); })) {
            return false;
        }
        configs.push(config);
        this.emit('insert', serviceId, config);
        return true;
    };
    // 更新服务-配置
    ConfigManager.prototype.updateConfig = function (serviceId, index, newConfig) {
        var configs = configMap.get(serviceId);
        if (!configs || !newConfig) {
            return false;
        }
        if (index < 0 || index > configs.length - 1) {
            return false;
        }
        configs.splice(index, 1, newConfig);
        this.emit('update', serviceId, index, newConfig);
        return true;
    };
    // 删除服务-配置
    ConfigManager.prototype.removeConfig = function (serviceId, index) {
        var configs = configMap.get(serviceId);
        if (!configs) {
            return false;
        }
        if (index < 0 || index > configs.length - 1) {
            return false;
        }
        var config = configs.splice(index, 1)[0];
        this.emit('remove', serviceId, index, config);
        return true;
    };
    // 服务-配置排序
    ConfigManager.prototype.sortConfig = function (serviceId, oldIndex, newIndex) {
        var configs = configMap.get(serviceId);
        if (!configs) {
            return false;
        }
        if (oldIndex < 0 || oldIndex > configs.length - 1 || newIndex < 0 || newIndex > configs.length - 1) {
            return false;
        }
        var serv = configs.splice(oldIndex, 1)[0];
        configs.splice(newIndex, 0, serv);
        this.emit('update:all', serviceId, configs);
        return true;
    };
    // 导出服务-配置
    ConfigManager.prototype.exportConfigMap = function () {
        var data = {};
        configMap.forEach(function (configs, serviceId) {
            data[serviceId] = configs.map(function (config) { return Config_1.default.toJSON(config); });
        });
        return data;
    };
    // 导入服务-配置
    ConfigManager.prototype.importConfigMap = function (services, json) {
        var imported = 0;
        var _loop_1 = function (key) {
            // 从json中获取有效的配置
            var validConfigs = json[key].reduce(function (arr, item) {
                var config = Config_1.default.fromJSON(item);
                if (config.isValid()) {
                    arr.push(config);
                }
                return arr;
            }, []);
            var service = services.find(function (serv) { return serv.uuid === key; });
            if (service) {
                var configs = configMap.get(key);
                if (configs) {
                    configs.push.apply(configs, validConfigs);
                }
                else {
                    configMap.set(key, validConfigs);
                }
                imported += validConfigs.length;
            }
        };
        for (var key in json) {
            _loop_1(key);
        }
        return imported;
    };
    return ConfigManager;
}(events_1.EventEmitter));
exports.default = new ConfigManager();
//# sourceMappingURL=ConfigManager.js.map