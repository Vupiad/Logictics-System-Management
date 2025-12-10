import { useState, useEffect } from 'react';
import { Search, Phone, Filter, ArrowUpDown, Plus, Edit, X, Save, Trash2 } from 'lucide-react';

type VehicleWithManager = {
  bien_so_xe: string;
  loai_xe: string;
  tai_trong_tan: number;
  trang_thai: string;
  vi_tri_do: string;
  ten_quan_ly: string | null;
  sdt_quan_ly: string | null;
  cccd_quan_ly: string | null;
};

type Manager = {
  cccd: string;
  hoTen: string;
};

export function VehicleListWithManager() {
  const [vehicles, setVehicles] = useState<VehicleWithManager[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('BienSo');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bienSoXe: '',
    loaiXe: '',
    taiTrong: 0,
    trangThai: 'SanSang',
    viTriDo: '',
    cccdQuanLy: ''
  });

  const API_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchVehicles();
    fetchManagers();
  }, [filterStatus, sortBy]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('trangThai', filterStatus);
      params.append('sapXep', sortBy);

      const response = await fetch(`${API_URL}/vehicles/list-manager?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch(`${API_URL}/employees/ql-lien-tinh`);
      if (response.ok) {
        const data = await response.json();
        setManagers(data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách quản lý", err);
    }
  };

  // --- LOGIC XÓA ---
  const handleDelete = async (bienSoXe: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa xe ${bienSoXe} không?`)) return;

    try {
      // Gọi API xóa (sử dụng API Delete đã viết trước đó)
      const response = await fetch(`${API_URL}/vehicles/${bienSoXe}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Xóa thất bại');
      }

      alert('Xóa thành công!');
      fetchVehicles(); // Load lại danh sách
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa');
    }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.bien_so_xe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.ten_quan_ly && v.ten_quan_ly.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormData({
      bienSoXe: '', loaiXe: '', taiTrong: 0, trangThai: 'SanSang', viTriDo: '', cccdQuanLy: ''
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: VehicleWithManager) => {
    setFormData({
      bienSoXe: v.bien_so_xe,
      loaiXe: v.loai_xe,
      taiTrong: v.tai_trong_tan,
      trangThai: v.trang_thai,
      viTriDo: v.vi_tri_do,
      cccdQuanLy: v.cccd_quan_ly || ''
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const vehiclePayload = {
        bienSoXe: formData.bienSoXe,
        loaiXe: formData.loaiXe,
        taiTrongTan: formData.taiTrong,
        trangThai: formData.trangThai,
        viTriDo: formData.viTriDo
      };

      let url = `${API_URL}/vehicles`;
      let method = 'POST';

      if (isEditMode) {
        url = `${API_URL}/vehicles/${formData.bienSoXe}`;
        method = 'PUT';
      }

      const resXe = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehiclePayload)
      });

      if (!resXe.ok) throw new Error("Lỗi khi lưu thông tin xe");

      // Logic gán quản lý (Tạm thời thông báo nhắc nhở nếu chưa có API gán)
      const assignPayload = {
                  bienSoXe: formData.bienSoXe,
                  cccdQuanLy: formData.cccdQuanLy
              };

              const resAssign = await fetch(`${API_URL}/vehicles/assign-manager`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(assignPayload)
              });

              if (!resAssign.ok) {
                  console.warn("Lưu xe thành công nhưng lỗi khi gán quản lý");
              }

              // 3. Hoàn tất
              alert(`Đã ${isEditMode ? 'cập nhật' : 'thêm'} xe và phân công quản lý thành công!`);
              setIsModalOpen(false);
              fetchVehicles(); // Load lại danh sách để thấy tên quản lý mới
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  };

  const statusColors: Record<string, string> = {
    SanSang: 'bg-green-100 text-green-700',
    DangVanChuyen: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Danh Sách Xe & Quản Lý</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Xe Mới
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm biển số hoặc tên quản lý..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SanSang">Sẵn sàng</option>
              <option value="DangVanChuyen">Đang vận chuyển</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="BienSo">Sắp xếp: Biển số</option>
            <option value="TaiTrong">Sắp xếp: Tải trọng</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Biển Số</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Loại Xe</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Tải Trọng</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Người Quản Lý</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">SĐT Quản Lý</th>
                <th className="px-6 py-3 text-center text-gray-700 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVehicles.map((v) => (
                <tr key={v.bien_so_xe} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{v.bien_so_xe}</td>
                  <td className="px-6 py-4 text-gray-600">{v.loai_xe}</td>
                  <td className="px-6 py-4 text-gray-600">{v.tai_trong_tan} tấn</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[v.trang_thai] || 'bg-gray-100'}`}>
                      {v.trang_thai}
                    </span>
                  </td>
                  {/* Cột Người Quản Lý - Chỉ hiện tên Text */}
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {v.ten_quan_ly || <span className="text-gray-400 font-normal italic">Chưa phân công</span>}
                  </td>
                  <td className="px-6 py-4">
                    {v.sdt_quan_ly ? (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {v.sdt_quan_ly}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  {/* Cột Thao Tác - Thêm nút xóa */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(v)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                        title="Sửa thông tin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(v.bien_so_xe)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                        title="Xóa phương tiện"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Thêm/Sửa - Đã thu nhỏ chiều rộng (max-w-md) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Changed max-w-lg to max-w-md */}
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Cập Nhật Xe' : 'Thêm Xe Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label>
                <input
                  type="text"
                  disabled={isEditMode}
                  value={formData.bienSoXe}
                  onChange={e => setFormData({...formData, bienSoXe: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="VD: 29C-12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                <input
                  type="text"
                  value={formData.loaiXe}
                  onChange={e => setFormData({...formData, loaiXe: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Xe tải 5 tấn"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tải trọng (tấn)</label>
                  <input
                    type="number"
                    value={formData.taiTrong}
                    onChange={e => setFormData({...formData, taiTrong: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={formData.trangThai}
                    onChange={e => setFormData({...formData, trangThai: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SanSang">Sẵn sàng</option>
                    <option value="DangVanChuyen">Đang vận chuyển</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí đỗ</label>
                <input
                  type="text"
                  value={formData.viTriDo}
                  onChange={e => setFormData({...formData, viTriDo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Kho Hà Nội"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người quản lý</label>
                <select
                  value={formData.cccdQuanLy}
                  onChange={e => setFormData({...formData, cccdQuanLy: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Chưa phân công --</option>
                  {managers.map(mgr => (
                    <option key={mgr.cccd} value={mgr.cccd}>
                      {mgr.hoTen} ({mgr.cccd})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Lưu
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
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