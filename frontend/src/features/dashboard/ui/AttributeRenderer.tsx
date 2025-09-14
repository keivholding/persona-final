import React from 'react';
import { type Attribute } from '../../../types/attribute';
import { validateAttributeValue, formatAttributeValue } from '../hooks/useProfilePreview';

// Flexible interface that works with both full Attribute and simplified shared attributes
interface AttributeDisplayData {
  id: string;
  name: string;
  value: string;
  type: string;
}

interface AttributeRendererProps {
  attribute: Attribute | AttributeDisplayData;
  className?: string;
}

const AttributeRenderer: React.FC<AttributeRendererProps> = ({ attribute, className = "" }) => {
  const { name, value, type } = attribute;
  const isValid = validateAttributeValue(value, type);
  
  // If the value is invalid, show it as plain text with a warning
  if (!isValid) {
    return (
      <div className={`${className} text-gray-600`}>
        <span className="text-red-500 text-xs">⚠️ </span>
        {value}
      </div>
    );
  }

  const formattedValue = formatAttributeValue(value, type);

  switch (type) {
    case 'email':
      return (
        <a
          href={`mailto:${value}`}
          className={`${className} text-indigo-600 hover:text-indigo-700 hover:underline transition-colors`}
        >
          {formattedValue}
        </a>
      );

    case 'url':
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} text-indigo-600 hover:text-indigo-700 hover:underline transition-colors inline-flex items-center gap-1`}
        >
          {formattedValue}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );

    case 'phone':
      return (
        <a
          href={`tel:${value}`}
          className={`${className} text-indigo-600 hover:text-indigo-700 hover:underline transition-colors`}
        >
          {formattedValue}
        </a>
      );

    case 'image':
      // For now, show as a link until we implement image upload
      if (value.startsWith('http')) {
        return (
          <div className={className}>
            <img
              src={value}
              alt={name}
              className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-gray-500 text-sm">🖼️ ${value}</span>`;
                }
              }}
            />
          </div>
        );
      } else {
        return (
          <div className={`${className} text-gray-500 text-sm`}>
            🖼️ {value}
          </div>
        );
      }

    case 'address':
      return (
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(value)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} text-indigo-600 hover:text-indigo-700 hover:underline transition-colors inline-flex items-center gap-1`}
        >
          {formattedValue}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </a>
      );

    case 'date':
      return (
        <span className={`${className} text-gray-700`}>
          {formattedValue}
        </span>
      );

    case 'text':
    default:
      return (
        <span className={`${className} text-gray-700`}>
          {formattedValue}
        </span>
      );
  }
};

export default AttributeRenderer;
