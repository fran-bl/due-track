import BillList from "@/components/BillList";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function Home() {
  return (
    <Card className="border-0">
      <div className="absolute top-5 right-5">
        <ModeToggle/>
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
