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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
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
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    Transaction Analytics
                </h2>
                <p className="text-gray-400">Visualize your financial activity</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50">
                {data.length > 0 ? (
                    <div className="space-y-6">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                <XAxis
                                    dataKey="createdAt"
                                    tick={{ fill: '#D1D5DB', fontSize: 12 }}
                                    stroke="#6B7280"
                                />
                                <YAxis
                                    tick={{ fill: '#D1D5DB', fontSize: 12 }}
                                    stroke="#6B7280"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#F9FAFB'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    activeDot={{
                                        r: 8,
                                        fill: '#3B82F6',
                                        stroke: '#FFFFFF',
                                        strokeWidth: 2
                                    }}
                                    dot={{ fill: '#3B82F6', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30">
                                <h3 className="text-gray-300 text-sm font-medium mb-2">Total Transactions</h3>
                                <p className="text-2xl font-bold text-white">{data.length}</p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30">
                                <h3 className="text-gray-300 text-sm font-medium mb-2">Max Amount</h3>
                                <p className="text-2xl font-bold text-green-400">
                                    {Math.max(...data.map(d => d.amount))}
                                </p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30">
                                <h3 className="text-gray-300 text-sm font-medium mb-2">Currency</h3>
                                <p className="text-2xl font-bold text-blue-400">
                                    {data[0]?.currency || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-gray-400 text-2xl">📊</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No data yet</h3>
                        <p className="text-gray-500">Your transaction history will appear here</p>
                    </div>
                )}
            </div>

            <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Real-time analytics powered by RaxRot Bank</span>
                </div>
            </div>
        </div>
    );
}