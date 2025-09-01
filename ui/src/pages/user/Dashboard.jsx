import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { formatDate, formatMoney } from "../../utils/format";

export default function Dashboard() {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [recent, setRecent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isSuper = user?.roles?.includes("ROLE_SUPER_USER") || user?.roles?.includes("ROLE_ADMIN");

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const [accsRes, txRes] = await Promise.all([
                    api.get("/accounts"),
                    api.get("/statement/my?page=0&size=5&sortBy=createdAt&sortDir=desc")
                ]);
                setAccounts(accsRes.data || []);
                setRecent(txRes.data?.content || []);
            } catch {
                toast.error("Failed to load dashboard");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const totalByCurrency = accounts.reduce((m, a) => {
        const c = a.currencyType;
        m[c] = (m[c] || 0) + Number(a.balance || 0);
        return m;
    }, {});

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Welcome back, {user?.username}! 👋
                </h1>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isSuper
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                }`}>
                    {isSuper ? '⚡ SUPER USER' : '👤 STANDARD USER'}
                </div>
            </div>

            {/* Status Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* User Status Card */}
                <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white text-lg">👤</span>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl font-bold text-white">Account Status</h2>
                            {isSuper ? (
                                <p className="text-green-400">Premium features unlocked 🚀</p>
                            ) : (
                                <p className="text-amber-400">
                                    Upgrade to Super for unlimited accounts
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Balances Card */}
                <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Total Balances</h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(totalByCurrency).map(([cur, sum]) => (
                            <div key={cur} className="px-4 py-2 bg-gray-700/50 rounded-xl border border-gray-600/30">
                                <span className="text-green-400 font-bold">{formatMoney(sum, cur)}</span>
                                <span className="text-gray-400 text-sm ml-2">{cur}</span>
                            </div>
                        ))}
                        {Object.keys(totalByCurrency).length === 0 && (
                            <span className="text-gray-400">No accounts yet</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="/accounts/create" className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 text-center font-medium">
                        + Account
                    </a>
                    <a href="/transfers/internal" className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 text-center font-medium">
                        Internal
                    </a>
                    <a href="/transfers/external" className="bg-pink-600 text-white px-4 py-3 rounded-xl hover:bg-pink-700 transition-all duration-300 text-center font-medium">
                        External
                    </a>
                    <a href="/topup" className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 text-center font-medium">
                        Top Up
                    </a>
                </div>
                {!isSuper && (
                    <div className="mt-4 text-center">
                        <a href="/billing/super-user" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
                            ⚡ Upgrade to Super
                        </a>
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-6">Recent Transactions</h3>
                {recent.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-gray-400 text-2xl">💸</span>
                        </div>
                        <p className="text-gray-400">No transactions yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">When</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                            {recent.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{t.type}</td>
                                    <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                t.status === "SUCCESS"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : "bg-red-500/20 text-red-300"
                                            }`}>
                                                {t.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3">
                                            <span className="text-white font-medium">
                                                {t.amountTo && t.currencyTo && t.currencyFrom !== t.currencyTo
                                                    ? `${formatMoney(t.amountFrom, t.currencyFrom)} → ${formatMoney(t.amountTo, t.currencyTo)}`
                                                    : formatMoney(t.amountFrom, t.currencyFrom)}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-sm">{formatDate(t.createdAt)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}