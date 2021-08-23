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
exports.ChallengeRepository = void 0;
const repository_1 = require("../core/repository");
const errors_1 = require("../errors");
/**
 * All methods expects [[State.checkpoint]] to be filled with [[CheckpointResponse]].
 * It is filled in automatically when [[IgCheckpointError]] occurs.
 */
class ChallengeRepository extends repository_1.Repository {
    /**
     * Get challenge state.
     */
    state() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: this.client.state.challengeUrl,
                qs: {
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                },
            });
            this.middleware(body);
            return body;
        });
    }
    /**
     * Select verification method.
     * @param choice Verification method. Phone number = 0, email = 1
     * @param isReplay resend code
     */
    selectVerifyMethod(choice, isReplay = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.client.state.challengeUrl;
            if (isReplay) {
                url = url.replace('/challenge/', '/challenge/replay/');
            }
            const { body } = yield this.client.request.send({
                url,
                method: 'POST',
                form: this.client.request.sign({
                    choice,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                }),
            });
            this.middleware(body);
            return body;
        });
    }
    /**
     * «Didn't receive your code? Get a new one»
     * @param choice Verification method. Phone number = 0, email = 1
     */
    replay(choice) {
        return this.selectVerifyMethod(choice, true);
    }
    /**
     * «We detected an unusual login attempt»
     * @param choice It was me = 0, It wasn't me = 1
     */
    deltaLoginReview(choice) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.selectVerifyMethod(choice);
        });
    }
    sendPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: this.client.state.challengeUrl,
                method: 'POST',
                form: this.client.request.sign({
                    phone_number: String(phoneNumber),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                }),
            });
            this.middleware(body);
            return body;
        });
    }
    auto(reset = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client.state.checkpoint) {
                throw new errors_1.IgNoCheckpointError();
            }
            if (reset) {
                yield this.reset();
            }
            if (!this.client.state.challenge) {
                yield this.state();
            }
            const challenge = this.client.state.challenge;
            switch (challenge.step_name) {
                case 'select_verify_method': {
                    return yield this.selectVerifyMethod(challenge.step_data.choice);
                }
                case 'delta_login_review': {
                    return yield this.deltaLoginReview('0');
                }
                default: {
                    return challenge;
                }
            }
        });
    }
    /**
     * Go back to "select_verify_method"
     */
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: this.client.state.challengeUrl.replace('/challenge/', '/challenge/reset/'),
                method: 'POST',
                form: this.client.request.sign({
                    _csrftoken: this.client.state.cookieCsrfToken,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                }),
            });
            this.middleware(body);
            return body;
        });
    }
    /**
     * Send the code received in the message
     */
    sendSecurityCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request
                .send({
                url: this.client.state.challengeUrl,
                method: 'POST',
                form: this.client.request.sign({
                    security_code: code,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                }),
            })
                .catch((error) => {
                if (error.response.statusCode === 400 && error.response.body.status === 'fail') {
                    throw new errors_1.IgChallengeWrongCodeError(error.response.body.message);
                }
                throw error;
            });
            this.middleware(body);
            return body;
        });
    }
    middleware(body) {
        if (body.action === 'close') {
            this.client.state.checkpoint = null;
            this.client.state.challenge = null;
        }
        else {
            this.client.state.challenge = body;
        }
    }
}
exports.ChallengeRepository = ChallengeRepository;
//# sourceMappingURL=challenge.repository.js.map