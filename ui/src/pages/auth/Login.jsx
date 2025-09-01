import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../store/auth";

const schema = yup.object({
    username: yup.string().required("Username is required").min(3).max(20),
    password: yup.string().required("Password is required").min(6).max(50),
});

export default function Login() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm({ resolver: yupResolver(schema) });

    const { signin } = useAuth();
    const nav = useNavigate();

    const onSubmit = async (data) => {
        try {
            await signin(data);
            toast.success("Welcome back!");
            nav("/");
        } catch {
            toast.error("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">R</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400">Sign in to your banking account</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                {...register("username")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                autoComplete="username"
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-400 mt-2 font-medium">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-400 mt-2 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white
                                     py-3 rounded-xl font-semibold hover:bg-blue-700
                                     transition-all duration-300 disabled:opacity-50
                                     shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            No account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300 font-medium"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Secure banking system</span>
                    </div>
                </div>
            </div>
        </div>
    );
}