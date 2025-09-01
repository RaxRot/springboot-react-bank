import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { shortIban, formatMoney, formatDate } from "../../utils/format";

export default function StatementByAccount() {
    const [accountId, setAccountId] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                setIsLoadingAccounts(true);
                const response = await api.get("/accounts");
                setAccounts(response.data || []);
            } catch {
                toast.error("Failed to load accounts");
            } finally {
                setIsLoadingAccounts(false);
            }
        };
        loadAccounts();
    }, []);

    const load = async (id) => {
        if (!id) return;

        try {
            setIsLoading(true);
            const { data } = await api.get(
                `/statement/account/${id}?page=0&size=20&sortBy=createdAt&sortDir=desc`
            );
            setRows(data.content || []);
        } catch {
            toast.error("Failed to load transactions");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedAccount = accounts.find(acc => acc.id == accountId);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Account Statement
                </h2>
                <p className="text-gray-400">View transactions for specific account</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
                {/* Account Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select Account
                    </label>
                    <select
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                 rounded-xl text-white focus:outline-none
                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                 transition-all duration-300"
                        value={accountId}
                        onChange={(e) => {
                            setAccountId(e.target.value);
                            load(e.target.value);
                        }}
                        disabled={isLoadingAccounts}
                    >
                        <option value="">Choose an account...</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.currencyType} | {shortIban(a.iban)} | Balance: {formatMoney(a.balance, a.currencyType)}
                            </option>
                        ))}
                    </select>
                    {isLoadingAccounts && (
                        <div className="mt-2 text-sm text-gray-400">Loading accounts...</div>
                    )}
                </div>

                {!accountId ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-gray-400 text-2xl">📊</span>
                        </div>
                        <p className="text-gray-400">Select an account to view transactions</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Account Summary */}
                        {selectedAccount && (
                            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Currency</p>
                                        <p className="text-white font-semibold">{selectedAccount.currencyType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Balance</p>
                                        <p className="text-green-400 font-semibold text-lg">
                                            {formatMoney(selectedAccount.balance, selectedAccount.currencyType)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">IBAN</p>
                                        <p className="text-blue-300 font-mono text-sm">{selectedAccount.iban}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">From</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">To</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                {rows.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-3 text-gray-400 font-mono text-sm">{t.id}</td>
                                        <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                                    {t.type}
                                                </span>
                                        </td>
                                        <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    t.status === "SUCCESS"
                                                        ? "bg-green-500/20 text-green-300"
                                                        : "bg-red-500/20 text-red-300"
                                                }`}>
                                                    {t.status}
                                                </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-blue-300 text-sm">
                                            {t.fromAccountId ? shortIban(t.fromAccountId) : "—"}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-cyan-300 text-sm">
                                            {t.toAccountId ? shortIban(t.toAccountId) : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {t.amountTo && t.currencyTo && t.currencyFrom !== t.currencyTo ? (
                                                <div className="space-y-1">
                                                    <div className="text-red-400 font-medium">
                                                        -{formatMoney(t.amountFrom, t.currencyFrom)}
                                                    </div>
                                                    <div className="text-green-400 font-medium">
                                                        +{formatMoney(t.amountTo, t.currencyTo)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className={`font-medium ${
                                                    t.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                        {t.type === 'DEPOSIT' ? '+' : '-'}{formatMoney(t.amountFrom, t.currencyFrom)}
                                                    </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(t.createdAt)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {rows.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-gray-400 text-2xl">💸</span>
                                </div>
                                <p className="text-gray-400">No transactions found for this account</p>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span>Showing {rows.length} transactions</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}