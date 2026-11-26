"use client";
import { useState } from "react";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { useMeQuery } from "@/hooks/use-me-query";
import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";

export function MyEditPage() {
  // [8주차 변경] MOCK_ME → GET /members/me (헤더·마이페이지와 같은 캐시)
  // 수정 후 setQueryData 결과도 바로 반영됨
  const meQuery = useMeQuery();

  // 사용자가 입력하기 전(null)에는 서버의 닉네임을 보여 줌
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const nickname = nicknameInput ?? meQuery.data?.nickname ?? "";

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const showNicknameError = nickname.length > 0 && !isNicknameValid;

  // 중복 확인 상태: 닉네임을 바꾸면 다시 확인해야 함
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  // 현재 닉네임과 같으면 중복 확인할 필요 없음
  const isUnchanged = nickname.trim() === meQuery.data?.nickname;

  const handleChangeNickname = (value: string) => {
    if (isChecking) return;
    setIsAvailable(false);
    setNicknameInput(value);
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || isUnchanged || isChecking) return;

    setIsChecking(true);
    try {
      const response = await checkNicknameDuplicate(nickname.trim());
      setIsAvailable(response.available);
      alert(
        response.available
          ? "사용할 수 있는 닉네임이에요."
          : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setIsAvailable(false);
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsChecking(false);
    }
  };

  // [8주차 추가] PATCH /members/me
  const updateMeMutation = useUpdateMeMutation();
  // 형식이 맞고, 기존 닉네임과 다르고, 중복 확인을 통과해야 저장 가능
  const canSubmit =
    isNicknameValid &&
    !isUnchanged &&
    isAvailable &&
    !updateMeMutation.isPending;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    updateMeMutation.mutate({ nickname: nickname.trim() });
  };

  return (
    <main className="bg-gray-50">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1280px] flex-col px-6 py-8"
      >
        {/* 제목 + 저장 버튼 */}
        <div className="flex items-start justify-between pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">내 정보 수정</h1>
            <p className="text-sm text-gray-500">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-300"
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        {/* 프로필 이미지 + 입력 폼 */}
        <div className="flex gap-11">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="flex w-1/2 flex-col items-center gap-2">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
                </svg>
              </button>
            </div>
            <p className="text-sm font-semibold">프로필 이미지</p>
            <p className="text-xs text-gray-400">선택 사항 · 최대 5MB</p>
          </div>

          {/* 오른쪽: 닉네임, 이메일 */}
          <div className="flex w-1/2 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nickname" className="text-sm font-semibold">
                닉네임
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-blue-600">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => handleChangeNickname(e.target.value)}
                  disabled={meQuery.isLoading || isChecking}
                  className="flex-1 py-3 text-sm outline-none disabled:bg-white"
                />
                <button
                  type="button"
                  disabled={!isNicknameValid || isUnchanged || isChecking}
                  onClick={handleCheckDuplicate}
                  className="shrink-0 text-xs font-semibold text-blue-600 disabled:text-gray-300"
                >
                  {isChecking ? "확인 중" : isAvailable ? "확인 완료" : "중복 확인"}
                </button>
              </div>
              {showNicknameError && (
                <p className="text-xs text-red-500">
                  닉네임은 2자 이상 12자 이하로 입력해 주세요.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={meQuery.data?.email ?? ""}
                readOnly
                className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <div className="mt-auto flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-5 py-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-red-600">회원 탈퇴</p>
            <p className="text-xs text-red-500">
              탈퇴하면 작성한 평점, 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-semibold text-red-600"
          >
            회원 탈퇴
          </button>
        </div>
      </form>
    </main>
  );
}