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
exports.IgtvRepository = void 0;
const repository_1 = require("../core/repository");
const lodash_1 = require("lodash");
const Chance = __importStar(require("chance"));
class IgtvRepository extends repository_1.Repository {
    writeSeenState(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/igtv/write_seen_state/',
                method: 'POST',
                form: this.client.request.sign({
                    seen_state: JSON.stringify(lodash_1.defaults(options, { impressions: {}, grid_impressions: [] })),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    search(query = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                // this is the same method in the app
                url: `/api/v1/igtv/${query && query.length > 0 ? 'search' : 'suggested_searches'}/`,
                method: 'GET',
                qs: {
                    query,
                },
            });
            return body;
        });
    }
    allUserSeries(user, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/igtv/series/all_user_series/${user}/`,
                method: 'GET',
                qs: this.client.request.sign(data),
            });
            return body;
        });
    }
    createSeries(title, description = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/igtv/series/create/`,
                method: 'POST',
                form: this.client.request.sign({
                    title,
                    description,
                    igtv_composer_session_id: new Chance().guid({ version: 4 }),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    seriesAddEpisode(series, mediaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/igtv/series/${series}/add_episode/`,
                method: 'POST',
                form: {
                    media_id: mediaId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
}
exports.IgtvRepository = IgtvRepository;
//# sourceMappingURL=igtv.repository.js.map