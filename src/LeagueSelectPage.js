import React from "react";
import { useNavigate } from "react-router-dom";

const LeagueSelectPage = () => {
    const navigate = useNavigate();

    const leagues = [
        { name: "EPL", emblem: "/emblems/epl-logo.png" },
        { name: "LaLiga", emblem: "/emblems/laliga-logo.png" },
        { name: "Bundesliga", emblem: "/emblems/bundes-logo.png" },
        { name: "Serie A", emblem: "/emblems/Serie-A-logo.png" },
        { name: "Ligue 1", emblem: "/emblems/Ligue1-logo.png" },
        { name: "K League", emblem: "/emblems/K-league-logo.png" },
    ];

    return (
        <div style={styles.container}>
            <h2>리그 선택</h2>
            <div style={styles.leagueContainer}>
                {leagues.map((league) => (
                    <div
                        key={league.name}
                        style={styles.leagueButton}
                        onClick={() => navigate(`/community/${league.name}`)}
                    >
                        <img src={league.emblem} alt={league.name} style={styles.leagueImage} />
                        <p>{league.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        marginTop: "20px",
    },
    leagueContainer: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
    },
    leagueButton: {
        cursor: "pointer",
        textAlign: "center",
        margin: "10px",
    },
    leagueImage: {
        width: "100px",
        height: "100px",
    },
};

export default LeagueSelectPage;
