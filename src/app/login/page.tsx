import { login } from "@/app/login/actions"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="justify-center items-center flex h-screen">
      <div className="absolute top-5 right-5">
        <ModeToggle/>
      </div>
      <Card>
        <CardHeader className="text-5xl text-center">
          Dobrodošli na DueTrack!
        </CardHeader>
        <form className="p-5">
          <div className="grid grid-cols-4 items-center gap-4 py-4">
            <Label htmlFor="email" className="text-right">Email:</Label>
            <Input id="email" name="email" type="email" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 py-4">
            <Label htmlFor="password" className="text-right">Password:</Label>
            <Input id="password" name="password" type="password" className="col-span-3" required />
          </div>
          <CardFooter className="flex justify-center p-0">
            <Button formAction={login} className="justify-self-cente text-xl" variant="outline">Log in</Button>
          </CardFooter> 
        </form>
      </Card>
    </div>
  )
}