import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.put(
        "http://localhost:8000/auth/email",
        { email },
        { headers: { token } }
      );
      setSuccess("Email updated successfully");
    } catch (err: any) {
      setError("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setLoading(true);
    try {
      await axios.delete("http://localhost:8000/auth/delete", { headers: { token } });
      logout();
      navigate("/signup");
    } catch (err: any) {
      setError("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-8 bg-[#121212]">
        <div className="bg-[#282828] rounded-lg p-8 w-full max-w-md shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
          <div className="mb-6">
            <div className="mb-2"><span className="font-semibold">Username:</span> {username}</div>
          </div>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1E1E1E] border-none text-white"
                required
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {success && <div className="text-green-400 text-sm">{success}</div>}
            <Button
              type="submit"
              className="w-full bg-[#1DB954] hover:bg-opacity-80 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Change Email"}
            </Button>
          </form>
          <hr className="my-6 border-gray-700" />
          <Button
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
