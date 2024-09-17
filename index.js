const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Use the cors middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Student model
const studentSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    course: String,
    year: Number,
    enrolled: Boolean,
});

const Student = mongoose.model('Student', studentSchema);

// Redirect from root to /api/v1/student
app.get('/', (req, res) => {
    res.redirect('/api/v1/student');
});

// POST API
app.post('/api/add_student', async(req, res) => {
    console.log('Request Body:', req.body);

    try {
        const student = new Student({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            course: req.body.course,
            year: req.body.year,
            enrolled: req.body.enrolled === 'true',
        });

        await student.save();

        console.log('Student Added:', student);

        res.status(200).send({
            statusCode: 200,
            message: 'Student has been added successfully',
            student: student,
        });
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send({
            statusCode: 500,
            message: 'Error adding student',
        });
    }
});

// GET API
app.get('/api/get_student', async(req, res) => {
    try {
        const students = await Student.find();
        res.status(200).send({
            statusCode: 200,
            students: students,
        });
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).send({
            statusCode: 500,
            message: 'Error fetching students',
        });
    }
});

// UPDATE API
app.put('/api/update_student/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const student = await Student.findByIdAndUpdate(id, {
            ...req.body,
            enrolled: req.body.enrolled === 'true',
        }, { new: true });

        if (student) {
            res.status(200).send({
                statusCode: 200,
                message: 'Student Information Successfully Updated',
                student: student,
            });
        } else {
            res.status(404).send({
                statusCode: 404,
                message: 'Student not found',
            });
        }
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).send({
            statusCode: 500,
            message: 'Error updating student',
        });
    }
});

// DELETE API
app.delete('/api/delete_student/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const student = await Student.findByIdAndDelete(id);
        if (student) {
            res.status(200).send({
                statusCode: 200,
                message: 'Student successfully deleted',
                student: student,
            });
        } else {
            res.status(404).send({
                statusCode: 404,
                message: 'Student not found',
            });
        }
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).send({
            statusCode: 500,
            message: 'Error deleting student',
        });
    }
});
app.get('/', (req, res) => {
    res.redirect('/api/get_student');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});