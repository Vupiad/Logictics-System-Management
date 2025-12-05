import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Truck, Gauge } from 'lucide-react';

type VehicleStatus = 'available' | 'in_use' | 'maintenance';

type Vehicle = {
  id: string;
  licensePlate: string;
  type: string;
  brand: string;
  capacity: number;
  status: VehicleStatus;
  registrationDate: string;
  lastMaintenance: string;
  fuelType: string;
  parkingLocation: string; // Vị trí đỗ xe (tại kho nào)
};

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      licensePlate: '51A-12345',
      type: 'Xe tải 5 tấn',
      brand: 'Hyundai',
      capacity: 5000,
      status: 'available',
      registrationDate: '2022-01-15',
      lastMaintenance: '2024-10-20',
      fuelType: 'Diesel',
      parkingLocation: 'Kho A',
    },
    {
      id: '2',
      licensePlate: '59B-67890',
      type: 'Xe tải 10 tấn',
      brand: 'Hino',
      capacity: 10000,
      status: 'in_use',
      registrationDate: '2021-06-10',
      lastMaintenance: '2024-11-15',
      fuelType: 'Diesel',
      parkingLocation: 'Kho B',
    },
    {
      id: '3',
      licensePlate: '30C-11111',
      type: 'Xe tải 3 tấn',
      brand: 'Isuzu',
      capacity: 3000,
      status: 'maintenance',
      registrationDate: '2023-03-20',
      lastMaintenance: '2024-11-28',
      fuelType: 'Diesel',
      parkingLocation: 'Kho C',
    },
    {
      id: '4',
      licensePlate: '29D-22222',
      type: 'Xe van 1.5 tấn',
      brand: 'Ford',
      capacity: 1500,
      status: 'available',
      registrationDate: '2023-08-05',
      lastMaintenance: '2024-09-10',
      fuelType: 'Diesel',
      parkingLocation: 'Kho D',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    licensePlate: '',
    type: '',
    brand: '',
    capacity: 0,
    status: 'available' as VehicleStatus,
    fuelType: 'Diesel',
    parkingLocation: '',
  });

  const statusLabels: Record<VehicleStatus, string> = {
    available: 'Sẵn sàng',
    in_use: 'Đang sử dụng',
    maintenance: 'Bảo trì',
  };

  const statusColors: Record<VehicleStatus, string> = {
    available: 'bg-green-100 text-green-700',
    in_use: 'bg-yellow-100 text-yellow-700',
    maintenance: 'bg-red-100 text-red-700',
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: (vehicles.length + 1).toString(),
      licensePlate: formData.licensePlate,
      type: formData.type,
      brand: formData.brand,
      capacity: formData.capacity,
      status: formData.status,
      registrationDate: new Date().toISOString().split('T')[0],
      lastMaintenance: new Date().toISOString().split('T')[0],
      fuelType: formData.fuelType,
      parkingLocation: formData.parkingLocation,
    };
    setVehicles([...vehicles, newVehicle]);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateVehicle = () => {
    if (!selectedVehicle) return;
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === selectedVehicle.id
          ? { ...vehicle, ...formData }
          : vehicle
      )
    );
    setShowEditModal(false);
    resetForm();
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    }
  };

  const openEditModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      licensePlate: vehicle.licensePlate,
      type: vehicle.type,
      brand: vehicle.brand,
      capacity: vehicle.capacity,
      status: vehicle.status,
      fuelType: vehicle.fuelType,
      parkingLocation: vehicle.parkingLocation,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      licensePlate: '',
      type: '',
      brand: '',
      capacity: 0,
      status: 'available',
      fuelType: 'Diesel',
      parkingLocation: '',
    });
  };

  const updateVehicleStatus = (id: string, newStatus: VehicleStatus) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, status: newStatus } : vehicle
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Quản Lý Phương Tiện</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm Phương Tiện
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tổng Phương Tiện</p>
              <p className="text-gray-900">{vehicles.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Sẵn Sàng</p>
              <p className="text-gray-900">
                {vehicles.filter((v) => v.status === 'available').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Đang Sử Dụng</p>
              <p className="text-gray-900">
                {vehicles.filter((v) => v.status === 'in_use').length}
              </p>
            </div>
            <Gauge className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo biển số, loại xe, hãng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Vehicle Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Biển Số</th>
              <th className="px-6 py-3 text-left text-gray-700">Loại Xe</th>
              <th className="px-6 py-3 text-left text-gray-700">Hãng</th>
              <th className="px-6 py-3 text-left text-gray-700">Tải Trọng</th>
              <th className="px-6 py-3 text-left text-gray-700">Nhiên Liệu</th>
              <th className="px-6 py-3 text-left text-gray-700">Vị Trí Đỗ</th>
              <th className="px-6 py-3 text-left text-gray-700">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-gray-700">Bảo Trì Cuối</th>
              <th className="px-6 py-3 text-left text-gray-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{vehicle.licensePlate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{vehicle.type}</td>
                <td className="px-6 py-4 text-gray-700">{vehicle.brand}</td>
                <td className="px-6 py-4 text-gray-700">{vehicle.capacity} kg</td>
                <td className="px-6 py-4 text-gray-700">{vehicle.fuelType}</td>
                <td className="px-6 py-4 text-gray-700">{vehicle.parkingLocation}</td>
                <td className="px-6 py-4">
                  <select
                    value={vehicle.status}
                    onChange={(e) => updateVehicleStatus(vehicle.id, e.target.value as VehicleStatus)}
                    className={`px-2 py-1 rounded border-0 ${statusColors[vehicle.status]}`}
                  >
                    <option value="available">Sẵn sàng</option>
                    <option value="in_use">Đang sử dụng</option>
                    <option value="maintenance">Bảo trì</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-gray-700">{vehicle.lastMaintenance}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(vehicle)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
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

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Thêm Phương Tiện Mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Biển số xe</label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  placeholder="VD: 51A-12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Loại xe</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="VD: Xe tải 5 tấn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Hãng xe</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="VD: Hyundai"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Tải trọng (kg)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Nhiên liệu</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Gasoline">Xăng</option>
                  <option value="Electric">Điện</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as VehicleStatus })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Sẵn sàng</option>
                  <option value="in_use">Đang sử dụng</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Vị trí đỗ xe</label>
                <input
                  type="text"
                  value={formData.parkingLocation}
                  onChange={(e) => setFormData({ ...formData, parkingLocation: e.target.value })}
                  placeholder="VD: Kho A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddVehicle}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm
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

      {/* Edit Vehicle Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Cập Nhật Phương Tiện</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Biển số xe</label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Loại xe</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Hãng xe</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Tải trọng (kg)</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Nhiên liệu</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Gasoline">Xăng</option>
                  <option value="Electric">Điện</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as VehicleStatus })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Sẵn sàng</option>
                  <option value="in_use">Đang sử dụng</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Vị trí đỗ xe</label>
                <input
                  type="text"
                  value={formData.parkingLocation}
                  onChange={(e) => setFormData({ ...formData, parkingLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateVehicle}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cập nhật
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                  setSelectedVehicle(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}