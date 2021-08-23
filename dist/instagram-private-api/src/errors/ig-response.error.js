"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgResponseError = void 0;
const ig_client_error_1 = require("./ig-client.error");
const decorators_1 = require("../decorators");
class IgResponseError extends ig_client_error_1.IgClientError {
    constructor(response) {
        super(`${response.request.method} ${response.request.uri.path} - ${response.statusCode} ${response.statusMessage}; ${response.body.message || ''}`);
        this.response = response;
        if (response.body.message) {
            this.text = response.body.message;
        }
    }
}
__decorate([
    decorators_1.Enumerable(false)
], IgResponseError.prototype, "text", void 0);
__decorate([
    decorators_1.Enumerable(false)
], IgResponseError.prototype, "response", void 0);
exports.IgResponseError = IgResponseError;
//# sourceMappingURL=ig-response.error.js.map