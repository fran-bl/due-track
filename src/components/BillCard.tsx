"use client"

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { DBBill } from "@/interfaces/interfaces";

interface BillCardProps {
  key: number;
  bill: DBBill;
}

export function BillCard({ bill }: BillCardProps) {
  const [dueDate, setDueDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    if (bill.due_date) {
      setDueDate(new Date(bill.due_date));
    }
  }, [bill.due_date]);

  return (
    <Card className={
      (bill.is_paid ? "border-green-500 border-4" : "") +
      (dueDate && dueDate < new Date() ? "border-red-500 border-4" : "")
    }>
      <CardHeader>
        <CardTitle>{bill?.description}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{bill.amount + " €"}</p>
        <p>{dueDate?.toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="justify-center">
        {!bill.is_paid ? <Button>Plati</Button> : null}
      </CardFooter>
    </Card>
  )
}
