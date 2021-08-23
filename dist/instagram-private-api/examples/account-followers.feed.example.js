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
    const followersFeed = ig.feed.accountFollowers(auth.pk);
    const wholeResponse = yield followersFeed.request();
    console.log(wholeResponse); // You can reach any properties in instagram response
    const items = yield followersFeed.items();
    console.log(items); // Here you can reach items. It's array.
    const thirdPageItems = yield followersFeed.items();
    // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
    console.log(thirdPageItems); // Here you can reach items. It's array.
    const feedState = followersFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
    console.log(feedState);
    followersFeed.deserialize(feedState);
    const fourthPageItems = yield followersFeed.items();
    console.log(fourthPageItems);
    // You can use RxJS stream to subscribe to all results in this feed.
    // All the RxJS powerful is beyond this example - you should learn it by yourself.
    followersFeed.items$.subscribe(followers => console.log(followers), error => console.error(error), () => console.log('Complete!'));
}))();
//# sourceMappingURL=account-followers.feed.example.js.map