"use client"

import { deleteBill, getAllBills, markBillAsPaid } from "@/app/actions";
import { Bill } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { AddBillDialog } from "./AddBillDialog";
import { BillCard } from "./BillCard";

export default function BillList() {
    const [bills, setBills] = useState<Bill[]>([]);

    useEffect(() => {
        async function fetchBills() {
        const fetchedBills = await getAllBills();
            setBills(sortBills(fetchedBills));
        }
        fetchBills();
    }, []);

    const handleNewBill = (newBill: Bill) => {
        setBills(sortBills([...bills, newBill]));
    }

    const handlePaid = (id: string | undefined) => {
        async function markAsPaid() {
            await markBillAsPaid(id);
        }
        markAsPaid();

        setBills(sortBills(bills.map(bill => {
            if (bill.id === id) {
                return { ...bill, is_paid: true };
            }
            return bill;
        })));
    }

    const handleDelete = (id: string | undefined) => {
        async function deleteBillFn() {
            await deleteBill(id);
        }
        deleteBillFn();

        setBills(sortBills(bills.filter(bill => bill.id !== id)));
    }

    const sortBills = (bills: Bill[]) => {
        return bills.sort((a, b) => {
            const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
            const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
            return dateA - dateB;
        });
    }
    
    return (
        <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-4">
            <div className="absolute top-5 left-5">
                <AddBillDialog onAdded={handleNewBill}/>
            </div>
            {bills?.map((bill: Bill, index: number) => (
                <BillCard key={index} bill={bill} onSetPaid={handlePaid} onDelete={handleDelete}/>
            ))}
        </div>
    )
}
