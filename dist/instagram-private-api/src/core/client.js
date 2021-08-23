"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgApiClient = void 0;
const state_1 = require("./state");
const request_1 = require("./request");
const feed_factory_1 = require("./feed.factory");
const account_repository_1 = require("../repositories/account.repository");
const media_repository_1 = require("../repositories/media.repository");
const challenge_repository_1 = require("../repositories/challenge.repository");
const friendship_repository_1 = require("../repositories/friendship.repository");
const upload_repository_1 = require("../repositories/upload.repository");
const publish_service_1 = require("../services/publish.service");
const direct_thread_repository_1 = require("../repositories/direct-thread.repository");
const entity_factory_1 = require("./entity.factory");
const qe_repository_1 = require("../repositories/qe.repository");
const zr_repository_1 = require("../repositories/zr.repository");
const launcher_repository_1 = require("../repositories/launcher.repository");
const direct_repository_1 = require("../repositories/direct.repository");
const loom_repository_1 = require("../repositories/loom.repository");
const qp_repository_1 = require("../repositories/qp.repository");
const creatives_repository_1 = require("../repositories/creatives.repository");
const linked_account_repository_1 = require("../repositories/linked-account.repository");
const attribution_repository_1 = require("../repositories/attribution.repository");
const fbsearch_repository_1 = require("../repositories/fbsearch.repository");
const simulate_service_1 = require("../services/simulate.service");
const discover_repository_1 = require("../repositories/discover.repository");
const consent_repository_1 = require("../repositories/consent.repository");
const user_repository_1 = require("../repositories/user.repository");
const tag_repository_1 = require("../repositories/tag.repository");
const search_service_1 = require("../services/search.service");
const story_service_1 = require("../services/story.service");
const live_repository_1 = require("../repositories/live.repository");
const location_repository_1 = require("../repositories/location.repository");
const location_search_repository_1 = require("../repositories/location-search.repository");
const music_repository_1 = require("../repositories/music.repository");
const news_repository_1 = require("../repositories/news.repository");
const highlights_repository_1 = require("../repositories/highlights.repository");
const ads_repository_1 = require("../repositories/ads.repository");
const insights_service_1 = require("../services/insights.service");
const restrict_action_repository_1 = require("../repositories/restrict-action.repository");
const address_book_repository_1 = require("../repositories/address-book.repository");
const status_repository_1 = require("../repositories/status.repository");
const igtv_repository_1 = require("../repositories/igtv.repository");
class IgApiClient {
    constructor() {
        this.state = new state_1.State();
        this.request = new request_1.Request(this);
        this.feed = new feed_factory_1.FeedFactory(this);
        this.entity = new entity_factory_1.EntityFactory(this);
        /* Repositories */
        this.account = new account_repository_1.AccountRepository(this);
        this.attribution = new attribution_repository_1.AttributionRepository(this);
        this.challenge = new challenge_repository_1.ChallengeRepository(this);
        this.consent = new consent_repository_1.ConsentRepository(this);
        this.creatives = new creatives_repository_1.CreativesRepository(this);
        this.direct = new direct_repository_1.DirectRepository(this);
        this.directThread = new direct_thread_repository_1.DirectThreadRepository(this);
        this.discover = new discover_repository_1.DiscoverRepository(this);
        this.fbsearch = new fbsearch_repository_1.FbsearchRepository(this);
        this.friendship = new friendship_repository_1.FriendshipRepository(this);
        this.launcher = new launcher_repository_1.LauncherRepository(this);
        this.linkedAccount = new linked_account_repository_1.LinkedAccountRepository(this);
        this.loom = new loom_repository_1.LoomRepository(this);
        this.media = new media_repository_1.MediaRepository(this);
        this.qe = new qe_repository_1.QeRepository(this);
        this.qp = new qp_repository_1.QpRepository(this);
        this.tag = new tag_repository_1.TagRepository(this);
        this.upload = new upload_repository_1.UploadRepository(this);
        this.user = new user_repository_1.UserRepository(this);
        this.zr = new zr_repository_1.ZrRepository(this);
        this.live = new live_repository_1.LiveRepository(this);
        this.location = new location_repository_1.LocationRepository(this);
        this.locationSearch = new location_search_repository_1.LocationSearch(this);
        this.music = new music_repository_1.MusicRepository(this);
        this.news = new news_repository_1.NewsRepository(this);
        this.highlights = new highlights_repository_1.HighlightsRepository(this);
        this.ads = new ads_repository_1.AdsRepository(this);
        this.restrictAction = new restrict_action_repository_1.RestrictActionRepository(this);
        this.addressBook = new address_book_repository_1.AddressBookRepository(this);
        this.status = new status_repository_1.StatusRepository(this);
        this.igtv = new igtv_repository_1.IgtvRepository(this);
        /* Services */
        this.publish = new publish_service_1.PublishService(this);
        this.search = new search_service_1.SearchService(this);
        this.simulate = new simulate_service_1.SimulateService(this);
        this.story = new story_service_1.StoryService(this);
        this.insights = new insights_service_1.InsightsService(this);
    }
    destroy() {
        this.request.error$.complete();
        this.request.end$.complete();
    }
}
exports.IgApiClient = IgApiClient;
//# sourceMappingURL=client.js.map