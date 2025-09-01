import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/api";
import toast from "react-hot-toast";

const schema = yup.object({
    username: yup.string().required("Username is required").min(4).max(20),
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup.string().required("Password is required").min(6).max(40),
    confirm: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

export default function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            await api.post("/auth/register", {
                username: data.username,
                email: data.email,
                password: data.password,
            });
            toast.success("Registered! Please login.");
            navigate("/login");
        } catch {
            toast.error("Registration failed");
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
                        Create Account
                    </h2>
                    <p className="text-gray-400">Join our banking future</p>
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
                                placeholder="Choose your username"
                            />
                            {errors.username && (
                                <p className="text-sm text-red-400 mt-2 font-medium">{errors.username.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-400 mt-2 font-medium">{errors.email.message}</p>
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
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-400 mt-2 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                {...register("confirm")}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                         rounded-xl text-white placeholder-gray-400 focus:outline-none
                                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                         transition-all duration-300"
                                placeholder="Confirm your password"
                            />
                            {errors.confirm && (
                                <p className="text-sm text-red-400 mt-2 font-medium">{errors.confirm.message}</p>
                            )}
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
                                    Creating account...
                                </div>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-300 font-medium"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>256-bit encryption secured</span>
                    </div>
                </div>
            </div>
        </div>
    );
}