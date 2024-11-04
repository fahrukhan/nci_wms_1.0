import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLogout } from "@/hooks/useLogout";
import { deleteCookie, getCookie } from "cookies-next";

interface LogoutDialogProps {
  children: React.ReactNode;
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const { logout } = useLogout();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.status === 200) {
        setOpen(false);
        deleteCookie("token");
        router.push("/login");
      } else {
        console.error("Logout failed:", result.status_message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? All unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" type="button" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
