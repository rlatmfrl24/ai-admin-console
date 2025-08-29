import { BSAMenuTreeItemProps, ChunkProps } from "@/types/bsa";
import { faker } from "@faker-js/faker";

export const BSA_MENU_TREE: BSAMenuTreeItemProps[] = [
  {
    id: "overview",
    index: 1,
    label: "Overview",
    children: [],
  },
  {
    id: "basic-slot-allocation",
    index: 2,
    label: "Basic Slot Allocation",
    children: [
      {
        id: "agreement",

        index: 1,
        label: "Basic Slot Allocation Agreement",
        children: [],
      },
      {
        id: "slot-price",
        index: 2,
        label: "Slot Price Agreement",
        children: [],
      },
      {
        id: "sector-wise-price",
        index: 3,
        label: "Sector-Wise Price",
        children: [],
      },
      {
        id: "allocation-policy",
        index: 4,
        label: "Allocation Policy",
        children: [],
      },
      {
        id: "adjustment-rules",
        index: 5,
        label: "Adjustment Rules",
        children: [],
      },
    ],
  },
  {
    id: "inquiry-by-vvd",
    index: 3,
    label: "BSA Inquiry by VVD",
    children: [
      {
        id: "vvd-overview",
        index: 1,
        label: "VVD Overview",
        children: [],
      },
      {
        id: "vvd-capacity-status",
        index: 2,
        label: "Capacity Status",
        children: [],
      },
      {
        id: "vvd-booking-status",
        index: 3,
        label: "Booking Status",
        children: [],
      },
      {
        id: "vvd-history",
        index: 4,
        label: "History",
        children: [],
      },
    ],
  },
  {
    id: "setup",
    index: 4,
    label: "Setup",
    children: [
      {
        id: "master-data",
        index: 1,
        label: "Master Data",
        children: [],
      },
      {
        id: "parameters",
        index: 2,
        label: "Parameters",
        children: [],
      },
      {
        id: "permissions",
        index: 3,
        label: "Permissions",
        children: [],
      },
    ],
  },
];

export function makeRandomChunk(): ChunkProps {
  return {
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
    attachedFile: {
      file: new File([], "test.pdf"),
      description: faker.lorem.sentence(),
    },
    updatedAt: faker.date.recent(),
    createdAt: faker.date.past(),
  };
}
