import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requiredFiles = [
  "index.html",
  "employee-dashboard.html",
  "css/style.css",
  "css/employee-dashboard.css",
  "js/dashboard.js",
  "images/hardees-logo.svg",
];

const missing = requiredFiles.filter((file) => !existsSync(resolve(root, file)));
if (missing.length) {
  throw new Error(`Missing required files: ${missing.join(", ")}`);
}

const index = readFileSync(resolve(root, "index.html"), "utf8");
const dashboard = readFileSync(resolve(root, "employee-dashboard.html"), "utf8");
const dashboardCss = readFileSync(resolve(root, "css/employee-dashboard.css"), "utf8");
const dashboardJs = readFileSync(resolve(root, "js/dashboard.js"), "utf8");

const checks = [
  [index.includes('window.location.href') && index.includes('"employee-dashboard.html"'), "successful login redirects to employee-dashboard.html"],
  [index.includes('DEMO1001') && index.includes('Demo@123'), "existing demo credentials are present"],
  [dashboard.includes("Welcome back, Jordan!") , "dashboard welcome message is present"],
  [dashboard.includes("DEMO1001") && dashboard.includes("Jordan Miller") && dashboard.includes("Crew Member") && dashboard.includes("Rockingham, NC"), "employee profile details are present"],
  [dashboard.includes("Check In / Check Out") && dashboard.includes("My Schedule") && dashboard.includes("My Hours") && dashboard.includes("Performance") && dashboard.includes("Pay Statements") && dashboard.includes("Profile") && dashboard.includes("Logout"), "sidebar navigation is complete"],
  [dashboard.includes("Checked Out") && dashboard.includes("CHECK IN"), "initial status and check-in control are present"],
  [dashboard.includes("Today's worked hours") && dashboard.includes("This week's total hours") && dashboard.includes("Performance score") && dashboard.includes("Attendance percentage") && dashboard.includes("Recent activity") && dashboard.includes("Upcoming shift"), "dashboard metrics are complete"],
  [dashboard.includes("DEMO EMPLOYEE SYSTEM") && dashboard.toLowerCase().includes("simulated demonstration"), "demo employee system label is present"],
  [dashboardCss.includes("@media") && dashboardCss.includes("grid-template-columns"), "responsive dashboard CSS is present"],
  [dashboardJs.includes("checkInButton") && dashboardJs.includes("sessionStorage") && dashboardJs.includes("window.location.href"), "dashboard interactions and session handling are present"],
];

const failed = checks.filter(([passed]) => !passed);
if (failed.length) {
  throw new Error(`Validation failed: ${failed.map(([, message]) => message).join("; ")}`);
}

console.log(`Validated ${checks.length} dashboard requirements and ${requiredFiles.length} required files.`);
