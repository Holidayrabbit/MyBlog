import React, { useState, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, Minimize2 } from 'lucide-react';
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
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const rotate = () => setRotation(prev => (prev + 90) % 360);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = 'ZhaoQie_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
    setPageNumber(1);
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
    <div ref={containerRef} className={`pdf-viewer-container ${className} ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* 工具栏 */}
      <div className="pdf-toolbar">
        <div className="toolbar-left">
          <span className="page-info">
            {numPages && `${pageNumber} / ${numPages}`}
          </span>
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="toolbar-btn"
            title="上一页"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="toolbar-btn"
            title="下一页"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="toolbar-center">
          <button onClick={zoomOut} className="toolbar-btn" title="缩小">
            <ZoomOut size={18} />
          </button>
          <span className="zoom-info">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="toolbar-btn" title="放大">
            <ZoomIn size={18} />
          </button>
          <button onClick={rotate} className="toolbar-btn" title="旋转">
            <RotateCw size={18} />
          </button>
          <button onClick={resetView} className="toolbar-btn reset-btn" title="重置视图">
            重置
          </button>
        </div>

        <div className="toolbar-right">
          <button onClick={toggleFullscreen} className="toolbar-btn" title="全屏">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={downloadPDF} className="toolbar-btn download-btn" title="下载">
            <Download size={18} />
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
            rotate={rotation}
            loading=""
            className="pdf-page"
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
