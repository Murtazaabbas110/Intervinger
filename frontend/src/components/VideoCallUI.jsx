import React, { useState } from "react";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
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

function VideoCallUI({ chatClient, channel }) {
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

  return (
    <div className="h-full flex flex-col md:flex-row gap-3 relative str-video overflow-hidden">
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Video area: SpeakerLayout should expand to fill this area */}
          <div className="flex-1 min-h-0 bg-base-300 rounded-lg overflow-hidden flex">
            <SpeakerLayout className="flex-1 w-full h-full" />
          </div>

          {/* CALL CONTROLS — pinned bottom, scrollable if inner content overflows */}
          <div className="mt-2 bg-base-100 rounded-lg shadow flex-shrink-0">
            {/* Outer padding scales down on small screens */}
            <div className="p-1 sm:p-2 md:p-3">
              {/* 
      - scale-95 on very small screens makes the whole control slightly smaller
      - sm:scale-100 restores normal size from sm up
      - overflow-x-auto prevents horizontal clipping if controls are horizontal
    */}
              <div className="overflow-x-auto">
                <div className="flex items-center justify-center transform scale-70 md:scale-85 lg:scale-100">
                  <CallControls onLeave={() => navigate("/dashboard")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT DRAWER — overlay, does not affect layout */}
      {chatClient && channel && (
        <div
          className={`fixed top-0 right-0 h-full z-50 bg-[#272a30] flex flex-col shadow-xl transition-all duration-300 ease-in-out ${
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
