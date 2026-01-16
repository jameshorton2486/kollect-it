/**
 * Middleware Authentication + RBAC Tests
 *
 * Intent: validate auth redirect behavior and role-based access control.
 */

import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { createServerClient } from '@supabase/ssr';

jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}));

describe('middleware auth + rbac', () => {
  const baseUrl = 'http://localhost:3000';
  const mockAuthSession = (session: unknown) => {
    (createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session },
          error: null,
        }),
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthSession(null);
  });

  it('redirects unauthenticated users to login for protected routes', async () => {
    const req = new NextRequest(`${baseUrl}/dashboard`);
    const res = await middleware(req);

    // Intent: protected routes require auth.
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/login');
    expect(res.headers.get('location')).toContain('redirect=/dashboard');
  });

  it('allows authenticated users to access protected routes', async () => {
    mockAuthSession({
      user: {
        id: 'user-123',
        email: 'reporter@example.com',
        user_metadata: { role: 'REPORTER' },
      },
    });

    const req = new NextRequest(`${baseUrl}/dashboard`);
    const res = await middleware(req);

    // Intent: authenticated + allowed role continues.
    expect(res.status).not.toBe(307);
  });

  it('blocks users without required roles', async () => {
    mockAuthSession({
      user: {
        id: 'user-456',
        email: 'reporter@example.com',
        user_metadata: { role: 'REPORTER' },
      },
    });

    const req = new NextRequest(`${baseUrl}/admin`);
    const res = await middleware(req);

    // Intent: role not permitted for route results in unauthorized redirect.
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/unauthorized');
    expect(res.headers.get('location')).toContain('reason=insufficient_role');
  });

  it('allows users with required roles', async () => {
    mockAuthSession({
      user: {
        id: 'user-789',
        email: 'admin@example.com',
        user_metadata: { role: 'ADMIN' },
      },
    });

    const req = new NextRequest(`${baseUrl}/admin`);
    const res = await middleware(req);

    // Intent: ADMIN role grants access to admin routes.
    expect(res.status).not.toBe(307);
  });

  it('bypasses middleware for public routes', async () => {
    const req = new NextRequest(`${baseUrl}/login`);
    const res = await middleware(req);

    // Intent: public routes are accessible without auth.
    expect(res.status).not.toBe(307);
  });
});
