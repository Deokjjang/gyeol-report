import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { readerAccess, reviewConfiguration } from '../access';
import { Review } from './Review';
export const dynamic = 'force-dynamic';
export default async function Page() {
  if (!readerAccess(process.env, (await headers()).get('host'))) notFound();
  if (!reviewConfiguration(process.env)) return <p role="alert">검증된 Reader 설정이 필요합니다.</p>;
  return <Review />;
}
