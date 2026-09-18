// pages/Login/LoginForm.tsx (আপডেটেড)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useLoginMutation } from "@/redux/features/auth/auth.api"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import config from "@/config"
import { useAppDispatch } from "@/redux/hook"
import { setUser } from "@/redux/features/auth/auth.slice"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("🚀 Submitting login:", data.email);
    
    try {
      const response = await login(data).unwrap();
      console.log("✅ Full Login Response:", response);
      
      // 🔥 Extract user and token - CHECK YOUR API RESPONSE STRUCTURE
      // Your response structure: { user: {...}, token: "..." } or { data: { user: {...}, token: "..." } }
      const userData = response?.data?.user || response?.user;
      const token = response?.data?.token || response?.data?.accessToken || response?.token;
      
      console.log("👤 Extracted User:", userData);
      console.log("🔑 Extracted Token:", token);
      
      if (userData && token) {
        // 🔥 Save to localStorage FIRST
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 🔥 Then update Redux state
        dispatch(setUser({
          user: userData,
          token: token,
        }));
        
        console.log("✅ Token saved to localStorage:", localStorage.getItem('token'));
        console.log("✅ User saved to localStorage:", localStorage.getItem('user'));
        
        toast.success("Login successful", {
          description: `Welcome back, ${userData?.name || userData?.email || data.email}`,
        });
        
        // 🔥 Navigate based on role
        setTimeout(() => {
          if (userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 100);
        
      } else {
        console.error("❌ No user data or token in response:", response);
        toast.error("Login failed: Invalid response from server");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      const errorMessage = err?.data?.message || err?.message || "Something went wrong";

      if (errorMessage === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: { email: data.email } });
      } else if (errorMessage === "Invalid credentials") {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      autoComplete="current-password"
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          onClick={() => window.open(`${config.baseUrl}/auth/google/`, "_self")}
          variant="outline"
          className="w-full cursor-pointer"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-2">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="font-semibold underline underline-offset-4 hover:text-primary transition-colors">
          Register
        </Link>
      </div>
    </div>
  );
}