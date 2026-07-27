import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { password } = body;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'sppgpahlawan2026';

    if (password === expectedPassword) {
      // Set secure HTTP cookie
      cookies.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });

      return new Response(
        JSON.stringify({ success: true, message: 'Login berhasil' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Password salah' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Gagal login' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ cookies }) => {
  cookies.delete('admin_session', { path: '/' });
  return new Response(
    JSON.stringify({ success: true, message: 'Logout berhasil' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
