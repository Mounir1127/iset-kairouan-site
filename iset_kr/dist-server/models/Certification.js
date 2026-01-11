"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importStar(require("mongoose"));
const CertificationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    standard: { type: String, required: true },
    description: { type: String, required: true },
    issuedBy: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    expiryDate: { type: Date },
    status: { type: String, enum: ['valid', 'expiring', 'expired'], default: 'valid' }
});
exports.default = mongoose_1.default.models['Certification'] || mongoose_1.default.model('Certification', CertificationSchema);
