import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateStudent = (student) => {
    const errors = [];

    if (!student.name || student.name.trim() === '') {
        errors.push('Name is required');
    }

    if (!student.email || student.email.trim() === '') {
        errors.push('Email is required');
    } else if (!emailRegex.test(student.email)) {
        errors.push('Email format is invalid');
    }

    if (!student.course || student.course.trim() === '') {
        errors.push('Course is required');
    }

    return errors;
};

app.get('/students', (req, res) => {
    try {
        const students = db.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

app.post('/students', (req, res) => {
    const { name, email, course, experiencePrealable } = req.body;


    const errors = validateStudent({ name, email, course });

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    if (db.emailExists(email)) {
        return res.status(400).json({
            error: 'Validation failed',
            details: ['A student with this email already exists']
        });
    }

    const newStudent = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        course: course.trim(),
        experiencePrealable: experiencePrealable || null,
        createdAt: new Date().toISOString()
    };

    try {
        const createdStudent = db.addStudent(newStudent);
        res.status(201).json(createdStudent);
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: 'Failed to add student' });
    }
});

app.delete('/students/:email', (req, res) => {
    const { email } = req.params;

    try {
        const deletedStudent = db.deleteStudentByEmail(email);

        if (!deletedStudent) {
            return res.status(404).json({
                error: 'Student not found',
                details: [`No student found with email: ${email}`]
            });
        }

        res.status(200).json({
            message: 'Student deleted successfully',
            student: deletedStudent
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        details: [err.message]
    });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`📚 Students API ready`);
});
