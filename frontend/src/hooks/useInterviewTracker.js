import { useRef } from "react";
import axiosInstance from "../lib/axios";

export function useInterviewTracker({ sessionId, userId, language }) {
  const queue = useRef([]);

  const pushEvent = (eventType, codeSnapshot) => {
    const event = {
      sessionId,
      userId,
      eventType,
      codeSnapshot,
      language,
      createdAt: new Date().toISOString(),
    };

    queue.current.push(event);

    console.log("[Tracker] Event pushed:", event);
    console.log("[Tracker] Queue size:", queue.current.length);
  };

  const flushEvents = async () => {
    if (!queue.current.length) {
      console.log("[Tracker] Flush skipped - empty queue");
      return;
    }

    const batch = [...queue.current];
    queue.current = [];

    console.log("[Tracker] Flushing batch:", batch.length);
    console.log("[Tracker] Payload:", batch);

    try {
      const res = await axiosInstance.post("/activity", batch);

      console.log("[Tracker] Flush success:", res.data);
    } catch (err) {
      console.error("[Tracker] Flush failed:", err?.response?.data || err.message);

      // restore queue on failure
      queue.current = batch.concat(queue.current);

      console.log("[Tracker] Queue restored, size:", queue.current.length);
    }
  };

  return { pushEvent, flushEvents };
}