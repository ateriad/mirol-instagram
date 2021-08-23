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
exports.SearchService = void 0;
const repository_1 = require("../core/repository");
class SearchService extends repository_1.Repository {
    blended(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.fbsearch.topsearchFlat(query);
            return result.list;
        });
    }
    blendedItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield this.blended(query);
            return list.map(item => item.user || item.hashtag || item.place);
        });
    }
    users(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.user.search(query);
            return result.users;
        });
    }
    tags(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.tag.search(query);
            return result.results;
        });
    }
    places(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.fbsearch.places(query);
            return result.items;
        });
    }
    location(latitude, longitude, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.locationSearch.index(latitude, longitude, query);
            return result.venues;
        });
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map