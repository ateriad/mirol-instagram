"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.AccountFollowersFeed = void 0;
const class_transformer_1 = require("class-transformer");
const feed_1 = require("../core/feed");
const responses_1 = require("../responses");
class AccountFollowersFeed extends feed_1.Feed {
    constructor() {
        super(...arguments);
        /**
         * only 'default' seems to work
         */
        this.order = 'default';
        this.query = '';
        this.enableGroups = true;
    }
    set state(body) {
        this.moreAvailable = !!body.next_max_id;
        this.nextMaxId = body.next_max_id;
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: `/api/v1/friendships/${this.id}/followers/`,
                qs: {
                    max_id: this.nextMaxId,
                    search_surface: this.searchSurface,
                    order: this.order,
                    query: this.query,
                    enable_groups: this.enableGroups,
                },
            });
            this.state = body;
            return body;
        });
    }
    items() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = yield this.request();
            return body.users.map(user => class_transformer_1.plainToClassFromExist(new responses_1.AccountFollowersFeedResponseUsersItem(this.client), user));
        });
    }
}
__decorate([
    class_transformer_1.Expose()
], AccountFollowersFeed.prototype, "nextMaxId", void 0);
exports.AccountFollowersFeed = AccountFollowersFeed;
//# sourceMappingURL=account-followers.feed.js.map