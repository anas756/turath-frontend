import { useEffect, useRef, useState } from 'react';
import RichText from '../common/RichText';
import { sanitizeHtml } from '../../utils/richText';
import '../../styles/rich-description-editor.css';

const blockOptions = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Quote', value: 'blockquote' },
];

export default function RichDescriptionEditor({
  value = '',
  onChange,
  placeholder = 'Write a clean formatted description...',
}) {
  const editorRef = useRef(null);
  const [mode, setMode] = useState('visual');
  const [html, setHtml] = useState(() => sanitizeHtml(value));

  useEffect(() => {
    const clean = sanitizeHtml(value);
    setHtml(clean);

    if (editorRef.current && mode === 'visual' && editorRef.current.innerHTML !== clean) {
      editorRef.current.innerHTML = clean;
    }
  }, [mode, value]);

  const emitChange = (nextHtml) => {
    const clean = sanitizeHtml(nextHtml);
    setHtml(clean);
    onChange?.(clean);
  };

  const focusEditor = () => {
    if (mode !== 'visual') setMode('visual');
    window.requestAnimationFrame(() => editorRef.current?.focus());
  };

  const runCommand = (command, argument = null) => {
    focusEditor();
    document.execCommand(command, false, argument);
    emitChange(editorRef.current?.innerHTML || '');
  };

  const applyBlock = (event) => {
    const block = event.target.value;
    runCommand('formatBlock', block);
  };

  const addLink = () => {
    const url = window.prompt('Paste the link URL');
    if (!url) return;
    runCommand('createLink', url);
  };

  const handleVisualInput = () => {
    emitChange(editorRef.current?.innerHTML || '');
  };

  const handleCodeChange = (event) => {
    emitChange(event.target.value);
  };

  return (
    <div className="rich-description-editor">
      <div className="rich-description-editor__toolbar" aria-label="Description formatting toolbar">
        <button type="button" onClick={() => runCommand('bold')}>B</button>
        <button type="button" onClick={() => runCommand('italic')}>I</button>
        <button type="button" onClick={() => runCommand('underline')}>U</button>
        <button type="button" onClick={() => runCommand('strikeThrough')}>S</button>
        <select onChange={applyBlock} defaultValue="">
          <option value="" disabled>Style</option>
          {blockOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button type="button" onClick={() => runCommand('insertUnorderedList')}>Bullets</button>
        <button type="button" onClick={() => runCommand('insertOrderedList')}>Numbers</button>
        <button type="button" onClick={() => runCommand('justifyLeft')}>Left</button>
        <button type="button" onClick={() => runCommand('justifyCenter')}>Center</button>
        <button type="button" onClick={() => runCommand('justifyRight')}>Right</button>
        <button type="button" onClick={addLink}>Link</button>
        <button type="button" onClick={() => runCommand('removeFormat')}>Clear</button>
        <button
          type="button"
          className={mode === 'html' ? 'is-active' : undefined}
          onClick={() => setMode((current) => current === 'html' ? 'visual' : 'html')}
        >
          HTML
        </button>
      </div>

      {mode === 'html' ? (
        <textarea
          className="rich-description-editor__code"
          value={html}
          onChange={handleCodeChange}
          spellCheck={false}
        />
      ) : (
        <div
          ref={editorRef}
          className="rich-description-editor__surface"
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualInput}
          data-placeholder={placeholder}
        />
      )}

      <div className="rich-description-editor__preview">
        <span>Preview</span>
        <RichText html={html} fallback={<p>No description yet.</p>} />
      </div>
    </div>
  );
}
