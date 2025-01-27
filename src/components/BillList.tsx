"use client"

import { getAllBills } from "@/app/actions";
import { DBBill } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { BillCard } from "./BillCard";

export default function BillList() {
    const [bills, setBills] = useState<DBBill[]>([]);

    useEffect(() => {
        async function fetchBills() {
        const fetchedBills = await getAllBills();
            setBills(fetchedBills);
        }
        fetchBills();
    }, []);
    
    return (
        <div className="grid grid-cols-2 gap-4">
            {bills?.map((bill: DBBill, index: number) => (
                console.log(bill),
                <BillCard key={index} bill={bill} />
            ))}
        </div>
    )
}
