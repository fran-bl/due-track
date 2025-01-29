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
import { Label } from "@radix-ui/react-label";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { saveAs } from 'file-saver';
import { Download } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "./ui/dialog";

interface BillCardProps {
  key: number;
  userRole: string | null;
  bill: Bill;
  onSetPaid: (id: string | undefined) => void;
  onDelete: (id: string | undefined, img_url: string | undefined) => void;
}

export function BillCard({ userRole, bill, onSetPaid, onDelete }: BillCardProps) {
  const [isImageOpen, setIsImageOpen] = React.useState(false);

  const handleDownload = () => {
    if (bill.img_url)
      saveAs(bill.img_url, bill.description);
  }

  return (
    <>
      <Card className={
        (bill.is_paid ? "border-green-500 border-4" : "") +
        (bill.due_date && new Date(bill.due_date) < new Date() && !bill.is_paid ? "border-red-500 border-4" : "")
      }>
        {bill.img_url ?
          <CardContent className="relative overflow-hidden rounded-lg p-3" style={{ aspectRatio: "2/1" }} onClick={() => setIsImageOpen(true)}>
            <Image 
              src={bill.img_url}
              fill
              style={{ objectFit: "cover" }}
              alt="Image"
            />
          </CardContent> :
          <CardContent className="aspect-square relative overflow-hidden rounded-lg p-3" style={{ aspectRatio: "2/1" }}>
            <Image 
              src="/placeholder.jpg"
              fill
              style={{ objectFit: "cover" }}
              alt="Missing image"
            />
          </CardContent>
        }
        <CardHeader className="grid grid-cols-2 items-center place-items-center p-3">
          <CardTitle className="text-xl col-span-1">{bill.description}</CardTitle>
          <Download className="w-8 h-8 cursor-pointer col-span-1" onClick={handleDownload} />
        </CardHeader>
        <CardContent className="p-3">
          <p className="text-2xl text-right gradient-text text-transparent animate-gradient">{bill.amount.toLocaleString() + " €"}</p>
          {bill.due_date && (
            <>
              <div className="flex justify-between">
                <Label htmlFor="due-date" className="text-lg">Datum dospijeća:</Label>
                <p className="text-right text-xl" id="due-date">
                  {new Date(bill.due_date).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }) + "."}
                </p>
              </div>
                <p className="text-right text-primary text-lg">
                  {(() => {
                    const diff = new Date(bill.due_date).getTime() - new Date().getTime()
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
                    return diff > 0 ? <>{`(za ${days} dan` + (days === 1 ? ")" : "a)")}</> : <>&nbsp;</>       
                  })()}
                </p>
            </>
          )}
        </CardContent>
        <CardFooter className="grid grid-cols-2 items-center p-3 gap-5">
          {userRole === "admin" && (
            <Button variant="outline" onClick={() => onDelete(bill.id, bill.img_url)}>Obriši</Button>
          )}
          {!bill.is_paid && (
            <Button variant="outline" onClick={() => onSetPaid(bill.id)}>Označi kao plaćen</Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen} >
        <VisuallyHidden.Root>
          <DialogTitle>Image</DialogTitle>
        </VisuallyHidden.Root>
        <DialogContent className="p-0 [&>button]:hidden items-center focus-visible:outline-none">
          <div className="relative w-full h-full">
            {bill.img_url && (
              <Image
                src={bill.img_url}
                width={1920}
                height={1080}
                sizes="max-h-[100vh] max-w-[100vw]"
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
