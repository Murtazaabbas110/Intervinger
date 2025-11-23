import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

//============= Custom Hooks For Readability and management =============
export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["activeSessions"],
    queryFn: () => sessionApi.getActiveSessions(),
    staleTime: 0, // force fresh data every time
    refetchOnWindowFocus: true, // optional: refetch when tab gains focus
    refetchInterval: 5000, 
  });
};

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  });

  return result;
};

export const useSessionById = (id) => {
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  return result;
};

export const useJoinSession = () => {
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to end session"),
  });

  return result;
};

export const useLeaveSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId) => sessionApi.leaveSession(sessionId),

    // optimistic update: remove participant locally immediately
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries(["activeSessions"]);
      const previous = queryClient.getQueryData(["activeSessions"]);

      queryClient.setQueryData(["activeSessions"], (old) => {
        if (!old) return old;
        // old is { sessions: [...] } or might be an array depending on your queryFn,
        // handle both shapes gracefully:
        const sessionsArr = old.sessions ?? old;
        const updated = sessionsArr.map((s) =>
          s._id === sessionId ? { ...s, participant: null } : s
        );
        return old.sessions ? { ...old, sessions: updated } : updated;
      });

      return { previous };
    },

    onError: (err, sessionId, context) => {
      // rollback on error
      if (context?.previous) {
        queryClient.setQueryData(["activeSessions"], context.previous);
      }
      toast.error(err?.response?.data?.message || "Failed to leave session");
    },

    onSettled: (_, __, sessionId) => {
      // final refetch to ensure server truth wins
      queryClient.invalidateQueries(["activeSessions"]);
      queryClient.invalidateQueries(["session", sessionId]);
    },

    onSuccess: () => {
      toast.success("You left the session");
    },
  });
};
