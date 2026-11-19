import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "@/api/members/signup";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (response) => {
      alert(response.message);
      navigate({ to: "/login" });
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}