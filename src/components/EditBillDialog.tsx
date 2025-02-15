"use client"

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
import React, { FormEvent } from "react"
import { Calendar } from "./ui/calendar"

interface EditBillDialogProps {
    onChanged: (bill: Bill) => void
    initialBill: Bill
}

export function EditBillDialog({ onChanged, initialBill }: EditBillDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [bill, setBill] = React.useState<Bill>(initialBill)
    const [errors, setErrors] = React.useState<Partial<BillErrors>>({})

    React.useEffect(() => {
        setBill(initialBill)
    }, [initialBill])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setBill({ ...bill, [id]: id === "amount" ? Number.parseFloat(value) || 0 : value })
        setErrors((prev) => ({ ...prev, [id]: undefined }))
    }

    const handleDateChange = (date: Date | undefined) => {
        setBill({ ...bill,  due_date: date?.toISOString() })
        setErrors((prev) => ({ ...prev, due_date: undefined }))
    }

    const togglePaid = () => {
        setBill({ ...bill, is_paid: !bill.is_paid })
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<BillErrors> = {}
        if (!bill.description) {
            newErrors.description = "Opis je obavezan"
        }
        if (bill.amount <= 0) {
            newErrors.amount = "Iznos mora biti veći od 0"
        }
        if (!bill.due_date) {
            newErrors.due_date = "Datum dospijeća je obavezan"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }
        
        setOpen(false)
        onChanged(bill)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Ažuriraj</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ažuriraj račun</DialogTitle>
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
                                    value={bill.amount}
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="is_paid" className="text-right">
                                Status
                            </Label>
                            <div className="col-span-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={bill.is_paid ? "bg-green-500" : "bg-red-500"}
                                    onClick={togglePaid}
                                >
                                    {bill.is_paid ? "Plaćen" : "Nije plaćen"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Spremi</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
