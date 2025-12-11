import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Truck, Gauge, AlertCircle } from 'lucide-react';

type VehicleStatus = 'SanSang' | 'DangVanChuyen';

type Vehicle = {
  bienSoXe: string;
  loaiXe: string;
  taiTrong: number;
  trangThai: VehicleStatus;
  viTriDo: string;
};

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Global error (e.g., fetch failure)
  const [formError, setFormError] = useState<string | null>(null); // Modal-specific error
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    bienSoXe: '',
    loaiXe: '',
    taiTrong: 0,
    trangThai: 'SanSang' as VehicleStatus,
    viTriDo: '',
  });

  const API_URL = 'http://localhost:8080/api/vehicles';

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading vehicles');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<VehicleStatus, string> = {
    SanSang: 'Sẵn sàng',
    DangVanChuyen: 'Đang vận chuyển',
  };

  const statusColors: Record<VehicleStatus, string> = {
    SanSang: 'bg-green-100 text-green-700',
    DangVanChuyen: 'bg-yellow-100 text-yellow-700',
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.bienSoXe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.loaiXe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = async () => {
    setFormError(null); // Clear previous errors
    if (!formData.bienSoXe || !formData.loaiXe || !formData.viTriDo) {
      setFormError('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }
    try {
      const payload = {
        bienSoXe: formData.bienSoXe,
        loaiXe: formData.loaiXe,
        taiTrong: formData.taiTrong || 0,
        trangThai: formData.trangThai || 'SanSang',
        viTriDo: formData.viTriDo,
      };
      console.log('Adding vehicle:', payload);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Try to parse JSON error first, else text
        const errorBody = await response.text();
        let errorMsg = `Lỗi ${response.status}`;
        try {
            const errorJson = JSON.parse(errorBody); // Expecting JSON from backend
            errorMsg = errorJson.message || errorJson.error || errorBody;
        } catch {
            errorMsg = errorBody || errorMsg;
        }
        throw new Error(errorMsg);
      }

      console.log('Vehicle added successfully');
      setShowAddModal(false);
      resetForm();
      setError(null);
      await fetchVehicles();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error adding vehicle';
      setFormError(errorMsg); // Show error in modal
      console.error('Add error:', err);
    }
  };

  const handleUpdateVehicle = async () => {
    setFormError(null); // Clear previous errors
    if (!selectedVehicle) return;
    if (!formData.bienSoXe || !formData.loaiXe || !formData.viTriDo) {
      setFormError('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }
    try {
      const payload = {
        bienSoXe: formData.bienSoXe,
        loaiXe: formData.loaiXe,
        taiTrong: formData.taiTrong || 0,
        trangThai: formData.trangThai || 'SanSang',
        viTriDo: formData.viTriDo,
      };
      console.log('Updating vehicle:', payload);
      const response = await fetch(`${API_URL}/${encodeURIComponent(selectedVehicle.bienSoXe)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
         let errorMsg = `Lỗi ${response.status}`;
         try {
             const errorData = await response.json();
             errorMsg = errorData.message || errorData.error || await response.text();
         } catch {
             errorMsg = await response.text();
         }
         throw new Error(errorMsg);
      }

      console.log('Vehicle updated successfully');
      setShowEditModal(false);
      resetForm();
      setSelectedVehicle(null);
      setError(null);
      await fetchVehicles();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error updating vehicle';
      setFormError(errorMsg); // Show error in modal
      console.error('Update error:', err);
    }
  };

  const handleDeleteVehicle = async (bienSoXe: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      try {
        console.log('Deleting vehicle:', bienSoXe);
        const response = await fetch(`${API_URL}/${encodeURIComponent(bienSoXe)}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || `HTTP error! status: ${response.status}`);
        }
        console.log('Vehicle deleted successfully');
        setError(null);
        await fetchVehicles();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error deleting vehicle';
        // Delete errors are shown globally since there's no modal
        setError(errorMsg);
        console.error('Delete error:', err);
      }
    }
  };

  const openEditModal = (vehicle: Vehicle) => {
    setFormError(null);
    setSelectedVehicle(vehicle);
    setFormData({
      bienSoXe: vehicle.bienSoXe,
      loaiXe: vehicle.loaiXe,
      taiTrong: vehicle.taiTrong,
      trangThai: vehicle.trangThai,
      viTriDo: vehicle.viTriDo,
    });
    setShowEditModal(true);
  };

  const openAddModal = () => {
      setFormError(null);
      resetForm();
      setShowAddModal(true);
  }

  const resetForm = () => {
    setFormData({
      bienSoXe: '',
      loaiXe: '',
      taiTrong: 0,
      trangThai: 'SanSang',
      viTriDo: '',
    });
    setFormError(null);
  };

  const updateVehicleStatus = async (bienSoXe: string, newStatus: VehicleStatus) => {
    const vehicle = vehicles.find(v => v.bienSoXe === bienSoXe);
    if (!vehicle) return;

    try {
      const payload = { ...vehicle, trangThai: newStatus };
      const response = await fetch(`${API_URL}/${encodeURIComponent(bienSoXe)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Failed to update status');
      }
      await fetchVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Error Message (For fetch/delete) */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-gray-900">Quản Lý Phương Tiện</h2>
            <button
              onClick={openAddModal}
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
                    {vehicles.filter((v) => v.trangThai === 'SanSang').length}
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
                    {vehicles.filter((v) => v.trangThai === 'DangVanChuyen').length}
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
              placeholder="Tìm kiếm theo biển số, loại xe..."
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
                  <th className="px-6 py-3 text-left text-gray-700">Tải Trọng (Tấn)</th>
                  <th className="px-6 py-3 text-left text-gray-700">Vị Trí Đỗ</th>
                  <th className="px-6 py-3 text-left text-gray-700">Trạng Thái</th>
                  <th className="px-6 py-3 text-left text-gray-700">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.bienSoXe} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{vehicle.bienSoXe}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{vehicle.loaiXe}</td>
                    <td className="px-6 py-4 text-gray-700">{vehicle.taiTrong}</td>
                    <td className="px-6 py-4 text-gray-700">{vehicle.viTriDo}</td>
                    <td className="px-6 py-4">
                      <select
                        value={vehicle.trangThai}
                        onChange={(e) => updateVehicleStatus(vehicle.bienSoXe, e.target.value as VehicleStatus)}
                        className={`px-2 py-1 rounded border-0 ${statusColors[vehicle.trangThai]}`}
                      >
                        <option value="SanSang">Sẵn sàng</option>
                        <option value="DangVanChuyen">Đang vận chuyển</option>
                      </select>
                    </td>
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
                          onClick={() => handleDeleteVehicle(vehicle.bienSoXe)}
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
                <h3 className="text-gray-900 mb-4 text-lg font-bold">Thêm Phương Tiện Mới</h3>

                {/* Modal Error Message */}
                {formError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Biển số xe *</label>
                    <input
                      type="text"
                      value={formData.bienSoXe}
                      onChange={(e) => setFormData({ ...formData, bienSoXe: e.target.value })}
                      placeholder="VD: 51A-12345"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Loại xe *</label>
                    <input
                      type="text"
                      value={formData.loaiXe}
                      onChange={(e) => setFormData({ ...formData, loaiXe: e.target.value })}
                      placeholder="VD: Xe tải 5 tấn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Tải trọng (Tấn)</label>
                    <input
                      type="number"
                      value={formData.taiTrong}
                      onChange={(e) => setFormData({ ...formData, taiTrong: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Trạng thái</label>
                    <select
                      value={formData.trangThai}
                      onChange={(e) =>
                        setFormData({ ...formData, trangThai: e.target.value as VehicleStatus })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SanSang">Sẵn sàng</option>
                      <option value="DangVanChuyen">Đang vận chuyển</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Vị trí đỗ xe *</label>
                    <input
                      type="text"
                      value={formData.viTriDo}
                      onChange={(e) => setFormData({ ...formData, viTriDo: e.target.value })}
                      placeholder="VD: Kho A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddVehicle}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Thêm
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
                <h3 className="text-gray-900 mb-4 text-lg font-bold">Cập Nhật Phương Tiện</h3>

                {/* Modal Error Message */}
                {formError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Biển số xe</label>
                    <input
                      type="text"
                      value={formData.bienSoXe}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Loại xe *</label>
                    <input
                      type="text"
                      value={formData.loaiXe}
                      onChange={(e) => setFormData({ ...formData, loaiXe: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Tải trọng (Tấn)</label>
                    <input
                      type="number"
                      value={formData.taiTrong}
                      onChange={(e) => setFormData({ ...formData, taiTrong: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Trạng thái</label>
                    <select
                      value={formData.trangThai}
                      onChange={(e) =>
                        setFormData({ ...formData, trangThai: e.target.value as VehicleStatus })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SanSang">Sẵn sàng</option>
                      <option value="DangVanChuyen">Đang vận chuyển</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Vị trí đỗ xe *</label>
                    <input
                      type="text"
                      value={formData.viTriDo}
                      onChange={(e) => setFormData({ ...formData, viTriDo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleUpdateVehicle}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                      setSelectedVehicle(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}