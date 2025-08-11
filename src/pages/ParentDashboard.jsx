import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ParentDashboard = () => {
  const { userData, logout, studentData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get student data based on parent's email
  useEffect(() => {
    if (!userData || !studentData) {
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const parentEmail = userData?.email;
      const studentInfo = studentData[parentEmail];
      
      if (studentInfo) {
        setChildData(studentInfo);
      } else {
        // Default data for parents without assigned students
        const defaultData = {
          name: "No Student Assigned",
          class: "N/A",
          rollNumber: "N/A",
          photo: "👤",
          attendance: { present: 0, total: 0, percentage: 0 },
          academics: {},
          fees: { totalAmount: 0, paidAmount: 0, pendingAmount: 0, dueDate: "N/A" },
          recentActivities: [
            { date: new Date().toISOString().split('T')[0], activity: "Please contact admin to assign student data", type: "info" }
          ]
        };
        setChildData(defaultData);
      }
      setLoading(false);
    }, 300);
  }, [userData, studentData]);

  const handleLogout = () => {
    logout();
  };

  const payFees = () => {
    alert('Redirecting to payment gateway...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!childData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (!childData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading student information...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Present Days:</span>
                  <span className="font-medium">{childData?.attendance?.present || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days:</span>
                  <span className="font-medium">{childData?.attendance?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-medium text-green-600">{childData?.attendance?.percentage || 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₹{childData?.fees?.totalAmount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">₹{childData?.fees?.paidAmount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-medium text-red-600">₹{childData?.fees?.pendingAmount || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Progress</h3>
              <div className="space-y-2">
                {childData?.academics && Object.keys(childData.academics).length > 0 ? (
                  Object.entries(childData.academics).map(([subject, gradeData]) => (
                    <div key={subject} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{subject}:</span>
                      <span className="font-medium">{gradeData.grade} ({gradeData.score}%)</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No academic data available</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'academics':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Academic Performance</h3>
            {Object.keys(childData.academics).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(childData.academics).map(([subject, gradeData]) => (
                  <div key={subject} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 capitalize">{subject}</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">{gradeData.grade}</p>
                    <p className="text-sm text-gray-600">Score: {gradeData.score}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No academic records available. Please contact the school administration.</p>
            )}
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Attendance Details</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{childData.attendance.present}</div>
                  <div className="text-sm text-gray-600">Present Days</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{childData.attendance.total - childData.attendance.present}</div>
                  <div className="text-sm text-gray-600">Absent Days</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{childData.attendance.percentage}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'fees':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Fee Information</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹{childData.fees.totalAmount}</div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹{childData.fees.paidAmount}</div>
                  <div className="text-sm text-gray-600">Paid Amount</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">₹{childData.fees.pendingAmount}</div>
                  <div className="text-sm text-gray-600">Pending Amount</div>
                </div>
              </div>
              {childData.fees.pendingAmount > 0 && (
                <div className="text-center">
                  <button
                    onClick={payFees}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Pay Fees Online
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'activities':
        return (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {childData.recentActivities.map((activity, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="text-sm text-gray-500">{activity.date}</div>
                  <div className="text-gray-800">{activity.activity}</div>
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
              <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
              <p className="text-sm text-gray-600">Welcome, {userData?.name || 'Parent'}</p>
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
        {/* Student Information Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{childData?.photo || "👤"}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{childData?.name || "Loading..."}</h2>
                <p className="text-gray-600">Class: {childData?.class || "N/A"}</p>
                <p className="text-gray-600">Roll Number: {childData?.rollNumber || "N/A"}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Overall Attendance</div>
              <div className="text-2xl font-bold text-green-600">{childData?.attendance?.percentage || 0}%</div>
              <div className="text-sm text-gray-600">{childData?.attendance?.present || 0}/{childData?.attendance?.total || 0} days</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'academics', label: 'Academics' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'fees', label: 'Fees' },
                { id: 'activities', label: 'Activities' }
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

export default ParentDashboard;
