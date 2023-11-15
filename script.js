document.addEventListener("DOMContentLoaded", function () {
    const programForm = document.getElementById("programForm");
    const programList = document.getElementById("programList");
    const successMessage = document.getElementById("successMessage");
    const searchInput = document.getElementById("search-bar");
    let speaking = false;

    displayPrograms();

    window.toggleProgramForm = function () {
        programForm.classList.toggle("hidden");
    };

    window.submitProgram = function () {
        const title = document.getElementById("programTitle").value;
        const description = document.getElementById("programDescription").value;
        let ageLimit = document.getElementById("ageLimit").value;

        ageLimit = Math.min(ageLimit, 18);

        const programImageInput = document.getElementById("programImage");
        const imageFile = programImageInput.files[0]; // Get the image file

        if (title && description && ageLimit && imageFile) {
            // You can handle the image file as needed
            console.log("Uploaded image file:", imageFile);

            const program = {
                title: title,
                description: description,
                ageLimit: ageLimit,
                image: URL.createObjectURL(imageFile), // Create a URL for the uploaded image
            };

            addProgramToLocalStorage(program);

            successMessage.classList.remove("hidden");

            programForm.reset();

            displayPrograms();

            setTimeout(function () {
                successMessage.classList.add("hidden");
            }, 3000);

            successMessage.classList.remove("fade-out");
            void successMessage.offsetWidth;
            successMessage.classList.add("fade-out");
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
                    <img src="${program.image}" alt="${program.title} image">
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

        utterance.onend = function () {
            speaking = false;
        };
    };

    searchInput.addEventListener("input", displayPrograms);

    const repoOwner = 'timchristoffer';
    const repoName = 'STK-Hemsida';
    const branch = 'main';

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/branches/${branch}`;

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

function clearLocalstorage() {
    localStorage.clear();
    location.reload();
}
