import { COLORS } from "@/constants/color";
import { ChunkProps } from "@/types/bsa";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import Chip from "@/components/common/Chip";
import { CheckCircle, MoreVert } from "@mui/icons-material";

export default function ChunkCard({
  chunk,
  selected = false,
  checkable = false,
  onSelect,
  onMore,
}: {
  chunk: ChunkProps;
  selected?: boolean;
  checkable?: boolean;
  onSelect?: (chunk: ChunkProps) => void;
  onMore?: (chunk: ChunkProps) => void;
}) {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "done":
        return <Chip label="Done" backgroundColor={COLORS.grey[200]} />;
      case "in-progress":
        return <Chip label="In-Progress" backgroundColor={COLORS.cyan[100]} />;
      case "completed":
        return <Chip label="Completed" backgroundColor={COLORS.green.A100} />;
      case "draft":
        return <Chip label="Draft" backgroundColor={COLORS.grey[300]} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        border: 1,
        borderColor: selected ? COLORS.primary.main : COLORS.blueGrey[100],
        borderRadius: 2,
        minWidth: 252,
        width: "100%",
        cursor: "pointer",
      }}
      elevation={selected ? 2 : 0}
      onClick={() => onSelect?.(chunk)}
    >
      <CardContent sx={{ "&.MuiCardContent-root": { p: 1.5 } }}>
        <Box display={"flex"} justifyContent={"space-between"}>
          {getStatusChip(chunk.status)}
          <IconButton
            sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              if (checkable) {
                onSelect?.(chunk);
              } else {
                onMore?.(chunk);
              }
            }}
          >
            {checkable ? (
              <CheckCircle sx={{ fontSize: "16px" }} />
            ) : (
              <MoreVert sx={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </Box>
        <Typography mt="10px">{chunk.title}</Typography>
        <Typography color={COLORS.blueGrey[300]} fontSize={12} fontWeight={500}>
          {chunk.progressId}
        </Typography>
      </CardContent>
    </Card>
  );
}
