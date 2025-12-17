import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, FileText, Image, Settings, LogOut, Globe, Map } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout, settings } = useApp();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Image },
    { name: 'Destinations', path: '/admin/destinations', icon: Map },
    { name: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1a1a1a] text-gray-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-heading text-white font-bold">{settings.siteName}</h1>
        <p className="text-xs text-gray-500 mt-1">Admin Control Panel</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-800'}`}
            >
              <Icon size={18} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <a href="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:text-white transition-colors mb-2">
            <Globe size={18} />
            <span>View Website</span>
        </a>
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export const AdminHeader: React.FC<{ title: string, action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
    <h2 className="text-3xl font-heading font-bold text-gray-800">{title}</h2>
    {action}
  </div>
);