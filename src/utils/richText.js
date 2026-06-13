const allowedTags = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'EM',
  'H2',
  'H3',
  'H4',
  'I',
  'LI',
  'OL',
  'P',
  'SPAN',
  'STRONG',
  'U',
  'UL',
]);

const linkProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const blockedTags = new Set(['EMBED', 'IFRAME', 'LINK', 'META', 'OBJECT', 'SCRIPT', 'STYLE']);

function removeUnsafeNode(node) {
  const parent = node.parentNode;
  if (!parent) return;

  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }
  parent.removeChild(node);
}

function sanitizeNode(node) {
  [...node.children].forEach((child) => {
    if (!allowedTags.has(child.tagName)) {
      if (blockedTags.has(child.tagName)) {
        child.remove();
      } else {
        sanitizeNode(child);
        removeUnsafeNode(child);
      }
      return;
    }

    [...child.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();

      if (child.tagName === 'A' && ['href', 'target', 'rel'].includes(name)) {
        return;
      }

      child.removeAttribute(attribute.name);
    });

    if (child.tagName === 'A') {
      const href = child.getAttribute('href');

      if (href) {
        try {
          const url = new URL(href, window.location.origin);
          if (!linkProtocols.has(url.protocol)) {
            child.removeAttribute('href');
          }
        } catch {
          child.removeAttribute('href');
        }
      }

      child.setAttribute('target', '_blank');
      child.setAttribute('rel', 'noreferrer');
    }

    sanitizeNode(child);
  });
}

export function sanitizeHtml(value) {
  if (!value) return '';
  const source = value.toString().trim();
  if (!source) return '';

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return source.replace(/<[^>]*>/g, '').trim();
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(source, 'text/html');
  sanitizeNode(document.body);

  return document.body.innerHTML.trim();
}

export function htmlToPlainText(value) {
  if (!value) return '';
  const cleanHtml = sanitizeHtml(value);

  if (typeof window === 'undefined') {
    return cleanHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const element = document.createElement('div');
  element.innerHTML = cleanHtml;
  return element.textContent.replace(/\s+/g, ' ').trim();
}
