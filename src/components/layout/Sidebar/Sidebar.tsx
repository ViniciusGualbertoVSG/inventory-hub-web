import Link from "next/link"

export function Sidebar() {
    return(
        <aside className="w-64 flex-shrink-0 bg-muted p-4">
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-4">Meu Estoque</h2>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" 
                            className="flex items-center gap-2 rounded-md p-2 text-muted-foreground hover:bg-white/20 hover:text-foreground"
                        >
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/inventory" 
                            className="flex items-center gap-2 rounded-md p-2 text-muted-foreground hover:bg-white/20 hover:text-foreground"
                        >
                            <span>Inventory</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/members" 
                            className="flex items-center gap-2 rounded-md p-2 text-muted-foreground hover:bg-white/20 hover:text-foreground"
                        >
                            <span>Members</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/my-companies" 
                            className="flex items-center gap-2 rounded-md p-2 text-muted-foreground hover:bg-white/20 hover:text-foreground"
                        >
                            <span>My Companies</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}