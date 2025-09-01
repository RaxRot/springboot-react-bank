import { useForm } from "react-hook-form";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function CreateAccount() {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();

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
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">+</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Create Account
                    </h2>
                    <p className="text-gray-400">Add a new banking account</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Currency Type
                            </label>
                            <select
                                {...register("currencyType")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                            >
                                <option value="EUR">🇪🇺 Euro (EUR)</option>
                                <option value="USD">🇺🇸 US Dollar (USD)</option>
                                <option value="GBP">🇬🇧 British Pound (GBP)</option>
                                <option value="JPY">🇯🇵 Japanese Yen (JPY)</option>
                                <option value="CHF">🇨🇭 Swiss Franc (CHF)</option>
                                <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
                                <option value="AUD">🇦🇺 Australian Dollar (AUD)</option>
                                <option value="PLN">🇵🇱 Polish Złoty (PLN)</option>
                            </select>
                        </div>

                        <button
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white
                                     py-3 rounded-xl font-semibold hover:bg-blue-700
                                     transition-all duration-300 disabled:opacity-50
                                     shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                        <p className="text-sm text-blue-300 text-center">
                            Your new account will be created with unique IBAN and SWIFT codes
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Multi-currency banking powered by RaxRot</span>
                    </div>
                </div>
            </div>
        </div>
    );
}