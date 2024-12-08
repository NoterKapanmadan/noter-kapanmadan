import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SERVER_URL } from "@/utils/constants"
import { useToast } from "@/hooks/use-toast"
import { useTransition } from "react"

export default function LoginDialog({ open, setOpen, switchModal, navigate }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const handleSubmit = (formData) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/auth/login`, {
        method: 'POST',
        cache: 'no-store',
        body: formData,
      });
  
      const { msg, error } = await response.json();
  
      if (error) {
        return toast({
          title: 'Something went wrong!',
          description: error,
        });
      }
  
      if (msg) {
        toast({
          title: 'Success!',
          description: msg,
        });

        setOpen(false)
        navigate()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to NoterKapanmadan.com</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-6" disabled={pending}>
            Login
          </Button>
        </form>
        <DialogFooter className="flex justify-center items-center sm:justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span 
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={switchModal}
            >
              Register here
            </span>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}