import { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, CheckCircle, Eye, EyeOff } from 'lucide-react';

export type Employee = {
  id: string;
  name: string;
  phone: string;
  role: 'warehouse_staff' | 'driver_provincial' | 'driver_local' | 'manager_provincial' | 'manager_local' | 'customer_service';
  baseSalary: number;
  workDays: number;
  username: string;
  password: string;
  createdAt: string;
  // Thông tin riêng theo chức vụ
  warehouse?: string; // Cho nhân viên kho, tài xế liên tỉnh, quản lý tài xế liên tỉnh
  driverLicense?: string; // Cho tài xế liên tỉnh, tài xế nội thành
  workArea?: string; // Cho tài xế nội thành
  vehiclePlate?: string; // Cho tài xế nội thành
  workLocation?: string; // Cho quản lý tài xế nội thành, nhân viên chăm sóc khách hàng
};

const warehouses = ['Kho Hà Nội', 'Kho Hồ Chí Minh', 'Kho Đà Nẵng', 'Kho Cần Thơ'];
const workAreas = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10'];

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'NV001',
      name: 'Trần Thị Bình',
      phone: '0912345678',
      role: 'warehouse_staff',
      baseSalary: 8000000,
      workDays: 20,
      username: 'binh.tran',
      password: 'pass123',
      createdAt: '2024-02-20',
      warehouse: 'Kho Hà Nội',
    },
    {
      id: 'NV002',
      name: 'Lê Văn Cường',
      phone: '0923456789',
      role: 'driver_provincial',
      baseSalary: 12000000,
      workDays: 18,
      username: 'cuong.le',
      password: 'pass123',
      createdAt: '2024-03-10',
      warehouse: 'Kho Hà Nội',
      driverLicense: 'B2',
    },
    {
      id: 'NV003',
      name: 'Nguyễn Văn Dũng',
      phone: '0934567890',
      role: 'driver_local',
      baseSalary: 9000000,
      workDays: 22,
      username: 'dung.nguyen',
      password: 'pass123',
      createdAt: '2024-01-15',
      workArea: 'Quận 1',
      driverLicense: 'B1',
      vehiclePlate: '51A-12345',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'warehouse_staff' as Employee['role'],
    baseSalary: 0,
    warehouse: '',
    driverLicense: '',
    workArea: '',
    vehiclePlate: '',
    workLocation: '',
  });

  const roleLabels: Record<Employee['role'], string> = {
    warehouse_staff: 'Nhân viên kho',
    driver_provincial: 'Tài xế liên tỉnh',
    driver_local: 'Tài xế nội thành',
    manager_provincial: 'Quản lý tài xế liên tỉnh',
    manager_local: 'Quản lý tài xế nội thành',
    customer_service: 'Nhân viên CSKH',
  };

  const generateUsername = (name: string) => {
    const words = name.toLowerCase().trim().split(' ');
    const lastName = words[words.length - 1];
    const firstName = words.slice(0, -1).map(w => w[0]).join('');
    return `${lastName}.${firstName}`;
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (!formData.name || !formData.phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const username = generateUsername(formData.name);
    const password = generatePassword();

    const newEmployee: Employee = {
      id: `NV${String(employees.length + 1).padStart(3, '0')}`,
      name: formData.name,
      phone: formData.phone,
      role: formData.role,
      baseSalary: formData.baseSalary,
      workDays: 0,
      username,
      password,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Thêm thông tin riêng theo chức vụ
    if (formData.role === 'warehouse_staff') {
      newEmployee.warehouse = formData.warehouse;
    } else if (formData.role === 'driver_provincial') {
      newEmployee.warehouse = formData.warehouse;
      newEmployee.driverLicense = formData.driverLicense;
    } else if (formData.role === 'driver_local') {
      newEmployee.workArea = formData.workArea;
      newEmployee.driverLicense = formData.driverLicense;
      newEmployee.vehiclePlate = formData.vehiclePlate;
    } else if (formData.role === 'manager_provincial') {
      newEmployee.warehouse = formData.warehouse;
    } else if (formData.role === 'manager_local' || formData.role === 'customer_service') {
      newEmployee.workLocation = formData.workLocation;
    }

    setEmployees([...employees, newEmployee]);
    alert(`Tài khoản đã được tạo!\nTên đăng nhập: ${username}\nMật khẩu: ${password}`);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateEmployee = () => {
    if (!selectedEmployee) return;
    
    const updatedEmployee = { ...selectedEmployee };
    updatedEmployee.name = formData.name;
    updatedEmployee.phone = formData.phone;
    updatedEmployee.role = formData.role;
    updatedEmployee.baseSalary = formData.baseSalary;

    // Cập nhật thông tin riêng theo chức vụ
    if (formData.role === 'warehouse_staff') {
      updatedEmployee.warehouse = formData.warehouse;
    } else if (formData.role === 'driver_provincial') {
      updatedEmployee.warehouse = formData.warehouse;
      updatedEmployee.driverLicense = formData.driverLicense;
    } else if (formData.role === 'driver_local') {
      updatedEmployee.workArea = formData.workArea;
      updatedEmployee.driverLicense = formData.driverLicense;
      updatedEmployee.vehiclePlate = formData.vehiclePlate;
    } else if (formData.role === 'manager_provincial') {
      updatedEmployee.warehouse = formData.warehouse;
    } else if (formData.role === 'manager_local' || formData.role === 'customer_service') {
      updatedEmployee.workLocation = formData.workLocation;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      )
    );
    setShowEditModal(false);
    resetForm();
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleAttendance = (id: string) => {
    setEmployees(
      employees.map((emp) => {
        if (emp.id === id) {
          return {
            ...emp,
            workDays: emp.workDays + 1,
          };
        }
        return emp;
      })
    );
  };

  const calculateSalary = (employee: Employee) => {
    const dailySalary = employee.baseSalary / 26;
    return dailySalary * employee.workDays;
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      role: employee.role,
      baseSalary: employee.baseSalary,
      warehouse: employee.warehouse || '',
      driverLicense: employee.driverLicense || '',
      workArea: employee.workArea || '',
      vehiclePlate: employee.vehiclePlate || '',
      workLocation: employee.workLocation || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      role: 'warehouse_staff',
      baseSalary: 0,
      warehouse: '',
      driverLicense: '',
      workArea: '',
      vehiclePlate: '',
      workLocation: '',
    });
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'warehouse_staff':
        return (
          <div>
            <label className="block text-gray-700 mb-1">Kho làm việc</label>
            <select
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn kho --</option>
              {warehouses.map((wh) => (
                <option key={wh} value={wh}>{wh}</option>
              ))}
            </select>
          </div>
        );
      
      case 'driver_provincial':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Kho làm việc</label>
              <select
                value={formData.warehouse}
                onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn kho --</option>
                {warehouses.map((wh) => (
                  <option key={wh} value={wh}>{wh}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Bằng lái xe</label>
              <select
                value={formData.driverLicense}
                onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn loại bằng --</option>
                <option value="B2">B2</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>
          </>
        );
      
      case 'driver_local':
        return (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Khu vực hoạt động</label>
              <select
                value={formData.workArea}
                onChange={(e) => setFormData({ ...formData, workArea: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn khu vực --</option>
                {workAreas.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Bằng lái xe</label>
              <select
                value={formData.driverLicense}
                onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn loại bằng --</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Biển số xe</label>
              <input
                type="text"
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                placeholder="VD: 51A-12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        );
      
      case 'manager_provincial':
        return (
          <div>
            <label className="block text-gray-700 mb-1">Kho làm việc</label>
            <select
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Chọn kho --</option>
              {warehouses.map((wh) => (
                <option key={wh} value={wh}>{wh}</option>
              ))}
            </select>
          </div>
        );
      
      case 'manager_local':
      case 'customer_service':
        return (
          <div>
            <label className="block text-gray-700 mb-1">Nơi làm việc</label>
            <input
              type="text"
              value={formData.workLocation}
              onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
              placeholder="VD: Văn phòng Hà Nội"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Quản Lý Nhân Viên</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm Nhân Viên
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, SĐT, mã nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Mã NV</th>
              <th className="px-6 py-3 text-left text-gray-700">Họ Tên</th>
              <th className="px-6 py-3 text-left text-gray-700">SĐT</th>
              <th className="px-6 py-3 text-left text-gray-700">Chức Vụ</th>
              <th className="px-6 py-3 text-left text-gray-700">Lương CB</th>
              <th className="px-6 py-3 text-left text-gray-700">Số Công</th>
              <th className="px-6 py-3 text-left text-gray-700">Điểm Danh</th>
              <th className="px-6 py-3 text-left text-gray-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900">{employee.id}</td>
                <td className="px-6 py-4 text-gray-900">{employee.name}</td>
                <td className="px-6 py-4 text-gray-700">{employee.phone}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {roleLabels[employee.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {employee.baseSalary.toLocaleString('vi-VN')} đ
                </td>
                <td className="px-6 py-4 text-gray-700">{employee.workDays} ngày</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleAttendance(employee.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Điểm danh
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowDetailModal(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setShowSalaryModal(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Tính lương"
                    >
                      <DollarSign className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(employee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-900 mb-4">Thêm Nhân Viên Mới</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Chức vụ</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as Employee['role'] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="warehouse_staff">Nhân viên kho</option>
                  <option value="driver_provincial">Tài xế liên tỉnh</option>
                  <option value="driver_local">Tài xế nội thành</option>
                  <option value="manager_provincial">Quản lý tài xế liên tỉnh</option>
                  <option value="manager_local">Quản lý tài xế nội thành</option>
                  <option value="customer_service">Nhân viên CSKH</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Lương cơ bản (VNĐ)</label>
                <input
                  type="number"
                  value={formData.baseSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, baseSalary: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {renderRoleSpecificFields()}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddEmployee}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm & Tạo Tài Khoản
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-900 mb-4">Cập Nhật Thông Tin Nhân Viên</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Chức vụ</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as Employee['role'] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="warehouse_staff">Nhân viên kho</option>
                  <option value="driver_provincial">Tài xế liên tỉnh</option>
                  <option value="driver_local">Tài xế nội thành</option>
                  <option value="manager_provincial">Quản lý tài xế liên tỉnh</option>
                  <option value="manager_local">Quản lý tài xế nội thành</option>
                  <option value="customer_service">Nhân viên CSKH</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Lương cơ bản (VNĐ)</label>
                <input
                  type="number"
                  value={formData.baseSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, baseSalary: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {renderRoleSpecificFields()}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateEmployee}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedEmployee(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Thông Tin Chi Tiết Nhân Viên</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Mã NV:</span>
                <span className="text-gray-900">{selectedEmployee.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Họ tên:</span>
                <span className="text-gray-900">{selectedEmployee.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">SĐT:</span>
                <span className="text-gray-900">{selectedEmployee.phone}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Chức vụ:</span>
                <span className="text-gray-900">{roleLabels[selectedEmployee.role]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Lương CB:</span>
                <span className="text-gray-900">{selectedEmployee.baseSalary.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Số công:</span>
                <span className="text-gray-900">{selectedEmployee.workDays} ngày</span>
              </div>
              
              {selectedEmployee.warehouse && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Kho:</span>
                  <span className="text-gray-900">{selectedEmployee.warehouse}</span>
                </div>
              )}
              {selectedEmployee.driverLicense && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Bằng lái:</span>
                  <span className="text-gray-900">{selectedEmployee.driverLicense}</span>
                </div>
              )}
              {selectedEmployee.workArea && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Khu vực:</span>
                  <span className="text-gray-900">{selectedEmployee.workArea}</span>
                </div>
              )}
              {selectedEmployee.vehiclePlate && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Biển số xe:</span>
                  <span className="text-gray-900">{selectedEmployee.vehiclePlate}</span>
                </div>
              )}
              {selectedEmployee.workLocation && (
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Nơi làm việc:</span>
                  <span className="text-gray-900">{selectedEmployee.workLocation}</span>
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <p className="text-gray-700 mb-2">Thông tin tài khoản:</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <span className="text-gray-600">Tên đăng nhập:</span>
                  <span className="text-gray-900">{selectedEmployee.username}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-600">Mật khẩu:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">
                      {showPassword ? selectedEmployee.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowDetailModal(false);
                setShowPassword(false);
              }}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Tính Lương Nhân Viên</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nhân viên:</span>
                <span className="text-gray-900">{selectedEmployee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chức vụ:</span>
                <span className="text-gray-900">{roleLabels[selectedEmployee.role]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lương cơ bản:</span>
                <span className="text-gray-900">
                  {selectedEmployee.baseSalary.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số ngày công:</span>
                <span className="text-gray-900">{selectedEmployee.workDays} ngày</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-900">Tổng lương:</span>
                  <span className="text-blue-600">
                    {calculateSalary(selectedEmployee).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSalaryModal(false)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
