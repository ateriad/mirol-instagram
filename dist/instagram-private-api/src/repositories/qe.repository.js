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
exports.QeRepository = void 0;
const repository_1 = require("../core/repository");
class QeRepository extends repository_1.Repository {
    syncExperiments() {
        return this.sync(this.client.state.experiments);
    }
    syncLoginExperiments() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sync(this.client.state.loginExperiments);
        });
    }
    sync(experiments) {
        return __awaiter(this, void 0, void 0, function* () {
            let data;
            try {
                const uid = this.client.state.cookieUserId;
                data = {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    id: uid,
                    _uid: uid,
                    _uuid: this.client.state.uuid,
                };
            }
            catch (_a) {
                data = {
                    id: this.client.state.uuid,
                };
            }
            data = Object.assign(data, { experiments });
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/qe/sync/',
                headers: {
                    'X-DEVICE-ID': this.client.state.uuid,
                },
                form: this.client.request.sign(data),
            });
            return body;
        });
    }
}
exports.QeRepository = QeRepository;
//# sourceMappingURL=qe.repository.js.map