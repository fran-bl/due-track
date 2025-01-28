import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import React from "react"

interface FilterDropdownProps {
    filter: string
    onFilterChange: (value: string) => void
}

export function FilterDropdown({ filter, onFilterChange }: FilterDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Filter/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filtriraj po:</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={filter} onValueChange={onFilterChange}>
                    <DropdownMenuRadioItem value="svi">Svi računi</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="placeni">Plaćeni</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="neplaceni">Neplaćeni</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="zakasnjeli">Zakašnjeli</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
