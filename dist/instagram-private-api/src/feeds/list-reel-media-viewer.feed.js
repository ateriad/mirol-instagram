"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.ListReelMediaViewerFeed = void 0;
const feed_1 = require("../core/feed");
const class_transformer_1 = require("class-transformer");
class ListReelMediaViewerFeed extends feed_1.Feed {
    constructor() {
        super(...arguments);
        this.nextMaxId = undefined;
    }
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request();
            return res.users;
        });
    }
    set state(response) {
        this.nextMaxId = response.next_max_id;
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/media/${this.mediaId}/list_reel_media_viewer`,
                method: 'GET',
                qs: {
                    supported_capabilities_new: this.client.state.supportedCapabilities,
                    max_id: this.nextMaxId,
                },
            });
            this.state = body;
            return body;
        });
    }
    isMoreAvailable() {
        return this.nextMaxId !== null;
    }
}
__decorate([
    class_transformer_1.Expose()
], ListReelMediaViewerFeed.prototype, "mediaId", void 0);
__decorate([
    class_transformer_1.Expose()
], ListReelMediaViewerFeed.prototype, "nextMaxId", void 0);
exports.ListReelMediaViewerFeed = ListReelMediaViewerFeed;
//# sourceMappingURL=list-reel-media-viewer.feed.js.map