"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgClientError = void 0;
const ts_custom_error_1 = require("ts-custom-error");
class IgClientError extends ts_custom_error_1.CustomError {
    constructor(message = 'Instagram API error was made.') {
        super(message);
        // Fix for ts-custom-error. Otherwise console.error will show JSON instead of just stack trace
        Object.defineProperty(this, 'name', {
            value: new.target.name,
            enumerable: false,
        });
    }
}
exports.IgClientError = IgClientError;
//# sourceMappingURL=ig-client.error.js.map