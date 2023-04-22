import * as pdfjs from "pdfjs-dist/legacy/build/pdf";

export const pdfToText = () =>
  async function pdfToText(data: ArrayBuffer) {
    const pdf = await pdfjs.getDocument({
      data,
      useSystemFonts: true, // https://github.com/mozilla/pdf.js/issues/4244#issuecomment-1479534301
    }).promise;

    const pageTexts: string[] = [];
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const pageContent = await page.getTextContent();

      pageTexts.push(
        pageContent.items
          // limit to TextItem, extract str:
          .filter((item) => (item as any).str != null)
          .map((item) => (item as any).str as string)
          .join(" ")
      );
    }

    // reduce whitespace to single space
    return pageTexts.join("\n").replace(/\s+/g, " ");
  };
