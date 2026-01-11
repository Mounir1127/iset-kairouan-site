import express from 'express';
// @ts-ignore
import cors from 'cors';
import multer from 'multer';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import mongoose, { Schema, Document } from 'mongoose';
import * as dotenv from 'dotenv';
import User from './models/User';
import Department from './models/Department';
import ClassGroup from './models/ClassGroup';
import Module from './models/Module';
import Grade from './models/Grade';
import Announcement from './models/Announcement';
import Material from './models/Material';
import Claim from './models/Claim';
import Attendance from './models/Attendance';
import Schedule from './models/Schedule';
import Subject from './models/subject.model';
import Notification from './models/Notification';
import Message from './models/Message';

const envPath = join(process.cwd(), '.env');
dotenv.config({ path: envPath });

console.log('--- Server Debug (Dev) ---');
console.log('CWD:', process.cwd());
console.log('Env Path:', envPath);
console.log('MONGODB_URI defined:', !!process.env['MONGODB_URI']);
console.log('--------------------');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST') console.log('Body:', req.body);
  next();
});

mongoose.set('debug', true);

// MongoDB Connection
const mongodbUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/iset_kr';
console.log('Connecting to MongoDB...');

const connectWithRetry = () => {
  mongoose.connect(mongodbUri)
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

app.post('/api/register', async (req: any, res: any) => {
  console.log('>>> [API] Register Request Received');
  console.log('>>> Data Keys:', Object.keys(req.body));

  try {
    const { email, matricule } = req.body;

    console.log('>>> Checking existing user for email/matricule:', email, matricule);
    const existingUser = await User.findOne({
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
    const cleanData: any = {};
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      // Convert empty strings or empty arrays to undefined for Mongoose
      cleanData[key] = (value === '' || (Array.isArray(value) && value.length === 0)) ? undefined : value;
    });

    console.log('>>> Creating User instance with role:', cleanData.role);
    const newUser = new User({
      name: cleanData.fullName,
      email: cleanData.email,
      matricule: cleanData.matricule,
      phone: cleanData.phone,
      cin: cleanData.cin,
      birthDate: cleanData.birthDate,
      gender: cleanData.gender,
      password: cleanData.password,
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
    const savedUser = await (await newUser.save()).populate('department classGroup');
    console.log('>>> Save successful! ID:', savedUser._id);

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: savedUser._id,
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        matricule: savedUser.matricule,
        role: savedUser.role,
        status: savedUser.status,
        department: savedUser.department,
        classGroup: savedUser.classGroup,
        level: savedUser.level,
        group: savedUser.group
      }
    });
  } catch (err: any) {
    console.error('>>> [CRITICAL] Registration error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      console.error('>>> Validation failed:', messages);
      return res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') });
    }
    res.status(500).json({ message: 'Erreur lors de l\'inscription: ' + err.message });
  }
});

// Public API Endpoints
app.get('/api/announcements', async (req: any, res: any) => {
  try {
    const announcements = await Announcement.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

app.get('/api/public/departments', async (req: any, res: any) => {
  try {
    const departments = await Department.find().sort({ name: 1 }).populate('headOfDepartment').lean();
    res.status(200).json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

app.post('/api/login', async (req: any, res: any) => {
  console.log('Login request body:', req.body);
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Veuillez fournir un identifiant et un mot de passe.' });
    }

    const user = await User.findOne({
      $or: [{ email: username }, { matricule: username }],
      password: password
    }).populate('department').populate('classGroup');

    if (!user) {
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
        _id: user._id,
        name: user.name,
        email: user.email,
        matricule: user.matricule,
        role: user.role,
        status: user.status,
        department: user.department,
        classGroup: user.classGroup,
        level: user.level,
        group: user.group
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur lors de la connexion.' });
  }
});

app.get('/api/public/classes', async (req: any, res: any) => {
  try {
    const classes = await ClassGroup.find().populate('department').lean();
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

app.get('/api/public/modules', async (req: any, res: any) => {
  try {
    const modules = await Module.find().populate('department').lean();
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching modules' });
  }
});

// --- Notification API ---
app.get('/api/notifications', async (req: any, res: any) => {
  try {
    const { userId } = req.query;
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

app.put('/api/notifications/:id/read', async (req: any, res: any) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// --- Messaging API ---
app.get('/api/messages', async (req: any, res: any) => {
  try {
    const { userId } = req.query;
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    }).populate('sender recipient').sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

app.post('/api/messages', async (req: any, res: any) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Admin API Endpoints

// List all users
app.get('/api/admin/users', async (req: any, res: any) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role or status
app.put('/api/admin/users/:id', async (req: any, res: any) => {
  try {
    const { role, status, department, classGroup, name, email, matricule, phone, cin, birthDate, gender, grade, speciality, office } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status, department, classGroup, name, email, matricule, phone, cin, birthDate, gender, grade, speciality, office },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Update department detail (including headOfDepartment)
app.put('/api/admin/departments/:id', async (req: any, res: any) => {
  try {
    const { name, code, description, headOfDepartment } = req.body;
    const updatedDept = await Department.findByIdAndUpdate(
      req.params.id,
      { name, code, description, headOfDepartment },
      { new: true }
    ).populate('headOfDepartment');
    res.status(200).json(updatedDept);
  } catch (err) {
    console.error('Error updating department:', err);
    res.status(500).json({ message: 'Error updating department' });
  }
});

// Delete user
app.delete('/api/admin/users/:id', async (req: any, res: any) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Department Management
app.get('/api/admin/departments', async (req: any, res: any) => {
  try {
    const departments = await Department.find().populate('headOfDepartment');
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

app.post('/api/admin/departments', async (req: any, res: any) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: 'Error creating department' });
  }
});

app.delete('/api/admin/departments/:id', async (req: any, res: any) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting department' });
  }
});

// Class Management
app.get('/api/admin/classes', async (req: any, res: any) => {
  try {
    const classes = await ClassGroup.find().populate('department');
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

app.post('/api/admin/classes', async (req: any, res: any) => {
  try {
    const classGroup = new ClassGroup(req.body);
    await classGroup.save();
    res.status(201).json(classGroup);
  } catch (err) {
    res.status(500).json({ message: 'Error creating class' });
  }
});

app.delete('/api/admin/classes/:id', async (req: any, res: any) => {
  try {
    await ClassGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting class' });
  }
});

// Subject Management
app.get('/api/admin/subjects', async (req: any, res: any) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subjects' });
  }
});

app.post('/api/admin/subjects', async (req: any, res: any) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Error creating subject' });
  }
});

app.delete('/api/admin/subjects/:id', async (req: any, res: any) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting subject' });
  }
});

// Module Management
app.get('/api/admin/modules', async (req: any, res: any) => {
  try {
    const modules = await Module.find().populate('department');
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching modules' });
  }
});

app.post('/api/admin/modules', async (req: any, res: any) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: 'Error creating module' });
  }
});

// Grade Management
app.get('/api/admin/grades', async (req: any, res: any) => {
  try {
    const grades = await Grade.find()
      .populate('student')
      .populate('module');
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching grades' });
  }
});

app.post('/api/admin/grades', async (req: any, res: any) => {
  try {
    const grade = new Grade(req.body);
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: 'Error creating grade' });
  }
});

// Announcement Management (Events, Tenders, News)
app.get('/api/admin/announcements', async (req: any, res: any) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

app.post('/api/admin/announcements', async (req: any, res: any) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Error creating announcement' });
  }
});

app.put('/api/admin/announcements/:id', async (req: any, res: any) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Error updating announcement' });
  }
});

app.delete('/api/admin/announcements/:id', async (req: any, res: any) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting announcement' });
  }
});

// Dashboard Stats
app.get('/api/admin/stats', async (req: any, res: any) => {
  try {
    const stats = {
      students: await User.countDocuments({ role: 'student' }),
      teachers: await User.countDocuments({ role: 'staff' }),
      departments: await Department.countDocuments(),
      modules: await Module.countDocuments(),
      userDistribution: {
        students: await User.countDocuments({ role: 'student' }),
        staff: await User.countDocuments({ role: 'staff' }),
        admins: await User.countDocuments({ role: 'admin' }),
        chefs: await User.countDocuments({ role: 'chef' })
      }
    };
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// --- Staff API Endpoints ---

// Get staff modules
app.get('/api/staff/modules', async (req: any, res: any) => {
  try {
    // In a real app, filter by req.user.id
    const modules = await Module.find().populate('department');
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff modules' });
  }
});

// Get staff students (by class)
app.get('/api/staff/students', async (req: any, res: any) => {
  try {
    const { classGroupId } = req.query;
    const filter: any = { role: 'student' };
    if (classGroupId) filter.classGroup = classGroupId;

    const students = await User.find(filter).populate('classGroup');
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff students' });
  }
});

// Get/Update grades
app.get('/api/staff/grades', async (req: any, res: any) => {
  try {
    const { moduleId, classGroupId } = req.query;
    const grades = await Grade.find({ module: moduleId }).populate('student');
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff grades' });
  }
});

app.post('/api/staff/grades/bulk', async (req: any, res: any) => {
  try {
    const { grades } = req.body;
    for (const g of grades) {
      await Grade.findOneAndUpdate(
        { student: g.student, module: g.module, examType: g.examType },
        g,
        { upsert: true, new: true }
      );
    }
    res.status(200).json({ message: 'Grades updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating grades bulk' });
  }
});

// Submit grades for validation (Teacher)
app.post('/api/staff/grades/submit', async (req: any, res: any) => {
  try {
    const { gradeIds } = req.body;
    await Grade.updateMany({ _id: { $in: gradeIds } }, { status: 'submitted' });
    res.status(200).json({ message: 'Grades submitted for validation' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting grades' });
  }
});

// Validate grades (HoD/Chef)
app.post('/api/chef/grades/validate', async (req: any, res: any) => {
  try {
    const { gradeIds, chefId } = req.body;
    await Grade.updateMany(
      { _id: { $in: gradeIds } },
      { status: 'validated', validatedBy: chefId, published: true }
    );
    res.status(200).json({ message: 'Grades validated and published' });
  } catch (err) {
    res.status(500).json({ message: 'Error validating grades' });
  }
});

// Materials
app.get('/api/staff/materials', async (req: any, res: any) => {
  try {
    const materials = await Material.find().populate('module');
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching materials' });
  }
});

app.post('/api/staff/materials', async (req: any, res: any) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: 'Error creating material' });
  }
});

app.post('/api/staff/materials/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    console.log('>>> [Upload] Request Body:', req.body);
    console.log('>>> [Upload] File:', req.file);

    const { module, name, description, fileType, uploadedBy } = req.body;
    const file = req.file;

    if (!file) {
      console.error('>>> [Upload] No file provided in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!module || !uploadedBy) {
      console.error('>>> [Upload] Missing required fields:', { module, uploadedBy });
      return res.status(400).json({ message: 'Module and UploadedBy are required' });
    }

    const material = new Material({
      name,
      description,
      fileType,
      fileUrl: `/uploads/${file.filename}`,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      module,
      uploadedBy
    });

    console.log('>>> [Upload] Saving material to DB...');
    await material.save();
    console.log('>>> [Upload] Success!');
    res.status(201).json(material);
  } catch (err: any) {
    console.error('>>> [Upload] CRITICAL ERROR:', err);
    res.status(500).json({ message: 'Error uploading material: ' + err.message });
  }
});

// Claims
app.get('/api/staff/claims', async (req: any, res: any) => {
  try {
    const claims = await Claim.find().populate('student').populate('module');
    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching claims' });
  }
});

// Announcements (Public)
app.get('/api/announcements', async (req: any, res: any) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1, publishDate: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

app.put('/api/staff/claims/:id', async (req: any, res: any) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Error updating claim' });
  }
});

// Schedule Management (Admin)
app.get('/api/admin/schedules', async (req: any, res: any) => {
  try {
    const schedules = await Schedule.find()
      .populate('module')
      .populate('subject')
      .populate('classGroup')
      .populate('staff');
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedules' });
  }
});

app.post('/api/admin/schedules', async (req: any, res: any) => {
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
    const classConflict = await Schedule.findOne({
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
      const roomConflict = await Schedule.findOne({
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

    const schedule = new Schedule(req.body);
    console.log('>>> Saving schedule:', schedule);
    const savedSchedule = await schedule.save();
    console.log('>>> Schedule saved successfully:', savedSchedule._id);
    res.status(201).json(savedSchedule);
  } catch (err: any) {
    console.error('>>> [CRITICAL] Schedule creation error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val: any) => val.message);
      console.error('>>> Validation failed:', messages);
      return res.status(400).json({ message: 'Erreur de validation: ' + messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating schedule', error: err.message });
  }
});

app.delete('/api/admin/schedules/:id', async (req: any, res: any) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting schedule' });
  }
});

// Schedule (Staff View)
app.get('/api/staff/schedule', async (req: any, res: any) => {
  try {
    const schedule = await Schedule.find({ staff: req.query.staffId })
      .populate('module')
      .populate('classGroup');
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});

// Staff Dashboard Stats
app.get('/api/staff/stats', async (req: any, res: any) => {
  try {
    const staffId = req.query.staffId;
    const stats = {
      totalStudents: await User.countDocuments({ role: 'student' }), // Simplified for now
      totalModules: await Module.countDocuments(),
      totalMaterials: await Material.countDocuments({ uploadedBy: staffId }),
      pendingClaims: await Claim.countDocuments({ staff: staffId, status: 'pending' })
    };
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching staff stats' });
  }
});

// --- Student API Endpoints ---

// Get student schedule
app.get('/api/student/schedule', async (req: any, res: any) => {
  try {
    const { classGroupId } = req.query;
    const schedule = await Schedule.find({ classGroup: classGroupId })
      .populate('module')
      .populate('subject')
      .populate('staff');
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student schedule' });
  }
});

// Get student grades
app.get('/api/student/grades', async (req: any, res: any) => {
  try {
    const { studentId } = req.query;
    const grades = await Grade.find({ student: studentId, published: true })
      .populate('module');
    res.status(200).json(grades);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student grades' });
  }
});

// Get student materials
app.get('/api/student/materials', async (req: any, res: any) => {
  try {
    const { classGroupId } = req.query;
    // Get all modules for the class
    const schedules = await Schedule.find({ classGroup: classGroupId });
    const moduleIds = schedules.map(s => s.module).filter(id => !!id);

    const materials = await Material.find({ module: { $in: moduleIds } })
      .populate('module')
      .populate('uploadedBy', 'name');
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student materials' });
  }
});

// Student Dashboard Stats
app.get('/api/student/stats', async (req: any, res: any) => {
  try {
    const { studentId, classGroupId } = req.query;
    const stats = {
      gradesCount: await Grade.countDocuments({ student: studentId, published: true }),
      schedulesCount: await Schedule.countDocuments({ classGroup: classGroupId }),
      materialsCount: 0 // Will calculate below
    };

    const classSchedules = await Schedule.find({ classGroup: classGroupId });
    const moduleIds = classSchedules.map(s => s.module).filter(id => !!id);
    stats.materialsCount = await Material.countDocuments({ module: { $in: moduleIds } });

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student stats' });
  }
});

// Removed static file serving and Angular rendering for dev server

const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
