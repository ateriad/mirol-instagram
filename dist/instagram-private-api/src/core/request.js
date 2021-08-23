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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const lodash_1 = require("lodash");
const crypto_1 = require("crypto");
const rxjs_1 = require("rxjs");
const attempt_1 = require("@lifeomic/attempt");
const request = __importStar(require("request-promise"));
const errors_1 = require("../errors");
const JSONbigInt = require("json-bigint");
const JSONbigString = JSONbigInt({ storeAsString: true });
const debug_1 = __importDefault(require("debug"));
class Request {
    constructor(client) {
        this.client = client;
        this.end$ = new rxjs_1.Subject();
        this.error$ = new rxjs_1.Subject();
        this.attemptOptions = {
            maxAttempts: 1,
        };
        this.defaults = {};
    }
    static requestTransform(body, response, resolveWithFullResponse) {
        try {
            // Sometimes we have numbers greater than Number.MAX_SAFE_INTEGER in json response
            // To handle it we just wrap numbers with length > 15 it double quotes to get strings instead
            response.body = JSONbigString.parse(body);
        }
        catch (e) {
            if (lodash_1.inRange(response.statusCode, 200, 299)) {
                throw e;
            }
        }
        return resolveWithFullResponse ? response : response.body;
    }
    send(userOptions, onlyCheckHttpStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: 'https://i.instagram.com/',
                resolveWithFullResponse: true,
                proxy: this.client.state.proxyUrl,
                simple: false,
                transform: Request.requestTransform,
                jar: this.client.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.getDefaultHeaders(),
                method: 'GET',
            }, this.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequest(options);
            this.updateState(response);
            process.nextTick(() => this.end$.next());
            if (response.body.status === 'ok' || (onlyCheckHttpStatus && response.statusCode === 200)) {
                return response;
            }
            const error = this.handleResponseError(response);
            process.nextTick(() => this.error$.next(error));
            throw error;
        });
    }
    updateState(response) {
        const { 'x-ig-set-www-claim': wwwClaim, 'ig-set-authorization': auth, 'ig-set-password-encryption-key-id': pwKeyId, 'ig-set-password-encryption-pub-key': pwPubKey, } = response.headers;
        if (typeof wwwClaim === 'string') {
            this.client.state.igWWWClaim = wwwClaim;
        }
        if (typeof auth === 'string' && !auth.endsWith(':')) {
            this.client.state.authorization = auth;
        }
        if (typeof pwKeyId === 'string') {
            this.client.state.passwordEncryptionKeyId = pwKeyId;
        }
        if (typeof pwPubKey === 'string') {
            this.client.state.passwordEncryptionPubKey = pwPubKey;
        }
    }
    signature(data) {
        return crypto_1.createHmac('sha256', this.client.state.signatureKey)
            .update(data)
            .digest('hex');
    }
    sign(payload) {
        const json = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        const signature = this.signature(json);
        return {
            ig_sig_key_version: this.client.state.signatureVersion,
            signed_body: `${signature}.${json}`,
        };
    }
    userBreadcrumb(size) {
        const term = lodash_1.random(2, 3) * 1000 + size + lodash_1.random(15, 20) * 1000;
        const textChangeEventCount = Math.round(size / lodash_1.random(2, 3)) || 1;
        const data = `${size} ${term} ${textChangeEventCount} ${Date.now()}`;
        const signature = Buffer.from(crypto_1.createHmac('sha256', this.client.state.userBreadcrumbKey)
            .update(data)
            .digest('hex')).toString('base64');
        const body = Buffer.from(data).toString('base64');
        return `${signature}\n${body}\n`;
    }
    handleResponseError(response) {
        Request.requestDebug(`Request ${response.request.method} ${response.request.uri.path} failed: ${typeof response.body === 'object' ? JSON.stringify(response.body) : response.body}`);
        const json = response.body;
        if (json.spam) {
            return new errors_1.IgActionSpamError(response);
        }
        if (response.statusCode === 404) {
            return new errors_1.IgNotFoundError(response);
        }
        if (typeof json.message === 'string') {
            if (json.message === 'challenge_required') {
                this.client.state.checkpoint = json;
                return new errors_1.IgCheckpointError(response);
            }
            if (json.message === 'user_has_logged_out') {
                return new errors_1.IgUserHasLoggedOutError(response);
            }
            if (json.message === 'login_required') {
                return new errors_1.IgLoginRequiredError(response);
            }
            if (json.message.toLowerCase() === 'not authorized to view user') {
                return new errors_1.IgPrivateUserError(response);
            }
        }
        if (json.error_type === 'sentry_block') {
            return new errors_1.IgSentryBlockError(response);
        }
        if (json.error_type === 'inactive user') {
            return new errors_1.IgInactiveUserError(response);
        }
        return new errors_1.IgResponseError(response);
    }
    faultTolerantRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield attempt_1.retry(() => __awaiter(this, void 0, void 0, function* () { return request(options); }), this.attemptOptions);
            }
            catch (err) {
                throw new errors_1.IgNetworkError(err);
            }
        });
    }
    getDefaultHeaders() {
        var _a;
        return {
            'User-Agent': this.client.state.appUserAgent,
            'X-Ads-Opt-Out': this.client.state.adsOptOut ? '1' : '0',
            // needed? 'X-DEVICE-ID': this.client.state.uuid,
            'X-CM-Bandwidth-KBPS': '-1.000',
            'X-CM-Latency': '-1.000',
            'X-IG-App-Locale': this.client.state.language,
            'X-IG-Device-Locale': this.client.state.language,
            'X-Pigeon-Session-Id': this.client.state.pigeonSessionId,
            'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
            'X-IG-Connection-Speed': `${lodash_1.random(1000, 3700)}kbps`,
            'X-IG-Bandwidth-Speed-KBPS': '-1.000',
            'X-IG-Bandwidth-TotalBytes-B': '0',
            'X-IG-Bandwidth-TotalTime-MS': '0',
            'X-IG-EU-DC-ENABLED': typeof this.client.state.euDCEnabled === 'undefined' ? void 0 : this.client.state.euDCEnabled.toString(),
            'X-IG-Extended-CDN-Thumbnail-Cache-Busting-Value': this.client.state.thumbnailCacheBustingValue.toString(),
            'X-Bloks-Version-Id': this.client.state.bloksVersionId,
            'X-MID': (_a = this.client.state.extractCookie('mid')) === null || _a === void 0 ? void 0 : _a.value,
            'X-IG-WWW-Claim': this.client.state.igWWWClaim || '0',
            'X-Bloks-Is-Layout-RTL': this.client.state.isLayoutRTL.toString(),
            'X-IG-Connection-Type': this.client.state.connectionTypeHeader,
            'X-IG-Capabilities': this.client.state.capabilitiesHeader,
            'X-IG-App-ID': this.client.state.fbAnalyticsApplicationId,
            'X-IG-Device-ID': this.client.state.uuid,
            'X-IG-Android-ID': this.client.state.deviceId,
            'Accept-Language': this.client.state.language.replace('_', '-'),
            'X-FB-HTTP-Engine': 'Liger',
            Authorization: this.client.state.authorization,
            Host: 'i.instagram.com',
            'Accept-Encoding': 'gzip',
            Connection: 'close',
        };
    }
}
exports.Request = Request;
Request.requestDebug = debug_1.default('ig:request');
//# sourceMappingURL=request.js.map