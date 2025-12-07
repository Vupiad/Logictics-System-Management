import { useState } from 'react';
import { Users, Package, Truck, UserCog, BarChart3 } from 'lucide-react'; // Thêm icon mới
// import { EmployeeManagement } from './components/EmployeeManagement';
// import { WarehouseManagement } from './components/WarehouseManagement';
import { VehicleManagement } from './components/VehicleManagement';
// Import 2 component mới
import { VehicleListWithManager } from './components/VehicleListWithManager';
import { ManagerDashboard } from './components/ManagerDashboard';

// Cập nhật kiểu Screen
type Screen = 'vehicles' | 'vehicles-manager' | 'manager-dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('vehicles');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-blue-600">Hệ Thống Quản Lý Kho Vận BKExpress</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setCurrentScreen('employees')}
              className={`flex items-center gap-2 px-4 py-4 transition-colors whitespace-nowrap border-b-2 font-medium ${
                currentScreen === 'employees'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              Nhân Viên
            </button>

            <button
              onClick={() => setCurrentScreen('warehouse')}
              className={`flex items-center gap-2 px-4 py-4 transition-colors whitespace-nowrap border-b-2 font-medium ${
                currentScreen === 'warehouse'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Package className="w-5 h-5" />
              Kho Hàng
            </button>

            <button
              onClick={() => setCurrentScreen('vehicles')}
              className={`flex items-center gap-2 px-4 py-4 transition-colors whitespace-nowrap border-b-2 font-medium ${
                currentScreen === 'vehicles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Truck className="w-5 h-5" />
              Phương Tiện (CRUD)
            </button>

            {/* --- 2 Màn hình mới --- */}
            <button
              onClick={() => setCurrentScreen('vehicles-manager')}
              className={`flex items-center gap-2 px-4 py-4 transition-colors whitespace-nowrap border-b-2 font-medium ${
                currentScreen === 'vehicles-manager'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <UserCog className="w-5 h-5" />
              Xe & Quản Lý
            </button>

            <button
              onClick={() => setCurrentScreen('manager-dashboard')}
              className={`flex items-center gap-2 px-4 py-4 transition-colors whitespace-nowrap border-b-2 font-medium ${
                currentScreen === 'manager-dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Báo Cáo
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {currentScreen === 'vehicles' && <VehicleManagement />}

        {/* Render 2 component mới */}
        {currentScreen === 'vehicles-manager' && <VehicleListWithManager />}
        {currentScreen === 'manager-dashboard' && <ManagerDashboard />}
      </main>
    </div>
  );
}