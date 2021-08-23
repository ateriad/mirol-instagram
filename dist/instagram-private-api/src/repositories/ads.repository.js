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
exports.AdsRepository = void 0;
const repository_1 = require("../core/repository");
class AdsRepository extends repository_1.Repository {
    graphQL(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/api/v1/ads/graphql/',
                method: 'POST',
                qs: Object.assign({ locale: this.client.state.language, vc_policy: 'insights_policy' }, (options.surface.name ? { surface: options.surface.name } : {})),
                form: {
                    access_token: options.accessToken,
                    fb_api_caller_class: 'RelayModern',
                    fb_api_req_friendly_name: options.surface.friendlyName,
                    doc_id: options.documentId,
                    variables: JSON.stringify(options.variables),
                },
            }, true);
            return body;
        });
    }
}
exports.AdsRepository = AdsRepository;
//# sourceMappingURL=ads.repository.js.map