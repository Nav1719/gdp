import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import DataService from "../Services/data.service";
import KeywordsAndCountsDialog from "./KeywordsAndCountsDialog";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  ></Box>
);

export default function SearchedCards({
  content,
  fileName,
  year,
  author,
  id,
  keyWordsAndCounts,
  deleteFeed,
}: any) {
  const navigate = useNavigate();

  const getFileNameWithoutExtension = (fileName: string): string => {
    if (fileName?.trim()) {
      const fileNameSplitted = fileName.trim().split(".");
      return fileNameSplitted.slice(0, fileNameSplitted.length - 1).join("");
    }
    return "unnamed";
  };

  const downloadAsTextFile = () => {
    const fileData = `${getFileNameWithoutExtension(fileName)}

${content}
    `;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${getFileNameWithoutExtension(fileName)}.txt`;
    link.href = url;
    link.click();
  };

  return (
    <Card sx={{ width: "95%" }}>
      <CardContent sx={{ width: "95%", marginLeft: "20px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {fileName}
          </Typography>

          <KeywordsAndCountsDialog
            keyWordsAndCounts={keyWordsAndCounts}
            fileName={fileName}
          />
        </Stack>
        <Typography variant="h5" component="div">
          {year}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {author}
        </Typography>
        <Typography variant="body2">
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </Typography>
      </CardContent>
      <CardActions sx={{ width: "95%", marginLeft: "20px" }}>
        <Stack direction={"row"} spacing={4}>
          <Button
            size="small"
            disabled={!id}
            onClick={() => navigate(`view-content/${id}`)}
            color="secondary"
          >
            View Content
          </Button>
          <Button
            size="small"
            disabled={!id}
            onClick={() => downloadAsTextFile()}
            color="primary"
          >
            Download
          </Button>

          {DataService.isCurrentUserSuperUser() && (
            <Button
              size="small"
              disabled={!id}
              onClick={() => deleteFeed(id)}
              color="error"
            >
              Delete
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}
