"use client"

import { deleteBill, getAllBills, markBillAsPaid } from "@/app/actions";
import { Bill } from "@/interfaces/interfaces";
import { useEffect, useState } from "react";
import { AddBillDialog } from "./AddBillDialog";
import { BillCard } from "./BillCard";
import { FilterDropdown } from "./FilterDropdown";

export default function BillList() {
    const [bills, setBills] = useState<Bill[]>([]);
    //const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
    const [filter, setFilter] = useState("svi");

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

    const handleDelete = (id: string | undefined, img_url: string | undefined) => {
        async function deleteBillFn() {
            await deleteBill(id, img_url);
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

    const handleChangeFilter = (value: string) => {
        setFilter(value)
    }
    
    return (
        <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-1 absolute top-5 left-5">
                <AddBillDialog onAdded={handleNewBill}/>
                <FilterDropdown filter={filter} onFilterChange={handleChangeFilter}/>
            </div>
            {bills?.filter(
                (bill: Bill) => 
                    filter === "placeni" ? bill.is_paid : 
                    filter === "neplaceni" ? !bill.is_paid : 
                    filter === "zakasnjeli" ? bill.due_date && new Date(bill.due_date) < new Date() && !bill.is_paid : true
            ).map((bill: Bill, index: number) => (
                <BillCard key={index} bill={bill} onSetPaid={handlePaid} onDelete={handleDelete}/>
            ))}
        </div>
    )
}
