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
const Bluebird = require("bluebird");
const ig = new src_1.IgApiClient();
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        ig.state.generateDevice(process.env.IG_USERNAME);
        ig.state.proxyUrl = process.env.IG_PROXY;
        yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // basic login-procedure
    yield login();
    const { broadcast_id, upload_url } = yield ig.live.create({
        // create a stream in 720x1280 (9:16)
        previewWidth: 720,
        previewHeight: 1280,
        // this message is not necessary, because it doesn't show up in the notification
        message: 'My message',
    });
    // (optional) get the key and url for programs such as OBS
    const { stream_key, stream_url } = src_1.LiveEntity.getUrlAndKey({ broadcast_id, upload_url });
    console.log(`Start your stream on ${stream_url}.\n
    Your key is: ${stream_key}`);
    /**
     * make sure you are streaming to the url
     * the next step will send a notification / start your stream for everyone to see
     */
    const startInfo = yield ig.live.start(broadcast_id);
    // status should be 'ok'
    console.log(startInfo);
    /**
     * now, your stream is running
     * the next step is to get comments
     * note: comments can only be requested roughly every 2s
     */
    // initial comment-timestamp = 0, get all comments
    let lastCommentTs = yield printComments(broadcast_id, 0);
    // enable the comments
    yield ig.live.unmuteComment(broadcast_id);
    /**
     * wait 2 seconds until the next request.
     * in the real world you'd use something like setInterval() instead of Bluebird.delay() / just to simulate a delay
     */
    // wait 2s
    yield Bluebird.delay(2000);
    // now, we print the next comments
    lastCommentTs = yield printComments(broadcast_id, lastCommentTs);
    // now we're commenting on our stream
    yield ig.live.comment(broadcast_id, 'A comment');
    /**
     * now, your stream is running, you entertain your followers, but you're tired and
     * we're going to stop the stream
     */
    yield ig.live.endBroadcast(broadcast_id);
    // now you're basically done
}))();
function printComments(broadcastId, lastCommentTs) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comments } = yield ig.live.getComment({ broadcastId, lastCommentTs });
        if (comments.length > 0) {
            comments.forEach(comment => console.log(`${comment.user.username}: ${comment.text}`));
            return comments[comments.length - 1].created_at;
        }
        else {
            return lastCommentTs;
        }
    });
}
//# sourceMappingURL=live.example.js.map