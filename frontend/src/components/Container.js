import React from 'react';

function Container({ 
  children, 
  className = '', 
  size = 'default',
  ...props 
}) {
  const sizeClasses = {
    small: 'max-w-2xl',
    default: 'max-w-4xl',
    large: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div 
      className={`mx-auto px-4 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;