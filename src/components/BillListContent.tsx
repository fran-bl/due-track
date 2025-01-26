import { getAllBills } from "@/app/actions"
import React, { useEffect } from "react"
import { Bill } from "./AddBillDialog"
import { BillCard } from "./BillCard"
import { BillCardSkeleton } from "./BillCardSkeleton"

export default function BillListContent() {
    const [bills, setBills] = React.useState<Bill[]>([])
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const data = await getAllBills()
                setBills(data ?? [])
            } catch (error) {
                console.error("Error fetching bills:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBills()
    }, [])

    if (loading) {
        return <BillCardSkeleton />
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {bills?.map((bill: Bill, index: number) => (
                <BillCard key={index} bill={bill} />
            ))}
        </div>
    )
}
