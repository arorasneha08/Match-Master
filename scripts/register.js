document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();

  if (!name || !email) {
    alert("Please fill out both fields!");
    return;
  }

  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (!(char >= "A" && char <= "Z") && !(char >= "a" && char <= "z") && char !== " ") {
      alert("Name should only contain letters and spaces.");
      nameInput.focus();
      return;
    }
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }

  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");

  if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex === email.length - 1) {
    alert("Invalid email format.");
    emailInput.focus();
    return;
  }

  let users = JSON.parse(localStorage.getItem("memoryUsers")) || [];
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    alert("This email is already registered. Please use a different one.");
    return;
  }

  const newUser = { name, email };
  users.push(newUser);

  localStorage.setItem("memoryUsers", JSON.stringify(users));
  localStorage.setItem("memoryUser", JSON.stringify(newUser)); 

  window.location.href = "../pages/home.html";
});

const dashboardBtn = document.getElementById("dashboard-btn");

dashboardBtn.addEventListener("click", () => {
  window.location.href = "../pages/dashboard.html";
});