function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* HEADER */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-base-200 border-b border-base-300 font-semibold text-sm sm:text-base">
        Output
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 text-sm sm:text-base">
        {output === null ? (
          <p className="text-base-content/50">
            Click "Run Code" to see the output here...
          </p>
        ) : output.success ? (
          <pre className="font-mono text-success whitespace-pre-wrap break-words">
            {output.output}
          </pre>
        ) : (
          <div className="space-y-2">
            {output.output && (
              <pre className="font-mono text-base-content whitespace-pre-wrap break-words">
                {output.output}
              </pre>
            )}
            <pre className="font-mono text-error whitespace-pre-wrap break-words">
              {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
