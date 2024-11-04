import { NextResponse } from 'next/server'

export function middleware(request) {
  // Add a custom header to identify exam pages
  const isExamPage = request.nextUrl.pathname.match(/^\/exams\/[^/]+$/);
  
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-is-exam-page', isExamPage ? '1' : '0')

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: '/exams/:path*',
} 