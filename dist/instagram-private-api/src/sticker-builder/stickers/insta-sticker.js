"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstaSticker = void 0;
const snakeCaseKeys = __importStar(require("snakecase-keys"));
const class_transformer_1 = require("class-transformer");
class InstaSticker {
    constructor() {
        this.rotation = 0.0;
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0;
        this.isSticker = true;
    }
    /**
     * Only used to set the media id when attaching media
     */
    get additionalConfigureProperties() {
        return null;
    }
    center() {
        this.x = 0.5;
        this.y = 0.5;
        return this;
    }
    rotateDeg(deg) {
        this.rotation = deg % 360.0;
        return this;
    }
    scale(factor) {
        this.width *= factor;
        this.height *= factor;
        return this;
    }
    moveForward(layers = 1) {
        this.z += layers;
        return this;
    }
    moveBackwards(layers = 1) {
        return this.moveForward(-layers);
    }
    right() {
        this.x = 1.0 - this.width / 2;
        return this;
    }
    left() {
        this.x = this.width / 2;
        return this;
    }
    top() {
        this.y = this.height / 2;
        return this;
    }
    bottom() {
        this.y = 1.0 - this.height / 2;
        return this;
    }
    toJSON() {
        // @ts-ignore
        return snakeCaseKeys(class_transformer_1.classToPlain(this), { deep: true });
    }
}
exports.InstaSticker = InstaSticker;
//# sourceMappingURL=insta-sticker.js.map