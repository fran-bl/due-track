"use client"

import { Bill } from "./AddBillDialog";
import { BillCard } from "./BillCard";

interface BillListProps {
    bills: Bill[];
}

export default function BillList({ bills }: BillListProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {bills?.map((bill: Bill, index: number) => (
                <BillCard key={index} bill={bill} />
            ))}
        </div>
    )
}
