import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./store/auth";

import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RemindUsername from "./pages/auth/RemindUsername";
import Dashboard from "./pages/user/Dashboard";
import Accounts from "./pages/user/Accounts";
import CreateAccount from "./pages/user/CreateAccount";
import InternalTransfer from "./pages/user/InternalTransfer";
import ExternalTransfer from "./pages/user/ExternalTransfer";
import Statement from "./pages/user/Statement";
import StatementByAccount from "./pages/user/StatementByAccount";
import Profile from "./pages/user/Profile";
import TopUp from "./pages/user/TopUp";
import BillingSuper from "./pages/user/BillingSuper";
import AdminPanel from "./pages/admin/AdminPanel";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageAccounts from "./pages/admin/ManageAccounts";
import SystemStatus from "./pages/extra/SystemStatus";
import Analytics from "./pages/extra/Analytics";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import TopUpSuccess from "./pages/user/TopUpSuccess";
import TopUpCancel from "./pages/user/TopUpCancel";

export default function App() {
    const { fetchUser, loading } = useAuth();

    useEffect(() => {
        fetchUser(); // проверяем куку при старте
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-xl">
                Loading...
            </div>
        );
    }

    return (
        <Routes>
            {/* public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/remind-username" element={<RemindUsername />} />

            {/* private */}
            <Route element={<Layout />}>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
                <Route path="/accounts/create" element={<ProtectedRoute><CreateAccount /></ProtectedRoute>} />

                {/* transfers */}
                <Route path="/transfers/internal" element={<ProtectedRoute><InternalTransfer /></ProtectedRoute>} />
                <Route path="/transfers/external" element={<ProtectedRoute><ExternalTransfer /></ProtectedRoute>} />

                {/* statements */}
                <Route path="/statement" element={<ProtectedRoute><Statement /></ProtectedRoute>} />
                <Route path="/statement/account" element={<ProtectedRoute><StatementByAccount /></ProtectedRoute>} />

                {/* profile */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* topup */}
                <Route path="/topup" element={<ProtectedRoute><TopUp /></ProtectedRoute>} />
                <Route path="/topup/success" element={<ProtectedRoute><TopUpSuccess /></ProtectedRoute>} />
                <Route path="/topup/cancel" element={<ProtectedRoute><TopUpCancel /></ProtectedRoute>} />

                {/* super user */}
                <Route path="/billing/super-user" element={<ProtectedRoute><BillingSuper /></ProtectedRoute>} />

                {/* extra */}
                <Route path="/status" element={<ProtectedRoute><SystemStatus /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

                {/* admin only */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>}>
                    <Route path="users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
                    <Route path="accounts" element={<ProtectedRoute adminOnly><ManageAccounts /></ProtectedRoute>} />
                </Route>
            </Route>
        </Routes>
    );
}
