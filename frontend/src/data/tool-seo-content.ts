// Tier-1 tool SEO content — single source of truth.
// Feeds: per-tool metadata (layout.tsx), the visible ToolSeoSection
// rendered below each tool, and the FAQPage JSON-LD in each layout.
// Content is grounded in each tool's actual implementation.

export interface ToolSeoContent {
  slug: string;
  label: string;
  searchTitle: string;
  metaDescription: string;
  intro: string[];
  steps: { title: string; text: string }[];
  features: { title: string; text: string }[];
  useCases: string[];
  tips: string[];
  faqs: { q: string; a: string }[];
  related: { slug: string; label: string }[];
}

export const TOOL_SEO: Record<string, ToolSeoContent> = {
  'merge-pdf': {
  "faqs": [
    {
      "a": "Yes. The merger runs completely in your browser using the pdf-lib JavaScript library, and your files are never uploaded to any server. That makes it suitable for bank statements, contracts and identity documents, although you should still use a device you trust.",
      "q": "Is it safe to merge confidential PDFs here?"
    },
    {
      "a": "You need at least two files, and the tool sets no fixed maximum number. In practice the limit is your device's memory, because every document loads in the browser. Most people merge two to a few dozen files without problems.",
      "q": "How many PDF files can I merge at once?"
    },
    {
      "a": "No. Pages are copied directly from each source document into the new file rather than being re-rendered as images. Your original text, fonts, images and vector graphics are carried across as they are, so the merged PDF looks the same as the separate files did.",
      "q": "Will merging change the quality of my PDFs?"
    },
    {
      "a": "Yes. Documents are merged in the order they appear in the numbered selection list. Check the list before clicking merge, remove anything that does not belong, and add files in the sequence you want. To rearrange individual pages afterwards, use the Organize PDF tool.",
      "q": "Can I choose the order of the merged files?"
    },
    {
      "a": "The usual causes are a password-protected PDF or a damaged file, because the browser cannot open either of them. Remove the password in the tool you created the file with, or repair and re-export the document, then try the merge again.",
      "q": "Why did my merge fail with an error?"
    },
    {
      "a": "The tool itself states no file size limit, and nothing is uploaded, so slow upload speeds are irrelevant. Very large files still need enough memory on your phone or computer to open, so closing other heavy browser tabs helps with big documents.",
      "q": "Is there a file size limit for merging?"
    }
  ],
  "features": [
    {
      "text": "Merging runs entirely in your browser with pdf-lib. No document is uploaded, stored or shared, which makes the tool safer for personal and financial paperwork.",
      "title": "Private by design"
    },
    {
      "text": "Files are combined in the exact order shown in the numbered selection list, and pages are copied directly, so text, images and formatting carry across unchanged.",
      "title": "Your order, preserved"
    },
    {
      "text": "The tool sets no file size limit of its own. Practical limits come only from your device memory, so large reports and scanned bundles are welcome.",
      "title": "No size limit stated"
    },
    {
      "text": "There is no signup, no payment step and no branding added to your document. The result shows page count and size before you save it.",
      "title": "Free, no watermark"
    }
  ],
  "intro": [
    "Scattered PDFs slow everything down: an application split across five attachments, a report whose chapters sit in separate files, or invoices that must be sent as one pack. This merge PDF tool combines two or more PDF documents into a single file, in exactly the order you list them. It is built for students assembling assignments, office staff bundling reports, freelancers sending proposals and anyone who regularly has to turn a pile of separate documents into one tidy, shareable PDF.",
    "Everything happens inside your browser using the pdf-lib library, so your files are never uploaded to a server. There is no account to create, no watermark added to the result and no stated file size limit. Because nothing travels over the network, merging is fast even on a slow connection, and confidential documents such as bank statements or contracts stay on your own device from start to finish."
  ],
  "metaDescription": "Merge PDF files online for free: combine two or more PDFs into one document in your chosen order, right in your browser, with no signup and no watermark.",
  "related": [
    {
      "label": "Split PDF",
      "slug": "split-pdf"
    },
    {
      "label": "Organize PDF",
      "slug": "organize-pdf"
    },
    {
      "label": "Images to PDF",
      "slug": "images-to-pdf"
    },
    {
      "label": "Rotate PDF",
      "slug": "rotate-pdf"
    },
    {
      "label": "Remove PDF Pages",
      "slug": "remove-pdf-pages"
    }
  ],
  "searchTitle": "Merge PDF Online Free – Combine Files Fast",
  "slug": "merge-pdf",
  "steps": [
    {
      "text": "Click Select PDF Files and choose two or more PDFs from your phone or computer. Hold Shift or Ctrl to pick several at once; non-PDF files are filtered out automatically.",
      "title": "Select your PDF files"
    },
    {
      "text": "Review the numbered list, which is the order pages will appear in the combined file. Remove any file with the cross button, clear the whole list, or add more documents.",
      "title": "Check the order"
    },
    {
      "text": "Click Merge PDFs Now. The tool copies every page from each document into one new PDF and shows progress file by file while it works through your list.",
      "title": "Merge the PDFs"
    },
    {
      "text": "Your merged PDF downloads automatically, showing page count and size. Use the download button to save a copy, or reset and merge a new set.",
      "title": "Download the combined file"
    }
  ],
  "tips": [
    "Rename files with numbers before selecting them, such as 01-cover and 02-report. Clear names make checking the final sequence in the numbered list much easier.",
    "Remove and re-add a file that sits in the wrong position. There is no drag reordering, so rebuilding a short list is the quickest fix.",
    "Unlock password-protected PDFs first. Protected or corrupted files cannot be read by the browser engine and will stop the merge with an error.",
    "After merging, use the Organize PDF tool if individual pages still need rearranging, rotating or deleting inside the combined document rather than between whole files."
  ],
  "useCases": [
    "Combine monthly bank statements into one file for a loan application",
    "Join separate assignment chapters into a single submission PDF",
    "Bundle invoices and receipts for monthly accounting or tax records",
    "Merge a CV, cover letter and certificates into one application pack",
    "Put scanned contract pages together as one signed agreement file"
  ],
  "label": "Merge PDF"
},
  'split-pdf': {
  "faqs": [
    {
      "a": "No. This splitter always separates every page of the document. If you only need specific pages or a range such as pages 3 to 6, use the Extract PDF Pages tool instead, which is designed for selecting part of a document.",
      "q": "Can I split only a page range instead of every page?"
    },
    {
      "a": "Splitting runs entirely in your browser with pdf-lib, and the file is never uploaded to a server. Contracts, statements and personal records stay on your device, which makes this a safer option than converter sites that process documents on their own machines.",
      "q": "Are my files uploaded to a server?"
    },
    {
      "a": "Pages are copied directly into the new single-page documents instead of being flattened into images. Text stays selectable, and fonts, images and vector graphics are carried over from the original, so each separated page looks exactly as it did in the full document.",
      "q": "Will the separated pages lose quality?"
    },
    {
      "a": "It means exactly that: the document contains a single page, so there is nothing to separate. If you need that page on its own, it already is a standalone PDF. For longer documents of two pages or more, the splitter works normally.",
      "q": "Why does it say my PDF has only one page?"
    },
    {
      "a": "The download is one ZIP file containing a folder of separate PDFs, named page_001.pdf, page_002.pdf and so on. Open it with any standard archive tool on Windows, Mac, Android or iPhone to access the individual pages.",
      "q": "What format do I receive after splitting?"
    },
    {
      "a": "Protected files cannot be opened by the browser-based engine, and corrupted files fail while loading. Remove the password using the software that created the document, or export a fresh copy of the PDF, then run the splitter again.",
      "q": "Why did splitting fail on my file?"
    }
  ],
  "features": [
    {
      "text": "Every page becomes its own one-page PDF, copied directly from the original. Text, images and vector content are preserved rather than re-rendered or compressed.",
      "title": "Every page, separate"
    },
    {
      "text": "All pages are packed into one ZIP archive inside a clearly named folder, with files numbered page_001.pdf, page_002.pdf and onwards for easy sorting.",
      "title": "One tidy ZIP download"
    },
    {
      "text": "Splitting happens locally in your browser memory using pdf-lib and JSZip. Your document is never uploaded, stored or shared with any server.",
      "title": "Private, in-browser processing"
    },
    {
      "text": "There is no account, no payment step and no limit setting in the tool itself. Split a two-page letter or a long report the same way.",
      "title": "Free with no signup"
    }
  ],
  "intro": [
    "A single PDF often contains far more than you need to send. A bank statement pack includes months you were never asked for, a scanned book holds twenty chapters when you need one, and a long report should go to different people page by page. This split PDF tool separates one multi-page document into individual one-page PDF files, so you can share, file or print exactly the pages you want and leave the rest behind.",
    "The whole job runs in your browser with the pdf-lib and JSZip libraries, so your document is never uploaded to a server. There is no signup and no watermark. Instead of downloading dozens of files one by one, you receive a single ZIP archive with every page neatly numbered, ready to open on any phone or computer. That also means it works at the speed of your own device, with no waiting for uploads on a slow connection."
  ],
  "metaDescription": "Split PDF online for free: separate a PDF into individual one-page files and download them in one ZIP, processed privately in your browser, no signup needed.",
  "related": [
    {
      "label": "Extract PDF Pages",
      "slug": "extract-pdf-pages"
    },
    {
      "label": "Merge PDF",
      "slug": "merge-pdf"
    },
    {
      "label": "Remove PDF Pages",
      "slug": "remove-pdf-pages"
    },
    {
      "label": "Organize PDF",
      "slug": "organize-pdf"
    },
    {
      "label": "PDF to Images",
      "slug": "pdf-to-images"
    }
  ],
  "searchTitle": "Split PDF Online Free – Separate Every Page",
  "slug": "split-pdf",
  "steps": [
    {
      "text": "Click Select PDF File and choose a PDF with at least two pages from your device. The file name and size appear on screen so you can confirm you picked the right document.",
      "title": "Select your PDF"
    },
    {
      "text": "Press Split into Separate Pages Now. The tool loads your document in the browser, counts its pages and starts copying each page into a brand new single-page PDF.",
      "title": "Start the split"
    },
    {
      "text": "Watch the progress message as pages are saved one by one. They are then bundled into a ZIP archive inside a folder named after your original file.",
      "title": "Pages are packaged"
    },
    {
      "text": "The ZIP downloads automatically, and the result panel confirms how many individual PDFs were created. Use Split Another PDF to repeat the process with a different document.",
      "title": "Download the ZIP"
    }
  ],
  "tips": [
    "Use Extract PDF Pages instead when you only need a few pages. This splitter always separates the whole document, so the range tool saves time on long files.",
    "Keep the numbered file names as they are. The page_001.pdf format sorts correctly in every file manager, so your pages stay in document order after extraction.",
    "Check the page count in the result message against your original document. If they match, every page was copied successfully into the ZIP archive.",
    "Remove the password from protected PDFs first. The browser engine cannot open protected or corrupted files, and the split will stop with an error."
  ],
  "useCases": [
    "Separate a scanned book into individual chapters for easier reading",
    "Send only one statement page instead of a full bank pack",
    "Split a long report so each section goes to a different person",
    "Break a multipage invoice bundle into one file per invoice",
    "Extract form pages to fill, sign and return individually"
  ],
  "label": "Split PDF"
},
  'pdf-to-word': {
  "faqs": [
    {
      "a": "A scanned PDF is a picture of a page and contains no text layer for the converter to read, so the Word file will come out empty or near empty. Run the scan through the OCR tool first to extract its text, then edit that text.",
      "q": "Why is my Word file empty after conversion?"
    },
    {
      "a": "No. This converter extracts text only, and the page clearly notes this before you start. Images, charts and graphics stay behind in the PDF. If a document is mostly images, converting it will give you only its captions and surrounding text.",
      "q": "Does it convert images and tables too?"
    },
    {
      "a": "No. The document is processed in your browser using the pdf.js library, and the Word file is generated on your own device with the docx library. Your PDF is never uploaded, which makes the tool suitable for private letters and work documents.",
      "q": "Is my PDF uploaded to a server?"
    },
    {
      "a": "Expect the words and paragraph order, not an exact replica. Text is grouped into lines by position and set in Calibri 12pt, so complex columns, headers and decorative layouts will need tidying in Word. Simple reports and letters usually convert cleanly.",
      "q": "How accurate is the formatting in Word?"
    },
    {
      "a": "The most likely reasons are a password-protected file or a scanned document with no selectable text. Remove the password in the software that created the PDF, and for scans use OCR first, because this converter cannot read pictures of text.",
      "q": "Why did the conversion fail?"
    },
    {
      "a": "There is no cost and no account. Convert one file at a time as often as you need, and simply select a new PDF after each download to start again.",
      "q": "Is there a cost or a usage limit?"
    }
  ],
  "features": [
    {
      "text": "The tool reads the PDF's text layer with pdf.js, groups words into lines by their position on the page, and writes clean, editable paragraphs into a .docx file.",
      "title": "Real editable text"
    },
    {
      "text": "Each PDF page becomes its own Word page, with page breaks inserted between them. Long documents keep their broad structure instead of collapsing into one endless block.",
      "title": "Page breaks preserved"
    },
    {
      "text": "Conversion happens on your device: the PDF is read in the browser and the Word file is built locally. Nothing is uploaded to a server.",
      "title": "Private by design"
    },
    {
      "text": "There is no account, payment or watermark. The downloaded file takes your PDF's name with a .docx ending, ready to open and edit.",
      "title": "Free, no signup"
    }
  ],
  "intro": [
    "PDFs are made for reading, not editing. When a client sends a contract as PDF and you need to change a clause, or a teacher shares notes you want to rework, retyping everything wastes an afternoon. This PDF to Word converter extracts the text from your PDF and rebuilds it as an editable Microsoft Word .docx file, with paragraphs in reading order and page breaks between the original pages, so you can start editing within minutes instead of starting from a blank page.",
    "The conversion runs in your browser using the pdf.js and docx libraries, so your file is never uploaded to a server and no signup is needed. Be clear about what it does: it extracts text only. That suits letters, reports, essays and agreements well, while complex layouts, images and scanned pages without a text layer will not convert faithfully. Knowing that limit upfront helps: if your PDF has selectable text, the Word file gives you a solid editable starting point."
  ],
  "metaDescription": "Convert PDF to Word online for free: turn PDF text into an editable .docx file in your browser, with no signup. Honest text extraction, files never uploaded.",
  "related": [
    {
      "label": "PDF to Text",
      "slug": "pdf-to-text"
    },
    {
      "label": "OCR – Image to Text",
      "slug": "ocr"
    },
    {
      "label": "Merge PDF",
      "slug": "merge-pdf"
    },
    {
      "label": "Images to PDF",
      "slug": "images-to-pdf"
    },
    {
      "label": "Split PDF",
      "slug": "split-pdf"
    }
  ],
  "searchTitle": "PDF to Word Online Free – Editable DOCX",
  "slug": "pdf-to-word",
  "steps": [
    {
      "text": "Click the upload area and select a PDF that contains real, selectable text. The file name appears on screen; use Remove if you picked the wrong document.",
      "title": "Select your PDF file"
    },
    {
      "text": "Press Convert to Word Document. The browser reads each page, extracts its text items and groups them into lines based on their vertical position on the page.",
      "title": "Convert to Word"
    },
    {
      "text": "Lines are written into a new Word document in Calibri, with a page break added at the end of each PDF page so the document structure stays recognisable.",
      "title": "The DOCX is built"
    },
    {
      "text": "Your .docx downloads automatically with the same name as the PDF. Open it in Microsoft Word, Google Docs or LibreOffice and edit the text as you need.",
      "title": "Download and edit"
    }
  ],
  "tips": [
    "Test your PDF first: if you can select and copy text from it, conversion will work well. If dragging selects nothing, the file is a scan and needs OCR first.",
    "Keep expectations right for busy layouts. Multi-column pages, text boxes and tables are flattened into ordinary paragraphs, so budget a few minutes for tidying afterwards.",
    "Convert long documents in parts if your device struggles. Split the PDF into smaller files first, convert each one, then combine the Word files if needed.",
    "Proofread numbers and names after converting. Line grouping follows position on the page, so dense tables of figures deserve a careful check against the original PDF."
  ],
  "useCases": [
    "Turn a PDF contract into Word to edit clauses before signing",
    "Convert lecture notes or handouts into editable study documents",
    "Recover the text of your own old reports when originals are lost",
    "Change a PDF application form's wording for a new submission",
    "Extract article text from a PDF for quoting and referencing"
  ],
  "label": "PDF to Word Converter"
},
  'images-to-pdf': {
  "faqs": [
    {
      "a": "Only JPG and PNG images can be converted. The file picker accepts those two formats, and any other type, such as WebP, GIF or HEIC, will produce an error. Convert such pictures to JPG or PNG first using the Image Converter tool.",
      "q": "Which image formats can I convert?"
    },
    {
      "a": "No. Images are processed in your browser with the pdf-lib library and combined on your own device. Your photos, receipts and identity documents are never uploaded to a server, so private pictures stay private throughout the conversion.",
      "q": "Are my images uploaded anywhere?"
    },
    {
      "a": "Images appear in the PDF in the order of the numbered list, which follows the order you selected and added them. There is no drag reordering, so remove and re-add an image, or select files in the right sequence, to change the order.",
      "q": "How do I control the page order?"
    },
    {
      "a": "Each page is created at the image's own pixel dimensions, and the image fills the whole page. A tall phone photo makes a tall page and a wide screenshot makes a wide page, which keeps every picture sharp and undistorted.",
      "q": "What size will the PDF pages be?"
    },
    {
      "a": "Yes, a single image is enough. Select just one JPG or PNG file and convert it to get a one-page PDF. This is handy when a website or office asks for a document upload in PDF format only.",
      "q": "Can I convert just one image?"
    },
    {
      "a": "The most common cause is an unsupported format hiding among your files, because conversion stops when it meets one. Check that every selected file is truly JPG or PNG, remove anything else from the list, and convert again.",
      "q": "Why did the conversion fail?"
    }
  ],
  "features": [
    {
      "text": "Both JPG and PNG photos, scans and screenshots are supported. Add several files at once, top up the list with more images, and convert them together.",
      "title": "JPG and PNG supported"
    },
    {
      "text": "Every image is placed on a page sized exactly to that image, drawn at full size. Pictures are not squeezed, stretched or padded with margins.",
      "title": "Pages match image size"
    },
    {
      "text": "The numbered list shows your page order before converting. Remove single images, clear the whole list, or keep adding files until the set is right.",
      "title": "Order you can check"
    },
    {
      "text": "Conversion runs locally in your browser with pdf-lib, so images never leave your device. There is no signup, no watermark and no cost.",
      "title": "Private and free"
    }
  ],
  "intro": [
    "Many everyday jobs end with the same request: please send that as a PDF. Job portals reject photo uploads, universities want documents in one file, and clients prefer a single attachment over ten loose pictures. This images to PDF tool turns your JPG and PNG images into one PDF document, with each image on its own page in the order you list them. It suits students submitting scanned assignments, shopkeepers sending receipts and anyone packaging phone photos into a file that looks professional everywhere.",
    "Your images are combined in your browser using the pdf-lib library, so nothing is uploaded to a server and no account is needed. Each page is created at the image's own size, keeping pictures sharp and undistorted, and the finished PDF downloads with one click. Add images in batches, remove any you do not want, and convert when the list looks right. Because there is no upload step, even a large batch of phone photos converts quickly on an ordinary connection."
  ],
  "metaDescription": "Convert images to PDF online for free: combine JPG and PNG photos into one PDF in your chosen order, privately in your browser, with no signup or watermark.",
  "related": [
    {
      "label": "Image Compressor",
      "slug": "image-compressor"
    },
    {
      "label": "Image Converter",
      "slug": "image-convert"
    },
    {
      "label": "Merge PDF",
      "slug": "merge-pdf"
    },
    {
      "label": "PDF to Images",
      "slug": "pdf-to-images"
    },
    {
      "label": "OCR – Image to Text",
      "slug": "ocr"
    }
  ],
  "searchTitle": "Images to PDF Online Free – JPG, PNG to PDF",
  "slug": "images-to-pdf",
  "steps": [
    {
      "text": "Click the upload area and select one or more JPG or PNG images. You can pick several at once, and return later to add more images to the same list.",
      "title": "Add your images"
    },
    {
      "text": "Check the numbered list, which is the order images will appear as pages. Remove individual files with the cross, or clear everything and start the selection again.",
      "title": "Review the order"
    },
    {
      "text": "Press Convert to PDF Document. The tool embeds each image into a new PDF, creating one page per image sized to match that picture's own dimensions.",
      "title": "Convert to PDF"
    },
    {
      "text": "A file named images_to_pdf.pdf downloads automatically. The success message confirms it is ready, and your list clears so you can build another PDF straight away.",
      "title": "Download your PDF"
    }
  ],
  "tips": [
    "Select images in page order whenever possible. The list follows selection order and there is no drag reordering, so a careful first selection saves re-adding files.",
    "Convert HEIC, WebP or GIF pictures to JPG or PNG first. Only those two formats are accepted here, and one unsupported file will stop the whole conversion.",
    "Compress very large photos before converting if the final PDF must be emailed. Smaller images make a smaller PDF that uploads faster on slow connections.",
    "Check portrait and landscape mixes before converting. Each page takes its image's shape, so a mixed set is normal, but confirm nothing important was left out."
  ],
  "useCases": [
    "Combine scanned assignment pages into one PDF for submission",
    "Turn phone photos of receipts into a single expense document",
    "Package product photos into one catalogue file for customers",
    "Convert screenshots of a chat or order into a PDF record",
    "Send ID card and document photos as one PDF attachment"
  ],
  "label": "Images to PDF Converter"
},
  'image-compressor': {
  "faqs": [
    {
      "a": "No. The compressor works entirely inside your browser using canvas technology, and the file never leaves your device. That makes it safe for private photos, unreleased product shots and documents. It also means no upload waiting time.",
      "q": "Is my image uploaded to a server?"
    },
    {
      "a": "PNG does not support quality-based compression, so re-saving a PNG barely changes its size. To actually shrink the file, this tool exports PNG images as WebP, a modern format that compresses far better and still supports transparency. Other formats, such as JPG, are exported as JPEG for the same reason.",
      "q": "Why does my PNG download as a WebP file?"
    },
    {
      "a": "No. The compressed image keeps exactly the same width and height as the original; only the file size changes. If you also need a smaller picture in pixels — for example a 800-pixel-wide version for a website — resize it first with an image resizer, then compress it here.",
      "q": "Does compressing change the image dimensions?"
    },
    {
      "a": "It depends on the image and the quality you choose. Large camera photos often shrink by 50 to 80 percent at the default setting, while already-optimised web images may save less. The result panel always shows your exact original size, new size and percentage saved before you download.",
      "q": "How much smaller will my image become?"
    },
    {
      "a": "This tool handles one image at a time, which keeps it simple and fast. Select your file, compress, download, then repeat for the next one. For a handful of website or shop images the whole batch usually takes only a few minutes, and every image stays private on your device.",
      "q": "Can I compress several images at once?"
    },
    {
      "a": "At moderate settings such as 70 to 85 percent, most photos look identical on screen — the savings come from data the eye barely notices. Push the slider very low and you may see softness or blocky patches. If a result looks too soft, simply re-compress at a higher quality.",
      "q": "Will compression visibly damage my photo?"
    }
  ],
  "features": [
    {
      "text": "A single 1–100 slider controls the whole process, with no confusing format settings or advanced panels. You decide exactly how far to trade visual detail for a smaller, faster file.",
      "title": "One simple quality slider"
    },
    {
      "text": "The result panel shows the original size, the compressed size and the exact percentage saved, so you know immediately whether the file now fits your website, form or email limit.",
      "title": "Clear before-and-after sizes"
    },
    {
      "text": "Compression runs entirely in your browser with canvas technology. Your photo is never uploaded, stored or seen by anyone.",
      "title": "Private by design"
    },
    {
      "text": "PNG images are exported as WebP and other images as JPEG, because those formats shrink efficiently at a chosen quality. Your picture keeps its original dimensions — only the file weight changes.",
      "title": "Smart output formats"
    }
  ],
  "intro": [
    "Large photos slow down websites, clog inboxes and bounce off upload forms with strict size limits. This free image compressor reduces the file size of a JPG, PNG or WebP image in seconds, so the same picture becomes easier to share, store and publish. A product photo that was 4 MB can often drop to a few hundred kilobytes, which means faster page loads and quicker uploads — no Photoshop or design experience needed.",
    "Everything happens locally in your browser using the HTML canvas — your image is never uploaded to a server. You control the trade-off with one quality slider: lower values give a smaller file, higher values keep more detail. One honest detail worth knowing before you start: the tool keeps your image at its original dimensions and re-encodes it for size, so PNG files are exported as WebP and other formats as JPEG, because those formats support proper quality-based compression."
  ],
  "metaDescription": "Compress JPG, PNG and WebP images online for free. Use the quality slider to shrink file size right in your browser — no upload, no sign-up, instant download.",
  "related": [
    {
      "label": "Resize Image",
      "slug": "image-resize"
    },
    {
      "label": "Image Converter",
      "slug": "image-convert"
    },
    {
      "label": "Images to PDF",
      "slug": "images-to-pdf"
    },
    {
      "label": "Crop Image",
      "slug": "crop-image"
    },
    {
      "label": "Watermark Image",
      "slug": "watermark-image"
    }
  ],
  "searchTitle": "Compress Image Online Free – Shrink JPG, PNG, WebP",
  "slug": "image-compressor",
  "steps": [
    {
      "text": "Click the upload area and choose a JPG, PNG or WebP file from your device. The tool shows the file name and its exact original size, so you can see precisely how much space you save afterwards.",
      "title": "Upload your image"
    },
    {
      "text": "Move the compression slider to balance size against sharpness. The default 70 percent suits most photos. Go lower for thumbnails and previews, or higher when fine detail and text inside the image really matter.",
      "title": "Set the quality level"
    },
    {
      "text": "Press the Compress Image button. Your browser re-encodes the picture at the chosen quality in a moment, keeping the same width and height.",
      "title": "Compress the image"
    },
    {
      "text": "Compare the original and compressed sizes and the percentage saved. If the file is still too large, re-compress at a lower quality; if it looks too soft, raise it. Then download your finished image.",
      "title": "Check the saving and download"
    }
  ],
  "tips": [
    "Start at 70 percent quality for photographs. Most viewers cannot see the difference on screen, yet the file is often half the size or less.",
    "If the image contains small text, like a screenshot, keep quality at 85 or above. Text edges show compression artefacts much sooner than ordinary photos do.",
    "Remember that transparent PNG graphics are exported as WebP, which still supports transparency, while other images become JPEG — so use this tool mainly for photos.",
    "Need a much smaller file? Combine both methods: first reduce the pixel dimensions with an image resizer, then compress the result here for the biggest saving."
  ],
  "useCases": [
    "Shrinking product photos so online store pages load noticeably faster",
    "Reducing images to fit email attachment and job application limits",
    "Preparing blog and social media pictures for quicker uploading",
    "Compressing screenshots before adding them to documents and reports",
    "Saving phone storage by slimming large camera photos before backup"
  ],
  "label": "Image Compressor"
},
  'background-remover': {
  "faqs": [
    {
      "a": "No. The background removal model runs entirely inside your browser, so your image is never sent to a server. The only download involved is the AI model itself — about 40 MB of program files fetched once from this website on your first use, not your picture going anywhere.",
      "q": "Is my photo uploaded to a server?"
    },
    {
      "a": "On the first run the tool downloads its AI model files, roughly 40 MB, and that takes time on a slow connection. Processing speed then depends mainly on your device, so a large photo on an older phone will take longer.",
      "q": "Why does the first use take a while?"
    },
    {
      "a": "The result downloads as a PNG with a transparent background, shown against the checkerboard pattern in the preview. PNG transparency works in design tools, presentation software, online stores and most editors, so you can place your subject straight onto a new colour, scene or layout.",
      "q": "What format is the result, and is it transparent?"
    },
    {
      "a": "Clear, well-lit subjects work best: portraits with a defined outline, single products, logos and objects photographed against a contrasting background. Soft, wispy edges such as loose hair, fur, smoke or transparent glass are harder for any automatic tool and may need a second attempt with a cleaner photo.",
      "q": "Which photos give the cleanest cut-out?"
    },
    {
      "a": "No — this tool only removes the background and gives you transparency. That is actually the flexible option: open the downloaded PNG in any editor or presentation app and put a solid colour, a gradient or a completely different photo behind your subject in a few clicks.",
      "q": "Can I add a new background colour afterwards?"
    },
    {
      "a": "Yes. There is no account, no payment and no limit built into the tool, and because everything runs on your own device there are no upload queues. The honest trade-offs are the one-time model download and the processing power of your phone or computer doing the work.",
      "q": "Is it really free, with no watermark?"
    }
  ],
  "features": [
    {
      "text": "A machine-learning model identifies the main subject and separates it from the scene automatically. Portraits, products and single objects are cut out in seconds, with no manual tracing or selection tools.",
      "title": "Automatic AI subject detection"
    },
    {
      "text": "The model runs in your browser with WebAssembly instead of on a remote server. Your photo stays on your device from start to finish — ideal for unreleased products and personal pictures.",
      "title": "Runs locally, nothing uploaded"
    },
    {
      "text": "Results download as a transparent PNG, ready to drop onto a shop listing, a presentation slide, a thumbnail or a new background of your choice in any design or editing app.",
      "title": "Transparent PNG output"
    },
    {
      "text": "You see the original and the finished cut-out side by side, over a checkerboard that makes transparency obvious. A progress bar keeps you informed while the model downloads and processes.",
      "title": "Side-by-side preview with progress"
    }
  ],
  "intro": [
    "A clean, transparent background instantly makes a photo more useful. Sellers need product shots that sit neatly on a white or coloured store page, creators need cut-outs for thumbnails and presentations. This AI background remover does that job automatically: upload one image, and the tool separates the main subject — a person, a product, an object — from everything behind it, then gives you a transparent PNG to download.",
    "What makes this tool different is where the work happens. The removal model runs entirely inside your browser, so your photo is never uploaded to a server. The one thing to expect: on your very first use the browser downloads the AI model files, about 40 MB, which can take a minute on a slow connection. After that, processing is much faster, and every image stays private on your own device from start to finish."
  ],
  "metaDescription": "Remove the background from any photo online for free with browser-based AI. Get a clean transparent PNG in seconds — your image never leaves your device.",
  "related": [
    {
      "label": "AI Image Upscaler",
      "slug": "ai-image-upscaler"
    },
    {
      "label": "Crop Image",
      "slug": "crop-image"
    },
    {
      "label": "Image Compressor",
      "slug": "image-compressor"
    },
    {
      "label": "Image Converter",
      "slug": "image-convert"
    },
    {
      "label": "Resize Image",
      "slug": "image-resize"
    }
  ],
  "searchTitle": "Remove Image Background Free – Transparent PNG",
  "slug": "background-remover",
  "steps": [
    {
      "text": "Click the upload area and select a portrait, product photo or any image with a clear main subject. The tool accepts common image formats and shows your original picture on screen.",
      "title": "Upload your photo"
    },
    {
      "text": "Press Remove Background and let the browser-based AI analyse the scene. A progress bar shows the model downloading on first use and the cut-out being prepared. Most images finish within seconds once the model is ready.",
      "title": "Start the removal"
    },
    {
      "text": "Your subject appears on a transparent checkerboard next to the original, so you can compare both versions and check the edges around hair, clothing or product details before committing to the result.",
      "title": "Preview the cut-out"
    },
    {
      "text": "Save the finished image as a transparent PNG. Drop it onto a store listing, slide, thumbnail or a brand-new background in your favourite editor — the subject is cleanly separated and ready to reuse anywhere.",
      "title": "Download the transparent PNG"
    }
  ],
  "tips": [
    "Choose photos where the subject stands out clearly from the background. Strong contrast and even lighting help the AI draw a much cleaner edge.",
    "Be patient on the first run — the roughly 40 MB model download happens only once. On later visits the tool starts far more quickly.",
    "Fine, wispy edges like loose hair, fur or lace are the hardest for any automatic remover. A sharper, higher-resolution original gives noticeably better results.",
    "Download and keep the transparent PNG as your master file. You can place it on many different backgrounds later without removing anything again."
  ],
  "useCases": [
    "Creating clean product cut-outs for online store listings",
    "Making profile pictures with a tidy, distraction-free background",
    "Preparing subject cut-outs for thumbnails, posters and slides",
    "Isolating logos, objects and people for design projects",
    "Removing cluttered backgrounds from marketplace selling photos"
  ],
  "label": "AI Background Remover"
},
  'ai-image-upscaler': {
  "faqs": [
    {
      "a": "Normal resizing simply stretches existing pixels, which is why enlarged photos look soft. This tool first runs a machine-learning model trained to reconstruct plausible detail at 2x, then sharpens edges. The result cannot invent detail that was never captured, but edges usually look far cleaner.",
      "q": "How is AI upscaling different from just resizing?"
    },
    {
      "a": "The 2x option is a single pass through the AI model. Choosing 4x runs that AI pass first, then a second enhancement pass with high-quality resampling and sharpening to double the size again. That is why 4x takes longer, and why 2x often looks the most natural of the two.",
      "q": "What is the difference between 2x and 4x here?"
    },
    {
      "a": "No. The upscaling model runs locally in your browser using WebGL, and your photo is processed in your device's memory only. Nothing is uploaded or stored anywhere, which makes the tool safe for family photos, unreleased work and client images alike.",
      "q": "Are my photos uploaded to a server?"
    },
    {
      "a": "The tool does not set an artificial size limit, but very large photos are demanding: the model works patch by patch and uses a lot of browser memory. On an older phone a big image may take minutes or struggle. For best results, upscale modest-sized images one at a time.",
      "q": "Is there a maximum image size?"
    },
    {
      "a": "It helps, within limits. Upscaling sharpens edges and reduces pixelation, so a small or mildly soft photo usually improves noticeably. It cannot rescue a badly blurred, out-of-focus or extremely low-quality image, because the missing information was never recorded. Start with the best original you have.",
      "q": "Can it fix a blurry photo?"
    },
    {
      "a": "The enlarged image downloads as a PNG at exactly two or four times your original width and height — the tool shows those dimensions before you start. PNG keeps the enhanced detail without adding compression artefacts, though the file itself will be larger than the original.",
      "q": "What format and size do I download?"
    }
  ],
  "features": [
    {
      "text": "Choose 2x for a clean, natural enlargement or 4x when you need maximum dimensions. The buttons show the exact output width and height for your photo before you commit to processing.",
      "title": "2x and 4x enlargement options"
    },
    {
      "text": "A draggable split slider lets you sweep between the original and the enhanced version, with a side-by-side view as well. You can inspect faces, text and edges closely before downloading anything.",
      "title": "Before-and-after comparison slider"
    },
    {
      "text": "The AI model runs in your browser with WebGL acceleration, working through the image patch by patch. Your photo never leaves your device.",
      "title": "Local AI processing with progress"
    },
    {
      "text": "If the AI model cannot run on your device, the tool automatically falls back to high-quality resampling with an edge-sharpening pass instead of failing, so you still get a usable enlarged image.",
      "title": "Automatic fallback enhancement"
    }
  ],
  "intro": [
    "Small images cause big frustrations: a product photo that looks fine on a phone turns pixelated in a store banner, an old family picture falls apart when printed, and a low-resolution logo looks unprofessional everywhere. This AI image upscaler enlarges your photo to two or four times its original size directly in your browser, using a machine-learning model to reconstruct detail and sharpen edges instead of simply stretching pixels the way an ordinary resize does.",
    "The processing is completely local — the model runs on your device with WebGL, and your photo is never uploaded. Two honest points before you begin: the true AI pass works at 2x, while the 4x option adds a second enhancement and sharpening pass on top of it; and if your device cannot run the model, the tool automatically falls back to high-quality resampling with sharpening — a softer result."
  ],
  "metaDescription": "Upscale and enhance images online free with browser-based AI. Enlarge photos 2x or 4x, compare with a before-after slider and download a high-res PNG.",
  "related": [
    {
      "label": "Background Remover",
      "slug": "background-remover"
    },
    {
      "label": "Image Compressor",
      "slug": "image-compressor"
    },
    {
      "label": "Resize Image",
      "slug": "image-resize"
    },
    {
      "label": "Crop Image",
      "slug": "crop-image"
    },
    {
      "label": "Image Converter",
      "slug": "image-convert"
    }
  ],
  "searchTitle": "AI Image Upscaler Free – Enlarge Photos 2x or 4x",
  "slug": "ai-image-upscaler",
  "steps": [
    {
      "text": "Click the upload area and choose a JPG, PNG or WebP image. The tool reads its dimensions and displays them, so you can see exactly what size you are starting from before choosing an enlargement level.",
      "title": "Upload a small or low-resolution image"
    },
    {
      "text": "Pick 2x for the cleanest, most natural AI result, or 4x when you need the largest possible output. The buttons show the exact new width and height your photo will have at each setting.",
      "title": "Choose 2x or 4x scaling"
    },
    {
      "text": "Press the Upscale button and watch the progress bar. The model processes your image in small patches on your own device, reconstructing detail and sharpening edges. Larger photos take longer.",
      "title": "Run the AI enhancement"
    },
    {
      "text": "Drag the split slider across the result to compare original and enhanced versions edge by edge, or switch to side-by-side view. When you are happy, download the enlarged image as a high-resolution PNG file.",
      "title": "Compare and download"
    }
  ],
  "tips": [
    "Start with the best original available. Upscaling a clean, slightly small photo works far better than trying to rescue a tiny, heavily compressed one.",
    "Use 2x when quality matters most — it is a single AI pass. Reserve 4x for cases where you genuinely need the extra dimensions, like printing.",
    "Be realistic about damage: the tool reduces pixelation and sharpens edges, but it cannot restore a face or text that was completely lost to blur.",
    "Give large photos time. The model works patch by patch in your browser, so a big image on a modest phone may take a few minutes."
  ],
  "useCases": [
    "Enlarging product photos for banners and large store displays",
    "Preparing small images for printing without obvious pixelation",
    "Improving old, low-resolution family and archive photographs",
    "Making logos and graphics big enough for presentations",
    "Upscaling artwork and illustrations for posters and covers"
  ],
  "label": "AI Image Upscaler"
},
  'ocr': {
  "faqs": [
    {
      "a": "No. Unlike many tools on this site, this OCR tool sends your image to the OCR.space cloud service, which performs the recognition and returns the text. Avoid using it for highly sensitive documents such as ID cards, bank papers or private contracts.",
      "q": "Is my image processed privately on my device?"
    },
    {
      "a": "You can recognise text in three languages: English, Urdu and Arabic. Urdu uses a dedicated recognition engine, and Urdu and Arabic results are displayed right-to-left in the output box, ready to copy. Always select the correct language before extracting, because it strongly affects accuracy.",
      "q": "Which languages does the OCR support?"
    },
    {
      "a": "Printed text in a clear font works best — book pages, notices, signboards, screenshots and typed documents. Handwriting, decorative calligraphy and heavily stylised Nastaliq can produce errors, because the recognition engines are trained mainly on printed characters. A straight, well-lit photo always improves the result.",
      "q": "Does it work on handwriting or Nastaliq script?"
    },
    {
      "a": "Very large images are automatically shrunk before sending, because the service limits file sizes: anything over roughly 1 MB is resized to a maximum of 2000 pixels on its longest side and converted to JPEG. That keeps uploads fast, but tiny text in a huge photo may lose a little accuracy.",
      "q": "Why is my large image compressed before scanning?"
    },
    {
      "a": "First check your internet connection, since the tool needs to reach the cloud recognition service. Browser ad-blockers and privacy extensions can also block the request — the tool shows a specific warning in that case. Temporarily disabling the blocker for this page, or trying a smaller image, usually fixes it.",
      "q": "The extraction failed or showed a network error. What should I do?"
    },
    {
      "a": "The recognised text appears in the output box with a one-click Copy button, so you can paste it into any editor and fix it there. The output box itself is read-only. Always proofread names, numbers and dates, because OCR can misread similar-looking characters.",
      "q": "Can I edit the extracted text?"
    }
  ],
  "features": [
    {
      "text": "Choose English, Urdu or Arabic before you scan. Urdu recognition uses a dedicated engine built for the script, and Urdu and Arabic results appear right-to-left in the output box, ready to copy.",
      "title": "English, Urdu and Arabic recognition"
    },
    {
      "text": "Oversized photos are prepared automatically before sending: anything over about 1 MB is resized to at most 2000 pixels and converted to JPEG, so big phone photos upload quickly and stay within service limits.",
      "title": "Automatic resizing for large images"
    },
    {
      "text": "Results land in a clean text box with a single Copy button, ready to paste into a document, message or notes app. No retyping, no manual transcription, and no account or software installation needed.",
      "title": "One-click copy of the result"
    },
    {
      "text": "Recognition is performed by the established OCR.space cloud service, using its standard engine for English and Arabic and its dedicated engine for Urdu, giving printed documents and screenshots consistently readable results.",
      "title": "Cloud recognition engines"
    }
  ],
  "intro": [
    "Retyping text from a photo is slow and error-prone — a printed notice, a page from a book, a screenshot full of details you need in editable form. This image to text tool uses OCR (optical character recognition) to read the words in your picture and turn them into text you can copy, edit and reuse anywhere. It supports three languages — English, Urdu and Arabic — which makes it especially useful for printed Urdu and Arabic material that many free OCR tools handle poorly or not at all.",
    "One honest difference from most tools on this site: recognition happens in the cloud, not in your browser. Your image is sent to the OCR.space recognition service, processed there, and the extracted text is returned to the page. That cloud engine makes Urdu support possible. Large images are automatically resized before sending, so uploads stay quick even on a mobile connection."
  ],
  "metaDescription": "Extract text from images online free with OCR for English, Urdu and Arabic. Upload a photo or screenshot and copy the recognised text in seconds, easily.",
  "related": [
    {
      "label": "PDF to Text",
      "slug": "pdf-to-text"
    },
    {
      "label": "Images to PDF",
      "slug": "images-to-pdf"
    },
    {
      "label": "Image Compressor",
      "slug": "image-compressor"
    },
    {
      "label": "Word Counter",
      "slug": "word-counter"
    },
    {
      "label": "Image Converter",
      "slug": "image-convert"
    }
  ],
  "searchTitle": "Image to Text Online Free – OCR for English & Urdu",
  "slug": "ocr",
  "steps": [
    {
      "text": "Pick the language of the text in your image first — English, Urdu or Arabic. This matters more than anything else: the tool loads a different recognition engine for Urdu, and choosing the wrong language produces garbled results.",
      "title": "Select the language"
    },
    {
      "text": "Click the upload area and choose a photo, scan or screenshot containing printed text. Large files are automatically resized to a maximum of 2000 pixels and converted for upload.",
      "title": "Upload your image"
    },
    {
      "text": "Press Extract Text and wait a few seconds while your image is sent to the cloud recognition service and read. The recognised words then appear in the output box — right-to-left automatically for Urdu and Arabic text.",
      "title": "Extract the text"
    },
    {
      "text": "Review the result, then use the Copy button to take the whole text into your document, message or notes. Check names, numbers and punctuation carefully.",
      "title": "Copy and check the text"
    }
  ],
  "tips": [
    "Select the language before uploading, not after. Urdu uses a separate recognition engine, and the wrong setting is the most common cause of poor results.",
    "Photograph pages straight-on in good light, with the text filling the frame. Crooked angles, shadows and glare are the main enemies of accuracy.",
    "Prefer printed text. Handwriting and ornate Nastaliq calligraphy often misread, so expect to proofread those results more carefully than typed documents.",
    "If extraction fails with a network error, temporarily disable your ad-blocker for this page."
  ],
  "useCases": [
    "Turning printed Urdu and Arabic pages into editable, copyable text",
    "Copying text from screenshots instead of typing it manually",
    "Digitising printed notices, letters and office documents quickly",
    "Extracting details from receipts, signboards and printed forms",
    "Capturing text from lecture slides and book pages for notes"
  ],
  "label": "OCR Text Extractor (Image to Text)"
},
  'word-counter': {
  "slug": "word-counter",
  "searchTitle": "Word Counter Online Free – Count Words & Chars",
  "metaDescription": "Use this free word counter online to count words, characters, sentences and paragraphs instantly, with reading time shown as you type or paste text.",
  "intro": [
    "Counting words by hand is slow and unreliable, especially when a deadline, an assignment limit or a publishing brief depends on the exact number. This word counter does the job the moment you start typing. Paste or write your text in the box and six figures update live above it: words, characters, characters without spaces, sentences, paragraphs and an estimated reading time. There is nothing to install and no button to press.",
    "Writers, students, teachers and marketers all work to limits. An essay may allow 1,500 words, a product description may need to fit a tight character count, and a speech may need to run for five minutes rather than ten. This tool brings those checks together in one place. The reading time estimate, based on an average pace of about 200 words per minute, is especially useful for speeches, lessons, video scripts and presentations, where how long a text takes to read aloud matters as much as how long it looks on the page."
  ],
  "steps": [
    {
      "title": "Paste or type your text",
      "text": "Open the tool and paste your draft into the large text box, or type directly in it. Counting begins immediately, so there is no separate step to start."
    },
    {
      "title": "Read the six live counters",
      "text": "Look at the cards above the box. They show words, characters, characters without spaces, sentences, paragraphs and reading time, updating with every change you make."
    },
    {
      "title": "Edit until you reach your target",
      "text": "Add, cut or rewrite text while watching the counters move. Trimming an essay to its limit, or expanding a short draft, becomes editing until the numbers match."
    },
    {
      "title": "Copy your text or clear the box",
      "text": "Use Copy Text to take the finished text back to your document, or Clear to empty the box and start counting something new whenever you are ready."
    }
  ],
  "features": [
    {
      "title": "Six counts in one view",
      "text": "Words, characters, characters without spaces, sentences, paragraphs and reading time are shown together in clear cards, so you never need separate tools for different limits."
    },
    {
      "title": "Real-time counting as you type",
      "text": "Every figure recalculates instantly whenever the text changes. Paste a full chapter or delete a single word and the counters respond immediately, with no submit button and no waiting."
    },
    {
      "title": "Reading time estimate included",
      "text": "Reading time is calculated at roughly 200 words per minute and rounded up to whole minutes, giving speechwriters, teachers and presenters a quick sense of how long a text will take."
    },
    {
      "title": "Runs privately in your browser",
      "text": "The counter works entirely on your device, in the page itself. Your text is not uploaded for counting, which makes it suitable for unpublished drafts, exam work and confidential documents."
    }
  ],
  "useCases": [
    "Students trimming essays and assignments to a strict word limit before submission",
    "Bloggers checking article length and reading time before publishing a post",
    "Teachers estimating how long a passage will take a class to read",
    "Marketers fitting ad copy, captions and descriptions inside character limits",
    "Speakers and presenters timing speeches, sermons and video scripts accurately"
  ],
  "tips": [
    "Check characters without spaces when a form counts length that way; it is often lower than the total and can save a rejected submission.",
    "Many short paragraphs with very long sentences usually means the text needs breaking up; check the sentence and paragraph counts together.",
    "Treat reading time as a calm average pace. If you speak slowly or pause often, rehearse once with a timer before relying on it.",
    "Count long documents one section at a time. Pasting a chapter separately shows which part is pushing the piece over its limit."
  ],
  "faqs": [
    {
      "q": "How does this word counter count words?",
      "a": "The tool splits your text wherever it finds spaces or line breaks and counts each separate block as one word. This matches the way most word processors count, so a pasted essay, article or assignment should give you a familiar, consistent figure every time you check it."
    },
    {
      "q": "What is the difference between characters and characters without spaces?",
      "a": "The characters figure counts everything in the text box, including spaces. The without-spaces figure removes all spaces, tabs and line breaks first. Some application forms, messaging services and submission systems count length without spaces, so comparing the two numbers helps you meet the exact limit you were given."
    },
    {
      "q": "How is the reading time calculated?",
      "a": "Reading time is based on an average reading speed of about 200 words per minute, rounded up to the nearest whole minute. It is an estimate for planning speeches, lessons and scripts, not a promise: your real pace will vary with the difficulty of the text and your audience."
    },
    {
      "q": "How are sentences and paragraphs counted?",
      "a": "Sentences are counted by splitting the text at full stops, question marks and exclamation marks. Paragraphs are counted as blocks of text separated by blank lines. Abbreviations containing full stops can slightly affect the sentence count, so treat that figure as a close guide rather than an exact grammar check."
    },
    {
      "q": "Is my text uploaded or saved anywhere?",
      "a": "No. Counting happens in your browser on your own device, and the tool does not send your text to a server for analysis. You can safely count unpublished drafts or private documents. If you refresh or close the page, the text in the box is gone, so copy anything you want to keep."
    },
    {
      "q": "Is this word counter free to use?",
      "a": "Yes, the counter is completely free. You can paste or type as much text as you need, check it as many times as you like, and use the copy and clear buttons without signing up, installing anything or paying for extra counts or longer documents."
    }
  ],
  "related": [
    {
      "slug": "case-converter",
      "label": "Case Converter"
    },
    {
      "slug": "find-and-replace",
      "label": "Find and Replace"
    },
    {
      "slug": "reverse-text",
      "label": "Reverse Text"
    },
    {
      "slug": "whitespace-remover",
      "label": "Whitespace Remover"
    },
    {
      "slug": "lorem-ipsum",
      "label": "Lorem Ipsum Generator"
    }
  ],
  "label": "Word & Character Counter"
},
  'qrcode-generator': {
  "slug": "qrcode-generator",
  "searchTitle": "QR Code Generator Free – Custom Colors & PNG",
  "metaDescription": "Create a QR code free with this QR code generator: enter a link or text, choose your colours and size, preview it live and download a PNG instantly.",
  "intro": [
    "A QR code turns a long web address into something a phone can open with one camera scan. This QR code generator lets you create one in seconds: type or paste a link or any piece of text, see the code appear instantly in the preview, and download it as a PNG image ready for printing or sharing. There is no sign-up and no watermark added by the tool.",
    "You can also make the code your own. Change the foreground colour to match your branding, choose a background colour that suits the surface it will sit on, and set the size anywhere from 128 to 1,024 pixels, so the same tool can produce a small code for a business card or a large one for a shop window poster. Because the preview updates live as you type and adjust the settings, you always download exactly the code you can see on screen."
  ],
  "steps": [
    {
      "title": "Enter your link or text",
      "text": "Type or paste the content into the content box. A website address is most common, but any text works, such as a short message or written-out contact details."
    },
    {
      "title": "Choose colours and size",
      "text": "Pick a foreground colour for the pattern and a background colour behind it, then drag the size slider between 128 and 1,024 pixels to suit your design."
    },
    {
      "title": "Check the live preview",
      "text": "Watch the preview update as you change content, colours and size. Keep strong contrast between pattern and background, and test with your own phone before printing."
    },
    {
      "title": "Download the PNG file",
      "text": "Click Download PNG and the code saves as a PNG image at your chosen size, ready for documents, designs, packaging, menus, posters or social media posts."
    }
  ],
  "features": [
    {
      "title": "Instant live preview",
      "text": "The QR code redraws itself the moment you change the text, colours or size. There is no generate button and no reload, so experimenting takes seconds."
    },
    {
      "title": "Custom foreground and background colours",
      "text": "Separate colour pickers control the code pattern and its background, with the hex value shown beside each one. Match your brand colours while keeping enough contrast for phones to scan reliably."
    },
    {
      "title": "Adjustable size up to 1,024 pixels",
      "text": "A slider sets the download size from 128 to 1,024 pixels in small steps. Small sizes suit screens and cards, while larger sizes stay sharp on posters, banners and printed displays."
    },
    {
      "title": "High-quality PNG download",
      "text": "Your finished code downloads as a clean PNG image, rendered at the exact size you chose rather than a screenshot of the preview."
    }
  ],
  "useCases": [
    "Shops and restaurants linking printed menus and table cards to online pages",
    "Business cards and flyers that open a website or portfolio in one scan",
    "Event posters and banners directing people to registration or ticket pages",
    "Teachers sharing a worksheet, form or classroom link with students quickly",
    "Product packaging and labels linking to instructions, reviews or support pages"
  ],
  "tips": [
    "Always scan the downloaded code with your own phone before printing. A quick test catches link mistakes and colour combinations that scan poorly.",
    "Keep the pattern dark and the background light. Strong contrast is the biggest factor in fast, reliable scanning, especially outdoors or on glossy paper.",
    "Choose download size for the final printed size. A large poster code needs the higher pixel sizes to stay crisp, not stretched and blurry.",
    "Shorter content scans faster. For a very long link, link to a short landing page instead, because dense codes challenge older phone cameras."
  ],
  "faqs": [
    {
      "q": "What can I put inside a QR code from this generator?",
      "a": "You can encode a website link or any plain text you type into the content box, such as a short message, a reference number or written-out details. The code simply carries that text, and a phone scanning it will open the link or display the text, depending on what you entered."
    },
    {
      "q": "In what format do I download my QR code?",
      "a": "The download is a PNG image. When you click the download button, the code is rendered at the size you selected with the slider, from 128 up to 1,024 pixels, and saved as a PNG file. PNG works in documents, design software, websites and print, and keeps the code edges sharp."
    },
    {
      "q": "Can I change the colours of my QR code?",
      "a": "Yes. There are separate pickers for the foreground pattern and the background, and each shows its hex value so you can match brand colours exactly. Choose combinations with strong contrast: dark patterns on light backgrounds scan most reliably, while very pale or similar colours can make a code unreadable."
    },
    {
      "q": "Do QR codes made here expire?",
      "a": "No. The code is a static image that permanently contains the text or link you entered, and it does not depend on this website to keep working. The only thing that can break it later is the destination itself, for example if the web page you linked to is moved or deleted."
    },
    {
      "q": "Why will my QR code not scan?",
      "a": "The usual causes are low contrast between the colours, a code printed too small for the scanning distance, glare on glossy surfaces, or very long content making the pattern extremely dense. Darken the pattern, lighten the background, increase the printed size and test again with a different phone if possible."
    },
    {
      "q": "Is this QR code generator free?",
      "a": "Yes, it is free to use. You can create codes, adjust colours and size, and download the PNG files without creating an account or paying. The tool adds no watermark of its own to the downloaded image, so your codes are ready for business cards, menus and posters immediately."
    }
  ],
  "related": [
    {
      "slug": "utm-builder",
      "label": "UTM Builder"
    },
    {
      "slug": "url-encoder",
      "label": "URL Encoder / Decoder"
    },
    {
      "slug": "favicon-generator",
      "label": "Favicon Generator"
    },
    {
      "slug": "image-resize",
      "label": "Image Resizer"
    },
    {
      "slug": "website-screenshot",
      "label": "Website Screenshot"
    }
  ],
  "label": "QR Code Generator"
},
  'age-calculator': {
  "slug": "age-calculator",
  "searchTitle": "Age Calculator – Exact Years, Months & Days",
  "metaDescription": "Use this age calculator to find your exact age from your date of birth in years, months and days, plus total months, weeks and days, for any date.",
  "intro": [
    "Working out an exact age sounds simple until months of different lengths and leap years get involved. This age calculator does the arithmetic properly: enter a date of birth and it shows the age in years, months and days, worked out the same way people state their age in everyday life. It also totals the whole period in months, weeks and days.",
    "You are not limited to today. A second date field, set to today by default, lets you calculate the age at any other date you choose: the age someone will be on a future birthday, their age on a school admission cut-off, or their exact age on the day of an exam, wedding or retirement. The result updates automatically as soon as both dates are set, with no calculate button to press and nothing to install."
  ],
  "steps": [
    {
      "title": "Enter the date of birth",
      "text": "Use the first date field to select the date of birth. Use the calendar picker or type the date, checking the day, month and year are all correct."
    },
    {
      "title": "Choose the date to calculate at",
      "text": "The second field already shows today's date, so leave it for a current age. Change it to any past or future date to find the age then."
    },
    {
      "title": "Read the exact age breakdown",
      "text": "The result box shows the age as years, months and days, for example 24 years, 7 months and 12 days: the complete age, not just completed birthdays."
    },
    {
      "title": "Check the total time figures",
      "text": "Below the main result, the Total Time Alive panel shows the same period as total months, total weeks and total days, useful for records and milestones."
    }
  ],
  "features": [
    {
      "title": "Exact years, months and days",
      "text": "The calculator works out the full age in years, remaining months and remaining days, correctly handling months with different lengths. Rough year-only subtraction often gets this wrong by months."
    },
    {
      "title": "Age at any date, not just today",
      "text": "The target date defaults to today but can be changed freely. Check ages at future events, past dates or official cut-off days, which is exactly what admission, eligibility and application questions usually ask."
    },
    {
      "title": "Total months, weeks and days",
      "text": "Alongside the main breakdown, the tool totals the whole lifespan in months, weeks and days, with thousands separators for easy reading."
    },
    {
      "title": "Instant automatic results",
      "text": "There is no calculate button. As soon as a valid date of birth and target date are present, the age and totals appear, and they refresh immediately whenever you adjust either date."
    }
  ],
  "useCases": [
    "Parents checking a child's age against school admission cut-off dates",
    "Applicants confirming exact age eligibility for jobs, exams and licences",
    "Families working out ages on upcoming birthdays, weddings and anniversaries",
    "HR and office staff verifying ages from dates of birth on records",
    "Anyone celebrating milestones such as 1,000 weeks or 10,000 days alive"
  ],
  "tips": [
    "Check the year first if a result looks wrong. Most mistakes come from the right day and month but the wrong year in the picker.",
    "For cut-off questions, set the target date to the exact deadline date in the rules, not today; age on that date is what matters.",
    "The target date must be the same day as, or after, the birth date. If birth is later, no result appears because no age exists yet.",
    "Use total days for milestones: 10,000 days falls around twenty-seven years and four to five months, depending on leap years in between."
  ],
  "faqs": [
    {
      "q": "How does this age calculator work out years, months and days?",
      "a": "It compares the date of birth with the target date and counts complete years first, then complete months, then the remaining days. When the day of the month has not been reached yet, it borrows the correct number of days from the previous month, which keeps the result accurate across short and long months."
    },
    {
      "q": "Can I calculate my age on a future date?",
      "a": "Yes. The second date field controls the day the age is calculated at, and it can be any date after the date of birth. Set it to a future birthday, an exam date or an admission deadline to see the exact age in years, months and days on that day."
    },
    {
      "q": "What do total months, total weeks and total days mean?",
      "a": "These figures express the whole period between the two dates as single totals rather than a breakdown. Total months combines the years and leftover months, total days counts every day in the period, and total weeks is the number of complete seven-day weeks. They are useful for records and milestone counting."
    },
    {
      "q": "Why does the calculator show no result for my dates?",
      "a": "A result appears only when both dates are entered and the date of birth is not later than the target date. If the birth date falls after the date you are calculating at, there is no valid age to show, so check both fields and swap them if they were entered the wrong way round."
    },
    {
      "q": "Is this age calculator accurate for official forms?",
      "a": "It performs the standard chronological calculation used for stating age, including correct handling of months of different lengths, so it is suitable for checking ages for school admissions, job applications and similar forms. For legal matters, always confirm the figure against the original birth record or identity document as well."
    },
    {
      "q": "Is the age calculator free and private?",
      "a": "Yes. The calculation happens instantly in your browser, the dates you enter are not sent anywhere for processing, and there is no charge or sign-up. You can check as many dates of birth and target dates as you need, for yourself, your children or your records."
    }
  ],
  "related": [
    {
      "slug": "bmi-calculator",
      "label": "BMI Calculator"
    },
    {
      "slug": "percentage-calculator",
      "label": "Percentage Calculator"
    },
    {
      "slug": "loan-calculator",
      "label": "Loan Calculator"
    },
    {
      "slug": "discount-calculator",
      "label": "Discount Calculator"
    },
    {
      "slug": "random-number-generator",
      "label": "Random Number Generator"
    }
  ],
  "label": "Age Calculator"
},
  'password-generator': {
  "slug": "password-generator",
  "searchTitle": "Password Generator – Strong Random Passwords Free",
  "metaDescription": "Use this password generator to create strong random passwords free: choose a length from 4 to 64, mix letters, numbers and symbols, and copy in one click.",
  "intro": [
    "Reusing a pet's name, a birthday or the same password on every site is the easiest way to lose an account. This password generator creates a fresh, random password for you in one click, built in your browser using cryptographically secure randomness rather than a predictable pattern. A strong password appears as soon as the page loads.",
    "You stay in control of the recipe. A slider sets the length anywhere from 4 to 64 characters, with 16 as the starting point, and four switches let you include or exclude uppercase letters, lowercase letters, numbers and symbols. That means you can satisfy almost any website's password rules, whether it demands symbols or bans them, and then copy the result straight to your clipboard ready to paste into the sign-up form."
  ],
  "steps": [
    {
      "title": "Set the password length",
      "text": "Drag the length slider to choose between 4 and 64 characters. Sixteen or more suits important accounts, while shorter lengths match older systems with low maximum limits."
    },
    {
      "title": "Choose the character types",
      "text": "Tick or untick uppercase letters, lowercase letters, numbers and symbols to match the site's rules. At least one type must stay selected; all four gives the widest mix."
    },
    {
      "title": "Generate a fresh password",
      "text": "A new password appears automatically whenever you change the length or character types. For another option with the same settings, click the Generate New Password button."
    },
    {
      "title": "Copy and use it immediately",
      "text": "Click Copy beside the password and paste it into the account form and your password manager straight away, rather than memorising or retyping it by hand."
    }
  ],
  "features": [
    {
      "title": "Cryptographically secure randomness",
      "text": "Passwords are built with the browser's secure random number generator, the same source operating systems use for security tasks. The result is genuinely unpredictable, unlike human-invented passwords with guessable patterns."
    },
    {
      "title": "Length from 4 to 64 characters",
      "text": "A simple slider covers everything from a short PIN-style code to a very long passphrase-length password. Longer passwords are dramatically harder to crack, and the current length is always shown clearly beside the slider."
    },
    {
      "title": "Four character type switches",
      "text": "Uppercase, lowercase, numbers and a wide set of symbols can each be switched on or off. This makes it easy to match strict website rules, including services that require symbols or, occasionally, forbid them."
    },
    {
      "title": "Instant regeneration and one-click copy",
      "text": "Changing any setting creates a new password immediately. The copy button then places it on your clipboard without the errors that come from typing it manually."
    }
  ],
  "useCases": [
    "Creating a unique password when opening a new email or banking account",
    "Replacing a weak or reused password after a security warning or breach alert",
    "Setting up accounts for family members with rules about symbols and length",
    "Generating temporary passwords for shared tools, Wi-Fi or test accounts",
    "Supplying strong passwords to store safely in a password manager"
  ],
  "tips": [
    "Length beats complexity. Raise the slider first: 16 to 20 characters with all types on is far stronger than a short, complicated password.",
    "Use a different generated password for every account and store them in a password manager, so one leak harms only one account.",
    "If a site rejects your password, check its rules before shortening it. Some ban particular symbols; untick symbols or regenerate instead of using a word.",
    "Never leave all four types unticked. With nothing selected there is no character set to build from, and the tool will remind you."
  ],
  "faqs": [
    {
      "q": "How does this password generator create passwords?",
      "a": "It builds a character set from the types you select, then picks each character using secure random values generated by your browser. Because the choices are truly random rather than based on words, names or patterns, the finished password does not contain anything an attacker could guess from knowing you or your habits."
    },
    {
      "q": "What length should I choose for a strong password?",
      "a": "Choose at least 16 characters for important accounts such as email and banking, and longer where the site allows it, up to the 64 this tool supports. Length is the biggest factor in resisting brute-force attacks, where every extra character multiplies the number of combinations an attacker would have to try."
    },
    {
      "q": "Are the passwords stored or sent anywhere?",
      "a": "No. Passwords are generated on your own device, inside the page, and are not transmitted to or kept on a server. Once you leave or refresh the page, the password on screen is gone, which is why you should copy it into the account and your password manager immediately."
    },
    {
      "q": "Why does the tool ask me to select at least one option?",
      "a": "A password must be built from some characters. If uppercase, lowercase, numbers and symbols are all switched off, the character set is empty and there is nothing to generate from. Switch at least one type back on and a password will appear straight away with your chosen length."
    },
    {
      "q": "Can I use these passwords for banking and email?",
      "a": "Yes, provided the length and character types match the service's rules. Generate a long password with all four types selected, save it in a reputable password manager, and turn on two-factor authentication as well. A strong password is essential, but the second factor protects you if it is ever exposed."
    },
    {
      "q": "Should I change the password if I do not like it?",
      "a": "You can generate as many as you like with the button or by adjusting a setting, and every result is equally random, so there is no security benefit in hunting for one that looks nicer. Pick the first one that meets the site's rules and store it safely."
    }
  ],
  "related": [
    {
      "slug": "uuid-generator",
      "label": "UUID Generator"
    },
    {
      "slug": "hash-generator",
      "label": "Hash Generator"
    },
    {
      "slug": "random-number-generator",
      "label": "Random Number Generator"
    },
    {
      "slug": "jwt-decoder",
      "label": "JWT Decoder"
    },
    {
      "slug": "base64-encoder",
      "label": "Base64 Encoder / Decoder"
    }
  ],
  "label": "Strong Password Generator"
},
'heic-to-jpg': {
  slug: 'heic-to-jpg',
  label: 'HEIC to JPG Converter',
  searchTitle: 'HEIC to JPG Online Free – Convert iPhone Photos to JPG',
  metaDescription: 'Convert HEIC and HEIF photos from your iPhone to JPG or PNG online for free, right in your browser. No upload, no signup, adjustable JPG quality.',
  intro: [
    'Every photo taken on a modern iPhone is saved in HEIC format by default. HEIC keeps files small on the phone, but it is a wall almost everywhere else: many Windows PCs, older Android phones, office printers, government portals and online application forms simply refuse to open it. This HEIC to JPG converter removes that wall. It decodes your .heic or .heif photo directly in your browser and hands you back a standard JPG — the format everything accepts — or a PNG if you prefer lossless output.',
    'Unlike upload-based converters, your photo never travels to a server. The decoding runs on your own device using a WebAssembly version of the same HEVC technology your iPhone uses, so private family photos stay private. There is no account to create, no watermark on the result and no per-file fee. A quality slider lets you choose the balance between file size and sharpness before you download, and the tool shows you the original and converted sizes so you can see exactly what changed.',
  ],
  steps: [
    {
      title: 'Upload your HEIC photo',
      text: 'Click the upload area and choose a .heic or .heif file from your phone or computer. On an iPhone, the photo is usually in your Files app or was received through AirDrop, email or a chat app in its original HEIC form.',
    },
    {
      title: 'Choose JPG or PNG',
      text: 'JPG is the default and the right choice for almost everything: forms, sharing, printing and uploading to websites. Choose PNG only when you need lossless quality and do not mind a larger file.',
    },
    {
      title: 'Set the JPG quality',
      text: 'For JPG output, use the slider to pick a quality level. Around 90% keeps the photo visually identical to the original for most people, while lower values produce noticeably smaller files for web use.',
    },
    {
      title: 'Convert and download',
      text: 'Click Convert Now. The first conversion takes a few extra seconds while the HEIC decoder loads; after that, click Download Converted Image and your JPG or PNG is saved with the same file name.',
    },
  ],
  features: [
    {
      title: 'Real HEIC decoding, not a rename',
      text: 'The tool actually decodes the HEVC image data inside the HEIC file using the heic2any WebAssembly decoder. Simply renaming a file to .jpg would not work — this produces a genuine JPG or PNG that opens in any app.',
    },
    {
      title: 'Private by design',
      text: 'Conversion happens entirely in your browser. Your photo is never uploaded, stored or shared, which matters for personal photos, ID scans and family pictures.',
    },
    {
      title: 'Adjustable JPG quality',
      text: 'A quality slider from 10% to 100% lets you trade file size against sharpness, and the result panel shows the before and after file sizes so the trade-off is visible.',
    },
    {
      title: 'JPG and PNG output',
      text: 'One page covers both common requests: HEIC to JPG for everyday sharing and forms, and HEIC to PNG when a lossless copy is needed for editing.',
    },
    {
      title: 'Free, no watermark',
      text: 'There is no signup, no payment step and nothing stamped on your converted photo. The downloaded file is the clean conversion of your original.',
    },
  ],
  useCases: [
    'Convert iPhone photos so they open on a Windows PC or older Android phone',
    'Prepare photos for online forms and portals that only accept JPG uploads',
    'Send iPhone pictures to family members whose phones cannot display HEIC',
    'Convert product or property photos from an iPhone for a website or marketplace listing',
    'Turn HEIC screenshots and scans into PNG for documents and assignments',
  ],
  tips: [
    'If a form rejects your photo even after conversion, it is usually a file size limit, not the format. Lower the JPG quality slider to around 70–80% and convert again.',
    'Keep the original HEIC file as your archive copy. HEIC stores more colour information than JPG, so the original remains the best master for future edits.',
    'Very large HEIC photos (20 MB or more) can take a while on older phones because decoding happens on the device. Closing other heavy tabs helps.',
    'For ordinary JPG, PNG or WebP files use the Image Converter tool instead — this page is specialised for HEIC and HEIF input only.',
  ],
  faqs: [
    {
      q: 'Why can my computer not open HEIC photos?',
      a: 'HEIC is Apple\'s high-efficiency photo format. iPhones save it by default because it roughly halves photo file sizes, but support outside Apple devices is patchy: many Windows versions, older Android phones, printers and web portals cannot decode it without extra software. Converting to JPG solves this because JPG opens everywhere.',
    },
    {
      q: 'Is it safe to convert personal photos here?',
      a: 'Yes. The conversion runs completely inside your browser using a WebAssembly decoder — the file is never uploaded to a server. Nothing is stored or shared, so the photo exists only on your device before and after conversion.',
    },
    {
      q: 'Will converting HEIC to JPG lose quality?',
      a: 'JPG is a lossy format, so a conversion at low quality settings can soften fine detail. At the default 92% quality, the difference is not visible to most people in normal viewing and printing. If you need a mathematically lossless copy, choose PNG output instead — the file will be larger.',
    },
    {
      q: 'What is the difference between HEIC and HEIF?',
      a: 'They are effectively the same family: HEIF is the container standard and HEIC is the variant Apple uses for still photos compressed with HEVC. This tool accepts both .heic and .heif files and converts them the same way.',
    },
    {
      q: 'Why did my first conversion take a few seconds?',
      a: 'The HEIC decoder is a WebAssembly module of a few megabytes that your browser downloads and starts the first time you convert. It is cached afterwards, so later conversions in the same visit start faster. This one-time load is also why the tool can work without any server.',
    },
    {
      q: 'Can I convert several HEIC photos at once?',
      a: 'This version converts one photo at a time, which keeps it reliable on phones with limited memory. Convert, download, then repeat for the next photo. For a whole album, your iPhone can also export JPG copies through the Files app, though one-by-one conversion here gives you the quality slider.',
    },
  ],
  related: [
    { slug: 'image-convert', label: 'Image Converter' },
    { slug: 'image-compressor', label: 'Image Compressor' },
    { slug: 'image-resize', label: 'Image Resizer' },
    { slug: 'exif-remover', label: 'EXIF / Metadata Remover' },
    { slug: 'images-to-pdf', label: 'Images to PDF' },
  ],
},
'passport-photo-maker': {
  slug: 'passport-photo-maker',
  label: 'Passport Photo Maker',
  searchTitle: 'Passport Size Photo Maker Online Free – Exact mm Sizes & KB',
  metaDescription: 'Make passport and visa photos online for free at exact official sizes — 35x45mm, 2x2 inch, China, Canada, Saudi and more — with a target file size in KB, in your browser.',
  intro: [
    'A passport or visa photo is rejected for surprisingly small reasons: a few millimetres too wide, the wrong file size for the online portal, or a crop that cuts the chin. This passport photo maker is built around the two things officials actually check — the physical size in millimetres and, for online applications, the file size in kilobytes. Choose from nine standard sizes used by passport offices, visa centres and ID departments, position your face in the guided frame, optionally set a KB target, and download a JPG produced at 300 DPI print resolution.',
    'Everything happens in your browser. Your portrait is never uploaded to a server, which matters for identity photos. The sizes include 35 × 45 mm used in Pakistan and across Europe, the 2 × 2 inch format for US passports and visas, 33 × 48 mm for Chinese visas, 50 × 70 mm for Canadian passports, 40 × 60 mm used for Saudi and Hajj documentation, plus smaller ID sizes and a custom size option where you type any width and height in millimetres. If you set a KB target, the tool lowers quality step by step — and reduces pixel dimensions only if truly needed, telling you honestly when it does.',
  ],
  steps: [
    {
      title: 'Upload a clear portrait',
      text: 'Choose a JPG or PNG photo taken facing the camera against a plain, light-coloured wall. Avoid sunglasses, caps and heavy shadows; the clearer the original, the better the official result.',
    },
    {
      title: 'Pick the official size',
      text: 'Select the size your application demands: 35 × 45 mm for Pakistan and EU documents, 2 × 2 inch for US visas, 33 × 48 mm for China, 50 × 70 mm for Canada, 40 × 60 mm for Saudi and Hajj, or enter a custom size in millimetres.',
    },
    {
      title: 'Position the face in the frame',
      text: 'Drag and resize the crop frame so the face is centred with the full head and shoulders visible. The frame is locked to the exact width-to-height ratio of the chosen size, so the proportions are always right.',
    },
    {
      title: 'Set a KB target and download',
      text: 'If an online portal limits uploads, choose under 50 KB, 100 KB or 200 KB; otherwise keep Best quality. Click Create Passport Photo, check the final size and dimensions shown, and download the JPG.',
    },
  ],
  features: [
    {
      title: 'Nine official sizes plus custom',
      text: 'Presets cover Pakistan/EU 35 × 45 mm, US 2 × 2 inch, China 33 × 48 mm, Canada 50 × 70 mm, Saudi/Hajj 40 × 60 mm, 30 × 40 mm, 25 × 35 mm and 1 × 1 inch — and a custom option accepts any size from 10 to 200 mm per side.',
    },
    {
      title: 'Exact millimetres at 300 DPI',
      text: 'Output dimensions are calculated from millimetres at 300 DPI, the standard print resolution — a 35 × 45 mm photo is produced at 413 × 531 pixels, so it prints at exactly the size the office measures.',
    },
    {
      title: 'KB target for online portals',
      text: 'Many application portals reject photos over 50, 100 or 200 KB. Pick a target and the tool reduces JPEG quality step by step until the file fits, showing you the real final size before you download.',
    },
    {
      title: 'Guided crop frame',
      text: 'The crop area is locked to the official aspect ratio and starts centred, so you only decide the position and zoom — the shape of the photo can never drift into the wrong proportions.',
    },
    {
      title: 'Private by design',
      text: 'Your portrait is processed entirely in your browser and never uploaded. Identity photos are among the most personal images you own, and here they stay on your device.',
    },
  ],
  useCases: [
    'Make a 35 × 45 mm photo for a Pakistani passport or CNIC-related application',
    'Prepare a 2 × 2 inch photo for a US visa or passport application',
    'Create a 33 × 48 mm photo for a Chinese visa application',
    'Produce a 50 × 70 mm photo for a Canadian passport application',
    'Make a 40 × 60 mm photo for Saudi, Hajj or Umrah documentation',
    'Resize an ID photo to under 50 KB or 100 KB for an online admission or job portal',
  ],
  tips: [
    'Take the photo against a plain light wall in daylight, facing the camera directly. This tool does not replace the background, so the wall behind you becomes the background of the official photo.',
    'When printing at a studio or at home, choose "actual size" or 100% in the print dialog. If the printer scales the page, the carefully measured millimetres will change.',
    'If a portal still rejects the file, check whether it wants a maximum in KB or exact pixel dimensions — the result panel shows both the file size and the pixel size so you can match its wording.',
    'Keep some space above the head and below the shoulders in the frame. Most official guidelines want the face to fill roughly 70–80% of the height, not the entire frame.',
  ],
  faqs: [
    {
      q: 'What size is a passport photo in Pakistan?',
      a: 'Pakistani passport photos use the international 35 × 45 mm size, which is the first preset in this tool. It is produced at 413 × 531 pixels (300 DPI), so it prints at exactly 35 × 45 mm when printed at actual size.',
    },
    {
      q: 'Does this tool make the background white automatically?',
      a: 'No — and it says so openly. This version crops and sizes your photo precisely, but it does not replace the background. Take the photo against a plain white or light-coloured wall for the best official result. The site\'s separate Background Remover tool can change a background first if you need that step.',
    },
    {
      q: 'How do I get my photo under 100 KB for an online form?',
      a: 'Choose the "Under 100 KB" target before creating the photo. The tool lowers the JPEG quality step by step until the file fits under 100 KB and then shows you the exact final size. For very small targets it may also reduce pixel dimensions slightly, and the result panel tells you when that happened.',
    },
    {
      q: 'What does 300 DPI mean for my photo?',
      a: 'DPI is print resolution: at 300 DPI, each millimetre becomes about 11.8 pixels, so a 35 × 45 mm photo is 413 × 531 pixels. That is the resolution print shops and passport offices expect, and it is why the file prints at exactly the stated physical size instead of stretching or shrinking.',
    },
    {
      q: 'Can I use a custom size that is not in the list?',
      a: 'Yes. Choose Custom size and type any width and height in millimetres between 10 and 200 mm per side. The crop frame, pixel dimensions and download all follow your custom measurements.',
    },
    {
      q: 'Is my photo uploaded anywhere?',
      a: 'No. Cropping, resizing and compression all run inside your browser. The photo never leaves your device, there is no account, and nothing is stored on a server — an important point for identity documents.',
    },
  ],
  related: [
    { slug: 'crop-image', label: 'Crop Image' },
    { slug: 'image-resize', label: 'Image Resizer' },
    { slug: 'image-compressor', label: 'Image Compressor' },
    { slug: 'background-remover', label: 'Background Remover' },
    { slug: 'heic-to-jpg', label: 'HEIC to JPG' },
  ],
},
'compress-pdf': {
  slug: 'compress-pdf',
  label: 'Compress PDF',
  searchTitle: 'Compress PDF Online Free – Reduce PDF Size, Keep Text',
  metaDescription: 'Compress PDF files online for free in your browser: reduce PDF size by recompressing its data while keeping text selectable and copyable. No upload, no signup.',
  intro: [
    'Email limits, portal upload caps and slow connections all punish big PDFs. This compress PDF tool reduces a document\'s file size the careful way: it rebuilds the PDF with its internal data streams recompressed, using the qpdf engine running entirely in your browser. Nothing about the pages themselves is rewritten — your text stays selectable and copyable, links keep working, and embedded images remain part of the document. Your file is never uploaded to a server, so contracts, statements and ID documents stay on your own device.',
    'One honest warning before you start, because this site does not hide limits: keeping a PDF fully intact means the saving is modest — typically around 5–20%. Documents exported with uncompressed data can shrink considerably more, while a PDF that was already produced by a good optimizer may barely shrink at all. The tool always shows you the true original and compressed sizes before you download, so you can judge the result yourself. If a portal demands a very small file, such as under 200 KB, this level of compression may not be enough on its own for a large document — in that case, splitting the PDF or reducing image-heavy pages first will help more.',
  ],
  steps: [
    {
      title: 'Upload your PDF',
      text: 'Click the upload area and choose one PDF file from your phone or computer. The file is read into your browser\'s memory only — it is not sent anywhere.',
    },
    {
      title: 'Compress the PDF',
      text: 'Click Compress PDF. The qpdf engine loads (the first run takes a few extra seconds), then recompresses the document\'s streams and rebuilds its object structure in the most compact standard form.',
    },
    {
      title: 'Compare the real sizes',
      text: 'The result panel shows the original size, the compressed size and the exact percentage saved. If your PDF was already well optimized, the panel tells you plainly instead of pretending a big saving happened.',
    },
    {
      title: 'Download the compressed file',
      text: 'Click Download Compressed PDF. The file is your original document in a tighter structure — open it and you can still select, copy and search the text exactly as before.',
    },
  ],
  features: [
    {
      title: 'Text stays selectable',
      text: 'This compressor never converts pages into images. Text remains real text — selectable, copyable and searchable — and links, bookmarks and embedded images are carried through as document data.',
    },
    {
      title: 'Real PDF engine (qpdf)',
      text: 'Compression is done by qpdf, a well-known open-source PDF toolkit, compiled to WebAssembly. It recompresses content streams and generates compact object streams instead of just re-saving the file.',
    },
    {
      title: 'Honest before/after sizes',
      text: 'You always see the true original size, compressed size and percentage saved before downloading. If a file cannot shrink meaningfully, the tool says so rather than inflating the numbers.',
    },
    {
      title: 'Private by design',
      text: 'The whole process runs in your browser with no upload. Financial statements, contracts and identity documents never leave your device.',
    },
    {
      title: 'Free, no watermark',
      text: 'No signup, no payment step, and nothing is added to your document — no watermark, no cover page, no branding.',
    },
  ],
  useCases: [
    'Shrink a PDF so it fits an email attachment limit',
    'Reduce a scanned document bundle before uploading it to an application portal',
    'Make reports and e-books faster to share on slow connections',
    'Tidy and recompress PDFs exported from office software with bloated structure',
    'Prepare a smaller archive copy of a document while keeping its text searchable',
  ],
  tips: [
    'Set expectations by file type: a PDF exported from a scanner app or office suite with uncompressed streams can shrink a lot; a PDF that came from a professional optimizer usually has little left to save.',
    'If a portal demands under 200 KB and your document is image-heavy, compress alone may not reach it. Split the document with the Split PDF tool, or reduce the images before they are combined with Images to PDF.',
    'Password-protected PDFs cannot be compressed — the engine cannot open encrypted files. Remove the password in the app that created the document first, then compress.',
    'Very large PDFs (hundreds of pages or tens of megabytes) are processed in browser memory. If a big file fails on a phone, try the same file in a desktop browser with more memory available.',
  ],
  faqs: [
    {
      q: 'How much smaller will my PDF get?',
      a: 'Typically around 5–20%, and the tool shows the exact result before you download. This compressor keeps your document fully intact, which limits how much can be saved: files exported with uncompressed data shrink the most, while already-optimized PDFs may not shrink at all. Any tool promising 90% savings on every file is usually converting pages to images, which destroys selectable text.',
    },
    {
      q: 'Will the text in my PDF still be selectable after compression?',
      a: 'Yes. Unlike image-based compressors, this tool never renders pages into pictures. It recompresses the PDF\'s internal data streams with qpdf and rebuilds the file structure, so text stays selectable and copyable, links keep working, and search inside the document still works.',
    },
    {
      q: 'Is it safe to compress confidential documents here?',
      a: 'Yes. Compression runs completely in your browser using a WebAssembly build of qpdf; your file is never uploaded to a server and nothing is stored. That makes it suitable for bank statements, contracts and identity documents, on a device you trust.',
    },
    {
      q: 'Why did my PDF not get any smaller?',
      a: 'Some PDFs are already produced in a highly compressed form — common with files from professional PDF software or modern office suites. In that case there is little redundant data left to remove, and the result panel will honestly show a saving near zero rather than a made-up number.',
    },
    {
      q: 'Can this tool compress my PDF to exactly 200 KB or 100 KB?',
      a: 'No, and it will not pretend otherwise. A structure-level compressor cannot dial in an exact target size the way image-based tools attempt to. If a portal requires a hard limit like 200 KB, combine this with splitting the document or reducing its images first; for image-based target sizes, that trade-off costs you selectable text.',
    },
    {
      q: 'Why can a password-protected PDF not be compressed?',
      a: 'The compression engine needs to read and rebuild the document\'s internal structure, and encryption prevents exactly that. Remove the password using the software that created or protects the file, then run the unprotected copy through this tool.',
    },
  ],
  related: [
    { slug: 'merge-pdf', label: 'Merge PDF' },
    { slug: 'split-pdf', label: 'Split PDF' },
    { slug: 'images-to-pdf', label: 'Images to PDF' },
    { slug: 'pdf-to-images', label: 'PDF to Images' },
    { slug: 'organize-pdf', label: 'Organize PDF' },
  ],
},
'find-and-replace': {
  slug: 'find-and-replace',
  label: 'Find and Replace',
  searchTitle: 'Find and Replace Text Online Free – Replace Words in Text',
  metaDescription: 'Find and replace text online for free: replace every occurrence of a word or phrase in long text at once, with match-case and regex options. No signup.',
  intro: [
    'Every long document hides the same tedious job: a name spelled two ways, a product renamed halfway through writing, a date or price repeated forty times. Fixing each occurrence by hand is slow, and it is easy to miss one. This find and replace tool does the whole job in a single pass. Paste your text, type the word or phrase to find and what should replace it, and every occurrence in the document is swapped at once when you press Replace All.',
    'Two options give you control over how matching works. By default the search ignores capitalisation, so "Report", "report" and "REPORT" are all treated as the same word; switch Match Case on when capitals matter and only exact matches should change. For pattern jobs — reformatting dates, codes or repeated spacing — turn on Regular Expression mode and search with a pattern instead of a fixed word. Everything runs in your browser: your text is never uploaded, which makes the tool safe for drafts, manuscripts and internal documents.',
  ],
  steps: [
    {
      title: 'Paste your text',
      text: 'Paste the document, article or list into the large text box on the left. The tool works on the text exactly as pasted, however long it is.',
    },
    {
      title: 'Type what to find and its replacement',
      text: 'Enter the word or phrase in the Find box and the new wording in Replace With. Leave Replace With empty if you simply want to delete every occurrence of the found text.',
    },
    {
      title: 'Choose your matching options',
      text: 'Leave Match Case off to catch every capitalisation, or switch it on for exact matches only. Turn on Regular Expression when you need to match a pattern rather than one fixed phrase.',
    },
    {
      title: 'Replace all and copy the result',
      text: 'Press Replace All — every occurrence changes in one pass. Then use Copy Text to take the cleaned document back, or Clear to start a new job.',
    },
  ],
  features: [
    {
      title: 'Every occurrence in one pass',
      text: 'Replace All changes each match in the document at the same time. There is no stepping through results one by one and no risk of stopping halfway through a long text.',
    },
    {
      title: 'Match Case control',
      text: 'The default search is case-insensitive, catching "Word", "word" and "WORD" together. Enable Match Case when only the exact capitalisation should be replaced — essential for codes, names and abbreviations.',
    },
    {
      title: 'Regular expression mode',
      text: 'Switch on Use Regular Expression to find patterns instead of fixed words: dates in different formats, reference codes, double spaces, or any repeated structure a plain search cannot describe.',
    },
    {
      title: 'Built for long texts',
      text: 'The editor box is sized for chapters, reports and long lists, and the replacement runs instantly in the page. Paste a full document and clean it in seconds rather than page by page.',
    },
    {
      title: 'Private by design',
      text: 'Finding and replacing happens entirely in your browser on your own device. Nothing is uploaded to a server, so unpublished drafts and confidential documents stay where they belong.',
    },
  ],
  useCases: [
    'Correcting a misspelled name that appears throughout a long document',
    'Renaming a product, character or place across a manuscript or report draft',
    'Updating repeated prices, dates or version numbers in a draft list or document',
    'Standardising spelling variants (for example organise/organize) before publishing',
    'Cleaning pasted text with regex — collapsing double spaces or reformatting dates and codes',
  ],
  tips: [
    'Keep a copy of the original text before a big replacement. The tool has no undo button, so pasting your saved copy back is the way to reverse a Replace All.',
    'Deleting is a replacement too: leave Replace With empty to remove every occurrence of the found word or phrase.',
    'In regex mode, test your pattern on a short sample first. A pattern that is broader than you intended will replace more than you expected.',
    'If Match Case results surprise you, check capitalisation: with Match Case off, "Apple" the fruit and "apple" in a code name are treated as the same word.',
  ],
  faqs: [
    {
      q: 'Does this tool replace all occurrences or one at a time?',
      a: 'All at once. Pressing Replace All swaps every occurrence of the Find text in the document in a single pass. There is no one-by-one mode, which is why keeping a copy of your original text before a large replacement is a good habit.',
    },
    {
      q: 'What does Match Case do?',
      a: 'With Match Case off (the default), the search ignores capitalisation, so "Report", "report" and "REPORT" all match. With it on, only text with exactly the same capitalisation as your Find entry is replaced — useful for names, codes and abbreviations where case carries meaning.',
    },
    {
      q: 'What is the Regular Expression option for?',
      a: 'Regular expressions let you search for a pattern instead of one fixed phrase — for example every date written as day/month/year, or runs of two or more spaces. It is a power option for cleanup jobs. If the pattern is not valid, the tool shows an alert and leaves your text unchanged.',
    },
    {
      q: 'Can I delete words with this tool?',
      a: 'Yes. Type the word or phrase in Find and leave Replace With completely empty, then press Replace All. Every occurrence is removed from the text. Check the spacing around removed words afterwards, as a deleted word can leave a double space behind — a quick regex pass for double spaces fixes that.',
    },
    {
      q: 'Is my text uploaded or stored anywhere?',
      a: 'No. The find and replace runs in your browser on your own device; the tool does not send your text to a server. That makes it suitable for unpublished drafts and private documents. Note that refreshing or closing the page discards the text in the box, so copy anything you want to keep.',
    },
    {
      q: 'Is this find and replace tool free?',
      a: 'Yes, completely free. Paste as much text as you need, run as many replacements as you like, and use the match-case and regex options without signing up, installing anything or paying for longer documents.',
    },
  ],
  related: [
    { slug: 'word-counter', label: 'Word Counter' },
    { slug: 'case-converter', label: 'Case Converter' },
    { slug: 'whitespace-remover', label: 'Whitespace Remover' },
    { slug: 'reverse-text', label: 'Reverse Text' },
    { slug: 'lorem-ipsum', label: 'Lorem Ipsum Generator' },
  ],
},
};

export function getToolSeo(slug: string): ToolSeoContent {
  const content = TOOL_SEO[slug];
  if (!content) throw new Error(`No SEO content registered for tool: ${slug}`);
  return content;
}
