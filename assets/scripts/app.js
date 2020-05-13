const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 10;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";

let battleLog = [];

function getMaxLife() {
    const enteredValue = prompt("Maximum life for you and monster");

    let parseValue = parseInt(enteredValue);

    if (isNaN(parseValue) || parseValue <= 0) {
        throw {
            message: "Invalid user input, not a number"
        };
    }
    return parseValue;
}
let chosenMaxLife;
try {
    chosenMaxLife = getMaxLife();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
    };
    if (event === LOG_EVENT_PLAYER_ATTACK) {
        logEntry.target = "MONSTER";
    } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
        logEntry.target = "MONSTER";
    } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
        logEntry.target = "PLAYER";
    } else if (ev === LOG_EVENT_GAME_OVER) {
        battleLog.push(logEntry);
        return;
    }
    battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    let initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but the bonus life saved you!");
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("Hurry!! You WON!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "PLAYER WON",
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("Ops! You Lost!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "MONSTER WON",
            currentMonsterHealth,
            currentPlayerHealth
        );
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("Match Tie!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "MATCH TIE",
            currentMonsterHealth,
            currentPlayerHealth
        );
    }
    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
        reset();
        alert("GAME OVER!");
    }
}

function attackMonster(attackMode) {
    let maxDamage;
    let logEvent;

    if (attackMode === MODE_ATTACK) {
        maxDamage = ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if (attackMode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }

    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;
    writeToLog(
        logEvent,
        monsterDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healHandler() {
    let healValue;

    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("You can't heal more than your initial max health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }

    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function logHandler() {
    for (let i = 0; i < 3; i++) {
        console.log("----------");
    }

    let i = 0;
    for (const logEntry of battleLog) {
        console.log(`${i}`);
        for (const key in logEntry) {
            console.log(`${key} => ${logEntry[key]}`);
        }
        i++;
    }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", logHandler);