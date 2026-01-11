"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const StatSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    value: { type: Number, required: true },
    suffix: { type: String },
    icon: { type: String, required: true },
    description: { type: String },
    change: { type: String },
    color: { type: String }
});
exports.default = mongoose_1.default.models['Stat'] || mongoose_1.default.model('Stat', StatSchema);
