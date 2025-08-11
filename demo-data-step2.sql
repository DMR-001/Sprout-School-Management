-- Get the student ID and insert grades
WITH student_info AS (
  SELECT id as student_id FROM students WHERE roll_number = '2024-301'
)
INSERT INTO grades (student_id, subject, grade, score) 
SELECT student_id, 'math', 'A', 92 FROM student_info
UNION ALL
SELECT student_id, 'english', 'A-', 88 FROM student_info
UNION ALL
SELECT student_id, 'science', 'B+', 85 FROM student_info
UNION ALL
SELECT student_id, 'art', 'A+', 95 FROM student_info;

-- Insert attendance records
WITH student_info AS (
  SELECT id as student_id FROM students WHERE roll_number = '2024-301'
)
INSERT INTO attendance (student_id, date, status)
SELECT student_id, '2025-01-01'::date, 'present' FROM student_info
UNION ALL
SELECT student_id, '2025-01-02'::date, 'present' FROM student_info
UNION ALL
SELECT student_id, '2025-01-03'::date, 'absent' FROM student_info
UNION ALL
SELECT student_id, '2025-01-04'::date, 'present' FROM student_info
UNION ALL
SELECT student_id, '2025-01-05'::date, 'present' FROM student_info
UNION ALL
SELECT student_id, '2025-01-08'::date, 'present' FROM student_info
UNION ALL
SELECT student_id, '2025-01-09'::date, 'present' FROM student_info
UNION ALL
SELECT student_id, '2025-01-10'::date, 'present' FROM student_info;

-- Insert student activities
WITH student_info AS (
  SELECT id as student_id FROM students WHERE roll_number = '2024-301'
)
INSERT INTO student_activities (student_id, activity, activity_type, date)
SELECT student_id, 'Art Competition Winner 🎨', 'achievement', '2025-01-05'::date FROM student_info
UNION ALL
SELECT student_id, 'Math Quiz - 95% Score', 'academic', '2025-01-03'::date FROM student_info
UNION ALL
SELECT student_id, 'Library Book Borrowed', 'activity', '2025-01-02'::date FROM student_info
UNION ALL
SELECT student_id, 'Parent-Teacher Meeting', 'meeting', '2024-12-20'::date FROM student_info;

-- Insert demo fee payment
WITH student_info AS (
  SELECT id as student_id FROM students WHERE roll_number = '2024-301'
)
INSERT INTO fee_payments (student_id, student_name, student_email, amount, payment_date, method, status)
SELECT student_id, 'Emma Johnson', 'parent@demo.com', 5000, '2025-01-10'::date, 'Online', 'Completed' FROM student_info;
