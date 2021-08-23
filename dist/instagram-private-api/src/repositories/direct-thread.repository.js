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
exports.DirectThreadRepository = void 0;
const repository_1 = require("../core/repository");
const Chance = require("chance");
class DirectThreadRepository extends repository_1.Repository {
    approve(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/approve/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    approveMultiple(threadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/direct_v2/threads/approve_multiple/',
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    thread_ids: JSON.stringify(threadIds),
                },
            });
            return body;
        });
    }
    decline(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/decline/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    declineMultiple(threadIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/direct_v2/threads/decline_multiple/',
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    thread_ids: JSON.stringify(threadIds),
                },
            });
            return body;
        });
    }
    declineAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/decline_all/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    approveParticipantRequests(threadId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/approve_participant_requests/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    user_ids: JSON.stringify(userIds),
                    share_join_chat_story: true,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    // move to direct-repo?
    getByParticipants(recipientUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/direct_v2/threads/get_by_participants/',
                method: 'GET',
                qs: {
                    recipient_users: JSON.stringify(recipientUsers),
                },
            });
            return body;
        });
    }
    updateTitle(threadId, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/update_title/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    title,
                },
            });
            return body;
        });
    }
    mute(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/mute/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    unmute(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/unmute/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    addUser(threadId, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/add_user/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    user_ids: JSON.stringify(userIds),
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    leave(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/leave/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    hide(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/hide/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    use_unified_inbox: true,
                },
            });
            return body;
        });
    }
    markItemSeen(threadId, threadItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/items/${threadItemId}/seen/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    use_unified_inbox: true,
                    action: 'mark_seen',
                    thread_id: threadId,
                    item_id: threadItemId,
                },
            });
            return body;
        });
    }
    broadcast(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const mutationToken = new Chance().guid();
            const recipients = options.threadIds || options.userIds;
            const recipientsType = options.threadIds ? 'thread_ids' : 'recipient_users';
            const recipientsIds = recipients instanceof Array ? recipients : [recipients];
            const form = Object.assign({ action: 'send_item', [recipientsType]: JSON.stringify(recipientsType === 'thread_ids' ? recipientsIds : [recipientsIds]), client_context: mutationToken, _csrftoken: this.client.state.cookieCsrfToken, device_id: this.client.state.deviceId, mutation_token: mutationToken, _uuid: this.client.state.uuid }, options.form);
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/broadcast/${options.item}/`,
                method: 'POST',
                form: options.signed ? this.client.request.sign(form) : form,
                qs: options.qs,
            });
            return body;
        });
    }
    deleteItem(threadId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/threads/${threadId}/items/${itemId}/delete/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
}
exports.DirectThreadRepository = DirectThreadRepository;
//# sourceMappingURL=direct-thread.repository.js.map