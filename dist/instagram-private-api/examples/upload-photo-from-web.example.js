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
const request_promise_1 = require("request-promise"); // request is already declared as a dependency of the library
(() => __awaiter(void 0, void 0, void 0, function* () {
    const ig = new src_1.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;
    const auth = yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log(JSON.stringify(auth));
    // getting random square image from internet as a Buffer
    const imageBuffer = yield request_promise_1.get({
        url: 'https://picsum.photos/800/800',
        encoding: null,
    });
    const publishResult = yield ig.publish.photo({
        file: imageBuffer,
        caption: 'Really nice photo from the internet! 💖',
    });
    console.log(publishResult); // publishResult.status should be "ok"
}))();
//# sourceMappingURL=upload-photo-from-web.example.js.map