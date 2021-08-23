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
exports.DiscoverRepository = void 0;
const repository_1 = require("../core/repository");
class DiscoverRepository extends repository_1.Repository {
    /**
     * Gets the suggestions based on a user
     * @param targetId user id/pk
     */
    chaining(targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/discover/chaining/',
                qs: {
                    target_id: targetId,
                },
            });
            return body;
        });
    }
    topicalExplore() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/discover/topical_explore/',
                qs: {
                    is_prefetch: true,
                    omit_cover_media: false,
                    use_sectional_payload: true,
                    timezone_offset: this.client.state.timezoneOffset,
                    session_id: this.client.state.clientSessionId,
                    include_fixed_destinations: false,
                },
            });
            return body;
        });
    }
    markSuSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/discover/mark_su_seen/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    profileSuBadge() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/discover/profile_su_badge/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
}
exports.DiscoverRepository = DiscoverRepository;
//# sourceMappingURL=discover.repository.js.map