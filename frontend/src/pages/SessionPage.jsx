import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useEndSession,
  useJoinSession,
  useSessionById,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const {
    data: sessionData,
    isLoading: loadingSession,
    refetch,
  } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } =
    useStreamClient(session, loadingSession, isHost, isParticipant);

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    problemData?.starterCode?.[selectedLanguage] || ""
  );

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });

    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (
      confirm(
        "Are you sure you want to end this session? All participants will be notified."
      )
    ) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, {
        onSuccess: () => navigate("/dashboard"),
      });
    }
  };

  const [mobileView, setMobileView] = useState("video"); // "video" | "description" | "code"

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        {/* ----------------- MOBILE / TABLET (sm, md) ----------------- */}
        <div className="lg:hidden h-full flex flex-col">
          {/* Top toggles (Video / Description / Code) */}
          <div className="p-3 flex items-center gap-2 bg-base-100 border-b border-base-300 shadow-sm">
            <button
              onClick={() => setMobileView("video")}
              className={`btn btn-sm ${
                mobileView === "video" ? "btn-primary" : "btn-ghost"
              }`}
              aria-pressed={mobileView === "video"}
            >
              Video
            </button>

            <button
              onClick={() => setMobileView("description")}
              className={`btn btn-sm ${
                mobileView === "description" ? "btn-primary" : "btn-ghost"
              }`}
              aria-pressed={mobileView === "description"}
            >
              Description
            </button>

            <button
              onClick={() => setMobileView("code")}
              className={`btn btn-sm ${
                mobileView === "code" ? "btn-primary" : "btn-ghost"
              }`}
              aria-pressed={mobileView === "code"}
            >
              Code
            </button>

            <div className="ml-auto text-sm text-base-content/60">
              Tap to toggle panels
            </div>
          </div>

          {/* Mobile content area */}
          <div className="flex-1 overflow-auto">
            {mobileView === "description" ? (
              /* ---------- MOBILE DESCRIPTION VIEW ---------- */
              <div className="h-full overflow-y-auto bg-base-200">
                <div className="p-4 bg-base-100 border-b border-base-300 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold break-words">
                      {session?.problem || "Loading..."}
                    </h1>
                    {problemData?.category && (
                      <p className="text-sm text-base-content/60 mt-1">
                        {problemData.category}
                      </p>
                    )}
                    <p className="text-sm text-base-content/60 mt-1">
                      Host: {session?.host?.name || "Loading..."} •{" "}
                      {session?.participant ? 2 : 1}/2
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Difficulty badge */}
                    <span
                      className={`badge ${getDifficultyBadgeClass(
                        session?.difficulty
                      )}`}
                    >
                      {session?.difficulty
                        ? session.difficulty.charAt(0).toUpperCase() +
                          session.difficulty.slice(1)
                        : "Easy"}
                    </span>

                    {/* End session (only host, same disabled state) */}
                    {isHost && session?.status === "active" && (
                      <button
                        onClick={handleEndSession}
                        disabled={endSessionMutation.isPending}
                        className="btn btn-error btn-xs sm:btn-sm"
                      >
                        {endSessionMutation.isPending ? (
                          <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <LogOutIcon className="w-4 h-4 mr-2" />
                        )}
                        End
                      </button>
                    )}

                    {/* Completed badge if session finished */}
                    {session?.status === "completed" && (
                      <span className="badge badge-ghost text-xs">
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Description */}
                  {problemData?.description && (
                    <div className="bg-base-100 rounded-xl shadow p-4 border border-base-300">
                      <h2 className="text-lg font-bold mb-2">Description</h2>
                      <div className="text-sm text-base-content/90 space-y-2">
                        <p>{problemData.description.text}</p>
                        {problemData.description.notes?.map((note, i) => (
                          <p key={i}>{note}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Examples */}
                  {problemData?.examples?.length > 0 && (
                    <div className="bg-base-100 rounded-xl shadow p-4 border border-base-300">
                      <h2 className="text-lg font-bold mb-2">Examples</h2>
                      <div className="space-y-3">
                        {problemData.examples.map((ex, idx) => (
                          <div key={idx} className="bg-base-200 rounded p-3">
                            <div className="text-sm font-mono">
                              <strong>Input:</strong> {ex.input}
                            </div>
                            <div className="text-sm font-mono mt-1">
                              <strong>Output:</strong> {ex.output}
                            </div>
                            {ex.explanation && (
                              <div className="text-xs text-base-content/60 mt-2">
                                Explanation: {ex.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Constraints */}
                  {problemData?.constraints?.length > 0 && (
                    <div className="bg-base-100 rounded-xl shadow p-4 border border-base-300">
                      <h2 className="text-lg font-bold mb-2">Constraints</h2>
                      <ul className="list-disc pl-5 text-sm space-y-1 text-base-content/90">
                        {problemData.constraints.map((c, i) => (
                          <li key={i}>
                            <code>{c}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : mobileView === "code" ? (
              /* ---------- MOBILE CODE VIEW ---------- */
              <div className="h-full flex flex-col overflow-hidden">
                <div className="p-3 bg-base-100 border-b border-base-300 flex items-center justify-between">
                  <div className="font-semibold">Editor</div>
                  <div className="text-sm text-base-content/60">
                    {selectedLanguage}
                  </div>
                </div>

                <div className="flex-1 min-h-0">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-hidden">
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value)}
                        onRunCode={handleRunCode}
                      />
                    </div>

                    <div className="h-48 border-t border-base-300">
                      <OutputPanel output={output} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ---------- MOBILE VIDEO VIEW (default) ---------- */
              <div className="h-full flex flex-col overflow-hidden">
                <div className="flex-1 p-3 min-h-0">
                  {isInitializingCall ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                        <p className="text-lg">Connecting to video call...</p>
                      </div>
                    </div>
                  ) : !streamClient || !call ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="card bg-base-100 shadow-xl w-full max-w-md">
                        <div className="card-body items-center text-center">
                          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-4">
                            <PhoneOffIcon className="w-12 h-12 text-error" />
                          </div>
                          <h2 className="card-title">Connection Failed</h2>
                          <p className="text-base-content/70">
                            Unable to connect to the video call
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col overflow-hidden">
                      <StreamVideo client={streamClient}>
                        <StreamCall call={call}>
                          <VideoCallUI
                            chatClient={chatClient}
                            channel={channel}
                          />
                        </StreamCall>
                      </StreamVideo>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ----------------- DESKTOP (lg and up) — original panels ----------------- */}
        <div className="hidden lg:block h-full">
          <PanelGroup direction="horizontal">
            {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
            <Panel
              defaultSize={50}
              minSize={30}
              className="flex flex-col overflow-hidden"
            >
              <PanelGroup direction="vertical">
                {/* PROBLEM DESC PANEL */}
                <Panel
                  defaultSize={50}
                  minSize={20}
                  className="flex flex-col overflow-auto"
                >
                  <div className="h-full overflow-y-auto bg-base-200">
                    {/* HEADER SECTION */}
                    <div className="p-4 sm:p-6 md:p-8 xl:p-10 bg-base-100 border-b border-base-300">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3 sm:gap-0">
                        <div className="flex-1">
                          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold text-base-content break-words">
                            {session?.problem || "Loading..."}
                          </h1>
                          {problemData?.category && (
                            <p className="text-base-content/60 mt-1 text-sm sm:text-base md:text-lg xl:text-xl">
                              {problemData.category}
                            </p>
                          )}
                          <p className="text-base-content/60 mt-2 text-sm sm:text-base md:text-lg xl:text-xl">
                            Host: {session?.host?.name || "Loading..."} •{" "}
                            {session?.participant ? 2 : 1}/2 participants
                          </p>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                          <span
                            className={`badge badge-lg ${getDifficultyBadgeClass(
                              session?.difficulty
                            )}`}
                          >
                            {session?.difficulty
                              ? session.difficulty.charAt(0).toUpperCase() +
                                session.difficulty.slice(1)
                              : "Easy"}
                          </span>

                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={endSessionMutation.isPending}
                              className="btn btn-error btn-sm gap-2 text-xs sm:text-sm md:text-base"
                            >
                              {endSessionMutation.isPending ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="w-4 h-4" />
                              )}
                              End Session
                            </button>
                          )}

                          {session?.status === "completed" && (
                            <span className="badge badge-ghost badge-lg text-xs sm:text-sm md:text-base">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8 xl:p-10 space-y-4 sm:space-y-6 md:space-y-8 xl:space-y-10">
                      {/* PROBLEM DESCRIPTION / EXAMPLES / CONSTRAINTS */}
                      {problemData?.description && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 md:p-6 xl:p-8 border border-base-300">
                          <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mb-2 sm:mb-4 text-base-content">
                            Description
                          </h2>
                          <div className="space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg xl:text-xl leading-relaxed">
                            <p className="text-base-content/90">
                              {problemData.description.text}
                            </p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="text-base-content/90">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {problemData?.examples?.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 md:p-6 xl:p-8 border border-base-300">
                          <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mb-2 sm:mb-4 text-base-content">
                            Examples
                          </h2>
                          <div className="space-y-3 sm:space-y-4 md:space-y-5 xl:space-y-6">
                            {problemData.examples.map((example, idx) => (
                              <div key={idx}>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                  <span className="badge badge-sm">
                                    {idx + 1}
                                  </span>
                                  <p className="font-semibold text-base-content text-sm sm:text-base md:text-lg xl:text-lg">
                                    Example {idx + 1}
                                  </p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-3 sm:p-4 md:p-5 xl:p-6 font-mono text-xs sm:text-sm md:text-base xl:text-base space-y-1.5 break-words">
                                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                    <span className="text-primary font-bold min-w-[70px]">
                                      Input:
                                    </span>
                                    <span>{example.input}</span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                    <span className="text-secondary font-bold min-w-[70px]">
                                      Output:
                                    </span>
                                    <span>{example.output}</span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-1 sm:pt-2 border-t border-base-300 mt-1 sm:mt-2">
                                      <span className="text-base-content/60 font-sans text-xs sm:text-sm md:text-base xl:text-base">
                                        <span className="font-semibold">
                                          Explanation:
                                        </span>{" "}
                                        {example.explanation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {problemData?.constraints?.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-4 sm:p-5 md:p-6 xl:p-8 border border-base-300">
                          <h2 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold mb-2 sm:mb-4 text-base-content">
                            Constraints
                          </h2>
                          <ul className="space-y-1 sm:space-y-2 md:space-y-3 xl:space-y-4 text-sm sm:text-base md:text-lg xl:text-lg text-base-content/90">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-2 break-words">
                                <span className="text-primary">•</span>
                                <code>{constraint}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                {/* Code Panel */}
                <Panel
                  defaultSize={50}
                  minSize={20}
                  className="flex flex-col overflow-hidden"
                >
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={70} minSize={30}>
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value)}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                    <Panel defaultSize={30} minSize={15}>
                      <OutputPanel output={output} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
            <Panel
              defaultSize={50}
              minSize={30}
              className="flex flex-col overflow-hidden"
            >
              <div className="flex-1 flex flex-col p-2 sm:p-4 md:p-6 xl:p-8">
                {isInitializingCall ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                      <p className="text-lg sm:text-xl md:text-2xl xl:text-3xl">
                        Connecting to video call...
                      </p>
                    </div>
                  </div>
                ) : !streamClient || !call ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="card bg-base-100 shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl">
                      <div className="card-body items-center text-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 bg-error/10 rounded-full flex items-center justify-center mb-4">
                          <PhoneOffIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 text-error" />
                        </div>
                        <h2 className="card-title text-xl sm:text-2xl md:text-3xl xl:text-4xl">
                          Connection Failed
                        </h2>
                        <p className="text-base-content/70 text-sm sm:text-base md:text-lg xl:text-lg">
                          Unable to connect to the video call
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI
                          chatClient={chatClient}
                          channel={channel}
                        />
                      </StreamCall>
                    </StreamVideo>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}

export default SessionPage;
