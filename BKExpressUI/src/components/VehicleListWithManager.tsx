import { useState, useEffect } from 'react';
import { Search, User, Phone, Filter, ArrowUpDown, Truck } from 'lucide-react';

// Định nghĩa kiểu dữ liệu khớp với kết quả trả về từ API /list-manager
type VehicleWithManager = {
  bien_so_xe: string;
  loai_xe: string;
  tai_trong_tan: number;
  trang_thai: string;
  vi_tri_do: string;
  ten_quan_ly: string | null;
  sdt_quan_ly: string | null;
};

export function VehicleListWithManager() {
  const [vehicles, setVehicles] = useState<VehicleWithManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho bộ lọc
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('BienSo'); // 'BienSo' hoặc 'TaiTrong'

  const API_URL = 'http://localhost:8080/api/vehicles';

  useEffect(() => {
    fetchVehicles();
  }, [filterStatus, sortBy]); // Tự động gọi lại API khi filter/sort thay đổi

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // Xây dựng Query Param
      const params = new URLSearchParams();
      if (filterStatus) params.append('trangThai', filterStatus);
      params.append('sapXep', sortBy);

      const response = await fetch(`${API_URL}/list-manager?${params.toString()}`);

      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    SanSang: 'bg-green-100 text-green-700',
    DangVanChuyen: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Danh Sách Xe & Quản Lý</h2>
      </div>

      {/* Toolbar: Filter & Sort */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="SanSang">Sẵn sàng</option>
            <option value="DangVanChuyen">Đang vận chuyển</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-gray-500" />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="BienSo">Sắp xếp theo Biển số</option>
            <option value="TaiTrong">Sắp xếp theo Tải trọng</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Table */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((v) => (
                <tr key={v.bien_so_xe} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{v.bien_so_xe}</td>
                  <td className="px-6 py-4 text-gray-600">{v.loai_xe}</td>
                  <td className="px-6 py-4 text-gray-600">{v.tai_trong_tan} tấn</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[v.trang_thai] || 'bg-gray-100'}`}>
                      {v.trang_thai}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      {v.ten_quan_ly || <span className="text-gray-400 italic">Chưa phân công</span>}
                    </div>
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
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}