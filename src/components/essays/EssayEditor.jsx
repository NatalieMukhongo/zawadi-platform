import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

const TOOLBAR_BUTTON_BASE =
  "rounded-md px-2.5 py-1.5 text-sm font-semibold hover:bg-green-50";

function ToolbarButton({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${TOOLBAR_BUTTON_BASE} ${active ? "bg-green-100 text-green-800" : "text-gray-600"}`}
    >
      {children}
    </button>
  );
}

export default function EssayEditor({ content, onChange, editable = true }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    editable,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] rounded-b-xl border border-t-0 border-gray-200 bg-white px-4 py-3 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-gray-200 bg-gray-50 px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-gray-300" />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export function essayWordCount(html) {
  const text = (html || "").replace(/<[^>]*>/g, " ").trim();
  return text ? text.split(/\s+/).length : 0;
}
