import { NavLink, Outlet } from "react-router-dom";

export default function AdminPanel() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400
                              bg-clip-text text-transparent mb-4">
                    Quantum Admin Panel
                </h2>
                <p className="text-gray-300 text-lg">
                    Control center for bank management systems
                </p>
            </div>


            <div className="flex justify-center gap-6 mb-12">
                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 
                         hover:shadow-2xl ${
                            isActive
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/50"
                                : "bg-gray-800/50 text-gray-300 border border-gray-600/30 hover:border-cyan-400/50 hover:text-white"
                        }`
                    }
                >
                    👥 Manage Users
                </NavLink>
                <NavLink
                    to="/admin/accounts"
                    className={({ isActive }) =>
                        `px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 
                         hover:shadow-2xl ${
                            isActive
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/50"
                                : "bg-gray-800/50 text-gray-300 border border-gray-600/30 hover:border-pink-400/50 hover:text-white"
                        }`
                    }
                >
                    💳 Manage Accounts
                </NavLink>
            </div>


            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-xl
                           border border-white/10 rounded-3xl p-8 shadow-2xl">
                <Outlet />
            </div>

            <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-4 bg-gray-800/50 px-6 py-3
                              rounded-full border border-gray-600/30">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-300">System Status: Operational</span>
                    <span className="text-xs text-gray-400">v2.0.25</span>
                </div>
            </div>
        </div>
    );
}