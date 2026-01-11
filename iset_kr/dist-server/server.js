"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reqHandler = void 0;
const tslib_1 = require("tslib");
const node_1 = require("@angular/ssr/node");
const express_1 = tslib_1.__importDefault(require("express"));
const bcryptjs_1 = tslib_1.__importDefault(require("bcryptjs"));
// @ts-ignore
const cors_1 = tslib_1.__importDefault(require("cors"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const dotenv = tslib_1.__importStar(require("dotenv"));
const User_1 = tslib_1.__importDefault(require("./models/User"));
const Department_1 = tslib_1.__importDefault(require("./models/Department"));
const ClassGroup_1 = tslib_1.__importDefault(require("./models/ClassGroup"));
const Module_1 = tslib_1.__importDefault(require("./models/Module"));
const Grade_1 = tslib_1.__importDefault(require("./models/Grade"));
const Announcement_1 = tslib_1.__importDefault(require("./models/Announcement"));
const Material_1 = tslib_1.__importDefault(require("./models/Material"));
const Claim_1 = tslib_1.__importDefault(require("./models/Claim"));
const Schedule_1 = tslib_1.__importDefault(require("./models/Schedule"));
const subject_model_1 = tslib_1.__importDefault(require("./models/subject.model"));
const Notification_1 = tslib_1.__importDefault(require("./models/Notification"));
const Message_1 = tslib_1.__importDefault(require("./models/Message"));
const Contact_1 = tslib_1.__importDefault(require("./models/Contact"));
const envPath = (0, node_path_1.join)(process.cwd(), '.env');
dotenv.config({ path: envPath });
console.log('--- Server Debug ---');
console.log('CWD:', process.cwd());
console.log('Env Path:', envPath);
console.log('MONGODB_URI defined:', !!process.env['MONGODB_URI']);
console.log('--------------------');
const browserDistFolder = (0, node_path_1.join)(import.meta.dirname, '../browser');
const app = (0, express_1.default)();
const angularApp = new node_1.AngularNodeAppEngine();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create uploads directory if it doesn't exist
const uploadsDir = (0, node_path_1.join)(process.cwd(), 'uploads');
if (!(0, node_fs_1.existsSync)(uploadsDir)) {
    (0, node_fs_1.mkdirSync)(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadsDir);
}
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(uploadsDir));
// Configure Multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `material-${uniqueSuffix}.${ext}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
    fileFilter: (req, file, cb) => {
        var _a;
        const allowedTypes = /pdf|ppt|pptx|doc|docx|zip|rar/;
        const ext = ((_a = file.originalname.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        if (allowedTypes.test(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error('Type de fichier non autorisé'));
        }
    }
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method === 'POST')
        console.log('Body:', req.body);
    next();
});
mongoose_1.default.set('debug', true);
// MongoDB Connection
const mongodbUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/iset_kr';
console.log('Connecting to MongoDB...');
const connectWithRetry = () => {
    mongoose_1.default.connect(mongodbUri)
        .then(() => console.log('✅ Connected to MongoDB Successfully'))
        .catch((err) => {
        console.error('❌ Database connection failed. Possible IP Whitelist issue or URI error.');
        console.error('Error Details:', err.message);
        // Wait 10s before retry
        setTimeout(connectWithRetry, 10000);
    });
};
connectWithRetry();
/**
 * Example Express Rest API endpoints can be defined here.
 */
app.post('/api/register', async (req, res) => {
    console.log('>>> [API] Register Request Received');
    console.log('>>> Data Keys:', Object.keys(req.body));
    try {
        const { email, matricule } = req.body;
        console.log('>>> Checking existing user for email/matricule:', email, matricule);
        const existingUser = await User_1.default.findOne({
            $or: [
                { email: email },
                { matricule: matricule }
            ]
        });
        if (existingUser) {
            console.log('>>> User already exists conflict found');
            return res.status(400).json({ message: 'L\'utilisateur avec cet email ou matricule existe déjà.' });
        }
        console.log('>>> Sanitizing data...');
        const cleanData = {};
        Object.keys(req.body).forEach(key => {
            const value = req.body[key];
            // Convert empty strings or empty arrays to undefined for Mongoose
            cleanData[key] = (value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value;
        });
        const hashedPassword = cleanData.password ? bcryptjs_1.default.hashSync(cleanData.password, 10) : undefined;
        console.log('>>> Creating User instance with role:', cleanData.role);
        const newUser = new User_1.default({
            name: cleanData.fullName,
            email: cleanData.email,
            matricule: cleanData.matricule,
            phone: cleanData.phone,
            cin: cleanData.cin,
            birthDate: cleanData.birthDate,
            gender: cleanData.gender,
            password: hashedPassword,
            role: cleanData.role || 'student',
            status: 'pending',
            department: cleanData.department,
            classGroup: cleanData.classGroup,
            level: cleanData.level,
            group: cleanData.group,
            grade: cleanData.grade,
            speciality: cleanData.speciality,
            office: cleanData.office,
            assignedClasses: cleanData.assignedClasses,
            subjects: cleanData.subjects
        });
        console.log('>>> Saving to MongoDB...');
        const savedUser = await newUser.save();
        console.log('>>> Save successful! ID:', savedUser._id);
        res.status(201).json({
            message: 'Inscription réussie',
            user: { name: savedUser.name, role: savedUser.role, _id: savedUser._id }
        });
    }
    catch (err) {
        console.error('>>> [CRITICAL] Registration error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val) => val.message);
            console.error('>>> Validation failed:', messages);
            return res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Erreur lors de l\'inscription: ' + err.message });
    }
});
// Public API Endpoints
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
        res.status(200).json(announcements);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});
app.get('/api/public/departments', async (req, res) => {
    try {
        const departments = await Department_1.default.find().sort({ name: 1 }).populate('headOfDepartment').lean();
        res.status(200).json(departments);
    }
    catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ message: 'Error fetching departments' });
    }
});
app.post('/api/login', async (req, res) => {
    console.log('Login request body:', req.body);
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Veuillez fournir un identifiant et un mot de passe.' });
        }
        const user = await User_1.default.findOne({
            $or: [{ email: username }, { matricule: username }]
        });
        if (!user) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
        }
        // Check password (support both hashed and plain text for transition)
        let isMatch = false;
        if (user.password) {
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                isMatch = bcryptjs_1.default.compareSync(password, user.password);
            }
            else {
                isMatch = user.password === password;
            }
        }
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
        }
        // Check user status
        if (user.status === 'pending') {
            return res.status(403).json({
                message: 'Votre compte est en attente de validation par l\'administration.',
                status: 'pending'
            });
        }
        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Le compte est désactivé. Contactez l\'administrateur.',
                status: 'inactive'
            });
        }
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
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
});
// Update User Profile
app.put('/api/user/profile/:id', async (req, res) => {
    try {
        const { email, matricule, name } = req.body;
        const user = await User_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        user.email = email || user.email;
        user.matricule = matricule || user.matricule;
        user.name = name || user.name;
        await user.save();
        res.status(200).json({
            message: 'Profil mis à jour',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                matricule: user.matricule,
                role: user.role
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
});
// Change Password
app.put('/api/user/password/:id', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        // Check current password
        let isMatch = false;
        if (user.password) {
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                isMatch = bcryptjs_1.default.compareSync(currentPassword, user.password);
            }
            else {
                isMatch = user.password === currentPassword;
            }
        }
        if (!isMatch) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
        }
        user.password = bcryptjs_1.default.hashSync(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Mot de passe modifié avec succès' });
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
    }
});
app.get('/api/public/classes', async (req, res) => {
    try {
        const classes = await ClassGroup_1.default.find().populate('department').lean();
        res.status(200).json(classes);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});
app.get('/api/public/modules', async (req, res) => {
    try {
        const modules = await Module_1.default.find().populate('department').lean();
        res.status(200).json(modules);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching modules' });
    }
});
// --- Notification API ---
app.get('/api/notifications', async (req, res) => {
    try {
        const { userId } = req.query;
        const notifications = await Notification_1.default.find({ recipient: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});
app.put('/api/notifications/:id/read', async (req, res) => {
    try {
        await Notification_1.default.findByIdAndUpdate(req.params.id, { read: true });
        res.status(200).json({ message: 'Marked as read' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});
// --- Messaging API ---
app.get('/api/messages', async (req, res) => {
    try {
        const { userId } = req.query;
        const messages = await Message_1.default.find({
            $or: [{ sender: userId }, { recipient: userId }]
        }).populate('sender recipient').sort({ createdAt: -1 });
        res.status(200).json(messages);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});
app.post('/api/messages', async (req, res) => {
    try {
        const message = new Message_1.default(req.body);
        await message.save();
        res.status(201).json(message);
    }
    catch (err) {
        res.status(500).json({ message: 'Error sending message' });
    }
});
// --- Public Contact API ---
app.post('/api/public/contact', async (req, res) => {
    try {
        const contactMessage = new Contact_1.default(req.body);
        await contactMessage.save();
        console.log('>>> New contact message saved:', contactMessage._id);
        res.status(201).json({ message: 'Message enregistré avec succès' });
    }
    catch (err) {
        console.error('Error saving contact message:', err);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement du message' });
    }
});
// Admin API Endpoints
// Create user (Admin only)
app.post('/api/admin/users', async (req, res) => {
    try {
        const { email, matricule } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { matricule }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email ou matricule existe déjà.' });
        }
        const newUser = new User_1.default({
            ...req.body,
            password: req.body.password ? bcryptjs_1.default.hashSync(req.body.password, 10) : undefined,
            status: req.body.status || 'active'
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur: ' + err.message });
    }
});
// List all users
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await User_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});
// Update user (Full edit)
app.put('/api/admin/users/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password) {
            updateData.password = bcryptjs_1.default.hashSync(updateData.password, 10);
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user' });
    }
});
// Delete user
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await User_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});
// Department Management
app.get('/api/admin/departments', async (req, res) => {
    try {
        const departments = await Department_1.default.find().populate('headOfDepartment');
        res.status(200).json(departments);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching departments' });
    }
});
app.post('/api/admin/departments', async (req, res) => {
    try {
        const dept = new Department_1.default(req.body);
        await dept.save();
        res.status(201).json(dept);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating department' });
    }
});
app.delete('/api/admin/departments/:id', async (req, res) => {
    try {
        await Department_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Department deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting department' });
    }
});
app.put('/api/admin/departments/:id', async (req, res) => {
    try {
        const updatedDept = await Department_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedDept);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating department' });
    }
});
// Class Management
app.get('/api/admin/classes', async (req, res) => {
    try {
        const classes = await ClassGroup_1.default.find().populate('department');
        res.status(200).json(classes);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});
app.post('/api/admin/classes', async (req, res) => {
    try {
        const classGroup = new ClassGroup_1.default(req.body);
        await classGroup.save();
        res.status(201).json(classGroup);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating class' });
    }
});
app.delete('/api/admin/classes/:id', async (req, res) => {
    try {
        await ClassGroup_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Class deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting class' });
    }
});
// Subject Management
app.get('/api/admin/subjects', async (req, res) => {
    try {
        const subjects = await subject_model_1.default.find().sort({ name: 1 });
        res.status(200).json(subjects);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching subjects' });
    }
});
app.post('/api/admin/subjects', async (req, res) => {
    try {
        const subject = new subject_model_1.default(req.body);
        await subject.save();
        res.status(201).json(subject);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating subject' });
    }
});
app.delete('/api/admin/subjects/:id', async (req, res) => {
    try {
        await subject_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subject deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting subject' });
    }
});
// Module Management
app.get('/api/admin/modules', async (req, res) => {
    try {
        const modules = await Module_1.default.find().populate('department');
        res.status(200).json(modules);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching modules' });
    }
});
app.post('/api/admin/modules', async (req, res) => {
    try {
        const module = new Module_1.default(req.body);
        await module.save();
        res.status(201).json(module);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating module' });
    }
});
// Grade Management
app.get('/api/admin/grades', async (req, res) => {
    try {
        const grades = await Grade_1.default.find()
            .populate('student')
            .populate('module');
        res.status(200).json(grades);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching grades' });
    }
});
app.post('/api/admin/grades', async (req, res) => {
    try {
        const grade = new Grade_1.default(req.body);
        await grade.save();
        res.status(201).json(grade);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating grade' });
    }
});
// Announcement Management (Events, Tenders, News)
app.get('/api/admin/announcements', async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});
app.post('/api/admin/announcements', async (req, res) => {
    try {
        const announcement = new Announcement_1.default(req.body);
        await announcement.save();
        res.status(201).json(announcement);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating announcement' });
    }
});
app.put('/api/admin/announcements/:id', async (req, res) => {
    try {
        const announcement = await Announcement_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(announcement);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating announcement' });
    }
});
app.delete('/api/admin/announcements/:id', async (req, res) => {
    try {
        await Announcement_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Announcement deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting announcement' });
    }
});
// Dashboard Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const stats = {
            students: await User_1.default.countDocuments({ role: 'student' }),
            teachers: await User_1.default.countDocuments({ role: 'staff' }),
            departments: await Department_1.default.countDocuments(),
            modules: await Module_1.default.countDocuments(),
            userDistribution: {
                students: await User_1.default.countDocuments({ role: 'student' }),
                staff: await User_1.default.countDocuments({ role: 'staff' }),
                admins: await User_1.default.countDocuments({ role: 'admin' }),
                chefs: await User_1.default.countDocuments({ role: 'chef' })
            }
        };
        res.status(200).json(stats);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});
// Admin Contact Messages Management
app.get('/api/admin/contacts', async (req, res) => {
    try {
        const contacts = await Contact_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching contact messages' });
    }
});
app.put('/api/admin/contacts/:id/read', async (req, res) => {
    try {
        await Contact_1.default.findByIdAndUpdate(req.params.id, { status: 'read' });
        res.status(200).json({ message: 'Message marked as read' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating contact status' });
    }
});
app.delete('/api/admin/contacts/:id', async (req, res) => {
    try {
        await Contact_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Message deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting message' });
    }
});
// --- Staff API Endpoints ---
// Get staff modules
app.get('/api/staff/modules', async (req, res) => {
    try {
        // In a real app, filter by req.user.id
        const modules = await Module_1.default.find().populate('department');
        res.status(200).json(modules);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching staff modules' });
    }
});
// Get staff students (by class)
app.get('/api/staff/students', async (req, res) => {
    try {
        const { classGroupId } = req.query;
        const filter = { role: 'student' };
        if (classGroupId)
            filter.classGroup = classGroupId;
        const students = await User_1.default.find(filter).populate('classGroup');
        res.status(200).json(students);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching staff students' });
    }
});
// Get/Update grades
app.get('/api/staff/grades', async (req, res) => {
    try {
        const { moduleId, classGroupId } = req.query;
        const grades = await Grade_1.default.find({ module: moduleId }).populate('student');
        res.status(200).json(grades);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching staff grades' });
    }
});
app.post('/api/staff/grades/bulk', async (req, res) => {
    try {
        const { grades } = req.body;
        for (const g of grades) {
            await Grade_1.default.findOneAndUpdate({ student: g.student, module: g.module, examType: g.examType }, g, { upsert: true, new: true });
        }
        res.status(200).json({ message: 'Grades updated' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating grades bulk' });
    }
});
// Submit grades for validation (Teacher)
app.post('/api/staff/grades/submit', async (req, res) => {
    try {
        const { gradeIds } = req.body;
        await Grade_1.default.updateMany({ _id: { $in: gradeIds } }, { status: 'submitted' });
        res.status(200).json({ message: 'Grades submitted for validation' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error submitting grades' });
    }
});
// Validate grades (HoD/Chef)
app.post('/api/chef/grades/validate', async (req, res) => {
    try {
        const { gradeIds, chefId } = req.body;
        await Grade_1.default.updateMany({ _id: { $in: gradeIds } }, { status: 'validated', validatedBy: chefId, published: true });
        res.status(200).json({ message: 'Grades validated and published' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error validating grades' });
    }
});
// Materials
app.get('/api/staff/materials', async (req, res) => {
    try {
        const materials = await Material_1.default.find().populate('module');
        res.status(200).json(materials);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching materials' });
    }
});
// File upload endpoint for materials
app.post('/api/staff/materials/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        const fileSizeKB = (req.file.size / 1024).toFixed(2);
        const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);
        const sizeDisplay = req.file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;
        const materialData = {
            ...req.body,
            fileUrl: fileUrl,
            size: sizeDisplay
        };
        const material = new Material_1.default(materialData);
        await material.save();
        console.log('✅ Material uploaded:', material._id, fileUrl);
        res.status(201).json(material);
    }
    catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Erreur lors de l\'upload: ' + err.message });
    }
});
app.post('/api/staff/materials', async (req, res) => {
    try {
        const material = new Material_1.default(req.body);
        await material.save();
        res.status(201).json(material);
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating material' });
    }
});
// Claims
app.get('/api/staff/claims', async (req, res) => {
    try {
        const claims = await Claim_1.default.find().populate('student').populate('module');
        res.status(200).json(claims);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching claims' });
    }
});
// Announcements (Public)
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement_1.default.find().sort({ date: -1, publishDate: -1 });
        res.status(200).json(announcements);
    }
    catch (err) {
        console.error('Error fetching announcements:', err);
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});
app.put('/api/staff/claims/:id', async (req, res) => {
    try {
        const claim = await Claim_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(claim);
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating claim' });
    }
});
// Schedule Management (Admin)
app.get('/api/admin/schedules', async (req, res) => {
    try {
        const schedules = await Schedule_1.default.find()
            .populate('module')
            .populate('subject')
            .populate('classGroup')
            .populate('staff');
        res.status(200).json(schedules);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching schedules' });
    }
});
app.post('/api/admin/schedules', async (req, res) => {
    console.log('>>> [API] Create Schedule Request:', req.body);
    try {
        // Sanitize: Remove empty string fields that should be ObjectIds
        ['module', 'subject', 'classGroup', 'staff'].forEach(field => {
            if (req.body[field] === '') {
                delete req.body[field];
            }
        });
        const { day, startTime, classGroup, room } = req.body;
        // Validate class conflict
        const classConflict = await Schedule_1.default.findOne({
            day,
            startTime,
            classGroup
        });
        if (classConflict) {
            return res.status(409).json({
                error: 'Conflit détecté',
                message: 'Cette classe a déjà une séance à ce créneau horaire.',
                conflictType: 'class'
            });
        }
        // Validate room conflict
        if (room) {
            const roomStr = room.toString();
            const roomConflict = await Schedule_1.default.findOne({
                day,
                startTime,
                room: { $regex: new RegExp(`^${roomStr}$`, 'i') } // Case-insensitive
            });
            if (roomConflict) {
                return res.status(409).json({
                    error: 'Conflit détecté',
                    message: `La salle ${room} est déjà occupée à ce créneau horaire.`,
                    conflictType: 'room'
                });
            }
        }
        const schedule = new Schedule_1.default(req.body);
        console.log('>>> Saving schedule:', schedule);
        const savedSchedule = await schedule.save();
        console.log('>>> Schedule saved successfully:', savedSchedule._id);
        res.status(201).json(savedSchedule);
    }
    catch (err) {
        console.error('>>> [CRITICAL] Schedule creation error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((val) => val.message);
            console.error('>>> Validation failed:', messages);
            return res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Error creating schedule', error: err.message });
    }
});
app.delete('/api/admin/schedules/:id', async (req, res) => {
    try {
        await Schedule_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Schedule deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting schedule' });
    }
});
// Schedule (Staff View)
app.get('/api/staff/schedule', async (req, res) => {
    try {
        const schedule = await Schedule_1.default.find({ staff: req.query.staffId })
            .populate('module')
            .populate('classGroup');
        res.status(200).json(schedule);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching schedule' });
    }
});
// Staff Dashboard Stats
// Staff Dashboard Stats
app.get('/api/staff/stats', async (req, res) => {
    try {
        const staffId = req.query.staffId;
        if (!staffId)
            return res.status(400).json({ message: 'Staff ID required' });
        const staffUser = await User_1.default.findById(staffId);
        if (!staffUser)
            return res.status(404).json({ message: 'Staff not found' });
        // 1. Total Students: In classes assigned to this staff
        let totalStudents = 0;
        if (staffUser.assignedClasses && staffUser.assignedClasses.length > 0) {
            totalStudents = await User_1.default.countDocuments({
                role: 'student',
                classGroup: { $in: staffUser.assignedClasses }
            });
        }
        // 2. Total Modules: Assigned to this staff
        const totalModules = staffUser.subjects ? staffUser.subjects.length : 0;
        // 3. Materials & Claims (already correct)
        const stats = {
            totalStudents: totalStudents,
            totalModules: totalModules,
            totalMaterials: await Material_1.default.countDocuments({ uploadedBy: staffId }),
            pendingClaims: await Claim_1.default.countDocuments({ staff: staffId, status: 'pending' })
        };
        res.status(200).json(stats);
    }
    catch (err) {
        console.error('Error fetching staff stats:', err);
        res.status(500).json({ message: 'Error fetching staff stats' });
    }
});
/**
 * Serve static files from /browser
 */
app.use(express_1.default.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
}));
/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
    angularApp
        .handle(req)
        .then((response) => response ? (0, node_1.writeResponseToNodeResponse)(response, res) : next())
        .catch(next);
});
/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if ((0, node_1.isMainModule)(import.meta.url) || process.env['pm_id']) {
    const port = process.env['PORT'] || 4000;
    app.listen(port, (error) => {
        if (error) {
            throw error;
        }
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}
/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
exports.reqHandler = (0, node_1.createNodeRequestHandler)(app);
