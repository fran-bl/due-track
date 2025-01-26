import { AddBillDialog } from "@/components/AddBillDialog";
import BillList from "@/components/BillList";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Card className="border-0">
      <div className="absolute top-5 right-5">
        <ModeToggle/>
      </div>
      <div className="absolute top-5 left-5">
        <AddBillDialog/>
      </div>
      <CardHeader className="items-center">
        <CardTitle className="text-3xl">DueTrack</CardTitle>
      </CardHeader>
      <CardContent>
        <BillList/>
      </CardContent>
    </Card>
  )
}
