"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const FormationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String },
    level: { type: String },
    image: { type: String },
    link: { type: String }
});
exports.default = mongoose_1.default.models['Formation'] || mongoose_1.default.model('Formation', FormationSchema);
