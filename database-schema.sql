-- Users table (for authentication and basic user info)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('parent', 'teacher', 'admin')),
  phone VARCHAR,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  class VARCHAR NOT NULL,
  roll_number VARCHAR UNIQUE NOT NULL,
  parent_email VARCHAR REFERENCES users(email),
  photo_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Teachers table (for teacher-class mapping)
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_email VARCHAR REFERENCES users(email),
  assigned_class VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fee payments table
CREATE TABLE fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  student_name VARCHAR NOT NULL,
  student_email VARCHAR NOT NULL,
  amount DECIMAL NOT NULL,
  payment_date DATE NOT NULL,
  method VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  date DATE NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Grades table
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  subject VARCHAR NOT NULL,
  grade VARCHAR NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, subject)
);

-- Student activities table
CREATE TABLE student_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  activity VARCHAR NOT NULL,
  activity_type VARCHAR NOT NULL CHECK (activity_type IN ('achievement', 'academic', 'activity', 'meeting')),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_students_parent_email ON students(parent_email);
CREATE INDEX idx_teachers_email ON teachers(teacher_email);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_activities_student ON student_activities(student_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Policies (you can customize these based on your security needs)
-- For now, allowing all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON students FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON teachers FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON fee_payments FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON grades FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON student_activities FOR ALL USING (true);
