// ==============================================================================
// CHAPTER ONE CAFE - CONFIGURATION (LIGHT MINIMAL THEME)
// ==============================================================================

const CONFIG = {
  // Cafe Identity
  cafeName: "Chapter One Cafe",
  cafeTagline: "Where Stories & Great Food Meet",
  logoPath: "assets/logo.jpg",

  // Giveaway Announcement Date
  resultDateText: "Sunday, 15th November",

  // Google Apps Script Web App Deployment URL
  googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbwjjCqsdog3MMUEDW7ZEplrYZbXxGOwel7BveWy9khD5unC1Z8wD4f5ci54MVH8gSkd/exec",

  // The 3 Chapter One Cafe Offers
  offers: [
    {
      id: "spend-499-get-18",
      code: "DEAL-18",
      badge: "FLAT 18% OFF",
      graphic: "tag",
      title: "Spend ₹499 & Get Flat 18% OFF",
      description: "Order for ₹499 or more and receive an instant flat 18% discount on your entire cafe bill."
    },
    {
      id: "student-12-discount",
      code: "STUDENT-12",
      badge: "STUDENT EXCLUSIVE",
      graphic: "academic",
      title: "Student Special: 12% OFF Every Visit",
      description: "Flash a valid student ID card on any order of ₹399 or more to unlock 12% off every visit."
    },
    {
      id: "collab-10-discount",
      code: "COLLAB-10",
      badge: "10% COLLAB PERK",
      graphic: "handshake",
      title: "Collaborate With Us: 10% Discount",
      description: "Partner with Chapter One Cafe for club events, group orders, or creator projects and unlock 10% off on each collaboration."
    }
  ]
};
