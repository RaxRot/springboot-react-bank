import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const schema = yup.object({
    fromAccountId: yup.number().required("From account is required"),
    toAccountId: yup.number().required("To account is required"),
    amount: yup
        .number()
        .typeError("Amount must be a number")
        .positive("Amount must be > 0")
        .required("Amount is required"),
    memo: yup.string().max(100, "Memo too long").nullable(),
});

export default function Transfers() {
    const [accounts, setAccounts] = useState([]);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm({ resolver: yupResolver(schema) });

    const fromAccountId = watch("fromAccountId");
    const toAccountId = watch("toAccountId");
    const amount = watch("amount");

    const fromAccount = accounts.find(acc => acc.id == fromAccountId);
    const toAccount = accounts.find(acc => acc.id == toAccountId);

    useEffect(() => {
        setIsLoadingAccounts(true);
        api.get("/accounts")
            .then((res) => setAccounts(res.data || []))
            .catch(() => toast.error("Failed to load accounts"))
            .finally(() => setIsLoadingAccounts(false));
    }, []);

    const onSubmit = async (data) => {
        try {
            const { fromAccountId, toAccountId, amount, memo } = data;
            const res = await api.post("/transfers/internal", {
                fromAccountId,
                toAccountId,
                amount,
                memo,
            });
            toast.success("Transfer successful!");
            // Reset form
            setValue("fromAccountId", "");
            setValue("toAccountId", "");
            setValue("amount", "");
            setValue("memo", "");
        } catch (e) {
            toast.error(e.response?.data?.message || "Transfer failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl">🔄</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Internal Transfer
                    </h2>
                    <p className="text-gray-400">Transfer between accounts</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* From Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                From Account *
                            </label>
                            <select
                                {...register("fromAccountId")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                disabled={isLoadingAccounts}
                            >
                                <option value="">Select account</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.currencyType} | {account.iban} | Balance: {account.balance}
                                    </option>
                                ))}
                            </select>
                            {errors.fromAccountId && (
                                <p className="text-sm text-red-400 mt-2">{errors.fromAccountId.message}</p>
                            )}
                        </div>

                        {/* To Account */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                To Account *
                            </label>
                            <select
                                {...register("toAccountId")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                disabled={isLoadingAccounts}
                            >
                                <option value="">Select account</option>
                                {accounts
                                    .filter(acc => acc.id != fromAccountId)
                                    .map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.currencyType} | {account.iban} | Balance: {account.balance}
                                        </option>
                                    ))}
                            </select>
                            {errors.toAccountId && (
                                <p className="text-sm text-red-400 mt-2">{errors.toAccountId.message}</p>
                            )}
                        </div>

                        {/* Account Info */}
                        {fromAccount && toAccount && (
                            <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-700/30">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">From:</span>
                                        <span className="text-red-400 font-medium ml-2">
                                            {fromAccount.currencyType}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">To:</span>
                                        <span className="text-green-400 font-medium ml-2">
                                            {toAccount.currencyType}
                                        </span>
                                    </div>
                                </div>
                                {fromAccount.currencyType !== toAccount.currencyType && (
                                    <p className="text-blue-300 text-xs mt-2 text-center">
                                        💡 Currency conversion will be applied
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                {...register("amount")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                placeholder="0.00"
                            />
                            {errors.amount && (
                                <p className="text-sm text-red-400 mt-2">{errors.amount.message}</p>
                            )}
                            {fromAccount && amount > 0 && (
                                <p className="text-sm text-gray-400 mt-2">
                                    Available: {fromAccount.balance} {fromAccount.currencyType}
                                </p>
                            )}
                        </div>

                        {/* Memo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Memo (Optional)
                            </label>
                            <input
                                {...register("memo")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                placeholder="Transfer description"
                                maxLength={100}
                            />
                            {errors.memo && (
                                <p className="text-sm text-red-400 mt-2">{errors.memo.message}</p>
                            )}
                        </div>

                        <button
                            disabled={isSubmitting || isLoadingAccounts}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white
                                     py-3 rounded-xl font-semibold hover:shadow-2xl hover:scale-[1.02]
                                     transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100
                                     disabled:hover:shadow-none"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </div>
                            ) : (
                                "Transfer Funds"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                        <p className="text-sm text-blue-300 text-center">
                            ⚡ Instant transfers between your accounts
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Secure • Fast • Reliable</span>
                    </div>
                </div>
            </div>
        </div>
    );
}