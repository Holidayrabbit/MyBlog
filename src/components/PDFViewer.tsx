import React, { useState, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 设置PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PDFViewerProps {
  file: string;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, className = '' }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF加载失败:', error);
    setError('PDF文件加载失败，请稍后重试');
    setLoading(false);
  }, []);

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(newPageNumber, 1), numPages || 1);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = 'ZhaoQie_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className={`pdf-viewer-container ${className}`}>
        <div className="pdf-error">
          <div className="error-content">
            <p>{error}</p>
            <button onClick={downloadPDF} className="download-btn">
              <Download size={18} />
              下载PDF简历
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer-container ${className}`}>
      {/* 工具栏 */}
      <div className="pdf-toolbar">
        {/* 分页控制 */}
        <div className="toolbar-section">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="toolbar-btn"
            title="上一页"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="page-info">
            {numPages && `${pageNumber} / ${numPages}`}
          </span>
          <button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="toolbar-btn"
            title="下一页"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 下载按钮 */}
        <div className="toolbar-section">
          <button onClick={downloadPDF} className="toolbar-btn" title="下载简历">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* PDF显示区域 */}
      <div className="pdf-display">
        {loading && (
          <div className="pdf-loading">
            <div className="loading-spinner"></div>
            <p>正在加载PDF文档...</p>
          </div>
        )}
        
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="pdf-document"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            loading=""
            className="pdf-page"
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
