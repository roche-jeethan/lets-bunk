import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Middleware auth check:', { user });

    if (!user && (req.nextUrl.pathname.startsWith('/api/absences') || req.nextUrl.pathname.startsWith('/dashboard'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/absences/:path*', '/dashboard/:path*'],
};