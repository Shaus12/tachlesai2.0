import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Clock, BookOpen, Headphones, FileText, Video, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/ui/Logo';
import LanguageSelector from '@/components/LanguageSelector';

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size="md" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('common.appName')}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                {t('common.login')}
              </Button>
              <Button onClick={handleGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {t('common.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Pain Point Header */}
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
              <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">
                ❌ {t('landing.hero.painHeader')}
              </h1>
              <p className="text-xl text-red-600 mb-4">
                <strong>{t('landing.hero.painSubheader')}</strong>
              </p>
              <div className="bg-white p-4 rounded-lg border-r-4 border-blue-500">
                <p className="text-lg font-semibold text-gray-800">
                  <strong>{t('landing.hero.painCallout')}</strong>
                </p>
              </div>
            </div>

            {/* Main Value Prop */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('landing.hero.mainTitle')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('landing.hero.mainDesc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
              >
                {t('landing.hero.startFreeButton')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-4 border-2"
              >
                {t('landing.hero.watchDemoButton')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            🎯 {t('landing.painPoints.title')}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {t('landing.painPoints.items', { returnObjects: true }).map((item: any, index: number) => (
              <Card key={index} className="p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    {index === 0 ? <Clock className="h-8 w-8 text-red-500" /> :
                     index === 1 ? <BookOpen className="h-8 w-8 text-red-500" /> :
                     index === 2 ? <FileText className="h-8 w-8 text-red-500" /> :
                     <Users className="h-8 w-8 text-red-500" />}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.pain}</h4>
                      <p className="text-gray-600">{item.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Empathy Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-8 text-gray-900">
            🤝 {t('landing.empathy.title')}
          </h3>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('landing.empathy.desc1')}
            </p>
            <p className="text-xl font-semibold text-blue-600">
              <strong>{t('common.appName')}</strong> {t('landing.empathy.desc2')}
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            🚀 {t('landing.results.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t('landing.results.stats', { returnObjects: true }).map((item: any, index: number) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{item.stat}</div>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {t('landing.solution.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t('landing.solution.features', { returnObjects: true }).map((feature: any, index: number) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="mb-4 flex justify-center">
                    {index === 0 ? <Globe className="h-12 w-12 text-blue-600" /> :
                     index === 1 ? <FileText className="h-12 w-12 text-green-600" /> :
                     index === 2 ? <Headphones className="h-12 w-12 text-purple-600" /> :
                     <BookOpen className="h-12 w-12 text-orange-600" />}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
              <p className="text-lg text-gray-700">
                <strong>{t('landing.solution.feelingDesc')}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {t('landing.howItWorks.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {t('landing.howItWorks.steps', { returnObjects: true }).map((step: any, index: number) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-4 text-gray-900">
            💳 {t('landing.pricing.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {t('landing.pricing.plans', { returnObjects: true }).map((plan: any, index: number) => (
              <Card key={index} className={`p-6 ${index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''} hover:shadow-lg transition-all`}>
                <CardContent className="p-0">
                  {index === 1 && (
                    <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg mb-4 font-semibold">
                      {t('landing.pricing.mostPopular')}
                    </div>
                  )}
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-gray-600 mb-4">{plan.suitable}</p>
                  <div className="text-3xl font-bold text-blue-600 mb-6">{plan.price}</div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${index === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    onClick={handleGetStarted}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">
            {t('landing.pricing.disclaimer')}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            ❓ {t('landing.faq.title')}
          </h3>
          <div className="space-y-6">
            {t('landing.faq.questions', { returnObjects: true }).map((faq: any, index: number) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            ⏱️ {t('landing.cta.title')}
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            {t('landing.cta.desc')}
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
          >
            {t('landing.cta.buttonText')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <Logo size="md" />
            <span className="text-2xl font-bold">{t('common.appName')}</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 {t('common.appName')}. {t('landing.footer.copyright')}</p>
            <p className="mt-2">{t('landing.footer.tagline')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;