"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var subjectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.models['Subject'] || mongoose_1.default.model('Subject', subjectSchema);
