import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { dir } = useLanguage();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting sign in for:', email);
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error(t('auth.invalidCredentials'));
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error(t('auth.emailNotConfirmed'));
        } else {
          throw error;
        }
      }
      
      console.log('Sign in successful:', data.user?.email);
      
      toast({
        title: t('auth.welcomeBack'),
        description: t('auth.loginSuccess'),
      });

      // The AuthContext will handle the redirect automatically
      
    } catch (error: any) {
      console.error('Auth form error:', error);
      toast({
        title: t('auth.loginTitle'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t('auth.signupTitle'),
        description: t('auth.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('auth.signupTitle'), 
        description: t('auth.passwordTooShort'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting sign up for:', email);
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('User already registered')) {
          throw new Error(t('auth.userExists'));
        } else {
          throw error;
        }
      }
      
      console.log('Sign up successful:', data.user?.email);
      
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: t('auth.signupSuccess'),
          description: t('auth.signupSuccessMessage'),
        });
        setActiveTab('signin');
      }
      
    } catch (error: any) {
      console.error('Auth form error:', error);
      toast({
        title: t('auth.signupTitle'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">{t('auth.loginTitle')}</TabsTrigger>
          <TabsTrigger value="signup">{t('auth.signupTitle')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <CardHeader>
            <CardTitle>{t('auth.loginTitle')}</CardTitle>
            <CardDescription>
              {t('auth.loginDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.passwordPlaceholder')}
                  minLength={6}
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                {loading ? t('auth.loggingIn') : t('auth.loginButton')}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="signup">
          <CardHeader>
            <CardTitle>{t('auth.signupTitle')}</CardTitle>
            <CardDescription>
              {t('auth.signupDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder={t('auth.fullNamePlaceholder')}
                  dir={dir}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">{t('auth.email')}</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">{t('auth.password')}</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.createPasswordPlaceholder')}
                  minLength={6}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  minLength={6}
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                {loading ? t('auth.signingUp') : t('auth.signupButton')}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;