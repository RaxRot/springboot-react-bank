import { useState } from "react";
import { api } from "../../api/api";
import { useAuth } from "../../store/auth";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, fetchUser } = useAuth();
    const [tab, setTab] = useState("username");

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-6">Profile</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setTab("username")} className={`px-4 py-2 rounded-lg border ${tab==="username" ? "bg-gray-900 text-white" : ""}`}>Change username</button>
                <button onClick={() => setTab("password")} className={`px-4 py-2 rounded-lg border ${tab==="password" ? "bg-gray-900 text-white" : ""}`}>Change password</button>
                <button onClick={() => setTab("avatar")} className={`px-4 py-2 rounded-lg border ${tab==="avatar" ? "bg-gray-900 text-white" : ""}`}>Avatar</button>
            </div>

            {tab === "username" && <UsernameForm user={user} fetchUser={fetchUser} />}
            {tab === "password" && <PasswordForm />}
            {tab === "avatar" && <AvatarForm fetchUser={fetchUser} />}
        </div>
    );
}

function UsernameForm({ user, fetchUser }) {
    const [newUsername, setNewUsername] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.patch("/user/username", { newUsername });
            toast.success("Username updated");
            setNewUsername("");
            await fetchUser(); // refresh store (cookie rotated)
        } catch (e) {
            toast.error(e?.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 max-w-md">
            <div className="text-sm text-gray-600">Current: <b>{user?.username}</b></div>
            <div>
                <label className="block text-sm mb-1">New username</label>
                <input value={newUsername} onChange={(e)=>setNewUsername(e.target.value)} className="w-full rounded-lg border px-3 py-2" required minLength={3} maxLength={20} />
            </div>
            <button className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-black">Save</button>
        </form>
    );
}

function PasswordForm() {
    const [currentPassword, setCur] = useState("");
    const [newPassword, setNew] = useState("");
    const [confirmPassword, setConf] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await api.patch("/user/password", { currentPassword, newPassword, confirmPassword });
            toast.success("Password updated. Please login again.");
            // backend clears cookie on password change
            setTimeout(() => (window.location.href = "/login"), 800);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Update failed");
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm mb-1">Current password</label>
                <input type="password" value={currentPassword} onChange={(e)=>setCur(e.target.value)} className="w-full rounded-lg border px-3 py-2" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">New password</label>
                    <input type="password" value={newPassword} onChange={(e)=>setNew(e.target.value)} className="w-full rounded-lg border px-3 py-2" required minLength={6} />
                </div>
                <div>
                    <label className="block text-sm mb-1">Confirm new password</label>
                    <input type="password" value={confirmPassword} onChange={(e)=>setConf(e.target.value)} className="w-full rounded-lg border px-3 py-2" required minLength={6} />
                </div>
            </div>
            <button className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-black">Save</button>
        </form>
    );
}

function AvatarForm({ fetchUser }) {
    const [file, setFile] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Choose an image");
            return;
        }
        const form = new FormData();
        form.append("file", file);
        try {
            await api.patch("/user/uploadimg", form, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Avatar updated");
            await fetchUser();
        } catch {
            toast.error("Upload failed");
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4 max-w-md">
            <div>
                <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
            </div>
            <button className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-black">Upload</button>
        </form>
    );
}
