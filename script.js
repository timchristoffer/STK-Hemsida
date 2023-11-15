document.addEventListener("DOMContentLoaded", function () {
    // Här hämtas olika HTML-element och tilldelas variabler för användning.
    const programForm = document.getElementById("programForm");
    const programList = document.getElementById("programList");
    const successMessage = document.getElementById("successMessage");
    const searchInput = document.getElementById("search-bar");
    let speaking = false;

    // Funktionen displayPrograms anropas för att visa befintliga program när sidan laddas in. 
    displayPrograms();

    // Funktion för att visa/dölja formuläret för att lägga till nytt TV-program.
    window.toggleProgramForm = function () {
        programForm.classList.toggle("hidden");
    };

    // Funktion för att lägga till nytt TV-program.
    window.submitProgram = function () {
        // Tar emot värden från användarinput. 
        const title = document.getElementById("programTitle").value;
        const description = document.getElementById("programDescription").value;
        let ageLimit = document.getElementById("ageLimit").value;

        // Kontrollera att åldersgränsen inte är över 18 år.
        ageLimit = Math.min(ageLimit, 18);

        // Hämtar användarens valda bild (om det finns en).
        const programImageInput = document.getElementById("programImage");
        const imageFile = programImageInput.files[0];

        // Skapar ett program-objekt med användarens inmatning.
        const program = {
            title: title,
            description: description,
            ageLimit: ageLimit,
        };

        // Lägger till bild-url om bild lagts till. 
        if (imageFile) {
            program.image = URL.createObjectURL(imageFile);
        }

        // Lägger till programmet i localStorage och visar ett "Lyckades"-meddelande.
        addProgramToLocalStorage(program);
        successMessage.classList.remove("hidden");
        programForm.reset();
        displayPrograms();

        // Döljer "Lyckades"-meddelandet efter 3 sekunder.
        setTimeout(function () {
            successMessage.classList.add("hidden");
        }, 3000);

        // Lägger till och tar bort CSS-klass för att skapa en fade-out effekt.
        successMessage.classList.remove("fade-out");
        void successMessage.offsetWidth;
        successMessage.classList.add("fade-out");
    };

    // Funktion för att lägga till ett program i localStorage.
    function addProgramToLocalStorage(program) {
        const programs = JSON.parse(localStorage.getItem("programs")) || [];
        programs.push(program);
        localStorage.setItem("programs", JSON.stringify(programs));
    }

    // Funktion för att skapa en "speak" knapp för varje program i programlistan.
    function createSpeakButton(index, title, description, ageLimit) {
        const button = document.createElement("button");
        button.classList.add("speakButton");
        button.innerHTML = `<i class='bx bx-volume' id='icon-${index}'></i>`;

        // Funktionen som körs när "speak" knappen klickas.
        button.onclick = function () {
            if (!speaking) {
                speakProgram(title, description, ageLimit);
                speaking = true;
            } else {
                window.speechSynthesis.cancel();
                speaking = false;
            }
        };
        return button;
    }

    // Funktion för att visa befintliga program som finns.
    function displayPrograms() {
        const programs = JSON.parse(localStorage.getItem("programs")) || [];
        const searchTerm = searchInput.value.toLowerCase();

        // Rensar programList innan man fyller på den med uppdaterad information.
        programList.innerHTML = "";

        programs.forEach(function (program, index) {
            // Skapar HTML-element för varje program. 
            const li = document.createElement("li");
            li.id = `program-${index}`;

            const titleElement = document.createElement("strong");
            titleElement.textContent = program.title;

            const descriptionElement = document.createElement("span");
            descriptionElement.classList.add("program-description");
            descriptionElement.textContent = program.description;

            const ageLimitElement = document.createElement("span");
            ageLimitElement.classList.add("program-age-label");
            ageLimitElement.textContent = "Åldersgräns: ";

            const ageValueElement = document.createElement("span");
            ageValueElement.classList.add("program-age");
            ageValueElement.textContent = program.ageLimit;

            // Lägger till bild om den finns.
            if (program.image) {
                const imageElement = document.createElement("img");
                imageElement.src = program.image;
                imageElement.alt = `${program.title} image`;
                li.appendChild(imageElement);
            }

            // Lägger till de skapade elementen i listan.
            li.appendChild(titleElement);
            li.appendChild(descriptionElement);
            li.appendChild(ageLimitElement);
            li.appendChild(ageValueElement);
            li.appendChild(createSpeakButton(index, program.title, program.description, program.ageLimit));

            // Lägger till programmet i listan.
            programList.appendChild(li);
        });

        // Visar eller döljer programlistan baserat på sökterm.
        programList.style.display = searchTerm ? "block" : "none";
    }

    // Funktion för att "speak" läser upp informationen om ett program.
    window.speakProgram = function (title, description, ageLimit) {
        const speechText = `Programtitel: ${title}. Beskrivning: ${description}. Åldersgräns: ${ageLimit} år.`;

        const utterance = new SpeechSynthesisUtterance(speechText);
        window.speechSynthesis.speak(utterance);

        // När "speak" är klart, sätter speaking till false.
        utterance.onend = function () {
            speaking = false;
        };
    };

    // Lyssnar på inmatning i sökfältet och uppdaterar programlistan.
    searchInput.addEventListener("input", displayPrograms);

    // Anropar GitHub API för att hämta och uppdatera "Senaste uppdateringen gjordes"-fliken.
    const repoOwner = 'timchristoffer';
    const repoName = 'STK-Hemsida';
    const branch = 'main';

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/branches/${branch}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Uppdaterar tidstampeln för senaste uppdateringen.
            const lastUpdatedElement = document.getElementById('updateTimestamp');
            const lastUpdatedDate = new Date(data.commit.commit.author.date);
            lastUpdatedElement.textContent = lastUpdatedDate.toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching GitHub data:', error);
        });
});

// Funktion för att rensa localStorage och ladda om sidan *Tagit bort knapp men har kvar kod*.
function clearLocalstorage() {
    localStorage.clear();
    location.reload();
}
