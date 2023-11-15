document.addEventListener("DOMContentLoaded", function () {
  const programForm = document.getElementById("programForm");
  const programList = document.getElementById("programList");
  const successMessage = document.getElementById("successMessage");
  const searchInput = document.getElementById("search-bar");

  displayPrograms();

  window.toggleProgramForm = function () {
      programForm.classList.toggle("hidden");
  };

  window.submitProgram = function () {
      const title = document.getElementById("programTitle").value;
      const description = document.getElementById("programDescription").value;
      let ageLimit = document.getElementById("ageLimit").value;

      // Begränsa åldersgränsen till högst 18
      ageLimit = Math.min(ageLimit, 18);

      if (title && description && ageLimit) {
          const program = {
              title: title,
              description: description,
              ageLimit: ageLimit,
          };

          addProgramToLocalStorage(program);

          successMessage.classList.remove("hidden");

          programForm.reset();

          displayPrograms();
      }
  };

  function addProgramToLocalStorage(program) {
      const programs = JSON.parse(localStorage.getItem("programs")) || [];

      programs.push(program);

      localStorage.setItem("programs", JSON.stringify(programs));
  }

  function createSpeakButton(index, title, description, ageLimit) {
      const button = document.createElement("button");
      button.classList.add("speakButton");
      button.innerHTML = `<i class='bx bx-volume' id='icon-${index}'></i>`;
      button.onclick = function () {
          speakProgram(title, description, ageLimit);
      };
      return button;
  }

  function displayPrograms() {
      const programs = JSON.parse(localStorage.getItem("programs")) || [];
      const searchTerm = searchInput.value.toLowerCase();

      programList.innerHTML = "";

      programs.forEach(function (program, index) {
          const programInfo = `${program.title} ${program.description} ${program.ageLimit}`;
          const lowerCaseProgramInfo = programInfo.toLowerCase();

          if (!searchTerm || lowerCaseProgramInfo.includes(searchTerm)) {
              const li = document.createElement("li");
              li.id = `program-${index}`;
              li.innerHTML = `
                  <strong>${program.title}</strong>
                  <span class="program-description">${program.description}</span>
                  <span class="program-age-label">Åldersgräns: </span>
                  <span class="program-age">${program.ageLimit}</span>
              `;
              li.appendChild(createSpeakButton(index, program.title, program.description, program.ageLimit));
              programList.appendChild(li);
          }
      });

      programList.style.display = searchTerm ? "block" : "none";
  }

  window.speakProgram = function (title, description, ageLimit) {
      const speechText = `Programtitel: ${title}. Beskrivning: ${description}. Åldersgräns: ${ageLimit} år.`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      window.speechSynthesis.speak(utterance);
  };

  searchInput.addEventListener("input", displayPrograms);
});

function clearLocalStorage() {
  localStorage.clear();
  console.log("Local Storage rensad.");
}

document.addEventListener("DOMContentLoaded", function () {
  const repoOwner = 'timchristoffer';
  const repoName = 'STK-Hemsida';
  const branch = 'main';

  const apiUrl = `https://api.github.com/repos/${timchristoffer}/${STK-Hemsida}/branches/${main}`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          const lastUpdatedElement = document.getElementById('updateTimestamp');
          const lastUpdatedDate = new Date(data.commit.commit.author.date);
          lastUpdatedElement.textContent = lastUpdatedDate.toLocaleString();
      })
      .catch(error => {
          console.error('Error fetching GitHub data:', error);
      });
});
  