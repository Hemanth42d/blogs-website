import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "./Modal";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing...",
}) => {
  const editorRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  const isInternalChange = useRef(false);
  const savedRange = useRef(null);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRange.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRange.current && editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }
  };

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
    
    const textContent = editorRef.current?.textContent || '';
    const words = textContent.trim().split(/\s+/).filter((word) => word.length > 0);
    setWordCount(textContent.trim() ? words.length : 0);
  }, [value]);

  const execCommand = (command, cmdValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, cmdValue);
    setTimeout(() => {
      isInternalChange.current = true;
      const content = editorRef.current?.innerHTML || "";
      onChange(content);
    }, 0);
  };

  const insertHTML = (html) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    setTimeout(() => {
      isInternalChange.current = true;
      onChange(editorRef.current?.innerHTML || "");
    }, 0);
  };

  const handleInput = useCallback((e) => {
    isInternalChange.current = true;
    const content = e.target.innerHTML;
    onChange(content);

    const textContent = e.target.textContent || "";
    const words = textContent.trim().split(/\s+/).filter((word) => word.length > 0);
    setWordCount(textContent.trim() ? words.length : 0);
  }, [onChange]);

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          execCommand("bold");
          break;
        case "i":
          e.preventDefault();
          execCommand("italic");
          break;
        case "u":
          e.preventDefault();
          execCommand("underline");
          break;
        case "k":
          e.preventDefault();
          insertLink();
          break;
        default:
          break;
      }
    }
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [modalExtra, setModalExtra] = useState("");
  const [modalMultiline, setModalMultiline] = useState(false);
  const modalCallback = useRef(null);

  const confirmModal = () => {
    const val = modalValue;
    const extra = modalExtra;
    setModalOpen(false);
    setTimeout(() => {
      if (modalCallback.current) {
        modalCallback.current(val, extra);
      }
    }, 50);
  };

  const insertLink = () => {
    saveSelection();
    setModalTitle("Insert Link");
    setModalValue("");
    setModalExtra("");
    setModalMultiline(false);
    modalCallback.current = (val) => {
      if (val && val.trim()) {
        restoreSelection();
        document.execCommand("createLink", false, val.trim());
        setTimeout(() => {
          isInternalChange.current = true;
          onChange(editorRef.current?.innerHTML || "");
        }, 0);
      }
    };
    setModalOpen(true);
  };

  const insertImage = () => {
    saveSelection();
    setModalTitle("Insert Image");
    setModalValue("");
    setModalExtra("");
    setModalMultiline(false);
    modalCallback.current = (url, altText) => {
      if (url?.trim()) {
        const img = `<p><img src="${url.trim()}" alt="${altText || "Blog image"}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0;" /></p>`;
        insertHTML(img);
      }
    };
    setModalOpen(true);
  };

  const insertCodeBlock = () => {
    saveSelection();
    setModalTitle("Insert Code Block");
    setModalValue("");
    setModalExtra("");
    setModalMultiline(true);
    modalCallback.current = (code, language) => {
      if (code) {
        const escapedCode = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "&#10;");
        const langAttr = language ? ` data-language="${language}"` : "";
        const langLabel = language ? `<div class="code-lang">${language}</div>` : "";
        const codeBlock = `<div class="code-block"${langAttr}>${langLabel}<pre><code>${escapedCode}</code></pre></div><p><br></p>`;
        insertHTML(codeBlock);
      }
    };
    setModalOpen(true);
  };

  const insertInlineCode = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "";
    
    if (selectedText) {
      const codeSpan = `<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">${selectedText}</code>`;
      document.execCommand("insertHTML", false, codeSpan);
      setTimeout(() => {
        isInternalChange.current = true;
        onChange(editorRef.current?.innerHTML || "");
      }, 0);
    } else {
      saveSelection();
      setModalTitle("Insert Inline Code");
      setModalValue("");
      setModalExtra("");
      setModalMultiline(false);
      modalCallback.current = (code) => {
        if (code) {
          const codeSpan = `<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">${code}</code>`;
          insertHTML(codeSpan);
        }
      };
      setModalOpen(true);
    }
  };

  const insertDivider = () => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, "<hr/>");
    setTimeout(() => {
      isInternalChange.current = true;
      onChange(editorRef.current?.innerHTML || "");
    }, 0);
  };

  const ToolbarButton = ({ icon, title, onClick, active, style = "" }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 text-sm border border-gray-300 rounded hover:bg-white hover:shadow-sm transition-all ${style} ${active ? 'bg-blue-100 border-blue-400' : 'bg-gray-50'}`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      <Modal isOpen={modalOpen} title={modalTitle} onClose={() => setModalOpen(false)} onConfirm={confirmModal} confirmLabel="Insert" cancelLabel="Cancel">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              {modalTitle.includes("Image") ? "Image URL" : modalTitle.includes("Link") ? "Link URL" : "Value"}
            </label>
            {modalMultiline ? (
              <textarea autoFocus value={modalValue} onChange={(e) => setModalValue(e.target.value)} rows={8} className="w-full border border-gray-300 px-3 py-2 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your code here..." />
            ) : (
              <input autoFocus value={modalValue} onChange={(e) => setModalValue(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={modalTitle.includes("Image") ? "https://example.com/image.jpg" : "https://example.com"} />
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              {modalTitle.includes("Image") ? "Alt Text (optional)" : modalTitle.includes("Code Block") ? "Language (optional)" : "Extra (optional)"}
            </label>
            <input value={modalExtra} onChange={(e) => setModalExtra(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder={modalTitle.includes("Image") ? "Describe the image" : "javascript, python, etc."} />
          </div>
        </div>
      </Modal>

      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 border-b border-gray-200 p-2 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton icon="B" title="Bold (Ctrl+B)" onClick={() => execCommand("bold")} style="font-bold" />
            <ToolbarButton icon="I" title="Italic (Ctrl+I)" onClick={() => execCommand("italic")} style="italic" />
            <ToolbarButton icon="U" title="Underline (Ctrl+U)" onClick={() => execCommand("underline")} style="underline" />
            <ToolbarButton icon="S" title="Strikethrough" onClick={() => execCommand("strikeThrough")} style="line-through" />
          </div>

          {/* Headings */}
          <div className="flex gap-1 px-2 border-r border-gray-300">
            <ToolbarButton icon="H1" title="Heading 1" onClick={() => execCommand("formatBlock", "h1")} />
            <ToolbarButton icon="H2" title="Heading 2" onClick={() => execCommand("formatBlock", "h2")} />
            <ToolbarButton icon="H3" title="Heading 3" onClick={() => execCommand("formatBlock", "h3")} />
            <ToolbarButton icon="¶" title="Paragraph" onClick={() => execCommand("formatBlock", "p")} />
          </div>

          {/* Lists */}
          <div className="flex gap-1 px-2 border-r border-gray-300">
            <ToolbarButton icon="• List" title="Bullet List" onClick={() => execCommand("insertUnorderedList")} />
            <ToolbarButton icon="1. List" title="Numbered List" onClick={() => execCommand("insertOrderedList")} />
            <ToolbarButton icon="❝" title="Blockquote" onClick={() => execCommand("formatBlock", "blockquote")} />
          </div>

          {/* Insert */}
          <div className="flex gap-1 px-2 border-r border-gray-300">
            <ToolbarButton icon="🔗" title="Insert Link (Ctrl+K)" onClick={insertLink} />
            <ToolbarButton icon="🖼️" title="Insert Image" onClick={insertImage} />
            <ToolbarButton icon="—" title="Horizontal Line" onClick={insertDivider} />
          </div>

          {/* Code */}
          <div className="flex gap-1 px-2 border-r border-gray-300">
            <ToolbarButton icon="<>" title="Inline Code" onClick={insertInlineCode} style="font-mono text-xs" />
            <ToolbarButton icon="{...}" title="Code Block" onClick={insertCodeBlock} style="font-mono text-xs" />
          </div>

          {/* Clear */}
          <div className="flex gap-1 pl-2">
            <ToolbarButton icon="✕" title="Clear Formatting" onClick={() => execCommand("removeFormat")} />
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="min-h-[500px] p-6 focus:outline-none"
        style={{ minHeight: "500px", lineHeight: "1.8" }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        [contenteditable] {
          font-size: 16px;
          color: #1f2937;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 1em 0 0.5em 0;
          color: #111827;
          line-height: 1.3;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
          color: #1f2937;
          line-height: 1.4;
        }
        [contenteditable] h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 1em 0 0.5em 0;
          color: #374151;
          line-height: 1.4;
        }
        [contenteditable] p {
          margin: 0.75em 0;
          line-height: 1.8;
        }
        [contenteditable] ul {
          list-style-type: disc;
          margin: 1em 0;
          padding-left: 2em;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          margin: 1em 0;
          padding-left: 2em;
        }
        [contenteditable] li {
          margin: 0.5em 0;
          line-height: 1.7;
        }
        [contenteditable] blockquote {
          margin: 1.5em 0;
          padding: 1em 1.5em;
          border-left: 4px solid #3b82f6;
          background: #f8fafc;
          color: #475569;
          font-style: italic;
          border-radius: 0 8px 8px 0;
        }
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
        }
        [contenteditable] hr {
          margin: 2em 0;
          border: none;
          height: 1px;
          background: #e5e7eb;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        [contenteditable] code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.9em;
          color: #e11d48;
        }
        [contenteditable] .code-block {
          margin: 1.5em 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #334155;
          background: #0f172a;
        }
        [contenteditable] .code-block .code-lang {
          background: #1e293b;
          color: #94a3b8;
          padding: 0.5em 1em;
          font-size: 0.75em;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #334155;
        }
        [contenteditable] .code-block pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1em 1.25em;
          margin: 0;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875em;
          line-height: 1.7;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        [contenteditable] .code-block pre code {
          background: transparent;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }
        [contenteditable] pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          font-size: 0.875em;
          line-height: 1.7;
        }
        [contenteditable] pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
      `}</style>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
        <span>{wordCount} words</span>
        <span className="text-xs text-gray-500">~{Math.ceil(wordCount / 200)} min read</span>
      </div>
    </div>
  );
};

export default RichTextEditor;
