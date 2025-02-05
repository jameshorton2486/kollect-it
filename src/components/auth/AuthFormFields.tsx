
import { Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { AuthFormValues } from "./AuthForm";

interface AuthFormFieldsProps {
  isLogin: boolean;
  isGuest?: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  form: UseFormReturn<AuthFormValues>;
}

export function AuthFormFields({
  isLogin,
  isGuest = false,
  showPassword,
  setShowPassword,
  form,
}: AuthFormFieldsProps) {
  const showNameFields = !isLogin || isGuest;

  return (
    <>
      {showNameFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      className="pl-10"
                      placeholder="John"
                      required={!isLogin}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      className="pl-10"
                      placeholder="Doe"
                      required={!isLogin}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...field}
                  type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isGuest && (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              )}
            </FormItem>
          )}
        />
      )}
    </>
  );
}
