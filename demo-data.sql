-- Insert demo users
INSERT INTO users (email, name, role, phone, address) VALUES
('parent@demo.com', 'Sarah Johnson', 'parent', '+1-555-0101', '123 Oak Street, Springfield'),
('admin@demo.com', 'School Administrator', 'admin', '+1-555-0102', '456 School Avenue, Springfield'),
('teacher@demo.com', 'Ms. Smith', 'teacher', '+1-555-0103', '789 Teacher Lane, Springfield');

-- Insert demo student
INSERT INTO students (name, class, roll_number, parent_email, photo_url) VALUES
('Emma Johnson', 'Grade 3A', '2024-301', 'parent@demo.com', '👧');

-- Get the student ID for further insertions (we'll need to run this separately)
-- INSERT INTO teachers (teacher_email, assigned_class) VALUES
-- ('teacher@demo.com', 'Grade 3A');

-- Insert demo grades for Emma Johnson
-- We'll need to get the student_id first, then insert grades
-- INSERT INTO grades (student_id, subject, grade, score) VALUES
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'math', 'A', 92),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'english', 'A-', 88),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'science', 'B+', 85),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'art', 'A+', 95);

-- Insert demo attendance records
-- INSERT INTO attendance (student_id, date, status) VALUES
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), '2025-01-01', 'present'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), '2025-01-02', 'present'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), '2025-01-03', 'absent'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), '2025-01-04', 'present'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), '2025-01-05', 'present');

-- Insert demo activities
-- INSERT INTO student_activities (student_id, activity, activity_type, date) VALUES
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'Art Competition Winner 🎨', 'achievement', '2025-01-05'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'Math Quiz - 95% Score', 'academic', '2025-01-03'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'Library Book Borrowed', 'activity', '2025-01-02'),
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'Parent-Teacher Meeting', 'meeting', '2024-12-20');

-- Insert demo fee payments
-- INSERT INTO fee_payments (student_id, student_name, student_email, amount, payment_date, method, status) VALUES
-- ((SELECT id FROM students WHERE roll_number = '2024-301'), 'Emma Johnson', 'parent@demo.com', 5000, '2025-01-10', 'Online', 'Completed');
