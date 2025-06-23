import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/LanguageSelector';

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        {/* Language selector and back to home button */}
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← {t('common.backToHome')}
          </Button>
          <LanguageSelector />
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t('common.appName')}
          </h1>
          <p className="text-gray-600">{t('common.tagline')}</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;