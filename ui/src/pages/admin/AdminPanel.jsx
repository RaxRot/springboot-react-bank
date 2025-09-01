import { NavLink, Outlet } from "react-router-dom";

// Layout for admin pages
export default function AdminPanel() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
            <div className="flex gap-4 mb-6">
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg ${
                            isActive ? "bg-gray-900 text-white" : "bg-gray-200 hover:bg-gray-300"
                        }`
                    }
                >
                    Manage Users
                </NavLink>
                <NavLink
                    to="/admin/accounts"
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg ${
                            isActive ? "bg-gray-900 text-white" : "bg-gray-200 hover:bg-gray-300"
                        }`
                    }
                >
                    Manage Accounts
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}
