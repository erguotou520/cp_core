"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var CPConfig = /** @class */ (function () {
    function CPConfig(name, configs, group) {
        this.uuid = uuid_1.v4();
        this.name = name;
        this.configs = configs;
        this.group = group;
    }
    // 是否相等
    CPConfig.prototype.isEqual = function (another) {
        var _this = this;
        return Object.keys(this.configs).every(function (key) {
            return another.configs[key] === _this.configs[key];
        });
    };
    // 是否有效
    CPConfig.prototype.isValid = function () {
        return !!(this.uuid && this.name);
    };
    // 转json
    CPConfig.toJSON = function (config) {
        return config;
    };
    // 从json转回来
    CPConfig.fromJSON = function (json) {
        var config = Object.create(CPConfig.prototype);
        Object.assign(config, json);
        return config;
    };
    return CPConfig;
}());
exports.default = CPConfig;
//# sourceMappingURL=Config.js.map