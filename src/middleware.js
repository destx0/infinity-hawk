import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request) {
	const authToken = request.cookies.get("authToken");

	// Add /pro to protected routes
	if (
		["/exams", "/dashboard", "/pro"].some((path) =>
			request.nextUrl.pathname.startsWith(path)
		)
	) {
		if (!authToken) {
			return NextResponse.redirect(new URL("/join", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/exams/:path*", "/dashboard/:path*", "/pro/:path*"],
};
