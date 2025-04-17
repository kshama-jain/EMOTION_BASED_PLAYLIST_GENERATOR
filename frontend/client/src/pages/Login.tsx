import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      await login(username, password);
      navigate("/");
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-md mx-4 bg-[#282828] text-white border-none">
        <CardHeader className="pt-8 pb-4">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <svg
                className="w-10 h-10 text-[#1DB954]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <CardTitle className="text-2xl font-bold ml-2">Emotify</CardTitle>
            </div>
          </div>
          <CardTitle className="text-xl text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 text-red-400">{error}</div>}
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2" htmlFor="username">
                Username
              </Label>
              <Input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white"
                placeholder="your username"
                required
              />
            </div>
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2" htmlFor="password">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#121212] border border-gray-700 focus:border-[#1DB954] text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1DB954] hover:bg-opacity-80 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              to="/signup"
              className="text-[#1DB954] hover:underline text-sm"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
