// app/dashboard/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed width, full height, non-scrollable */}
      <div className="w-64 bg-white border-r border-gray-200 fixed top-15 left-0 h-full z-10">
        <Sidebar />
      </div>

      {/* Page Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto top-15 h-screen bg-gray-50">
        <Outlet /> {/* This renders nested routes */}
      </div>
    </div>
  );
};

export default DashboardLayout;
