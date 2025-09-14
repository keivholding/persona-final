import React, { useState, useRef } from "react";
import { EyeIcon } from "../../../app/ui/icons";
import { useContextsQuery } from "../hooks/useContextsQuery";
import { useProfilePreview } from "../hooks/useProfilePreview";
import AttributeRenderer from "./AttributeRenderer";
import jsPDF from 'jspdf';

const ProfilePreview = () => {
  const { data: contexts, isLoading: contextsLoading, error: contextsError } = useContextsQuery();
  const [selectedContextId, setSelectedContextId] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  // Set default context when contexts load
  React.useEffect(() => {
    if (contexts && contexts.length > 0 && !selectedContextId) {
      setSelectedContextId(String(contexts[0].id));
    }
  }, [contexts, selectedContextId]);

  const { context, attributes, isLoading: profileLoading, error: profileError } = useProfilePreview(selectedContextId);

  const isLoading = contextsLoading || profileLoading;
  const error = contextsError?.message || profileError;

  const handleContextChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedContextId(e.target.value);
  };

  // Function to generate and download PDF
  const handleExportPDF = async () => {
    if (!context.name || attributes.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Create PDF with better settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Set up margins and positioning
      const margin = 25;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Professional header with brand colors
      pdf.setFillColor(79, 70, 229); // Indigo background
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      // White text on colored background
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${context.name} Profile`, margin, 25);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(context.description || 'Digital Identity Profile', margin, 35);
      
      yPosition = 60;

      // Content section with clean styling
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Contact Information', margin, yPosition);
      yPosition += 15;

      // Add attributes in a clean table-like format
      pdf.setFontSize(12);
      const lineHeight = 8;
      const labelWidth = 50;

      for (const attribute of attributes) {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin + 20;
        }

        // Handle image attributes specially
        if (attribute.type === 'image' && attribute.value.startsWith('http')) {
          try {
            // Try to load and embed the image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              img.onload = () => {
                try {
                  // Create canvas to convert image
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  // Set canvas size
                  const maxWidth = 40;
                  const maxHeight = 40;
                  const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                  canvas.width = img.width * ratio;
                  canvas.height = img.height * ratio;
                  
                  // Draw image
                  ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                  
                  // Convert to data URL
                  const dataURL = canvas.toDataURL('image/jpeg', 0.8);
                  
                  // Draw row background
                  const rowHeight = Math.max(35, 12);
                  pdf.setFillColor(248, 250, 252);
                  pdf.rect(margin - 5, yPosition - 8, contentWidth + 10, rowHeight, 'F');
                  
                  // Attribute label
                  pdf.setFont('helvetica', 'bold');
                  pdf.setTextColor(75, 85, 99);
                  pdf.text(attribute.name, margin, yPosition);
                  
                  // Add the actual image
                  pdf.addImage(dataURL, 'JPEG', margin + labelWidth, yPosition - 5, canvas.width * 0.5, canvas.height * 0.5);
                  
                  yPosition += Math.max(35, lineHeight) + 5;
                  resolve(true);
                } catch (error) {
                  console.error('Error processing image:', error);
                  reject(error);
                }
              };
              
              img.onerror = () => reject(new Error('Failed to load image'));
              img.src = attribute.value;
            });
            
          } catch (error) {
            console.error('Failed to load image, using fallback:', error);
            // Fallback: show as URL
            const rowHeight = 12;
            pdf.setFillColor(248, 250, 252);
            pdf.rect(margin - 5, yPosition - 8, contentWidth + 10, rowHeight, 'F');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(75, 85, 99);
            pdf.text(attribute.name, margin, yPosition);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(31, 41, 55);
            const fallbackText = `🖼 Image: ${attribute.value}`;
            const lines = pdf.splitTextToSize(fallbackText, contentWidth - labelWidth - 5);
            pdf.text(lines, margin + labelWidth, yPosition);
            
            yPosition += Math.max(lineHeight, lines.length * 6) + 3;
          }
        } else {
          // Handle non-image attributes
          const rowHeight = 12;
          pdf.setFillColor(248, 250, 252);
          pdf.rect(margin - 5, yPosition - 8, contentWidth + 10, rowHeight, 'F');

          // Format values based on attribute type and determine if we need custom labeling
          let prefix = '';
          let useCustomLabel = false;
          
          switch (attribute.type) {
            case 'email':
              prefix = 'Email: ';
              useCustomLabel = true;
              break;
            case 'phone':
              prefix = 'Phone: ';
              useCustomLabel = true;
              break;
            case 'url':
              prefix = 'Website: ';
              useCustomLabel = true;
              break;
            case 'address':
              prefix = 'Address: ';
              useCustomLabel = true;
              break;
            case 'date':
              prefix = 'Date: ';
              useCustomLabel = true;
              break;
            default:
              // For text and other types, use the attribute name as label
              useCustomLabel = false;
          }
          
          let lines: string[] = [];
          
          if (useCustomLabel) {
            // Use type-based labeling (Email:, Phone:, etc.)
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(75, 85, 99);
            pdf.text(prefix.slice(0, -2), margin, yPosition); // Remove the ": " for the label
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(31, 41, 55);
            lines = pdf.splitTextToSize(attribute.value, contentWidth - labelWidth - 5);
            pdf.text(lines, margin + labelWidth, yPosition);
          } else {
            // Use attribute name as label (for text and other types)
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(75, 85, 99);
            pdf.text(attribute.name, margin, yPosition);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(31, 41, 55);
            lines = pdf.splitTextToSize(attribute.value, contentWidth - labelWidth - 5);
            pdf.text(lines, margin + labelWidth, yPosition);
          }
          
          // Adjust position based on number of lines
          yPosition += Math.max(lineHeight, lines.length * 6) + 3;
        }
      }

      // Professional footer
      const footerY = pageHeight - 25;
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Generated by Persona Identity Management', margin, footerY);
      
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Export Date: ${dateStr}`, margin, footerY + 6);
      
      // Add page numbers
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        const pageText = totalPages > 1 ? `Page ${i} of ${totalPages}` : '';
        if (pageText) {
          pdf.text(pageText, pageWidth - margin - 20, footerY + 6);
        }
      }

      // Download with descriptive filename
      const contextName = context.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const dateStr2 = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const fileName = `${contextName}_profile_${dateStr2}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Enhanced Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <EyeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preview Your Profile</h2>
            <p className="text-sm text-gray-600 mt-1">See how others view your identity in different contexts</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
            Live Preview
          </div>
          {isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-gray-400">
              Loading...
            </div>
          ) : contexts && contexts.length > 0 ? (
            <select 
              value={selectedContextId}
              onChange={handleContextChange}
              className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            >
              {contexts.map((ctx) => (
                <option key={ctx.id} value={String(ctx.id)}>
                  {ctx.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500">
              No contexts available
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-600 font-medium">Failed to load profile preview</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 card-shadow-lg">
          <div className="loading-shimmer h-64"></div>
        </div>
      ) : !context.name ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200/60 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <EyeIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Context Selected</h3>
            <p className="text-gray-600 text-lg mb-4 max-w-md mx-auto leading-relaxed">
              Select a context from the dropdown to preview your profile.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-xl text-sm font-medium">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
              Live preview will appear here
            </div>
          </div>
        </div>
      ) : (
        <div ref={profileCardRef} className="rounded-xl border border-gray-200 bg-white p-8 card-shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-gray-900">{context.name} Context View</div>
              <div className="text-sm text-gray-500 mt-1">This is how others see you in this context</div>
            </div>
            <span 
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ 
                backgroundColor: `${context.color}20`, 
                color: context.color 
              }}
            >
              {context.name}
            </span>
          </div>

          {attributes.length === 0 ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl border border-gray-200/60 p-8 text-center mt-6">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-slate-500/5"></div>
              <div className="relative">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-400 to-slate-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878c-.379-.379-.879-.879-1.285-1.285m1.285 1.285l4.242 4.242m-4.242-4.242L8.171 8.171m5.907 5.907c.379.379.879.879 1.285 1.285M15.878 15.878l1.285-1.285" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Visible Attributes</h3>
                <p className="text-gray-600 mb-3">No attributes are currently shared in the "{context.name}" context.</p>
                <p className="text-sm text-gray-500">Configure your privacy matrix to make attributes visible in this context.</p>
              </div>
            </div>
          ) : (
            <>
              <dl className="space-y-6 border-t border-gray-100 pt-6">
                {attributes.map((attribute) => (
                  <div key={attribute.id} className="grid grid-cols-[140px_1fr] gap-4 items-start">
                    <dt className="text-sm font-medium text-gray-500 capitalize">
                      {attribute.name}:
                    </dt>
                    <dd className="font-medium text-gray-700">
                      <AttributeRenderer 
                        attribute={attribute}
                        className="break-words"
                      />
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
                <button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export as PDF
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default ProfilePreview;

