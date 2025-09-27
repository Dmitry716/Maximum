import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Muvaffaqiyatli log out' });
    response.cookies.set('refresh_token', '', { maxAge: -1 }); 
    response.cookies.set('access_token', '', { maxAge: -1 }); 

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}
