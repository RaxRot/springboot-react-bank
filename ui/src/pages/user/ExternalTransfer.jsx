import { useState, useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function ExternalTransfer() {
    const [accounts, setAccounts] = useState([]);
    const [from, setFrom] = useState("");
    const [iban, setIban] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.get("/accounts").then((res) => setAccounts(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!from || !iban || !amount) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.get(`/admin/accounts/by-iban/${iban}`);
            const toAccountId = res.data.id;

            await api.post("/transfers/external", {
                fromAccountId: from,
                toAccountId,
                amount,
                memo,
            });

            toast.success("External transfer successful!");
            setIban("");
            setAmount("");
            setMemo("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to transfer");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedAccount = accounts.find(acc => acc.id == from);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl">🌍</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        External Transfer
                    </h2>
                    <p className="text-gray-400">Send money to other banks</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                From Account *
                            </label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white focus:outline-none
                                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                                         transition-all duration-300"
                                required
                            >
                                <option value="">Select account</option>
                                {accounts.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.currencyType} | {a.iban} | Balance: {a.balance}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedAccount && (
                            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30">
                                <p className="text-sm text-gray-300">
                                    Available: <span className="text-green-400 font-medium">{selectedAccount.balance} {selectedAccount.currencyType}</span>
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recipient IBAN *
                            </label>
                            <input
                                value={iban}
                                onChange={(e) => setIban(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                                         transition-all duration-300"
                                placeholder="Enter recipient IBAN"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                                         transition-all duration-300"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Memo (Optional)
                            </label>
                            <input
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30
                                         transition-all duration-300"
                                placeholder="Payment description"
                            />
                        </div>

                        <button
                            disabled={isLoading}
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
                                "Transfer Funds"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-purple-900/20 rounded-xl border border-purple-700/30">
                        <p className="text-sm text-purple-300 text-center">
                            💡 Funds are deducted in your account currency.
                            Recipient receives money in their currency at current FX rates.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-purple-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Secure international transfers</span>
                    </div>
                </div>
            </div>
        </div>
    );
}