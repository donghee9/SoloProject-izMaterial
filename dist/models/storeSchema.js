"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
mongoose_1.default.set("debug", true);
const storeSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    storeName: {
        type: String,
        required: true,
    },
    companyTypeId: {
        type: Number,
        required: true,
    },
    bussinessTypeId: {
        type: Number,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    postNumber: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    detailAddress: {
        type: String,
        required: true,
    },
}, { timestamps: true });
storeSchema.index({ userId: 1 }, { unique: false });
const Store = mongoose_1.default.model("Store", storeSchema);
exports.default = Store;
