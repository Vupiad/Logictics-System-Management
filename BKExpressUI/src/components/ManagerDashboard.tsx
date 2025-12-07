import { useState, useEffect } from 'react';
import { BarChart3, Users, Scale, Search } from 'lucide-react';

// Định nghĩa kiểu dữ liệu trả về từ API /manager-stats
type ManagerStat = {
  CCCD: string;
  ho_ten: string;
  sdt: string;
  so_luong_xe_quan_ly: number;
  tong_tai_trong_doi_xe: number;
};

export function ManagerDashboard() {
  const [stats, setStats] = useState<ManagerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [minQuantity, setMinQuantity] = useState(1); // Mặc định hiển thị người quản lý >= 1 xe

  const API_URL = 'http://localhost:8080/api/vehicles';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Gọi API với tham số min
      const response = await fetch(`${API_URL}/manager-stats?min=${minQuantity}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Báo Cáo Hiệu Suất Quản Lý</h2>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng xe quản lý tối thiểu (HAVING)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={minQuantity}
                onChange={(e) => setMinQuantity(Number(e.target.value))}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors h-[42px]"
          >
            <Search className="w-4 h-4" />
            Xem Báo Cáo
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          * Lọc ra những quản lý đang phụ trách số lượng xe lớn hơn hoặc bằng giá trị nhập vào.
        </p>
      </div>

      {/* Cards Summary (Optional - Tổng quan nhanh) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Số lượng Quản lý</p>
              <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng xe trong danh sách</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.reduce((acc, curr) => acc + curr.so_luong_xe_quan_ly, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng tải trọng đội xe</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.reduce((acc, curr) => acc + curr.tong_tai_trong_doi_xe, 0)} tấn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tính toán số liệu...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Họ Tên Quản Lý</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">CCCD</th>
                <th className="px-6 py-3 text-left text-gray-700 font-medium">Số Điện Thoại</th>
                <th className="px-6 py-3 text-center text-gray-700 font-medium">Số Lượng Xe</th>
                <th className="px-6 py-3 text-right text-gray-700 font-medium">Tổng Tải Trọng (Tấn)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.map((item) => (
                <tr key={item.CCCD} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.ho_ten}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">{item.CCCD}</td>
                  <td className="px-6 py-4 text-gray-600">{item.sdt}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                      {item.so_luong_xe_quan_ly}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {item.tong_tai_trong_doi_xe}
                  </td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không có quản lý nào đạt tiêu chí ( &ge; {minQuantity} xe)
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