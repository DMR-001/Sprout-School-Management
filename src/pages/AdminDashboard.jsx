import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import sproutLogo from '../assets/images/sprout-logo.png';

const AdminDashboard = () => {
  const { 
    userData, 
    logout, 
    register, 
    assignTeacherToClass,
    removeTeacherFromClass,
    teacherClassMapping, 
    feePayments,
    getFeePaymentsByDate,
    getFeePaymentsByDateRange,
    addFeePayment
  } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teacherAssignment, setTeacherAssignment] = useState({ teacherEmail: '', className: '' });
  const [feeFilter, setFeeFilter] = useState({ date: new Date().toISOString().split('T')[0] });
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: 'Nursery',
    parentName: '',
    parentEmail: '',
    parentPassword: ''
  });
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: '',
    assignedClasses: []
  });

  // Load students data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load students from Supabase
      try {
        const { data: supabaseStudents, error: studentsError } = await supabase
          .from('students')
          .select(`
            *,
            users!students_parent_email_fkey(name, phone)
          `)
          .order('created_at', { ascending: false });

        if (studentsError) throw studentsError;
        
        // Transform student data to match expected format
        const formattedStudents = supabaseStudents?.map(student => ({
          id: student.id,
          name: student.name,
          class: student.class,
          rollNumber: student.roll_number,
          attendance: { present: 85, total: 90, percentage: 94.4 }, // Mock data for now
          fees: { total: 15000, paid: 10000, pending: 5000 }, // Mock data for now
          parent: { 
            name: student.users?.name || 'Unknown',
            email: student.parent_email,
            phone: student.users?.phone || 'N/A'
          }
        })) || [];
        
        setStudents(formattedStudents);
      } catch (error) {
        console.error('Error loading students from Supabase:', error);
        // Fallback to demo students if Supabase fails
        setStudents([
          {
            id: 1,
            name: "Emma Johnson",
            class: "Grade 3A",
            rollNumber: "2024-301",
            attendance: { present: 85, total: 90, percentage: 94.4 },
            fees: { total: 15000, paid: 10000, pending: 5000 },
            parent: { name: "Sarah Johnson", email: "parent@demo.com", phone: "+1-555-0101" }
          }
        ]);
      }

      // Load users from Supabase
      try {
        const { data: supabaseUsers, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(supabaseUsers || []);
        
        // Filter teachers for the dropdown
        const teachers = supabaseUsers?.filter(user => user.role === 'teacher') || [];
        setAvailableTeachers(teachers);
      } catch (error) {
        console.error('Error loading users from Supabase:', error);
        // Fallback to demo users if Supabase fails
        const fallbackUsers = [
          { email: 'parent@demo.com', name: 'Sarah Johnson', role: 'parent' },
          { email: 'admin@demo.com', name: 'School Administrator', role: 'admin' },
          { email: 'teacher@demo.com', name: 'Ms. Smith', role: 'teacher' }
        ];
        setUsers(fallbackUsers);
        setAvailableTeachers(fallbackUsers.filter(user => user.role === 'teacher'));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      // Generate a unique roll number
      const rollNumber = `${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const userData = {
        name: newStudent.parentName,
        role: 'parent',
        studentData: {
          name: newStudent.name,
          class: newStudent.class,
          rollNumber: rollNumber,
          photo: "/default-avatar.png",
          attendance: { present: 0, total: 0, percentage: 0 },
          academics: {},
          fees: { totalAmount: 15000, paidAmount: 0, pendingAmount: 15000, dueDate: "2025-03-31" },
          recentActivities: [
            { date: new Date().toISOString().split('T')[0], activity: "Student registered", type: "info" }
          ]
        }
      };

      await register(newStudent.parentEmail, newStudent.parentPassword, userData);
      setNewStudent({
        name: '',
        class: 'Nursery',
        parentName: '',
        parentEmail: '',
        parentPassword: ''
      });
      setShowStudentForm(false);
      
      // Reload data to show the newly created student
      await loadData();
      
      alert('Student and parent account created successfully!');
    } catch (error) {
      alert('Error creating student: ' + error.message);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: newTeacher.name,
        role: 'teacher',
        assignedClasses: newTeacher.assignedClasses
      };

      // First create the teacher user account
      await register(newTeacher.email, newTeacher.password, userData);
      
      // Then assign the teacher to their selected classes
      for (const className of newTeacher.assignedClasses) {
        await assignTeacherToClass(newTeacher.email, className);
      }
      
      setNewTeacher({
        name: '',
        email: '',
        password: '',
        assignedClasses: []
      });
      setShowTeacherForm(false);
      
      // Reload data to show the newly created teacher
      await loadData();
      
      alert('Teacher account created and assigned to classes successfully!');
    } catch (error) {
      alert('Error creating teacher: ' + error.message);
    }
  };

  const classOptions = ['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'];

  const handleToggleClass = (className) => {
    setNewTeacher(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(className)
        ? prev.assignedClasses.filter(c => c !== className)
        : [...prev.assignedClasses, className]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
            <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">{students.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {students.length > 0 
                      ? Math.round(students.reduce((acc, student) => acc + student.attendance.percentage, 0) / students.length)
                      : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Fees Collected</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{students.reduce((acc, student) => acc + student.fees.paid, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Fees</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{students.reduce((acc, student) => acc + student.fees.pending, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Student Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.rollNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.attendance.percentage >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.attendance.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{student.fees.paid}/₹{student.fees.total}</div>
                        {student.fees.pending > 0 && (
                          <div className="text-xs text-red-600">₹{student.fees.pending} pending</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.parent.name}</div>
                        <div className="text-sm text-gray-500">{student.parent.email}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setShowStudentForm(!showStudentForm);
                  setShowTeacherForm(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{showStudentForm ? 'Cancel' : 'Add New Student'}</span>
              </button>
              
              <button
                onClick={() => {
                  setShowTeacherForm(!showTeacherForm);
                  setShowStudentForm(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{showTeacherForm ? 'Cancel' : 'Add New Teacher'}</span>
              </button>
            </div>

            {/* Add New Student Form */}
            {showStudentForm && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Add New Student</span>
                </h3>
                
                <form onSubmit={handleCreateStudent} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 border-b pb-2">Student Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                        <input
                          type="text"
                          value={newStudent.name}
                          onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter student's full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                        <select
                          value={newStudent.class}
                          onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {classOptions.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 border-b pb-2">Parent Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name *</label>
                        <input
                          type="text"
                          value={newStudent.parentName}
                          onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter parent's full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Email *</label>
                        <input
                          type="email"
                          value={newStudent.parentEmail}
                          onChange={(e) => setNewStudent({...newStudent, parentEmail: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="parent@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                        <input
                          type="password"
                          value={newStudent.parentPassword}
                          onChange={(e) => setNewStudent({...newStudent, parentPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Create a secure password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowStudentForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create Student & Parent Account
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Add New Teacher Form */}
            {showTeacherForm && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Add New Teacher</span>
                </h3>
                
                <form onSubmit={handleCreateTeacher} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 border-b pb-2">Teacher Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teacher Name *</label>
                        <input
                          type="text"
                          value={newTeacher.name}
                          onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter teacher's full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={newTeacher.email}
                          onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="teacher@school.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                        <input
                          type="password"
                          value={newTeacher.password}
                          onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Create a secure password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 border-b pb-2">Class Assignment</h4>
                      <p className="text-sm text-gray-600">Select the classes this teacher will handle (can be modified later)</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {classOptions.map(className => (
                          <label key={className} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newTeacher.assignedClasses.includes(className)}
                              onChange={() => handleToggleClass(className)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{className}</span>
                          </label>
                        ))}
                      </div>
                      
                      {newTeacher.assignedClasses.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Selected Classes:</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newTeacher.assignedClasses.map(cls => (
                              <span key={cls} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                {cls}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowTeacherForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Create Teacher Account
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Current Users</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Info</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.email} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : user.role === 'teacher'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.role === 'parent' && user.studentData?.name ? (
                            <span className="text-blue-600">Student: {user.studentData.name}</span>
                          ) : user.role === 'teacher' && user.assignedClasses?.length > 0 ? (
                            <span className="text-green-600">Classes: {user.assignedClasses.join(', ')}</span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'teachers':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Teacher Class Assignment Management</span>
              </h3>
              
              {/* Quick Assign Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6 border border-green-200">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Quick Class Assignment</span>
                </h4>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Teacher</label>
                    <select
                      value={teacherAssignment.teacherEmail}
                      onChange={(e) => setTeacherAssignment({...teacherAssignment, teacherEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Teacher</option>
                      {availableTeachers.map(teacher => (
                        <option key={teacher.email} value={teacher.email}>
                          {teacher.name} ({teacher.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Class</label>
                    <select
                      value={teacherAssignment.className}
                      onChange={(e) => setTeacherAssignment({...teacherAssignment, className: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select Class</option>
                      {classOptions.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={async () => {
                        if (teacherAssignment.teacherEmail && teacherAssignment.className) {
                          try {
                            await assignTeacherToClass(teacherAssignment.teacherEmail, teacherAssignment.className);
                            setTeacherAssignment({ teacherEmail: '', className: '' });
                            alert('Teacher assigned successfully!');
                          } catch (error) {
                            alert('Error assigning teacher: ' + error.message);
                          }
                        } else {
                          alert('Please select both teacher and class');
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span>Assign</span>
                    </button>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => setTeacherAssignment({ teacherEmail: '', className: '' })}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Teacher Assignments with Modification Options */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-medium text-gray-800 mb-6 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Current Teacher Assignments</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {Object.keys(teacherClassMapping).length} teachers assigned
                  </span>
                </h4>
                
                {Object.keys(teacherClassMapping).length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Teacher Assignments Yet</h3>
                    <p className="text-gray-500 mb-4">Start by assigning teachers to classes using the form above.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(teacherClassMapping).map(([email, classes]) => (
                      <div key={email} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <div>
                                <h5 className="font-medium text-gray-900 text-sm">{email}</h5>
                                <p className="text-xs text-gray-500">Teacher</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-700">Assigned Classes:</p>
                              <div className="flex flex-wrap gap-1">
                                {Array.isArray(classes) ? classes.map(className => (
                                  <div key={className} className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{className}</span>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Remove ${email} from ${className}?`)) {
                                          removeTeacherFromClass(email, className);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-800 ml-1"
                                      title="Remove from this class"
                                    >
                                      ×
                                    </button>
                                  </div>
                                )) : (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                    {classes}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => setTeacherAssignment({ teacherEmail: email, className: '' })}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                              title="Add More Classes"
                            >
                              Add Class
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Class Overview */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="font-medium text-gray-800 mb-6 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Class Overview</span>
                </h4>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {classOptions.map(className => {
                    const assignedTeachers = Object.entries(teacherClassMapping)
                      .filter(([_, classes]) => Array.isArray(classes) ? classes.includes(className) : classes === className)
                      .map(([email]) => email);
                    
                    return (
                      <div key={className} className={`rounded-lg p-4 border-2 ${
                        assignedTeachers.length > 0
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            assignedTeachers.length > 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {assignedTeachers.length > 0 ? (
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <h5 className="font-medium text-gray-900 text-sm mb-1">{className}</h5>
                          {assignedTeachers.length > 0 ? (
                            <div className="space-y-1">
                              {assignedTeachers.map(email => (
                                <p key={email} className="text-xs text-green-700">
                                  Teacher: {email.split('@')[0]}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-red-700">
                              No teacher assigned
                            </p>
                          )}
                          {assignedTeachers.length === 0 && (
                            <button
                              onClick={() => setTeacherAssignment({ teacherEmail: '', className: className })}
                              className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
                            >
                              Assign Teacher
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'fees':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Fee Payment Dashboard</h3>
              
              {/* Date Filter */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Filter by Date</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                      type="date"
                      value={feeFilter.date}
                      onChange={(e) => setFeeFilter({...feeFilter, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => setFeeFilter({...feeFilter, date: new Date().toISOString().split('T')[0]})}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Today's Payments
                    </button>
                  </div>
                </div>
              </div>

              {/* Fee Payments Table */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4">
                  Payments for {new Date(feeFilter.date).toLocaleDateString()}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFeePaymentsByDate(feeFilter.date).map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Summary */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Payments</p>
                      <p className="text-xl font-bold text-gray-800">
                        {getFeePaymentsByDate(feeFilter.date).length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{getFeePaymentsByDate(feeFilter.date)
                          .reduce((sum, payment) => sum + payment.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Average Payment</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{getFeePaymentsByDate(feeFilter.date).length > 0 
                          ? Math.round(getFeePaymentsByDate(feeFilter.date)
                              .reduce((sum, payment) => sum + payment.amount, 0) / 
                              getFeePaymentsByDate(feeFilter.date).length)
                              .toLocaleString()
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {userData?.name || 'Administrator'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'students', label: 'Students' },
                { id: 'users', label: 'User Management' },
                { id: 'teachers', label: 'Class Assignments' },
                { id: 'fees', label: 'Fee Dashboard' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
