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
exports.LiveRepository = void 0;
const repository_1 = require("../core/repository");
const Chance = require("chance");
class LiveRepository extends repository_1.Repository {
    muteComment(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/mute_comment/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    getComment({ broadcastId, commentsRequested = 4, lastCommentTs, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/get_comment/`,
                method: 'GET',
                qs: {
                    num_comments_requested: commentsRequested,
                    last_comment_ts: lastCommentTs || 0,
                },
            });
            return body;
        });
    }
    heartbeatAndGetViewerCount(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/heartbeat_and_get_viewer_count/`,
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    offset_to_video_start: 0,
                    _uuid: this.client.state.uuid,
                },
                method: 'POST',
            });
            return body;
        });
    }
    info(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/info/`,
                method: 'GET',
            });
            return body;
        });
    }
    getFinalViewerList(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `api/v1/live/${broadcastId}/get_final_viewer_list/`,
                method: 'GET',
            });
            return body;
        });
    }
    unmuteComment(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/unmute_comment/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    create({ previewHeight = 1184, previewWidth = 720, message = '', }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/live/create/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    preview_width: previewWidth,
                    preview_height: previewHeight,
                    broadcast_message: message,
                    // const?
                    broadcast_type: 'RTMP',
                    internal_only: 0,
                }),
            });
            return body;
        });
    }
    getViewerList(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/get_viewer_list/`,
                method: 'GET',
            });
            return body;
        });
    }
    createQuestion(broadcastId, question) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: not enabled?
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/questions/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    text: question,
                },
            });
            return body;
        });
    }
    activateQuestion(broadcastId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: not working on client / while using obs -> useless?
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/question/${questionId}/activate/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    deactivateQuestion(broadcastId, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/question/${questionId}/deactivate/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    getQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/live/get_questions/',
                method: 'GET',
            });
            return body;
        });
    }
    wave(broadcastId, viewerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/wave/`,
                method: 'POST',
                form: this.client.request.sign({
                    viewer_id: viewerId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    like(broadcastId, likeCount = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/like/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                    user_like_count: likeCount,
                }),
            });
            return body;
        });
    }
    getLikeCount(broadcastId, likeTs = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/get_like_count/`,
                method: 'GET',
                qs: {
                    like_ts: likeTs,
                },
            });
            return body;
        });
    }
    getPostLiveThumbnails(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/get_post_live_thumbnails/`,
                method: 'GET',
                qs: {
                    signed_body: this.client.request.sign({}),
                },
            });
            return body;
        });
    }
    resumeBroadcastAfterContentMatch(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: test
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/resume_broadcast_after_content_match/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    getJoinRequestCounts({ broadcastId, lastTotalCount = 0, lastSeenTs = 0, lastFetchTs = 0, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/get_join_request_counts/`,
                method: 'GET',
                qs: {
                    last_total_count: lastTotalCount,
                    last_seen_ts: lastSeenTs,
                    last_fetch_ts: lastFetchTs,
                },
            });
            return body;
        });
    }
    start(broadcastId, sendNotifications = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/start/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    should_send_notifications: sendNotifications,
                }),
            });
            return body;
        });
    }
    addPostLiveToIgtv({ broadcastId, title, description, coverUploadId, igtvSharePreviewToFeed = false, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/add_post_live_to_igtv/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    broadcast_id: broadcastId,
                    cover_upload_id: coverUploadId,
                    description: description,
                    title: title,
                    internal_only: false,
                    igtv_share_preview_to_feed: igtvSharePreviewToFeed,
                }),
            });
            return body;
        });
    }
    endBroadcast(broadcastId, endAfterCopyrightWarning = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/end_broadcast/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                    end_after_copyright_warning: endAfterCopyrightWarning,
                }),
            });
            return body;
        });
    }
    comment(broadcastId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/comment/`,
                method: 'POST',
                form: this.client.request.sign({
                    user_breadcrumb: this.client.request.userBreadcrumb(message.length),
                    idempotence_token: new Chance().guid(),
                    comment_text: message,
                    live_or_vod: '1',
                    offset_to_video_start: '0',
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    pinComment(broadcastId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/pin_comment/`,
                method: 'POST',
                form: this.client.request.sign({
                    offset_to_video_start: 0,
                    comment_id: commentId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    unpinComment(broadcastId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/unpin_comment/`,
                method: 'POST',
                form: this.client.request.sign({
                    offset_to_video_start: 0,
                    comment_id: commentId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    getLiveQuestions(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/questions/`,
                method: 'POST',
                form: this.client.request.sign({
                    sources: 'story_and_live',
                }),
            });
            return body;
        });
    }
    addToPostLive(broadcastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/live/${broadcastId}/add_to_post_live/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    /**
     * Shows all online users, ready to watch your stream
     */
    getLivePresence() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/live/get_live_presence/',
                method: 'GET',
            });
            return body;
        });
    }
}
exports.LiveRepository = LiveRepository;
//# sourceMappingURL=live.repository.js.map