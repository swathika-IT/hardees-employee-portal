const checkInButton = document.getElementById("checkInButton");
const workStatus = document.getElementById("workStatus");
const workedHours = document.getElementById("workedHours");
const toast = document.getElementById("toast");
const sidebar = document.getElementById("sidebar");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

let checkedIn = false;
let hoursToday = 0;

function updateDateTime() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    currentTime.textContent = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function toggleCheckIn() {
    checkedIn = !checkedIn;
    if (checkedIn) {
        hoursToday = 0.5;
        checkInButton.classList.add("checked");
        checkInButton.innerHTML = "<span>✓</span> CHECK OUT";
        workStatus.classList.add("checked-in");
        workStatus.innerHTML = "<span></span> Checked In";
        workedHours.textContent = hoursToday.toFixed(1);
        showToast("Check-in recorded. Your shift has started.");
    } else {
        checkInButton.classList.remove("checked");
        checkInButton.innerHTML = "<span>✓</span> CHECK IN";
        workStatus.classList.remove("checked-in");
        workStatus.innerHTML = "<span></span> Checked Out";
        workedHours.textContent = "0.0";
        showToast("Check-out recorded. Thank you for today.");
    }
}

checkInButton.addEventListener("click", toggleCheckIn);

mobileMenuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

document.querySelectorAll(".nav-item[data-section]").forEach((item) => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach((navItem) => navItem.classList.remove("active"));
        item.classList.add("active");
        sidebar.classList.remove("open");
        if (item.dataset.section === "checkin") {
            toggleCheckIn();
        }
    });
});

document.getElementById("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("employeeSession");
    window.location.href = "index.html#employee-login";
});

if (sessionStorage.getItem("employeeSession") !== "DEMO1001") {
    sessionStorage.setItem("employeeSession", "DEMO1001");
}

updateDateTime();
window.setInterval(updateDateTime, 1000);
