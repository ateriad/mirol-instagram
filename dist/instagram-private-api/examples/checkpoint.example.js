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
/* tslint:disable:no-console */
require("dotenv/config");
const src_1 = require("../src");
const Bluebird = require("bluebird");
const inquirer = require("inquirer");
/**
 * This method won't catch all checkpoint errors
 * There's currently a new checkpoint used by instagram which requires 'web-support'
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    const ig = new src_1.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;
    Bluebird.try(() => __awaiter(void 0, void 0, void 0, function* () {
        const auth = yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
        console.log(auth);
    })).catch(src_1.IgCheckpointError, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(ig.state.checkpoint); // Checkpoint info here
        yield ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
        console.log(ig.state.checkpoint); // Challenge info here
        const { code } = yield inquirer.prompt([
            {
                type: 'input',
                name: 'code',
                message: 'Enter code',
            },
        ]);
        console.log(yield ig.challenge.sendSecurityCode(code));
    })).catch(e => console.log('Could not resolve checkpoint:', e, e.stack));
}))();
//# sourceMappingURL=checkpoint.example.js.map