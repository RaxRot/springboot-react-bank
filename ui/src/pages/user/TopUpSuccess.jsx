import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function TopUpSuccess() {
    const [params] = useSearchParams();

    useEffect(() => {
        const sessionId = params.get("session_id");
        if (sessionId) {
            api
                .get(`/payments/verify?session_id=${sessionId}`)
                .then(() => toast.success("✅ Payment verified and credited"))
                .catch(() => toast.error("⚠️ Could not verify payment"));
        }
    }, [params]);

    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
            <p className="mt-4">Your account has been credited.</p>
            <Link
                to="/accounts"
                className="mt-6 inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
            >
                Go to Accounts
            </Link>
        </div>
    );
}
