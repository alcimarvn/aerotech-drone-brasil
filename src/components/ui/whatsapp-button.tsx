import { WhatsAppIcon } from "./whatsapp-icon"

export function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/559888281228"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
            aria-label="Falar no WhatsApp"
        >
            <WhatsAppIcon className="h-8 w-8 text-white" />
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
            </span>
        </a>
    )
}
