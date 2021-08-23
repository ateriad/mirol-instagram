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
exports.TagRepository = void 0;
const repository_1 = require("../core/repository");
class TagRepository extends repository_1.Repository {
    search(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/tags/search/',
                qs: {
                    timezone_offset: this.client.state.timezoneOffset,
                    q,
                    count: 30,
                },
            });
            return body;
        });
    }
    section(q, tab) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/tags/${encodeURI(q)}/sections/`,
                qs: {
                    timezone_offset: this.client.state.timezoneOffset,
                    tab: tab,
                    count: 30,
                },
            });
            return body;
        });
    }
}
exports.TagRepository = TagRepository;
//# sourceMappingURL=tag.repository.js.map