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
exports.AddressBookRepository = void 0;
const repository_1 = require("../core/repository");
class AddressBookRepository extends repository_1.Repository {
    link(contacts, module) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/address_book/link/',
                method: 'POST',
                form: {
                    phone_id: this.client.state.phoneId,
                    module: module || 'find_friends_contacts',
                    contacts: JSON.stringify(contacts),
                    _csrftoken: this.client.state.cookieCsrfToken,
                    device_id: this.client.state.deviceId,
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
    acquireOwnerContacts(me) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/address_book/acquire_owner_contacts/',
                method: 'POST',
                form: {
                    phone_id: this.client.state.phoneId,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    me: JSON.stringify(me),
                    _uuid: this.client.state.uuid,
                },
            });
            return body;
        });
    }
}
exports.AddressBookRepository = AddressBookRepository;
//# sourceMappingURL=address-book.repository.js.map