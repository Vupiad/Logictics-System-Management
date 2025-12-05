import { useState } from 'react';
import { Plus, Search, Package, Send, MapPin, User } from 'lucide-react';

type PaymentMethod = 'sender_cash' | 'receiver_cash';
type PaymentStatus = 'paid' | 'unpaid';
type OrderStatus = 'pending' | 'in_warehouse' | 'in_transit' | 'delivered';

type Good = {
  id: string;
  name: string;
  note: string;
  orderId: string;
  weight: number;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  destinationProvince: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  warehouse?: string;
  createdAt: string;
};

type Shipment = {
  id: string;
  destinationProvince: string;
  goods: Good[];
  driver: WarehouseEmployee | null;
  vehicle: Vehicle | null;
  warehouseSend: string; // Kho gửi
  warehouseReceive: string; // Kho nhận
  provinceSend: string; // Tỉnh gửi
  provinceReceive: string; // Tỉnh nhận
  createdAt: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'completed';
};

type WarehouseEmployee = {
  id: string;
  name: string;
  phone: string;
  warehouse: string;
};

type Vehicle = {
  id: string;
  licensePlate: string;
  type: string;
  capacity: number;
  parkingLocation: string; // Vị trí đỗ xe (tại kho nào)
};

const warehouses = ['Kho Hà Nội', 'Kho Hồ Chí Minh', 'Kho Đà Nẵng', 'Kho Cần Thơ'];
const provinces = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nghệ An',
  'Thanh Hóa',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
];

// Mock data - thông tin từ database
const mockGoodsDatabase: Record<string, Good> = {
  'HH001': {
    id: 'HH001',
    name: 'Điện thoại Samsung Galaxy S23',
    note: 'Hàng điện tử, cần cẩn thận',
    orderId: 'ORD001',
    weight: 2,
    senderName: 'Nguyễn Văn A',
    senderAddress: '123 Trần Hưng Đạo, Hà Nội',
    senderPhone: '0901111111',
    receiverName: 'Trần Thị B',
    receiverAddress: '456 Nguyễn Huệ, Q.1, TP.HCM',
    receiverPhone: '0902222222',
    destinationProvince: 'Hồ Chí Minh',
    paymentMethod: 'sender_cash',
    paymentStatus: 'paid',
    orderStatus: 'pending',
    createdAt: '2024-11-28',
  },
  'HH002': {
    id: 'HH002',
    name: 'Laptop Dell XPS 15',
    note: 'Hàng điện tử',
    orderId: 'ORD002',
    weight: 3,
    senderName: 'Phạm Văn C',
    senderAddress: '789 Lê Lợi, Hà Nội',
    senderPhone: '0903333333',
    receiverName: 'Lê Thị D',
    receiverAddress: '321 Lê Lợi, Q.1, TP.HCM',
    receiverPhone: '0904444444',
    destinationProvince: 'Hồ Chí Minh',
    paymentMethod: 'receiver_cash',
    paymentStatus: 'unpaid',
    orderStatus: 'pending',
    createdAt: '2024-11-29',
  },
  'HH003': {
    id: 'HH003',
    name: 'Máy ảnh Canon EOS R5',
    note: 'Hàng dễ vỡ',
    orderId: 'ORD003',
    weight: 1.5,
    senderName: 'Hoàng Văn E',
    senderAddress: '555 Nguyễn Trãi, Hà Nội',
    senderPhone: '0905555555',
    receiverName: 'Vũ Thị F',
    receiverAddress: '888 Trần Phú, Đà Nẵng',
    receiverPhone: '0906666666',
    destinationProvince: 'Đà Nẵng',
    paymentMethod: 'sender_cash',
    paymentStatus: 'paid',
    orderStatus: 'pending',
    createdAt: '2024-11-30',
  },
};

const mockWarehouseEmployees: WarehouseEmployee[] = [
  { id: 'NV001', name: 'Trần Thị Bình', phone: '0912345678', warehouse: 'Kho Hà Nội' },
  { id: 'NV002', name: 'Nguyễn Văn Hải', phone: '0923456789', warehouse: 'Kho Hồ Chí Minh' },
  { id: 'NV003', name: 'Lê Thị Mai', phone: '0934567890', warehouse: 'Kho Đà Nẵng' },
];

const mockDrivers: WarehouseEmployee[] = [
  { id: 'NV010', name: 'Lê Văn Cường', phone: '0923456789', warehouse: 'Kho Hà Nội' },
  { id: 'NV011', name: 'Phạm Thị Dung', phone: '0934567890', warehouse: 'Kho Hồ Chí Minh' },
];

const mockVehicles: Vehicle[] = [
  { id: '1', licensePlate: '51A-12345', type: 'Xe tải 5 tấn', capacity: 5000, parkingLocation: 'Kho Hà Nội' },
  { id: '2', licensePlate: '59B-67890', type: 'Xe tải 10 tấn', capacity: 10000, parkingLocation: 'Kho Hồ Chí Minh' },
  { id: '3', licensePlate: '30C-11111', type: 'Xe tải 3 tấn', capacity: 3000, parkingLocation: 'Kho Đà Nẵng' },
];

export function WarehouseManagement() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedGoods, setSelectedGoods] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [warehouseSend, setWarehouseSend] = useState<string>('');
  const [warehouseReceive, setWarehouseReceive] = useState<string>('');

  const [importData, setImportData] = useState({
    goodId: '',
    employeeId: '',
  });

  const paymentMethodLabels: Record<PaymentMethod, string> = {
    sender_cash: 'Người gửi trả tiền mặt',
    receiver_cash: 'Người nhận trả tiền mặt',
  };

  const paymentStatusLabels: Record<PaymentStatus, string> = {
    paid: 'Đã thanh toán',
    unpaid: 'Chưa thanh toán',
  };

  const orderStatusLabels: Record<OrderStatus, string> = {
    pending: 'Chờ nhập kho',
    in_warehouse: 'Trong kho',
    in_transit: 'Đang vận chuyển',
    delivered: 'Đã giao',
  };

  const filteredGoods = goods.filter(
    (good) =>
      good.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      good.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      good.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      good.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      good.destinationProvince.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImportGood = () => {
    const { goodId, employeeId } = importData;

    if (!goodId || !employeeId) {
      alert('Vui lòng nhập đầy đủ mã hàng và mã nhân viên!');
      return;
    }

    // Lấy thông tin hàng hóa từ database
    const goodInfo = mockGoodsDatabase[goodId];
    if (!goodInfo) {
      alert('Không tìm thấy hàng hóa với mã này trong hệ thống!');
      return;
    }

    // Lấy thông tin nhân viên
    const employee = mockWarehouseEmployees.find((emp) => emp.id === employeeId);
    if (!employee) {
      alert('Không tìm thấy nhân viên với mã này!');
      return;
    }

    // Kiểm tra xem hàng đã được nhập chưa
    if (goods.find((g) => g.id === goodId)) {
      alert('Hàng hóa này đã được nhập vào kho!');
      return;
    }

    // Cập nhật trạng thái đơn hàng và thêm thông tin kho
    const updatedGood: Good = {
      ...goodInfo,
      orderStatus: 'in_warehouse',
      warehouse: employee.warehouse,
    };

    setGoods([...goods, updatedGood]);
    alert(`Đã nhập hàng ${goodId} vào ${employee.warehouse} thành công!`);
    setShowImportModal(false);
    setImportData({ goodId: '', employeeId: '' });
  };

  const openShipmentModal = () => {
    setShowShipmentModal(true);
    setSelectedProvince('');
    setSelectedGoods([]);
    setSelectedDriver('');
    setSelectedVehicle('');
    setWarehouseSend('');
    setWarehouseReceive('');
  };

  const getGoodsForProvince = () => {
    if (!selectedProvince) return [];
    return goods.filter(
      (g) => g.destinationProvince === selectedProvince && g.orderStatus === 'in_warehouse'
    );
  };

  const handleCreateShipment = () => {
    if (!selectedProvince || selectedGoods.length === 0 || !selectedDriver || !selectedVehicle || !warehouseSend || !warehouseReceive) {
      alert('Vui lòng điền đầy đủ thông tin chuyến hàng');
      return;
    }

    const driver = mockDrivers.find((d) => d.id === selectedDriver) || null;
    const vehicle = mockVehicles.find((v) => v.id === selectedVehicle) || null;
    const shipmentGoods = goods.filter((g) => selectedGoods.includes(g.id));

    // Lấy tỉnh từ tên kho
    const getProvinceFromWarehouse = (warehouse: string) => {
      if (warehouse.includes('Hà Nội')) return 'Hà Nội';
      if (warehouse.includes('Hồ Chí Minh')) return 'Hồ Chí Minh';
      if (warehouse.includes('Đà Nẵng')) return 'Đà Nẵng';
      if (warehouse.includes('Cần Thơ')) return 'Cần Thơ';
      return '';
    };

    const newShipment: Shipment = {
      id: `SHP${String(shipments.length + 1).padStart(3, '0')}`,
      destinationProvince: selectedProvince,
      goods: shipmentGoods,
      driver,
      vehicle,
      warehouseSend: warehouseSend,
      warehouseReceive: warehouseReceive,
      provinceSend: getProvinceFromWarehouse(warehouseSend),
      provinceReceive: selectedProvince,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'assigned',
    };

    setShipments([...shipments, newShipment]);

    // Cập nhật trạng thái hàng hóa
    setGoods(
      goods.map((g) =>
        selectedGoods.includes(g.id) ? { ...g, orderStatus: 'in_transit' as OrderStatus } : g
      )
    );

    setShowShipmentModal(false);
  };

  const toggleGoodSelection = (goodId: string) => {
    setSelectedGoods((prev) =>
      prev.includes(goodId) ? prev.filter((id) => id !== goodId) : [...prev, goodId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Quản Lý Kho</h2>
        <div className="flex gap-3">
          <button
            onClick={openShipmentModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="w-5 h-5" />
            Xuất Chuyến Hàng Liên Tỉnh
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nhập Hàng Vào Kho
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hàng, tên, mã đơn, người nhận, tỉnh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Goods Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">Mã Hàng</th>
              <th className="px-4 py-3 text-left text-gray-700">Tên Hàng</th>
              <th className="px-4 py-3 text-left text-gray-700">Mã Đơn</th>
              <th className="px-4 py-3 text-left text-gray-700">Khối Lượng</th>
              <th className="px-4 py-3 text-left text-gray-700">Người Gửi</th>
              <th className="px-4 py-3 text-left text-gray-700">Người Nhận</th>
              <th className="px-4 py-3 text-left text-gray-700">Thanh Toán</th>
              <th className="px-4 py-3 text-left text-gray-700">Trạng Thái Đơn</th>
              <th className="px-4 py-3 text-left text-gray-700">Kho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredGoods.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  Chưa có hàng hóa nào trong kho. Nhấn "Nhập Hàng Vào Kho" để thêm.
                </td>
              </tr>
            ) : (
              filteredGoods.map((good) => (
                <tr key={good.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-900">{good.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-gray-900">{good.name}</div>
                        <div className="text-gray-500">{good.note}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{good.orderId}</td>
                  <td className="px-4 py-4 text-gray-700">{good.weight} kg</td>
                  <td className="px-4 py-4">
                    <div className="text-gray-900">{good.senderName}</div>
                    <div className="text-gray-500">{good.senderPhone}</div>
                    <div className="text-gray-500">{good.senderAddress}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-gray-900">{good.receiverName}</div>
                    <div className="text-gray-500">{good.receiverPhone}</div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {good.receiverAddress}
                    </div>
                    <div className="text-gray-500">{good.destinationProvince}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-gray-700">{paymentMethodLabels[good.paymentMethod]}</div>
                    <span
                      className={`inline-flex px-2 py-1 rounded mt-1 ${
                        good.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {paymentStatusLabels[good.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded ${
                        good.orderStatus === 'pending'
                          ? 'bg-gray-100 text-gray-700'
                          : good.orderStatus === 'in_warehouse'
                          ? 'bg-blue-100 text-blue-700'
                          : good.orderStatus === 'in_transit'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {orderStatusLabels[good.orderStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{good.warehouse || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Shipments Section */}
      {shipments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-gray-900 mb-4">Chuyến Hàng Liên Tỉnh</h3>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-gray-900">
                      Chuyến {shipment.id} - {shipment.destinationProvince}
                    </h4>
                    <p className="text-gray-500">Ngày tạo: {shipment.createdAt}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded">
                    {shipment.status === 'assigned' ? 'Đã gán tài xế' : shipment.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Kho gửi → Kho nhận:</p>
                    <p className="text-gray-900">
                      {shipment.warehouseSend} ({shipment.provinceSend}) → {shipment.warehouseReceive} ({shipment.provinceReceive})
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phương tiện:</p>
                    <p className="text-gray-900">
                      {shipment.vehicle?.licensePlate} - {shipment.vehicle?.type}
                    </p>
                    <p className="text-gray-500">Đỗ tại: {shipment.vehicle?.parkingLocation}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">Tài xế:</p>
                  <p className="text-gray-900">
                    {shipment.driver?.name} - {shipment.driver?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Hàng hóa ({shipment.goods.length} kiện):</p>
                  <div className="space-y-1">
                    {shipment.goods.map((good) => (
                      <div
                        key={good.id}
                        className="flex justify-between text-gray-700 bg-gray-50 px-3 py-2 rounded"
                      >
                        <span>
                          {good.id} - {good.name} - {good.receiverName}
                        </span>
                        <span>{good.weight} kg</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import Good Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Nhập Hàng Hóa Vào Kho</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Mã hàng hóa</label>
                <input
                  type="text"
                  value={importData.goodId}
                  onChange={(e) => setImportData({ ...importData, goodId: e.target.value.toUpperCase() })}
                  placeholder="VD: HH001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-gray-500 mt-1">
                  Mã hàng có sẵn: HH001, HH002, HH003
                </p>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Mã nhân viên kho</label>
                <select
                  value={importData.employeeId}
                  onChange={(e) => setImportData({ ...importData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {mockWarehouseEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} - {emp.name} ({emp.warehouse})
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-900">
                  <strong>Lưu ý:</strong> Khi nhập mã hàng, hệ thống sẽ tự động lấy thông tin chi tiết từ database và cập nhật trạng thái đơn hàng tương ứng với kho của nhân viên nhập hàng.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleImportGood}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nhập H��ng
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData({ goodId: '', employeeId: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Shipment Modal */}
      {showShipmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-gray-900 mb-4">Tạo Chuyến Hàng Liên Tỉnh</h3>

            {/* Province Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Chọn tỉnh đích</label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedGoods([]);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn tỉnh --</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Warehouse Send/Receive */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Kho gửi</label>
                <select
                  value={warehouseSend}
                  onChange={(e) => setWarehouseSend(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn kho gửi --</option>
                  {warehouses.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Kho nhận</label>
                <select
                  value={warehouseReceive}
                  onChange={(e) => setWarehouseReceive(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Chọn kho nhận --</option>
                  {warehouses.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Goods Selection */}
            {selectedProvince && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Chọn hàng hóa (Tỉnh: {selectedProvince})
                </label>
                <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                  {getGoodsForProvince().length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">
                      Không có hàng hóa nào cho tỉnh này
                    </p>
                  ) : (
                    getGoodsForProvince().map((good) => (
                      <label
                        key={good.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGoods.includes(good.id)}
                          onChange={() => toggleGoodSelection(good.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="text-gray-900">
                            {good.id} - {good.name}
                          </div>
                          <div className="text-gray-500">
                            {good.orderId} • {good.weight} kg • {good.receiverName} • {good.receiverAddress}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Driver Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Chọn tài xế liên tỉnh</label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn tài xế --</option>
                {mockDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} - {driver.phone} ({driver.warehouse})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Chọn phương tiện</label>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Chọn xe --</option>
                {mockVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.licensePlate} - {vehicle.type} ({vehicle.capacity} kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Summary */}
            {selectedGoods.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-900">Tổng số kiện: {selectedGoods.length}</p>
                <p className="text-gray-900">
                  Tổng khối lượng:{' '}
                  {goods
                    .filter((g) => selectedGoods.includes(g.id))
                    .reduce((sum, g) => sum + g.weight, 0)}{' '}
                  kg
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCreateShipment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Tạo Chuyến Hàng
              </button>
              <button
                onClick={() => setShowShipmentModal(false)}
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