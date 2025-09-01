import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function ManageAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get("/admin/accounts?pageNumber=0&pageSize=50");
                setAccounts(data.content || []);
            } catch {
                toast.error("Failed to load accounts");
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const remove = async (id) => {
        if (!window.confirm("Delete this account?")) return;
        try {
            await api.delete(`/admin/accounts/${id}`);
            toast.success("Account deleted");
            setAccounts(accounts.filter((a) => a.id !== id));
        } catch {
            toast.error("Failed to delete");
        }
    };

    const filtered = accounts.filter(
        (a) =>
            a.iban.toLowerCase().includes(search.toLowerCase()) ||
            a.ownerUsername?.toLowerCase().includes(search.toLowerCase()) ||
            a.ownerEmail?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Bank Accounts Management</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="🔍 Search by IBAN, username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-2xl
                                 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50
                                 focus:ring-1 focus:ring-cyan-400/30 w-96 transition-all duration-300"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🔍
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl
                          border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Currency</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Balance</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">IBAN</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">SWIFT</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Owner</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-200">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                        {filtered.map((a, index) => (
                            <tr key={a.id} className="hover:bg-white/5 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm text-gray-200">{a.id}</td>
                                <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full
                                                       bg-blue-500/20 text-blue-200 text-xs font-medium">
                                            {a.currencyType}
                                        </span>
                                </td>
                                <td className="px-6 py-4">
                                        <span className="text-lg font-bold text-green-400">
                                            {a.balance}
                                        </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-cyan-300">{a.iban}</td>
                                <td className="px-6 py-4 font-mono text-sm text-purple-300">{a.swiftCode}</td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="text-white font-medium">{a.ownerUsername}</div>
                                        <div className="text-xs text-gray-400">{a.ownerEmail}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => remove(a.id)}
                                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600
                                                     text-white rounded-xl hover:shadow-lg hover:scale-105
                                                     transition-all duration-300 font-semibold text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">No accounts found</div>
                        <div className="text-gray-500 text-sm mt-2">
                            {search ? "Try a different search term" : "No accounts in the system"}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
                <div>Total accounts: {accounts.length}</div>
                <div>Filtered: {filtered.length}</div>
            </div>
        </div>
    );
}