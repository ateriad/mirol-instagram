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
exports.UserRepository = void 0;
const repository_1 = require("../core/repository");
const errors_1 = require("../errors");
const lodash_1 = require("lodash");
const Chance = __importStar(require("chance"));
class UserRepository extends repository_1.Repository {
    info(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/${id}/info/`,
            });
            return body.user;
        });
    }
    arlinkDownloadInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/arlink_download_info/`,
                qs: {
                    version_override: '2.0.2',
                },
            });
            return body.user;
        });
    }
    search(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/search/`,
                qs: {
                    timezone_offset: this.client.state.timezoneOffset,
                    q: username,
                    count: 30,
                },
            });
            return body;
        });
    }
    searchExact(username) {
        return __awaiter(this, void 0, void 0, function* () {
            username = username.toLowerCase();
            const result = yield this.search(username);
            const users = result.users;
            const account = users.find(user => user.username === username);
            if (!account) {
                throw new errors_1.IgExactUserNotFoundError();
            }
            return account;
        });
    }
    accountDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            id = id || this.client.state.cookieUserId;
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/${id}/account_details/`,
            });
            return body;
        });
    }
    formerUsernames(id) {
        return __awaiter(this, void 0, void 0, function* () {
            id = id || this.client.state.cookieUserId;
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/${id}/former_usernames/`,
            });
            return body;
        });
    }
    sharedFollowerAccounts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/${id}/shared_follower_accounts/`,
            });
            return body;
        });
    }
    flagUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/users/${id}/flag_user/`,
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                    reason_id: 1,
                    user_id: id,
                    source_name: 'profile',
                    is_spam: true,
                },
            });
            return body;
        });
    }
    getIdByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.searchExact(username);
            return user.pk;
        });
    }
    lookup(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = lodash_1.defaults(options, {
                waterfallId: new Chance().guid({ version: 4 }),
                directlySignIn: true,
                countryCodes: [{ country_code: '1', source: ['default'] }],
            });
            const { body } = yield this.client.request.send({
                url: '/api/v1/users/lookup/',
                method: 'POST',
                form: this.client.request.sign({
                    country_codes: JSON.stringify(options.countryCodes),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    q: options.query,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                    waterfall_id: options.waterfallId,
                    directly_sign_in: options.directlySignIn.toString(),
                }),
            });
            return body;
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map