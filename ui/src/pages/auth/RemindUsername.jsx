import { useForm } from "react-hook-form";
import { api } from "../../api/api";
import toast from "react-hot-toast";

export default function RemindUsername() {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            await api.post("/user/remind-username", data);
            toast.success("If this email exists, you will receive a reminder");
        } catch {
            toast.error("Failed to send reminder");
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Remind Username</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>
                <button className="w-full rounded-lg bg-gray-900 text-white py-2 hover:bg-black">
                    Send Reminder
                </button>
            </form>
        </div>
    );
}