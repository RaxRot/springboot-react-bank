import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function ManageAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/admin/accounts?pageNumber=0&pageSize=50");
                setAccounts(data.content || []);
            } catch {
                toast.error("Failed to load accounts");
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

    // 🔍 filter accounts locally
    const filtered = accounts.filter(
        (a) =>
            a.iban.toLowerCase().includes(search.toLowerCase()) ||
            a.ownerUsername?.toLowerCase().includes(search.toLowerCase()) ||
            a.ownerEmail?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by IBAN, username or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded px-3 py-2 w-80"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th className="border px-3 py-2">ID</th>
                        <th className="border px-3 py-2">Currency</th>
                        <th className="border px-3 py-2">Balance</th>
                        <th className="border px-3 py-2">IBAN</th>
                        <th className="border px-3 py-2">SWIFT</th>
                        <th className="border px-3 py-2">Owner</th>
                        <th className="border px-3 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((a) => (
                        <tr key={a.id}>
                            <td className="border px-3 py-2">{a.id}</td>
                            <td className="border px-3 py-2">{a.currencyType}</td>
                            <td className="border px-3 py-2">{a.balance}</td>
                            <td className="border px-3 py-2">{a.iban}</td>
                            <td className="border px-3 py-2">{a.swiftCode}</td>
                            <td className="border px-3 py-2">
                                {a.ownerUsername} <br />
                                <span className="text-xs text-gray-500">{a.ownerEmail}</span>
                            </td>
                            <td className="border px-3 py-2">
                                <button
                                    onClick={() => remove(a.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
