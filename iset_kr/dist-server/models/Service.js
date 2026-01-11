"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const ServiceSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, required: true },
    link: { type: String },
    isPopular: { type: Boolean, default: false }
});
exports.default = mongoose_1.default.models['Service'] || mongoose_1.default.model('Service', ServiceSchema);
