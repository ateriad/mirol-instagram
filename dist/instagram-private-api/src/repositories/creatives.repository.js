"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreativesRepository = void 0;
const repository_1 = require("../core/repository");
class CreativesRepository extends repository_1.Repository {
    writeSupportedCapabilities() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/creatives/write_supported_capabilities/',
                method: 'POST',
                form: this.client.request.sign({
                    supported_capabilities_new: JSON.stringify(this.client.state.supportedCapabilities),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
}
exports.CreativesRepository = CreativesRepository;
//# sourceMappingURL=creatives.repository.js.map