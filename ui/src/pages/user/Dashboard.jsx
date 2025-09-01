import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { formatDate, formatMoney } from "../../utils/format";

export default function Dashboard() {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [recent, setRecent] = useState([]);
    const isSuper = user?.roles?.includes("ROLE_SUPER_USER") || user?.roles?.includes("ROLE_ADMIN");

    useEffect(() => {
        (async () => {
            try {
                const accs = await api.get("/accounts");
                setAccounts(accs.data || []);
                const tx = await api.get("/statement/my?page=0&size=5&sortBy=createdAt&sortDir=desc");
                setRecent(tx.data?.content || []);
            } catch {
                toast.error("Failed to load dashboard");
            }
        })();
    }, []);

    const totalByCurrency = accounts.reduce((m, a) => {
        const c = a.currencyType;
        m[c] = (m[c] || 0) + Number(a.balance || 0);
        return m;
    }, {});

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto space-y-8">
            {/* Status card */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold mb-2">Welcome, {user?.username}!</h2>
                    {isSuper ? (
                        <p className="text-green-600">Status: SUPER USER — unlimited accounts, higher limits 🚀</p>
                    ) : (
                        <p className="text-amber-600">
                            Status: USER — you can have only 1 account. Upgrade to Super to unlock unlimited accounts.
                        </p>
                    )}
                </div>

                {/* Quick stats */}
                <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800">
                    <h3 className="font-semibold mb-2">Your balances</h3>
                    <div className="flex gap-3 flex-wrap">
                        {Object.entries(totalByCurrency).map(([cur, sum]) => (
                            <div key={cur} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm">
                                {formatMoney(sum, cur)}
                            </div>
                        ))}
                        {Object.keys(totalByCurrency).length === 0 && <span className="text-sm text-gray-500">No accounts yet</span>}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800">
                <h3 className="font-semibold mb-4">Quick actions</h3>
                <div className="flex flex-wrap gap-3">
                    <a href="/accounts/create" className="px-4 py-2 rounded-lg border hover:bg-gray-50">Create account</a>
                    <a href="/transfers/internal" className="px-4 py-2 rounded-lg border hover:bg-gray-50">Internal transfer</a>
                    <a href="/transfers/external" className="px-4 py-2 rounded-lg border hover:bg-gray-50">External transfer</a>
                    <a href="/topup" className="px-4 py-2 rounded-lg border hover:bg-gray-50">Top up</a>
                    {!isSuper && (
                        <a href="/billing/super-user" className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black">
                            Upgrade to Super
                        </a>
                    )}
                </div>
            </div>

            {/* Recent transactions */}
            <div className="rounded-2xl border p-6 bg-white dark:bg-gray-800">
                <h3 className="font-semibold mb-3">Recent transactions</h3>
                {recent.length === 0 ? (
                    <p className="text-sm text-gray-500">No transactions yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border px-3 py-2">Type</th>
                                <th className="border px-3 py-2">Status</th>
                                <th className="border px-3 py-2">Amount</th>
                                <th className="border px-3 py-2">When</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recent.map((t) => (
                                <tr key={t.id}>
                                    <td className="border px-3 py-2">{t.type}</td>
                                    <td className="border px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${t.status === "SUCCESS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {t.status}
                      </span>
                                    </td>
                                    <td className="border px-3 py-2">
                                        {t.amountTo && t.currencyTo && t.currencyFrom !== t.currencyTo
                                            ? `${formatMoney(t.amountFrom, t.currencyFrom)} → ${formatMoney(t.amountTo, t.currencyTo)}`
                                            : formatMoney(t.amountFrom, t.currencyFrom)}
                                    </td>
                                    <td className="border px-3 py-2">{formatDate(t.createdAt)}</td>
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
