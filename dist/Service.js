"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var CPService = /** @class */ (function () {
    function CPService(name, command, args) {
        this.name = name;
        this.uuid = uuid_1.v4();
        this.command = command;
        this.args = args;
    }
    // 是否相等
    CPService.prototype.isEqual = function (another) {
        // 命令相同且key的列表都一样
        return this.command === another.command && this.args.length === another.args.length && this.args.every(function (arg) { return another.args.map(function (a) { return a.key; }).includes(arg.key); });
    };
    // 是否有效
    CPService.prototype.isValid = function () {
        return !!this.command;
    };
    // 转json
    CPService.toJSON = function (service) {
        return service;
    };
    // 从json转回来
    CPService.fromJSON = function (json) {
        var service = Object.create(CPService.prototype);
        Object.assign(service, json);
        return service;
    };
    return CPService;
}());
exports.default = CPService;
//# sourceMappingURL=Service.js.map