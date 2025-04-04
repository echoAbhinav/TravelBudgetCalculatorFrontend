document.addEventListener("DOMContentLoaded", () => {
    const calculateBtn = document.getElementById("calculate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const saveBtn = document.getElementById("save-btn");
    const resultsSection = document.getElementById("results");
    const themeToggle = document.getElementById("theme-toggle");
    const currencyBtn = document.getElementById("currency-btn");
    const currencyModal = document.getElementById("currency-modal");
    const closeModal = document.getElementById("close-modal");
    const currencyOptions = document.querySelectorAll(".currency-option");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const updateSavingsBtn = document.getElementById("update-savings");
    const calculateTimelineBtn = document.getElementById("calculate-timeline");
    const tipCategories = document.querySelectorAll(".tip-category");
    const tipCards = document.querySelectorAll(".tip-card");
    const tabLinks = document.querySelectorAll(".tab-link");

    let expenseChart = null;
    const currentCurrency = {
      code: "USD",
      symbol: "$",
    };
  
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    }
  
    // Theme Toggle
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
  
      if (document.body.classList.contains("dark-theme")) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
        localStorage.setItem("theme", "dark");
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
        localStorage.setItem("theme", "light");
      }
  
      if (expenseChart) {
        updateChartTheme();
      }
    });
  
    currencyBtn.addEventListener("click", () => {
      currencyModal.classList.add("show");
    });
  
    closeModal.addEventListener("click", () => {
      currencyModal.classList.remove("show");
    });
  
    window.addEventListener("click", (event) => {
      if (event.target === currencyModal) {
        currencyModal.classList.remove("show");
      }
    });
  
    currencyOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const currencyCode = this.getAttribute("data-currency");
        const currencySymbol = this.getAttribute("data-symbol");
  
        currentCurrency.code = currencyCode;
        currentCurrency.symbol = currencySymbol;
  
        currencyBtn.querySelector("span").textContent = currencyCode;
  
        document.querySelectorAll(".currency-symbol").forEach((el) => {
          el.textContent = currencySymbol;
        });
  
        currencyModal.classList.remove("show");
  
        if (resultsSection.style.display === "block") {
          calculateBudget();
        }
      });
    });
  
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab");
  
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));
  
        this.classList.add("active");
        document.getElementById(`${tabId}-tab`).classList.add("active");
      });
    });
  
    tabLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const tabId = this.getAttribute("data-tab");
  
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).click();
  
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  
    calculateBtn.addEventListener("click", calculateBudget);
  
    resetBtn.addEventListener("click", resetForm);
  
    saveBtn.addEventListener("click", saveTrip);
  
    // Update Savings button event listener
    if (updateSavingsBtn) {
      updateSavingsBtn.addEventListener("click", updateSavings);
    }
  
    // Calculate Timeline button event listener
    if (calculateTimelineBtn) {
      calculateTimelineBtn.addEventListener("click", calculateTimeline);
    }
  
    // Tip Category Filtering
    tipCategories.forEach((category) => {
      category.addEventListener("click", function () {
        const selectedCategory = this.getAttribute("data-category");
  
        // Remove active class from all categories
        tipCategories.forEach((c) => c.classList.remove("active"));
  
        // Add active class to clicked category
        this.classList.add("active");
  
        // Filter tip cards
        tipCards.forEach((card) => {
          if (selectedCategory === "all" || card.getAttribute("data-category") === selectedCategory) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  
    // Function to calculate the budget
    function calculateBudget() {
      // Get trip details
      const destination = document.getElementById("destination").value || "Your Trip";
      const travelers = Number(document.getElementById("travelers").value) || 1;
      const duration = Number(document.getElementById("duration").value) || 1;
      const travelDate = document.getElementById("travel-date").value;
  
      // Get transportation expenses
      const flightCost = Number(document.getElementById("flight").value) || 0;
      const localTransportCost = Number(document.getElementById("local-transport").value) || 0;
      const carRentalCost = Number(document.getElementById("car-rental").value) || 0;
  
      // Get accommodation expenses
      const hotelCost = Number(document.getElementById("hotel").value) || 0;
  
      // Get daily expenses
      const foodCost = Number(document.getElementById("food").value) || 0;
      const activitiesCost = Number(document.getElementById("activities").value) || 0;
  
      // Get other expenses
      const insuranceCost = Number(document.getElementById("insurance").value) || 0;
      const shoppingCost = Number(document.getElementById("shopping").value) || 0;
      const miscCost = Number(document.getElementById("misc").value) || 0;
  
      // Calculate totals
      const transportTotal = flightCost + localTransportCost + carRentalCost;
      const accommodationTotal = hotelCost * duration;
      const foodTotal = foodCost * duration * travelers;
      const activitiesTotal = activitiesCost * duration * travelers;
      const otherTotal = insuranceCost + shoppingCost + miscCost;
  
      const grandTotal = transportTotal + accommodationTotal + foodTotal + activitiesTotal + otherTotal;
      const perPersonCost = grandTotal / travelers;
  
      // Format date if provided
      let dateDisplay = "";
      if (travelDate) {
        const date = new Date(travelDate);
        dateDisplay = ` (${date.toLocaleDateString()})`;
      }
  
      // Update the results section
      document.getElementById("destination-display").textContent = destination;
      document.getElementById("trip-details").textContent =
        `${duration} days, ${travelers} traveler${travelers > 1 ? "s" : ""}${dateDisplay}`;
  
      document.getElementById("transport-total").textContent = `${currentCurrency.symbol}${transportTotal.toFixed(2)}`;
      document.getElementById("accommodation-total").textContent =
        `${currentCurrency.symbol}${accommodationTotal.toFixed(2)}`;
      document.getElementById("food-total").textContent = `${currentCurrency.symbol}${foodTotal.toFixed(2)}`;
      document.getElementById("activities-total").textContent = `${currentCurrency.symbol}${activitiesTotal.toFixed(2)}`;
      document.getElementById("other-total").textContent = `${currentCurrency.symbol}${otherTotal.toFixed(2)}`;
      document.getElementById("grand-total").textContent = `${currentCurrency.symbol}${grandTotal.toFixed(2)}`;
      document.getElementById("per-person").textContent = `${currentCurrency.symbol}${perPersonCost.toFixed(2)}`;
  
      // Show the results section
      resultsSection.style.display = "block";
  
      // Scroll to results
      resultsSection.scrollIntoView({ behavior: "smooth" });
  
      // Create or update the chart
      createExpenseChart(transportTotal, accommodationTotal, foodTotal, activitiesTotal, otherTotal);
  
      // Update savings target if empty
      if (document.getElementById("savings-target") && !document.getElementById("savings-target").value) {
        document.getElementById("savings-target").value = grandTotal.toFixed(2);
      }
    }
  
    // Function to create the expense chart
    function createExpenseChart(transport, accommodation, food, activities, other) {
      const ctx = document.getElementById("expense-chart").getContext("2d");
  
      // Destroy existing chart if it exists
      if (expenseChart) {
        expenseChart.destroy();
      }
  
      // Get theme-based colors
      const isDarkTheme = document.body.classList.contains("dark-theme");
      const textColor = isDarkTheme ? "#e6e6e6" : "#333333";
  
      // Create new chart
      expenseChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Transportation", "Accommodation", "Food & Drinks", "Activities", "Other"],
          datasets: [
            {
              data: [transport, accommodation, food, activities, other],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                boxWidth: 12,
                color: textColor,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${currentCurrency.symbol}${value.toFixed(2)} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }
  
    // Function to update chart theme
    function updateChartTheme() {
      const isDarkTheme = document.body.classList.contains("dark-theme");
      const textColor = isDarkTheme ? "#e6e6e6" : "#333333";
  
      expenseChart.options.plugins.legend.labels.color = textColor;
      expenseChart.update();
    }
  
    // Function to reset the form
    function resetForm() {
      // Reset all input fields
      const inputFields = document.querySelectorAll("input");
      inputFields.forEach((field) => {
        if (field.id === "travelers" || field.id === "duration") {
          field.value = field.id === "travelers" ? "1" : "7";
        } else {
          field.value = "";
        }
      });
  
      // Hide results section
      resultsSection.style.display = "none";
  
      // Destroy chart
      if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
      }
  
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  
    // Function to save trip
    function saveTrip() {
      // Check if there's data to save
      if (resultsSection.style.display !== "block") {
        alert("Please calculate your budget first!");
        return;
      }
  
      // Get trip data
      const tripData = {
        destination: document.getElementById("destination").value || "Your Trip",
        travelers: Number(document.getElementById("travelers").value) || 1,
        duration: Number(document.getElementById("duration").value) || 1,
        travelDate: document.getElementById("travel-date").value,
        expenses: {
          flight: Number(document.getElementById("flight").value) || 0,
          localTransport: Number(document.getElementById("local-transport").value) || 0,
          carRental: Number(document.getElementById("car-rental").value) || 0,
          hotel: Number(document.getElementById("hotel").value) || 0,
          food: Number(document.getElementById("food").value) || 0,
          activities: Number(document.getElementById("activities").value) || 0,
          insurance: Number(document.getElementById("insurance").value) || 0,
          shopping: Number(document.getElementById("shopping").value) || 0,
          misc: Number(document.getElementById("misc").value) || 0,
        },
        currency: currentCurrency,
        totalBudget: Number(
          document.getElementById("grand-total").textContent.replace(currentCurrency.symbol, "")
        ),
      };
  
      // Get existing saved trips or initialize empty array
      const savedTrips = JSON.parse(localStorage.getItem("savedTrips")) || [];
  
      // Add new trip
      savedTrips.push(tripData);
  
      // Save to localStorage
      localStorage.setItem("savedTrips", JSON.stringify(savedTrips));
  
      // Show confirmation
      alert("Trip saved successfully!");
    }
  
    // Function to update savings progress
    function updateSavings() {
      const target = Number(document.getElementById("savings-target").value) || 0;
      const current = Number(document.getElementById("current-savings").value) || 0;
  
      if (target === 0) {
        alert("Please enter a savings target!");
        return;
      }
  
      // Calculate percentage
      const percentage = Math.min(Math.round((current / target) * 100), 100);
  
      // Update progress bar
      const progressBar = document.getElementById("savings-progress-bar");
      progressBar.style.width = `${percentage}%`;
  
      // Update stats
      document.getElementById("savings-percentage").textContent = `${percentage}%`;
      document.getElementById("savings-amount").textContent =
        `${currentCurrency.symbol}${current.toFixed(2)} / ${currentCurrency.symbol}${target.toFixed(2)}`;
    }
  
    // Function to calculate savings timeline
    function calculateTimeline() {
      const target = Number(document.getElementById("savings-target").value) || 0;
      const current = Number(document.getElementById("current-savings").value) || 0;
      const monthlyContribution = Number(document.getElementById("monthly-contribution").value) || 0;
  
      if (target === 0 || monthlyContribution === 0) {
        alert("Please enter a savings target and monthly contribution!");
        return;
      }
  
      // Calculate months needed
      const remaining = target - current;
      const monthsToGoal = Math.ceil(remaining / monthlyContribution);
  
      // Calculate completion date
      const today = new Date();
      const completionDate = new Date(today);
      completionDate.setMonth(today.getMonth() + monthsToGoal);
  
      // Update UI
      document.getElementById("months-to-goal").textContent = monthsToGoal;
      document.getElementById("goal-date").textContent = completionDate.toLocaleDateString();
    }
  
    // Add input validation for number fields
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach((input) => {
      input.addEventListener("input", function () {
        if (this.value < 0) {
          this.value = 0;
        }
      });
    });
  
    // Set current date as min date for travel date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("travel-date").min = today;
  
    // Initialize savings progress if values exist
    if (
      document.getElementById("savings-target") &&
      document.getElementById("current-savings") &&
      document.getElementById("savings-target").value &&
      document.getElementById("current-savings").value
    ) {
      updateSavings();
    }
  
    // Export PDF functionality (placeholder)
    const exportPdfBtn = document.getElementById("export-pdf");
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener("click", () => {
        alert("PDF export feature would generate a downloadable PDF of your budget summary.");
      });
    }
  
    // Share functionality (placeholder)
    const shareBtn = document.getElementById("share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        alert("Share feature would allow you to share your budget via email or social media.");
      });
    }
  
    // Search tips functionality (placeholder)
    const searchTipsBtn = document.getElementById("search-tips");
    if (searchTipsBtn) {
      searchTipsBtn.addEventListener("click", () => {
        const searchTerm = document.getElementById("destination-search").value.trim().toLowerCase();
        if (searchTerm) {
          alert(`Searching for travel tips related to "${searchTerm}"`);
        } else {
          alert("Please enter a destination to search for tips.");
        }
      });
    }

    const backendUrl = "https://travelbudgetcalculatorbackend.onrender.com"; // Replace with your Render backend URL

    fetch(`${backendUrl}/api/endpoint`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
  });