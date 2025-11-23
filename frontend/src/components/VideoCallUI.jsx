import React, { useState } from "react";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  Loader2Icon,
  LogOutIcon,
  MessageSquareIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import { useLeaveSession } from "../hooks/useSessions";

function VideoCallUI({
  chatClient,
  channel,
  isHost,
  handleEndSession,
  session,
  endSessionMutation,
  sessionId,
}) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  const leaveSessionMutation = useLeaveSession();

  const handleLeave = () => {
    leaveSessionMutation.mutate(sessionId, {
      onSuccess: () => {
        navigate("/dashboard"); // then navigate
      },
    });
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-3 relative str-video">
      {/* LEFT SIDE — VIDEO & CONTROLS */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-base-100 p-2 sm:p-3 rounded-lg shadow flex-shrink-0">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="font-semibold text-sm sm:text-base">
              {participantCount}{" "}
              {participantCount === 1 ? "participant" : "participants"}
            </span>
            {/* Only show End button if user is host and session is active */}
            {isHost && session?.status === "active" && (
              <button
                onClick={handleEndSession}
                disabled={endSessionMutation.isPending}
                className="btn btn-error btn-xs sm:btn-sm ml-2 flex items-center gap-1"
              >
                {endSessionMutation.isPending ? (
                  <Loader2Icon className="w-3 h-3 animate-spin" />
                ) : (
                  <LogOutIcon className="w-3 h-3" />
                )}
                End
              </button>
            )}
          </div>

          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen((s) => !s)}
              className={`btn btn-xs sm:btn-sm gap-2 mt-2 sm:mt-0 ${
                isChatOpen ? "btn-primary" : "btn-ghost"
              }`}
              aria-pressed={isChatOpen}
              aria-label={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="size-4 sm:size-5" />
              Chat
            </button>
          )}
        </div>

        {/* VIDEO + CONTROLS container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* VIDEO AREA */}
          <div className="video-area flex-1 min-h-0 bg-base-300 rounded-lg relative flex">
            <SpeakerLayout className="w-full h-full" />

            {/* FLOATING CONTROLS (md and up) */}
            <div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-4 z-[99]"
              style={{ maxWidth: "90%" }}
            >
              <CallControls onLeave={handleLeave} />
            </div>
          </div>

          {/* SMALL-SCREEN CONTROLS (sm only) */}
          <div className="mt-2 md:hidden overflow-x-auto px-2">
            <div className="flex gap-2 w-max mx-auto">
              <CallControls onLeave={handleLeave} />
            </div>
          </div>
        </div>
      </div>

      {/* CHAT DRAWER — overlay, does not affect layout */}
      {chatClient && channel && (
        <div
          className={`fixed top-0 right-0 h-full z-[100] bg-[#272a30] flex flex-col shadow-xl transition-all duration-300 ease-in-out ${
            isChatOpen
              ? "w-72 sm:w-80 opacity-100"
              : "w-0 opacity-0 pointer-events-none"
          }`}
          aria-hidden={!isChatOpen}
        >
          {isChatOpen && (
            <>
              <div className="bg-[#1c1e22] p-3 border-b border-[#3a3d44] flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  Session Chat
                </h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <XIcon className="size-5 sm:size-6" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden stream-chat-dark min-h-0">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <div className="flex-1 overflow-y-auto min-h-0">
                        <MessageList />
                      </div>
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
