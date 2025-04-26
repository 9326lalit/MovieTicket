// app/dashboard/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Video, Theater, CalendarPlus, Users,BookIcon } from 'lucide-react';
import { cn } from '../lib/utils';

const links = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Create Movie', icon: Video, path: '/dashboard/createmovie' },
  { title: 'Create Show', icon: CalendarPlus, path: '/dashboard/createshow' },
  { title: 'Create Theater', icon: Theater, path: '/dashboard/createtheater' },
  { title: 'Manage Shows', icon: LayoutDashboard, path: '/dashboard/manageshows' },
  { title: 'Bookings', icon: BookIcon, path: '/dashboard/bookings' },
  { title: 'Users', icon: Users, path: '/dashboard/users' }
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r h-full p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map(({ title, icon: Icon, path }) => (
          <NavLink
            key={title}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive ? ' text-black' : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <Icon className="h-4 w-4 mr-3" />
            {title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
