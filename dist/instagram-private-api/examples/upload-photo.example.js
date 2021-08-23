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
    const path = './myPicture.jpg';
    const { latitude, longitude, searchQuery } = {
        latitude: 0.0,
        longitude: 0.0,
        // not required
        searchQuery: 'place',
    };
    /**
     * Get the place
     * If searchQuery is undefined, you'll get the nearest places to your location
     * this is the same as in the upload (-configure) dialog in the app
     */
    const locations = yield ig.search.location(latitude, longitude, searchQuery);
    /**
     * Get the first venue
     * In the real world you would check the returned locations
     */
    const mediaLocation = locations[0];
    console.log(mediaLocation);
    const publishResult = yield ig.publish.photo({
        // read the file into a Buffer
        file: yield readFileAsync(path),
        // optional, default ''
        caption: 'my caption',
        // optional
        location: mediaLocation,
        // optional
        usertags: {
            in: [
                // tag the user 'instagram' @ (0.5 | 0.5)
                yield generateUsertagFromName('instagram', 0.5, 0.5),
            ],
        },
    });
    console.log(publishResult);
}))();
/**
 * Generate a usertag
 * @param name - the instagram-username
 * @param x - x coordinate (0..1)
 * @param y - y coordinate (0..1)
 */
function generateUsertagFromName(name, x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        // constrain x and y to 0..1 (0 and 1 are not supported)
        x = clamp(x, 0.0001, 0.9999);
        y = clamp(y, 0.0001, 0.9999);
        // get the user_id (pk) for the name
        const { pk } = yield ig.user.searchExact(name);
        return {
            user_id: pk,
            position: [x, y],
        };
    });
}
/**
 * Constrain a value
 * @param value
 * @param min
 * @param max
 */
const clamp = (value, min, max) => Math.max(Math.min(value, max), min);
//# sourceMappingURL=upload-photo.example.js.map