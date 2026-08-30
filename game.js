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

  const saved =
    localStorage.getItem(
      AIRPORT_EXPRESS.storageKey
    );


  if (!saved) {

    return {

      stamps: [],

      tasks: {}

    };

  }


  try {

    return JSON.parse(saved);

  }

  catch {

    return {

      stamps: [],

      tasks: {}

    };

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



  /* DESTINATION CARDS */

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
            ".destination-status"
          );


        if (
          progress.stamps.includes(id)
        ) {

          status.textContent =
            "STAMPED ✓";

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
