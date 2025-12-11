const express = require('express');
const router = express.Router();

// home page
router.get('/', (req, res) => {
    res.render('home');
});

// about page
router.get('/about', (req, res) => {
    res.render('about');
});

// contact page
router.get('/contact', (req, res) => {
    res.render('contact', { error: null, success: null })
})

// post contact message
router.post('/contact', (req, res) => {
    const pool = req.app.locals.pool;
    let { name, email, message } = req.body;

    //basic sanitising
    if (typeof name !== 'string') name = '';
    if (typeof email !== 'string') email = '';
    if (typeof message !== 'string') message = '';

    name = name.trim().replace(/[<>$;]/g, '');
    email = email.trim().replace(/[<>$;]/g, '');
    message = message.trim();

    if (!name || !email || !message) {
    return res.render('contact', {
      error: 'Please fill in all fields.',
      success: null
    });
  }

  pool.query(
    'INSERT INTO contact_messages (name, email, message) VALUES (?, ?,?)',
    [name, email, message],
    (err) => {
        if (err) {
            console.error(err);
            return res.render('contact', {
                error: 'There was a problem sending your message.',
                success: null
            })
        }

        // successfully filled the form
        res.render('contact', {
            error:null,
            success: 'Thank you for your message. We will get back to you soon!'
        })
    }
  )
})

// GET patient registration form
router.get('/patients/register', (req, res) => {
    res.render('patients_register', { error: null, success: null});
});

// POST handle registration form submit
router.post('/patients/register', (req, res) => {
    const {full_name, date_of_birth, email, phone, student_id, notes } = req.body;

    // basic validation
    if (!full_name || !date_of_birth || !email || !phone) {
        return res.render('patients_register', {
            error: 'please fill in all required fields.',
            success: null
        });
    }

    const pool = req.app.locals.pool;

    pool.query(
        'INSERT INTO patients (full_name, date_of_birth, email, phone, student_id, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [full_name, date_of_birth, email, phone, student_id, notes || null],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.render('patients_register', {
                    error: 'there was a problem registering the patient.',
                    success: null
                });
            }

            // when successful:
            res.render('patients_register', {
                error: null,
                success: 'You have been successfully registered with goldcare clinic.'
            });
        }
    );
});

// GET appointment form
router.get('/appointments/book', (req, res) => {
    res.render('appointments_book', { error: null, success: null});
});

// POST handling appointment
router.post('/appointments/book', (req, res) => {
    const {patient_name, email, phone, appointment_date, reason } = req.body;
    let { appointment_time } = req.body;

    if (!patient_name || !email || !phone || !appointment_date || !appointment_time) {
        return res.render('appointments_book', {
            error: 'Please fill in all required fields.',
            success: null
        });
    }

    // ensuring time is in 00:00:00 (fixing sql error)
if (appointment_time.length === 5) {
    appointment_time = appointment_time + ':00';
    // 12:00 -> 12:00:00
}

    const pool = req.app.locals.pool;

    pool.query(
        'INSERT INTO appointments (patient_name, email, phone, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [patient_name, email, phone, appointment_date, appointment_time, reason || null, 'Scheduled'],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.render('appointments_book', {
                error: 'There was a problem booking the appointment.',
                success: null
            });
            }

        res.render('appointments_book', {
            error: null,
            success: 'Your appointment has been booked with Goldcare Clinic.'
        });
        }
    );
});

module.exports = router;