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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const error_1 = __importDefault(require("./middleware/error"));
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(error_1.default);
app.use(routers_1.default);
// health check
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});
const SERVER_PORT = process.env.SERVER_PORT || 5000;
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const DB_URI = process.env.MONGODB_URI;
        if (!DB_URI) {
            console.error("MONGODB_URI not set in the .env file.");
            throw new Error("Database URI not configured.");
        }
        try {
            yield mongoose_1.default.connect(DB_URI);
            console.log("Connected to MongoDB");
        }
        catch (error) {
            console.error("Failed to connect to the database:", error);
            throw new Error("Failed to connect to the database.");
        }
    });
}
connectToDatabase()
    .then(() => {
    app.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`);
    });
})
    .catch((error) => {
    console.error("Server startup failed:", error);
});
