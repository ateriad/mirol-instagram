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
exports.MediaStickerResponsesFeed = void 0;
const feed_1 = require("../core/feed");
const class_transformer_1 = require("class-transformer");
class MediaStickerResponsesFeed extends feed_1.Feed {
    constructor() {
        super(...arguments);
        this.maxId = undefined;
    }
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request();
            return response[this.rootName][this.itemName];
        });
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/media/${this.mediaId}/${this.stickerId}/${this.name}/`,
                method: 'GET',
                qs: {
                    max_id: this.maxId || void 0,
                },
            });
            this.state = body;
            return body;
        });
    }
    set state(response) {
        this.maxId = response[this.rootName].max_id;
        this.moreAvailable = response[this.rootName].more_available;
    }
}
__decorate([
    class_transformer_1.Expose()
], MediaStickerResponsesFeed.prototype, "maxId", void 0);
exports.MediaStickerResponsesFeed = MediaStickerResponsesFeed;
//# sourceMappingURL=media.sticker-responses.feed.js.map