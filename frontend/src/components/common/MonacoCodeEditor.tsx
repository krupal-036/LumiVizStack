// frontend/src/components/common/MonacoCodeEditor.tsx
import React, { useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { FiAlignLeft } from "react-icons/fi";
import { useTheme } from "@/hooks/customHooks";

interface MonacoCodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    height?: string | number;
    language?: string;
    showFormatButton?: boolean;
}

export const MonacoCodeEditor: React.FC<MonacoCodeEditorProps> = ({
    value,
    onChange,
    readOnly = false,
    height = "100%",
    language = "json",
    showFormatButton = true,
}) => {
    const { theme } = useTheme();
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
    };

    const handleFormat = () => {
        if (editorRef.current) {
            editorRef.current.getAction("editor.action.formatDocument")?.run();
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e1e1e] overscroll-contain">
            {showFormatButton && !readOnly && (
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0">
                    <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        {language} Editor
                    </span>
                    <button
                        type="button"
                        onClick={handleFormat}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                        title="Format JSON"
                    >
                        <FiAlignLeft size={13} />
                        Format
                    </button>
                </div>
            )}

            <div className="flex-1 w-full h-full min-h-0 relative touch-pan-y overscroll-contain">
                <Editor
                    height={height}
                    language={language}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    value={value}
                    onChange={(val) => onChange && onChange(val || "")}
                    onMount={handleEditorDidMount}
                    options={{
                        readOnly,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 12.5,
                        tabSize: 2,
                        wordWrap: "on",
                        automaticLayout: true,
                        formatOnPaste: true,
                        formatOnType: true,
                        lineNumbersMinChars: 3,
                        folding: true,
                        smoothScrolling: true,
                        scrollbar: {
                            vertical: "visible",
                            horizontal: "auto",
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                            alwaysConsumeMouseWheel: true,
                        },
                        overviewRulerBorder: false,
                        padding: { top: 8, bottom: 8 },
                    }}
                    loading={
                        <div className="flex items-center justify-center h-full text-xs text-slate-400">
                            Loading editor...
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default MonacoCodeEditor;
