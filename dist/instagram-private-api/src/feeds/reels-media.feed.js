"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.ReelsMediaFeed = void 0;
const feed_1 = require("../core/feed");
const SUPPORTED_CAPABILITIES = __importStar(require("../samples/supported-capabilities.json"));
class ReelsMediaFeed extends feed_1.Feed {
    constructor() {
        super(...arguments);
        this.source = 'feed_timeline';
    }
    set state(body) { }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/feed/reels_media/`,
                method: 'POST',
                form: this.client.request.sign({
                    user_ids: this.userIds,
                    source: this.source,
                    _uuid: this.client.state.uuid,
                    _uid: this.client.state.cookieUserId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    device_id: this.client.state.deviceId,
                    supported_capabilities_new: JSON.stringify(SUPPORTED_CAPABILITIES),
                }),
            });
            return body;
        });
    }
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield this.request();
            return Object.values(body.reels).reduce((accumulator, current) => accumulator.concat(current.items), []);
        });
    }
}
exports.ReelsMediaFeed = ReelsMediaFeed;
//# sourceMappingURL=reels-media.feed.js.map