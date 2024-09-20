const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connectDB = (url) => {
    if (!url) {
        console.error('Invalid URL');
    }
    return url
        .replace('<db_username>', process.env.MONGO_USERNAME)
        .replace('<db_password>', process.env.MONGO_PASSWORD);
};

const connectToDatabase = async() => {
    const dbURL = connectDB(process.env.MONGO_URL);

    try {
        await mongoose.connect(dbURL); // Removed .then() and used await

        console.log('Database connection is successful');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
};



const studentSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    course: String,
    year: Number,
    enrolled: Boolean,
});

const Student = mongoose.model('Student', studentSchema);


app.get('/', (req, res) => {
    res.redirect('/api/get_student');
});


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

const start = async() => {
    try {
        await connectToDatabase();
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};
start();