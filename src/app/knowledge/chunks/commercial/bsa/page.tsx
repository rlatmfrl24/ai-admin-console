import { COLORS } from "@/constants/color";
import { Box } from "@mui/material";
import SelectWithLabel from "@/components/common/Select";
import InputWithLabel from "@/components/common/Input";

const STREAM_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Commercial", value: "commercial" },
  { label: "Customer Service", value: "customer-service" },
  { label: "Logistics", value: "logistics" },
  { label: "Equipment", value: "equipment" },
];
const MODULE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Basic Slot Allocation", value: "basic-slot-allocation" },
  { label: "Vessel Space Control", value: "vessel-space-control" },
  { label: "Freight Contract", value: "freight-contract" },
];
const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function BSA() {
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box
        border={1}
        borderColor={COLORS.blueGrey[100]}
        borderRadius={2}
        p={1.5}
      >
        <form
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <SelectWithLabel
            label="Stream"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={STREAM_OPTIONS}
          />
          <SelectWithLabel
            label="Module"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={MODULE_OPTIONS}
          />
          <SelectWithLabel
            label="Status"
            size="small"
            sx={{ minWidth: 160 }}
            defaultValue={"all"}
            options={STATUS_OPTIONS}
          />
          <InputWithLabel
            label="Search"
            sx={{ minWidth: 320 }}
            size="small"
            placeholder="Please enter your search item"
          />
        </form>
      </Box>
    </Box>
  );
}
