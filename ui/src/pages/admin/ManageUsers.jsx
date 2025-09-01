import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/admin/users?pageNumber=0&pageSize=50");
                setUsers(data.content || []);
            } catch {
                toast.error("Failed to load users");
            }
        })();
    }, []);

    const promote = async (id) => {
        if (!window.confirm("Promote to SUPER_USER?")) return;
        try {
            const { data } = await api.patch(`/admin/users/${id}/roles/super-user`);
            toast.success("User promoted");
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, roles: data.roles } : u))
            );
        } catch {
            toast.error("Failed to promote");
        }
    };

    const demote = async (id) => {
        if (!window.confirm("Remove SUPER_USER role?")) return;
        try {
            const { data } = await api.delete(`/admin/users/${id}/roles/super-user`);
            toast.success("User demoted");
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, roles: data.roles } : u))
            );
        } catch {
            toast.error("Failed to demote");
        }
    };

    // 🔍 filter users locally
    const filtered = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by username/email"
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
                        <th className="border px-3 py-2">Username</th>
                        <th className="border px-3 py-2">Email</th>
                        <th className="border px-3 py-2">Roles</th>
                        <th className="border px-3 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((u) => (
                        <tr key={u.id}>
                            <td className="border px-3 py-2">{u.id}</td>
                            <td className="border px-3 py-2">{u.username}</td>
                            <td className="border px-3 py-2">{u.email}</td>
                            <td className="border px-3 py-2">{u.roles.join(", ")}</td>
                            <td className="border px-3 py-2 space-x-2">
                                <button
                                    onClick={() => promote(u.id)}
                                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Promote
                                </button>
                                <button
                                    onClick={() => demote(u.id)}
                                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Demote
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
