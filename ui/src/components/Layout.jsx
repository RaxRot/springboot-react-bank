import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Layout wraps all protected pages with Navbar and Footer
export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
