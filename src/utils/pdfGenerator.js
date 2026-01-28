import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (formData, products) => {
    const doc = jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 0.5;
    let currentY = 0.5;

    // Header
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("BILL OF LADING", pageWidth / 2, currentY, { align: "center" });
    currentY += 0.4;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`DATE: ${formData.date}`, pageWidth - margin, currentY, { align: "right" });

    // Instructions (Placed in line with date or right below it)
    if (formData.instructions) {
        doc.setFont("helvetica", "normal");
        const instructionLines = doc.splitTextToSize(formData.instructions, (pageWidth / 2) - margin);
        doc.text(instructionLines, margin, currentY);
        currentY += Math.max(0.3, instructionLines.length * 0.2);
    } else {
        currentY += 0.3;
    }

    // Ship From / Ship To Section
    const colWidth = (pageWidth - margin * 2 - 0.5) / 2;
    const boxPadding = 0.1;

    const formatAddress = (obj) => {
        if (!obj) return "";
        const lines = [obj.name, obj.address];
        const cityStateZip = `${obj.city || ''}${obj.city && obj.state ? ', ' : ''}${obj.state || ''} ${obj.zip || ''}`.trim();
        if (cityStateZip) lines.push(cityStateZip);
        return lines.filter(Boolean).join('\n');
    };

    // Ship From
    doc.setFont("helvetica", "bold");
    const shipFromLines = doc.splitTextToSize(formatAddress(formData.shipFrom), colWidth - (boxPadding * 2));
    const shipToLines = doc.splitTextToSize(formatAddress(formData.shipTo), colWidth - (boxPadding * 2));
    const addressBoxHeight = Math.max(shipFromLines.length, shipToLines.length) * 0.2 + 0.5;

    // Draw Ship From Box
    doc.setLineWidth(0.01); // ~1px
    doc.rect(margin, currentY - 0.15, colWidth, addressBoxHeight);
    doc.text("SHIP FROM (Shipper):", margin + boxPadding, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(shipFromLines, margin + boxPadding, currentY + 0.2);

    // Ship To
    const shipToX = margin + colWidth + 0.5;
    doc.setFont("helvetica", "bold");
    // Draw Ship To Box
    doc.rect(shipToX, currentY - 0.15, colWidth, addressBoxHeight);
    doc.text("SHIP TO (Consignee):", shipToX + boxPadding, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(shipToLines, shipToX + boxPadding, currentY + 0.2);

    // Table starts after the address blocks
    currentY += addressBoxHeight + 0.2;

    // Filter included products
    const includedProducts = products.filter(p => p.included && p.quantity);

    // AutoTable for products
    autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [["Pallets", "Cases", "Code", "Description", "Can UPC", "Case UPC"]],
        body: includedProducts.map(p => [
            p.quantity,
            (parseInt(p.quantity) || 0) * (p.casesPerPallet || 0),
            p.code,
            p.description,
            p.canUpc,
            p.caseUpc
        ]),
        theme: "grid",
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
            lineWidth: 0.01,
            lineColor: [0, 0, 0]
        },
        styles: {
            fontSize: 9,
            cellPadding: 0.1,
            lineColor: [0, 0, 0],
            lineWidth: 0.01
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 0.6 },
            1: { halign: "center", cellWidth: 0.6 },
            2: { cellWidth: 0.8 },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 1.1 },
            5: { cellWidth: 1.1 }
        }
    });

    currentY = doc.lastAutoTable.finalY + 0.3;

    // Totals
    const totalPallets = includedProducts.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 0), 0);
    const totalCases = includedProducts.reduce((acc, curr) => acc + ((parseInt(curr.quantity) || 0) * (curr.casesPerPallet || 0)), 0);

    doc.setFont("helvetica", "bold");
    doc.text(`TOTALS: ${totalPallets} Pallets / ${totalCases} Total Cases`, margin, currentY);
    currentY += 0.4;

    // Legal Statement
    const legalY = doc.internal.pageSize.getHeight() - 2.8;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setLineWidth(0.007); // Thinner line style

    const legalText = "If this shipment is to be delivered to the consignee without recourse on the consignor, the consignor shall sign the following statement: The carrier shall not make delivery of this shipment without payment of freight and all other lawful charges.";
    const legalLines = doc.splitTextToSize(legalText, pageWidth - margin * 2);
    doc.text(legalLines, margin, legalY);

    // No Recourse Signatures
    const sigY = legalY + (legalLines.length * 0.15) + 0.4;
    doc.line(margin, sigY, margin + 3, sigY);
    doc.text("(Signature of Shipper)", margin, sigY + 0.15);

    doc.line(pageWidth - margin - 3, sigY, pageWidth - margin, sigY);
    doc.text("(Signature of Receiver)", pageWidth - margin - 3, sigY + 0.15);

    // Carrier Row
    let footerY = sigY + 0.8;
    doc.line(margin, footerY, pageWidth - margin, footerY);
    doc.text("Carrier", margin, footerY + 0.15);

    // Driver / Date Row
    footerY += 0.8;
    // Driver Signature Section
    doc.line(margin, footerY, margin + 4, footerY);
    doc.text("Driver Signature", margin, footerY + 0.15);

    // Date Section
    const dateX = pageWidth - margin - 2;
    doc.line(dateX, footerY, pageWidth - margin, footerY);
    doc.text("Date", dateX, footerY + 0.15);

    // Save the PDF
    doc.save(`BOL_${formData.date}.pdf`);
};
