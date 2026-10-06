import { checkAuthAndRoute } from '@/utils/auth-routing';

export const dynamic = 'force-dynamic';

export async function GET() {
  await checkAuthAndRoute();
}
