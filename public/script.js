// User Authentication Logic
const API_URL = "http://localhost:5000"; // Backend URL
let totalAmount = 0;
let rowCount = 1; 
const maxRows = 8; 





let currentUser = null;
const fixedUsername = "bro123";
const fixedPassword = "idklol123";

async function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (username === fixedUsername && password === fixedPassword) {
        localStorage.setItem("loggedIn", "true");
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
    } else {
        alert("Invalid username or password.");
    }
}

function checkLoginStatus() {
    if (localStorage.getItem("loggedIn") === "true") {
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
    }
}

window.onload = () => {
    localStorage.removeItem("loggedIn"); // Force login screen to show
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("app").classList.add("hidden");
};

function addItem() {
    const itemName = document.getElementById("itemName").value.trim();
    const itemSize = document.getElementById("itemSize").value.trim();
    const itemQty = parseInt(document.getElementById("itemQty").value);
    const itemPrice = parseFloat(document.getElementById("itemPrice").value);

    if (!itemName) {
        alert("Item name cannot be empty.");
        return;
    }
    if (!itemSize) {
        alert("Size cannot be empty.");
        return;
    }

    if (isNaN(itemQty) || itemQty <= 0) {
        alert("Quantity must be a positive number.");
        return;
    }
    if (isNaN(itemPrice) || itemPrice <= 0) {
        alert("Price must be a positive number.");
        return;
    }

    const itemTotal = itemQty * itemPrice;
    totalAmount += itemTotal;

    // Prevent adding more rows than the max limit
    if (rowCount >= maxRows) {
        alert("You can only add up to 8 rows.");
        return;
    }

    const emptyRow = document.getElementById("emptyRow");
    if (emptyRow) emptyRow.style.display = "none";

    const table = document.getElementById("billTable").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td>${itemName}</td>
        <td>${itemSize}</td>
        <td>${itemQty}</td>
        <td>${itemPrice.toFixed(2)}</td>
        <td>${itemTotal.toFixed(2)}</td>
        <td>
            <button onclick="editItem(this)">Edit</button>
            <button onclick="deleteItem(this, ${itemTotal})">Delete</button>
        </td>
    `;

    rowCount++;
    updateSerialNumbers();
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);

    // Clear input fields
    document.getElementById("itemName").value = "";
    document.getElementById("itemSize").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemPrice").value = "";
}

function deleteItem(button, itemTotal) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    totalAmount -= itemTotal;
    if (totalAmount < 0) totalAmount = 0;
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);

    const table = document.getElementById("billTable").getElementsByTagName("tbody")[0];
    if (table.rows.length === 0) {
        document.getElementById("emptyRow").style.display = "";
    }

    rowCount--; 
    updateSerialNumbers();
}

function editItem(button) {
    const row = button.parentNode.parentNode;
    const cells = row.getElementsByTagName("td");

    // Populate modal input fields with row data
    document.getElementById("editItemName").value = cells[1].innerText;
    document.getElementById("editItemSize").value = cells[2].innerText;
    document.getElementById("editItemQty").value = cells[3].innerText;
    document.getElementById("editItemPrice").value = cells[4].innerText;

    // Store the original item total for calculation later
    const originalItemTotal = parseFloat(cells[5].innerText);

    // Show the edit modal
    document.getElementById("editModal").classList.remove("hidden");

    // Pass the original item total to the saveEdit function
    const saveEditButton = document.getElementById("editModal").querySelector("button[onclick='saveEdit()']");
    saveEditButton.onclick = () => saveEdit(originalItemTotal, row);
}
// Open and close settings modal
function openSettings() {
    document.getElementById("settingsModal").classList.remove("hidden");
}

function closeSettings() {
    document.getElementById("settingsModal").classList.add("hidden");
}


function saveEdit(originalItemTotal, row) {
    const updatedItemName = document.getElementById("editItemName").value.trim();
    const updatedItemSize = document.getElementById("editItemSize").value.trim();
    const updatedItemQty = parseInt(document.getElementById("editItemQty").value);
    const updatedItemPrice = parseFloat(document.getElementById("editItemPrice").value);

    // Basic validation 
    if (!updatedItemName) {
        alert("Item name cannot be empty.");
        return;
    }
    if (!updatedItemSize) {
        alert("Size cannot be empty.");
        return;
    }

    if (isNaN(updatedItemQty) || updatedItemQty <= 0) {
        alert("Quantity must be a positive number.");
        return;
    }
    if (isNaN(updatedItemPrice) || updatedItemPrice <= 0) {
        alert("Price must be a positive number.");
        return;
    }

    // Update row data
    row.cells[1].innerText = updatedItemName;
    row.cells[2].innerText = updatedItemSize;
    row.cells[3].innerText = updatedItemQty;
    row.cells[4].innerText = updatedItemPrice.toFixed(2);
    row.cells[5].innerText = (updatedItemQty * updatedItemPrice).toFixed(2);

    // Update total amount
    totalAmount -= originalItemTotal;
    totalAmount += (updatedItemQty * updatedItemPrice);
    document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);

    // Close the modal
    closeModal();
}

function closeModal() {
    document.getElementById("editModal").classList.add("hidden");
}
// Save item name to localStorage
function saveItem() {
    const itemName = document.getElementById("savedItem").value.trim();
    if (!itemName) return alert("Item name cannot be empty!");

    let savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    if (!savedItems.includes(itemName)) {
        savedItems.push(itemName);
        localStorage.setItem("savedItems", JSON.stringify(savedItems));
        updateSavedItemsList();
        alert("Item saved!");
    } else {
        alert("Item already exists!");
    }

    document.getElementById("savedItem").value = ""; // Clear input
}
// Autocomplete feature for item input
function setupAutocomplete() {
    const itemInput = document.getElementById("itemInput"); // Assuming item input has this ID
    itemInput.addEventListener("input", function () {
        const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
        const suggestions = savedItems.filter((item) =>
            item.toLowerCase().startsWith(this.value.toLowerCase())
        );

        // Create a datalist for suggestions
        let dataList = document.getElementById("itemSuggestions");
        if (!dataList) {
            dataList = document.createElement("datalist");
            dataList.id = "itemSuggestions";
            itemInput.setAttribute("list", "itemSuggestions");
            document.body.appendChild(dataList);
        }

        dataList.innerHTML = ""; // Clear old suggestions
        suggestions.forEach((suggestion) => {
            const option = document.createElement("option");
            option.value = suggestion;
            dataList.appendChild(option);
        });
    });
}

// Update saved items list in modal
function updateSavedItemsList() {
    const savedItems = JSON.parse(localStorage.getItem("savedItems")) || [];
    const savedItemsList = document.getElementById("savedItemsList");

    savedItemsList.innerHTML = "";
    savedItems.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        savedItemsList.appendChild(li);
    });
}

function updateSerialNumbers() {
    const rows = document.getElementById("billTable").getElementsByTagName("tbody")[0].rows;
    let slNo = 1;

    for (const row of rows) {
        if (row.id !== "emptyRow") {
            const slNoCell = row.cells[0];
            if (slNoCell) {
                slNoCell.innerText = slNo++;
            }
        }
    }
}


// Open PDF options modal
function openPDFModal() {
    document.getElementById("pdfOptionsModal").classList.remove("hidden");
}

// Close PDF modal
function closePDFModal() {
    document.getElementById("pdfOptionsModal").classList.add("hidden");
}

// Confirm the selection and generate the PDF
function confirmPDF() {
    const selectedSize = document.querySelector('input[name="paperSize"]:checked').value;
    closePDFModal(); // Close the modal

    // Call saveAsPDF with the selected paper size
    saveAsPDF(selectedSize);
}

// Modify saveAsPDF to accept a paper size parameter
async function saveAsPDF(paperSize = "a4") {
    const { jsPDF } = window.jspdf;

    // Configure page size based on selection
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: paperSize,
    });


    const startY = 37; // Start position for the PDF content

    // Get customer details
    const customerCompanyName = document.getElementById("customerCompanyName").value || "Customer's Company";
    const customerName = document.getElementById("customerName").value || "Customer";
    const customerAddress = document.getElementById("customerAddress").value || "Not Provided";
    const partyPhone = document.getElementById("partyPhone").value || "Not Provided";


    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString();

    // Calculate the page width dynamically
const pageWidth = pdf.internal.pageSize.getWidth();

// Add the title "ORDER/BILL" in bold with size 14
pdf.setFontSize(14);
pdf.setFont("helvetica", "bold");
pdf.text("ORDER/BILL", pageWidth / 2, startY, { align: "center" });



pdf.setFontSize(12);
pdf.setFont("helvetica", "normal");
pdf.text(`Customer's Company: ${customerCompanyName}`, 14, startY + 20);
pdf.text(`Customer Name: ${customerName}`, 14, startY + 26);
pdf.text(`Party Phone: ${partyPhone}`, 14, startY + 32); // Add Party Phone
pdf.text(`Address: ${customerAddress}`, 14, startY + 38); // Adjust spacing for Address


    

// Add the date dynamically aligned to the right
pdf.setFontSize(12);
pdf.text(`Date: ${dateString}`, pageWidth - 14, startY + 20, { align: "right" });


    // Prepare table data
    const headers = ["SL NO", "Item", "Size", "Quantity", "Price", "Total"];
    const rows = [];
    const table = document.getElementById("billTable").getElementsByTagName("tbody")[0];
    for (const row of table.rows) {
        if (row.id !== "emptyRow") {
            const cells = Array.from(row.cells).slice(0, 6).map((cell) => cell.innerText);
            rows.push(cells);
        }
    }

    // Draw table
    pdf.autoTable({
        startY: startY + 50,
        head: [headers],
        body: rows,
        theme: "striped",
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            fontSize: 12,
            halign: "center",
        },
        bodyStyles: {
            fontSize: 10,
            halign: "center",
        },
        styles: {
            lineWidth: 0.5,
        },
    });
   // Get the actual total amount from the table
let totalAmount = 0;
const tableRows = document.getElementById("billTable").getElementsByTagName("tbody")[0].rows;

for (const row of tableRows) {
    if (row.id !== "emptyRow") {
        const rowTotal = parseFloat(row.cells[5].innerText) || 0;
        totalAmount += rowTotal;
    }
}

// Get advance payment
const advanceAmount = parseFloat(document.getElementById("advanceAmount").value) || 0;

// Calculate remaining total
const remainingTotal = Math.max(0, totalAmount - advanceAmount);



// Add Advance Payment
const advanceAmountText = `Advance Paid: tk ${advanceAmount.toFixed(2)}`;
pdf.setFontSize(12);
pdf.setFont("helvetica", "normal");
pdf.text(advanceAmountText, pageWidth - 14, pdf.lastAutoTable.finalY + 10, { align: "right" });

// Determine the appropriate label based on advance payment
const totalLabel = advanceAmount > 0 ? "Remaining Total" : "Total Amount";
const totalLabelText = `${totalLabel}: tk ${remainingTotal.toFixed(2)}`;

// Add Remaining Total/Total Amount
pdf.setFontSize(12);
pdf.setFont("helvetica", "bold");
pdf.text(totalLabelText, pageWidth - 14, pdf.lastAutoTable.finalY + 20, { align: "right" });

// Add Taka In Words
const amountInWords = numberToWords(remainingTotal);
const takaInWordsText = `Taka In Words: ${amountInWords} tk only`;
pdf.setFontSize(10);
pdf.setFont("helvetica", "normal");
pdf.text(takaInWordsText, pageWidth - 14, pdf.lastAutoTable.finalY + 30, { align: "right" });



    // Download the PDF
    pdf.save("invoice.pdf");
}





function numberToWords(amount) {
    const words = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
    ];
    const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
    ];
    const lacs = [
        "",
        "One Lac",
        "Two Lacs",
        "Three Lacs",
        "Four Lacs",
        "Five Lacs",
        "Six Lacs",
        "Seven Lacs",
        "Eight Lacs",
        "Nine Lacs",
        "Ten Lacs"
    ];

    if (amount === 0) {
        return "Zero";
    }

    let result = "";

    if (amount < 20) {
        result = words[amount];
    } else if (amount < 100) {
        result = tens[Math.floor(amount / 10)] + (amount % 10 != 0 ? "-" + words[amount % 10] : "");
    } else if (amount < 1000) {
        result = words[Math.floor(amount / 100)] + " Hundred" + (amount % 100 != 0 ? " and " + numberToWords(amount % 100) : "");
    } else if (amount < 100000) {
        result = numberToWords(Math.floor(amount / 1000)) + " Thousand" + (amount % 1000 != 0 ? " " + numberToWords(amount % 1000) : "");
    } else if (amount < 1000000) {
        result = numberToWords(Math.floor(amount / 100000)) + " Lac" + (amount % 100000 != 0 ? " " + numberToWords(amount % 100000) : "");
    } else if (amount < 10000000) {
        result = lacs[Math.floor(amount / 1000000)] + (amount % 1000000 != 0 ? " " + numberToWords(amount % 1000000) : "");
    } else {
        result = "Amount exceeds 10 Lacs";
    }

    return result;
}
function updateTotalWithAdvance() {
    const advanceAmount = parseFloat(document.getElementById("advanceAmount").value) || 0;
    const originalTotal = totalAmount;

    // Calculate the remaining amount
    const remainingTotal = Math.max(0, originalTotal - advanceAmount);

    // Display the advance amount and updated total
    document.getElementById("advanceDisplay").innerText = advanceAmount.toFixed(2);
    document.getElementById("totalAmount").innerText = remainingTotal.toFixed(2);
}

// Add display for Advance Payment above Total
const totalSection = document.querySelector("#totalAmount").parentNode;
const advanceDisplay = document.createElement("h2");
advanceDisplay.innerHTML = `Advance Paid: <span id="advanceDisplay">0.00</span>`;
totalSection.parentNode.insertBefore(advanceDisplay, totalSection);
// Initialize saved items list and autocomplete on load
document.addEventListener("DOMContentLoaded", () => {
    updateSavedItemsList();
    setupAutocomplete();
});



