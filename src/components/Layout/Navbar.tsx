import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { profile } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            to="/pos"
            className={`px-4 py-2 rounded-md ${
              isActive('/pos')
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('pos.title')}
          </Link>
          {(profile?.role === 'manager' || profile?.role === 'owner') && (
            <>
              <Link
                to="/inventory"
                className={`px-4 py-2 rounded-md ${
                  isActive('/inventory')
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('inventory.title')}
              </Link>
              <Link
                to="/reports"
                className={`px-4 py-2 rounded-md ${
                  isActive('/reports')
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('reports.title')}
              </Link>
            </>
          )}
          <Link
            to="/settings"
            className={`px-4 py-2 rounded-md ${
              isActive('/settings')
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('settings.title')}
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {profile?.shop_name || 'Shop'}
          </span>
          <span className="text-sm text-gray-600">
            {profile?.role || 'User'}
          </span>
        </div>
      </div>
    </nav>
  );
}

