/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: CHAPTER ONE CAFE GIVEAWAY DATA COLLECTOR
 * ==============================================================================
 * - Collects Name, Phone, and the Specific Selected Offer (out of 3 options).
 * - Enforces STRICT UNIQUE PHONE REGISTRATION:
 *   If the same phone number tries to register again, the script blocks the entry
 *   and returns a "duplicate" status.
 * ==============================================================================
 */

const SHEET_NAME = "Giveaway Entries";

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create and format sheet headers if not exists
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Timestamp",
        "Full Name",
        "Phone Number",
        "Selected Offer",
        "Entry ID",
        "Redemption Status",
        "Device"
      ];
      sheet.appendRow(headers);

      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1a73e8"); // Google Blue
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 38);
      sheet.setFrozenRows(1);

      sheet.setColumnWidth(1, 170); // Timestamp
      sheet.setColumnWidth(2, 200); // Full Name
      sheet.setColumnWidth(3, 160); // Phone Number
      sheet.setColumnWidth(4, 250); // Selected Offer
      sheet.setColumnWidth(5, 140); // Entry ID
      sheet.setColumnWidth(6, 150); // Status
      sheet.setColumnWidth(7, 140); // Device
    }

    // Parse incoming submission payload
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e.parameter) {
      payload = e.parameter;
    }

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+5:30", "yyyy-MM-dd HH:mm:ss");
    const name = String(payload.name || "Customer").trim();
    const phone = String(payload.phone || "").trim();
    const selectedOffer = String(payload.selectedOffer || "1 Month Free Coffee").trim();
    const entryId = String(payload.entryId || ("C1-" + Math.floor(1000 + Math.random() * 9000))).trim();
    const device = String(payload.device || "Mobile / Web").trim();

    // -------------------------------------------------------------
    // STRICT DUPLICATE PHONE CHECK
    // -------------------------------------------------------------
    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && phone) {
      const existingPhones = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
      const currentDigits = phone.replace(/\D/g, "");

      for (let i = 0; i < existingPhones.length; i++) {
        const rowDigits = String(existingPhones[i][0]).replace(/\D/g, "");
        if (rowDigits && currentDigits && rowDigits === currentDigits) {
          // Reject registration - duplicate detected!
          lock.releaseLock();
          return ContentService
            .createTextOutput(JSON.stringify({
              status: "duplicate",
              message: "This phone number has already registered for the giveaway. Each person can enter only once!"
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    // Append new valid registration
    sheet.appendRow([
      timestamp,
      name,
      "'" + phone,
      selectedOffer,
      entryId,
      "ACTIVE (Pending Draw)",
      device
    ]);

    const newRowIndex = sheet.getLastRow();
    sheet.getRange(newRowIndex, 1, 1, 7).setVerticalAlignment("middle");
    sheet.getRange(newRowIndex, 5).setFontFamily("Courier New").setFontWeight("bold");

    lock.releaseLock();

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Giveaway entry successfully registered!",
        entryId: entryId
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    lock.releaseLock();
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      cafe: "Chapter One Cafe",
      time: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
