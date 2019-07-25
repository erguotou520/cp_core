"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Service_1 = __importDefault(require("./Service"));
var Config_1 = __importDefault(require("./Config"));
var ServiceManager_1 = __importDefault(require("./ServiceManager"));
var ConfigManager_1 = __importDefault(require("./ConfigManager"));
function genConfig(key, value, configs, args) {
    var isNumber = value.match(/^\d+$/);
    args.push({
        key: key,
        value: {
            origin: 'input',
            type: isNumber ? 'number' : 'string'
        }
    });
    configs[key] = isNumber ? +value : value;
}
/*
 * 根据命令行字符串猜测生成一个服务，支持多个命令，先拆分回车，然后每行先拆分空格，取首个为命令，其余为参数
 * 然后在参数中解析配置
 */
function guessFromCommandString(commands) {
    if (!commands)
        return [0, 0];
    var lines = commands.split(/\r?\n/);
    var argRegex = /^[-/\\]/;
    var insertedServices = 0;
    var insertedConfigs = 0;
    var _loop_1 = function (line) {
        var _a = line.split(' '), command = _a[0], rest = _a.slice(1);
        var args = [];
        var configs = {};
        for (var i = 0; i < rest.length;) {
            // 以 - / \ 开头的认为是参数开始
            if (rest[i].match(argRegex)) {
                // 如果这一段是-xxx=xxx的形式，那么解析它
                if (rest[i].includes('=')) {
                    var index = rest[i].indexOf('=');
                    genConfig(rest[i].slice(0, index), rest[i].slice(index + 1), configs, args);
                    i++;
                    continue;
                }
                else if (rest[i + 1] && !rest[i + 1].match(argRegex)) {
                    genConfig(rest[i], rest[i + 1], configs, args);
                    i += 2;
                    continue;
                }
            }
            args.push({ key: rest[i] });
            i++;
        }
        var service = new Service_1.default(command, args);
        var services = ServiceManager_1.default.getServices();
        var foundService = services.find(function (serv) { return serv.isEqual(service); });
        var config = Object.keys(configs).length ? new Config_1.default('', configs) : null;
        // 服务已存在
        if (foundService) {
            if (config) {
                var configs_1 = ConfigManager_1.default.getConfigMap().get(foundService.uuid);
                if (configs_1) {
                    // 配置已存在
                    if (configs_1.some(function (conf) { return conf.isEqual(config); })) {
                        return "continue";
                    }
                    config.name = "imported-" + (configs_1.length + 1);
                }
                else {
                    config.name = "imported-1";
                }
                // 添加配置
                ConfigManager_1.default.addConfig(foundService.uuid, config);
                insertedConfigs++;
            }
        }
        else {
            // 添加服务
            ServiceManager_1.default.addService(service);
            if (config) {
                config.name = "imported-1";
                ConfigManager_1.default.addConfig(service.uuid, config);
                insertedServices++;
                insertedConfigs++;
            }
            else {
                insertedServices++;
            }
        }
    };
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        _loop_1(line);
    }
    return [insertedServices, insertedConfigs];
}
exports.guessFromCommandString = guessFromCommandString;
//# sourceMappingURL=Helper.js.map