const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const AuthRoutes = require('./routes/AuthRoutes');
const path = require('path');
dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // to enable cookies
}))

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads/profiles", express.static("uploads/profiles"))

app.use('/api/auth', AuthRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});

mongoose.connect(databaseURL)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err.message)) 