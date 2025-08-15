
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignUpForm() {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await signUp(values.email, values.password);
      setSuccess(true);
      toast({
        title: "Sign Up Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push('/dashboard');
    } catch (err: any) {
        let errorMessage = "An unexpected error occurred.";
        if (err instanceof FirebaseError) {
            switch (err.code) {
                case "auth/email-already-in-use":
                    errorMessage = "This email is already registered. Please log in.";
                    break;
                case "auth/weak-password":
                    errorMessage = "The password is too weak. Please use at least 6 characters.";
                    break;
                default:
                    errorMessage = err.message;
            }
        } else if (err instanceof Error) {
            errorMessage = err.message;
        }
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Welcome!</AlertTitle>
            <AlertDescription>
                Your account has been created successfully. Redirecting you to the dashboard.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
