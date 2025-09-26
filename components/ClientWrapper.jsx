'use client';

export default function ClientWrapper({ children, content }) {
  // If content is provided, render it as HTML
  if (content) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  // Otherwise return children
  return children;
}
