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
exports.ConsentRepository = void 0;
const repository_1 = require("../core/repository");
const Chance = require("chance");
const Bluebird = require("bluebird");
class ConsentRepository extends repository_1.Repository {
    auto() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.existingUserFlow();
            if (response.screen_key === 'already_finished') {
                return response;
            }
            const dob = new Chance().birthday();
            yield Bluebird.try(() => this.existingUserFlowIntro()).catch(() => { });
            yield Bluebird.try(() => this.existingUserFlowTosAndTwoAgeButton()).catch(() => { });
            yield Bluebird.try(() => this.existingUserFlowDob(dob.getFullYear(), dob.getMonth(), dob.getDay())).catch(() => { });
            return true;
        });
    }
    existingUserFlowIntro() {
        return this.existingUserFlow({
            current_screen_key: 'qp_intro',
            updates: JSON.stringify({ existing_user_intro_state: '2' }),
        });
    }
    existingUserFlowDob(year, month, day) {
        return this.existingUserFlow({
            current_screen_key: 'dob',
            day: String(day),
            month: String(month),
            year: String(year),
        });
    }
    existingUserFlowTosAndTwoAgeButton() {
        return this.existingUserFlow({
            current_screen_key: 'tos_and_two_age_button',
            updates: JSON.stringify({ age_consent_state: '2', tos_data_policy_consent_state: '2' }),
        });
    }
    existingUserFlow(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/consent/existing_user_flow/',
                method: 'POST',
                form: this.client.request.sign(Object.assign({ _csrftoken: this.client.state.cookieCsrfToken, _uid: this.client.state.cookieUserId, _uuid: this.client.state.uuid }, data)),
            });
            return body;
        });
    }
}
exports.ConsentRepository = ConsentRepository;
//# sourceMappingURL=consent.repository.js.map