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
exports.RestrictActionRepository = void 0;
const repository_1 = require("../core/repository");
class RestrictActionRepository extends repository_1.Repository {
    restrict(targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/restrict_action/restrict/',
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    target_user_id: targetUserId,
                },
            });
            return body;
        });
    }
    unrestrict(targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/restrict_action/unrestrict/',
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    target_user_id: targetUserId,
                },
            });
            return body;
        });
    }
}
exports.RestrictActionRepository = RestrictActionRepository;
//# sourceMappingURL=restrict-action.repository.js.map