import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Link, Copy } from 'lucide-react';
import MultipleWebsiteUrlsDialog from './MultipleWebsiteUrlsDialog';
import CopiedTextDialog from './CopiedTextDialog';
import { useSources } from '@/hooks/useSources';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useDocumentProcessing } from '@/hooks/useDocumentProcessing';
import { useNotebookGeneration } from '@/hooks/useNotebookGeneration';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddSourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId?: string;
}

const AddSourcesDialog = ({
  open,
  onOpenChange,
  notebookId
}: AddSourcesDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [showCopiedTextDialog, setShowCopiedTextDialog] = useState(false);
  const [showMultipleWebsiteDialog, setShowMultipleWebsiteDialog] = useState(false);
  const [isLocallyProcessing, setIsLocallyProcessing] = useState(false);
  const { t } = useTranslation();
  const { dir } = useLanguage();

  const {
    addSourceAsync,
    updateSource,
    isAdding
  } = useSources(notebookId);

  const {
    uploadFile,
    isUploading
  } = useFileUpload();

  const {
    processDocumentAsync,
    isProcessing
  } = useDocumentProcessing();

  const {
    generateNotebookContentAsync,
    isGenerating
  } = useNotebookGeneration();

  const {
    toast
  } = useToast();

  // Reset local processing state when dialog opens
  useEffect(() => {
    if (open) {
      setIsLocallyProcessing(false);
    }
  }, [open]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFileUpload(files);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  }, []);

  const processFileAsync = async (file: File, sourceId: string, notebookId: string) => {
    try {
      console.log('Starting file processing for:', file.name, 'source:', sourceId);
      const fileType = file.type.includes('pdf') ? 'pdf' : file.type.includes('audio') ? 'audio' : 'text';

      // Update status to uploading
      updateSource({
        sourceId,
        updates: {
          processing_status: 'uploading'
        }
      });

      // Upload the file
      const filePath = await uploadFile(file, notebookId, sourceId);
      if (!filePath) {
        throw new Error('File upload failed - no file path returned');
      }
      console.log('File uploaded successfully:', filePath);

      // Update with file path and set to processing
      updateSource({
        sourceId,
        updates: {
          file_path: filePath,
          processing_status: 'processing'
        }
      });

      // Start document processing
      try {
        await processDocumentAsync({
          sourceId,
          filePath,
          sourceType: fileType
        });

        // Generate notebook content
        await generateNotebookContentAsync({
          notebookId,
          filePath,
          sourceType: fileType
        });
        console.log('Document processing completed for:', sourceId);
      } catch (processingError) {
        console.error('Document processing failed:', processingError);

        // Update to completed with basic info if processing fails
        updateSource({
          sourceId,
          updates: {
            processing_status: 'completed'
          }
        });
      }
    } catch (error) {
      console.error('File processing failed for:', file.name, error);

      // Update status to failed
      updateSource({
        sourceId,
        updates: {
          processing_status: 'failed'
        }
      });
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!notebookId) {
      toast({
        title: t('notebook.sources.error'),
        description: t('notebook.sources.noNotebook'),
        variant: "destructive"
      });
      return;
    }

    console.log('Processing multiple files with delay strategy:', files.length);
    setIsLocallyProcessing(true);

    try {
      // Step 1: Create the first source immediately (this will trigger generation if it's the first source)
      const firstFile = files[0];
      const firstFileType = firstFile.type.includes('pdf') ? 'pdf' : firstFile.type.includes('audio') ? 'audio' : 'text';
      const firstSourceData = {
        notebookId,
        title: firstFile.name,
        type: firstFileType as 'pdf' | 'text' | 'website' | 'youtube' | 'audio',
        file_size: firstFile.size,
        processing_status: 'pending',
        metadata: {
          fileName: firstFile.name,
          fileType: firstFile.type
        }
      };
      
      console.log('Creating first source for:', firstFile.name);
      const firstSource = await addSourceAsync(firstSourceData);
      
      let remainingSources = [];
      
      // Step 2: If there are more files, add a delay before creating the rest
      if (files.length > 1) {
        console.log('Adding 150ms delay before creating remaining sources...');
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Create remaining sources
        remainingSources = await Promise.all(files.slice(1).map(async (file, index) => {
          const fileType = file.type.includes('pdf') ? 'pdf' : file.type.includes('audio') ? 'audio' : 'text';
          const sourceData = {
            notebookId,
            title: file.name,
            type: fileType as 'pdf' | 'text' | 'website' | 'youtube' | 'audio',
            file_size: file.size,
            processing_status: 'pending',
            metadata: {
              fileName: file.name,
              fileType: file.type
            }
          };
          console.log('Creating source for:', file.name);
          return await addSourceAsync(sourceData);
        }));
        
        console.log('Remaining sources created:', remainingSources.length);
      }

      // Combine all created sources
      const allCreatedSources = [firstSource, ...remainingSources];

      console.log('All sources created successfully:', allCreatedSources.length);

      // Step 3: Close dialog immediately
      setIsLocallyProcessing(false);
      onOpenChange(false);

      // Step 4: Show success toast
      toast({
        title: t('notebook.sources.filesAdded'),
        description: t('notebook.sources.filesAddedDesc', { count: files.length })
      });

      // Step 5: Process files in parallel (background)
      const processingPromises = files.map((file, index) => processFileAsync(file, allCreatedSources[index].id, notebookId));

      // Don't await - let processing happen in background
      Promise.allSettled(processingPromises).then(results => {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        console.log('File processing completed:', {
          successful,
          failed
        });

        if (failed > 0) {
          toast({
            title: t('notebook.sources.processingIssues'),
            description: t('notebook.sources.processingIssuesDesc', { count: failed }),
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error('Error creating sources:', error);
      setIsLocallyProcessing(false);
      toast({
        title: t('notebook.sources.error'),
        description: t('notebook.sources.failedToAdd'),
        variant: "destructive"
      });
    }
  };

  const handleTextSubmit = async (title: string, content: string) => {
    if (!notebookId) return;
    setIsLocallyProcessing(true);

    try {
      // Create source record first to get the ID
      const createdSource = await addSourceAsync({
        notebookId,
        title,
        type: 'text',
        content,
        processing_status: 'processing',
        metadata: {
          characterCount: content.length,
          webhookProcessed: true
        }
      });

      // Send to webhook endpoint with source ID
      const { data, error } = await supabase.functions.invoke('process-additional-sources', {
        body: {
          type: 'copied-text',
          notebookId,
          title,
          content,
          sourceIds: [createdSource.id], // Pass the source ID
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: t('common.success'),
        description: t('notebook.sources.textAddedSuccess')
      });
    } catch (error) {
      console.error('Error adding text source:', error);
      toast({
        title: t('notebook.sources.error'),
        description: t('notebook.sources.textAddedError'),
        variant: "destructive"
      });
    } finally {
      setIsLocallyProcessing(false);
    }

    onOpenChange(false);
  };

  const handleMultipleWebsiteSubmit = async (urls: string[]) => {
    if (!notebookId) return;
    setIsLocallyProcessing(true);

    try {
      console.log('Creating sources for multiple websites with delay strategy:', urls.length);
      
      // Create the first source immediately (this will trigger generation if it's the first source)
      const firstSource = await addSourceAsync({
        notebookId,
        title: `${t('notebook.sources.website')} 1: ${urls[0]}`,
        type: 'website',
        url: urls[0],
        processing_status: 'processing',
        metadata: {
          originalUrl: urls[0],
          webhookProcessed: true
        }
      });
      
      console.log('First source created:', firstSource.id);
      
      let remainingSources = [];
      
      // If there are more URLs, add a delay before creating the rest
      if (urls.length > 1) {
        console.log('Adding 150ms delay before creating remaining sources...');
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Create remaining sources
        remainingSources = await Promise.all(urls.slice(1).map(async (url, index) => {
          return await addSourceAsync({
            notebookId,
            title: `${t('notebook.sources.website')} ${index + 2}: ${url}`,
            type: 'website',
            url,
            processing_status: 'processing',
            metadata: {
              originalUrl: url,
              webhookProcessed: true
            }
          });
        }));
        
        console.log('Remaining sources created:', remainingSources.length);
      }

      // Combine all created sources
      const allCreatedSources = [firstSource, ...remainingSources];

      // Send to webhook endpoint with all source IDs
      const { data, error } = await supabase.functions.invoke('process-additional-sources', {
        body: {
          type: 'multiple-websites',
          notebookId,
          urls,
          sourceIds: allCreatedSources.map(source => source.id), // Pass array of source IDs
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: t('common.success'),
        description: t('notebook.sources.websitesAddedSuccess', { count: urls.length })
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error adding multiple websites:', error);
      toast({
        title: t('notebook.sources.error'),
        description: t('notebook.sources.websitesAddedError'),
        variant: "destructive"
      });
    } finally {
      setIsLocallyProcessing(false);
    }
  };

  // Use local processing state instead of global processing states
  const isProcessingFiles = isLocallyProcessing;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#FFFFFF">
                    <path d="M480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z" />
                  </svg>
                </div>
                <DialogTitle className="text-xl font-medium">{t('common.appName')}</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2">{t('notebook.sources.addSources')}</h2>
              <p className="text-gray-600 text-sm mb-1">{t('notebook.sources.addSourcesDesc')}</p>
              <p className="text-gray-500 text-xs">
                {t('notebook.sources.addSourcesExamples')}
              </p>
            </div>

            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              } ${isProcessingFiles ? 'opacity-50 pointer-events-none' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              dir={dir}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100">
                  <Upload className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {isProcessingFiles ? t('notebook.sources.processingFiles') : t('notebook.sources.uploadSources')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isProcessingFiles ? (
                      t('notebook.sources.pleaseWait')
                    ) : (
                      <>
                        {t('notebook.sources.dragAndDrop')}{' '}
                        <button 
                          className="text-blue-600 hover:underline" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                          disabled={isProcessingFiles}
                        >
                          {t('notebook.sources.chooseFile')}
                        </button>{' '}
                        {t('notebook.sources.toUpload')}
                      </>
                    )}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  {t('notebook.sources.supportedTypes')}
                </p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.txt,.md,.mp3,.wav,.m4a"
                  onChange={handleFileSelect}
                  disabled={isProcessingFiles}
                />
              </div>
            </div>

            {/* Integration Options */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setShowMultipleWebsiteDialog(true)}
                disabled={isProcessingFiles}
              >
                <Link className="h-6 w-6 text-green-600" />
                <span className="font-medium">{t('notebook.sources.linkWebsite')}</span>
                <span className="text-sm text-gray-500">{t('notebook.sources.multipleUrls')}</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setShowCopiedTextDialog(true)}
                disabled={isProcessingFiles}
              >
                <Copy className="h-6 w-6 text-purple-600" />
                <span className="font-medium">{t('notebook.sources.pasteText')}</span>
                <span className="text-sm text-gray-500">{t('notebook.sources.addCopiedContent')}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-dialogs */}
      <CopiedTextDialog 
        open={showCopiedTextDialog} 
        onOpenChange={setShowCopiedTextDialog} 
        onSubmit={handleTextSubmit} 
      />

      <MultipleWebsiteUrlsDialog 
        open={showMultipleWebsiteDialog} 
        onOpenChange={setShowMultipleWebsiteDialog} 
        onSubmit={handleMultipleWebsiteSubmit} 
      />
    </>
  );
};

export default AddSourcesDialog;