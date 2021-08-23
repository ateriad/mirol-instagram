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
exports.DirectInboxFeed = void 0;
const class_transformer_1 = require("class-transformer");
const feed_1 = require("../core/feed");
class DirectInboxFeed extends feed_1.Feed {
    set state(body) {
        this.moreAvailable = body.inbox.has_older;
        this.seqId = body.seq_id;
        this.cursor = body.inbox.oldest_cursor;
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/direct_v2/inbox/`,
                qs: {
                    visual_message_return_type: 'unseen',
                    cursor: this.cursor,
                    direction: this.cursor ? 'older' : void 0,
                    seq_id: this.seqId,
                    thread_message_limit: 10,
                    persistentBadging: true,
                    limit: 20,
                },
            });
            this.state = body;
            return body;
        });
    }
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request();
            return response.inbox.threads;
        });
    }
    records() {
        return __awaiter(this, void 0, void 0, function* () {
            const threads = yield this.items();
            return threads.map(thread => this.client.entity.directThread(thread.thread_id));
        });
    }
}
__decorate([
    class_transformer_1.Expose()
], DirectInboxFeed.prototype, "cursor", void 0);
__decorate([
    class_transformer_1.Expose()
], DirectInboxFeed.prototype, "seqId", void 0);
exports.DirectInboxFeed = DirectInboxFeed;
//# sourceMappingURL=direct-inbox.feed.js.map