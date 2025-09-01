import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import { shortIban, formatMoney, formatDate } from "../../utils/format";

// My transactions (all)
export default function Statement() {
    const [rows, setRows] = useState([]);
    const [accMap, setAccMap] = useState({}); // id -> IBAN
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const load = async (p = 0) => {
        try {
            // build map id->IBAN from my accounts
            const accs = await api.get("/accounts");
            const map = {};
            (accs.data || []).forEach((a) => (map[a.id] = a.iban));
            setAccMap(map);

            const { data } = await api.get(
                `/statement/my?page=${p}&size=10&sortBy=createdAt&sortDir=desc`
            );
            setRows(data.content || []);
            setPage(data.pageNumber || 0);
            setTotalPages(data.totalPages || 0);
        } catch {
            toast.error("Failed to load transactions");
        }
    };

    useEffect(() => {
        load(0);
    }, []);

    const toIban = (id) => (id ? shortIban(accMap[id] || `#${id}`) : "—");

    return (
        <div className="px-4 py-8 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Transactions</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="border px-3 py-2">#</th>
                        <th className="border px-3 py-2">Type</th>
                        <th className="border px-3 py-2">Status</th>
                        <th className="border px-3 py-2">From (IBAN)</th>
                        <th className="border px-3 py-2">To (IBAN)</th>
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
                            <td className="border px-3 py-2">{toIban(t.fromAccountId)}</td>
                            <td className="border px-3 py-2">{toIban(t.toAccountId)}</td>
                            <td className="border px-3 py-2">
                                {/* show both legs if FX was applied */}
                                {t.amountTo && t.currencyTo && t.currencyFrom !== t.currencyTo ? (
                                    <>
                                        {formatMoney(t.amountFrom, t.currencyFrom)} →{" "}
                                        {formatMoney(t.amountTo, t.currencyTo)}
                                        {t.fxRate ? (
                                            <span className="text-xs text-gray-500"> (fx {t.fxRate})</span>
                                        ) : null}
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

            {/* simple pager */}
            <div className="mt-4 flex items-center gap-3">
                <button
                    disabled={page <= 0}
                    onClick={() => load(page - 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm">
          Page {page + 1} / {Math.max(totalPages, 1)}
        </span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => load(page + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
