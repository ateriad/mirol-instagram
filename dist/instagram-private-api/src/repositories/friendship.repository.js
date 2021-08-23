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
exports.FriendshipRepository = void 0;
const repository_1 = require("../core/repository");
class FriendshipRepository extends repository_1.Repository {
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/friendships/show/${id}/`,
            });
            return body;
        });
    }
    showMany(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/friendships/show_many/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    user_ids: userIds.join(),
                    _uuid: this.client.state.uuid,
                },
            });
            return body.friendship_statuses;
        });
    }
    block(id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('block', id, mediaIdAttribution);
        });
    }
    unblock(id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('unblock', id, mediaIdAttribution);
        });
    }
    create(id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('create', id, mediaIdAttribution);
        });
    }
    destroy(id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('destroy', id, mediaIdAttribution);
        });
    }
    approve(id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('approve', id, mediaIdAttribution);
        });
    }
    deny(id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('ignore', id, mediaIdAttribution);
        });
    }
    removeFollower(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.change('remove_follower', id);
        });
    }
    change(action, id, mediaIdAttribution) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/friendships/${action}/${id}/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    user_id: id,
                    radio_type: this.client.state.radioType,
                    _uid: this.client.state.cookieUserId,
                    device_id: this.client.state.deviceId,
                    _uuid: this.client.state.uuid,
                    media_id_attribution: mediaIdAttribution,
                }),
            });
            return body.friendship_status;
        });
    }
    setBesties(input = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/friendships/set_besties/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    device_id: this.client.state.deviceId,
                    _uuid: this.client.state.uuid,
                    module: 'favorites_home_list',
                    source: 'audience_manager',
                    add: input.add,
                    remove: input.remove,
                }),
            });
            return body.friendship_statuses;
        });
    }
    mutePostsOrStoryFromFollow(options) {
        return this.changeMuteFromFollow('mute', {
            media_id: options.mediaId,
            target_reel_author_id: options.targetReelAuthorId,
            target_posts_author_id: options.targetPostsAuthorId,
        });
    }
    unmutePostsOrStoryFromFollow(options) {
        return this.changeMuteFromFollow('unmute', {
            target_reel_author_id: options.targetReelAuthorId,
            target_posts_author_id: options.targetPostsAuthorId,
        });
    }
    changeMuteFromFollow(mode, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/friendships/${mode}_posts_or_story_from_follow/`,
                method: 'POST',
                form: Object.assign({ _csrftoken: this.client.state.cookieCsrfToken, _uid: this.client.state.cookieUserId, _uuid: this.client.state.uuid }, options),
            });
            return body;
        });
    }
}
exports.FriendshipRepository = FriendshipRepository;
//# sourceMappingURL=friendship.repository.js.map