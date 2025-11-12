import { notFound } from 'next/navigation';
import { Box } from '@mui/material';

import BSAList from './views/bsa/List';
import BSADetail from './views/bsa/Detail';
import DocViewer from './views/bsa/components/DocViewer';

import { isValidPath } from '@/lib/navigation';

type PageProps = {
  params: Promise<{ second: string; segments?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { second, segments } = await params;

  // 실제 표시용 경로 문자열
  const displayPath =
    '/' + ['knowledge', second, ...(segments ?? [])].join('/');

  // 내비게이션 유효성 검증 시, 동적 ID 등 NAV 트리에 없는 꼬리 세그먼트는 제외하여 검증한다
  let idsForValidation = ['knowledge', second, ...(segments ?? [])];
  if (second === 'chunks' && Array.isArray(segments)) {
    // 예: /knowledge/chunks/commercial/bsa/[id] → 검증은 bsa까지로 제한
    if (segments[0] === 'commercial' && segments[1] === 'bsa') {
      idsForValidation = ['knowledge', second, 'commercial', 'bsa'];
    }
  }

  if (!isValidPath(idsForValidation)) return notFound();

  const isBsaType =
    second === 'chunks' &&
    Array.isArray(segments) &&
    segments[0] === 'commercial' &&
    segments[1] === 'bsa';

  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      flex={1}
      height={'100%'}
      overflow={'hidden'}
      minWidth={0}
    >
      <Box flex={1} minWidth={0} overflow={'auto'}>
        {isBsaType ? (
          segments && segments.length >= 3 ? (
            <BSADetail />
          ) : (
            <BSAList />
          )
        ) : (
          <CommonPlaceholder path={displayPath} />
        )}
      </Box>
      <DocViewer />
    </Box>
  );
}

function CommonPlaceholder({ path }: { path: string }) {
  return <div>현재 경로: {path}</div>;
}
