import { useRef, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Bold, Italic, Underline, List, ListOrdered,
  Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Minus, Undo, Redo, RemoveFormatting
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label: string;
  testId?: string;
}

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded transition-colors ${active ? "bg-[#F5A623] text-white" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}
      title={title}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, label, testId }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const cleanPastedHtml = useCallback((html: string): string => {
    let clean = html
      .replace(/<!--\s*Start\s*Fragment\s*-->/gi, "")
      .replace(/<!--\s*End\s*Fragment\s*-->/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/ data-[a-z-]+="[^"]*"/gi, "")
      .replace(/ class="[^"]*"/gi, "")
      .replace(/ style="[^"]*"/gi, "")
      .replace(/<meta[^>]*>/gi, "")
      .replace(/<\/?span[^>]*>/gi, "")
      .replace(/<\/?div[^>]*>/gi, "")
      .replace(/<\/?font[^>]*>/gi, "");
    return clean;
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const plain = e.clipboardData.getData("text/plain");
    const content = html ? cleanPastedHtml(html) : plain;
    document.execCommand("insertHTML", false, content);
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, cleanPastedHtml]);

  return (
    <div>
      <Label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{label}</Label>
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
          <ToolbarButton onClick={() => exec("bold")} title="Bold">
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("italic")} title="Italic">
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("underline")} title="Underline">
            <Underline className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => exec("formatBlock", "<h2>")} title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("formatBlock", "<h3>")} title="Heading 3">
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("formatBlock", "<p>")} title="Paragraph">
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Bullet List">
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("insertOrderedList")} title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => exec("justifyLeft")} title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("justifyCenter")} title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("justifyRight")} title="Align Right">
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => exec("insertHorizontalRule")} title="Horizontal Line">
            <Minus className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("removeFormat")} title="Clear Formatting">
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarButton>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <ToolbarButton onClick={() => exec("undo")} title="Undo">
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => exec("redo")} title="Redo">
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          className="min-h-[180px] px-4 py-3 text-sm text-gray-800 leading-relaxed focus:outline-none prose prose-sm max-w-none
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
            [&_li]:my-0.5
            [&_p]:my-1"
          data-testid={testId}
        />
      </div>
    </div>
  );
}
