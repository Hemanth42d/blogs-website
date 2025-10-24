import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Modal from "./Modal";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing...",
}) => {
  const editorRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  // Initialize word count on component mount and value changes
  useEffect(() => {
    if (editorRef.current) {
      const textContent =
        editorRef.current.textContent || editorRef.current.innerText || "";
      const words = textContent
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      setWordCount(textContent.trim() ? words.length : 0);
    }
  }, [value]);

  // Format text functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    // Trigger onChange to update parent state
    setTimeout(() => {
      const content = editorRef.current?.innerHTML || "";
      onChange(content);
    }, 0);
  };

  const handleInput = (e) => {
    const content = e.target.innerHTML;
    onChange(content);

    // Update word count
    const textContent = e.target.textContent || e.target.innerText || "";
    const words = textContent
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  };
  const handleSelection = () => {
    const selection = window.getSelection();
    setSelectedText(selection.toString());
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "k": // Ctrl/Cmd + K for link
          e.preventDefault();
          insertLink();
          break;
        case "e": // Ctrl/Cmd + E for inline code
          e.preventDefault();
          insertInlineCode();
          break;
        case "`": // Ctrl/Cmd + ` for code block
          e.preventDefault();
          insertCodeBlock();
          break;
        case "Enter": // Ctrl/Cmd + Enter for divider
          e.preventDefault();
          insertDivider();
          break;
        default:
          break;
      }
    }
  };

  // Modal-driven input handlers (replaces prompt())
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [modalExtra, setModalExtra] = useState(""); // used for alt text / language
  const [modalMultiline, setModalMultiline] = useState(false);
  const [modalConfirmAction, setModalConfirmAction] = useState(() => () => {});

  const openModal = ({ title, value = "", extra = "", onConfirm }) => {
    setModalTitle(title);
    setModalValue(value);
    setModalExtra(extra);
    setModalConfirmAction(() => () => onConfirm(modalValue, modalExtra));
    setModalOpen(true);
  };

  // Because setState is async, we provide confirm handlers that read current fields directly
  const confirmModal = () => {
    setModalOpen(false);
    // call the stored action with latest values
    modalConfirmAction(modalValue, modalExtra);
  };

  const cancelModal = () => {
    setModalOpen(false);
  };

  const insertLink = () => {
    setModalTitle("Insert Link");
    setModalValue("");
    setModalExtra("");
    setModalMultiline(false);
    setModalConfirmAction(() => (value) => {
      if (value && value.trim()) {
        execCommand("createLink", value.trim());
      }
    });
    setModalOpen(true);
  };

  const insertImage = () => {
    // open modal to collect URL and alt text
    setModalTitle("Insert Image");
    setModalValue("");
    setModalExtra("");
    setModalMultiline(false);
    setModalConfirmAction(() => (value, extra) => {
      const url = value?.trim();
      const altText = (extra && extra.trim()) || "";
      if (url) {
        const img = `<div style="margin: 1.5em 0; text-align: center;"><img src="${url}" alt="${
          altText || "Blog image"
        }" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />${
          altText
            ? `<p style="margin-top: 0.5em; font-size: 0.875em; color: #6b7280; font-style: italic;">${altText}</p>`
            : ""
        }</div>`;
        document.execCommand("insertHTML", false, img);
        setTimeout(() => {
          const content = editorRef.current?.innerHTML || "";
          onChange(content);
        }, 0);
      }
    });
    setModalOpen(true);
  };

  const insertCodeBlock = () => {
    // open modal to collect code and optional language
    setModalTitle("Insert Code Block");
    setModalValue("");
    setModalExtra("");
    setModalMultiline(true);
    setModalConfirmAction(() => (value, extra) => {
      const code = value || "";
      const language = extra || "";
      if (code) {
        const languageLabel = language
          ? `<div style="background: #e2e8f0; color: #475569; padding: 0.25em 0.75em; font-size: 0.75em; font-weight: 600; border-radius: 6px 6px 0 0; margin: 0; font-family: 'Courier New', monospace;">${language.toUpperCase()}</div>`
          : "";
        const codeBlock = `<div style="margin: 1.5em 0; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">${languageLabel}<pre style="background: #1e293b; color: #e2e8f0; padding: 1.25em; margin: 0; font-family: 'Courier New', monospace, 'SF Mono', 'Monaco', 'Inconsolata'; font-size: 14px; line-height: 1.5; overflow-x: auto;"><code>${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>")}</code></pre></div>`;
        document.execCommand("insertHTML", false, codeBlock);
        setTimeout(() => {
          const content = editorRef.current?.innerHTML || "";
          onChange(content);
        }, 0);
      }
    });
    setModalOpen(true);
  };

  const insertInlineCode = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText) {
        const codeSpan = `<code style="background: #f8fafc; color: #0f172a; padding: 3px 6px; border-radius: 4px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace; font-size: 0.875em; border: 1px solid #e2e8f0;">${selectedText}</code>`;
        document.execCommand("insertHTML", false, codeSpan);
      } else {
        // open modal to collect inline code when nothing selected
        setModalTitle("Insert Inline Code");
        setModalValue("");
        setModalExtra("");
        setModalConfirmAction(() => (value) => {
          const c = value || "";
          if (c) {
            const codeSpan = `<code style="background: #f8fafc; color: #0f172a; padding: 3px 6px; border-radius: 4px; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace; font-size: 0.875em; border: 1px solid #e2e8f0;">${c}</code>`;
            document.execCommand("insertHTML", false, codeSpan);
            setTimeout(() => {
              const content = editorRef.current?.innerHTML || "";
              onChange(content);
            }, 0);
          }
        });
        setModalOpen(true);
      }

      setTimeout(() => {
        const content = editorRef.current?.innerHTML || "";
        onChange(content);
      }, 0);
    }
  };

  const insertDivider = () => {
    const divider = `<hr style="margin: 2em 0; border: none; height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent);" />`;
    document.execCommand("insertHTML", false, divider);
    setTimeout(() => {
      const content = editorRef.current?.innerHTML || "";
      onChange(content);
    }, 0);
  };

  const formatButtons = [
    {
      icon: "B",
      command: "bold",
      title: "Bold",
      style: "font-bold",
    },
    {
      icon: "I",
      command: "italic",
      title: "Italic",
      style: "italic",
    },
    {
      icon: "U",
      command: "underline",
      title: "Underline",
      style: "underline",
    },
    {
      icon: "H1",
      command: "formatBlock",
      value: "h1",
      title: "Heading 1",
      style: "",
    },
    {
      icon: "H2",
      command: "formatBlock",
      value: "h2",
      title: "Heading 2",
      style: "",
    },
    {
      icon: "H3",
      command: "formatBlock",
      value: "h3",
      title: "Heading 3",
      style: "",
    },
    {
      icon: "•",
      command: "insertUnorderedList",
      title: "Bullet List",
      style: "",
    },
    {
      icon: "1.",
      command: "insertOrderedList",
      title: "Numbered List",
      style: "",
    },
    {
      icon: '""',
      command: "formatBlock",
      value: "blockquote",
      title: "Quote",
      style: "",
    },
    {
      icon: "🖼️",
      command: "custom",
      action: insertImage,
      title: "Insert Image",
      style: "",
    },
    {
      icon: "{ }",
      command: "custom",
      action: insertCodeBlock,
      title: "Code Block (Ctrl+`)",
      style: "font-mono",
    },
    {
      icon: "`<>`",
      command: "custom",
      action: insertInlineCode,
      title: "Inline Code (Ctrl+E)",
      style: "font-mono text-xs",
    },
    {
      icon: "🔗",
      command: "custom",
      action: insertLink,
      title: "Insert Link (Ctrl+K)",
      style: "",
    },
    {
      icon: "—",
      command: "custom",
      action: insertDivider,
      title: "Insert Divider (Ctrl+Enter)",
      style: "",
    },
  ];

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      {/* Modal for collecting user input (replaces prompt/alert) */}
      <Modal
        isOpen={modalOpen}
        title={modalTitle}
        onClose={cancelModal}
        onConfirm={confirmModal}
        confirmLabel="Insert"
        cancelLabel="Cancel"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Value</label>
          {modalMultiline ? (
            <textarea
              autoFocus
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              rows={8}
              className="w-full border px-3 py-2 rounded-md font-mono text-sm"
            />
          ) : (
            <input
              autoFocus
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              className="w-full border px-3 py-2 rounded-md"
            />
          )}
          {/* Extra field (alt text, language, etc.) */}
          <label className="text-sm text-gray-700">Extra (optional)</label>
          <input
            value={modalExtra}
            onChange={(e) => setModalExtra(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
          <p className="text-xs text-gray-500">
            Use the top field for main input (URL/code). Use Extra for alt text
            or language when relevant.
          </p>
        </div>
      </Modal>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {formatButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (button.command === "custom" && button.action) {
                  button.action();
                } else {
                  execCommand(button.command, button.value);
                }
              }}
              className={`
                px-3 py-1 text-sm border border-gray-300 rounded-md
                hover:bg-white hover:shadow-sm transition-all
                ${button.style}
              `}
              title={button.title}
            >
              {button.icon}
            </button>
          ))}

          <div className="w-px bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => execCommand("removeFormat")}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-white hover:shadow-sm transition-all"
            title="Clear Formatting"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onKeyDown={handleKeyDown}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          minHeight: "400px",
          lineHeight: "1.6",
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0;
        }
        
        [contenteditable] blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 4px solid #e5e7eb;
          color: #6b7280;
          font-style: italic;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] p {
          margin: 0.5em 0;
        }
      `}</style>

      {/* Word Count */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
        <span>{wordCount} words</span>
        <span className="text-xs text-gray-500">
          {Math.ceil(wordCount / 200)} min read
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
