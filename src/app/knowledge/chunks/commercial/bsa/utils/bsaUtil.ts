import type {
  BSATableProps,
  BSAMenuTreeItemProps,
  ChunkProps,
} from "@/lib/types/bsa";
import { faker } from "@faker-js/faker";
import menuTree from "@/lib/constants/bsa-menu-tree";

function isValidNumericId(id: string | number): boolean {
  const n = typeof id === "number" ? id : Number(id);
  return Number.isInteger(n) && n > 0 && n < 1000000;
}

export function getBsaRowById(idParam: string | number): BSATableProps | null {
  if (!isValidNumericId(idParam)) return null;
  const id = typeof idParam === "number" ? idParam : Number(idParam);

  const isPdf = id % 2 === 0;
  const fileExt = isPdf ? ".pdf" : ".png";
  const date = new Date(2024, id % 12, (id % 27) + 1);

  return {
    id,
    stream: "Commercial",
    module: "Basic Slot Allocation",
    fileName: `file_${id}${fileExt}`,
    pageName: `page_${id}`,
    category: `category_${id % 10}`,
    chunk: "BSA",
    semanticTitle: `semantic_title_${id}`,
    semanticSummary: `semantic_summary_${id}`,
    semanticChunk: `semantic_chunk_${id}`,
    language: "English",
    date,
    version: `${(id % 100) + 1}`,
    filePath: `/files/${id}${fileExt}`,
  };
}

export function getBsaMenuTree(): BSAMenuTreeItemProps[] {
  return menuTree as BSAMenuTreeItemProps[];
}

export function makeRandomChunk(): ChunkProps {
  return {
    content: faker.lorem.paragraphs(5),
    title: faker.lorem
      .words(3)
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    status: faker.helpers.arrayElement([
      "done",
      "in-progress",
      "completed",
      "draft",
    ]),
    progressId: faker.string.numeric(4),
    attachedFile: [],
    embeddingAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    createdAt: faker.date.past(),
  };
}
