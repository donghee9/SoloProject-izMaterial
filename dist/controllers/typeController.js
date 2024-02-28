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
exports.createDiscoveredPath = exports.createFranchiseCount = exports.createCompany = void 0;
const typeService_1 = require("../services/typeService");
const createCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeName } = req.body;
        const newType = yield (0, typeService_1.createCompanyType)(typeName);
        res.json(newType);
    }
    catch (err) {
        console.error("Error creating companytype:", err);
        res.status(500).json({ error: "Failed to create companytype" });
    }
});
exports.createCompany = createCompany;
const createFranchiseCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeName } = req.body;
        const newType = yield (0, typeService_1.createFranchiseCountType)(typeName);
        res.json(newType);
    }
    catch (err) {
        console.error("Error creating FranchiseCountType:", err);
        res.status(500).json({ error: "Failed to create FranchiseCountType" });
    }
});
exports.createFranchiseCount = createFranchiseCount;
const createDiscoveredPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { typeName } = req.body;
        const newType = yield (0, typeService_1.createDiscoveredPathType)(typeName);
        res.json(newType);
    }
    catch (err) {
        console.error("Error creating DiscoveredPathType:", err);
        res.status(500).json({ error: "Failed to create DiscoveredPathType" });
    }
});
exports.createDiscoveredPath = createDiscoveredPath;
