import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get("/admin/users?pageNumber=0&pageSize=50");
                setUsers(data.content || []);
            } catch {
                toast.error("Failed to load users");
            } finally {
                setIsLoading(false);
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

    const filtered = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
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
                <h3 className="text-2xl font-bold text-white">Users Management</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="🔍 Search by username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-2xl
                                 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50
                                 focus:ring-1 focus:ring-purple-400/30 w-96 transition-all duration-300"
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
                        <tr className="bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-pink-200">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-pink-200">Username</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-pink-200">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-pink-200">Roles</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-pink-200">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                        {filtered.map((u) => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm text-gray-200">{u.id}</td>
                                <td className="px-6 py-4">
                                    <div className="text-white font-medium">{u.username}</div>
                                </td>
                                <td className="px-6 py-4 text-cyan-300">{u.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {u.roles.map((role) => (
                                            <span
                                                key={role}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    role.includes('SUPER')
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                                                        : role.includes('ADMIN')
                                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                                                            : 'bg-gray-600 text-gray-200'
                                                }`}
                                            >
                                                    {role}
                                                </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => promote(u.id)}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600
                                                         text-white rounded-xl hover:shadow-lg hover:scale-105
                                                         transition-all duration-300 font-semibold text-sm"
                                        >
                                            Promote
                                        </button>
                                        <button
                                            onClick={() => demote(u.id)}
                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600
                                                         text-white rounded-xl hover:shadow-lg hover:scale-105
                                                         transition-all duration-300 font-semibold text-sm"
                                        >
                                            Demote
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-lg">No users found</div>
                        <div className="text-gray-500 text-sm mt-2">
                            {search ? "Try a different search term" : "No users in the system"}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
                <div>Total users: {users.length}</div>
                <div>Filtered: {filtered.length}</div>
            </div>
        </div>
    );
}