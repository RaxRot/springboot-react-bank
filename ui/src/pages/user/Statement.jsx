import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { shortIban, formatMoney, formatDate } from "../../utils/format";

export default function Statement() {
    const [rows, setRows] = useState([]);
    const [accMap, setAccMap] = useState({});
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const load = async (p = 0) => {
        try {
            setIsLoading(true);
            const [accsRes, statementRes] = await Promise.all([
                api.get("/accounts"),
                api.get(`/statement/my?page=${p}&size=10&sortBy=createdAt&sortDir=desc`)
            ]);

            const map = {};
            (accsRes.data || []).forEach((a) => (map[a.id] = a.iban));
            setAccMap(map);

            setRows(statementRes.data.content || []);
            setPage(statementRes.data.pageNumber || 0);
            setTotalPages(statementRes.data.totalPages || 0);
        } catch {
            toast.error("Failed to load transactions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load(0);
    }, []);

    const toIban = (id) => (id ? shortIban(accMap[id] || `#${id}`) : "—");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Transaction History
                </h2>
                <p className="text-gray-400">All your account activities</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
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
                                <td className="px-4 py-3 font-mono text-blue-300 text-sm">{toIban(t.fromAccountId)}</td>
                                <td className="px-4 py-3 font-mono text-cyan-300 text-sm">{toIban(t.toAccountId)}</td>
                                <td className="px-4 py-3">
                                    {t.amountTo && t.currencyTo && t.currencyFrom !== t.currencyTo ? (
                                        <div className="space-y-1">
                                            <div className="text-red-400 font-medium">
                                                -{formatMoney(t.amountFrom, t.currencyFrom)}
                                            </div>
                                            <div className="text-green-400 font-medium">
                                                +{formatMoney(t.amountTo, t.currencyTo)}
                                            </div>
                                            {t.fxRate && (
                                                <div className="text-xs text-gray-400">
                                                    Rate: {t.fxRate}
                                                </div>
                                            )}
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
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No transactions yet</h3>
                        <p className="text-gray-500">Your transaction history will appear here</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            disabled={page <= 0}
                            onClick={() => load(page - 1)}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            ← Previous
                        </button>
                        <span className="text-gray-400 text-sm">
                            Page {page + 1} of {Math.max(totalPages, 1)}
                        </span>
                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => load(page + 1)}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            Next →
                        </button>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Total transactions: {rows.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}