import { useForm } from "react-hook-form";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function CreateAccount() {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            await api.post("/accounts", data);
            toast.success("Account created!");
            window.location.href = "/accounts";
        } catch {
            toast.error("Failed to create account");
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Create Account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm">Currency</label>
                    <select
                        {...register("currencyType")}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="CHF">CHF</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="PLN">PLN</option>
                    </select>
                </div>
                <button className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black">
                    Create
                </button>
            </form>
        </div>
    );
}
