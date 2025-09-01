import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BillingSuper() {
    const { user, signout } = useAuth();
    const nav = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [accountId, setAccountId] = useState("");
    const alreadySuper = user?.roles?.includes("ROLE_SUPER_USER") || user?.roles?.includes("ROLE_ADMIN");

    useEffect(() => {
        if (!alreadySuper) {
            api.get("/accounts").then(res => setAccounts(res.data || [])).catch(() => {});
        }
    }, [alreadySuper]);

    if (alreadySuper) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-2xl font-bold mb-2">🎖 You already have Super status</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Unlimited accounts, enhanced limits and priority features are enabled.
                    </p>
                </div>
            </div>
        );
    }

    const onBuy = async () => {
        if (!accountId) return toast.error("Please select an account");
        if (!window.confirm("Activate SUPER_USER for 20 EUR? Funds will be converted if needed.")) return;

        try {
            const { data } = await api.post("/billing/super-user/purchase", { accountId: Number(accountId) });
            toast.success(`SUPER_USER activated. Debited ${data.debited} ${data.currency}`);


            await signout();
            toast.success("Please sign in again to refresh your status");
            nav("/login");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Purchase failed");
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Upgrade to Super User</h2>

            <div className="space-y-4 rounded-2xl border p-6 bg-white dark:bg-gray-800">
                <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Unlimited accounts</li>
                    <li>Priority support</li>
                    <li>Better transfer limits</li>
                </ul>

                <div>
                    <label className="block text-sm mb-1">Charge from account</label>
                    <select
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="">Select account</option>
                        {accounts.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.currencyType} | {a.iban} | Balance: {a.balance}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={onBuy} className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black">
                    Activate for 20 EUR
                </button>

                <p className="text-xs text-gray-500">
                    💡 Money will be debited in your account currency and converted from 20 EUR at the current FX rate.
                </p>
            </div>
        </div>
    );
}
