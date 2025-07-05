import React, { createContext, useState, useContext } from 'react';
import { PDFViewerState } from '@/types';
import PDFViewer from '@/components/PDFViewer';

interface PDFViewerContextType {
  openPDF: (url: string, title: string, type: 'lecture' | 'assignment') => void;
  closePDF: () => void;
}

const initialState: PDFViewerState = {
  isOpen: false,
  url: '',
  title: '',
  type: 'lecture'
};

const PDFViewerContext = createContext<PDFViewerContextType | undefined>(undefined);

export const PDFViewerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PDFViewerState>(initialState);

  const openPDF = (url: string, title: string, type: 'lecture' | 'assignment') => {
    setState({
      isOpen: true,
      url,
      title,
      type
    });
  };

  const closePDF = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <PDFViewerContext.Provider value={{ openPDF, closePDF }}>
      {children}
      <PDFViewer state={state} onClose={closePDF} />
    </PDFViewerContext.Provider>
  );
};

export const usePDFViewer = (): PDFViewerContextType => {
  const context = useContext(PDFViewerContext);
  if (context === undefined) {
    throw new Error('usePDFViewer must be used within a PDFViewerProvider');
  }
  return context;
}; 