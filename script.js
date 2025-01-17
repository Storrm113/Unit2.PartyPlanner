const apiUrl = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2412-FTB-ET-WEB-FT/EVENTS";
const partyList = document.getElementById("partyList");
const partyForm = document.getElementById("partyForm");

// Fetch and render all parties
async function fetchParties() {
    try {
        const response = await fetch(apiUrl);
        const result = await response.json();
    
        // Access the `data` property that contains the array of parties
        if (result.success && Array.isArray(result.data)) {
          renderParties(result.data); // Pass the array to the render function
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Error fetching parties:", error);
      }
    }


// Render parties in the DOM
function renderParties(parties) {
    partyList.innerHTML = ""; // Clear existing list
    parties.forEach((party) => {
      const dateTime = new Date(party.date); // Convert to Date object
      const formattedDate = dateTime.toLocaleDateString(); // Extract date
      const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extract time in HH:MM format
  
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${party.name}</strong><br>
        Date: ${formattedDate} | Time: ${formattedTime}<br>
        Location: ${party.location}<br>
        Description: ${party.description}<br>
        <button class="delete" data-id="${party.id}">Delete</button>
      `;
      partyList.appendChild(li);
    });
  
    // Attach delete event listeners
    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", () => deleteParty(button.dataset.id));
    });
  }


// Add a new party
partyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newParty = {
    name: document.getElementById("name").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newParty),
    });

    if (response.ok) {
      fetchParties(); // Refresh the list
      partyForm.reset(); // Clear form
    } else {
      console.error("Error adding party:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding party:", error);
  }
});

// Delete a party
async function deleteParty(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchParties(); // Refresh the list
    } else {
      console.error("Error deleting party:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting party:", error);
  }
}

// Initial fetch
fetchParties();
