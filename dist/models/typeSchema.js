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
exports.discoveredPathType = exports.franchiseCountType = exports.companyType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const companyTypeSchema = new mongoose_1.Schema({
    typeName: {
        type: String,
        required: true,
        enum: ["요식업", "숙박/여행관련", "엔터테이먼트/미디어", "의료업", "기타"],
    },
    companyTypeId: {
        type: Number,
        required: true,
    },
});
const companyType = mongoose_1.default.model("companyType", companyTypeSchema);
exports.companyType = companyType;
const franchiseCountTypeSchema = new mongoose_1.Schema({
    typeName: {
        type: String,
        required: true,
        enum: ["20개이하", "20~50개", "50개 이상", "없음"],
    },
    franchiseCountTypeId: {
        type: Number,
        required: true,
    },
});
const franchiseCountType = mongoose_1.default.model("franchiseCountType", franchiseCountTypeSchema);
exports.franchiseCountType = franchiseCountType;
const discoveredPathTypeSchema = new mongoose_1.Schema({
    typeName: {
        type: String,
        required: true,
        enum: ["네이버 포털 검색", "구글 포털 검색", "지인소개", "DM 이메일/문자"],
    },
    discoveredPathTypeId: {
        type: Number,
        required: true,
    },
});
const discoveredPathType = mongoose_1.default.model("discoveredPathType", discoveredPathTypeSchema);
exports.discoveredPathType = discoveredPathType;
