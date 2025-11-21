// backend_agro/create-all-test-users.js
// Script to create test users for farmer, buyer, and admin roles

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Hash password function (same as in auth.js)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Read existing users or create empty array
let users = [];
if (fs.existsSync(USERS_FILE)) {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    users = JSON.parse(data);
  } catch (e) {
    console.warn("Could not read existing users file, starting fresh");
    users = [];
  }
}

// Test users to create
const testUsers = [
  {
    id: "farmer_test_001",
    name: "Test Farmer",
    email: "farmer@test.com",
    password: hashPassword("Farmer123"),
    role: "farmer",
    address: "123 Farm Road, Village",
    createdAt: new Date().toISOString(),
  },
  {
    id: "buyer_test_001",
    name: "Test Buyer",
    email: "buyer@test.com",
    password: hashPassword("Buyer123"),
    role: "buyer",
    address: "456 Market Street, City",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin_test_001",
    name: "Test Admin",
    email: "admin@test.com",
    password: hashPassword("Admin123"),
    role: "admin",
    address: "789 Admin Avenue, City",
    createdAt: new Date().toISOString(),
  },
];

// Check if users already exist and update or add
let updated = false;
testUsers.forEach((newUser) => {
  const existingIndex = users.findIndex((u) => u.email === newUser.email);
  if (existingIndex >= 0) {
    console.log(`✅ Updating existing user: ${newUser.email} (${newUser.role})`);
    users[existingIndex] = { ...users[existingIndex], ...newUser };
    updated = true;
  } else {
    console.log(`➕ Adding new user: ${newUser.email} (${newUser.role})`);
    users.push(newUser);
    updated = true;
  }
});

// Save users
if (updated) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  console.log("\n✅ Test users created/updated successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("👨‍🌾 FARMER:");
  console.log("   Email: farmer@test.com");
  console.log("   Password: Farmer123");
  console.log("\n🛒 BUYER:");
  console.log("   Email: buyer@test.com");
  console.log("   Password: Buyer123");
  console.log("\n👨‍💼 ADMIN:");
  console.log("   Email: admin@test.com");
  console.log("   Password: Admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
} else {
  console.log("ℹ️  All test users already exist. No changes made.");
}














