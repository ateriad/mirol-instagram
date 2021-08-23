"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dist_1 = require("json-ts/dist");
const lodash_1 = require("lodash");
const fs = __importStar(require("fs"));
const util_1 = require("util");
/* async fs functions - uncomment the needed wrappers */
// @ts-ignore
const readFileAsync = util_1.promisify(fs.readFile);
const writeFileAsync = util_1.promisify(fs.writeFile);
const existsAsync = util_1.promisify(fs.exists);
const statePath = 'tools/state.json';
const ig = new src_1.IgApiClient();
// @ts-ignore
function createInterface(request, outputName) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield request;
        const camelCasedOutputName = lodash_1.camelCase(outputName);
        let interfaces = dist_1.json2ts(JSON.stringify(json), {
            prefix: camelCasedOutputName.charAt(0).toUpperCase() + camelCasedOutputName.slice(1) + 'Response',
        });
        interfaces = interfaces.replace(/interface/g, 'export interface');
        const fileName = `${outputName}.response`;
        yield writeFileAsync(`./src/responses/${fileName}.ts`, interfaces);
        console.log('Success');
        return json;
    });
}
// @ts-ignore
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        ig.state.generateDevice(process.env.IG_USERNAME);
        ig.request.end$.subscribe(() => __awaiter(this, void 0, void 0, function* () {
            const state = yield ig.state.serialize();
            delete state.constants;
            yield writeFileAsync(statePath, JSON.stringify(state), { encoding: 'utf8' });
        }));
        if (yield existsAsync(statePath)) {
            yield ig.state.deserialize(yield readFileAsync(statePath, { encoding: 'utf8' }));
            yield ig.qe.syncLoginExperiments();
        }
        else {
            yield ig.qe.syncLoginExperiments();
            return yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
        }
    });
}
(function mainAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        ig.state.generateDevice(process.env.IG_USERNAME);
        yield login();
        try {
            console.log(yield ig.publish.photo({
                file: yield readFileAsync('D:\\ShareX\\Screenshots\\2020-01-10_19-47-29.jpg'),
            }));
        }
        catch (e) {
            console.error(e);
            console.error(e.response.body);
        }
    });
})();
//# sourceMappingURL=response-to-interface.js.map