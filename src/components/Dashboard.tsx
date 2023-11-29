import { useState } from "react";
import "./DashboardStyle.css"; // Import your CSS file

function Dashboard() {
  const [keyword, setKeyword] = useState("");
  const [highlightedText, setHighlightedText] = useState("");
  const [imageVisible, setImageVisible] = useState(false);

  const paragraph = `...`; // Your paragraph text goes here

  const searchAndDisplay = () => {
    const keywordLower = keyword.toLowerCase();
    const paragraphLower = paragraph.toLowerCase();

    if (paragraphLower.includes(keywordLower)) {
      const regex = new RegExp(keywordLower, "g");
      const highlightedParagraph = paragraph.replace(
        regex,
        (match) => `<span class="highlight">${match}</span>`
      );
      setHighlightedText(highlightedParagraph);
      setImageVisible(true);
    } else {
      setHighlightedText("Keyword not found.");
      setImageVisible(false);
    }
  };

  return (
    <div>
      <div className="sidebar">
        <a className="nav" href="Dashboard.html">
          Home
        </a>
        <a className="nav" href="Admin.html">
          Admin
        </a>
        <a className="nav" href="RequestAdmin.html">
          Request Admin Access
        </a>
        <a className="nav" href="#">
          About
        </a>
        <a className="nav" href="#">
          Contact
        </a>
        <a className="nav logout" href="OpenPage.html">
          Log Out
        </a>
      </div>
      <div className="content">
        <div className="container">
          <input
            type="text"
            id="keyword"
            placeholder="Enter keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="button" onClick={searchAndDisplay}>
            Search
          </button>

          <div id="pdf-container"></div>
          {/* PDF related components go here */}

          <br />
          <div
            id="result"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          ></div>
          <div id="image-container">
            {imageVisible && (
              <img src="images/african.jpg" alt="Related Image" />
            )}
          </div>

          <br />
          <h3>Featured Articles</h3>
          <div className="viewFile">
            <a href="ViewFile.html">
              The Crisis, Vol. 1, No. 2. (December, 1910).
            </a>
            <br />
            <br />
            <a href="ViewFile2.html">Volumes 1-2 1910-1911[1].doc</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
