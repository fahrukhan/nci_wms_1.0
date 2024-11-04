"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import useLogin from "@/hooks/useLogin";
import { useAtom, useSetAtom } from "jotai";
import { allMenusAtom, menuLoadingAtom, userMenuAtom } from "@/lib/atom";
import { fetchAllMenus } from "@/app/actions/userActions";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string(),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useLogin();
  const setUserMenu = useSetAtom(userMenuAtom);
  const setAllMenus = useSetAtom(allMenusAtom);
  const [menuLoading, setMenuLoading] = useAtom(menuLoadingAtom);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setMenuLoading(true);

    try {
      const result = await login(values);

      if (result.status === 200 && result.data) {
        console.log(result.data.warehouses);
        setCookie("warehouses", result.data.warehouses);

        setUserMenu(result.data.menu);
        try {
          const allMenus = await fetchAllMenus();
          setAllMenus(allMenus);
        } catch (error) {
          console.error("Failed to fetch all menus:", error);
        }

        router.push("/");
      } else {
        alert(`Login Failed: ${result.status_message}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
      setMenuLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} disabled={isLoading} />
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
                <Input
                  placeholder=""
                  {...field}
                  type="password"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full py-3">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
