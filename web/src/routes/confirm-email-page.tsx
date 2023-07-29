import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { API_URL } from "../utils/constants"

export const ConfirmEmailPage = () => {
  const [, setHasConfirmed] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  const params = location.search;

  useEffect(() => {
    const parsedParams = new URLSearchParams(params);
    const email = parsedParams.get("email");
    const token = parsedParams.get("token");

    if (!email || !token) return;

    void (async () => {
      try {
        const body = JSON.stringify({ email, token });

        const response = await fetch(`${API_URL}/newsletter/confirm-email`, {
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const isOkRequest = response.status === 200;
        setHasConfirmed(!!isOkRequest);
      } catch (error) {
        setHasConfirmed(false);
      }
    })();
  }, [params, setHasConfirmed]);

  const handleGoBack = () => navigate("/");

  return (
    <div>
      <div className="m-4 mb-10 text-center text-3xl font-bold text-gray-700">
        <h1>
          You've successfully signup to the newsletter
          <br /> see you soon <span>👋</span> !
        </h1>
      </div>

      <div className="flex justify-center">
        <button onClick={handleGoBack} className="border rounded p-2">
          Awesome
        </button>
      </div>
    </div>
  );
};
