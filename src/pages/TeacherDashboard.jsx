import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { userData, logout, getTeacherClasses, getStudentsByTeacher, updateStudentData, teacherClassMapping } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [markData, setMarkData] = useState({});

  useEffect(() => {
    const loadStudents = async () => {
      if (userData && userData.email) {
        setLoading(true);
        try {
          const teacherClasses = getTeacherClasses(userData.email);
          console.log('Teacher classes for', userData.email, ':', teacherClasses);
          
          if (teacherClasses.length > 0) {
            const allStudents = await getStudentsByTeacher(userData.email);
            console.log('Students found for teacher', userData.email, ':', allStudents);
            
            // Transform the data to match the expected format
            const formattedStudents = allStudents.map(student => ({
              id: student.id,
              name: student.name,
              class: student.class,
              rollNumber: student.roll_number,
              parentEmail: student.parent_email,
              photo: student.photo_url || '/default-avatar.png',
              attendance: {
                present: student.attendance?.filter(a => a.status === 'present').length || 0,
                total: student.attendance?.length || 0,
                percentage: student.attendance?.length > 0 ? 
                  Math.round((student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100) : 0
              },
              academics: student.grades?.reduce((acc, grade) => {
                acc[grade.subject] = { grade: grade.grade, score: grade.score };
                return acc;
              }, {}) || {}
            }));
            setStudents(formattedStudents);
          } else {
            console.log('No classes assigned to teacher:', userData.email);
            setStudents([]);
          }
        } catch (error) {
          console.error('Error loading students:', error);
          setStudents([]);
        }
        setLoading(false);
      }
    };

    loadStudents();
  }, [userData, getTeacherClasses, getStudentsByTeacher, teacherClassMapping]);

  const handleLogout = () => {
    logout();
  };

  const updateAttendance = async (studentEmail, date, status) => {
    try {
      // Find the student by parent email
      const student = students.find(s => s.parentEmail === studentEmail);
      if (student) {
        // Update attendance in the database
        await updateStudentData(studentEmail, {
          attendance: { status, date: date || new Date().toISOString().split('T')[0] }
        });
        
        // Refresh students list
        const teacherClass = getTeacherClass(userData.email);
        const classStudents = await getStudentsByClass(teacherClass);
        const formattedStudents = classStudents.map(student => ({
          id: student.id,
          name: student.name,
          class: student.class,
          rollNumber: student.roll_number,
          parentEmail: student.parent_email,
          photo: student.photo_url || '👤',
          attendance: {
            present: student.attendance?.filter(a => a.status === 'present').length || 0,
            total: student.attendance?.length || 0,
            percentage: student.attendance?.length > 0 ? 
              Math.round((student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100) : 0
          },
          academics: student.grades?.reduce((acc, grade) => {
            acc[grade.subject] = { grade: grade.grade, score: grade.score };
            return acc;
          }, {}) || {}
        }));
        setStudents(formattedStudents);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const updateMarks = async (studentEmail, subject, grade, score) => {
    try {
      const student = students.find(s => s.parentEmail === studentEmail);
      if (student) {
        // Update grades in the database
        await updateStudentData(studentEmail, {
          academics: { [subject]: { grade, score } }
        });
        
        // Refresh students list
        const teacherClass = getTeacherClass(userData.email);
        const classStudents = await getStudentsByClass(teacherClass);
        const formattedStudents = classStudents.map(student => ({
          id: student.id,
          name: student.name,
          class: student.class,
          rollNumber: student.roll_number,
          parentEmail: student.parent_email,
          photo: student.photo_url || '👤',
          attendance: {
            present: student.attendance?.filter(a => a.status === 'present').length || 0,
            total: student.attendance?.length || 0,
            percentage: student.attendance?.length > 0 ? 
              Math.round((student.attendance.filter(a => a.status === 'present').length / student.attendance.length) * 100) : 0
          },
          academics: student.grades?.reduce((acc, grade) => {
            acc[grade.subject] = { grade: grade.grade, score: grade.score };
            return acc;
          }, {}) || {}
        }));
        setStudents(formattedStudents);
        
        alert(`Updated ${subject} grade for ${student.name}: ${grade} (${score}%)`);
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      alert('Error updating marks. Please try again.');
    }
  };

  const addAchievement = (studentEmail, achievement) => {
    const student = students.find(s => s.parentEmail === studentEmail);
    if (student) {
      const newActivity = {
        date: new Date().toISOString().split('T')[0],
        activity: achievement,
        type: 'achievement'
      };
      
      const updatedActivities = [newActivity, ...student.recentActivities];
      
      updateStudentData(studentEmail, {
        recentActivities: updatedActivities
      });
      
      // Refresh students list
      const teacherClass = getTeacherClass(userData.email);
      const updatedStudents = getStudentsByClass(teacherClass);
      setStudents(updatedStudents);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const teacherClass = getTeacherClass(userData?.email);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Class Students - {teacherClass}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.parentEmail} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.rollNumber}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Mark Attendance - {teacherClass}</h3>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.parentEmail} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateAttendance(student.parentEmail, new Date().toISOString().split('T')[0], 'present')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Present
                    </button>
                    <button
                      onClick={() => updateAttendance(student.parentEmail, new Date().toISOString().split('T')[0], 'absent')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
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
              <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {userData?.name || 'Teacher'} - {teacherClass}</p>
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
                { id: 'students', label: 'My Students' },
                { id: 'attendance', label: 'Mark Attendance' }
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

        {/* Student Management Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Manage {selectedStudent.name}</h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Add Marks Section */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Add/Update Marks</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        value={markData.subject || ''}
                        onChange={(e) => setMarkData({...markData, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Subject</option>
                        <option value="math">Mathematics</option>
                        <option value="english">English</option>
                        <option value="science">Science</option>
                        <option value="art">Art</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                      <input
                        type="number"
                        max="100"
                        min="0"
                        value={markData.score || ''}
                        onChange={(e) => setMarkData({...markData, score: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter score (0-100)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                      <select
                        value={markData.grade || ''}
                        onChange={(e) => setMarkData({...markData, grade: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Grade</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          if (markData.subject && markData.grade && markData.score) {
                            updateMarks(selectedStudent.parentEmail, markData.subject, markData.grade, markData.score);
                            setMarkData({});
                          }
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Update Marks
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add Achievement Section */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Add Achievement</h4>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={markData.achievement || ''}
                      onChange={(e) => setMarkData({...markData, achievement: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter achievement description"
                    />
                    <button
                      onClick={() => {
                        if (markData.achievement) {
                          addAchievement(selectedStudent.parentEmail, markData.achievement);
                          setMarkData({...markData, achievement: ''});
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Achievement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
