import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  tracker,
}) {
  const lastCodeRef = useRef("");
  const typingTimeoutRef = useRef(null);

  // typing (debounced)
  const handleChange = (value) => {
    const newCode = value || "";

    onCodeChange(newCode);

    // avoid duplicate logs
    if (newCode === lastCodeRef.current) return;
    lastCodeRef.current = newCode;

    // debounce typing events
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      tracker?.pushEvent("typing", newCode);
    }, 800);
  };

  // run code (instant event)
  const handleRun = () => {
    tracker?.pushEvent("run_code", code);
    onRunCode();
  };

  // language change (instant event)
  const handleLangChange = (e) => {
    tracker?.pushEvent("tab_switch", code);
    onLanguageChange(e);
  };

  return (
    <div className="h-full bg-base-300 flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-3 bg-base-100 border-t border-base-300 gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-5 sm:size-6 flex-shrink-0"
          />

          <select
            className="select select-sm sm:select-md w-full sm:w-auto"
            value={selectedLanguage}
            onChange={handleLangChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm sm:btn-md gap-2 w-full sm:w-auto justify-center"
          disabled={isRunning}
          onClick={handleRun}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="size-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      {/* EDITOR */}
      <div className="flex-1 min-h-[200px]">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditorPanel;
