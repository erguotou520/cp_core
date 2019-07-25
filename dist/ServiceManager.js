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
var Service_1 = __importDefault(require("./Service"));
var services = [];
var ServiceManager = /** @class */ (function (_super) {
    __extends(ServiceManager, _super);
    function ServiceManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 获取服务列表
    ServiceManager.prototype.getServices = function () {
        return services;
    };
    // 初始化设置服务-配置列表
    ServiceManager.prototype.setServices = function (_services) {
        services = _services;
    };
    // 添加服务
    ServiceManager.prototype.addService = function (service) {
        if (services.some(function (serv) { return serv.isEqual(service); })) {
            return false;
        }
        services.push(service);
        this.emit('insert', service);
        return true;
    };
    // 更新服务
    ServiceManager.prototype.updateService = function (index, newService) {
        if (index < 0 || index > services.length - 1) {
            return false;
        }
        services.splice(index, 1, newService);
        this.emit('update', index, newService);
        return true;
    };
    // 删除服务
    ServiceManager.prototype.removeService = function (index) {
        if (index < 0 || index > services.length - 1) {
            return false;
        }
        var service = services.splice(index, 1)[0];
        this.emit('remove', index, service);
        return true;
    };
    // 服务排序
    ServiceManager.prototype.sortService = function (oldIndex, newIndex) {
        if (oldIndex < 0 || oldIndex > services.length - 1 || newIndex < 0 || newIndex > services.length - 1) {
            return false;
        }
        var serv = services.splice(oldIndex, 1)[0];
        services.splice(newIndex, 0, serv);
        this.emit('update:all', services);
        return true;
    };
    // 导出服务列表
    ServiceManager.prototype.exportServices = function () {
        return services.map(function (service) { return Service_1.default.toJSON(service); });
    };
    // 导入服务列表
    ServiceManager.prototype.importServices = function (json) {
        var validServices = json.reduce(function (arr, obj) {
            var service = Service_1.default.fromJSON(obj);
            if (service.isValid()) {
                arr.push(service);
            }
            return arr;
        }, []);
        services.push.apply(services, validServices);
        return validServices.length;
    };
    return ServiceManager;
}(events_1.EventEmitter));
exports.default = new ServiceManager();
//# sourceMappingURL=ServiceManager.js.map