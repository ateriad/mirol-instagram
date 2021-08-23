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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const ig = new src_1.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;
    const auth = yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log(JSON.stringify(auth));
    const targetUser = yield ig.user.searchExact('username'); // getting exact user by login
    const reelsFeed = ig.feed.reelsMedia({
        userIds: [targetUser.pk],
    });
    const storyItems = yield reelsFeed.items(); // getting reels, see "account-followers.feed.example.ts" if you want to know how to work with feeds
    if (storyItems.length === 0) { // we can check items length and find out if the user does have any story to watch
        console.log(`${targetUser.username}'s story is empty`);
        return;
    }
    const seenResult = yield ig.story.seen([storyItems[0]]);
    // now we can mark story as seen using story-service, you can specify multiple stories, in this case we are only watching the first story
    console.log(seenResult.status); // seenResult.status should be "ok"
}))();
//# sourceMappingURL=user-stories-watching.example.js.map