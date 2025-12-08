import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string,
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
    if (!isOpen) return null;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-white/10 bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground"
                >
                    ✕
                </button>
                </div>
                <div>
                {children}
                </div>

            </div>
        </div> 
    )
}