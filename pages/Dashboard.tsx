import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import NotebookGrid from '@/components/dashboard/NotebookGrid';
import EmptyDashboard from '@/components/dashboard/EmptyDashboard';
import { useNotebooks } from '@/hooks/useNotebooks';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { notebooks, isLoading, error, isError } = useNotebooks();
  const hasNotebooks = notebooks && notebooks.length > 0;
  const { t } = useTranslation();

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium text-gray-900 mb-2">{t('dashboard.welcome')}</h1>
          </div>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  // Show auth error if present
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium text-gray-900 mb-2">{t('dashboard.welcome')}</h1>
          </div>
          <div className="text-center py-16">
            <p className="text-red-600">{t('dashboard.authError')}: {authError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('dashboard.retry')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show notebooks loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium text-gray-900 mb-2">{t('dashboard.welcome')}</h1>
          </div>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('dashboard.loadingNotebooks')}</p>
          </div>
        </main>
      </div>
    );
  }

  // Show notebooks error if present
  if (isError && error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader userEmail={user?.email} />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-medium text-gray-900 mb-2">{t('dashboard.welcome')}</h1>
          </div>
          <div className="text-center py-16">
            <p className="text-red-600">{t('dashboard.loadError')}: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('dashboard.retry')}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader userEmail={user?.email} />
      
      <main className="max-w-7xl mx-auto px-6 py-[60px]">
        <div className="mb-8">
          <h1 className="font-medium text-gray-900 mb-2 text-5xl">{t('dashboard.welcome')}</h1>
        </div>

        {hasNotebooks ? <NotebookGrid /> : <EmptyDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;