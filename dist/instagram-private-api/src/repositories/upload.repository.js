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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRepository = void 0;
const lodash_1 = require("lodash");
const repository_1 = require("../core/repository");
const Chance = require("chance");
const debug_1 = __importDefault(require("debug"));
class UploadRepository extends repository_1.Repository {
    constructor() {
        super(...arguments);
        this.chance = new Chance();
    }
    photo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = options.uploadId || Date.now();
            const name = `${uploadId}_0_${lodash_1.random(1000000000, 9999999999)}`;
            const contentLength = options.file.byteLength;
            UploadRepository.uploadDebug(`Uploading ${options.file.byteLength}b as ${uploadId} (photo, jpeg)`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igphoto/${name}`,
                method: 'POST',
                headers: {
                    X_FB_PHOTO_WATERFALL_ID: options.waterfallId || this.chance.guid(),
                    'X-Entity-Type': 'image/jpeg',
                    Offset: 0,
                    'X-Instagram-Rupload-Params': JSON.stringify(UploadRepository.createPhotoRuploadParams(options, uploadId)),
                    'X-Entity-Name': name,
                    'X-Entity-Length': contentLength,
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': contentLength,
                    'Accept-Encoding': 'gzip',
                },
                body: options.file,
            });
            return body;
        });
    }
    /**
     * Uploads a video (container: mp4 with h264 and aac)
     */
    video(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = options.video;
            const uploadId = options.uploadId || Date.now();
            const name = options.uploadName || `${uploadId}_0_${lodash_1.random(1000000000, 9999999999)}`;
            const contentLength = video.byteLength;
            const waterfallId = options.waterfallId || this.chance.guid({ version: 4 });
            const ruploadParams = UploadRepository.createVideoRuploadParams(options, uploadId);
            UploadRepository.uploadDebug(`Uploading ${options.video.byteLength}b as ${uploadId} (video, mp4, not segmented). Info: ${JSON.stringify(ruploadParams)}`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igvideo/${name}`,
                method: 'POST',
                qs: {
                // target: this.client.state.extractCookieValue('rur'),
                },
                headers: Object.assign(Object.assign({}, this.getBaseHeaders(ruploadParams)), { X_FB_VIDEO_WATERFALL_ID: waterfallId, 'X-Entity-Type': 'video/mp4', Offset: options.offset || 0, 'X-Entity-Name': name, 'X-Entity-Length': contentLength, 'Content-Type': 'application/octet-stream', 'Content-Length': contentLength, 'Accept-Encoding': 'gzip' }),
                body: video,
            });
            return body;
        });
    }
    initVideo({ name, ruploadParams, waterfallId }) {
        return __awaiter(this, void 0, void 0, function* () {
            UploadRepository.uploadDebug(`Initializing video upload: ${JSON.stringify(ruploadParams)}`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igvideo/${name}`,
                method: 'GET',
                headers: Object.assign(Object.assign({}, this.getBaseHeaders(ruploadParams)), { X_FB_VIDEO_WATERFALL_ID: waterfallId, 'X-Entity-Type': 'video/mp4', 'Accept-Encoding': 'gzip' }),
            }, true);
            return body;
        });
    }
    startSegmentedVideo(ruploadParams) {
        return __awaiter(this, void 0, void 0, function* () {
            UploadRepository.uploadDebug(`Starting segmented video upload: ${JSON.stringify(ruploadParams)}`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igvideo/${this.chance.guid({ version: 4 })}`,
                qs: {
                    segmented: true,
                    phase: 'start',
                },
                method: 'POST',
                body: '',
                headers: Object.assign(Object.assign({}, this.getBaseHeaders(ruploadParams)), { 'Accept-Encoding': 'gzip', 'Content-Length': 0 }),
            });
            return body;
        });
    }
    videoSegmentInit(options) {
        return __awaiter(this, void 0, void 0, function* () {
            UploadRepository.uploadDebug(`Initializing segmented video upload: ${JSON.stringify(options)}`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igvideo/${options.transferId}`,
                method: 'GET',
                qs: {
                    segmented: true,
                    phase: 'transfer',
                },
                headers: Object.assign(Object.assign({}, this.getBaseHeaders(options.ruploadParams)), { 'Stream-Id': options.streamId, 'Segment-Start-Offset': options.startOffset, X_FB_VIDEO_WATERFALL_ID: options.waterfallId, 'Segment-Type': '2', 'Accept-Encoding': 'gzip' }),
            }, true);
            return body;
        });
    }
    videoSegmentTransfer(options) {
        return __awaiter(this, void 0, void 0, function* () {
            UploadRepository.uploadDebug(`Transfering segmented video: ${options.segment.byteLength}b, stream position: ${options.startOffset}`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igvideo/${options.transferId}`,
                qs: {
                    segmented: true,
                    phase: 'transfer',
                },
                method: 'POST',
                headers: Object.assign(Object.assign({}, this.getBaseHeaders(options.ruploadParams)), { 'X-Entity-Length': options.segment.byteLength, 'X-Entity-Name': options.transferId, 'Stream-Id': options.streamId, 'X-Entity-Type': 'video/mp4', 'Segment-Start-Offset': options.startOffset, 'Segment-Type': '2', X_FB_VIDEO_WATERFALL_ID: options.waterfallId, 
                    // TODO: inspect offset
                    Offset: 0, 'Content-Length': options.segment.byteLength }),
                body: options.segment,
            });
            return body;
        });
    }
    endSegmentedVideo({ ruploadParams, streamId }) {
        return __awaiter(this, void 0, void 0, function* () {
            UploadRepository.uploadDebug(`Ending segmented video upload of ${streamId}`);
            const { body } = yield this.client.request.send({
                url: `/rupload_igvideo/${this.chance.guid({ version: 4 })}`,
                qs: {
                    segmented: true,
                    phase: 'end',
                },
                method: 'POST',
                body: '',
                headers: Object.assign(Object.assign({}, this.getBaseHeaders(ruploadParams)), { 'Accept-Encoding': 'gzip', 'Content-Length': 0, 'Stream-Id': streamId }),
            });
            return body;
        });
    }
    getBaseHeaders(ruploadParams) {
        return {
            'X-IG-Connection-Type': this.client.state.connectionTypeHeader,
            'X-IG-Capabilities': this.client.state.capabilitiesHeader,
            'X-IG-App-ID': this.client.state.fbAnalyticsApplicationId,
            'Accept-Encoding': 'gzip',
            'X-Instagram-Rupload-Params': JSON.stringify(ruploadParams),
        };
    }
    static createPhotoRuploadParams(options, uploadId) {
        const ruploadParams = {
            retry_context: JSON.stringify({ num_step_auto_retry: 0, num_reupload: 0, num_step_manual_retry: 0 }),
            media_type: '1',
            upload_id: uploadId.toString(),
            xsharing_user_ids: JSON.stringify([]),
            image_compression: JSON.stringify({ lib_name: 'moz', lib_version: '3.1.m', quality: '80' }),
        };
        if (options.isSidecar) {
            ruploadParams.is_sidecar = '1';
        }
        return ruploadParams;
    }
    static createVideoRuploadParams(options, uploadId, retryContext) {
        const { duration, width, height } = options;
        const ruploadParams = {
            retry_context: JSON.stringify(retryContext || { num_step_auto_retry: 0, num_reupload: 0, num_step_manual_retry: 0 }),
            media_type: options.mediaType || '2',
            xsharing_user_ids: JSON.stringify([]),
            upload_id: uploadId.toString(),
            upload_media_height: height === null || height === void 0 ? void 0 : height.toString(),
            upload_media_width: width === null || width === void 0 ? void 0 : width.toString(),
            upload_media_duration_ms: duration.toString(),
        };
        if (options.isSidecar) {
            ruploadParams.is_sidecar = '1';
        }
        if (options.forAlbum) {
            ruploadParams.for_album = '1';
        }
        if (options.isDirect) {
            ruploadParams.direct_v2 = '1';
        }
        if (options.forDirectStory) {
            ruploadParams.for_direct_story = '1';
            ruploadParams.content_tags = '';
        }
        if (options.isIgtvVideo) {
            ruploadParams.is_igtv_video = '1';
        }
        if (options.isDirectVoice) {
            ruploadParams.is_direct_voice = '1';
        }
        return ruploadParams;
    }
}
exports.UploadRepository = UploadRepository;
UploadRepository.uploadDebug = debug_1.default('ig:upload');
//# sourceMappingURL=upload.repository.js.map