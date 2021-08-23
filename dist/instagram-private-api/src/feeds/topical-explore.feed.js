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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.TopicalExploreFeed = void 0;
const feed_1 = require("../core/feed");
const class_transformer_1 = require("class-transformer");
const Chance = __importStar(require("chance"));
const chance = new Chance();
class TopicalExploreFeed extends feed_1.Feed {
    constructor() {
        super(...arguments);
        this.module = 'explore_popular';
        /**
         * Change this to set the category
         */
        this.clusterId = 'explore_all:0';
        this.sessionId = chance.guid({ version: 4 });
    }
    set state(body) {
        this.nextMaxId = body.next_max_id;
        this.moreAvailable = body.more_available;
    }
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request();
            return res.sectional_items;
        });
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/discover/topical_explore/',
                method: 'GET',
                qs: {
                    is_prefetch: false,
                    omit_cover_media: true,
                    max_id: this.nextMaxId,
                    module: this.module,
                    reels_configuration: 'hide_hero',
                    use_sectional_payload: true,
                    timezone_offset: this.client.state.timezoneOffset,
                    lat: this.lat,
                    lng: this.lng,
                    cluster_id: this.clusterId,
                    session_id: this.sessionId,
                    include_fixed_destinations: true,
                },
            });
            return body;
        });
    }
}
__decorate([
    class_transformer_1.Expose()
], TopicalExploreFeed.prototype, "nextMaxId", void 0);
exports.TopicalExploreFeed = TopicalExploreFeed;
//# sourceMappingURL=topical-explore.feed.js.map