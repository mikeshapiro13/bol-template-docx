import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, VerticalAlign } from "docx";
import { saveAs } from "file-saver";
import { formatAddress } from "./docxFormatting";

export const generatePODOCX = async (formData, products, catalogName) => {
    const includedProducts = products.filter(p => p.included && p.quantity);
    const totalPallets = includedProducts.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
    const totalCases = includedProducts.reduce((acc, curr) => acc + ((parseInt(curr.quantity) || 0) * (curr.casesPerPallet || 0)), 0);

    // Standard Word page width (8.5") is 12240 twips.
    // 0.5" margins (720 twips) on each side leaves 10800 twips for content.
    const CONTENT_WIDTH = 10800;

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    size: { width: 12240, height: 15840 },
                    margin: { top: 720, right: 720, bottom: 720, left: 720 },
                },
            },
            children: [
                // 1. PURCHASE ORDER TITLE
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [
                        new TextRun({
                            text: "PURCHASE ORDER",
                            bold: true,
                            size: 44, // 22pt
                        }),
                    ],
                }),

                // 2. PO Number and Date
                new Table({
                    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                    columnWidths: [CONTENT_WIDTH * 0.6, CONTENT_WIDTH * 0.4],
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: CONTENT_WIDTH * 0.6, type: WidthType.DXA },
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: `PO #: ${formData.poNumber}`, size: 20, bold: true })],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    width: { size: CONTENT_WIDTH * 0.4, type: WidthType.DXA },
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.RIGHT,
                                            children: [new TextRun({ text: `DATE: ${formData.date}`, size: 20, bold: true })],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 300 } }),

                // 3. Supplier / Buyer Section
                new Table({
                    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                    columnWidths: [5000, 800, 5000],
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 5000, type: WidthType.DXA },
                                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                                    borders: {
                                        top: { style: BorderStyle.SINGLE, size: 6 },
                                        bottom: { style: BorderStyle.SINGLE, size: 6 },
                                        left: { style: BorderStyle.SINGLE, size: 6 },
                                        right: { style: BorderStyle.SINGLE, size: 6 },
                                    },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "SUPPLIER:", bold: true, size: 20 })] }),
                                        ...formatAddress(formData.supplier).map(line =>
                                            new Paragraph({ children: [new TextRun({ text: line, size: 20 })] })
                                        ),
                                    ],
                                }),
                                new TableCell({ width: { size: 800, type: WidthType.DXA }, children: [] }),
                                new TableCell({
                                    width: { size: 5000, type: WidthType.DXA },
                                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                                    borders: {
                                        top: { style: BorderStyle.SINGLE, size: 6 },
                                        bottom: { style: BorderStyle.SINGLE, size: 6 },
                                        left: { style: BorderStyle.SINGLE, size: 6 },
                                        right: { style: BorderStyle.SINGLE, size: 6 },
                                    },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "BUYER:", bold: true, size: 20 })] }),
                                        ...formatAddress(formData.buyer).map(line =>
                                            new Paragraph({ children: [new TextRun({ text: line, size: 20 })] })
                                        ),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 400 } }),

                // 4. Products Table
                new Table({
                    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
                    columnWidths: [800, 800, 1000, 3800, 2200, 2200],
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: ["Pallets", "Cases", "Code", "Description", "Can UPC", "Case UPC"].map((text, i) => new TableCell({
                                width: { size: [800, 800, 1000, 3800, 2200, 2200][i], type: WidthType.DXA },
                                verticalAlign: VerticalAlign.CENTER,
                                shading: { fill: "F0F0F0" },
                                children: [new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({ text, bold: true, size: 20 })]
                                })],
                                margins: { top: 100, bottom: 100 },
                            })),
                        }),
                        ...includedProducts.map(p => new TableRow({
                            children: [
                                { t: p.quantity, a: AlignmentType.CENTER },
                                { t: (parseInt(p.quantity) || 0) * (p.casesPerPallet || 0), a: AlignmentType.CENTER },
                                { t: p.code, a: AlignmentType.CENTER },
                                { t: p.description, a: AlignmentType.LEFT },
                                { t: p.canUpc, a: AlignmentType.LEFT },
                                { t: p.caseUpc, a: AlignmentType.LEFT }
                            ].map((cell, i) => new TableCell({
                                width: { size: [800, 800, 1000, 3800, 2200, 2200][i], type: WidthType.DXA },
                                verticalAlign: VerticalAlign.CENTER,
                                children: [new Paragraph({
                                    alignment: cell.a,
                                    children: [new TextRun({ text: String(cell.t || ""), size: 20 })]
                                })],
                                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                            })),
                        })),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 100 } }),

                // 5. Totals
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `TOTALS: ${totalPallets} Pallets / ${totalCases} Total Cases`,
                            bold: true,
                            size: 20,
                        }),
                    ],
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `PO_${formData.poNumber}_${formData.date}.docx`);
};
