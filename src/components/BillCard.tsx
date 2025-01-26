"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import { Bill } from "./AddBillDialog"

interface BillCardProps {
  key: number;
  bill: Bill;
}

export function BillCard({ bill }: BillCardProps) {
  const dueDate = bill.due_date ? new Date(bill.due_date) : null

  return (
    <Card>
      <CardHeader>
        <CardDescription>{bill?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{bill.amount}</p>
        <p>{dueDate?.toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Plati</Button>
      </CardFooter>
    </Card>
  )
}
