-- First, insert basic data
INSERT INTO users (email, name, role, phone, address) VALUES
('parent@demo.com', 'Sarah Johnson', 'parent', '+1-555-0101', '123 Oak Street, Springfield'),
('admin@demo.com', 'School Administrator', 'admin', '+1-555-0102', '456 School Avenue, Springfield'),
('teacher@demo.com', 'Ms. Smith', 'teacher', '+1-555-0103', '789 Teacher Lane, Springfield');

INSERT INTO students (name, class, roll_number, parent_email, photo_url) VALUES
('Emma Johnson', 'Grade 3A', '2024-301', 'parent@demo.com', '👧');

INSERT INTO teachers (teacher_email, assigned_class) VALUES
('teacher@demo.com', 'Grade 3A');
