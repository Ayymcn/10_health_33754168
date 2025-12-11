const express = require('express');
const router = express.Router();

// middleware to require login
function requireLogin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.redirect(basePath + '/login');
    }
    next();
}

// GET patients list
router.get('/patients', requireLogin, (req, res) => {
    const pool = req.app.locals.pool;

    pool.query(
        'SELECT id, full_name, date_of_birth, email, phone, student_id, notes FROM patients ORDER BY full_name',
        (err, results) => {
            if (err) {
                console.error(err);
                return res.render('patients_list', { error: 'Could not load patients.', patients: [] });
            }

            res.render('patients_list', { error: null, patients: results });
        }
    );
});

// POST delete a patient by id (receptionist only)
router.post('/patients/:id/delete', requireLogin, (req, res) => {
    const pool = req.app.locals.pool;
    const  patientId = req.params.id;

    pool.query(
        'DELETE FROM patients WHERE id = ?',
        [patientId],
        (err, results) => {
            if (err) {
                console.error(err);
                // adding an errror message later
            }
            res.redirect(basePath + '/patients');
        }
    );
});

// GET searching list (receptionist only)
router.get('/appointments', requireLogin, (req, res) => {
    const pool = req.app.locals.pool;

    const { search_name, search_date } = req.query;

    let sql = `
    SELECT id, patient_name, email, phone, appointment_date, appointment_time, reason, status
    FROM appointments
    WHERE 1 = 1`;
    const params = [];

    if (search_name) {
        sql += ' AND patient_name LIKE ?';
        params.push('%' + search_name + '%');
    }

    if (search_date) {
        sql += ' AND appointment_date = ?';
        params.push(search_date);
    }

    sql += ' ORDER BY appointment_date, appointment_time';

    pool.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            return res.render('appointment_list', {
                error: 'Could not load appointments.',
                appointments: [],
                search_name,
                search_date
            });
        }

        res.render('appointments_list', {
            error: null,
            appointments: results,
            search_name,
            search_date
        })
    })
})

// GET audit log (receptionist only)
router.get('/audit-log', requireLogin, (req, res) => {
    const pool = req.app.locals.pool;

    pool.query(
        'SELECT id, username, success, attempt_time FROM login_audit ORDER BY attempt_time',
        (err, results) => {
            if (err) {
            console.error(err);
            return res.render('audit_log', {
                error: 'Could not load audit log.',
                entries: []})
        }

        res.render('audit_log', {
            error: null,
            entries: results
        })
        }
    )
})

// GET ting contact messages inbox (receptionist only)
router.get('/inbox', requireLogin, (req, res) => {
    const pool = req.app.locals.pool;

    pool.query(
        'SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error(err);
                return res.render('inbox', {
                    error: 'Could not load messages.',
                    messages: []
                })
            }

            res.render('inbox', {
                error: null,
                messages:results
            })
        }
    )
})

module.exports = router;