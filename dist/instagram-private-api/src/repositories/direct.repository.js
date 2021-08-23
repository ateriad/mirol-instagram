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
exports.DirectRepository = void 0;
const repository_1 = require("../core/repository");
class DirectRepository extends repository_1.Repository {
    createGroupThread(recipientUsers, threadTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/direct_v2/create_group_thread/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    _uid: this.client.state.cookieUserId,
                    recipient_users: JSON.stringify(recipientUsers),
                    thread_title: threadTitle,
                }),
            });
            return body;
        });
    }
    rankedRecipients(mode = 'raven', query = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/direct_v2/ranked_recipients/',
                method: 'GET',
                qs: {
                    mode,
                    query,
                    show_threads: true,
                },
            });
            return body;
        });
    }
    getPresence() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/direct_v2/get_presence/',
                method: 'GET',
            });
            return body;
        });
    }
}
exports.DirectRepository = DirectRepository;
//# sourceMappingURL=direct.repository.js.map