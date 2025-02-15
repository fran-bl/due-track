import BillList from "@/components/BillList";
import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  return (
    <Card className="h-full border-0 shadow-none">
      <div className="absolute top-5 right-5">
        <ModeToggle/>
      </div>
      <CardHeader className="items-center h-32">
        <CardTitle className="text-3xl">DueTrack</CardTitle>
      </CardHeader>
      <CardContent>
        <BillList/>
      </CardContent>
    </Card>
  )
}
