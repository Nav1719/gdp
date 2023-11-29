import { FileData } from "../models/files-data";
import DataService from "./data.service";

export class UtilityService {
  public static getHighlightedFeed(feedContent: string, filterText: string) {
    let highlightedFeedContent = feedContent;
    UtilityService.getSplittedFilterText(filterText).forEach((ft: string) => {
      const regex = new RegExp(`(${ft?.trim()})`, "gi");
      highlightedFeedContent = highlightedFeedContent.replace(
        regex,
        (match) => `<span class="highlight">${match}</span>`
      );
    });
    return highlightedFeedContent;
  }

  public static getSplittedFilterText(filterText: string): string[] {
    return (
      filterText
        ?.split(",")
        ?.filter((value: string) => value?.trim()?.length) ?? []
    );
  }

  public static getFileContent(
    fileData: FileData,
    trim = false,
    highlighted = false,
    filterText: string
  ) {
    const pdfContent = fileData?.pdfFile?.content?.trim();
    const txtContent = fileData?.txtFile?.content?.trim();
    let contentToUse = "";
    if (pdfContent?.length) {
      contentToUse = pdfContent;
    } else if (txtContent?.length) {
      contentToUse = txtContent;
    }

    contentToUse = trim ? contentToUse.slice(0, 500) : contentToUse;
    if (filterText?.trim() && highlighted)
      return UtilityService.getHighlightedFeed(contentToUse, filterText);
    return contentToUse;
  }

  public static getKeywordsCount(
    feed: FileData,
    filterText: string
  ): Record<string, number> {
    let keyWordsAndCounts: Record<string, number> = {};
    const splittedFilterText = UtilityService.getSplittedFilterText(filterText);
    const fileContent = UtilityService.getFileContent(
      feed,
      false,
      false,
      filterText
    )?.toUpperCase();

    if (fileContent) {
      splittedFilterText?.forEach((filterText: string) => {
        const regex = new RegExp(
          `(${filterText?.toUpperCase()?.trim()})`,
          "gi"
        );

        const occurrences = (fileContent.match(regex) || []).length;
        keyWordsAndCounts[filterText] = occurrences;
      });
    }

    return keyWordsAndCounts;
  }
}
