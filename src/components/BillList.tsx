"use client"

import { Suspense } from "react"
import { BillCardSkeleton } from "./BillCardSkeleton"
import BillListContent from "./BillListContent"

export default function BillList() {
    return (
        <Suspense fallback={<BillListSkeleton/>}>
            <BillListContent/>
        </Suspense>
    )
}

function BillListSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <BillCardSkeleton key={index}/>
          ))}
        </div>
    )
}