import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function TopUp() {
    const [accounts, setAccounts] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm();

    const selectedAccountId = watch("accountId");
    const selectedAccount = accounts.find(acc => acc.id == selectedAccountId);

    useEffect(() => {
        setIsLoadingAccounts(true);
        api
            .get("/accounts")
            .then((res) => setAccounts(res.data || []))
            .catch(() => toast.error("Failed to load accounts"))
            .finally(() => setIsLoadingAccounts(false));
    }, []);

    const onSubmit = async (data) => {
        try {
            const req = {
                accountId: data.accountId,
                amount: Math.round(parseFloat(data.amount) * 100),
                currency: "EUR",
                successUrl: window.location.origin + "/topup/success",
                cancelUrl: window.location.origin + "/topup/cancel",
            };

            const res = await api.post("/payments/topup", req);
            window.location.href = res.data.checkoutUrl;
        } catch (error) {
            toast.error(error.response?.data?.message || "Top-up failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl">💳</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Top-up Account
                    </h2>
                    <p className="text-gray-400">Add funds to your banking account</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Select Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Select Account *
                            </label>
                            <select
                                {...register("accountId", { required: "Account is required" })}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white focus:outline-none
                                         focus:border-green-500 focus:ring-2 focus:ring-green-500/30
                                         transition-all duration-300"
                                disabled={isLoadingAccounts}
                            >
                                <option value="">Choose account...</option>
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.currencyType} | {a.iban} | Balance: {a.balance}
                                    </option>
                                ))}
                            </select>
                            {errors.accountId && (
                                <p className="text-sm text-red-400 mt-2">{errors.accountId.message}</p>
                            )}
                            {isLoadingAccounts && (
                                <p className="text-sm text-gray-400 mt-2">Loading accounts...</p>
                            )}
                        </div>

                        {/* Account Info */}
                        {selectedAccount && (
                            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Currency:</span>
                                        <span className="text-white font-medium ml-2">{selectedAccount.currencyType}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Current:</span>
                                        <span className="text-green-400 font-medium ml-2">{selectedAccount.balance}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Amount Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount (EUR) *
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    €
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    {...register("amount", {
                                        required: "Amount is required",
                                        min: { value: 1, message: "Minimum 1 EUR" },
                                        max: { value: 10000, message: "Maximum 10,000 EUR" }
                                    })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600
                                             rounded-xl text-white placeholder-gray-400 focus:outline-none
                                             focus:border-green-500 focus:ring-2 focus:ring-green-500/30
                                             transition-all duration-300"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.amount && (
                                <p className="text-sm text-red-400 mt-2">{errors.amount.message}</p>
                            )}
                        </div>

                        {/* Conversion Info */}
                        {selectedAccount && selectedAccount.currencyType !== "EUR" && (
                            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/30">
                                <p className="text-sm text-blue-300 text-center">
                                    💡 Amount will be converted from EUR to {selectedAccount.currencyType} at current rates
                                </p>
                            </div>
                        )}

                        <button
                            disabled={isSubmitting || isLoadingAccounts}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white
                                     py-3 rounded-xl font-semibold hover:shadow-2xl hover:scale-[1.02]
                                     transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                                     disabled:hover:shadow-none"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Redirecting...
                                </div>
                            ) : (
                                "Proceed to Payment"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-green-900/20 rounded-xl border border-green-700/30">
                        <p className="text-sm text-green-300 text-center">
                            🔒 Secure payment processing powered by Stripe
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Instant funding • No hidden fees</span>
                    </div>
                </div>
            </div>
        </div>
    );
}