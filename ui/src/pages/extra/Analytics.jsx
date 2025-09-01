import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function Analytics() {
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                // Demo: load last transactions
                const res = await api.get(
                    "/statement/my?page=0&size=10&sortBy=createdAt&sortDir=desc"
                );
                const txs = res.data.content || [];
                const chartData = txs.map((t, i) => ({
                    id: t.id,
                    amount: t.amountFrom,
                    currency: t.currencyFrom,
                    createdAt: t.createdAt,
                }));
                setData(chartData.reverse());
            } catch {
                toast.error("Failed to load analytics");
            }
        })();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Transaction Analytics</h2>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="createdAt" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#2563eb"
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>No data yet.</p>
            )}
        </div>
    );
}
