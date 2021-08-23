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
exports.MusicMoodFeed = void 0;
const feed_1 = require("../core/feed");
const class_transformer_1 = require("class-transformer");
class MusicMoodFeed extends feed_1.Feed {
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request();
            return response.items;
        });
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/music/moods/${this.id}/`,
                method: 'POST',
                form: {
                    cursor: this.nextCursor || '0',
                    _csrftoken: this.client.state.cookieCsrfToken,
                    product: this.product,
                    _uuid: this.client.state.uuid,
                    browse_session_id: this.client.state.clientSessionId,
                },
            });
            this.state = body;
            return body;
        });
    }
    set state(response) {
        this.nextCursor = response.page_info.next_max_id;
        this.moreAvailable = response.page_info.more_available;
    }
    isMoreAvailable() {
        return this.moreAvailable;
    }
}
__decorate([
    class_transformer_1.Expose()
], MusicMoodFeed.prototype, "nextCursor", void 0);
__decorate([
    class_transformer_1.Expose()
], MusicMoodFeed.prototype, "product", void 0);
__decorate([
    class_transformer_1.Expose()
], MusicMoodFeed.prototype, "id", void 0);
exports.MusicMoodFeed = MusicMoodFeed;
//# sourceMappingURL=music-mood.feed.js.map