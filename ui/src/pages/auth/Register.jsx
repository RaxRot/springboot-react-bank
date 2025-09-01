import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/api";
import toast from "react-hot-toast";

// Validation schema
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
        <div className="max-w-md mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold">Create account</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium">Username</label>
                    <input
                        {...register("username")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.username && (
                        <p className="text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        {...register("email")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                        type="password"
                        {...register("confirm")}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                    {errors.confirm && (
                        <p className="text-sm text-red-600">{errors.confirm.message}</p>
                    )}
                </div>
                <button
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black"
                >
                    {isSubmitting ? "Creating..." : "Register"}
                </button>
            </form>
            <p className="mt-4 text-sm">
                Already have an account?{" "}
                <Link className="underline" to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
}
