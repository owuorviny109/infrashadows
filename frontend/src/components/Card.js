import React from 'react';

function Card({ 
  children, 
  title, 
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  footer,
  ...props 
}) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-card overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-6 py-4 border-b ${headerClassName}`}>
          {typeof title === 'string' ? (
            <h3 className="text-lg font-semibold">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;