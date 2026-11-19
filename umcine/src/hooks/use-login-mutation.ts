import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      alert("로그인에 성공했어요.");
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      navigate({ to: "/" });
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}