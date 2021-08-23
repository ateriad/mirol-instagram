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
/* tslint:disable:no-console */
const src_1 = require("../src");
const Bluebird = __importStar(require("bluebird"));
const inquirer = require("inquirer");
// Return logged in user object
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Initiate Instagram API client
    const ig = new src_1.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;
    // Perform usual login
    // If 2FA is enabled, IgLoginTwoFactorRequiredError will be thrown
    return Bluebird.try(() => ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)).catch(src_1.IgLoginTwoFactorRequiredError, (err) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, totp_two_factor_on, two_factor_identifier } = err.response.body.two_factor_info;
        // decide which method to use
        const verificationMethod = totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
        // At this point a code should have been sent
        // Get the code
        const { code } = yield inquirer.prompt([
            {
                type: 'input',
                name: 'code',
                message: `Enter code received via ${verificationMethod === '1' ? 'SMS' : 'TOTP'}`,
            },
        ]);
        // Use the code to finish the login process
        return ig.account.twoFactorLogin({
            username,
            verificationCode: code,
            twoFactorIdentifier: two_factor_identifier,
            verificationMethod,
            trustThisDevice: '1',
        });
    })).catch(e => console.error('An error occurred while processing two factor auth', e, e.stack));
}))();
//# sourceMappingURL=2fa-sms-login.example.js.map