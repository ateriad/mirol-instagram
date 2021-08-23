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
exports.FbsearchRepository = void 0;
const repository_1 = require("../core/repository");
class FbsearchRepository extends repository_1.Repository {
    suggestedSearches(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/fbsearch/suggested_searches/',
                qs: {
                    type,
                },
            });
            return body;
        });
    }
    recentSearches() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/fbsearch/recent_searches/',
            });
            return body;
        });
    }
    topsearchFlat(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/fbsearch/topsearch_flat/',
                qs: {
                    timezone_offset: this.client.state.timezoneOffset,
                    count: 30,
                    query,
                    context: 'blended',
                },
            });
            return body;
        });
    }
    places(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/fbsearch/places/',
                qs: {
                    timezone_offset: this.client.state.timezoneOffset,
                    count: 30,
                    query,
                },
            });
            return body;
        });
    }
}
exports.FbsearchRepository = FbsearchRepository;
//# sourceMappingURL=fbsearch.repository.js.map