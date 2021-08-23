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
// tslint:disable-next-line:no-var-requires
const shttps = require('socks-proxy-agent'); // you should install SOCKS5 client via: npm i socks-proxy-agent
(() => __awaiter(void 0, void 0, void 0, function* () {
    const ig = new src_1.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    ig.request.defaults.agentClass = shttps; // apply agent class to request library defaults
    ig.request.defaults.agentOptions = {
        // @ts-ignore
        hostname: '127.0.0.1',
        port: 8000,
        protocol: 'socks:',
    };
    // Now we can perform authorization using our SOCKS5 proxy.
    const auth = yield ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.log(JSON.stringify(auth));
    // Do your things.
}))();
//# sourceMappingURL=socks5-proxy.example.js.map