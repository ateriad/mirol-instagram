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
const src_1 = require("../src");
const fs_1 = require("fs");
const util_1 = require("util");
const readFileAsync = util_1.promisify(fs_1.readFile);
const ig = new src_1.IgApiClient();
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        // basic login-procedure
        ig.state.generateDevice(process.env.IG_USERNAME);
        ig.state.proxyUrl = process.env.IG_PROXY;
        yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield login();
    const videoPath = './myVideo.mp4';
    const coverPath = './myVideoCover.jpg';
    const publishResult = yield ig.publish.video({
        // read the file into a Buffer
        video: yield readFileAsync(videoPath),
        coverImage: yield readFileAsync(coverPath),
    });
    console.log(publishResult);
}))();
//# sourceMappingURL=upload-video.example.js.map