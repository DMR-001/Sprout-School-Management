import { supabase, TABLES } from './supabase.js'

// User Management
export const userService = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(email, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('email', email)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Student Management
export const studentService = {
  async createStudent(studentData) {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .insert(studentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getStudentByParentEmail(parentEmail) {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select(`
        *,
        attendance(*),
        grades(*),
        student_activities(*),
        fee_payments(*)
      `)
      .eq('parent_email', parentEmail)
      .single()
    
    if (error) throw error
    return data
  },

  async getStudentsByClass(className) {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select(`
        *,
        attendance(*),
        grades(*)
      `)
      .eq('class', className)
    
    if (error) throw error
    return data
  },

  async updateStudent(studentId, updates) {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .update(updates)
      .eq('id', studentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Teacher Management
export const teacherService = {
  async assignTeacherToClass(teacherEmail, className) {
    const { data, error } = await supabase
      .from(TABLES.TEACHERS)
      .upsert({ teacher_email: teacherEmail, assigned_class: className })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getTeacherClass(teacherEmail) {
    const { data, error } = await supabase
      .from(TABLES.TEACHERS)
      .select('assigned_class')
      .eq('teacher_email', teacherEmail)
      .single()
    
    if (error) throw error
    return data?.assigned_class
  }
}

// Attendance Management
export const attendanceService = {
  async markAttendance(studentId, date, status) {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCE)
      .upsert({ student_id: studentId, date, status })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getStudentAttendance(studentId) {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getAttendanceStats(studentId) {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('status')
      .eq('student_id', studentId)
    
    if (error) throw error
    
    const total = data.length
    const present = data.filter(record => record.status === 'present').length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    
    return { present, total, percentage }
  }
}

// Grades Management
export const gradesService = {
  async updateGrade(studentId, subject, grade, score) {
    const { data, error } = await supabase
      .from(TABLES.GRADES)
      .upsert({ student_id: studentId, subject, grade, score })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getStudentGrades(studentId) {
    const { data, error } = await supabase
      .from(TABLES.GRADES)
      .select('*')
      .eq('student_id', studentId)
    
    if (error) throw error
    return data
  }
}

// Fee Management
export const feeService = {
  async addFeePayment(paymentData) {
    const { data, error } = await supabase
      .from(TABLES.FEE_PAYMENTS)
      .insert(paymentData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getFeePaymentsByDate(date) {
    const { data, error } = await supabase
      .from(TABLES.FEE_PAYMENTS)
      .select('*')
      .eq('payment_date', date)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getFeePaymentsByDateRange(startDate, endDate) {
    const { data, error } = await supabase
      .from(TABLES.FEE_PAYMENTS)
      .select('*')
      .gte('payment_date', startDate)
      .lte('payment_date', endDate)
      .order('payment_date', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Student Activities
export const activityService = {
  async addActivity(studentId, activity, activityType, date) {
    const { data, error } = await supabase
      .from('student_activities')
      .insert({ student_id: studentId, activity, activity_type: activityType, date })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getStudentActivities(studentId) {
    const { data, error } = await supabase
      .from('student_activities')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(10)
    
    if (error) throw error
    return data
  }
}
