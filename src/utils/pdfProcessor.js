import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import { processImageRMBG } from './rmbg';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function processPdf(file, onProgress) {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = Math.min(pdf.numPages, 5); // Limit to 5 pages
      
      const outPdf = new jsPDF();
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render PDF page to canvas
        await page.render({
          canvasContext: ctx,
          viewport: viewport
        }).promise;
        
        // Convert canvas to blob
        const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        const blobUrl = URL.createObjectURL(blob);
        
        // Process image with RMBG
        const processedBlob = await processImageRMBG(blobUrl);
        URL.revokeObjectURL(blobUrl);
        
        // Read processed blob as data URL for jsPDF
        const processedDataUrl = await new Promise(res => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.readAsDataURL(processedBlob);
        });
        
        if (i > 1) outPdf.addPage();
        
        // jsPDF dimensions are in mm by default
        const pdfWidth = outPdf.internal.pageSize.getWidth();
        const pdfHeight = (viewport.height * pdfWidth) / viewport.width;
        
        outPdf.addImage(processedDataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        if (onProgress) {
          onProgress(Math.round((i / numPages) * 100));
        }
      }
      
      const finalPdfBlob = outPdf.output('blob');
      resolve(URL.createObjectURL(finalPdfBlob));
    } catch (err) {
      reject(err);
    }
  });
}
