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
    const [isLoading, setIsLoading] = useState(false);
    const alreadySuper = user?.roles?.includes("ROLE_SUPER_USER") || user?.roles?.includes("ROLE_ADMIN");

    useEffect(() => {
        if (!alreadySuper) {
            api.get("/accounts").then(res => setAccounts(res.data || [])).catch(() => {});
        }
    }, [alreadySuper]);

    if (alreadySuper) {
        return (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl
                              rounded-3xl p-8 shadow-2xl border border-green-500/30 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500
                                  rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-3xl">🎖</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Super Status Active
                    </h2>
                    <p className="text-gray-300 text-lg mb-6">
                        Unlimited accounts, enhanced limits and priority features are enabled.
                    </p>
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                        <h3 className="text-green-400 font-semibold mb-3">Premium Benefits:</h3>
                        <ul className="text-gray-300 space-y-2 text-left">
                            <li>• Unlimited multi-currency accounts</li>
                            <li>• Priority 24/7 customer support</li>
                            <li>• Higher transfer limits</li>
                            <li>• Exclusive financial insights</li>
                            <li>• Advanced security features</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    const onBuy = async () => {
        if (!accountId) return toast.error("Please select an account");
        if (!window.confirm("Activate SUPER_USER for 20 EUR? Funds will be converted if needed.")) return;

        try {
            setIsLoading(true);
            const { data } = await api.post("/billing/super-user/purchase", { accountId: Number(accountId) });
            toast.success(`SUPER_USER activated. Debited ${data.debited} ${data.currency}`);

            await signout();
            toast.success("Please sign in again to refresh your status");
            nav("/login");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Purchase failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500
                              rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">⚡</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    Upgrade to Super User
                </h2>
                <p className="text-gray-400">Unlock premium banking features</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-purple-500/30">
                <div className="bg-purple-500/20 rounded-2xl p-4 mb-6 border border-purple-500/30">
                    <h3 className="text-purple-300 font-semibold mb-3">Premium Features:</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                        <li>• Unlimited multi-currency accounts</li>
                        <li>• Priority customer support</li>
                        <li>• Enhanced transfer limits</li>
                        <li>• Exclusive financial tools</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Charge from account
                    </label>
                    <select
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                 rounded-xl text-white placeholder-gray-400 focus:outline-none
                                 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                                 transition-all duration-300"
                    >
                        <option value="">Select account</option>
                        {accounts.map(a => (
                            <option key={a.id} value={a.id}>
                                {a.currencyType} | {a.iban} | Balance: {a.balance}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={onBuy}
                    disabled={isLoading || !accountId}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white
                             py-3 rounded-xl font-semibold hover:shadow-2xl hover:scale-[1.02]
                             transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                             disabled:hover:shadow-none"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                        </div>
                    ) : (
                        "Activate for 20 EUR"
                    )}
                </button>

                <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30">
                    <p className="text-xs text-gray-400 text-center">
                        💡 Funds will be debited in your account currency and converted from 20 EUR at current FX rates
                    </p>
                </div>
            </div>
        </div>
    );
}