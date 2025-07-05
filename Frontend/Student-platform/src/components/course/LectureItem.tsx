import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lecture } from "@/types";
import { FileText, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePDFViewer } from "@/contexts/PDFViewerContext";
import axios from "axios";

interface LectureItemProps {
  lecture: Lecture;
}

const LectureItem = ({ lecture }: LectureItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { openPDF } = usePDFViewer();

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // Direct download using anchor
    const link = document.createElement('a');
    link.href = lecture.fileUrl;
    link.download = lecture.title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(lecture.fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="flex items-center justify-between py-5 px-6 hover:bg-accent/20 transition-colors relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start">
        <div className={cn(
          "p-2.5 rounded-lg mr-4 transition-colors duration-300 flex-shrink-0",
          isHovered ? "bg-primary text-white" : "bg-accent text-primary"
        )}>
          <FileText size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-base mb-1 text-text-primary group-hover:text-primary transition-colors">
            {lecture.title}
          </h4>
          {/* No additional data, only show title as per backend response */}
        </div>
      </div>
      <div className="flex space-x-2">
        <a
          href={lecture.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium transition-all duration-300 hover:bg-accent/50",
            isHovered && "bg-accent/50"
          )}
        >
          <Eye size={16} className="mr-1.5" />
          View PDF
        </a>
        <button
          type="button"
          className={cn(
            "inline-flex items-center px-3 py-2 border border-primary text-primary rounded-md text-sm font-medium transition-all duration-300 hover:bg-primary hover:text-white",
            isHovered && "bg-primary text-white shadow-sm"
          )}
          onClick={async () => {
            try {
              const response = await axios.get(lecture.fileUrl, { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', lecture.title + '.pdf');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (err) {
              alert('Failed to download file.');
            }
          }}
        >
          <Download size={16} className={cn(
            "mr-1.5 transition-transform duration-300",
            isHovered && "animate-bounce-once"
          )} />
          Download
        </button>
      </div>

      {/* Line indicator */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-0.5 bg-primary transition-all duration-300 transform",
        isHovered ? "opacity-100" : "opacity-0"
      )}></div>
    </div>
  );
};

export default LectureItem;
