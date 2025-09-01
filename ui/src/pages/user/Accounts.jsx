import { useEffect, useState } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

// Page to list all accounts of the logged-in user
export default function Accounts() {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/accounts");
                setAccounts(data);
            } catch {
                toast.error("Failed to load accounts");
            }
        })();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-8 text-center">💳 My Accounts</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((acc) => (
                    <div
                        key={acc.id}
                        className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md bg-white dark:bg-gray-800 transition hover:shadow-lg"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            🌍 {acc.currencyType} Account
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                            <b>💰 Balance:</b>{" "}
                            {Number(acc.balance).toFixed(2)} {acc.currencyType}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <b>🏦 IBAN:</b> {acc.iban}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <b>🔑 SWIFT:</b> {acc.swiftCode}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
