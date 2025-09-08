## AI Admin Console (UI)

Next.js + MUI 기반의 UI 프로젝트입니다. BSA(Basic Slot Allocation) 지식데이터 관리 화면이 포함되어 있으며, 현재는 일부 화면에서 faker를 이용한 목 데이터로 동작합니다. 본 문서는 API 연동 담당자를 위한 인수인계 가이드입니다.

### 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

---

## 1) faker.js 사용 위치와 API 교체 안내

- 의존성: `devDependencies`에 `@faker-js/faker`가 포함되어 있습니다.
- 사용 파일 목록
  - `src/app/knowledge/chunks/commercial/bsa/page.tsx`
    - 목록 그리드용 `rows`를 faker로 생성
    - 교체: 검색/필터 폼 제출 시 서버 목록 API 호출로 대체
  - `src/app/knowledge/chunks/commercial/bsa/[id]/edit.tsx`
    - 새 Chunk 생성 시 `progressId`를 faker로 발급
    - 교체: 서버 생성 API(POST)로 ID 발급 후 상태 반영
  - `src/app/knowledge/chunks/commercial/bsa/utils/bsaUtil.ts`
    - `makeRandomChunk()` faker 기반 랜덤 Chunk 생성
    - `getBsaRowById()`는 목 유틸(계산값)
    - 교체: 상세/목록 API 응답으로 대체하거나 삭제

교체 시나리오 예시

```ts
// 목록 조회 (기존: faker rows)
const res = await fetch(`/api/bsa?stream=${stream}&module=${module}&status=${status}&search=${search}`);
const list: BSATableProps[] = await res.json();
setRows(list);

// 상세 조회 (기존: getBsaRowById)
const res = await fetch(`/api/bsa/${id}`);
const row: BSATableProps = await res.json();
setSelectedRow(row);

// Chunk 목록 조회 (기존: makeRandomChunk * 10)
const res = await fetch(`/api/bsa/${id}/chunks?section=${selectedTreeItemId}`);
const chunks: ChunkProps[] = await res.json();
setChunks(chunks);

// Chunk 생성 (기존: faker로 progressId 생성)
const res = await fetch(`/api/bsa/${id}/chunks`, { method: 'POST', body: JSON.stringify(newChunk) });
const created = await res.json(); // 서버가 progressId 발급
addChunk(created);

// Chunk 저장 (Edit Save)
await fetch(`/api/bsa/${id}/chunks/${progressId}`, { method: 'PATCH', body: JSON.stringify(updated) });
updateChunk(updated);

// 파일 업로드
const fd = new FormData(); files.forEach(f => fd.append('files', f));
const res = await fetch(`/api/uploads`, { method: 'POST', body: fd });
const uploaded = await res.json(); // [{ url, name, ... }]
```

---

## 2) API 연결 지점과 유의사항

- `src/app/knowledge/chunks/commercial/bsa/page.tsx`
  - 폼 제출 `onSubmit` 내 fetch 호출로 목록 로드
  - 그리드 `onRowClick`에서 상세 화면으로 이동하며, 선택 행을 `useBSAStore.setSelectedRow`로 저장
  - 유의: 서버 날짜/버전/경로 스키마와 그리드 컬럼 매핑 확인

- `src/app/knowledge/chunks/commercial/bsa/[id]/page.tsx`
  - `selectedData`: `getBsaRowById` → 상세 API로 교체
  - `setChunks(makeRandomChunk())`: 섹션 변경 시 `GET /:id/chunks?section=...` 호출로 교체
  - 유의: URL 파라미터 타입 일치, 스키마 변경 시 컬럼/상태 타입 동기화

- `src/app/knowledge/chunks/commercial/bsa/[id]/edit.tsx`
  - 새 Chunk 생성, 저장, 파일 첨부가 핵심 연동 포인트
  - 유의: 파일 `URL.createObjectURL`은 미리보기 용도이므로 서버 업로드 후 반환된 URL로 교체, 메모리 누수 방지(`URL.revokeObjectURL`)

- `src/app/knowledge/chunks/commercial/bsa/[id]/embedding.tsx`
  - 선택한 Chunk에 대한 임베딩 요청 → 배치 API로 교체(큐/상태 관리 시 폴링/소켓 고려)

- 전역 상태: `src/app/knowledge/chunks/commercial/bsa/utils/bsaStore.ts`
  - 조회/저장/삭제/임베딩 완료 후 `setChunks`, `updateChunk`, `removeChunk`, `setSelectedRow` 사용
  - 유의: 낙관적 업데이트 실패 롤백, `progressId`는 서버 발급 권장

---

## 3) 프로젝트 구조와 역할

```
src/
  app/
    knowledge/
      chunks/
        commercial/
          bsa/
            page.tsx                # BSA 목록 화면 (검색 + 그리드)
            [id]/
              page.tsx              # BSA 상세 컨테이너(탭/트리/상단 단일행)
              edit.tsx              # Chunk 편집 패널
              embedding.tsx         # 임베딩 패널
              components/
                ChunkCard.tsx       # Chunk 카드 UI
                AttachmentPreview.tsx# 첨부 미리보기 UI
                FilterChipMenu.tsx  # 상태 필터 메뉴
                MenuTree.tsx        # 좌측 메뉴 트리
            utils/
              bsaUtil.ts            # 목 유틸(faker), 메뉴트리 로더
              bsaStore.ts           # Zustand 스토어
  components/                        # 공통 UI 컴포넌트(Input/Select 등)
  lib/
    constants/                       # 상수(메뉴트리, 상태 등)
    theme.ts                         # MUI 테마/색상
    types/                           # 타입 정의(BSA, 네비게이션 등)
```

---

## 4) 의존성, 구조, 유의사항

- 주요 런타임 의존성
  - **Next.js 15**, **React 19**, **MUI 7**, **@mui/x-data-grid 8**
  - **zustand**: 전역 상태
  - **date-fns**: 날짜 포맷팅

- 개발 의존성
  - **@faker-js/faker**: 목 데이터 전용(→ API 연동 후 제거 가능)
  - **ESLint/TypeScript**: 코드 품질/타입

- UI/데이터 연동 유의점
  - **타입 일치**: `src/lib/types/bsa.ts`의 `BSATableProps`, `ChunkProps`에 서버 스키마를 맞추세요.
  - **ID 관리**: `progressId`는 서버에서 발급/보장. 클라이언트 생성은 임시 목 단계에서만.
  - **파일 업로드**: 미리보기용 ObjectURL ↔ 서버 URL로 전환, 정리 필수.
  - **비동기 상태**: 저장/삭제/임베딩 시 낙관적 업데이트 사용 시 실패 처리/롤백 고려.
  - **접근성/성능**: 대용량 목록은 서버 페이징/가상 스크롤 고려(DataGrid 옵션).

---

## 스크립트

- `npm run dev`: 개발서버 시작
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 실행
- `npm run lint`: 린트 검사
