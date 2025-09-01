import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "../../api/api";
import toast from "react-hot-toast";

// Validation schema
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
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

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
            console.log("Transfer result:", res.data);
        } catch (e) {
            toast.error("Transfer failed");
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Internal Transfer</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">From Account ID</label>
                    <input
                        type="number"
                        {...register("fromAccountId")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.fromAccountId && (
                        <p className="text-sm text-red-600">
                            {errors.fromAccountId.message}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">To Account ID</label>
                    <input
                        type="number"
                        {...register("toAccountId")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.toAccountId && (
                        <p className="text-sm text-red-600">{errors.toAccountId.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("amount")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.amount && (
                        <p className="text-sm text-red-600">{errors.amount.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Memo</label>
                    <input
                        {...register("memo")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.memo && (
                        <p className="text-sm text-red-600">{errors.memo.message}</p>
                    )}
                </div>
                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black"
                >
                    {isSubmitting ? "Processing..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
