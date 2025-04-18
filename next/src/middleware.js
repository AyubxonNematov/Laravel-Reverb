import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register'];

    // If the user is not authenticated and trying to access a protected route
    if (!token && !publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If the user is authenticated and trying to access auth pages
    if (token && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 