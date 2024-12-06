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

export default function RegisterDialog({ open, setOpen, switchModal }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const response = await fetch(`${SERVER_URL}/auth/register`, {
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

        switchModal()
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="forename">Forename</Label>
                <Input
                  name="forename"
                  id="forename"
                  type="text"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Surname</Label>
                <Input
                  name="surname"
                  id="surname"
                  type="text"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
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
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                name="phone_number"
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                name="confirm_password"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full mt-6" disabled={pending}>
            Register
          </Button>
        </form>
        <DialogFooter className="flex justify-center items-center sm:justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span 
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={switchModal}
            >
              Login here
            </span>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}