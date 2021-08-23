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
exports.ReelsTrayFeed = void 0;
const feed_1 = require("../core/feed");
class ReelsTrayFeed extends feed_1.Feed {
    set state(response) { }
    /**
     * Returns only the stories (without the broadcasts)
     */
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.request();
            return response.tray;
        });
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/feed/reels_tray/',
                method: 'POST',
                form: {
                    supported_capabilities_new: this.client.state.supportedCapabilities,
                    reason: this.reason,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            this.state = body;
            return body;
        });
    }
}
exports.ReelsTrayFeed = ReelsTrayFeed;
//# sourceMappingURL=reels-tray.feed.js.map