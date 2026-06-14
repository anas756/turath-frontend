const allowedTags = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'CODE',
  'DIV',
  'EM',
  'H2',
  'H3',
  'H4',
  'HR',
  'I',
  'LI',
  'MARK',
  'OL',
  'P',
  'PRE',
  'SMALL',
  'SPAN',
  'STRONG',
  'SUB',
  'SUP',
  'TABLE',
  'TBODY',
  'TD',
  'TFOOT',
  'TH',
  'THEAD',
  'TR',
  'U',
  'UL',
]);

const linkProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const blockedTags = new Set(['EMBED', 'IFRAME', 'LINK', 'META', 'OBJECT', 'SCRIPT', 'STYLE']);
const allowedStyleProperties = new Set([
  'background',
  'background-color',
  'border',
  'border-bottom',
  'border-left',
  'border-radius',
  'border-right',
  'border-top',
  'color',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'line-height',
  'list-style-type',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-width',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'text-align',
  'text-decoration',
]);
const unsafeCssPattern = /(url\s*\(|expression\s*\(|javascript:|vbscript:|behavior\s*:|@import|<|>)/i;

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

      if (name === 'dir' && ['rtl', 'ltr', 'auto'].includes(attribute.value.toLowerCase())) {
        return;
      }

      if (name === 'style') {
        const cleanStyle = sanitizeStyle(attribute.value);
        if (cleanStyle) child.setAttribute('style', cleanStyle);
        else child.removeAttribute(attribute.name);
        return;
      }

      if (['TD', 'TH'].includes(child.tagName) && ['colspan', 'rowspan'].includes(name)) {
        const number = Number(attribute.value);
        if (Number.isInteger(number) && number > 0 && number <= 12) {
          return;
        }
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

function sanitizeStyle(value) {
  return value
    .split(';')
    .map((rule) => {
      const [property, ...rawParts] = rule.split(':');
      const normalizedProperty = property?.trim().toLowerCase();
      const rawValue = rawParts.join(':').trim();

      if (!normalizedProperty || !rawValue || !allowedStyleProperties.has(normalizedProperty)) {
        return null;
      }

      if (unsafeCssPattern.test(rawValue)) {
        return null;
      }

      return `${normalizedProperty}: ${rawValue}`;
    })
    .filter(Boolean)
    .join('; ');
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
