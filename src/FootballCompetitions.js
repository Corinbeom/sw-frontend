import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FootballCompetitons.css';

function FootballCompetitions() {
    const [competitions, setCompetitions] = useState(null);
    const [matches, setMatches] = useState(null);
    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [showMatches, setShowMatches] = useState(false);
    const [showPastMatches, setShowPastMatches] = useState(false);
    const [groupedMatches, setGroupedMatches] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/football/competitions')
            .then(response => {
                setCompetitions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the competitions data!', error);
                setLoading(false);
            });
    }, []);

    const handleCompetitionClick = (competitionId) => {
        if (selectedCompetition === competitionId && showMatches) {
            setShowMatches(false);
            return;
        }
        setSelectedCompetition(competitionId);
        setShowMatches(true);
        setLoading(true);
        axios.get(`http://localhost:8080/football/competitions/${competitionId}/matches`)
            .then(response => {
                const matchesData = response.data;
                setMatches(matchesData);
                groupMatchesByMonth(matchesData.matches);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the matches data!', error);
                setLoading(false);
            });
    };

    const groupMatchesByMonth = (matches) => {
        const grouped = matches.reduce((acc, match) => {
            const matchDate = new Date(match.utcDate);
            const monthYear = `${matchDate.getMonth() + 1}-${matchDate.getFullYear()}`;

            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(match);
            return acc;
        }, {});
        setGroupedMatches(grouped);
    };

    const toggleShowPastMatches = () => {
        setShowPastMatches(!showPastMatches);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <img src="/loading.gif" alt="Loading..." className="loading-gif"/>
            </div>
        );
    }

    if (!competitions) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>리그 별 매치 ⚽️</h1>
            <div className="competitions-container">
                {competitions.competitions && competitions.competitions.map((comp) => (
                    <div key={comp.id} className="competition-card" onClick={() => handleCompetitionClick(comp.id)}>
                        <img src={comp.emblem || 'default-emblem.png'} alt={`${comp.name} emblem`} className="competition-emblem" />
                    </div>
                ))}
            </div>

            {showMatches && selectedCompetition && matches && (
                <div className="matches-section">
                    <h2>{matches.competition.name} Matches</h2>
                    <button onClick={toggleShowPastMatches} className="toggle-button">
                        {showPastMatches ? 'Hide Past Matches' : 'Show Past Matches'}
                    </button>
                    {Object.keys(groupedMatches).map(monthYear => (
                        <div key={monthYear} className="month-section">
                            <h3>{monthYear}</h3>
                            {groupedMatches[monthYear]
                                .filter(match => showPastMatches ? match.status === 'FINISHED' : match.status !== 'FINISHED')
                                .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
                                .map((match) => (
                                    <div key={match.id} className="match-card">
                                        <div className="teams-row">
                                            <div className="team home-team">
                                                <img src={match.homeTeam.crest || 'default-emblem.png'}
                                                     alt={`${match.homeTeam.name} emblem`} className="team-emblem"/>
                                                <h3>{match.homeTeam.name}</h3>
                                            </div>
                                            <div className="vs">vs</div>
                                            <div className="team away-team">
                                                <img src={match.awayTeam.crest || 'default-emblem.png'}
                                                     alt={`${match.awayTeam.name} emblem`} className="team-emblem"/>
                                                <h3>{match.awayTeam.name}</h3>
                                            </div>
                                        </div>
                                        <div className="match-date">
                                            경기 일자: {new Date(match.utcDate).toLocaleString()}
                                        </div>
                                        {match.status === 'FINISHED' && (
                                            <div className="match-result">
                                                결과: {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FootballCompetitions;
