import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

  // Create users storage
  const [createdUsers, setCreatedUsers] = useState(() => {
    const saved = localStorage.getItem('sprout-school-users');
    return saved ? JSON.parse(saved) : {};
  });

  // Teacher class mapping
  const [teacherClassMapping, setTeacherClassMapping] = useState(() => {
    const saved = localStorage.getItem('sprout-school-teacher-mapping');
    return saved ? JSON.parse(saved) : {
      'teacher@demo.com': 'Grade 3A'
    };
  });

  // Fee payments data
  const [feePayments, setFeePayments] = useState(() => {
    const saved = localStorage.getItem('sprout-school-fee-payments');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        studentName: "Emma Johnson",
        studentEmail: "parent@demo.com",
        amount: 5000,
        date: "2025-01-10",
        timestamp: new Date("2025-01-10T10:30:00").getTime(),
        method: "Online",
        status: "Completed"
      },
      {
        id: 2,
        studentName: "Alex Chen", 
        studentEmail: "parent2@demo.com",
        amount: 7500,
        date: "2025-01-10",
        timestamp: new Date("2025-01-10T14:20:00").getTime(),
        method: "Cash",
        status: "Completed"
      }
    ];
  });

  const [studentData, setStudentData] = useState(() => {
    // Load student data from localStorage
    const saved = localStorage.getItem('sprout-school-students');
    return saved ? JSON.parse(saved) : {
      'parent@demo.com': {
        name: "Emma Johnson",
        class: "Grade 3A",
        rollNumber: "2024-301",
        photo: "👧",
        attendance: { present: 85, total: 90, percentage: 94.4 },
        academics: {
          math: { grade: "A", score: 92 },
          english: { grade: "A-", score: 88 },
          science: { grade: "B+", score: 85 },
          art: { grade: "A+", score: 95 }
        },
        fees: { totalAmount: 15000, paidAmount: 10000, pendingAmount: 5000, dueDate: "2025-01-15" },
        recentActivities: [
          { date: "2025-01-05", activity: "Art Competition Winner 🎨", type: "achievement" },
          { date: "2025-01-03", activity: "Math Quiz - 95% Score", type: "academic" },
          { date: "2025-01-02", activity: "Library Book Borrowed", type: "activity" },
          { date: "2024-12-20", activity: "Parent-Teacher Meeting", type: "meeting" }
        ]
      }
    };
  });

  // Login function
  async function login(email, password) {
    try {
      // Check for demo accounts first
      const demoAccounts = {
        'parent@demo.com': { password: 'demo123', role: 'parent', name: 'Sarah Johnson' },
        'admin@demo.com': { password: 'admin123', role: 'admin', name: 'School Administrator' },
        'teacher@demo.com': { password: 'teacher123', role: 'teacher', name: 'Ms. Smith', assignedClass: 'Grade 3A' }
      };

      // Merge demo accounts with created users
      const allUsers = { ...demoAccounts, ...createdUsers };

      if (allUsers[email] && allUsers[email].password === password) {
        // Simulate successful login for demo/created accounts
        const user = { uid: `demo-${Date.now()}`, email };
        setCurrentUser(user);
        setUserRole(allUsers[email].role);
        setUserData({
          name: allUsers[email].name,
          email: email,
          role: allUsers[email].role,
          phone: allUsers[email].phone || '',
          address: allUsers[email].address || ''
        });
        setLoading(false); // Ensure loading is set to false for demo users
        return { success: true, role: allUsers[email].role };
      }

      // Try Firebase authentication for real accounts
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        setUserData(userData);
        return { success: true, role: userData.role };
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  // Register function
  async function register(email, password, additionalData) {
    try {
      // For demo purposes, store in localStorage
      const newUser = {
        password,
        role: additionalData.role,
        name: additionalData.name,
        phone: additionalData.phone || '',
        address: additionalData.address || '',
        studentData: additionalData.studentData || null
      };

      const updatedUsers = { ...createdUsers, [email]: newUser };
      setCreatedUsers(updatedUsers);
      localStorage.setItem('sprout-school-users', JSON.stringify(updatedUsers));

      // If it's a parent with student data, add to student data
      if (additionalData.role === 'parent' && additionalData.studentData) {
        const updatedStudentData = { ...studentData, [email]: additionalData.studentData };
        setStudentData(updatedStudentData);
        localStorage.setItem('sprout-school-students', JSON.stringify(updatedStudentData));
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
    signOut(auth);
  }

  // Teacher management functions
  function assignTeacherToClass(teacherEmail, className) {
    const updatedMapping = { ...teacherClassMapping, [teacherEmail]: className };
    setTeacherClassMapping(updatedMapping);
    localStorage.setItem('sprout-school-teacher-mapping', JSON.stringify(updatedMapping));
  }

  function getTeacherClass(teacherEmail) {
    return teacherClassMapping[teacherEmail] || null;
  }

  function getStudentsByClass(className) {
    return Object.values(studentData).filter(student => student.class === className);
  }

  function updateStudentData(studentEmail, updates) {
    const updatedStudentData = {
      ...studentData,
      [studentEmail]: { ...studentData[studentEmail], ...updates }
    };
    setStudentData(updatedStudentData);
    localStorage.setItem('sprout-school-students', JSON.stringify(updatedStudentData));
  }

  // Fee management functions
  function addFeePayment(paymentData) {
    const newPayment = {
      id: Date.now(),
      timestamp: Date.now(),
      status: 'Completed',
      ...paymentData
    };
    const updatedPayments = [...feePayments, newPayment];
    setFeePayments(updatedPayments);
    localStorage.setItem('sprout-school-fee-payments', JSON.stringify(updatedPayments));
  }

  function getFeePaymentsByDate(date) {
    return feePayments.filter(payment => payment.date === date);
  }

  function getFeePaymentsByDateRange(startDate, endDate) {
    return feePayments.filter(payment => 
      payment.date >= startDate && payment.date <= endDate
    );
  }

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Skip Firebase auth state changes if we have a demo user
      if (currentUser && currentUser.uid && currentUser.uid.startsWith('demo-')) {
        setLoading(false);
        return;
      }

      if (user) {
        setCurrentUser(user);
        // Get user role and data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            setUserData(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Only clear state if we don't have a demo user
        if (!currentUser || !currentUser.uid || !currentUser.uid.startsWith('demo-')) {
          setCurrentUser(null);
          setUserRole(null);
          setUserData(null);
        }
      }
      setLoading(false);
    });

    // Also set loading to false on initial mount if no Firebase user
    const timer = setTimeout(() => {
      if (!currentUser) {
        setLoading(false);
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [currentUser]);

  const value = {
    currentUser,
    userRole,
    userData,
    login,
    logout,
    register,
    loading,
    createdUsers,
    studentData,
    teacherClassMapping,
    feePayments,
    assignTeacherToClass,
    getTeacherClass,
    getStudentsByClass,
    updateStudentData,
    addFeePayment,
    getFeePaymentsByDate,
    getFeePaymentsByDateRange
  };

  console.log('=== AuthContext Debug ===');
  console.log('userData:', userData);
  console.log('studentData:', studentData);
  console.log('loading:', loading);
  console.log('=== End Debug ===');

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
