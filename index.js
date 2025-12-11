const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');

require('dotenv').config();

const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'goldcare_secret',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
        res.locals.currentUser = {
        id: req.session.userId,
        username: req.session.username,
        role: req.session.role
    }
    next()
})

app.locals.appName = 'GoldCare Clinic';
  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.HEALTH_HOST,
  user: process.env.HEALTH_USER,
  password: process.env.HEALTH_PASSWORD,
  database: process.env.HEALTH_DATABASE
});

// making pool and bcrypt available to all routes
app.locals.pool = pool;
app.locals.bcrypt = bcrypt;

// using routes
app.use('/', publicRoutes);
app.use('/', authRoutes);
app.use('/', receptionistRoutes);

// starting a server
const port = 8000;
app.listen(port, () => {
    console.log(`GoldCare Clinic app listening on http://localhost:${port}`);
});