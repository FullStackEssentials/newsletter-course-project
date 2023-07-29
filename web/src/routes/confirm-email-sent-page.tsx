import { useLocation, useNavigate } from "react-router-dom";

export const ConfirmEmailSentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state as { email?: string }

  const handleGoBack = () => navigate("/");

  return (
    <div>
      <div className="m-4 mb-10 text-center text-3xl font-bold text-gray-700">
        <h1>
          A confirmation email as been sent to{" "}
          <span className="underline text-orange-600">{email}</span>
        </h1>
        <h2>Please confirm to finish the signup to the newsletter</h2>
      </div>

      <div className="flex justify-center">
        <button onClick={handleGoBack} className="border rounded p-2">
          Go back
        </button>
      </div>
    </div>
  );
};
