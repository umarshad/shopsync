import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useConfigStore } from '../../store/configStore';
import { syncService } from '../../lib/sync';
import WhiteLabelConfig from './WhiteLabelConfig';
import BackupRestore from './BackupRestore';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout, profile } = useAuthStore();
  const { config, updateConfig } = useConfigStore();
  const [activeTab, setActiveTab] = useState<'general' | 'white-label' | 'backup' | 'sync'>('general');
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const handleLanguageChange = async (lang: 'en' | 'ur') => {
    await updateConfig({ language: lang });
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleManualSync = async () => {
    await syncService.manualSync();
    const status = await syncService.getSyncStatus();
    setSyncStatus(status);
  };

  const loadSyncStatus = async () => {
    const status = await syncService.getSyncStatus();
    setSyncStatus(status);
  };

  useEffect(() => {
    loadSyncStatus();
    const interval = setInterval(loadSyncStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'general' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('settings.title')}
            </button>
            <button
              onClick={() => setActiveTab('white-label')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'white-label' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('settings.whiteLabel')}
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'sync' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('sync.title')}
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === 'backup' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('settings.backup')}
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('settings.title')}</h2>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.language')}
                </label>
                <select
                  value={config.language}
                  onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'ur')}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                </select>
              </div>

              {/* Profile Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.profile')}
                </label>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Shop:</strong> {profile?.shop_name || '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Role:</strong> {profile?.role || '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {profile?.id || '-'}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {t('auth.logout')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'white-label' && <WhiteLabelConfig />}

          {activeTab === 'sync' && (
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('sync.title')}</h2>

              {syncStatus && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-700">
                      {syncStatus.isOnline ? t('sync.online') : t('sync.offline')}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>{t('sync.queueLength')}:</strong> {syncStatus.queueLength}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>{t('sync.lastSync')}:</strong>{' '}
                      {syncStatus.lastSync
                        ? new Date(syncStatus.lastSync).toLocaleString()
                        : t('sync.pending')}
                    </p>
                  </div>

                  <button
                    onClick={handleManualSync}
                    disabled={!syncStatus.isOnline || syncStatus.isSyncing}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {syncStatus.isSyncing ? t('sync.syncing') : t('sync.syncNow')}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'backup' && <BackupRestore />}
        </div>
      </div>
    </div>
  );
}

