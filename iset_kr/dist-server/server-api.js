"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// @ts-ignore
var cors_1 = __importDefault(require("cors"));
var multer_1 = __importDefault(require("multer"));
var path_1 = require("path");
var fs_1 = require("fs");
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv = __importStar(require("dotenv"));
var User_1 = __importDefault(require("./models/User"));
var Department_1 = __importDefault(require("./models/Department"));
var ClassGroup_1 = __importDefault(require("./models/ClassGroup"));
var Module_1 = __importDefault(require("./models/Module"));
var Grade_1 = __importDefault(require("./models/Grade"));
var Announcement_1 = __importDefault(require("./models/Announcement"));
var subject_model_1 = __importDefault(require("./models/subject.model"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var envPath = (0, path_1.join)(process.cwd(), '.env');
dotenv.config({ path: envPath });
console.log('--- API Server Debug ---');
console.log('CWD:', process.cwd());
var app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create uploads directory if it doesn't exist
var uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
if (!(0, fs_1.existsSync)(uploadsDir)) {
    (0, fs_1.mkdirSync)(uploadsDir, { recursive: true });
}
app.use('/uploads', express_1.default.static(uploadsDir));
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        var ext = file.originalname.split('.').pop();
        cb(null, "material-".concat(uniqueSuffix, ".").concat(ext));
    }
});
var upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});
mongoose_1.default.set('debug', true);
// MongoDB Connection
var mongodbUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/iset_kr';
console.log('Connecting to MongoDB...');
mongoose_1.default.connect(mongodbUri)
    .then(function () { return console.log('✅ Connected to MongoDB Successfully'); })
    .catch(function (err) { return console.error('❌ Database connection failed:', err); });
// Auth & Public API Endpoints
// Register
app.post('/api/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, matricule, existingUser, cleanData_1, hashedPassword, newUser, savedUser, err_1, messages;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, matricule = _a.matricule;
                return [4 /*yield*/, User_1.default.findOne({ $or: [{ email: email }, { matricule: matricule }] })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: 'L\'utilisateur avec cet email ou matricule existe déjà.' })];
                }
                cleanData_1 = {};
                Object.keys(req.body).forEach(function (key) {
                    var value = req.body[key];
                    cleanData_1[key] = (value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value;
                });
                hashedPassword = cleanData_1.password ? bcryptjs_1.default.hashSync(cleanData_1.password, 10) : undefined;
                newUser = new User_1.default(__assign(__assign({}, cleanData_1), { name: cleanData_1.fullName || cleanData_1.name, password: hashedPassword, status: 'pending' }));
                return [4 /*yield*/, newUser.save()];
            case 2:
                savedUser = _b.sent();
                res.status(201).json({
                    message: 'Inscription réussie',
                    user: { name: savedUser.name, role: savedUser.role, _id: savedUser._id }
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                console.error('Registration error:', err_1);
                if (err_1.name === 'ValidationError') {
                    messages = Object.values(err_1.errors).map(function (val) { return val.message; });
                    return [2 /*return*/, res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') })];
                }
                res.status(500).json({ message: 'Erreur lors de l\'inscription: ' + err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Login
app.post('/api/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, isMatch, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password)
                    return [2 /*return*/, res.status(400).json({ message: 'Identifiants requis' })];
                return [4 /*yield*/, User_1.default.findOne({ $or: [{ email: username }, { matricule: username }] })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).json({ message: 'Identifiants incorrects' })];
                isMatch = false;
                if (user.password) {
                    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                        isMatch = bcryptjs_1.default.compareSync(password, user.password);
                    }
                    else {
                        isMatch = user.password === password;
                    }
                }
                if (!isMatch)
                    return [2 /*return*/, res.status(401).json({ message: 'Identifiants incorrects' })];
                if (user.status === 'pending')
                    return [2 /*return*/, res.status(403).json({ message: 'Compte en attente' })];
                if (user.status === 'inactive')
                    return [2 /*return*/, res.status(403).json({ message: 'Compte désactivé' })];
                res.status(200).json({
                    message: 'Connexion réussie',
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        matricule: user.matricule,
                        role: user.role,
                        status: user.status
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                res.status(500).json({ message: 'Erreur de connexion' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Structural Data Public APIs
app.get('/api/public/departments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var departments, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Department_1.default.find().sort({ name: 1 }).populate('headOfDepartment').lean()];
            case 1:
                departments = _a.sent();
                res.status(200).json(departments);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                console.error('Error fetching departments:', err_3);
                res.status(500).json({ message: 'Error fetching departments' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/public/classes', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var classes, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ClassGroup_1.default.find().populate('department').lean()];
            case 1:
                classes = _a.sent();
                res.status(200).json(classes);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                res.status(500).json({ message: 'Error fetching classes' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/api/public/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modules, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Module_1.default.find().populate('department').lean()];
            case 1:
                modules = _a.sent();
                res.status(200).json(modules);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(500).json({ message: 'Error fetching modules' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- Admin API Endpoints ---
// User Management
app.post('/api/admin/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, matricule, existingUser, newUser, savedUser, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, matricule = _a.matricule;
                return [4 /*yield*/, User_1.default.findOne({ $or: [{ email: email }, { matricule: matricule }] })];
            case 1:
                existingUser = _b.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ message: 'Utilisateur existant.' })];
                newUser = new User_1.default(__assign(__assign({}, req.body), { password: req.body.password ? bcryptjs_1.default.hashSync(req.body.password, 10) : undefined, status: req.body.status || 'active' }));
                return [4 /*yield*/, newUser.save()];
            case 2:
                savedUser = _b.sent();
                res.status(201).json(savedUser);
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                res.status(500).json({ message: 'Erreur création utilisateur: ' + err_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/api/admin/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.find().sort({ createdAt: -1 })];
            case 1:
                users = _a.sent();
                res.status(200).json(users);
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                res.status(500).json({ message: 'Error fetching users' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/admin/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, updatedUser, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                updateData = __assign({}, req.body);
                if (updateData.password)
                    updateData.password = bcryptjs_1.default.hashSync(updateData.password, 10);
                return [4 /*yield*/, User_1.default.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true })];
            case 1:
                updatedUser = _a.sent();
                res.status(200).json(updatedUser);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                res.status(500).json({ message: 'Error updating user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/admin/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'User deleted' });
                return [3 /*break*/, 3];
            case 2:
                err_9 = _a.sent();
                res.status(500).json({ message: 'Error deleting user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Department Management
app.get('/api/admin/departments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var departments, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Department_1.default.find().populate('headOfDepartment')];
            case 1:
                departments = _a.sent();
                res.status(200).json(departments);
                return [3 /*break*/, 3];
            case 2:
                err_10 = _a.sent();
                res.status(500).json({ message: 'Error fetching departments' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/admin/departments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dept, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                dept = new Department_1.default(req.body);
                return [4 /*yield*/, dept.save()];
            case 1:
                _a.sent();
                res.status(201).json(dept);
                return [3 /*break*/, 3];
            case 2:
                err_11 = _a.sent();
                res.status(500).json({ message: 'Error creating department' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/admin/departments/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Department_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Department deleted' });
                return [3 /*break*/, 3];
            case 2:
                err_12 = _a.sent();
                res.status(500).json({ message: 'Error deleting department' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/admin/departments/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedDept, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Department_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })];
            case 1:
                updatedDept = _a.sent();
                res.status(200).json(updatedDept);
                return [3 /*break*/, 3];
            case 2:
                err_13 = _a.sent();
                res.status(500).json({ message: 'Error updating department' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Class Management
app.get('/api/admin/classes', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var classes, err_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ClassGroup_1.default.find().populate('department')];
            case 1:
                classes = _a.sent();
                res.status(200).json(classes);
                return [3 /*break*/, 3];
            case 2:
                err_14 = _a.sent();
                res.status(500).json({ message: 'Error fetching classes' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/admin/classes', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var classGroup, err_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                classGroup = new ClassGroup_1.default(req.body);
                return [4 /*yield*/, classGroup.save()];
            case 1:
                _a.sent();
                res.status(201).json(classGroup);
                return [3 /*break*/, 3];
            case 2:
                err_15 = _a.sent();
                res.status(500).json({ message: 'Error creating class' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/admin/classes/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ClassGroup_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Class deleted' });
                return [3 /*break*/, 3];
            case 2:
                err_16 = _a.sent();
                res.status(500).json({ message: 'Error deleting class' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Subject Management
app.get('/api/admin/subjects', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subjects, err_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, subject_model_1.default.find().sort({ name: 1 })];
            case 1:
                subjects = _a.sent();
                res.status(200).json(subjects);
                return [3 /*break*/, 3];
            case 2:
                err_17 = _a.sent();
                res.status(500).json({ message: 'Error fetching subjects' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/admin/subjects', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subject, err_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                subject = new subject_model_1.default(req.body);
                return [4 /*yield*/, subject.save()];
            case 1:
                _a.sent();
                res.status(201).json(subject);
                return [3 /*break*/, 3];
            case 2:
                err_18 = _a.sent();
                res.status(500).json({ message: 'Error creating subject' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/admin/subjects/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, subject_model_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Subject deleted' });
                return [3 /*break*/, 3];
            case 2:
                err_19 = _a.sent();
                res.status(500).json({ message: 'Error deleting subject' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Module Management
app.get('/api/admin/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modules, err_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Module_1.default.find().populate('department')];
            case 1:
                modules = _a.sent();
                res.status(200).json(modules);
                return [3 /*break*/, 3];
            case 2:
                err_20 = _a.sent();
                res.status(500).json({ message: 'Error fetching modules' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/admin/modules', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var module_1, err_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                module_1 = new Module_1.default(req.body);
                return [4 /*yield*/, module_1.save()];
            case 1:
                _a.sent();
                res.status(201).json(module_1);
                return [3 /*break*/, 3];
            case 2:
                err_21 = _a.sent();
                res.status(500).json({ message: 'Error creating module' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Grade Management
app.get('/api/admin/grades', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var grades, err_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Grade_1.default.find().populate('student').populate('module')];
            case 1:
                grades = _a.sent();
                res.status(200).json(grades);
                return [3 /*break*/, 3];
            case 2:
                err_22 = _a.sent();
                res.status(500).json({ message: 'Error fetching grades' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Dashboard Stats
app.get('/api/admin/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, err_23;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                _a = {};
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'student' })];
            case 1:
                _a.students = _c.sent();
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'staff' })];
            case 2:
                _a.teachers = _c.sent();
                return [4 /*yield*/, Department_1.default.countDocuments()];
            case 3:
                _a.departments = _c.sent();
                return [4 /*yield*/, Module_1.default.countDocuments()];
            case 4:
                _a.modules = _c.sent();
                _b = {};
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'student' })];
            case 5:
                _b.students = _c.sent();
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'staff' })];
            case 6:
                _b.staff = _c.sent();
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'admin' })];
            case 7:
                _b.admins = _c.sent();
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'chef' })];
            case 8:
                stats = (_a.userDistribution = (_b.chefs = _c.sent(),
                    _b),
                    _a);
                res.status(200).json(stats);
                return [3 /*break*/, 10];
            case 9:
                err_23 = _c.sent();
                res.status(500).json({ message: 'Error fetching stats' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// Announcement Management (Admin)
app.get('/api/admin/announcements', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var announcements, err_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Announcement_1.default.find().sort({ createdAt: -1 })];
            case 1:
                announcements = _a.sent();
                res.status(200).json(announcements);
                return [3 /*break*/, 3];
            case 2:
                err_24 = _a.sent();
                res.status(500).json({ message: 'Error fetching announcements' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/admin/announcements', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var announcement, err_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                announcement = new Announcement_1.default(req.body);
                return [4 /*yield*/, announcement.save()];
            case 1:
                _a.sent();
                res.status(201).json(announcement);
                return [3 /*break*/, 3];
            case 2:
                err_25 = _a.sent();
                res.status(500).json({ message: 'Error creating announcement' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/api/admin/announcements/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var announcement, err_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Announcement_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })];
            case 1:
                announcement = _a.sent();
                res.status(200).json(announcement);
                return [3 /*break*/, 3];
            case 2:
                err_26 = _a.sent();
                res.status(500).json({ message: 'Error updating announcement' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/api/admin/announcements/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var err_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Announcement_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Announcement deleted' });
                return [3 /*break*/, 3];
            case 2:
                err_27 = _a.sent();
                res.status(500).json({ message: 'Error deleting announcement' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// API Routes
// Public Stats for Homepage
app.get('/api/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, err_28;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = {};
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'student' })];
            case 1:
                _a.students = _b.sent();
                return [4 /*yield*/, User_1.default.countDocuments({ role: 'staff' })];
            case 2:
                _a.teachers = _b.sent();
                return [4 /*yield*/, Department_1.default.countDocuments()];
            case 3:
                _a.departments = _b.sent();
                return [4 /*yield*/, Module_1.default.countDocuments()];
            case 4:
                stats = (_a.modules = _b.sent(),
                    _a);
                res.status(200).json(stats);
                return [3 /*break*/, 6];
            case 5:
                err_28 = _b.sent();
                res.status(500).json({ message: 'Error fetching stats' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
app.get('/api/announcements', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var announcements, err_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Announcement_1.default.find({ status: 'published' }).sort({ createdAt: -1 }).lean()];
            case 1:
                announcements = _a.sent();
                res.status(200).json(announcements);
                return [3 /*break*/, 3];
            case 2:
                err_29 = _a.sent();
                res.status(500).json({ message: 'Error fetching announcements' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Port
var port = process.env['PORT'] || 4000;
app.listen(port, function () {
    console.log("API Server listening on http://localhost:".concat(port));
});
