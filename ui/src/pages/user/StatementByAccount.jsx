import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { shortIban, formatMoney, formatDate } from "../../utils/format";

export default function StatementByAccount() {
    const [accountId, setAccountId] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        api.get("/accounts").then((r) => setAccounts(r.data || []));
    }, []);

    const load = async (id) => {
        try {
            const { data } = await api.get(
                `/statement/account/${id}?page=0&size=20&sortBy=createdAt&sortDir=desc`
            );
            setRows(data.content || []);
        } catch {
            toast.error("Failed to load transactions");
        }
    };

    return (
        <div className="px-4 py-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Account Transactions</h2>

            <div className="mb-4">
                <select
                    className="border rounded px-3 py-2"
                    value={accountId}
                    onChange={(e) => {
                        setAccountId(e.target.value);
                        if (e.target.value) load(e.target.value);
                    }}
                >
                    <option value="">Select account</option>
                    {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.currencyType} | {shortIban(a.iban)} | Balance {a.balance}
                        </option>
                    ))}
                </select>
            </div>

            {!accountId ? (
                <p className="text-sm text-gray-500">Choose an account to view transactions.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="border px-3 py-2">#</th>
                            <th className="border px-3 py-2">Type</th>
                            <th className="border px-3 py-2">Status</th>
                            <th className="border px-3 py-2">From (IBAN/ID)</th>
                            <th className="border px-3 py-2">To (IBAN/ID)</th>
                            <th className="border px-3 py-2">Amount</th>
                            <th className="border px-3 py-2">When</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((t) => (
                            <tr key={t.id}>
                                <td className="border px-3 py-2">{t.id}</td>
                                <td className="border px-3 py-2">{t.type}</td>
                                <td className="border px-3 py-2">
                    <span
                        className={`px-2 py-0.5 rounded text-xs ${
                            t.status === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                      {t.status}
                    </span>
                                </td>
                                <td className="border px-3 py-2">{t.fromAccountId ?? "—"}</td>
                                <td className="border px-3 py-2">{t.toAccountId ?? "—"}</td>
                                <td className="border px-3 py-2">
                                    {t.amountTo && t.currencyTo && t.currencyFrom !== t.currencyTo ? (
                                        <>
                                            {formatMoney(t.amountFrom, t.currencyFrom)} →{" "}
                                            {formatMoney(t.amountTo, t.currencyTo)}
                                        </>
                                    ) : (
                                        formatMoney(t.amountFrom, t.currencyFrom)
                                    )}
                                </td>
                                <td className="border px-3 py-2">{formatDate(t.createdAt)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
