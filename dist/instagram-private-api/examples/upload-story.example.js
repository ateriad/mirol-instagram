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
const src_1 = require("../src");
const fs_1 = require("fs");
const luxon_1 = require("luxon");
const sticker_builder_1 = require("../src/sticker-builder");
const util_1 = require("util");
const readFileAsync = util_1.promisify(fs_1.readFile);
const ig = new src_1.IgApiClient();
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        ig.state.generateDevice(process.env.IG_USERNAME);
        ig.state.proxyUrl = process.env.IG_PROXY;
        yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield login();
    const path = './myStory.jpg';
    const file = yield readFileAsync(path);
    /**
     *  You can move and rotate stickers by using one of these methods:
     *  center()
     *  rotateDeg(180) rotates 180°
     *  scale(0.5) scales the sticker to 1/2 of it's size
     *  moveForward() moves the sticker in front
     *  moveBackwards() moves the sticker in the background
     *  right() aligns the sticker to the right
     *  left() aligns the sticker to the left
     *  top() aligns the sticker to the top
     *  bottom() aligns the sticker to the bottom
     *
     *  All of these are chainable e.g.:
     *  StickerBuilder.hashtag({ tagName: 'tag' }).scale(0.5).rotateDeg(90).center().left()
     *  You can also set the position and size like this:
     *  StickerBuilder.hashtag({
     *     tagName: 'insta',
     *     width: 0.5,
     *     height: 0.5,
     *     x: 0.5,
     *     y: 0.5,
     *   })
     */
    // these stickers are 'invisible' and not 're-rendered' in the app
    yield ig.publish.story({
        file,
        // this creates a new config
        stickerConfig: new sticker_builder_1.StickerBuilder()
            // these are all supported stickers
            .add(sticker_builder_1.StickerBuilder.hashtag({
            tagName: 'insta',
        }).center())
            .add(sticker_builder_1.StickerBuilder.mention({
            userId: ig.state.cookieUserId,
        }).center())
            .add(sticker_builder_1.StickerBuilder.question({
            question: 'My Question',
        }).scale(0.5))
            .add(sticker_builder_1.StickerBuilder.question({
            question: 'Music?',
            questionType: 'music',
        }))
            .add(sticker_builder_1.StickerBuilder.countdown({
            text: 'My Countdown',
            // @ts-ignore
            endTs: luxon_1.DateTime.local().plus(luxon_1.Duration.fromObject({ hours: 1 })),
        }))
            .add(sticker_builder_1.StickerBuilder.chat({
            text: 'Chat name',
        }))
            .add(sticker_builder_1.StickerBuilder.location({
            locationId: (yield ig.locationSearch.index(13, 37)).venues[0].external_id,
        }))
            .add(sticker_builder_1.StickerBuilder.poll({
            question: 'Question',
            tallies: [{ text: 'Left' }, { text: 'Right' }],
        }))
            .add(sticker_builder_1.StickerBuilder.quiz({
            question: 'Question',
            options: ['0', '1', '2', '3'],
            correctAnswer: 1,
        }))
            .add(sticker_builder_1.StickerBuilder.slider({
            question: 'Question',
            emoji: '❤',
        }))
            // mention the first story item
            .add(sticker_builder_1.StickerBuilder.mentionReel((yield ig.feed.userStory('username').items())[0]).center())
            // mention the first media on your timeline
            .add(sticker_builder_1.StickerBuilder.attachmentFromMedia((yield ig.feed.timeline().items())[0]).center())
            // you can also set different values for the position and dimensions
            .add(sticker_builder_1.StickerBuilder.hashtag({
            tagName: 'insta',
            width: 0.5,
            height: 0.5,
            x: 0.5,
            y: 0.5,
        }))
            .build(),
    });
}))();
//# sourceMappingURL=upload-story.example.js.map