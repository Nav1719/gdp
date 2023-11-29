import DeleteIcon from "@mui/icons-material/Delete";
import Upload from "@mui/icons-material/Upload";
import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf"; // Import from react-pdf
import DataService from "../Services/data.service";
import { FileData } from "../models/files-data";
import "./Admin.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function UploadFile(props: any) {
  const [selectedTab, setSelectedTab] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pdfText, setPdfText] = useState({ fileName: "", content: "" });
  const [authorName, setAuthorName] = useState("");
  const [listOfAuthors, setListOfAuthors] = useState<any>([]);
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [textFile, setTextFile] = useState({ fileName: "", content: "" });
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {}, [pdfText]);
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  async function getAsByteArray(file: File): Promise<Uint8Array> {
    return new Uint8Array(await readFile(file));
  }

  function readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      // Create file reader
      const reader = new FileReader();

      // Register event listeners
      reader.addEventListener("loadend", (e: any) =>
        resolve(e.target.result as ArrayBuffer)
      );
      reader.addEventListener("error", reject);

      // Read file
      reader.readAsArrayBuffer(file);
    });
  }

  async function convertPdfToText(dataFile: any) {
    const pdfUrl = "./lecture.pdf";

    try {
      const loadingTask = pdfjs.getDocument(dataFile);
      const pdf: any = await loadingTask.promise;
      const totalNumPages = pdf.numPages;
      let extractedText = "";

      for (let pageNum = 1; pageNum <= totalNumPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const pageText = await page.getTextContent();

        pageText.items.forEach((item: any) => {
          if ("str" in item) {
            extractedText += item.str + " ";
          }
        });
      }
      let pdfData = localStorage.getItem("pdfData");
      setNumPages(totalNumPages);

      return extractedText;
    } catch (error) {
      console.error("Error converting PDF to text:", error);
    }
  }

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const byteFile = await getAsByteArray(file);
        // const byteFile = await getAsByteArray(file);
        let data = await convertPdfToText(byteFile);
        //props?.addToStaticData({ fileName: file.name, content: data ?? "" });
        setPdfText({ fileName: file.name, content: data ?? "" });
      } catch (error) {
        console.error("Error extracting text from PDF", error);
      }
    }
  };
  const handleAuthorChange = (event: any) => {
    setAuthorName(event.target.value);
  };

  const handleYearChange = (event: any) => {
    setYear(event.target.value);
  };

  // const handleFileChange = (event:any) => {
  //   const selectedFile = event.target.files[0];
  //   setFile(selectedFile);
  // };

  const handleTextFileChange = (event: any) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setTextFile({
          fileName: file.name,
          content: fileContent,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // You can perform actions with the form data here, such as sending it to a server
    // console.log("Author Name:", authorName);
    // console.log("Year:", year);
    // console.log("File:", pdfText);
    // console.log("Text File:", textFile);

    if (!pdfText?.fileName && !textFile?.fileName) {
      alert("Please upload at least one of txt or PDF file");
      return;
    }

    uploadFilesAndData({
      pdfFile: pdfText ?? null,
      txtFile: textFile ?? null,
      authorName,
      year,
    });
  };

  const uploadFilesAndData = async (fileData: FileData) => {
    try {
      setLoading(true);
      const res = await DataService.saveUploadedFilesData(fileData);
      if (res) {
        alert("Data saved successfully !!");
        setPdfText({ fileName: "", content: "" });
        setTextFile({ fileName: "", content: "" });
        setAuthorName("");
        setYear("");
        props.refreshData();
      } else {
        throw new Error("");
      }
    } catch (e) {
      console.log(e);
      alert("unable to add data");
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (!listOfAuthors.includes(authorName)) {
        setListOfAuthors([...listOfAuthors, authorName]);
      }
      setAuthorName("");
    }
  };

  const deleteAuthorFromAuthorList = (author: any) => {
    let filterdAuth = listOfAuthors.filter((element: any) => element != author);

    setListOfAuthors(filterdAuth);
  };

  return (
    <div className="container-fluid px-2">
      <form onSubmit={handleSubmit} className="upload-file">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={0}
        >
          <Typography variant="h4" className="my-4">
            Select PDF File
          </Typography>

          {loading && <CircularProgress color="primary" />}
        </Stack>

        {pdfText.fileName ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
          >
            <Typography variant="h5">{pdfText.fileName}</Typography>
            <IconButton
              aria-label="delete"
              onClick={() => setPdfText({ fileName: "", content: "" })}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Stack>
        ) : (
          <Button component="label" variant="contained" startIcon={<Upload />}>
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
        )}

        <p className="my-3">
          Once you upload your PDF it will be added to our dataset content
        </p>

        <Typography variant="h5">Author and Year</Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            label="Author Name"
            variant="outlined"
            color="secondary"
            value={authorName}
            onChange={handleAuthorChange}
            //onKeyDown={handleKeyPress}
            required
          />

          <div className="my-4">
            {listOfAuthors.length > 0 && (
              <p className="lead">List of added authors : </p>
            )}
            {listOfAuthors.length > 0
              ? listOfAuthors.map((author: any) => {
                  return (
                    <Chip
                      label={author}
                      onDelete={() => deleteAuthorFromAuthorList(author)}
                    />
                  );
                })
              : ""}
          </div>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <TextField
            label="Year"
            variant="outlined"
            color="secondary"
            type="number"
            value={year}
            onChange={handleYearChange}
            required
          />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          {/* <InputLabel htmlFor="text-file-input">Upload Text File</InputLabel>
          <Input
            id="text-file-input"
            type="file"
            onChange={handleTextFileChange}
            // accept=".txt" // Specify accepted file types if needed
          /> */}
          <Typography variant="h5" className="my-3">
            Select the text file
          </Typography>

          <TextField
            id="outlined-basic"
            variant="outlined"
            type="file"
            inputProps={{
              multiple: false,
            }}
            onChange={handleTextFileChange}
          />
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          sx={{ mt: 3 }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default UploadFile;
