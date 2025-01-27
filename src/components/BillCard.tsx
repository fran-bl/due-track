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
import { Bill } from "@/interfaces/interfaces";
import { DialogTitle } from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { Dialog, DialogContent } from "./ui/dialog";

interface BillCardProps {
  key: number;
  bill: Bill;
  onSetPaid: (id: string | undefined) => void;
  onDelete: (id: string | undefined) => void;
}

export function BillCard({ bill, onSetPaid, onDelete }: BillCardProps) {
  const [isImageOpen, setIsImageOpen] = React.useState(false);

  return (
    <>
      <Card className={
        (bill.is_paid ? "border-green-500 border-4" : "") +
        (bill.due_date && new Date(bill.due_date) < new Date() && !bill.is_paid ? "border-red-500 border-4" : "")
      }>
        {bill.img_url && (
          <CardContent className="aspect-square relative overflow-hidden rounded-lg" onClick={() => setIsImageOpen(true)}>
            <Image 
              src={bill.img_url}
              fill
              style={{ objectFit: "cover" }}
              alt="img"
            />
          </CardContent>
        )}
        <CardHeader>
          <CardTitle>{bill?.description}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{bill.amount + " €"}</p>
          <p>{bill.due_date && new Date(bill.due_date)?.toLocaleDateString()}</p>
        </CardContent>
        {!bill.is_paid && (  
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onDelete(bill.id)}>Obriši</Button>
            <Button>Plati</Button>
            <Button variant="outline" onClick={() => onSetPaid(bill.id)}>Označi kao plaćen</Button>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen} >
        <VisuallyHidden.Root>
          <DialogTitle>Image</DialogTitle>
        </VisuallyHidden.Root>
        <DialogContent className="p-0 [&>button]:hidden items-center">
          <div className="relative w-full h-full" style={{ aspectRatio: "1/1" }}>
            {bill.img_url && (
              <Image
                src={bill.img_url}
                fill
                style={{ objectFit: "contain" }}
                alt="Full size image"
                onClick={() => setIsImageOpen(false)}
                className="rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
