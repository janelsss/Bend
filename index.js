const express = require('express');
const cors = require('cors'); // Import the cors module
const app = express();

// Use the cors middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const studentData = [];

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// POST API
app.post('/api/add_student', (req, res) => {
    console.log('Request Body:', req.body);

    const sdata = {
        id: studentData.length + 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        course: req.body.course,
        year: req.body.year,
        enrolled: req.body.enrolled === 'true',
    };

    studentData.push(sdata);
    console.log('Student Added:', sdata);

    res.status(200).send({
        statusCode: 200,
        message: 'Student has been added successfully',
        student: sdata,
    });
});

// GET API
app.get('/api/get_student', (req, res) => {
    if (studentData.length > 0) {
        res.status(200).send({
            statusCode: 200,
            students: studentData,
        });
    } else {
        res.status(200).send({
            statusCode: 200,
            students: [],
        });
    }
});

// UPDATE API
app.put('/api/update_student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const studentIndex = studentData.findIndex(student => student.id === id);

    if (studentIndex !== -1) {
        studentData[studentIndex] = {
            ...studentData[studentIndex],
            ...req.body,
            enrolled: req.body.enrolled === 'true',
        };

        res.status(200).send({
            statusCode: 200,
            message: 'Student Information Successfully Updated',
            student: studentData[studentIndex],
        });
    } else {
        res.status(404).send({
            statusCode: 404,
            message: 'Student not found',
        });
    }
});

// DELETE API
app.delete('/api/delete_student/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const studentIndex = studentData.findIndex(student => student.id === id);

    if (studentIndex !== -1) {
        const deletedStudent = studentData.splice(studentIndex, 1);
        res.status(200).send({
            statusCode: 200,
            message: 'Student successfully deleted',
            student: deletedStudent[0],
        });
    } else {
        res.status(404).send({
            statusCode: 404,
            message: 'Student not found',
        });
    }
});