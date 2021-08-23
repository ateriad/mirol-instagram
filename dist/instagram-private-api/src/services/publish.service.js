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
exports.PublishService = void 0;
const repository_1 = require("../core/repository");
const types_1 = require("../types");
const errors_1 = require("../errors");
const sizeOf = require("image-size");
const Bluebird = require("bluebird");
const Chance = require("chance");
const lodash_1 = require("lodash");
const upload_repository_1 = require("../repositories/upload.repository");
const debug_1 = __importDefault(require("debug"));
const sticker_builder_1 = require("../sticker-builder");
class PublishService extends repository_1.Repository {
    constructor() {
        super(...arguments);
        this.chance = new Chance();
    }
    /**
     * The current way of handling the 202 - Accepted; Transcode pending -error
     * @param videoInfo The video info for debugging reasons
     * @param transcodeDelayInMs The delay for instagram to transcode the video
     */
    static catchTranscodeError(videoInfo, transcodeDelayInMs) {
        return error => {
            if (error.response.statusCode === 202) {
                PublishService.publishDebug(`Received trancode error: ${JSON.stringify(error.response.body)}, waiting ${transcodeDelayInMs}ms`);
                return Bluebird.delay(transcodeDelayInMs);
            }
            else {
                throw new errors_1.IgUploadVideoError(error.response, videoInfo);
            }
        };
    }
    /**
     * Gets duration in ms, width and height info for a video in the mp4 container
     * @param buffer Buffer, containing the video-file
     * @returns duration in ms, width and height in px
     */
    static getVideoInfo(buffer) {
        const width = PublishService.read16(buffer, ['moov', 'trak', 'stbl', 'avc1'], 24);
        const height = PublishService.read16(buffer, ['moov', 'trak', 'stbl', 'avc1'], 26);
        return {
            duration: PublishService.getMP4Duration(buffer),
            width,
            height,
        };
    }
    /**
     * Reads the duration in ms from any MP4 file with at least one stream (a/v)
     * @param buffer
     */
    static getMP4Duration(buffer) {
        const timescale = PublishService.read32(buffer, ['moov', 'mvhd'], 12);
        const length = PublishService.read32(buffer, ['moov', 'mvhd'], 12 + 4);
        return Math.floor((length / timescale) * 1000);
    }
    static makeLocationOptions(location) {
        const options = {};
        if (typeof location !== 'undefined') {
            const { lat, lng, external_id_source, external_id, name, address } = location;
            options.location = {
                name,
                lat,
                lng,
                address,
                external_source: external_id_source,
                external_id,
            };
            options.location[external_id_source + '_id'] = external_id;
            options.geotag_enabled = '1';
            options.media_latitude = lat.toString();
            options.media_longitude = lng.toString();
            options.posting_latitude = lat.toString();
            options.posting_longitude = lng.toString();
        }
        return options;
    }
    /**
     * Reads a 32bit unsigned integer from a given Buffer by walking along the keys and getting the value with the given offset
     * ref: https://gist.github.com/OllieJones/5ffb011fa3a11964154975582360391c#file-streampeek-js-L9
     * @param buffer  The buffer to read from
     * @param keys  Keys the 'walker' should pass (stopping at the last key)
     * @param offset  Offset from the ast key to read the uint32
     */
    static read32(buffer, keys, offset) {
        let start = 0;
        for (const key of keys) {
            start = buffer.indexOf(Buffer.from(key), start) + key.length;
        }
        return buffer.readUInt32BE(start + offset);
    }
    /**
     * Reads a 16bit unsigned integer from a given Buffer by walking along the keys and getting the value with the given offset
     * ref: https://gist.github.com/OllieJones/5ffb011fa3a11964154975582360391c#file-streampeek-js-L25
     * @param buffer  The buffer to read from
     * @param keys  Keys the 'walker' should pass (stopping at the last key)
     * @param offset  Offset from the ast key to read the uint16
     */
    static read16(buffer, keys, offset) {
        let start = 0;
        for (const key of keys) {
            start = buffer.indexOf(Buffer.from(key), start) + key.length;
        }
        return buffer.readUInt16BE(start + offset);
    }
    /**
     * Uploads a single photo to the timeline-feed
     * @param options - the options, containing caption and image-data
     */
    photo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadedPhoto = yield this.client.upload.photo({
                file: options.file,
            });
            const imageSize = yield sizeOf(options.file);
            const configureOptions = Object.assign({ upload_id: uploadedPhoto.upload_id, width: imageSize.width, height: imageSize.height, caption: options.caption }, PublishService.makeLocationOptions(options.location));
            if (typeof options.usertags !== 'undefined') {
                configureOptions.usertags = options.usertags;
            }
            return yield this.client.media.configure(configureOptions);
        });
    }
    video(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = Date.now().toString();
            const videoInfo = PublishService.getVideoInfo(options.video);
            PublishService.publishDebug(`Publishing video to timeline: ${JSON.stringify(videoInfo)}`);
            yield Bluebird.try(() => this.regularVideo(Object.assign({ video: options.video, uploadId }, videoInfo))).catch(errors_1.IgResponseError, error => {
                throw new errors_1.IgUploadVideoError(error.response, videoInfo);
            });
            yield this.client.upload.photo({
                file: options.coverImage,
                uploadId: uploadId.toString(),
            });
            yield Bluebird.try(() => this.client.media.uploadFinish({
                upload_id: uploadId,
                source_type: '4',
                video: { length: videoInfo.duration / 1000.0 },
            })).catch(errors_1.IgResponseError, PublishService.catchTranscodeError(videoInfo, options.transcodeDelay || 5000));
            const configureOptions = Object.assign({ upload_id: uploadId.toString(), caption: options.caption, length: videoInfo.duration / 1000.0, width: videoInfo.width, height: videoInfo.height, clips: [
                    {
                        length: videoInfo.duration / 1000.0,
                        source_type: '4',
                    },
                ] }, PublishService.makeLocationOptions(options.location));
            if (typeof options.usertags !== 'undefined') {
                configureOptions.usertags = options.usertags;
            }
            for (let i = 0; i < 6; i++) {
                try {
                    return yield this.client.media.configureVideo(configureOptions);
                }
                catch (e) {
                    if (i >= 5 || e.response.statusCode >= 400) {
                        throw new errors_1.IgConfigureVideoError(e.response, configureOptions);
                    }
                    yield Bluebird.delay((i + 1) * 2 * 1000);
                }
            }
        });
    }
    album(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPhoto = (arg) => arg.file !== undefined;
            const isVideo = (arg) => arg.video !== undefined;
            for (const item of options.items) {
                if (isPhoto(item)) {
                    const uploadedPhoto = yield this.client.upload.photo({
                        file: item.file,
                        uploadId: item.uploadId,
                        isSidecar: true,
                    });
                    const { width, height } = yield sizeOf(item.file);
                    item.width = width;
                    item.height = height;
                    item.uploadId = uploadedPhoto.upload_id;
                }
                else if (isVideo(item)) {
                    item.videoInfo = PublishService.getVideoInfo(item.video);
                    item.uploadId = Date.now().toString();
                    PublishService.publishDebug(`Adding video to album: ${JSON.stringify(item.videoInfo)}`);
                    yield Bluebird.try(() => this.regularVideo(Object.assign({ video: item.video, uploadId: item.uploadId, isSidecar: true }, item.videoInfo))).catch(errors_1.IgResponseError, error => {
                        throw new errors_1.IgConfigureVideoError(error.response, item.videoInfo);
                    });
                    yield this.client.upload.photo({
                        file: item.coverImage,
                        uploadId: item.uploadId,
                        isSidecar: true,
                    });
                    yield Bluebird.try(() => this.client.media.uploadFinish({
                        upload_id: item.uploadId,
                        source_type: '4',
                        video: { length: item.videoInfo.duration / 1000.0 },
                    })).catch(errors_1.IgResponseError, PublishService.catchTranscodeError(item.videoInfo, item.transcodeDelay));
                }
            }
            return yield this.client.media.configureSidecar(Object.assign({ caption: options.caption, children_metadata: options.items.map(item => {
                    if (isVideo(item)) {
                        return {
                            upload_id: item.uploadId,
                            width: item.videoInfo.width,
                            height: item.videoInfo.height,
                            length: item.videoInfo.duration,
                            usertags: item.usertags,
                        };
                    }
                    else if (isPhoto(item)) {
                        return {
                            upload_id: item.uploadId,
                            width: item.width,
                            height: item.height,
                            usertags: item.usertags,
                        };
                    }
                }) }, PublishService.makeLocationOptions(options.location)));
        });
    }
    story(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPhoto = (arg) => arg.file !== undefined;
            if (options.stickerConfig instanceof sticker_builder_1.StickerBuilder) {
                options.stickerConfig = options.stickerConfig.build();
            }
            const storyStickerIds = [];
            const configureOptions = Object.assign({ configure_mode: '1' }, (options.stickerConfig ? options.stickerConfig : {}));
            const uploadAndConfigure = () => isPhoto(options)
                ? this.uploadAndConfigureStoryPhoto(options, configureOptions)
                : this.uploadAndConfigureStoryVideo(options, configureOptions);
            // check for directThread => no stickers supported
            const threadIds = typeof options.threadIds !== 'undefined';
            const recipients = typeof options.recipientUsers !== 'undefined';
            if (recipients || threadIds) {
                configureOptions.configure_mode = '2';
                configureOptions.view_mode = options.viewMode;
                configureOptions.reply_type = options.replyType;
                configureOptions.client_context = this.chance.guid();
                if (recipients) {
                    configureOptions.recipient_users = options.recipientUsers;
                }
                configureOptions.thread_ids = threadIds ? options.threadIds : [];
                return uploadAndConfigure();
            }
            // story goes to story-feed
            if (options.toBesties) {
                configureOptions.audience = 'besties';
            }
            // check each sticker and add them
            if (typeof options.hashtags !== 'undefined' && options.hashtags.length > 0) {
                if (typeof options.caption === 'undefined') {
                    options.caption = '';
                }
                options.hashtags.forEach(hashtag => {
                    if (hashtag.tag_name.includes('#')) {
                        hashtag.tag_name = hashtag.tag_name.replace('#', '');
                    }
                    if (!options.caption.includes(hashtag.tag_name)) {
                        options.caption = `${options.caption} ${hashtag.tag_name}`;
                    }
                });
                configureOptions.story_hashtags = options.hashtags;
                configureOptions.mas_opt_in = 'NOT_PROMPTED';
            }
            if (typeof options.location !== 'undefined') {
                const { latitude, longitude } = options.location;
                configureOptions.geotag_enabled = '1';
                configureOptions.posting_latitude = latitude;
                configureOptions.posting_longitude = longitude;
                configureOptions.media_latitude = latitude;
                configureOptions.media_longitude = longitude;
                configureOptions.story_locations = [options.location.sticker];
                configureOptions.mas_opt_in = 'NOT_PROMPTED';
            }
            if (typeof options.mentions !== 'undefined' && options.mentions.length > 0) {
                if (typeof options.caption === 'undefined') {
                    options.caption = '';
                }
                else {
                    options.caption = options.caption.replace(' ', '+') + '+';
                }
                configureOptions.reel_mentions = options.mentions;
                configureOptions.mas_opt_in = 'NOT_PROMPTED';
            }
            if (typeof options.poll !== 'undefined') {
                configureOptions.story_polls = [options.poll];
                configureOptions.internal_features = 'polling_sticker';
                configureOptions.mas_opt_in = 'NOT_PROMPTED';
            }
            if (typeof options.slider !== 'undefined') {
                configureOptions.story_sliders = [options.slider];
                storyStickerIds.push(`emoji_slider_${options.slider.emoji}`);
            }
            if (typeof options.question !== 'undefined') {
                configureOptions.story_questions = [options.question];
                storyStickerIds.push('question_sticker_ma');
            }
            if (typeof options.countdown !== 'undefined') {
                configureOptions.story_countdowns = [options.countdown];
                storyStickerIds.push('countdown_sticker_time');
            }
            if (typeof options.media !== 'undefined') {
                configureOptions.attached_media = [options.media];
                storyStickerIds.push(`media_simple_${options.media.media_id}`);
            }
            if (typeof options.chat !== 'undefined') {
                configureOptions.story_chats = [options.chat];
                storyStickerIds.push('chat_sticker_id');
            }
            if (typeof options.quiz !== 'undefined') {
                configureOptions.story_quizs = [options.quiz];
                storyStickerIds.push('quiz_story_sticker_default');
            }
            if (typeof options.link !== 'undefined' && options.link.length > 0) {
                configureOptions.story_cta = [
                    {
                        links: [{ webUri: options.link }],
                    },
                ];
            }
            if (storyStickerIds.length > 0) {
                configureOptions.story_sticker_ids = storyStickerIds.join(',');
            }
            return uploadAndConfigure();
        });
    }
    igtvVideo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const videoInfo = PublishService.getVideoInfo(options.video);
            PublishService.publishDebug(`Publishing video to igtv: ${JSON.stringify(videoInfo)}`);
            const uploadId = Date.now().toString();
            const uploadResult = yield this.segmentedVideo(Object.assign(Object.assign(Object.assign({ video: options.video, isIgtvVideo: true }, videoInfo), { uploadId }), options.uploadOptions));
            yield this.client.upload.photo({ uploadId, file: options.coverFrame });
            // await this.resolveTranscode(videoInfo, uploadId, options.transcodeDelay, options.maxTranscodeTries);
            const form = {
                upload_id: uploadId,
                title: options.title,
                caption: options.caption,
                audio_muted: options.audioMuted,
                length: videoInfo.duration / 1000.0,
                extra: {
                    source_width: videoInfo.width,
                    source_height: videoInfo.height,
                },
                retryContext: uploadResult.retryContext,
            };
            if (options.shareToFeed) {
                form.igtv_share_preview_to_feed = '1';
                if (options.feedPreviewCrop) {
                    const { left, right, top, bottom } = options.feedPreviewCrop;
                    form.feed_preview_crop = { crop_left: left, crop_bottom: bottom, crop_right: right, crop_top: top };
                }
                else {
                    const ratio = videoInfo.width / videoInfo.height;
                    if (ratio > 1) {
                        throw new Error('Received invalid video ratio. Try specifying feedPreviewCrop directly.');
                    }
                    form.feed_preview_crop = {
                        crop_left: 0.0,
                        crop_right: 1.0,
                        crop_top: (1 - ratio) / 2,
                        crop_bottom: ratio + (1 - ratio) / 2,
                    };
                }
            }
            const finalInput = Object.assign(Object.assign({}, form), options.configureOptions);
            for (let i = 0; i < 6; i++) {
                try {
                    return yield this.client.media.configureToIgtv(finalInput);
                }
                catch (e) {
                    if (i >= 6) {
                        throw new errors_1.IgConfigureVideoError(e.response, finalInput);
                    }
                    yield Bluebird.delay((i + 1) * 2 * 1000);
                }
            }
        });
    }
    regularVideo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            options = lodash_1.defaults(options, {
                uploadId: Date.now(),
                waterfallId: this.chance.guid({ version: 4 }),
            });
            options.uploadName = options.uploadName || `${options.uploadId}_0_${lodash_1.random(1000000000, 9999999999)}`;
            const ruploadParams = upload_repository_1.UploadRepository.createVideoRuploadParams(options, options.uploadId);
            const { offset } = yield this.client.upload.initVideo({
                name: options.uploadName,
                ruploadParams,
                waterfallId: options.waterfallId,
            });
            return this.client.upload.video(Object.assign({ offset }, options));
        });
    }
    segmentedVideo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = options.uploadId || Date.now().toString();
            const retryContext = options.retryContext || { num_step_auto_retry: 0, num_reupload: 0, num_step_manual_retry: 0 };
            const ruploadParams = upload_repository_1.UploadRepository.createVideoRuploadParams(options, uploadId, retryContext);
            const waterfallId = options.waterfallId || lodash_1.random(1000000000, 9999999999).toString();
            const { stream_id: streamId } = yield this.client.upload.startSegmentedVideo(ruploadParams);
            const segments = options.segments ||
                (options.segmentDivider || types_1.SEGMENT_DIVIDERS.sectionSize(Math.pow(2, 24)))({
                    buffer: options.video,
                    client: this.client,
                });
            PublishService.publishDebug(`Uploading ${segments.length} segments.`);
            let startOffset = 0;
            for (const segment of segments) {
                // this is an identifier not a guid, but has the same 'length' as a guid without '-'
                const transferId = `${this.chance.guid({ version: 4 }).replace('-', '')}-0-${segment.byteLength}`;
                const { offset: streamOffset } = yield this.client.upload.videoSegmentInit({
                    waterfallId,
                    streamId,
                    startOffset,
                    ruploadParams,
                    transferId,
                });
                if (streamOffset !== 0) {
                    // TODO: implement offset != 0
                    throw new Error(`Offset != 0 isn't implemented. Open an issue including your network config and other setup information to reproduce.`);
                }
                yield this.client.upload.videoSegmentTransfer({
                    waterfallId,
                    streamId,
                    startOffset,
                    ruploadParams,
                    transferId,
                    segment,
                });
                startOffset += segment.byteLength;
            }
            const end = yield this.client.upload.endSegmentedVideo({ ruploadParams, streamId });
            return Object.assign(Object.assign({}, end), { retryContext, uploadId, waterfallId });
        });
    }
    uploadAndConfigureStoryPhoto(options, configureOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = Date.now().toString();
            const imageSize = yield sizeOf(options.file);
            yield this.client.upload.photo({
                file: options.file,
                uploadId,
            });
            return yield this.client.media.configureToStory(Object.assign(Object.assign({}, configureOptions), { upload_id: uploadId, width: imageSize.width, height: imageSize.height }));
        });
    }
    uploadAndConfigureStoryVideo(options, configureOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = lodash_1.random(100000000000, 999999999999).toString();
            const videoInfo = PublishService.getVideoInfo(options.video);
            PublishService.publishDebug(`Publishing video to story: ${JSON.stringify(videoInfo)}`);
            const waterfallId = this.chance.guid({ version: 4 });
            yield Bluebird.try(() => this.regularVideo(Object.assign({ video: options.video, uploadId, forDirectStory: configureOptions.configure_mode === '2', waterfallId, forAlbum: true }, videoInfo))).catch(errors_1.IgResponseError, error => {
                throw new errors_1.IgConfigureVideoError(error.response, videoInfo);
            });
            yield this.client.upload.photo({
                file: options.coverImage,
                waterfallId,
                uploadId,
            });
            yield Bluebird.try(() => this.client.media.uploadFinish({
                upload_id: uploadId,
                source_type: '3',
                video: { length: videoInfo.duration / 1000.0 },
            })).catch(errors_1.IgResponseError, PublishService.catchTranscodeError(videoInfo, options.transcodeDelay));
            return Bluebird.try(() => this.client.media.configureToStoryVideo(Object.assign({ upload_id: uploadId, length: videoInfo.duration / 1000.0, width: videoInfo.width, height: videoInfo.height }, configureOptions))).catch(errors_1.IgResponseError, error => {
                throw new errors_1.IgConfigureVideoError(error.response, videoInfo);
            });
        });
    }
}
exports.PublishService = PublishService;
PublishService.publishDebug = debug_1.default('ig:publish');
//# sourceMappingURL=publish.service.js.map