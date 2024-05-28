let cart = [];
const maxCartItems = 11;

document.getElementById("search-button").addEventListener("click", function () {
  const query = document.getElementById("search-input").value.trim();
  if (query) {
    searchPlayersByLetter(query);
  } else {
    alert("Please enter a letter to search.");
  }
});

function searchPlayersByLetter(letter) {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${letter}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.player);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayResults(players) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (players) {
    players.forEach((player) => {
      const playerCard = document.createElement("div");
      playerCard.className = "player-card";

      playerCard.innerHTML = `
                <img src="${
                  player.strThumb || "https://via.placeholder.com/100"
                }" alt="${player.strPlayer}">
                <h3>${player.strPlayer}</h3>
                <p>Nationality: ${player.strNationality}</p>
                <p>Team: ${player.strTeam}</p>
                <p>Sport: ${player.strSport}</p>
                <p>Wage: ${player.strWage || "N/A"}</p>
                <p>${
                  player.strDescriptionEN
                    ? player.strDescriptionEN.substring(0, 50) + "..."
                    : "No description available"
                }</p>
                <p>Gender: ${player.strGender}</p>
                <div class="social-media">
                    ${
                      player.strFacebook
                        ? `<a href="https://${player.strFacebook}" target="_blank"><i class="fab fa-facebook"></i></a>`
                        : ""
                    }
                    ${
                      player.strInstagram
                        ? `<a href="https://${player.strInstagram}" target="_blank"><i class="fab fa-instagram"></i></a>`
                        : ""
                    }
                </div>
                <button class="add-to-cart" onclick="addToCart('${
                  player.idPlayer
                }', '${player.strPlayer}')">Add to Cart</button>
                <button class="details-button" onclick="viewDetails('${
                  player.idPlayer
                }')">Details</button>
            `;

      resultsDiv.appendChild(playerCard);
    });
  } else {
    resultsDiv.textContent = "No players found with this letter.";
  }
}

function addToCart(playerId, playerName) {
  if (cart.length < maxCartItems && !cart.includes(playerId)) {
    cart.push(playerId);
    const cartItems = document.getElementById("cart-items");
    const listItem = document.createElement("li");
    listItem.textContent = playerName;
    cartItems.appendChild(listItem);

    updateCartCount();

    const addButton = document.querySelector(
      `button[onclick="addToCart('${playerId}', '${playerName}')"]`
    );
    if (addButton) {
      addButton.textContent = "Already Added";
      addButton.className = "already-added";
      addButton.disabled = true;
    }
  } else if (cart.includes(playerId)) {
    alert("Player is already in the cart.");
  } else {
    alert("Cart is full. You can only add 11 players.");
  }
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = `(${cart.length})`;
  }
}

function viewDetails(playerId) {
  const url = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayPlayerDetails(data.players[0]);
    })
    .catch((error) => {
      console.error("Error fetching player details:", error);
    });
}

function displayPlayerDetails(player) {
  const detailsDiv = document.createElement("div");
  detailsDiv.className = "player-details";

  detailsDiv.innerHTML = `
        <h2>${player.strPlayer}</h2>
        <img src="${
          player.strThumb || "https://via.placeholder.com/150"
        }" alt="${player.strPlayer}">
        <p>Nationality: ${player.strNationality}</p>
        <p>Team: ${player.strTeam}</p>
        <p>Sport: ${player.strSport}</p>
        <p>Wage: ${player.strWage || "N/A"}</p>
        <p>Gender: ${player.strGender}</p>
        <div class="social-media">
            ${
              player.strFacebook
                ? `<a href="https://${player.strFacebook}" target="_blank"><i class="fab fa-facebook"></i></a>`
                : ""
            }
            ${
              player.strInstagram
                ? `<a href="https://${player.strInstagram}" target="_blank"><i class="fab fa-instagram"></i></a>`
                : ""
            }
        </div>
        <button onclick="closeDetails()">Close</button>
    `;

  detailsDiv.style.display = "block";
  document.body.appendChild(detailsDiv);
}

function closeDetails() {
  const detailsDiv = document.querySelector(".player-details");
  if (detailsDiv) {
    detailsDiv.remove();
  }
}
