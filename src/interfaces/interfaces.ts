export interface Bill {
    id: number | undefined;
    description: string | undefined;
    amount: number;
    due_date: Date | undefined;
    created_at: Date | undefined;
    is_paid: boolean;
}

export interface BillErorrs {
    description?: string
    amount?: string
    due_date?: string
}