USE health;

-- clearing any existing data
DELETE FROM appointments;
DELETE FROM patients;
DELETE FROM users;

-- receptionist credentials to login
INSERT INTO users (username, password_hash, role)
VALUES ('gold', 'smiths', 'receptionist');

-- inserting some patients
INSERT INTO patients (full_name, date_of_birth, email, phone, student_id, notes)
VALUES  ('Alice Johnson', '2000-05-10', 'alice@example.com', '07123456789', '33750000', 'regular check-ups'),
        ('Ben Smith', '1999-07-12', 'ben@example.com', '07123456780', '33750001', 'sport injury follow up'),
        ('Thomas Edison', '2005-11-20', 'thomas@example.com', '07123456781', '33750002', 'mental health support'),
        ('Mohamed Abdul', '2003-01-30', 'Mohamed@example.com', '07123456782', '33750003', 'flu vaccin'),
        ('Kevin Schmidt', '1994-05-10', 'Kevin@example.com', '07123456783', '33750004', 'allergic contamination'),
        ('Chloe Lee', '1978-12-23', 'chloe@example.com', '07123456784', '33750005', 'muscle injury');

-- inserting some appointments
INSERT INTO appointments (patient_name, email, phone, appointment_date, appointment_time, reason, status) 
VALUES ('Alice Johnson','alice@example.com', '07123456789', '2025-12-15', '10:00:00', 'routine check-up', 'Scheduled'),
        ('Ben Smith','ben@example.com', '07123456780', '2025-12-14', '10:30:00', 'injury tests', 'Accomplished'),
        ('Thomas Edison','thomas@example.com', '07123456781', '2025-12-23', '15:00:00', 'psycho sessions', 'Scheduled'),
        ('Mohamed Abdul','mohamed@example.com', '07123456782', '2025-12-17', '16:00:00', 'vaccin', 'Scheduled'),
        ('Kevin Schmidt','kevin@example.com', '07123456783', '2025-12-18', '12:45:00', 'health check', 'Scheduled'),
        ('Chloe Lee','chloe@example.com', '07123456784', '2025-12-16', '10:00:00', 'muscle check', 'Scheduled');

