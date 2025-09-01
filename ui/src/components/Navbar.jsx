import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Navbar() {
    const { user, signout } = useAuth();
    const isSuper = user?.roles?.includes("ROLE_SUPER_USER") || user?.roles?.includes("ROLE_ADMIN");

    return (
        <nav className="flex justify-between items-center px-6 py-4 border-b bg-white">
            <Link to="/" className="font-bold text-lg">🏦 RaxRot Bank</Link>
            <div className="flex gap-4">
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/accounts">Accounts</Link>
                        <Link to="/transfers/internal">Internal</Link>
                        <Link to="/transfers/external">External</Link>
                        <Link to="/statement">Statement</Link>
                        <Link to="/topup">TopUp</Link>
                        {!isSuper && <Link to="/billing/super-user">SuperUser</Link>}
                        {user.roles.includes("ROLE_ADMIN") && <Link to="/admin">Admin</Link>}
                        <Link to="/profile">Profile</Link>
                        <button onClick={signout} className="ml-2 text-red-500">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
