import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MultipleWebsiteUrlsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (urls: string[]) => void;
}

const MultipleWebsiteUrlsDialog = ({
  open,
  onOpenChange,
  onSubmit
}: MultipleWebsiteUrlsDialogProps) => {
  const [urlsText, setUrlsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    // Parse URLs from textarea - split by newlines and filter out empty lines
    const urls = urlsText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    if (urls.length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(urls);
      setUrlsText('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting URLs:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUrlsText('');
    onOpenChange(false);
  };

  // Count valid URLs for display
  const validUrls = urlsText
    .split('\n')
    .map(url => url.trim())
    .filter(url => url !== '');
  
  const isValid = validUrls.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5 text-green-600" />
            <span>{t('notebook.sources.addMultipleWebsites')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">{t('notebook.sources.websiteUrls')}</Label>
            <p className="text-sm text-gray-600 mb-3">
              {t('notebook.sources.websiteUrlsDesc')}
            </p>
          </div>

          <div>
            <Textarea
              placeholder={t('notebook.sources.urlsPlaceholder')}
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              className="min-h-32 resize-y"
              rows={6}
              dir="ltr"
            />
            {validUrls.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {t('notebook.sources.urlsDetected', { count: validUrls.length })}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? t('notebook.sources.adding') : t('notebook.sources.addWebsites', { count: validUrls.length })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultipleWebsiteUrlsDialog;