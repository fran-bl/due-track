"use client"

import { createBill, uploadImage } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bill, BillErrors } from "@/interfaces/interfaces"
import { Check, Image, X } from "lucide-react"
import React, { FormEvent } from "react"
import { toast } from "react-toastify"
import { Calendar } from "./ui/calendar"

interface AddBillDialogProps {
    onAdded: (bill: Bill) => void;
}

export function AddBillDialog({ onAdded }: AddBillDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [bill, setBill] = React.useState<Bill>({
        id: undefined,
        description: "",
        amount: 0,
        due_date: undefined,
        created_at: undefined,
        is_paid: false,
        img_url: undefined,
    })
    const [errors, setErrors] = React.useState<Partial<BillErrors>>({})
    const [selectedImage, setSelectedImage] = React.useState<File | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setBill({ ...bill, [id]: id === "amount" ? Number.parseFloat(value) || 0 : value })
        setErrors((prev) => ({ ...prev, [id]: undefined }))
    }

    const handleDateChange = (date: Date | undefined) => {
        setBill({ ...bill,  due_date: date?.toISOString() })
        setErrors((prev) => ({ ...prev, due_date: undefined }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            setSelectedImage(file)
        } else {
          setSelectedImage(null)
        }
      }

    const validateForm = (): boolean => {
        const newErrors: Partial<BillErrors> = {}
        if (!bill.description) {
            newErrors.description = "Description is required"
        }
        if (bill.amount <= 0) {
            newErrors.amount = "Amount must be greater than 0"
        }
        if (!bill.due_date) {
            newErrors.due_date = "Due date is required"
        }
        if (!selectedImage) {
            newErrors.img_url = "Image is required"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }

        const uploadResult = await uploadImage(selectedImage, bill.description)

        if (uploadResult.success) {
            bill.img_url = uploadResult.url
            toast("Račun uspješno dodan")
        } else {
            toast("Greška prilikom uploada slike")
        }

        bill.id = await createBill(bill)
        
        setOpen(false)
        setSelectedImage(null)
        onAdded(bill)
        setBill({ 
            id: undefined,
            description: "",
            amount: 0,
            due_date: undefined,
            created_at: undefined,
            is_paid: false,
            img_url: undefined,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Dodaj</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Dodaj novi račun</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Opis
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="description"
                                    value={bill.description}
                                    onChange={handleInputChange}
                                    placeholder="HEPovci me opet gnjave"
                                    className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Iznos
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    onChange={handleInputChange}
                                    step={0.01}
                                    min="0"
                                    className={errors.amount ? "border-red-500" : ""}
                                />
                                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Datum dospijeća</Label>
                            <div className="col-span-3">
                                <Calendar
                                    mode="single"
                                    selected={bill.due_date ? new Date(bill.due_date) : undefined}
                                    onSelect={handleDateChange}
                                    initialFocus
                                />
                                {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <Label className="text-right">Slika</Label>
                            <Label htmlFor="image" className="col-span-2">
                                { /* eslint-disable-next-line jsx-a11y/alt-text */ }
                                <Image className="cursor-pointer ml-24"/>
                            </Label>
                            {selectedImage ? 
                                <Check className="col-span-1" color="green"/> :
                                <X className="col-span-1" color="red"/>
                            }               
                            <div className="col-span-1">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                {errors.img_url && <p className="text-red-500 text-sm mt-1">{errors.img_url}</p>}
                            </div>                            
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Dodaj</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
