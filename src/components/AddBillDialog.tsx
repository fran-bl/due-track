"use client"

import { createBill } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { FormEvent } from "react"
import { Calendar } from "./ui/calendar"

export interface Bill {
    description: string
    amount: number
    due_date: Date | undefined
}

interface BillErorrs {
    description?: string
    amount?: string
    due_date?: string
}

export function AddBillDialog() {
    const [open, setOpen] = React.useState(false)
    const [bill, setBill] = React.useState<Bill>({
        description: "",
        amount: 0,
        due_date: undefined
    })
    const [errors, setErrors] = React.useState<Partial<BillErorrs>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setBill({ ...bill, [id]: id === "amount" ? Number.parseFloat(value) || 0 : value })
        setErrors((prev) => ({ ...prev, [id]: undefined }))
    }

    const handleDateChange = (date: Date | undefined) => {
        setBill({ ...bill,  due_date: date })
        setErrors((prev) => ({ ...prev, due_date: undefined }))
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<BillErorrs> = {}
        if (!bill.description.trim()) {
            newErrors.description = "Description is required"
        }
        if (bill.amount <= 0) {
            newErrors.amount = "Amount must be greater than 0"
        }
        if (!bill.due_date) {
            newErrors.due_date = "Due date is required"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }
        await createBill(bill)
        setOpen(false)
        setBill({ description: "", amount: 0, due_date: undefined })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add bill</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add bill</DialogTitle>
                        <DialogDescription>Add new bill:</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="description"
                                    value={bill.description}
                                    onChange={handleInputChange}
                                    placeholder="Electricity bill for the month of May"
                                    className={errors.description ? "border-red-500" : ""}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="amount"
                                    type="number"
                                    value={bill.amount === 0 ? "" : bill.amount}
                                    onChange={handleInputChange}
                                    step={0.01}
                                    min="0"
                                    className={errors.amount ? "border-red-500" : ""}
                                />
                                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Due Date</Label>
                            <div className="col-span-3">
                                <Calendar
                                    mode="single"
                                    selected={bill.due_date}
                                    onSelect={handleDateChange}
                                    fromDate={new Date()}
                                    initialFocus
                                />
                                {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
