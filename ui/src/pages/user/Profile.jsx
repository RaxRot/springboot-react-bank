import { useState } from "react";
import { api } from "../../api/api";
import { useAuth } from "../../store/auth";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, fetchUser } = useAuth();
    const [tab, setTab] = useState("username");

    const tabs = [
        { id: "username", label: "Username", icon: "👤" },
        { id: "password", label: "Password", icon: "🔒" },
        { id: "avatar", label: "Avatar", icon: "🖼️" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Profile Settings
                </h2>
                <p className="text-gray-400">Manage your account preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 justify-center">
                {tabs.map((tabItem) => (
                    <button
                        key={tabItem.id}
                        onClick={() => setTab(tabItem.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 ${
                            tab === tabItem.id
                                ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                        <span className="text-lg">{tabItem.icon}</span>
                        <span className="font-medium">{tabItem.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
                {tab === "username" && <UsernameForm user={user} fetchUser={fetchUser} />}
                {tab === "password" && <PasswordForm />}
                {tab === "avatar" && <AvatarForm fetchUser={fetchUser} />}
            </div>
        </div>
    );
}

function UsernameForm({ user, fetchUser }) {
    const [newUsername, setNewUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.patch("/user/username", { newUsername });
            toast.success("Username updated successfully!");
            setNewUsername("");
            await fetchUser();
        } catch (e) {
            toast.error(e?.response?.data?.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Change Username</h3>
            <form onSubmit={submit} className="space-y-6">
                <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/30">
                    <p className="text-gray-300 text-sm">Current username</p>
                    <p className="text-white font-semibold text-lg">{user?.username}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Username
                    </label>
                    <input
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                 rounded-xl text-white placeholder-gray-400 focus:outline-none
                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                 transition-all duration-300"
                        required
                        minLength={3}
                        maxLength={20}
                        placeholder="Enter new username"
                    />
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                             hover:bg-blue-700 transition-all duration-300 disabled:opacity-50
                             shadow-lg hover:shadow-xl"
                >
                    {isLoading ? "Updating..." : "Update Username"}
                </button>
            </form>
        </div>
    );
}

function PasswordForm() {
    const [currentPassword, setCur] = useState("");
    const [newPassword, setNew] = useState("");
    const [confirmPassword, setConf] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            await api.patch("/user/password", { currentPassword, newPassword, confirmPassword });
            toast.success("Password updated successfully! Please login again.");
            setTimeout(() => (window.location.href = "/login"), 1500);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Change Password</h3>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCur(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                 rounded-xl text-white placeholder-gray-400 focus:outline-none
                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                 transition-all duration-300"
                        required
                        placeholder="Enter current password"
                    />
                </div>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNew(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                     rounded-xl text-white placeholder-gray-400 focus:outline-none
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                     transition-all duration-300"
                            required
                            minLength={6}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConf(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600
                                     rounded-xl text-white placeholder-gray-400 focus:outline-none
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
                                     transition-all duration-300"
                            required
                            minLength={6}
                            placeholder="Confirm new password"
                        />
                    </div>
                </div>

                <button
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                             hover:bg-blue-700 transition-all duration-300 disabled:opacity-50
                             shadow-lg hover:shadow-xl"
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

function AvatarForm({ fetchUser }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please choose an image");
            return;
        }
        setIsLoading(true);
        const form = new FormData();
        form.append("file", file);
        try {
            await api.patch("/user/uploadimg", form, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Avatar updated successfully!");
            await fetchUser();
            setFile(null);
            setPreview(null);
        } catch {
            toast.error("Upload failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Update Avatar</h3>
            <form onSubmit={submit} className="space-y-6">
                <div className="flex justify-center">
                    <label className="cursor-pointer">
                        <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-4xl">📷</span>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                        Choose different image
                    </button>
                </div>

                <button
                    disabled={isLoading || !file}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold
                             hover:bg-blue-700 transition-all duration-300 disabled:opacity-50
                             shadow-lg hover:shadow-xl"
                >
                    {isLoading ? "Uploading..." : "Upload Avatar"}
                </button>
            </form>
        </div>
    );
}