import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    isLoading?: boolean;
}

export function Button({
    children,
    className = "",
    variant = "primary",
    isLoading = false,
    ...props}: ButtonProps){

        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";

        const variants = {
            primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            outline: "border border-white/10 bg-transparent shadow-sm hover:bg-white/5 text-foreground",
            ghost: "hover:bg-white/5 text-foreground",
            danger: "bg-red-500 text-white hover:bg-red-600",
        }

        const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

        return(
            <button className={combinedClasses} disabled={isLoading || props.disabled} {...props}>
                {isLoading ? (
                    <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Carregando...
                    </span>
                ) : (
                    children
                )}
            </button>
        )
    }