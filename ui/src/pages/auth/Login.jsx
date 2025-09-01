import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../store/auth";

// validation schema
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
        <div className="max-w-md mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input
                        {...register("username")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        autoComplete="username"
                    />
                    {errors.username && (
                        <p className="text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        autoComplete="current-password"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black disabled:opacity-50"
                >
                    {isSubmitting ? "Signing in..." : "Login"}
                </button>
            </form>
            <p className="mt-4 text-sm">
                No account?{" "}
                <Link className="underline" to="/register">
                    Register
                </Link>
            </p>
        </div>
    );
}
