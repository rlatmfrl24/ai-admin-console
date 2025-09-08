export type NavigationItem = {
  label: string;
  description?: string;
  id: string;
  index?: number;
  children?: NavigationItem[];
};
