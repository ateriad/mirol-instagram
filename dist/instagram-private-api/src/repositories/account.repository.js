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
exports.AccountRepository = void 0;
const repository_1 = require("../core/repository");
const errors_1 = require("../errors");
const lodash_1 = require("lodash");
const ig_signup_block_error_1 = require("../errors/ig-signup-block.error");
const Bluebird = require("bluebird");
const debug_1 = __importDefault(require("debug"));
const crypto = __importStar(require("crypto"));
class AccountRepository extends repository_1.Repository {
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client.state.passwordEncryptionPubKey) {
                yield this.client.qe.syncLoginExperiments();
            }
            const { encrypted, time } = this.encryptPassword(password);
            const response = yield Bluebird.try(() => this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/login/',
                form: this.client.request.sign({
                    username,
                    enc_password: `#PWD_INSTAGRAM:4:${time}:${encrypted}`,
                    guid: this.client.state.uuid,
                    phone_id: this.client.state.phoneId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    device_id: this.client.state.deviceId,
                    adid: this.client.state.adid,
                    google_tokens: '[]',
                    login_attempt_count: 0,
                    country_codes: JSON.stringify([{ country_code: '1', source: 'default' }]),
                    jazoest: AccountRepository.createJazoest(this.client.state.phoneId),
                }),
            })).catch(errors_1.IgResponseError, error => {
                if (error.response.body.two_factor_required) {
                    AccountRepository.accountDebug(`Login failed, two factor auth required: ${JSON.stringify(error.response.body.two_factor_info)}`);
                    throw new errors_1.IgLoginTwoFactorRequiredError(error.response);
                }
                switch (error.response.body.error_type) {
                    case 'bad_password': {
                        throw new errors_1.IgLoginBadPasswordError(error.response);
                    }
                    case 'invalid_user': {
                        throw new errors_1.IgLoginInvalidUserError(error.response);
                    }
                    default: {
                        throw error;
                    }
                }
            });
            return response.body.logged_in_user;
        });
    }
    static createJazoest(input) {
        const buf = Buffer.from(input, 'ascii');
        let sum = 0;
        for (let i = 0; i < buf.byteLength; i++) {
            sum += buf.readUInt8(i);
        }
        return `2${sum}`;
    }
    encryptPassword(password) {
        const randKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);
        const rsaEncrypted = crypto.publicEncrypt({
            key: Buffer.from(this.client.state.passwordEncryptionPubKey, 'base64').toString(),
            // @ts-ignore
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, randKey);
        const cipher = crypto.createCipheriv('aes-256-gcm', randKey, iv);
        const time = Math.floor(Date.now() / 1000).toString();
        cipher.setAAD(Buffer.from(time));
        const aesEncrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()]);
        const sizeBuffer = Buffer.alloc(2, 0);
        sizeBuffer.writeInt16LE(rsaEncrypted.byteLength, 0);
        const authTag = cipher.getAuthTag();
        return {
            time,
            encrypted: Buffer.concat([
                Buffer.from([1, this.client.state.passwordEncryptionKeyId]),
                iv,
                sizeBuffer,
                rsaEncrypted, authTag, aesEncrypted
            ])
                .toString('base64'),
        };
    }
    twoFactorLogin(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = lodash_1.defaultsDeep(options, {
                trustThisDevice: '1',
                verificationMethod: '1',
            });
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/two_factor_login/',
                method: 'POST',
                form: this.client.request.sign({
                    verification_code: options.verificationCode,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    two_factor_identifier: options.twoFactorIdentifier,
                    username: options.username,
                    trust_this_device: options.trustThisDevice,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                    verification_method: options.verificationMethod,
                }),
            });
            return body;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/logout/',
                form: {
                    guid: this.client.state.uuid,
                    phone_id: this.client.state.phoneId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    device_id: this.client.state.deviceId,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    create({ username, password, email, first_name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield Bluebird.try(() => this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/create/',
                form: this.client.request.sign({
                    username,
                    password,
                    email,
                    first_name,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    force_sign_up_code: '',
                    qs_stamp: '',
                    waterfall_id: this.client.state.uuid,
                    sn_nonce: '',
                    sn_result: '',
                }),
            })).catch(errors_1.IgResponseError, error => {
                switch (error.response.body.error_type) {
                    case 'signup_block': {
                        AccountRepository.accountDebug('Signup failed');
                        throw new ig_signup_block_error_1.IgSignupBlockError(error.response);
                    }
                    default: {
                        throw error;
                    }
                }
            });
            return body;
        });
    }
    currentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/current_user/',
                qs: {
                    edit: true,
                },
            });
            return body.user;
        });
    }
    setBiography(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/set_biography/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    device_id: this.client.state.deviceId,
                    _uuid: this.client.state.uuid,
                    raw_text: text,
                }),
            });
            return body.user;
        });
    }
    changeProfilePicture(picture) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = Date.now().toString();
            yield this.client.upload.photo({
                file: picture,
                uploadId,
            });
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/change_profile_picture/',
                method: 'POST',
                form: {
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uuid: this.client.state.uuid,
                    use_fbuploader: true,
                    upload_id: uploadId,
                },
            });
            return body;
        });
    }
    editProfile(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/edit_profile/',
                method: 'POST',
                form: this.client.request.sign(Object.assign(Object.assign({}, options), { _csrftoken: this.client.state.cookieCsrfToken, _uid: this.client.state.cookieUserId, device_id: this.client.state.deviceId, _uuid: this.client.state.uuid })),
            });
            return body.user;
        });
    }
    changePassword(oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/change_password/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                    old_password: oldPassword,
                    new_password1: newPassword,
                    new_password2: newPassword,
                }),
            });
            return body;
        });
    }
    removeProfilePicture() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.command('remove_profile_picture');
        });
    }
    setPrivate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.command('set_private');
        });
    }
    setPublic() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.command('set_public');
        });
    }
    command(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/accounts/${command}/`,
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    _uuid: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    readMsisdnHeader(usage = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/read_msisdn_header/',
                headers: {
                    'X-DEVICE-ID': this.client.state.uuid,
                },
                form: this.client.request.sign({
                    mobile_subno_usage: usage,
                    device_id: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    msisdnHeaderBootstrap(usage = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/msisdn_header_bootstrap/',
                form: this.client.request.sign({
                    mobile_subno_usage: usage,
                    device_id: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    contactPointPrefill(usage = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/contact_point_prefill/',
                form: this.client.request.sign({
                    phone_id: this.client.state.phoneId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    usage,
                }),
            });
            return body;
        });
    }
    getPrefillCandidates() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/get_prefill_candidates/',
                form: this.client.request.sign({
                    android_device_id: this.client.state.deviceId,
                    usages: '["account_recovery_omnibox"]',
                    device_id: this.client.state.uuid,
                }),
            });
            return body;
        });
    }
    processContactPointSignals() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/api/v1/accounts/process_contact_point_signals/',
                form: this.client.request.sign({
                    phone_id: this.client.state.phoneId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    _uid: this.client.state.cookieUserId,
                    device_id: this.client.state.uuid,
                    _uuid: this.client.state.uuid,
                    google_tokens: '[]',
                }),
            });
            return body;
        });
    }
    sendRecoveryFlowEmail(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/accounts/send_recovery_flow_email/',
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    adid: '' /*this.client.state.adid ? not available on pre-login?*/,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                    query,
                }),
            });
            return body;
        });
    }
}
exports.AccountRepository = AccountRepository;
AccountRepository.accountDebug = debug_1.default('ig:account');
//# sourceMappingURL=account.repository.js.map