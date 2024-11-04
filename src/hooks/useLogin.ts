import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atom";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResult {
  status: number;
  status_message?: string;
  token?: string;
  data?: {
    email: string;
    username: string;
    phone: string;
    company: string;
    url_picture: string;
    token: string;
    warehouses: Array<{ id: number; name: string }>;
    role: string;
    menu: MenuUserDTO[];
  };
}

export default function useLogin() {
  const setLoading = useSetAtom(loadingAtom);

  const login = async (data: LoginData): Promise<LoginResult> => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.status_message || "Login failed");
      }

      return result;
    } catch (error: any) {
      console.error("Error logging in:", error);
      return { status: 500, status_message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return { login };
}
