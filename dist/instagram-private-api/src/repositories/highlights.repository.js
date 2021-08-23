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
exports.HighlightsRepository = void 0;
const repository_1 = require("../core/repository");
class HighlightsRepository extends repository_1.Repository {
    highlightsTray(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/highlights/${userId}/highlights_tray/`,
                method: 'GET',
                qs: {
                    supported_capabilities_new: JSON.stringify(this.client.state.supportedCapabilities),
                    phone_id: this.client.state.phoneId,
                    battery_level: this.client.state.batteryLevel,
                    is_charging: Number(this.client.state.isCharging),
                    will_sound_on: 0,
                },
            });
            return body;
        });
    }
    createReel(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/highlights/create_reel/',
                method: 'POST',
                form: this.client.request.sign({
                    supported_capabilities_new: JSON.stringify(this.client.state.supportedCapabilities),
                    source: options.source || 'story_viewer_profile',
                    creation_id: Date.now().toString(),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                    cover: JSON.stringify({
                        media_id: options.coverId || options.mediaIds[0],
                    }),
                    title: options.title,
                    media_ids: JSON.stringify(options.mediaIds),
                }),
            });
            return body;
        });
    }
    editReel(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/highlights/${options.highlightId}/edit_reel/`,
                method: 'POST',
                form: this.client.request.sign({
                    supported_capabilities_new: JSON.stringify(this.client.state.supportedCapabilities),
                    source: options.source || 'story_viewer_default',
                    added_media_ids: JSON.stringify(options.added || []),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                    cover: JSON.stringify({
                        media_id: options.coverId,
                    }),
                    title: options.title,
                    removed_media_ids: JSON.stringify(options.removed || []),
                }),
            });
            return body;
        });
    }
    deleteReel(highlightId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/highlights/${highlightId}/delete_reel/`,
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
}
exports.HighlightsRepository = HighlightsRepository;
//# sourceMappingURL=highlights.repository.js.map