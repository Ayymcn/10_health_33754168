const express = require('express');
const router = express.Router();

// GET login form
router.get('/login', (req, res) => {
    res.render('login', { error: null});
});

// POST login form
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    const pool = req.app.locals.pool;
    const bcrypt = req.app.locals.bcrypt;

    // Basic sanitising: trim and strip dangerous chars
    if (typeof username !== 'string') username = '';
    if (typeof password !== 'string') password = '';

    username = username.trim().replace(/[<>$;]/g, '');
    password = password.trim();

    if (!username || !password) {
        return res.render('login',{ error: 'Please enter username and password.'});
    }

    pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, results) => {
            if (err) {
                console.error(err);
                //log failed
                pool.query(
                    'INSERT INTO login_audit (username, success) VALUES (?, ?)',
                    [username, 0]
                )
                return res.render('login', { error: 'There was a problem logging in.'});
            }

            if (results.length == 0) {
                pool.query(
                    'INSERT INTO login_audit (username, success) VALUES (?, ?)',
                    [username, 0]
                )
                return res.render('login', { error: 'Invalid username or password.'});
            }

            const user = results[0];

            const match = (password == user.password_hash);
            if (!match) {
                pool.query(
                    'INSERT INTO login_audit (username, success) VALUES (?, ?)',
                    [username, 0]
                )
                return res.render('login', { error: 'Invalid username or password.'});
            }

            // log successful
            pool.query(
                'INSERT INTO login_audit (username, success) VALUES (?, ?)',
                [username, 0]
            )

            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;

            res.redirect('/patients');
        }
    );
});

// GET logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;