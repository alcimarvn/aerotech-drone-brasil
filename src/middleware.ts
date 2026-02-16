import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname

            // Public routes
            if (path === "/" || path.startsWith("/services") || path.startsWith("/contact") || path.startsWith("/about") || path.startsWith("/api/auth")) {
                return true
            }

            // Admin routes protected
            if (path.startsWith("/admin")) {
                return token?.role === "ADMIN" || token?.role === "OPERATOR" || token?.role === "FINANCIAL" // Adjust as needed
            }

            // Login page public
            if (path === "/login") {
                return true
            }

            // Default: require auth for other routes? or public?
            // For now, let's say other routes are public unless specified
            return true
        }
    }
})

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"]
}
