import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

export default function KeywordsAndCountsDialog({
  keyWordsAndCounts,
  fileName,
}: any) {
  const [dialogOpen, setDialog] = React.useState(false);
  console.log(keyWordsAndCounts);

  const hasKeyWordsAndCounts = () => {
    if (keyWordsAndCounts) {
      return Object.entries(keyWordsAndCounts)?.length > 0;
    }
    return false;
  };

  return (
    <>
      {hasKeyWordsAndCounts() && (
        <>
          <KeywordsDialog
            open={dialogOpen}
            handleClose={() => {
              setDialog(false);
            }}
            keywordsAndCounts={keyWordsAndCounts}
            fileName={fileName}
          />

          <Chip
            label="keyword counts"
            color="primary"
            variant="outlined"
            clickable
            size="small"
            onClick={() => setDialog(true)}
          />
        </>
      )}
    </>
  );
}

function KeywordsDialog({
  open,
  handleClose,
  keywordsAndCounts,
  fileName,
}: any) {
  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle>File name : {fileName}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "auto" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Keyword</TableCell>
                <TableCell align="right">Occurrence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(keywordsAndCounts).map(
                ([keyword, wordCount]: [string, unknown], index: number) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {keyword}
                    </TableCell>
                    <TableCell align="right">{wordCount as number}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
