import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { NavigationItem } from '@/lib/types/navigation';

import {
  breadcrumbFor,
  childrenForIds,
  findItemByIds,
  isValidPath,
  pathFor,
} from '@/lib/navigation';

type PageProps = {
  params: Promise<{ second: string; segments?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { second, segments } = await params;
  const ids = ['response-management', second, ...(segments ?? [])];

  if (!isValidPath(ids)) return notFound();

  const { item } = findItemByIds(ids);
  const children: NavigationItem[] = childrenForIds(ids);
  const breadcrumbs = breadcrumbFor(pathFor(ids));

  return (
    <div style={{ padding: 16 }}>
      <nav aria-label="breadcrumb" style={{ marginBottom: 12 }}>
        {breadcrumbs.map((bc, idx) => (
          <span key={bc.href}>
            {idx > 0 && ' / '}
            <Link href={bc.href}>{bc.label}</Link>
          </span>
        ))}
      </nav>
      <h1 style={{ margin: 0 }}>{item?.label}</h1>
      {item?.description && (
        <p style={{ color: '#6b7280', marginTop: 8 }}>{item.description}</p>
      )}
      {children.length > 0 ? (
        <ul style={{ paddingLeft: 16, marginTop: 16 }}>
          {children.map((child) => (
            <li key={child.id} style={{ marginBottom: 8 }}>
              <Link href={pathFor([...ids, child.id])}>{child.label}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ marginTop: 16 }}>콘텐츠가 준비되었습니다.</div>
      )}
    </div>
  );
}
