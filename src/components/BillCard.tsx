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

export function BillCard({ key, bill }: BillCardProps) {
  return (
    <Card key={key}>
      <CardHeader>
        <CardDescription>{bill?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{bill.amount}</p>
        <p>{bill?.due_date?.toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Plati</Button>
      </CardFooter>
    </Card>
  )
}
