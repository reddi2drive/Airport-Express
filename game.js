/* ==================================================
   AIRPORT EXPRESS
   GAME PROGRESS
================================================== */

const AIRPORT_EXPRESS = {

  storageKey:
    "airportExpressGame",

  destinations: [

    {
      id: "cashline",
      name: "Cashline City"
    },

    {
      id: "hopes",
      name: "Hope's Peak Mountain"
    },

    {
      id: "wildheart",
      name: "Wild Heart Rain Forest"
    },

    {
      id: "amethyst",
      name: "Amethyst Hollows"
    },

    {
      id: "coral",
      name: "Coral Cove"
    },

    {
      id: "lagoon",
      name: "Tropical Lagoon"
    }

  ]

};



/* ==================================================
   GET PROGRESS
================================================== */

function getGameProgress() {

  const defaults = {

    stamps: [],

    tasks: {},

    boards: {},

    cash: 500,

    properties: {}

  };


  const saved =
    localStorage.getItem(
      AIRPORT_EXPRESS.storageKey
    );


  if (!saved) {

    return defaults;

  }


  try {

    const parsed =
      JSON.parse(saved);


    const progress = {

      ...defaults,

      ...parsed

    };


    if (!Array.isArray(progress.stamps)) {

      progress.stamps = [];

    }


    if (
      !progress.tasks ||
      typeof progress.tasks !== "object"
    ) {

      progress.tasks = {};

    }


    if (
      !progress.boards ||
      typeof progress.boards !== "object"
    ) {

      progress.boards = {};

    }


    if (
      !Number.isFinite(progress.cash)
    ) {

      progress.cash = 500;

    }


    if (
      !progress.properties ||
      typeof progress.properties !== "object" ||
      Array.isArray(progress.properties)
    ) {

      progress.properties = {};

    }


    return progress;

  }

  catch {

    return defaults;

  }

}



/* ==================================================
   SAVE PROGRESS
================================================== */

function saveGameProgress(progress) {

  localStorage.setItem(

    AIRPORT_EXPRESS.storageKey,

    JSON.stringify(progress)

  );

}



/* ==================================================
   RESET GAME
================================================== */

function resetGame() {

  const confirmReset =
    confirm(
      "Start a new Airport Express adventure?"
    );


  if (!confirmReset) {

    return;

  }


  localStorage.removeItem(
    AIRPORT_EXPRESS.storageKey
  );


  location.reload();

}



/* ==================================================
   CHECK STAMP
================================================== */

function hasStamp(destination) {

  const progress =
    getGameProgress();


  return progress.stamps.includes(
    destination
  );

}



/* ==================================================
   ADD PASSPORT STAMP
================================================== */

function addStamp(destination) {

  const progress =
    getGameProgress();


  if (
    !progress.stamps.includes(destination)
  ) {

    progress.stamps.push(
      destination
    );

  }


  saveGameProgress(progress);

}



/* ==================================================
   LOAD AIRPORT HUB
================================================== */

function loadAirport() {

  const progress =
    getGameProgress();


  const total =
    AIRPORT_EXPRESS.destinations.length;


  const completed =
    progress.stamps.length;


  const percentage =
    (completed / total) * 100;



  /* COUNTERS */

  const counter1 =
    document.getElementById(
      "stampCount"
    );


  const counter2 =
    document.getElementById(
      "stampCount2"
    );


  if (counter1) {

    counter1.textContent =
      completed + " / " + total;

  }


  if (counter2) {

    counter2.textContent =
      completed + " / " + total;

  }



  /* PROGRESS BAR */

  const bar =
    document.getElementById(
      "progressFill"
    );


  if (bar) {

    bar.style.width =
      percentage + "%";

  }



  /* MINI STAMPS */

  document
    .querySelectorAll(
      "[data-stamp]"
    )
    .forEach(
      stamp => {

        const id =
          stamp.dataset.stamp;


        if (
          progress.stamps.includes(id)
        ) {

          stamp.classList.add(
            "earned"
          );

        }

      }
    );



  /* PASSPORT */

  document
    .querySelectorAll(
      "[data-passport]"
    )
    .forEach(
      stamp => {

        const id =
          stamp.dataset.passport;


        if (
          progress.stamps.includes(id)
        ) {

          stamp.classList.add(
            "earned"
          );

        }

      }
    );



  /* DESTINATIONS / MAP STOPS */

  document
    .querySelectorAll(
      "[data-destination]"
    )
    .forEach(
      card => {

        const id =
          card.dataset.destination;

        const status =
          card.querySelector(
            ".destination-status, .map-stop-tag"
          );

        if (
          progress.stamps.includes(id)
        ) {
          if (status) {
            status.textContent =
              "STAMPED ✓";
          }

          card.classList.add(
            "stamped"
          );
        }

      }
    );



  /* FINAL MESSAGE */

  const finalMessage =
    document.getElementById(
      "finalMessage"
    );


  if (!finalMessage) {

    return;

  }


  if (
    completed === total
  ) {

    finalMessage.innerHTML =
      "🏆 <strong>Passport complete!</strong> You have completed every Airport Express destination.";

  }

  else {

    finalMessage.textContent =
      "Collect all six passport stamps to complete your journey.";

  }

}



/* ==================================================
   DESTINATION PAGE
================================================== */

function loadDestination(
  destination
) {

  const taskElements =
    Array.from(
      document.querySelectorAll(
        ".task"
      )
    );


  function refreshTasks() {

    const progress =
      getGameProgress();


    if (
      !progress.tasks[destination]
    ) {

      progress.tasks[destination] =
        [];

    }


    const completed =
      progress.tasks[destination];


    taskElements.forEach(
      (task,index) => {

        const button =
          task.querySelector(
            "button"
          );


        if (
          completed.includes(index)
        ) {

          task.classList.add(
            "done"
          );

          button.textContent =
            "Completed ✓";

        }

        else {

          task.classList.remove(
            "done"
          );

          button.textContent =
            "Complete";

        }

      }
    );


    const claimButton =
      document.getElementById(
        "claimStamp"
      );


    const message =
      document.getElementById(
        "stampMessage"
      );


    const allComplete =
      completed.length ===
      taskElements.length;


    if (
      hasStamp(destination)
    ) {

      claimButton.disabled =
        true;

      claimButton.textContent =
        "Passport Stamp Collected ✓";


      message.classList.add(
        "success"
      );


      message.textContent =
        "Passport stamped! Return to the Airport and choose your next destination.";

    }

    else {

      claimButton.disabled =
        !allComplete;


      if (
        allComplete
      ) {

        message.textContent =
          "All challenges complete! Your passport stamp is ready.";

      }

      else {

        message.textContent =
          "Complete all three challenges to unlock your passport stamp.";

      }

    }

  }



  /* TASK BUTTONS */

  taskElements.forEach(
    (task,index) => {

      const button =
        task.querySelector(
          "button"
        );


      button.addEventListener(
        "click",
        function () {

          const progress =
            getGameProgress();


          if (
            !progress.tasks[
              destination
            ]
          ) {

            progress.tasks[
              destination
            ] = [];

          }


          const tasks =
            progress.tasks[
              destination
            ];


          if (
            tasks.includes(index)
          ) {

            progress.tasks[
              destination
            ] =
              tasks.filter(
                item =>
                  item !== index
              );

          }

          else {

            tasks.push(index);

          }


          saveGameProgress(
            progress
          );


          refreshTasks();

        }
      );

    }
  );



  /* CLAIM STAMP */

  const claimButton =
    document.getElementById(
      "claimStamp"
    );


  claimButton.addEventListener(
    "click",
    function () {

      addStamp(
        destination
      );


      refreshTasks();

    }
  );


  refreshTasks();

}

/* =========================================================
   AIRPORT EXPRESS
   ISLAND BOARD ENGINE
========================================================= */

function loadIslandBoard(config) {

  const board =
    document.getElementById("islandBoard");

  const diceButton =
    document.getElementById("rollDice");

  const diceFace =
    document.getElementById("diceFace");

  const boardMessage =
    document.getElementById("boardMessage");

  const positionText =
    document.getElementById("positionText");

  const returnButton =
    document.getElementById("returnAirport");
     const dicePanel =
    diceButton.closest(
      ".dice-panel"
    );


  /* =====================================================
     PLAYER WALLET
  ====================================================== */

  const wallet =
    document.createElement("div");


  wallet.className =
    "player-wallet";


  dicePanel.insertBefore(
    wallet,
    diceFace
  );



  /* =====================================================
     PROPERTY BUY BUTTON
  ====================================================== */

  const propertyButton =
    document.createElement("button");


  propertyButton.type =
    "button";


  propertyButton.className =
    "property-buy-button";


  propertyButton.hidden =
    true;


  boardMessage.insertAdjacentElement(
    "afterend",
    propertyButton
  );


  let activeProperty =
    null;



  /* =====================================================
     BOARD PATH
     7 x 7 board
     24 spaces around outside
  ====================================================== */

  const pathPositions = [];


  /* TOP */

  for (let col = 1; col <= 7; col++) {

    pathPositions.push({
      row: 1,
      col: col
    });

  }


  /* RIGHT */

  for (let row = 2; row <= 7; row++) {

    pathPositions.push({
      row: row,
      col: 7
    });

  }


  /* BOTTOM */

  for (let col = 6; col >= 1; col--) {

    pathPositions.push({
      row: 7,
      col: col
    });

  }


  /* LEFT */

  for (let row = 6; row >= 2; row--) {

    pathPositions.push({
      row: row,
      col: 1
    });

  }



  /* =====================================================
     LOAD GAME PROGRESS
  ====================================================== */

  let progress =
    getGameProgress();


  if (!progress.boards) {

    progress.boards = {};

  }


  if (!progress.boards[config.id]) {

    progress.boards[config.id] = {

      position: 0,

      skipTurn: false,

      completed: false

    };

  }


  saveGameProgress(progress);


  let state =
    progress.boards[config.id];


  let rolling =
    false;
     /* =====================================================
     WALLET
  ====================================================== */

  function renderWallet() {

    const progress =
      getGameProgress();


    wallet.textContent =
      "💵 Cash: $" +
      progress.cash;

  }



  /* =====================================================
     PROPERTY ID
  ====================================================== */

  function getPropertyKey(
    space
  ) {

    return (
      config.id +
      ":" +
      space.property.id
    );

  }



  /* =====================================================
   PROPERTY ACTION
===================================================== */

function renderPropertyAction(
  space
) {

  activeProperty =
    null;


  propertyButton.hidden =
    true;


  propertyButton.disabled =
    false;


  if (
    !space ||
    !space.property
  ) {

    return;

  }


  const progress =
    getGameProgress();


  const key =
    getPropertyKey(
      space
    );


  const owned =
    progress.properties[
      key
    ];


  if (owned) {

    boardMessage.innerHTML += `

      <div class="property-owned">

        🏠 You own
        <strong>
          ${space.label}
        </strong>

      </div>

    `;


    return;

  }


  activeProperty =
    space;


  const price =
    space.property.price;


  propertyButton.hidden =
    false;


  if (
    progress.cash < price
  ) {

    propertyButton.disabled =
      true;


    propertyButton.textContent =
      "Need $" +
      price +
      " to buy " +
      space.label;

  }

  else {

    propertyButton.textContent =
      "🏙️ Buy " +
      space.label +
      " for $" +
      price;

  }

}



  /* =====================================================
     BUY PROPERTY
  ====================================================== */

  propertyButton.addEventListener(
    "click",
    function () {

      if (!activeProperty) {

        return;

      }


      const progress =
        getGameProgress();


      const key =
        getPropertyKey(
          activeProperty
        );


      if (
        progress.properties[key]
      ) {

        renderPropertyAction(
          activeProperty
        );

        return;

      }


      const price =
        activeProperty.property.price;


      if (
        progress.cash < price
      ) {

        renderPropertyAction(
          activeProperty
        );

        return;

      }


      progress.cash -=
        price;


      progress.properties[key] = {

        name:
          activeProperty.label,

        island:
          config.id,

        price:
          price,

        rent:
          activeProperty.property.rent || 0

      };


      saveGameProgress(
        progress
      );


      renderWallet();


      boardMessage.innerHTML = `

        🏙️

        <strong>
          ${activeProperty.label}
          purchased!
        </strong>

        <br>

        You paid $${price}.

      `;


      renderPropertyAction(
        activeProperty
      );

    }
  );


  renderWallet();



  /* =====================================================
     CREATE BOARD
  ====================================================== */

  board.innerHTML = "";



  pathPositions.forEach(
    (position, index) => {

      const space =
        document.createElement("div");


      space.className =
        "board-space";


      space.style.gridRow =
        position.row;


      space.style.gridColumn =
        position.col;


      space.dataset.index =
        index;



      const spaceData =
        config.spaces[index] || {

          label:
            "Travel",

          type:
            "normal"

        };


      space.classList.add(
        "space-" + spaceData.type
      );


      space.innerHTML = `

        <div class="space-number">
          ${index + 1}
        </div>

        <div class="space-icon">
          ${spaceData.icon || ""}
        </div>

        <div class="space-label">
          ${spaceData.label}
        </div>

      `;


      board.appendChild(space);

    }
  );



  /* =====================================================
     CENTRE OF BOARD
  ====================================================== */

  const boardCentre =
    document.createElement("div");


  boardCentre.className =
    "board-centre";


  boardCentre.innerHTML = `

    <div class="centre-icon">
      ${config.icon}
    </div>

    <div class="centre-small">
      AIRPORT EXPRESS
    </div>

    <h2>
      ${config.name}
    </h2>

    <p>
      Roll the dice and travel around the island.
    </p>

  `;


  board.appendChild(
    boardCentre
  );



  /* =====================================================
     PLAYER MARKER
  ====================================================== */

  const marker =
    document.createElement("div");


  marker.className =
    "player-marker";


  marker.innerHTML =
    config.marker || "🧳";


  board.appendChild(
    marker
  );



  /* =====================================================
     PLACE MARKER
  ====================================================== */

  function placeMarker() {

    const position =
      pathPositions[
        state.position
      ];


    marker.style.gridRow =
      position.row;


    marker.style.gridColumn =
      position.col;


    positionText.textContent =
      "Space " +
      (state.position + 1) +
      " of " +
      pathPositions.length;



    document
      .querySelectorAll(
        ".board-space"
      )
      .forEach(
        space => {

          space.classList.remove(
            "current-space"
          );

        }
      );


    const active =
      board.querySelector(
        '[data-index="' +
        state.position +
        '"]'
      );


    if (active) {

      active.classList.add(
        "current-space"
      );

    }

  }



  /* =====================================================
     SAVE BOARD POSITION
  ====================================================== */

  function saveBoard() {

    const progress =
      getGameProgress();


    if (!progress.boards) {

      progress.boards = {};

    }


    progress.boards[
      config.id
    ] = state;


    saveGameProgress(
      progress
    );

  }



  /* =====================================================
     MOVE MARKER ONE SPACE AT A TIME
  ====================================================== */

  async function moveTo(
    destination
  ) {

    destination =
      Math.min(
        destination,
        pathPositions.length - 1
      );


    while (
      state.position <
      destination
    ) {

      state.position++;

      placeMarker();

      saveBoard();


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            300
          )
      );

    }

  }



  /* =====================================================
     LANDING EVENT
  ====================================================== */

  async function landingEvent() {

    const space =
      config.spaces[
        state.position
      ];


    if (!space) {

      return;

    }


    boardMessage.innerHTML =
      "<strong>" +
      space.label +
      "</strong>" +
      (
        space.message
          ?
        "<br>" + space.message
          :
        ""
      );
         /* =================================================
       MONEY
    ================================================= */

    if (
      space.effect &&
      Number.isFinite(
        space.effect.money
      )
    ) {

      const progress =
        getGameProgress();


      progress.cash +=
        space.effect.money;


      saveGameProgress(
        progress
      );


      renderWallet();


      const amount =
        space.effect.money;


      boardMessage.innerHTML +=

        "<br><strong>" +

        (
          amount > 0
            ?
          "+$" + amount
            :
          "-$" + Math.abs(amount)
        )

        +

        "</strong>";

    }



    /* MOVE FORWARD / BACK */

    if (
      space.effect &&
      space.effect.move
    ) {

      let newPosition =
        state.position +
        space.effect.move;


      newPosition =
        Math.max(
          0,
          Math.min(
            newPosition,
            pathPositions.length - 1
          )
        );


      if (
        newPosition >
        state.position
      ) {

        await moveTo(
          newPosition
        );

      }

      else {

        state.position =
          newPosition;

        placeMarker();

        saveBoard();

      }

    }



    /* MISS NEXT TURN */

    if (
      space.effect &&
      space.effect.skip
    ) {

      state.skipTurn =
        true;

      saveBoard();

    }
   /* =================================================
   PROPERTY
   Check the square the player is NOW standing on
================================================= */

const finalSpace =
  config.spaces[
    state.position
  ];


renderPropertyAction(
  finalSpace
);


    /* FINISH */

    if (
      state.position ===
      pathPositions.length - 1
    ) {

      finishIsland();

    }

  }



  /* =====================================================
     FINISH ISLAND
  ====================================================== */

  function finishIsland() {

    state.completed =
      true;


    saveBoard();


    addStamp(
      config.id
    );


    diceButton.disabled =
      true;


    boardMessage.innerHTML = `

      🎉
      <strong>
        ${config.name} complete!
      </strong>

      <br>

      Your passport has been stamped.

    `;


    returnButton.classList.add(
      "show"
    );

  }



  /* =====================================================
     DICE
  ====================================================== */

  const diceCharacters = [

    "",

    "⚀",

    "⚁",

    "⚂",

    "⚃",

    "⚄",

    "⚅"

  ];



  async function rollDice() {

    if (rolling) {

      return;

    }


    if (state.completed) {

      return;

    }



    /* MISS TURN */

    if (state.skipTurn) {

      state.skipTurn =
        false;


      saveBoard();


      boardMessage.innerHTML = `

        ⏳
        <strong>
          Miss a turn!
        </strong>

        <br>

        Your next roll is now available.

      `;


      return;

    }



    rolling =
  true;


diceButton.disabled =
  true;


/* Clear previous property action */

activeProperty =
  null;

propertyButton.hidden =
  true;

propertyButton.disabled =
  false;


boardMessage.textContent =
  "Rolling...";



    /* DICE ANIMATION */

    for (
      let i = 0;
      i < 8;
      i++
    ) {

      const random =
        Math.floor(
          Math.random() * 6
        ) + 1;


      diceFace.textContent =
        diceCharacters[random];


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            80
          )
      );

    }



    const roll =
      Math.floor(
        Math.random() * 6
      ) + 1;


    diceFace.textContent =
      diceCharacters[roll];


    boardMessage.innerHTML = `

      You rolled
      <strong>
        ${roll}
      </strong>

    `;



    const destination =
      state.position +
      roll;


    await moveTo(
      destination
    );


    await landingEvent();


    if (!state.completed) {

      diceButton.disabled =
        false;

    }


    rolling =
      false;

  }



  diceButton.addEventListener(
    "click",
    rollDice
  );



  /* =====================================================
     INITIAL DISPLAY
  ====================================================== */

  placeMarker();


  if (state.completed) {

    diceButton.disabled =
      true;


    boardMessage.innerHTML = `

      ✅
      <strong>
        ${config.name} completed
      </strong>

      <br>

      Your passport stamp has already been collected.

    `;


    returnButton.classList.add(
      "show"
    );

  }

}
