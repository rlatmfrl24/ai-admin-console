import type { BSAMenuTreeItemProps } from '@/lib/types/bsa';

const BSA_MENU_TREE: BSAMenuTreeItemProps[] = [
  {
    id: 'overview',
    index: 1,
    label: 'Overview',
    children: [],
  },
  {
    id: 'basic-slot-allocation',
    index: 2,
    label: 'Basic Slot Allocation',
    children: [
      {
        id: 'agreement',
        index: 1,
        label: 'Basic Slot Allocation Agreement',
        children: [
          {
            id: 'agreement-details',
            index: 1,
            label: 'Agreement Details',
            children: [],
          },
          {
            id: 'agreement-terms',
            index: 2,
            label: 'Agreement Terms',
            children: [],
          },
          {
            id: 'agreement-history',
            index: 3,
            label: 'Agreement History',
            children: [],
          },
        ],
      },
      {
        id: 'slot-price',
        index: 2,
        label: 'Slot Price Agreement',
        children: [
          {
            id: 'price-structure',
            index: 1,
            label: 'Price Structure',
            children: [],
          },
          {
            id: 'price-calculation',
            index: 2,
            label: 'Price Calculation',
            children: [],
          },
        ],
      },
      {
        id: 'sector-wise-price',
        index: 3,
        label: 'Sector-Wise Price',
        children: [
          {
            id: 'sector-pricing',
            index: 1,
            label: 'Sector Pricing',
            children: [],
          },
          {
            id: 'sector-analysis',
            index: 2,
            label: 'Sector Analysis',
            children: [],
          },
        ],
      },
      {
        id: 'allocation-policy',
        index: 4,
        label: 'Allocation Policy',
        children: [],
      },
      {
        id: 'adjustment-rules',
        index: 5,
        label: 'Adjustment Rules',
        children: [],
      },
    ],
  },
  {
    id: 'inquiry-by-vvd',
    index: 3,
    label: 'BSA Inquiry by VVD',
    children: [
      { id: 'vvd-overview', index: 1, label: 'VVD Overview', children: [] },
      {
        id: 'vvd-capacity-status',
        index: 2,
        label: 'Capacity Status',
        children: [
          {
            id: 'capacity-overview',
            index: 1,
            label: 'Capacity Overview',
            children: [],
          },
          {
            id: 'capacity-details',
            index: 2,
            label: 'Capacity Details',
            children: [],
          },
        ],
      },
      {
        id: 'vvd-booking-status',
        index: 3,
        label: 'Booking Status',
        children: [
          {
            id: 'booking-summary',
            index: 1,
            label: 'Booking Summary',
            children: [],
          },
          {
            id: 'booking-details',
            index: 2,
            label: 'Booking Details',
            children: [],
          },
          {
            id: 'booking-reports',
            index: 3,
            label: 'Booking Reports',
            children: [],
          },
        ],
      },
      { id: 'vvd-history', index: 4, label: 'History', children: [] },
    ],
  },
  {
    id: 'setup',
    index: 4,
    label: 'Setup',
    children: [
      {
        id: 'master-data',
        index: 1,
        label: 'Master Data',
        children: [
          {
            id: 'data-management',
            index: 1,
            label: 'Data Management',
            children: [],
          },
          {
            id: 'data-import',
            index: 2,
            label: 'Data Import',
            children: [],
          },
          {
            id: 'data-export',
            index: 3,
            label: 'Data Export',
            children: [],
          },
        ],
      },
      {
        id: 'parameters',
        index: 2,
        label: 'Parameters',
        children: [
          {
            id: 'system-parameters',
            index: 1,
            label: 'System Parameters',
            children: [],
          },
          {
            id: 'user-parameters',
            index: 2,
            label: 'User Parameters',
            children: [],
          },
        ],
      },
      {
        id: 'permissions',
        index: 3,
        label: 'Permissions',
        children: [
          {
            id: 'role-management',
            index: 1,
            label: 'Role Management',
            children: [],
          },
          {
            id: 'access-control',
            index: 2,
            label: 'Access Control',
            children: [],
          },
        ],
      },
    ],
  },
];

export default BSA_MENU_TREE;
