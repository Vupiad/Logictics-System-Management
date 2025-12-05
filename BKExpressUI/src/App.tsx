import { useState } from 'react';
import { Users, Package, Truck } from 'lucide-react';
import { EmployeeManagement } from './components/EmployeeManagement';
import { WarehouseManagement } from './components/WarehouseManagement';
import { VehicleManagement } from './components/VehicleManagement';

type Screen = 'employees' | 'warehouse' | 'vehicles';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('employees');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-blue-600">Hệ Thống Quản Lý Kho Vận</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentScreen('employees')}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                currentScreen === 'employees'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              Quản Lý Nhân Viên
            </button>
            <button
              onClick={() => setCurrentScreen('warehouse')}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                currentScreen === 'warehouse'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              Quản Lý Kho
            </button>
            <button
              onClick={() => setCurrentScreen('vehicles')}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                currentScreen === 'vehicles'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Truck className="w-5 h-5" />
              Quản Lý Phương Tiện
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentScreen === 'employees' && <EmployeeManagement />}
        {currentScreen === 'warehouse' && <WarehouseManagement />}
        {currentScreen === 'vehicles' && <VehicleManagement />}
      </main>
    </div>
  );
}
