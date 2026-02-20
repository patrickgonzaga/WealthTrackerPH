import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Changed "middleware" to "proxy"
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the session token from cookies
    const token = request.cookies.get('sb-access-token');

    // Protected routes
    const protectedRoutes = ['/dashboard', '/savings', '/stocks', '/time-deposits'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Auth routes
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if accessing auth route with token
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/savings/:path*', '/stocks/:path*', '/time-deposits/:path*', '/login', '/register'],
};
