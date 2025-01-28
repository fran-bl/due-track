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
  bill: Bill;
  onSetPaid: (id: string | undefined) => void;
  onDelete: (id: string | undefined, img_url: string | undefined) => void;
}

export function BillCard({ bill, onSetPaid, onDelete }: BillCardProps) {
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
          <CardContent className="aspect-square relative overflow-hidden rounded-lg" onClick={() => setIsImageOpen(true)}>
            <Image 
              src={bill.img_url}
              fill
              style={{ objectFit: "cover" }}
              alt="Image"
            />
          </CardContent> :
          <CardContent className="aspect-square relative overflow-hidden rounded-lg">
            <Image 
              src="/placeholder.jpg"
              fill
              style={{ objectFit: "cover" }}
              alt="Missing image"
            />
          </CardContent>
        }
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-3xl">{bill.description}</CardTitle>
          <Download className="w-8 h-8 cursor-pointer" onClick={handleDownload} />
        </CardHeader>
        <CardContent>
          <p className="text-2xl text-right gradient-text text-transparent animate-gradient">{bill.amount + " €"}</p>
          {bill.due_date && (
            <>
              <div className="flex justify-between">
                <Label htmlFor="due-date" className="text-xl">Datum dospijeća:</Label>
                <p className="text-right text-2xl" id="due-date">
                  {new Date(bill.due_date).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }) + "."}
                </p>
              </div>
                <p className="text-right text-primary text-xl">
                  {(() => {
                    const diff = new Date(bill.due_date).getTime() - new Date().getTime();
                    return diff > 0 ? <>{`(za ${Math.ceil(diff / (1000 * 60 * 60 * 24))} dan/a)`}</> : <>&nbsp;</>       
                  })()}
                </p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onDelete(bill.id, bill.img_url)}>Obriši</Button>
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
