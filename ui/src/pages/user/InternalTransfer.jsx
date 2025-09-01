import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function InternalTransfer() {
    const [accounts, setAccounts] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        api.get("/accounts").then((res) => setAccounts(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!from || !to || !amount) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/transfers/internal", {
                fromAccountId: from,
                toAccountId: to,
                amount,
                memo,
            });
            toast.success("Internal transfer successful!");
            setAmount("");
            setMemo("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to transfer");
        } finally {
            setIsLoading(false);
        }
    };

    const fromAccount = accounts.find(acc => acc.id == from);
    const toAccount = accounts.find(acc => acc.id == to);
    const sameCurrency = fromAccount && toAccount && fromAccount.currencyType === toAccount.currencyType;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl">🔄</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Internal Transfer
                    </h2>
                    <p className="text-gray-400">Transfer between your accounts</p>
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
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
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

                        {fromAccount && (
                            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30">
                                <p className="text-sm text-gray-300">
                                    Available: <span className="text-green-400 font-medium">{fromAccount.balance} {fromAccount.currencyType}</span>
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                To Account *
                            </label>
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                required
                            >
                                <option value="">Select account</option>
                                {accounts
                                    .filter((a) => String(a.id) !== String(from))
                                    .map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.currencyType} | {a.iban} | Balance: {a.balance}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {fromAccount && toAccount && (
                            <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/30">
                                <p className="text-sm text-blue-300">
                                    {sameCurrency
                                        ? "Same currency - 1:1 transfer"
                                        : `Currency conversion: ${fromAccount.currencyType} → ${toAccount.currencyType}`
                                    }
                                </p>
                            </div>
                        )}

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
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
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
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                placeholder="Transfer description"
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white
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

                    <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                        <p className="text-sm text-blue-300 text-center">
                            💡 {sameCurrency
                            ? "Same currency transfer: 1:1 amount"
                            : "Different currencies: automatic conversion at current FX rates"
                        }
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Instant internal transfers</span>
                    </div>
                </div>
            </div>
        </div>
    );
}