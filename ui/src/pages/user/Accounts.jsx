import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get("/accounts");
                setAccounts(data);
            } catch {
                toast.error("Failed to load accounts");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">
                    💳 My Accounts
                </h2>
                <p className="text-gray-400 text-lg">
                    Manage your banking accounts in one place
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((acc) => (
                    <div
                        key={acc.id}
                        className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl
                                 border border-gray-700/50 hover:border-blue-500/30
                                 transition-all duration-300 hover:scale-[1.02]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500
                                         rounded-2xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">€</span>
                            </div>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300
                                          rounded-full text-sm font-medium">
                                {acc.currencyType}
                            </span>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-4">
                            {acc.currencyType} Account
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 font-medium">Balance:</span>
                                <span className="text-2xl font-bold text-green-400">
                                    {Number(acc.balance).toFixed(2)}
                                </span>
                            </div>

                            <div className="pt-3 border-t border-gray-700/50">
                                <div className="text-sm text-gray-400 mb-2">IBAN:</div>
                                <div className="font-mono text-blue-300 text-sm bg-gray-700/50
                                             p-2 rounded-lg border border-gray-600/30">
                                    {acc.iban}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-400 mb-2">SWIFT:</div>
                                <div className="font-mono text-cyan-300 text-sm bg-gray-700/50
                                             p-2 rounded-lg border border-gray-600/30">
                                    {acc.swiftCode}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {accounts.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-400 text-3xl">💳</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No accounts yet</h3>
                    <p className="text-gray-500">Your accounts will appear here once created</p>
                </div>
            )}

            <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Total accounts: {accounts.length}</span>
                </div>
            </div>
        </div>
    );
}