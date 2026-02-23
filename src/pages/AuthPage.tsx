import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { GoogleLogo, Eye, EyeSlash } from "@phosphor-icons/react";
import PasswordStrength from "@/components/PasswordStrength";
import logo from "@/assets/logo.png";

interface GoogleConfig {
  enabled: boolean;
  show_on_login: boolean;
  client_id: string;
  scopes: string;
}

const countries = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bahrain","Bangladesh","Belgium","Bolivia",
  "Brazil","Canada","Chile","China","Colombia","Costa Rica","Cuba","Czech Republic","Denmark","Ecuador",
  "Egypt","Estonia","Ethiopia","Finland","France","Germany","Ghana","Greece","Guatemala","Honduras",
  "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica",
  "Japan","Jordan","Kazakhstan","Kenya","Kuwait","Latvia","Lebanon","Libya","Lithuania","Malaysia",
  "Mexico","Morocco","Myanmar","Nepal","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan",
  "Palestine","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Saudi Arabia","Senegal","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka",
  "Sudan","Sweden","Switzerland","Syria","Taiwan","Tanzania","Thailand","Tunisia","Turkey","UAE",
  "Uganda","Ukraine","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zimbabwe",
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [googleConfig, setGoogleConfig] = useState<GoogleConfig | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth?action=get-config`,
      { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.enabled && data.show_on_login && data.client_id) {
          setGoogleConfig(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleGoogleLogin = () => {
    if (!googleConfig?.client_id) return;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scopes = googleConfig.scopes || "openid email profile";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleConfig.client_id)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=select_account`;
    window.location.href = googleAuthUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        toast({ title: "Login failed", description: error, variant: "destructive" });
        setLoading(false);
        return;
      }
      navigate("/");
    } else {
      if (!agreedTerms) {
        toast({ title: "Terms required", description: "You must agree to the terms.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "Passwords don't match", description: "Please make sure both passwords are identical.", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName.trim(),
            country,
            date_of_birth: dob || null,
          },
        },
      });
      if (error) {
        toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "You can now sign in." });
        setIsLogin(true);
        setConfirmPassword("");
        setFullName("");
        setCountry("");
        setDob("");
        setAgreedTerms(false);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <img src={logo} alt="Logo" className="h-14 w-14 rounded-full object-cover mx-auto hover:opacity-80 transition-opacity" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? "Welcome back" : "Register a new account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 glass-strong rounded-xl p-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth (optional)</Label>
                <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isLogin && <PasswordStrength password={password} />}
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedTerms}
                  onCheckedChange={(checked) => setAgreedTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : isLogin ? "Sign In" : "Sign Up"}
          </Button>

          {googleConfig && (
            <>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={handleGoogleLogin}
              >
                <GoogleLogo size={18} weight="bold" />
                Continue with Google
              </Button>
            </>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="text-primary font-medium hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
