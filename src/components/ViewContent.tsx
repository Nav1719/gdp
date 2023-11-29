import { CircularProgress, Stack, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useEffect, useState } from "react";
import { FileData } from "../models/files-data";
import DataService from "../Services/data.service";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UtilityService } from "../Services/utility.service";
import KeywordsAndCountsDialog from "./KeywordsAndCountsDialog";

function ViewContent() {
  const [pdfText, setPdfText] = useState("");
  const [inputText, setInputText] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [messageList, setMessageList] = useState([""]);
  const { id } = useParams();
  const API_KEY = "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";
  const [fileData, setFileData] = useState<FileData>();
  const currentUser = DataService.getCurrentUser();
  const navigate = useNavigate();
  const [keyWordsAndCounts, setKeyWordsAndCounts] = useState<
    Record<string, number>
  >({});

  const [filterText, setFilterText] = useState<string>("");

  useEffect(() => {
    if (fileData) {
      const ft = DataService.getSearchString();
      setFilterText(ft);
      setKeyWordsAndCounts(UtilityService.getKeywordsCount(fileData, ft));
    }
  }, [fileData]);

  const getFileData = async () => {
    try {
      const res = await DataService.getAllFileDataById(id ?? "");
      if (res) {
        setFileData(res);
      } else {
        throw new Error("");
      }
    } catch (e) {
      console.log(e);
      alert("Unable to get this content");
    }
  };
  useEffect(() => {
    if (!currentUser || !currentUser?.email) {
      DataService.signOutUser();
      navigate("/");
    }
  }, [currentUser?.email]);

  useEffect(() => {
    getFileData();
  }, []);

  useEffect(() => {}, [pdfText]);

  const getFileName = () => {
    const pdfContent = fileData?.pdfFile?.fileName?.trim();
    const txtContent = fileData?.txtFile?.fileName?.trim();
    let fileNameToUse = "";
    if (pdfContent?.length) {
      fileNameToUse = pdfContent;
    } else if (txtContent?.length) {
      fileNameToUse = txtContent;
    }
    return fileNameToUse;
  };

  const fetchData = async (input: string) => {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        prompt: `content:${UtilityService.getFileContent(
          fileData as FileData,
          false,
          false,
          ""
        )}, Question: "${input}",`,
        model: "text-davinci-003",
        max_tokens: 50,
        n: 1,
        stop: ".",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    setAiAnswer(response.data.choices[0].text);
  };
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      fetchData(inputText);
    }
  };
  return (
    <div>
      <Sidebar navbarOnly />
      <div style={{ marginTop: "8rem" }}></div>
      {!fileData ? (
        <CircularProgress />
      ) : (
        <>
          <Paper className="container my-5">
            <div className="lead">
              Engage in conversation with your data using ChatGPT! 🗣💬
            </div>
            <div className="row p-4">
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                spacing={3}
              >
                <h1 className="lead">{getFileName()} 📂</h1>
                <KeywordsAndCountsDialog
                  keyWordsAndCounts={keyWordsAndCounts}
                  fileName={getFileName()}
                />
              </Stack>
              <p className="my-3">
                {" "}
                📄{" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: UtilityService.getFileContent(
                      fileData,
                      false,
                      true,
                      filterText
                    ),
                  }}
                ></div>
              </p>
            </div>
            <div className="row m-1">
              {" "}
              <div className="content mx-2"></div>
            </div>
            <div className="w-100 my-3">
              <TextField
                className="w-100 my-3"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your questions and press enter 📤"
              />
            </div>
          </Paper>

          <Paper className="container my-5">
            <p className="lead my-2 py-2">🤖 : {aiAnswer}</p>
          </Paper>
        </>
      )}
    </div>
  );
}

export default ViewContent;
