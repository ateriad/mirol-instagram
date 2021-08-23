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
const util_1 = require("util");
const fs_1 = require("fs");
// use node v8 or later or the util npm package
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
    // get the first thread
    const [thread] = yield ig.feed.directInbox().records();
    yield sendPhoto(thread);
    yield sendVideo(thread);
    yield sendPhotoStory(thread);
    yield sendVideoStory(thread);
}))();
/**
 * Sends a regular photo to the thread
 * @param thread
 */
function sendPhoto(thread) {
    return __awaiter(this, void 0, void 0, function* () {
        const photo = yield readFileAsync('PATH_TO_PHOTO.jpg');
        console.log(yield thread.broadcastPhoto({
            file: photo,
        }));
    });
}
/**
 * Sends a regular video to the thread
 * @param thread
 */
function sendVideo(thread) {
    return __awaiter(this, void 0, void 0, function* () {
        const video = yield readFileAsync('PATH_TO_VIDEO.mp4');
        console.log(yield thread.broadcastVideo({
            video,
            // optional if you get a 202 transcode error
            // delay in ms
            transcodeDelay: 5 * 1000,
        }));
    });
}
/**
 * Sends a story with a video
 * The story is replayable
 * @param thread
 */
function sendVideoStory(thread) {
    return __awaiter(this, void 0, void 0, function* () {
        const video = yield readFileAsync('PATH_TO_VIDEO.mp4');
        const cover = yield readFileAsync('PATH_TO_COVER.jpg');
        console.log(yield thread.broadcastStory({
            video,
            coverImage: cover,
            viewMode: 'replayable',
        }));
    });
}
/**
 * Sends a story with a photo
 * The story can only be seen once
 * @param thread
 */
function sendPhotoStory(thread) {
    return __awaiter(this, void 0, void 0, function* () {
        const photo = yield readFileAsync('PATH_TO_PHOTO.jpg');
        console.log(yield thread.broadcastStory({
            file: photo,
            viewMode: 'once',
        }));
    });
}
//# sourceMappingURL=dm-thrad.broadast-media.example.js.map