export interface Bill {
    description: string
    amount: number
    due_date: Date | undefined
}

export interface DBBill {
    id: number;
    description: string;
    amount: number;
    due_date: Date;
    created_at: Date;
    is_paid: boolean;
}

export interface BillErorrs {
    description?: string
    amount?: string
    due_date?: string
}