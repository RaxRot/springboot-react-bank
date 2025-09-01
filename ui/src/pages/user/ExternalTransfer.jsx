import { useState, useEffect } from "react";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function ExternalTransfer() {
    const [accounts, setAccounts] = useState([]);
    const [from, setFrom] = useState("");
    const [iban, setIban] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");

    useEffect(() => {
        api.get("/accounts").then((res) => setAccounts(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // fetch account by IBAN
            const res = await api.get(`/admin/accounts/by-iban/${iban}`);
            const toAccountId = res.data.id;

            await api.post("/transfers/external", {
                fromAccountId: from,
                toAccountId,
                amount,
                memo,
            });

            toast.success("External transfer successful!");
            setIban("");
            setAmount("");
            setMemo("");
        } catch {
            toast.error("Failed to transfer");
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">External Transfer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm">From Account</label>
                    <select
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="">Select account</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.currencyType} | {a.iban} | Balance: {a.balance}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm">Recipient IBAN</label>
                    <input
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Enter recipient IBAN"
                    />
                </div>

                <div>
                    <label className="block text-sm">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Amount to send"
                    />
                </div>

                <div>
                    <label className="block text-sm">Memo</label>
                    <input
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Optional note"
                    />
                </div>

                <button className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black">
                    Transfer
                </button>
            </form>

            {/* Helpful hint */}
            <p className="text-xs text-gray-500 mt-4">
                💡 Funds are always deducted in the currency of your account.
                The recipient will receive money in their account currency,
                converted automatically at the current FX rate.
            </p>
        </div>
    );
}
