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
exports.ProfileEntity = void 0;
const entity_1 = require("../core/entity");
class ProfileEntity extends entity_1.Entity {
    checkFollow() {
        return __awaiter(this, void 0, void 0, function* () {
            const friendshipStatus = yield this.client.friendship.show(this.pk);
            if (friendshipStatus.following === true)
                return friendshipStatus;
            return yield this.client.friendship.create(this.pk);
        });
    }
    checkUnfollow() {
        return __awaiter(this, void 0, void 0, function* () {
            const friendshipStatus = yield this.client.friendship.show(this.pk);
            if (friendshipStatus.following === false)
                return friendshipStatus;
            return yield this.client.friendship.destroy(this.pk);
        });
    }
}
exports.ProfileEntity = ProfileEntity;
//# sourceMappingURL=profile.entity.js.map