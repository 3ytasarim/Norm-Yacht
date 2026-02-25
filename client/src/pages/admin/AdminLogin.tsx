import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/languageContext";
import { useTranslation } from "@/lib/i18n";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoPath from "@assets/43219e59-fadc-46c1-b45c-d18f3e4cce0a_1772014162879.jpg";
import { Lock, User } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Admin Login - Norm Yacht";
  }, []);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginForm) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      navigate("/admin/dashboard");
    },
    onError: () => {
      toast({ title: "Error", description: "Invalid username or password.", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-[#0a1428] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoPath} alt="Norm Yacht" className="h-16 w-auto mx-auto object-contain brightness-0 invert mb-6" />
          <h1 className="text-2xl font-black text-white">{t.admin.login}</h1>
          <p className="text-gray-400 mt-1 text-sm">Enter your credentials to access the admin panel</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-semibold">{t.admin.username}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#F5A623] focus:ring-[#F5A623]"
                          placeholder="admin"
                          {...field}
                          data-testid="input-admin-username"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-semibold">{t.admin.password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          type="password"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-[#F5A623] focus:ring-[#F5A623]"
                          placeholder="••••••••"
                          {...field}
                          data-testid="input-admin-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-[#F5A623] hover:bg-[#e8901a] text-white font-bold"
                disabled={mutation.isPending}
                data-testid="button-admin-login"
              >
                {mutation.isPending ? "Logging in..." : t.admin.loginBtn}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
