"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mx-auto mt-10 max-w-sm rounded-2xl border border-line bg-white p-6 md:p-8">
      <label htmlFor="password" className="block font-semibold text-ink">
        관리자 비밀번호
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        aria-describedby={state.error ? "login-error" : undefined}
        className="mt-2 block h-12 w-full rounded-lg border border-line px-4 text-base focus:border-brand-500"
      />
      {state.error && (
        <p id="login-error" role="alert" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 h-12 w-full rounded-lg bg-brand-600 font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
