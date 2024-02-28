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
exports.createDiscoveredPathType = exports.createFranchiseCountType = exports.createCompanyType = void 0;
const typeSchema_1 = require("../models/typeSchema");
const createCompanyType = function (typeName) {
    return __awaiter(this, void 0, void 0, function* () {
        let companyTypeId;
        switch (typeName) {
            case "요식업":
                companyTypeId = 1;
                break;
            case "숙박/여행관련":
                companyTypeId = 2;
                break;
            case "엔터테인먼트/미디어":
                companyTypeId = 3;
                break;
            case "의료업":
                companyTypeId = 4;
                break;
            case "기타":
                companyTypeId = 5;
                break;
        }
        const newType = new typeSchema_1.companyType({
            typeName: typeName,
            companyTypeId: companyTypeId,
        });
        return newType.save();
    });
};
exports.createCompanyType = createCompanyType;
const createFranchiseCountType = function (typeName) {
    return __awaiter(this, void 0, void 0, function* () {
        let franchiseCountTypeId;
        switch (typeName) {
            case "20개이하":
                franchiseCountTypeId = 1;
                break;
            case "20~50개":
                franchiseCountTypeId = 2;
                break;
            case "50개 이상":
                franchiseCountTypeId = 3;
                break;
            case "없음":
                franchiseCountTypeId = 4;
                break;
        }
        const newType = new typeSchema_1.franchiseCountType({
            typeName: typeName,
            franchiseCountTypeId: franchiseCountTypeId,
        });
        return newType.save();
    });
};
exports.createFranchiseCountType = createFranchiseCountType;
const createDiscoveredPathType = function (typeName) {
    return __awaiter(this, void 0, void 0, function* () {
        let discoveredPathTypeId;
        switch (typeName) {
            case "네이버 포털 검색":
                discoveredPathTypeId = 1;
                break;
            case "구글 포털 검색":
                discoveredPathTypeId = 2;
                break;
            case "지인소개":
                discoveredPathTypeId = 3;
                break;
            case "DM 이메일/문자":
                discoveredPathTypeId = 4;
                break;
        }
        const newType = new typeSchema_1.discoveredPathType({
            typeName: typeName,
            discoveredPathTypeId: discoveredPathTypeId,
        });
        return newType.save();
    });
};
exports.createDiscoveredPathType = createDiscoveredPathType;
