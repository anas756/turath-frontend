import { sanitizeHtml } from '../../utils/richText';

export default function RichText({ html, className = 'rich-text', style, fallback = null }) {
  const cleanHtml = sanitizeHtml(html);

  if (!cleanHtml) return fallback;

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
