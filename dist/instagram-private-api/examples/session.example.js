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
require("dotenv/config");
const src_1 = require("../src");
function fakeSave(data) {
    // here you would save it to a file/database etc.
    // you could save it to a file: writeFile(path, JSON.stringify(data))
    return data;
}
function fakeExists() {
    // here you would check if the data exists
    return false;
}
function fakeLoad() {
    // here you would load the data
    return '';
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const ig = new src_1.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.state.proxyUrl = process.env.IG_PROXY;
    // This function executes after every request
    ig.request.end$.subscribe(() => __awaiter(void 0, void 0, void 0, function* () {
        const serialized = yield ig.state.serialize();
        delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
        fakeSave(serialized);
    }));
    if (fakeExists()) {
        // import state accepts both a string as well as an object
        // the string should be a JSON object
        yield ig.state.deserialize(fakeLoad());
    }
    // This call will provoke request.end$ stream
    yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    // Most of the time you don't have to login after loading the state
}))();
//# sourceMappingURL=session.example.js.map