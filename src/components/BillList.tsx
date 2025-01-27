"use client"

import { getAllBills } from "@/app/actions";
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

    const sortBills = (bills: Bill[]) => {
        return bills.sort((a, b) => {
            const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
            const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
            return dateA - dateB;
        });
    }
    
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="absolute top-5 left-5">
                <AddBillDialog onAdded={handleNewBill}/>
            </div>
            {bills?.map((bill: Bill, index: number) => (
                <BillCard key={index} bill={bill} />
            ))}
        </div>
    )
}
