// Dados em JSON (simulando resposta de API)
const gamificationData = {
    student: {
        name: "Caio Vieira",
        points: 750,
        badges: ["Top 5", "Entregou Tudo", "Criativo"],
    },
    ranking: [
        { position: 1, name: "Maria Souza", points: 1200 },
        { position: 2, name: "João Silva", points: 1100 },
        { position: 3, name: "Caio Vieira", points: 750 },
        { position: 4, name: "Ana Costa", points: 600 },
    ]
};

// Atualiza o perfil do aluno
document.getElementById("student-name").textContent = gamificationData.student.name;
document.getElementById("points").textContent = gamificationData.student.points;
document.getElementById("progress").style.width = `${(gamificationData.student.points / 1000) * 100}%`;

// Renderiza badges
const badgesContainer = document.getElementById("badges-container");
gamificationData.student.badges.forEach(badge => {
    const badgeElement = document.createElement("div");
    badgeElement.className = "badge";
    badgeElement.textContent = badge;
    badgesContainer.appendChild(badgeElement);
});

// Renderiza ranking
const rankingTable = document.querySelector("#ranking-table tbody");
gamificationData.ranking.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.position}</td>
        <td>${student.name}</td>
        <td>${student.points}</td>
    `;
    rankingTable.appendChild(row);
});