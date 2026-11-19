import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";
import { useSignupMutation } from "@/hooks/use-signup-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

// 중복 확인 상태 기본값
const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 이메일·닉네임 중복 확인 상태
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 회원가입 요청 상태는 useMutation이 관리
  const signupMutation = useSignupMutation();

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효한지
  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  // 이메일·닉네임을 바꾸면 중복 확인을 다시 해야 함
  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 중복 확인 요청
  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  // 회원가입 요청
  // 성공·실패 처리는 useSignupMutation의 onSuccess·onError에서 담당
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex justify-center bg-gray-50 px-4 py-20">
      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-[430px] flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">회원가입</h1>

        {/* 이메일 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            이메일
          </label>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-blue-600">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              className="flex-1 py-3 text-sm outline-none disabled:bg-white"
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className="shrink-0 text-xs font-semibold text-blue-600 disabled:text-gray-300"
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className="text-xs text-red-500">
              올바른 이메일 형식을 입력해 주세요.
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nickname" className="text-sm font-semibold">
            닉네임
          </label>
          <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-blue-600">
            <input
              id="nickname"
              type="text"
              placeholder="2~12자"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              className="flex-1 py-3 text-sm outline-none disabled:bg-white"
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className="shrink-0 text-xs font-semibold text-blue-600 disabled:text-gray-300"
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className="text-xs text-red-500">
              닉네임은 2자 이상 12자 이하로 입력해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600"
          />
          <p
            className={`text-xs ${showPasswordError ? "text-red-500" : "text-gray-400"}`}
          >
            영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해
            주세요.
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="passwordConfirm" className="text-sm font-semibold">
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600"
          />
          {showPasswordConfirmError && (
            <p className="text-xs text-red-500">비밀번호가 일치하지 않아요.</p>
          )}
        </div>

        {/* 요청 중에는 비활성화하고 문구 변경 */}
        <button
          type="submit"
          disabled={!canSubmit || signupMutation.isPending}
          className="rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white disabled:bg-gray-300"
        >
          {signupMutation.isPending ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          {/* /login 라우트가 생겨서 a → Link로 변경 */}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}