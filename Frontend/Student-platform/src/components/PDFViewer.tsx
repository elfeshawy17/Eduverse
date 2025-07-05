import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, FileText } from "lucide-react";
import { PDFViewerState } from "@/types";
import { useState } from "react";

interface PDFViewerProps {
  state: PDFViewerState;
  onClose: () => void;
}

const PDFViewer = ({ state, onClose }: PDFViewerProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <Dialog open={state.isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-6 w-6 mr-2 text-primary" />
              <DialogTitle className="text-xl">{state.title}</DialogTitle>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-sm">
            {state.type === 'lecture' ? 'Lecture Material' : 'Assignment Document'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-[500px] mt-4 border rounded-md overflow-hidden relative bg-gray-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-text-secondary">Loading PDF document...</p>
              </div>
            </div>
          )}
          
          <iframe 
            src={`${state.url}#toolbar=0&view=FitH`}
            className="w-full h-full"
            onLoad={() => setLoading(false)}
            title={state.title}
          />
        </div>
        
        <div className="flex justify-end items-center mt-4 pt-2 border-t">
          <Button 
            variant="outline" 
            className="mr-2" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            variant="default"
            className="bg-primary text-white"
            onClick={() => window.open(state.url, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer; 