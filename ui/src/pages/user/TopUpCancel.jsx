import { Link } from "react-router-dom";

export default function TopUpCancel() {
    return (
        <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-red-600">Payment Cancelled ❌</h1>
            <p className="mt-4">Your payment was not completed.</p>
            <Link
                to="/topup"
                className="mt-6 inline-block px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
            >
                Try Again
            </Link>
        </div>
    );
}
