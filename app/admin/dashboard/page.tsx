import { isAuthenticated } from '@/lib/auth';
import { readData } from '@/lib/data';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin');
  }

  const data = readData();
  return <AdminDashboardClient initialData={data} />;
}
