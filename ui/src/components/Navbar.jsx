import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Navbar() {
    const { user, signout } = useAuth();
    const location = useLocation();
    const isSuper = user?.roles?.includes("ROLE_SUPER_USER") || user?.roles?.includes("ROLE_ADMIN");

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-blue-400/20
                       backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Лого */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 group"
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500
                                      rounded-xl flex items-center justify-center shadow-lg
                                      group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold text-white">
                            RaxRot Bank
                        </span>
                    </Link>

                    {/* Навигация */}
                    <div className="flex items-center space-x-2">
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-6 py-2 rounded-full bg-blue-500/20
                                             text-white border border-blue-400/50 hover:border-blue-300
                                             transition-all duration-300 hover:scale-105 font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500
                                             text-white shadow-lg hover:shadow-blue-500/25
                                             transition-all duration-300 hover:scale-105 font-medium"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {[
                                    { path: "/accounts", label: "Accounts" },
                                    { path: "/transfers/internal", label: "Internal" },
                                    { path: "/transfers/external", label: "External" },
                                    { path: "/statement", label: "Statement" },
                                    { path: "/topup", label: "TopUp" },
                                    ...(!isSuper ? [{ path: "/billing/super-user", label: "SuperUser" }] : []),
                                    ...(user.roles.includes("ROLE_ADMIN") ? [{ path: "/admin", label: "Admin" }] : []),
                                    { path: "/profile", label: "Profile" }
                                ].map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 
                                                 hover:scale-105 ${
                                            isActive(item.path)
                                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                                : "text-gray-200 hover:text-white hover:bg-white/10"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                <button
                                    onClick={signout}
                                    className="ml-4 px-4 py-2 rounded-full bg-red-500/20
                                             text-red-300 border border-red-400/50 hover:border-red-300
                                             transition-all duration-300 hover:scale-105 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}