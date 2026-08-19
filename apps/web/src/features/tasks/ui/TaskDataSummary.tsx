import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  formatTaskDataLabel,
  formatTaskDataValue,
} from "../utils/format-task-data";

interface TaskDataSummaryProps {
  data: Record<string, unknown>;
}

/** Presents consumer-owned task data as a readable completion summary. */
export const TaskDataSummary = ({ data }: TaskDataSummaryProps) => {
  const entries = Object.entries(data);

  if (entries.length === 0) return null;

  return (
    <Stack spacing={2.5}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Task summary
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 3,
        }}
      >
        {entries.map(([key, value]) => (
          <Stack key={key} spacing={0.75} sx={{ py: 0.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {formatTaskDataLabel(key)}
            </Typography>
            <Typography sx={{ fontWeight: 600, whiteSpace: "pre-line" }}>
              {formatTaskDataValue(value, key)}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
};
