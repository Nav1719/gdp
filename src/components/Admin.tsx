import pdfjsLib from "pdfjs-dist";
import React, { useState } from "react";
import "./Admin.css"; // Import your CSS file

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Paper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataService from "../Services/data.service";
import { UtilityService } from "../Services/utility.service";
import { FileData } from "../models/files-data";
import AdminUserManage from "./AdminUserManage";
import SearchedCards from "./SearchedCard";
import Sidebar from "./Sidebar";
import UploadFile from "./UploadFile";

function AdminPage(props: any) {
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentText, setCurrentText] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [pdfData, setPDFData] = useState<any>(null);
  const [searchResult, SetSearchResult] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState<any>("");
  const [viewPdfClicked, SetViewPdfClicked] = useState<any>({});
  const paragraph = `...`; // Your paragraph text goes here
  const [filters, setFilters] = React.useState<any>({
    year: "",
    author: "",
    filterText: "",
  });
  const navigate = useNavigate();
  const currentUser = DataService.getCurrentUser();
  const [wholeFeed, setWholeFeed] = React.useState<FileData[]>([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!currentUser || !currentUser?.email) {
      DataService.signOutUser();
      navigate("/");
    }
  }, [currentUser?.email]);

  const getAllFeed = async () => {
    try {
      setLoading(true);
      const res = await DataService.getAllFileData();
      DataService.forgetSearch();
      if (res) {
        setWholeFeed(res as unknown as FileData[]);
      } else {
        setWholeFeed([]);
        throw new Error("");
      }
    } catch (e) {
      console.log(e);
      alert("Unable to load feed !!!");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAllFeed();
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setFilters((currVal: any) => ({
      ...currVal,
      [event.target.name]: event.target.value,
    }));
  };

  const setKeyword = (value: string) => {
    setFilters((currVal: any) => ({
      ...currVal,
      filterText: value,
    }));
    DataService.rememberSearchString(value);
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  const handleSearch = () => {
    const keyword = filters.filterText;
    const searchTerms = keyword.split(/\s*(?:\s*&&\s*|\s*\|\|\s*)\s*/);
    if (searchTerms.length === 1) {
      const results = wholeFeed?.filter((item: FileData) =>
        UtilityService.getFileContent(item, false, false, filters?.filterText)
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );
      SetSearchResult(results);
    } else {
      const results = searchWithLogicalOperators(searchTerms);
      SetSearchResult(results);
    }
  };

  const searchWithLogicalOperators = (terms: any) => {
    const orResults = wholeFeed.filter((item: FileData) => {
      return terms.some((term: any) =>
        UtilityService.getFileContent(item, false, false, filters?.filterText)
          .toLowerCase()
          .includes(term.toLowerCase())
      );
    });

    return orResults;
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://2880-34-150-140-113.ngrok-free.app/api/savePDF",
        formData
      );

      console.log(response.data); // This will log the response from your Flask backend

      // You can handle the response data as needed here
    } catch (error) {
      console.error("Error uploading file:", error);

      // Handle the error appropriately
    }
  };

  const removePDF = () => {
    setPdfDoc(null);
    setCurrentText("");
  };

  const deleteFeed = async (feedId: string) => {
    if (!window.confirm("Are you sure want to delete this pdf/feed ??")) {
      return;
    }
    try {
      const res = await DataService.deleteFeedDocId(feedId);
      if (res) {
        alert("Pdf/Feed deleted successfully !");
        getAllFeed();
      } else {
        throw new Error("");
      }
    } catch (e) {
      console.log(e);
      alert("Unable to delete this feed !!!");
    }
  };

  const displayPDF = (pdfData: Uint8Array) => {};

  const searchText = () => {
    const keyword = filters.filterText;
    const searchText = keyword.toLowerCase();
    const textToHighlight = currentText.toLowerCase();
    const highlightedText = textToHighlight.replaceAll(
      searchText,
      `<span class="highlight">${searchText}</span>`
    );
    setHighlightedText(highlightedText);
  };
  const handleselectedFile = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const getFileName = (fileData: FileData) => {
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

  const getYearsOptions = () => {
    const menuItems: any[] = [];
    if (wholeFeed) {
      const uniqueYears = new Set(
        wholeFeed?.map((fileData: FileData) => fileData.year)
      );
      uniqueYears.forEach((year: any) => {
        menuItems.push(<MenuItem value={year}>{year}</MenuItem>);
      });
    }
    menuItems.unshift(<MenuItem value={"NA"}>{"--"}</MenuItem>);
    return menuItems;
  };

  const getAuthorOptions = () => {
    const menuItems: any[] = [];
    if (wholeFeed) {
      const uniqueAuthors = new Set(
        wholeFeed?.map((fileData: FileData) => fileData.authorName)
      );
      uniqueAuthors.forEach((author: string) => {
        menuItems.push(<MenuItem value={author}>{author}</MenuItem>);
      });
    }
    menuItems.unshift(<MenuItem value={"NA"}>{"--"}</MenuItem>);
    return menuItems;
  };

  const getFeedsToDisplay = () => {
    const { filterText, year, author } = filters;
    let feedsToDisplay = [...wholeFeed];
    if (filterText?.trim()) {
      const splittedFilterText: string[] =
        UtilityService.getSplittedFilterText(filterText);

      feedsToDisplay = feedsToDisplay.filter((feed: FileData) =>
        splittedFilterText.some((filterText: string) => {
          return UtilityService.getFileContent(
            feed,
            false,
            false,
            filters?.filterText
          )
            ?.toUpperCase()
            .includes(filterText?.toUpperCase()?.trim());
        })
      );
    }

    if (year && year.toUpperCase() !== "NA") {
      feedsToDisplay = feedsToDisplay.filter((fileData: FileData) => {
        return fileData.year == year;
      });
    }

    if (author && author.toUpperCase() !== "NA") {
      feedsToDisplay = feedsToDisplay.filter((fileData: FileData) => {
        return fileData.authorName === author;
      });
    }
    return feedsToDisplay ?? [];
  };

  const getPageFrameWork = (children: any) => {
    return (
      <div className="">
        <div className="row">
          <div className="col-2">
            <Sidebar setSelectedTab={setSelectedTab} />
          </div>

          <div className="col-10 page-content">{children}</div>
        </div>
      </div>
    );
  };
  if (selectedTab == "Manage Admin Users") {
    let data = getPageFrameWork(<AdminUserManage />);
    return data;
  }
  if (selectedTab == "Upload Data" || selectedTab == "Upload") {
    let data = getPageFrameWork(
      <UploadFile
        refreshData={() => {
          getAllFeed();
        }}
      />
    );
    return data;
  } else {
    return (
      <div className="">
        <div className="row">
          <div className="col-2">
            <Sidebar setSelectedTab={setSelectedTab} />
          </div>

          <div className="col-lg-10 col-12 page-content">
            <div className="container-fluid">
              <div className="">
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <IconButton sx={{ p: "10px" }} aria-label="menu">
                    <MenuIcon />
                  </IconButton>
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search Conent"
                    inputProps={{ "aria-label": "search google maps" }}
                    value={filters.filterText}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      //handleSearch();
                    }}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton
                    color="primary"
                    sx={{ p: "10px" }}
                    aria-label="directions"
                  ></IconButton>
                </Paper>
              </div>
              <p></p>
              <div className="row my-3">
                <div className="col-2">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Year</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.year}
                      label="Year"
                      name="year"
                      onChange={handleChange}
                    >
                      {getYearsOptions()}
                    </Select>
                  </FormControl>
                </div>
                <div className="col-2">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Author
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filters.author}
                      label="Author"
                      name="author"
                      onChange={handleChange}
                    >
                      {getAuthorOptions()}
                    </Select>
                  </FormControl>
                </div>
              </div>
              {loading ? (
                <>
                  <CircularProgress color="success" />
                </>
              ) : (
                <div className="row my-3">
                  {getFeedsToDisplay().map((element: FileData) => (
                    <div className="col-12  my-3" key={element.id}>
                      <SearchedCards
                        clickFunction={() =>
                          SetViewPdfClicked({
                            fileName: getFileName(element),
                            content: UtilityService.getFileContent(
                              element,
                              false,
                              false,
                              filters?.filterText
                            ),
                          })
                        }
                        fileName={getFileName(element)}
                        author={element.authorName ?? "No Author"}
                        year={element.year}
                        content={UtilityService.getFileContent(
                          element,
                          true,
                          true,
                          filters?.filterText
                        )}
                        id={element.id}
                        keyWordsAndCounts={
                          filters.filterText?.length
                            ? UtilityService.getKeywordsCount(
                                element,
                                filters?.filterText
                              )
                            : null
                        }
                        deleteFeed={deleteFeed}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPage;
