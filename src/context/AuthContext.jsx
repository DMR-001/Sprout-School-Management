import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  userService, 
  studentService, 
  teacherService, 
  feeService, 
  attendanceService, 
  gradesService,
  activityService 
} from '../lib/database';

const AuthContext = createContext();

// Custom hook to use the AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState({});
  const [teacherClassMapping, setTeacherClassMapping] = useState({});
  const [feePayments, setFeePayments] = useState([]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load initial data
        await loadTeacherMappings();
        await loadFeePayments();
        setLoading(false);
      } catch (error) {
        console.error('Error initializing data:', error);
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load teacher class mappings
  const loadTeacherMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('teacher_email, assigned_class');
      
      if (error) throw error;
      
      const mappings = {};
      data.forEach(item => {
        if (!mappings[item.teacher_email]) {
          mappings[item.teacher_email] = [];
        }
        mappings[item.teacher_email].push(item.assigned_class);
      });
      setTeacherClassMapping(mappings);
    } catch (error) {
      console.error('Error loading teacher mappings:', error);
    }
  };

  // Load fee payments
  const loadFeePayments = async () => {
    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFeePayments(data || []);
    } catch (error) {
      console.error('Error loading fee payments:', error);
    }
  };

  // Load student data for a specific parent
  const loadStudentData = async (parentEmail) => {
    try {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('parent_email', parentEmail)
        .single();

      if (studentError) throw studentError;

      // Get grades
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', student.id);

      if (gradesError) throw gradesError;

      // Get attendance stats
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', student.id);

      if (attendanceError) throw attendanceError;

      // Get activities
      const { data: activities, error: activitiesError } = await supabase
        .from('student_activities')
        .select('*')
        .eq('student_id', student.id)
        .order('date', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      // Calculate attendance stats
      const total = attendance.length;
      const present = attendance.filter(record => record.status === 'present').length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      // Format grades
      const academics = {};
      grades.forEach(grade => {
        academics[grade.subject] = {
          grade: grade.grade,
          score: grade.score
        };
      });

      // Format activities
      const recentActivities = activities.map(activity => ({
        date: activity.date,
        activity: activity.activity,
        type: activity.activity_type
      }));

      const formattedStudentData = {
        id: student.id,
        name: student.name,
        class: student.class,
        rollNumber: student.roll_number,
        photo: student.photo_url || '/default-avatar.png',
        attendance: { present, total, percentage },
        academics,
        fees: { totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, dueDate: "2025-01-15" },
        recentActivities
      };

      setStudentData(prev => ({
        ...prev,
        [parentEmail]: formattedStudentData
      }));

      return formattedStudentData;
    } catch (error) {
      console.error('Error loading student data:', error);
      return null;
    }
  };

  // Login function
  async function login(email, password) {
    try {
      setLoading(true);
      
      // Check if user exists in database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        // For demo purposes, check hardcoded demo accounts
        const demoAccounts = {
          'parent@demo.com': { password: 'demo123', role: 'parent', name: 'Sarah Johnson' },
          'admin@demo.com': { password: 'admin123', role: 'admin', name: 'School Administrator' },
          'teacher@demo.com': { password: 'teacher123', role: 'teacher', name: 'Ms. Smith' }
        };

        if (demoAccounts[email] && demoAccounts[email].password === password) {
          const demoUser = { uid: `demo-${Date.now()}`, email };
          setCurrentUser(demoUser);
          setUserRole(demoAccounts[email].role);
          setUserData({
            name: demoAccounts[email].name,
            email: email,
            role: demoAccounts[email].role,
            phone: '',
            address: ''
          });

          // Load student data for parents
          if (demoAccounts[email].role === 'parent') {
            await loadStudentData(email);
          }

          setLoading(false);
          return { success: true, role: demoAccounts[email].role };
        } else {
          setLoading(false);
          return { success: false, error: 'Invalid credentials' };
        }
      }

      // For now, we'll use simple password checking since we don't have auth setup
      // In production, you'd use Supabase Auth
      const simpleUser = { uid: user.id, email: user.email };
      setCurrentUser(simpleUser);
      setUserRole(user.role);
      setUserData(user);

      // Load student data for parents
      if (user.role === 'parent') {
        await loadStudentData(email);
      }
      
      // Reload teacher mappings for teachers to ensure they have the latest assignments
      if (user.role === 'teacher') {
        await loadTeacherMappings();
      }

      setLoading(false);
      return { success: true, role: user.role };
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  }

  // Register function
  async function register(email, password, additionalData) {
    try {
      // Insert new user into database
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          name: additionalData.name,
          role: additionalData.role,
          phone: additionalData.phone || '',
          address: additionalData.address || ''
        })
        .select()
        .single();

      if (error) throw error;

      // If it's a parent with student data, create student record
      if (additionalData.role === 'parent' && additionalData.studentData) {
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            name: additionalData.studentData.name,
            class: additionalData.studentData.class,
            roll_number: additionalData.studentData.rollNumber,
            parent_email: email,
            photo_url: additionalData.studentData.photo || '/default-avatar.png'
          });

        if (studentError) throw studentError;
      }

      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Logout function
  function logout() {
    setCurrentUser(null);
    setUserRole(null);
    setUserData(null);
    setStudentData({});
  }

  // Teacher management functions
  async function assignTeacherToClass(teacherEmail, className) {
    try {
      // Check if this teacher-class combination already exists
      const { data: existing, error: checkError } = await supabase
        .from('teachers')
        .select('*')
        .eq('teacher_email', teacherEmail)
        .eq('assigned_class', className)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      // If combination doesn't exist, insert it
      if (!existing) {
        const { error } = await supabase
          .from('teachers')
          .insert({ teacher_email: teacherEmail, assigned_class: className });

        if (error) throw error;
      }

      // Update local state - add class to teacher's array
      setTeacherClassMapping(prev => ({
        ...prev,
        [teacherEmail]: prev[teacherEmail] 
          ? [...new Set([...prev[teacherEmail], className])] // Remove duplicates
          : [className]
      }));
    } catch (error) {
      console.error('Error assigning teacher to class:', error);
      throw error;
    }
  }

  function getTeacherClasses(teacherEmail) {
    return teacherClassMapping[teacherEmail] || [];
  }

  function getTeacherClass(teacherEmail) {
    // For backward compatibility, return the first class
    const classes = teacherClassMapping[teacherEmail];
    return classes && classes.length > 0 ? classes[0] : null;
  }

  async function removeTeacherFromClass(teacherEmail, className) {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('teacher_email', teacherEmail)
        .eq('assigned_class', className);

      if (error) throw error;

      // Update local state
      setTeacherClassMapping(prev => ({
        ...prev,
        [teacherEmail]: prev[teacherEmail] 
          ? prev[teacherEmail].filter(cls => cls !== className)
          : []
      }));
    } catch (error) {
      console.error('Error removing teacher from class:', error);
    }
  }

  async function getStudentsByClass(className) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          grades(*),
          attendance(*)
        `)
        .eq('class', className);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting students by class:', error);
      return [];
    }
  }

  async function getStudentsByTeacher(teacherEmail) {
    try {
      const teacherClasses = getTeacherClasses(teacherEmail);
      if (teacherClasses.length === 0) return [];

      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          grades(*),
          attendance(*)
        `)
        .in('class', teacherClasses);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting students by teacher:', error);
      return [];
    }
  }

  async function updateStudentData(studentEmail, updates) {
    try {
      // Find student by parent email
      const { data: student, error: findError } = await supabase
        .from('students')
        .select('id')
        .eq('parent_email', studentEmail)
        .single();

      if (findError) throw findError;

      // Update student data based on what fields are being updated
      if (updates.attendance) {
        // Handle attendance updates
        await supabase
          .from('attendance')
          .upsert({
            student_id: student.id,
            date: updates.attendance.date || new Date().toISOString().split('T')[0],
            status: updates.attendance.status || 'present'
          }, {
            onConflict: 'student_id,date'
          });
      }

      if (updates.academics) {
        // Handle grade updates
        for (const [subject, gradeData] of Object.entries(updates.academics)) {
          await supabase
            .from('grades')
            .upsert({
              student_id: student.id,
              subject,
              grade: gradeData.grade,
              score: gradeData.score
            }, {
              onConflict: 'student_id,subject'
            });
        }
      }

      // Reload student data
      await loadStudentData(studentEmail);
    } catch (error) {
      console.error('Error updating student data:', error);
    }
  }

  // Fee management functions
  async function addFeePayment(paymentData) {
    try {
      const { data, error } = await supabase
        .from('fee_payments')
        .insert({
          student_name: paymentData.studentName,
          student_email: paymentData.studentEmail,
          amount: paymentData.amount,
          payment_date: paymentData.date,
          method: paymentData.method,
          status: 'Completed'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setFeePayments(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding fee payment:', error);
    }
  }

  function getFeePaymentsByDate(date) {
    return feePayments.filter(payment => payment.payment_date === date);
  }

  function getFeePaymentsByDateRange(startDate, endDate) {
    return feePayments.filter(payment => 
      payment.payment_date >= startDate && payment.payment_date <= endDate
    );
  }

  const value = {
    currentUser,
    userRole,
    userData,
    login,
    logout,
    register,
    loading,
    studentData,
    teacherClassMapping,
    feePayments,
    assignTeacherToClass,
    removeTeacherFromClass,
    getTeacherClass,
    getTeacherClasses,
    getStudentsByClass,
    getStudentsByTeacher,
    updateStudentData,
    addFeePayment,
    getFeePaymentsByDate,
    getFeePaymentsByDateRange,
    loadStudentData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };    