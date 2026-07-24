import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import justLogo from "../assets/justlogo.png";

type VerificationStatus = "loading" | "success" | "error";

function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const result = searchParams.get("status");
  const resultMessage = searchParams.get("message");
  const redirectStatus: VerificationStatus | null = result === "success" || result === "error" ? result : null;
  const hasNoToken = !token;
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("이메일 인증을 확인하고 있습니다.");
  const displayedStatus = redirectStatus ?? (hasNoToken ? "error" : status);
  const displayedMessage = redirectStatus
    ? resultMessage ||
      (redirectStatus === "success"
        ? "이메일 인증이 완료되었습니다. 로그인해 주세요."
        : "이메일 인증에 실패했습니다. 인증 링크를 다시 확인해 주세요.")
    : hasNoToken
      ? "인증 정보가 없습니다. 이메일의 인증 링크를 다시 열어 주세요."
      : message;

  useEffect(() => {
    if (redirectStatus) return;

    let isMounted = true;

    if (!token) return () => {};

    api.verifyEmail(token)
      .then((response) => {
        if (!isMounted) return;
        setStatus(response.is_verified ? "success" : "error");
        setMessage(response.message);
      })
      .catch((error) => {
        if (!isMounted) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "이메일 인증에 실패했습니다.");
      });

    return () => {
      isMounted = false;
    };
  }, [redirectStatus, token]);

  return (
    <main className="content email-verification-page">
      <section className="email-verification-content" aria-live="polite">
        <img src={justLogo} alt="GameLink 로고" className="email-verification-logo" />
        <p className="email-verification-label">GameLink</p>
        <h1>
          {displayedStatus === "loading" ? "이메일 인증 중" : displayedStatus === "success" ? "이메일 인증 완료" : "이메일 인증 실패"}
        </h1>
        <p className="email-verification-message">{displayedMessage}</p>

        {displayedStatus === "loading" ? <span className="email-verification-spinner" aria-label="인증 처리 중" /> : null}

        {displayedStatus !== "loading" ? (
          <button className="gradient-btn email-verification-login" type="button" onClick={() => navigate("/", { replace: true })}>
            로그인하러 가기
          </button>
        ) : null}
      </section>
    </main>
  );
}

export default EmailVerification;
