import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function TopUp() {
    const [accounts, setAccounts] = useState([]);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        api
            .get("/accounts")
            .then((res) => setAccounts(res.data))
            .catch(() => toast.error("Failed to load accounts"));
    }, []);

    const onSubmit = async (data) => {
        try {
            const req = {
                accountId: data.accountId,
                // 💶 convert EUR → cents
                amount: Math.round(parseFloat(data.amount) * 100),
                currency: "EUR", // always EUR
                successUrl: window.location.origin + "/topup/success",
                cancelUrl: window.location.origin + "/topup/cancel",
            };

            const res = await api.post("/payments/topup", req);
            window.location.href = res.data.checkoutUrl;
        } catch {
            toast.error("Top-up failed");
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Top-up Account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Select account */}
                <div>
                    <label className="block text-sm">Select Account</label>
                    <select
                        {...register("accountId", { required: "Account is required" })}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="">Choose account</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.currencyType} | {a.iban} | Balance: {a.balance}
                            </option>
                        ))}
                    </select>
                    {errors.accountId && (
                        <p className="text-sm text-red-600">{errors.accountId.message}</p>
                    )}
                </div>

                {/* Amount in EUR */}
                <div>
                    <label className="block text-sm">Amount (EUR)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("amount", {
                            required: "Amount is required",
                            min: { value: 1, message: "Minimum 1 EUR" },
                        })}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                    {errors.amount && (
                        <p className="text-sm text-red-600">{errors.amount.message}</p>
                    )}
                </div>

                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black"
                >
                    {isSubmitting ? "Redirecting..." : "Proceed to Payment"}
                </button>
            </form>
        </div>
    );
}
