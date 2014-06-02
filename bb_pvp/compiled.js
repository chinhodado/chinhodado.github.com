var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AfflictionFactory = (function () {
    function AfflictionFactory() {
    }
    AfflictionFactory.getAffliction = function (type) {
        switch (type) {
            case 7 /* BLIND */:
                return new BlindAffliction();
            case 4 /* DISABLE */:
                return new DisabledAffliction();
            case 3 /* FROZEN */:
                return new FrozenAffliction();
            case 2 /* PARALYSIS */:
                return new ParalysisAffliction();
            case 1 /* POISON */:
                return new PoisonAffliction();
            case 5 /* SILENT */:
                return new SilentAffliction();
            default:
                throw new Error("Invalid affliction type!");
        }
    };
    return AfflictionFactory;
})();

var Affliction = (function () {
    function Affliction(type) {
        this.type = type;
        this.finished = false;
    }
    Affliction.prototype.canAttack = function () {
        // implement this
        return false;
    };

    Affliction.prototype.canUseSkill = function () {
        return this.canAttack();
    };

    Affliction.prototype.canMiss = function () {
        return false;
    };

    Affliction.prototype.update = function (card) {
        // implement this
    };

    Affliction.prototype.add = function (optParam, optParam2) {
        // implement this
    };

    Affliction.prototype.isFinished = function () {
        return this.finished;
    };

    Affliction.prototype.clear = function () {
        this.finished = true;
    };

    Affliction.prototype.getType = function () {
        return this.type;
    };
    return Affliction;
})();

var PoisonAffliction = (function (_super) {
    __extends(PoisonAffliction, _super);
    function PoisonAffliction() {
        _super.call(this, 1 /* POISON */);
        this.percent = 0;
        this.finished = false;
    }
    PoisonAffliction.prototype.canAttack = function () {
        return true;
    };

    PoisonAffliction.prototype.update = function (card) {
        var damage = Math.floor(card.getHP() * this.percent / 100);
        if (damage > PoisonAffliction.MAX_DAMAGE) {
            damage = PoisonAffliction.MAX_DAMAGE;
        }
        // damage the card here
    };

    PoisonAffliction.prototype.add = function (percent) {
        if (!percent) {
            percent = PoisonAffliction.DEFAULT_PERCENT;
        }
        this.percent += percent;

        var maxPercent = percent * PoisonAffliction.MAX_STACK_NUM;
        if (this.percent > maxPercent) {
            this.percent = maxPercent;
        }
    };
    PoisonAffliction.DEFAULT_PERCENT = 5;
    PoisonAffliction.MAX_STACK_NUM = 2;
    PoisonAffliction.MAX_DAMAGE = 99999;
    return PoisonAffliction;
})(Affliction);

var ParalysisAffliction = (function (_super) {
    __extends(ParalysisAffliction, _super);
    function ParalysisAffliction() {
        _super.call(this, 2 /* PARALYSIS */);
    }
    ParalysisAffliction.prototype.canAttack = function () {
        return this.isFinished();
    };

    ParalysisAffliction.prototype.update = function () {
        this.clear();
    };
    return ParalysisAffliction;
})(Affliction);

var FrozenAffliction = (function (_super) {
    __extends(FrozenAffliction, _super);
    function FrozenAffliction() {
        _super.call(this, 3 /* FROZEN */);
    }
    FrozenAffliction.prototype.canAttack = function () {
        return this.isFinished();
    };

    FrozenAffliction.prototype.update = function () {
        this.clear();
    };
    return FrozenAffliction;
})(Affliction);

var DisabledAffliction = (function (_super) {
    __extends(DisabledAffliction, _super);
    function DisabledAffliction() {
        _super.call(this, 4 /* DISABLE */);
    }
    DisabledAffliction.prototype.canAttack = function () {
        return this.isFinished();
    };

    DisabledAffliction.prototype.update = function () {
        this.clear();
    };
    return DisabledAffliction;
})(Affliction);

var SilentAffliction = (function (_super) {
    __extends(SilentAffliction, _super);
    function SilentAffliction() {
        _super.call(this, 5 /* SILENT */);
        this.validTurnNum = 0;
    }
    SilentAffliction.prototype.canAttack = function () {
        return true;
    };

    SilentAffliction.prototype.canUseSkill = function () {
        return this.isFinished();
    };

    SilentAffliction.prototype.update = function () {
        if (--this.validTurnNum <= 0) {
            this.clear();
        }
    };

    SilentAffliction.prototype.add = function (turnNum) {
        this.validTurnNum = turnNum;
    };
    return SilentAffliction;
})(Affliction);

var BlindAffliction = (function (_super) {
    __extends(BlindAffliction, _super);
    function BlindAffliction() {
        _super.call(this, 7 /* BLIND */);
        this.missProb = 0;
        this.finished = false;
        this.validTurnNum = 0;
    }
    BlindAffliction.prototype.canAttack = function () {
        return true;
    };

    BlindAffliction.prototype.canMiss = function () {
        return Math.random() <= this.missProb;
    };

    BlindAffliction.prototype.update = function () {
        if (--this.validTurnNum <= 0) {
            this.clear();
        }
    };

    BlindAffliction.prototype.add = function (turnNum, missProb) {
        this.validTurnNum = turnNum;
        this.missProb = missProb;
    };
    return BlindAffliction;
})(Affliction);
/// <reference path="../lib/svgjs.d.ts"/>
/**
* Handle the logging and displaying of information
*/
var BattleLogger = (function () {
    function BattleLogger() {
        // an array of arrays of MinorEvent objects, describing the things that happened under that major event
        this.minorEventLog = [];
        // just an array of strings
        this.majorEventLog = [];
        this.currentTurn = 0;
        // holds the coordinates of the bullets of the formation
        this.coordArray = {
            1: [],
            2: []
        };
        this.IMAGE_WIDTH_BIG = 120;
        // an array of groups of card images and hpbar
        this.cardImageGroups = [];
        if (BattleLogger._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        BattleLogger._instance = this;
    }
    BattleLogger.getInstance = function () {
        if (BattleLogger._instance === null) {
            BattleLogger._instance = new BattleLogger();
        }
        return BattleLogger._instance;
    };

    /**
    * Allows to create a new instance
    * Used for testing only
    */
    BattleLogger.removeInstance = function () {
        BattleLogger._instance = null;
    };

    /**
    * Display a major event on screen (the left side list)
    */
    BattleLogger.prototype.displayMajorEvent = function (index) {
        var data = this.majorEventLog[index];
        var id = "turn" + this.currentTurn + "events";
        var battleEventDiv = document.getElementById("battleEventDiv");
        var turnEventList = document.getElementById(id);

        // if not already exist, create it
        if (!turnEventList) {
            turnEventList = document.createElement("ul");
            turnEventList.setAttribute("id", id);
            battleEventDiv.appendChild(turnEventList);
        }

        var newEvent = document.createElement("li");
        newEvent.innerHTML = "<a>" + data.description + "</a>";
        newEvent.setAttribute("tabindex", index + "");
        newEvent.setAttribute("id", index + "");

        // populate right section with the field situation
        newEvent.onfocus = function () {
            BattleLogger.getInstance().displayEventLogAtIndex(this.id);
        };
        turnEventList.appendChild(newEvent);
    };

    /**
    * Use this to log a major event: a normal attack, a proc, etc. Can also be
    * thought of as logging the main action in a fam's turn. The data to log here
    * is just a string, there's no actual data change associated with a major event
    */
    BattleLogger.prototype.addMajorEvent = function (data) {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        this.majorEventLog.push(data);
        this.displayMajorEvent(this.majorEventLog.length - 1);
    };

    /**
    * Log a new turn
    */
    BattleLogger.prototype.bblogTurn = function (data) {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        var battleEventDiv = document.getElementById("battleEventDiv");
        var newEvent = document.createElement("p");
        newEvent.innerHTML = data;
        battleEventDiv.appendChild(newEvent);
    };

    /**
    * Display a minor event on screen
    */
    BattleLogger.prototype.displayMinorEvent = function (data) {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        var id = "turn" + this.currentTurn + "events";

        // the list of events of this turn
        // assume that it has already been created
        var turnEventList = document.getElementById(id);

        // a <li>, the last "major" event that occurred in this turn, like when a fam procs
        var lastEvent = turnEventList.lastChild;

        // the <ul> nested inside the above <li>, the sub event list
        var subEventList = lastEvent.getElementsByClassName("ul")[0];

        // if not already exist, create it
        if (!subEventList) {
            subEventList = document.createElement("ul");

            // TODO: maybe give it an id
            lastEvent.appendChild(subEventList);
        }

        // new list item for the sub event, and append it to the sub event list
        var newEvent = document.createElement("li");
        newEvent.innerHTML = "<a>" + data + "</a>";
        subEventList.appendChild(newEvent);
    };

    /**
    * Apply an event to the supplied data
    */
    BattleLogger.prototype.applyMinorEvent = function (event, toApply) {
        // get the card
        var card;
        for (var i = 0; i < 5; i++) {
            if (toApply.player1Cards[i].id == event.targetId) {
                card = toApply.player1Cards[i];
                break;
            }
            if (toApply.player2Cards[i].id == event.targetId) {
                card = toApply.player2Cards[i];
                break;
            }
        }

        if (event.type == 1 /* HP */) {
            if (event.attribute != "HP") {
                throw new Error("Invalid MinorEvent!");
            }
            card.stats.hp += event.amount;
        } else if (event.type == 2 /* STATUS */) {
            switch (ENUM.StatusType[event.attribute]) {
                case 1 /* ATK */:
                    card.status.atk += event.amount;
                    break;
                case 2 /* DEF */:
                    card.status.def += event.amount;
                    break;
                case 3 /* WIS */:
                    card.status.wis += event.amount;
                    break;
                case 4 /* AGI */:
                    card.status.agi += event.amount;
                    break;
                case 5 /* ATTACK_RESISTANCE */:
                    card.status.attackResistance = event.amount;
                    break;
                case 6 /* MAGIC_RESISTANCE */:
                    card.status.magicResistance = event.amount;
                    break;
                case 7 /* BREATH_RESISTANCE */:
                    card.status.breathResistance = event.amount;
                    break;
                case 8 /* SKILL_PROBABILITY */:
                    card.status.skillProbability = event.amount;
                    break;
                default:
                    throw new Error("Unknown status attribute");
                    break;
            }
        } else if (event.type == 3 /* AFFLICTION */) {
            if (event.amount == 0) {
                card.affliction = null;
                return;
            }
            switch (event.attribute) {
                case "BLIND":
                    card.affliction = { type: "Blind", duration: event.amount };
                    break;
                case "DISABLE":
                    card.affliction = { type: "Disable", duration: event.amount };
                    break;
                case "FROZEN":
                    card.affliction = { type: "Frozen", duration: event.amount };
                    break;
                case "PARALYSIS":
                    card.affliction = { type: "Paralyzed", duration: event.amount };
                    break;
                case "POISON":
                    card.affliction = { type: "Poison", duration: event.amount };
                    break;
                case "SILENT":
                    card.affliction = { type: "Silent", duration: event.amount };
                    break;
                case "NONE":
                    card.affliction = null;
                    break;
                default:
                    throw new Error("Invalid affliction type!");
            }
        }
    };

    /**
    * --- This function is a clusterfuck. I apologize if you are reading this, especially to myself in the future. ---
    *
    * This is called when you click on an event in the event list. It updates the field on the right side
    * of the screen with information after the event that you clicked on has been processed. That event
    * is represented by the index argument supplied into this function.
    */
    BattleLogger.prototype.displayEventLogAtIndex = function (index) {
        // display turn animation
        this.displayTurnAnimation(index);

        // first deserialize the initial field info into a nice object that we will modify later
        var initialField = JSON.parse(this.initialFieldInfo);

        for (var i = 0; i <= index; i++) {
            for (var j = 0; this.minorEventLog[i] && j < this.minorEventLog[i].length; j++) {
                this.applyMinorEvent(this.minorEventLog[i][j], initialField);
            }
        }

        for (var player = 1; player <= 2; player++) {
            var playerCards = initialField["player" + player + "Cards"];
            for (var fam = 0; fam < 5; fam++) {
                var stats = playerCards[fam].stats;
                var originalStats = playerCards[fam].originalStats;
                var status = playerCards[fam].status;
                var afflict = playerCards[fam].affliction;

                var htmlelem = document.getElementById("player" + player + "Fam" + fam);

                // the stats of the fam after the buffs/debuffs are added in
                var addedATK = stats.atk + status.atk;
                var addedDEF = stats.def + status.def;
                var addedWIS = stats.wis + status.wis;
                var addedAGI = stats.agi + status.agi;

                var infoText = {
                    name: playerCards[fam].name,
                    hp: "HP: " + stats.hp,
                    atk: "ATK: " + addedATK,
                    def: "DEF: " + addedDEF,
                    wis: "WIS: " + addedWIS,
                    agi: "AGI: " + addedAGI
                };

                if (status.attackResistance != 0) {
                    infoText.physicalResist = "PW: " + status.attackResistance;
                }

                if (status.magicResistance != 0) {
                    infoText.magicalResist = "MW: " + status.magicResistance;
                }

                if (status.breathResistance != 0) {
                    infoText.breathResist = "BW: " + status.breathResistance;
                }

                if (afflict) {
                    infoText.affliction = "Affliction: " + afflict.type + " (" + afflict.duration + " turn)";
                }

                for (var j = 0; this.minorEventLog[index] && j < this.minorEventLog[index].length; j++) {
                    var tempEvent = this.minorEventLog[index][j];
                    if (tempEvent.targetId == playerCards[fam].id) {
                        if (tempEvent.type == 1 /* HP */) {
                            if (tempEvent.attribute == "HP") {
                                infoText.hp = this.decorateText(infoText.hp, tempEvent.amount < 0);
                            } else
                                throw new Error("Invalid event attribute");
                        } else if (tempEvent.type == 2 /* STATUS */) {
                            if (tempEvent.attribute == "HP") {
                                infoText.hp = this.decorateText(infoText.hp, tempEvent.amount < 0);
                            } else if (tempEvent.attribute == "ATK") {
                                infoText.atk = this.decorateText(infoText.atk, tempEvent.amount < 0);
                            } else if (tempEvent.attribute == "DEF") {
                                infoText.def = this.decorateText(infoText.def, tempEvent.amount < 0);
                            } else if (tempEvent.attribute == "WIS") {
                                infoText.wis = this.decorateText(infoText.wis, tempEvent.amount < 0);
                            } else if (tempEvent.attribute == "AGI") {
                                infoText.agi = this.decorateText(infoText.agi, tempEvent.amount < 0);
                            } else if (tempEvent.attribute == "ATTACK_RESISTANCE") {
                                infoText.physicalResist = this.decorateText(infoText.physicalResist, false);
                            } else if (tempEvent.attribute == "MAGIC_RESISTANCE") {
                                infoText.magicalResist = this.decorateText(infoText.magicalResist, false);
                            } else if (tempEvent.attribute == "BREATH_RESISTANCE") {
                                infoText.breathResist = this.decorateText(infoText.breathResist, false);
                            }
                        } else if (tempEvent.type == 3 /* AFFLICTION */) {
                            if (tempEvent.attribute != "NONE") {
                                infoText.affliction = this.decorateText(infoText.affliction, false);
                            }
                        }
                    }
                }

                if (this.minorEventLog[index] && this.minorEventLog[index][0].executorId == playerCards[fam].id) {
                    infoText.name = "<b>" + infoText.name + "</b>";
                }

                htmlelem.innerHTML = infoText.name + "<br>" + infoText.hp + "<br>" + infoText.atk + "<br>" + infoText.def + "<br>" + infoText.wis + "<br>" + infoText.agi + (infoText.physicalResist ? ("<br>" + infoText.physicalResist) : "") + (infoText.magicalResist ? ("<br>" + infoText.magicalResist) : "") + (infoText.breathResist ? ("<br>" + infoText.breathResist) : "") + (infoText.affliction ? ("<br>" + infoText.affliction) : "");

                // display hp on canvas
                this.displayHPOnCanvas(stats.hp / originalStats.hp * 100, player, fam);

                // display dead or alive familiar
                this.displayDeadAliveFamiliar(player, fam, stats.hp <= 0);
            }
        }
    };

    /**
    * Decorate a string by bolding it and make it red or green
    * @param text the text to decorate
    * @param isNegative true if you want the text to be red, false if green
    */
    BattleLogger.prototype.decorateText = function (text, isNegative) {
        var openTag;
        if (isNegative) {
            openTag = "<span style='color:red'><b>";
        } else {
            openTag = "<span style='color:green'><b>";
        }
        return openTag + text + "</b></span>";
    };

    /**
    * Add a minor event to our minor event log.
    * @param executor    whom the action in this event comes from
    * @param target      the one affected in this event
    * @param type        the type of this event
    * @param attribute   the thing belonging to the target that has been changed in this event
    * @param amount      the amount changed
    * @param description a description in plain text of what happened
    * @param skillId     the skill involved in this event
    */
    BattleLogger.prototype.addMinorEvent = function (executor, target, type, attribute, amount, description, skillId) {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        var index = this.majorEventLog.length - 1;

        if (!this.minorEventLog[index]) {
            this.minorEventLog[index] = [];
        }
        this.minorEventLog[index].push({
            executorId: executor.id,
            targetId: target.id,
            type: type,
            attribute: attribute,
            amount: amount,
            description: description,
            skillId: skillId
        });
        this.displayMinorEvent(description);
    };

    /**
    * Save the initial situation of the field
    * For now it just saves the cards of the two players
    */
    BattleLogger.prototype.saveInitialField = function () {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        // save a log of the current field situation
        var toSerialize = {
            player1Cards: getSerializableObjectArray(BattleModel.getInstance().player1Cards),
            player2Cards: getSerializableObjectArray(BattleModel.getInstance().player2Cards)
        };

        this.initialFieldInfo = JSON.stringify(toSerialize);
    };

    /**
    * Display the two players' formations and their familiars on their canvas
    */
    BattleLogger.prototype.displayFormationAndFamOnCanvas = function () {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        var playerFormations = {};
        playerFormations[1] = BattleModel.getInstance().player1.formation.getFormationConfig(); // player1's formation

        // reverse player2's formation for display purpose
        var player2formation = BattleModel.getInstance().player2.formation.getFormationConfig();
        var temp = [];
        var tempNumber;
        for (var i = 0; i < 5; i++) {
            switch (player2formation[i]) {
                case 1:
                    tempNumber = 3;
                    break;
                case 2:
                    tempNumber = 2;
                    break;
                case 3:
                    tempNumber = 1;
                    break;
            }
            temp.push(tempNumber);
        }
        playerFormations[2] = temp;

        for (var player = 1; player <= 2; player++) {
            // todo: set the svg size dynamically
            var draw = SVG('svg' + player).size(600, 300).attr('id', 'player' + player + 'svg').attr('class', 'svg');

            // draw the skill name background, don't show them yet
            if (player == 2) {
                var skillImg = draw.image('img/skillBg.png', 300, 29).move(55, 5).attr('id', 'p2SkillBg');
                var text = draw.text('placeholder').font({ size: 14 }).fill({ color: '#fff' }).attr('id', 'p2SkillText');
                draw.group().attr('id', 'p2SkillBgTextGroup').add(skillImg).add(text).opacity(0);
            } else if (player == 1) {
                var skillImg = draw.image('img/skillBg.png', 300, 29).move(55, 270).attr('id', 'p1SkillBg');
                var text = draw.text('placeholder').font({ size: 14 }).fill({ color: '#fff' }).attr('id', 'p1SkillText');
                draw.group().attr('id', 'p1SkillBgTextGroup').add(skillImg).add(text).opacity(0);
            }

            // as I'm writing this comment, I don't know myself what these number are. Just know that change them
            // will change the "compactity" of the formation. Forgive me...
            var PLAYER_GROUP_WIDTH = 350;
            var PLAYER_GROUP_HEIGHT = 80;

            var horizontalStep = PLAYER_GROUP_WIDTH / 10;
            var verticalStep = PLAYER_GROUP_HEIGHT / 2;

            var coordArray = [];
            this.coordArray[player] = coordArray;

            // a svg group for everything belonging to that player: fam image, hp, formation, etc.
            var groupPlayer = draw.group().attr('id', 'p' + player + 'group');

            for (var i = 0; i < 5; i++) {
                var bulletX = ((i + 1) * 2 - 1) * horizontalStep;
                var bulletY = (playerFormations[player][i] - 1) * verticalStep;

                coordArray.push([bulletX, bulletY]);
            }

            for (var i = 0; i < 5; i++) {
                var diameter = 10;
                var dot = draw.circle(diameter).move(coordArray[i][0] - diameter / 2, coordArray[i][1] - diameter / 2);
                groupPlayer.add(dot);
            }

            for (var i = 0; i < 4; i++) {
                var line = draw.line(coordArray[i][0], coordArray[i][1], coordArray[i + 1][0], coordArray[i + 1][1]).stroke({ width: 1 });
                groupPlayer.add(line);
            }

            // grab the image links of the curent player's fam
            var imageLinksArray = [];
            var initialField = JSON.parse(this.initialFieldInfo);
            var playerCards = initialField["player" + player + "Cards"];

            for (var fam = 0; fam < 5; fam++) {
                imageLinksArray.push(getScaledWikiaImageLink(playerCards[fam].imageLink, this.IMAGE_WIDTH_BIG));
            }

            for (var i = 0; i < 5; i++) {
                // the x coordinate is 1/2 image width to the left of the bullet
                var image_x_coord = coordArray[i][0] - BattleLogger.IMAGE_WIDTH / 2;

                // the y coordinate is 1/2 image height above the bullet
                var image_y_coord = coordArray[i][1] - BattleLogger.IMAGE_WIDTH * 1.5 / 2;

                var image = draw.image(imageLinksArray[i]).move(image_x_coord, image_y_coord).attr('id', 'player' + player + 'fam' + i + 'image').loaded(function (loader) {
                    this.size(BattleLogger.IMAGE_WIDTH);
                });

                // make a svg group for the image + hp bar
                var group = draw.group();
                group.add(image).attr('id', 'player' + player + 'fam' + i + 'group');
                this.cardImageGroups.push(group);
                groupPlayer.add(group);
            }
            groupPlayer.move(30, 100);
        }
    };

    BattleLogger.prototype.displayHPOnCanvas = function (percent, player, index) {
        var draw = SVG.get('player' + player + 'svg');

        // the x coordinate is 1/2 image width to the left of the bullet
        var image_x_coord = this.coordArray[player][index][0] - BattleLogger.IMAGE_WIDTH / 2;

        // the y coordinate is 1/2 image height above the bullet
        var image_y_coord = this.coordArray[player][index][1] - BattleLogger.IMAGE_WIDTH * 1.5 / 2;

        var xstart = Math.round(image_x_coord);

        // display hp on bottom of the fam
        var ystart = image_y_coord + BattleLogger.IMAGE_WIDTH * 1.5;

        var width = BattleLogger.IMAGE_WIDTH;
        var height = 5;

        if (percent < 0) {
            percent = 0; // health can't be less than 0
        }

        // first draw the (empty) hp bar
        // try to get the bar if it exist, or create if not
        var hpbarId = 'player' + player + 'fam' + index + 'hp';
        var hpbar = SVG.get(hpbarId);

        if (!hpbar) {
            hpbar = draw.rect(width, height).style({ 'stroke-width': 1, 'stroke': '#000000' }).attr('id', hpbarId).move(xstart, ystart);
            var groupId = 'player' + player + 'fam' + index + 'group';

            // add the hpbar to the group
            var group = SVG.get(groupId);
            group.add(hpbar);
        }

        // now we deal with the background gradient used for displaying the HP
        var hpGradientId = 'player' + player + 'fam' + index + 'hpGradient';
        var hpGradient = SVG.get(hpGradientId);

        if (!hpGradient) {
            // draw for full HP
            hpGradient = draw.gradient('linear', function (stop) {
                stop.at({ offset: '100%', color: '#00ff00' }).attr('id', 'p' + player + 'f' + index + 'hpgs1');
                stop.at({ offset: '100%', color: 'transparent' }).attr('id', 'p' + player + 'f' + index + 'hpgs2');
            }).attr('id', hpGradientId);
        } else {
            var s1 = SVG.get('p' + player + 'f' + index + 'hpgs1');
            var s2 = SVG.get('p' + player + 'f' + index + 'hpgs2');
            s1.animate('1s').update({ offset: percent + '%' });
            s2.animate('1s').update({ offset: percent + '%' });
        }

        hpbar.fill(hpGradient);
    };

    BattleLogger.prototype.displayDeadAliveFamiliar = function (player, fam, isDead) {
        var image = SVG.get('player' + player + 'fam' + fam + 'image');
        var filter = SVG.get('darkenFilter');
        if (isDead) {
            if (!filter) {
                // If the filter does not exist yet, create it
                // I don't know how to create a standalone filter for reuse
                // later, so I have to use this roundabout way. First set
                // the filter to the image:
                image.filter(function (add) {
                    add.componentTransfer({
                        rgb: { type: 'linear', slope: 0.05 }
                    });
                });

                // now grab the filter from the image, and give it the id
                filter = image.filterer;
                filter.attr('id', 'darkenFilter');

                // have to reapply the filter to the image since the image
                // does not change its filter id automatically
                image.filter(filter);
            } else {
                // if the filter is already created, we just use it
                image.filter(filter);
            }
        } else {
            // if the fam is not dead, remove any existing filter from it
            image.unfilter();
        }
    };

    BattleLogger.prototype.displayTurnAnimation = function (index) {
        for (var j = 0; this.minorEventLog[index] && j < this.minorEventLog[index].length; j++) {
            var data = this.minorEventLog[index][j];
            var executor = BattleModel.getInstance().cardManager.getCardById(data.executorId);
            var group = this.getCardImageGroupOnCanvas(executor);

            // scale from center
            var scaleFactor = 1.3;
            var cx = group.cx();
            var cy = group.cy();

            group.animate({ duration: '1s' }).transform({
                a: scaleFactor,
                b: 0,
                c: 0,
                d: scaleFactor,
                e: cx - scaleFactor * cx,
                f: cy - scaleFactor * cy
            }).after(function () {
                this.animate({ duration: '1s', delay: '0.5s' }).transform({
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: cx - 1 * cx,
                    f: cy - 1 * cy
                });
            });

            // display the skill name
            if (this.majorEventLog[index].skillId) {
                var groupSkillBg = SVG.get('p' + executor.getPlayerId() + 'SkillBgTextGroup');
                var svgText = SVG.get('p' + executor.getPlayerId() + 'SkillText');

                // the y-coordinate of the text, depending on whether this is player 1 or 2
                var yText = executor.getPlayerId() == 1 ? 272 : 8;

                // determine the name of the skill. It can be the MajorEvent's executor's skill, or the MinorEvent's executor's
                if (data.executorId == this.majorEventLog[index].executorId) {
                    var skillName = SkillDatabase[this.majorEventLog[index].skillId].name;
                } else {
                    var skillName = SkillDatabase[data.skillId].name;
                }

                // center the text inside the background
                svgText.text(skillName).move(55 + 150 - svgText.bbox().width / 2, yText);

                groupSkillBg.animate({ duration: '0.5s' }).opacity(1).after(function () {
                    this.animate({ duration: '0.5s', delay: '1.5s' }).opacity(0);
                });
            }
        }
    };

    /**
    * Given a card, return the image of that card on the canvas
    */
    BattleLogger.prototype.getCardImageOnCanvas = function (card) {
        return SVG.get('player' + card.getPlayerId() + 'fam' + card.formationColumn + 'image');
    };

    /**
    * Given a card, return the image group of that card on the canvas
    */
    BattleLogger.prototype.getCardImageGroupOnCanvas = function (card) {
        return SVG.get('player' + card.getPlayerId() + 'fam' + card.formationColumn + 'group');
    };

    /**
    * Log the situation at the start of battle and display the initial info
    */
    BattleLogger.prototype.startBattleLog = function () {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        this.addMajorEvent({ description: "Battle start" });
        this.displayMinorEvent("Everything ready");
        this.displayEventLogAtIndex(0);
    };
    BattleLogger.IMAGE_WIDTH = 70;

    BattleLogger._instance = null;
    return BattleLogger;
})();
var ENUM;
(function (ENUM) {
    /**
    * Is the skill opening, attack, defense, etc.
    */
    (function (SkillType) {
        SkillType[SkillType["OPENING"] = 1] = "OPENING";
        SkillType[SkillType["ATTACK"] = 2] = "ATTACK";
        SkillType[SkillType["DEFENSE"] = 3] = "DEFENSE";
        SkillType[SkillType["FIELD"] = 4] = "FIELD";
        SkillType[SkillType["PROTECT"] = 5] = "PROTECT";

        SkillType[SkillType["ACTION_ON_DEATH"] = 16] = "ACTION_ON_DEATH";
    })(ENUM.SkillType || (ENUM.SkillType = {}));
    var SkillType = ENUM.SkillType;

    /**
    * Is the skill buff, attack, magic, etc.
    */
    (function (SkillFunc) {
        SkillFunc[SkillFunc["BUFF"] = 1] = "BUFF";
        SkillFunc[SkillFunc["DEBUFF"] = 2] = "DEBUFF";
        SkillFunc[SkillFunc["ATTACK"] = 3] = "ATTACK";

        // arg4: number of turns for silent & blind, % for venom, arg5: miss prob.for blind
        SkillFunc[SkillFunc["MAGIC"] = 4] = "MAGIC";
        SkillFunc[SkillFunc["COOP"] = 5] = "COOP";
        SkillFunc[SkillFunc["REVIVE"] = 6] = "REVIVE";
        SkillFunc[SkillFunc["KILL"] = 7] = "KILL";
        SkillFunc[SkillFunc["STEAL"] = 8] = "STEAL";
        SkillFunc[SkillFunc["CHARGE"] = 9] = "CHARGE";
        SkillFunc[SkillFunc["DRAIN"] = 11] = "DRAIN";
        SkillFunc[SkillFunc["PROTECT"] = 12] = "PROTECT";
        SkillFunc[SkillFunc["COUNTER"] = 13] = "COUNTER";
        SkillFunc[SkillFunc["PROTECT_COUNTER"] = 14] = "PROTECT_COUNTER";
        SkillFunc[SkillFunc["TREASURE_HUNTER"] = 15] = "TREASURE_HUNTER";
        SkillFunc[SkillFunc["CLEAR_BUFF"] = 16] = "CLEAR_BUFF";
        SkillFunc[SkillFunc["SUICIDE"] = 17] = "SUICIDE";
        SkillFunc[SkillFunc["HEAL"] = 18] = "HEAL";
        SkillFunc[SkillFunc["AFFLICTION"] = 19] = "AFFLICTION";
        SkillFunc[SkillFunc["PATIENCE"] = 20] = "PATIENCE";
        SkillFunc[SkillFunc["DEBUFFATTACK"] = 21] = "DEBUFFATTACK";
        SkillFunc[SkillFunc["DEBUFFINDIRECT"] = 22] = "DEBUFFINDIRECT";

        SkillFunc[SkillFunc["RANDOM"] = 24] = "RANDOM";
        SkillFunc[SkillFunc["COPY"] = 25] = "COPY";
        SkillFunc[SkillFunc["IMITATE"] = 26] = "IMITATE";
        SkillFunc[SkillFunc["EVADE"] = 27] = "EVADE";
        SkillFunc[SkillFunc["PROTECT_REFLECT"] = 28] = "PROTECT_REFLECT";
        SkillFunc[SkillFunc["PROTECT_DISPEL"] = 29] = "PROTECT_DISPEL";
        SkillFunc[SkillFunc["TURN_ORDER_CHANGE"] = 31] = "TURN_ORDER_CHANGE";
    })(ENUM.SkillFunc || (ENUM.SkillFunc = {}));
    var SkillFunc = ENUM.SkillFunc;

    /**
    * Is the skill calculated based on atk, wis, agi, etc.
    */
    (function (SkillCalcType) {
        SkillCalcType[SkillCalcType["DEFAULT"] = 0] = "DEFAULT";
        SkillCalcType[SkillCalcType["ATK"] = 1] = "ATK";
        SkillCalcType[SkillCalcType["WIS"] = 2] = "WIS";
        SkillCalcType[SkillCalcType["AGI"] = 3] = "AGI";
        SkillCalcType[SkillCalcType["HEAL"] = 4] = "HEAL";
        SkillCalcType[SkillCalcType["BUFF"] = 5] = "BUFF";
        SkillCalcType[SkillCalcType["DEBUFF"] = 6] = "DEBUFF";
        SkillCalcType[SkillCalcType["REFLECT"] = 7] = "REFLECT";
    })(ENUM.SkillCalcType || (ENUM.SkillCalcType = {}));
    var SkillCalcType = ENUM.SkillCalcType;

    (function (StatType) {
        StatType[StatType["HP"] = 0] = "HP";
        StatType[StatType["ATK"] = 1] = "ATK";
        StatType[StatType["DEF"] = 2] = "DEF";
        StatType[StatType["WIS"] = 3] = "WIS";
        StatType[StatType["AGI"] = 4] = "AGI";
    })(ENUM.StatType || (ENUM.StatType = {}));
    var StatType = ENUM.StatType;

    (function (StatusType) {
        StatusType[StatusType["ATK"] = 1] = "ATK";
        StatusType[StatusType["DEF"] = 2] = "DEF";
        StatusType[StatusType["WIS"] = 3] = "WIS";
        StatusType[StatusType["AGI"] = 4] = "AGI";

        StatusType[StatusType["ATTACK_RESISTANCE"] = 5] = "ATTACK_RESISTANCE";
        StatusType[StatusType["MAGIC_RESISTANCE"] = 6] = "MAGIC_RESISTANCE";
        StatusType[StatusType["BREATH_RESISTANCE"] = 7] = "BREATH_RESISTANCE";

        StatusType[StatusType["SKILL_PROBABILITY"] = 8] = "SKILL_PROBABILITY";

        StatusType[StatusType["ACTION_ON_DEATH"] = 16] = "ACTION_ON_DEATH";

        StatusType[StatusType["HP_SHIELD"] = 17] = "HP_SHIELD";
    })(ENUM.StatusType || (ENUM.StatusType = {}));
    var StatusType = ENUM.StatusType;

    (function (AfflictionType) {
        AfflictionType[AfflictionType["POISON"] = 1] = "POISON";
        AfflictionType[AfflictionType["PARALYSIS"] = 2] = "PARALYSIS";
        AfflictionType[AfflictionType["FROZEN"] = 3] = "FROZEN";
        AfflictionType[AfflictionType["DISABLE"] = 4] = "DISABLE";
        AfflictionType[AfflictionType["SILENT"] = 5] = "SILENT";
        AfflictionType[AfflictionType["BLIND"] = 7] = "BLIND";
    })(ENUM.AfflictionType || (ENUM.AfflictionType = {}));
    var AfflictionType = ENUM.AfflictionType;

    (function (FormationRow) {
        FormationRow[FormationRow["REAR"] = 3] = "REAR";
        FormationRow[FormationRow["MID"] = 2] = "MID";
        FormationRow[FormationRow["FRONT"] = 1] = "FRONT";
    })(ENUM.FormationRow || (ENUM.FormationRow = {}));
    var FormationRow = ENUM.FormationRow;

    (function (MinorEventType) {
        MinorEventType[MinorEventType["HP"] = 1] = "HP";
        MinorEventType[MinorEventType["STATUS"] = 2] = "STATUS";
        MinorEventType[MinorEventType["AFFLICTION"] = 3] = "AFFLICTION";
        MinorEventType[MinorEventType["DESCRIPTION"] = 4] = "DESCRIPTION";
    })(ENUM.MinorEventType || (ENUM.MinorEventType = {}));
    var MinorEventType = ENUM.MinorEventType;
})(ENUM || (ENUM = {}));
/// <reference path="enums.ts"/>
var Card = (function () {
    function Card(name, stats, skills, player, formationColumn, imageLink, autoAttack) {
        this.name = name;
        this.stats = stats; // this will be modified during the battle
        this.status = new Status();
        this.originalStats = new Stats(stats.hp, stats.atk, stats.def, stats.wis, stats.agi); // this should never be modified
        this.skills = skills;
        this.player = player; // 1: me, 2: opponent

        this.isDead = false;
        this.formationColumn = formationColumn;
        this.formationRow = player.formation.getCardRow(formationColumn);

        for (var i = 0; i < skills.length; i++) {
            var skill = skills[i];
            if (skill) {
                if (skill.skillType == 1 /* OPENING */) {
                    this.openingSkill = skill;
                } else if (skill.skillType == 2 /* ATTACK */) {
                    this.attackSkill = skill;
                } else if (skill.skillType == 5 /* PROTECT */) {
                    this.protectSkill = skill;
                } else if (skill.skillType == 3 /* DEFENSE */) {
                    this.defenseSkill = skill;
                }
            }
        }

        this.imageLink = imageLink;
        this.autoAttack = autoAttack;

        this.id = player.id * 100 + formationColumn; // 100-104, 200-204
    }
    Card.prototype.getSerializableObject = function () {
        return {
            name: this.name,
            stats: this.stats,
            id: this.id,
            originalStats: this.originalStats,
            status: this.status,
            skills: getSerializableObjectArray(this.skills),
            player: this.player,
            isDead: this.isDead,
            affliction: this.affliction,
            autoAttack: this.autoAttack.getSerializableObject(),
            openingSkill: this.openingSkill ? this.openingSkill.getSerializableObject() : null,
            attackSkill: this.attackSkill ? this.attackSkill.getSerializableObject() : null,
            protectSkill: this.protectSkill ? this.protectSkill.getSerializableObject() : null,
            defenseSkill: this.defenseSkill ? this.defenseSkill.getSerializableObject() : null,
            formationColumn: this.formationColumn,
            formationRow: this.formationRow,
            imageLink: this.imageLink
        };
    };

    Card.prototype.getName = function () {
        return this.name;
    };

    Card.prototype.getPlayerId = function () {
        return this.player.id;
    };

    Card.prototype.getPlayerName = function () {
        return this.player.name;
    };

    Card.prototype.getFormationRow = function () {
        return this.formationRow;
    };

    Card.prototype.getStat = function (statType) {
        if (statType === "HP") {
            return this.getHP();
        } else if (statType === "ATK") {
            return this.getATK();
        } else if (statType === "DEF") {
            return this.getDEF();
        } else if (statType === "WIS") {
            return this.getWIS();
        } else if (statType === "AGI") {
            return this.getAGI();
        } else if (statType === "DEFAULT") {
            return this.getWIS();
        } else {
            throw new Error("Invalid stat type");
        }
    };

    // affliction
    Card.prototype.setAffliction = function (type, optParam) {
        if (!optParam) {
            optParam = [null, null];
        }
        if (this.affliction) {
            if (this.affliction.getType() === type) {
                this.affliction.add(optParam[0], optParam[1]);
                return;
            } else {
                this.clearAffliction();
            }
        }
        this.affliction = AfflictionFactory.getAffliction(type);
        this.affliction.add(optParam[0], optParam[1]);
    };

    Card.prototype.clearAffliction = function () {
        if (!this.affliction) {
            return;
        }
        this.affliction.clear();
        this.affliction = null;
    };

    Card.prototype.canAttack = function () {
        return (this.affliction) ? this.affliction.canAttack() : true;
    };

    Card.prototype.canUseSkill = function () {
        return (this.affliction) ? this.affliction.canUseSkill() : true;
    };

    Card.prototype.canMiss = function () {
        return (this.affliction) ? this.affliction.canMiss() : false;
    };

    Card.prototype.getAfflictionType = function () {
        return this.affliction ? this.affliction.getType() : null;
    };

    // return true if an affliction was cleared
    Card.prototype.updateAffliction = function () {
        if (!this.affliction) {
            return false;
        }

        this.affliction.update(this);

        if (this.affliction && this.affliction.isFinished()) {
            this.clearAffliction();
            return true;
        }

        // still have affliction
        return false;
    };

    Card.prototype.changeStatus = function (statusType, amount) {
        if (statusType === 1 /* ATK */) {
            this.status.atk += amount;
        } else if (statusType === 2 /* DEF */) {
            this.status.def += amount;
        } else if (statusType === 3 /* WIS */) {
            this.status.wis += amount;
        } else if (statusType === 4 /* AGI */) {
            this.status.agi += amount;
        } else if (statusType === 5 /* ATTACK_RESISTANCE */) {
            if (this.status.attackResistance < amount) {
                this.status.attackResistance = amount; // do not stack
            }
        } else if (statusType === 6 /* MAGIC_RESISTANCE */) {
            if (this.status.magicResistance < amount) {
                this.status.magicResistance = amount; // do not stack
            }
        } else if (statusType === 7 /* BREATH_RESISTANCE */) {
            if (this.status.breathResistance < amount) {
                this.status.breathResistance = amount; // do not stack
            }
        } else if (statusType === 8 /* SKILL_PROBABILITY */) {
            this.status.skillProbability += amount;
        } else {
            throw new Error("Invalid status type");
        }
    };

    Card.prototype.getHP = function () {
        return this.stats.hp;
    };
    Card.prototype.changeHP = function (amount) {
        this.stats.hp += amount;
    };

    Card.prototype.getATK = function () {
        return this.stats.atk + this.status.atk;
    };
    Card.prototype.getDEF = function () {
        return this.stats.def + this.status.def;
    };
    Card.prototype.getWIS = function () {
        return this.stats.wis + this.status.wis;
    };
    Card.prototype.getAGI = function () {
        return this.stats.agi + this.status.agi;
    };
    return Card;
})();

var Stats = (function () {
    function Stats(hp, atk, def, wis, agi) {
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.wis = wis;
        this.agi = agi;
    }
    return Stats;
})();

var Status = (function () {
    function Status() {
        // the amount changed because of buffs or debuffs
        this.atk = 0;
        this.def = 0;
        this.wis = 0;
        this.agi = 0;
        this.attackResistance = 0;
        this.magicResistance = 0;
        this.breathResistance = 0;
        this.skillProbability = 0;
    }
    return Status;
})();
/**
* A helper class for BattleModel, provides the card-related methods
*/
var CardManager = (function () {
    function CardManager() {
        if (CardManager._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        CardManager._instance = this;
    }
    CardManager.getInstance = function () {
        if (CardManager._instance === null) {
            CardManager._instance = new CardManager();
        }
        return CardManager._instance;
    };

    CardManager.prototype.sortAllCards = function () {
        // sort the cards
        BattleModel.getInstance().allCards.sort(function (a, b) {
            return b.getAGI() - a.getAGI();
        });
    };

    /**
    * Get the card to the left of a supplied card. Return null if the supplied card is at the leftmost
    * position in the formation
    */
    CardManager.prototype.getLeftSideCard = function (card) {
        var playerCards = this.getPlayerCards(card.player);
        var column = card.formationColumn;
        if (column == 0) {
            return null;
        } else if (column <= 4 && column >= 1) {
            return playerCards[column - 1];
        } else {
            throw new Error("Invalid card index");
        }
    };

    /**
    * Get the card to the right of a supplied card. Return null if the supplied card is at the rightmost
    * position in the formation
    */
    CardManager.prototype.getRightSideCard = function (card) {
        var playerCards = this.getPlayerCards(card.player);
        var column = card.formationColumn;
        if (column == 4) {
            return null;
        } else if (column >= 0 && column <= 3) {
            return playerCards[column + 1];
        } else {
            throw new Error("Invalid card index");
        }
    };

    /**
    * Get a card by its id
    */
    CardManager.prototype.getCardById = function (id) {
        return BattleModel.getInstance().allCardsById[id];
    };

    /**
    * Get all the cards that belong to a player
    */
    CardManager.prototype.getPlayerCards = function (player) {
        if (player === BattleModel.getInstance().player1) {
            return BattleModel.getInstance().player1Cards;
        } else if (player === BattleModel.getInstance().player2) {
            return BattleModel.getInstance().player2Cards;
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.getEnemyCards = function (player) {
        if (player === BattleModel.getInstance().player1) {
            return BattleModel.getInstance().player2Cards;
        } else if (player === BattleModel.getInstance().player2) {
            return BattleModel.getInstance().player1Cards;
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.getValidSingleTarget = function (cards) {
        var possibleIndices = [];
        for (var i = 0; i < 5; i++) {
            if (!cards[i].isDead) {
                possibleIndices.push(i);
            }
        }

        if (possibleIndices.length === 0) {
            return -1;
        }

        // get a random index from the list of possible indices
        var randomIndex = getRandomInt(0, possibleIndices.length - 1);

        return possibleIndices[randomIndex];
    };

    CardManager.prototype.getNearestSingleOpponentTarget = function (executor) {
        var oppCards = this.getPlayerCards(BattleModel.getInstance().getOppositePlayer(executor.player));
        var executorIndex = executor.formationColumn;

        var offsetArray = [0, -1, 1, -2, 2, -3, 3, -4, 4];

        for (var i = 0; i < offsetArray.length; i++) {
            var currentOppCard = oppCards[executorIndex + offsetArray[i]];
            if (currentOppCard && !currentOppCard.isDead) {
                return currentOppCard;
            }
        }

        // if it reaches this point, there's no target, so return null
        return null;
    };

    CardManager.prototype.isAllDeadPlayer = function (player) {
        if (player === BattleModel.getInstance().player1) {
            return this.isAllDead(BattleModel.getInstance().player1Cards);
        } else if (player === BattleModel.getInstance().player2) {
            return this.isAllDead(BattleModel.getInstance().player2Cards);
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.isAllDead = function (cards) {
        var isAllDead = true;
        for (var i = 0; i < 5; i++) {
            // assume no null card
            if (!cards[i].isDead) {
                isAllDead = false;
                break;
            }
        }
        return isAllDead;
    };

    /**
    * Return true if a card is in a list of cards, or false if not
    */
    CardManager.prototype.isCardInList = function (card, list) {
        var isIn = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == card.id) {
                isIn = true;
                break;
            }
        }
        return isIn;
    };

    CardManager.prototype.isSameCard = function (card1, card2) {
        return card1.id == card2.id;
    };
    CardManager._instance = null;
    return CardManager;
})();
/**
* Some notes:
* - Use the POPE stats
* - The "name" attribute is a short name for the fam. If multiple fams have the same short name,
*   append the rarity at the end (e.g. "Thor" and "Thor L")
* - The order of the skills doesn't matter
* - For the image, use the 60px thumbnail version
*/
var famDatabase = {
    "Adranus, Lava Beast II": {
        name: "Adranus", hp: 20223, atk: 23517, def: 19855, wis: 18609, agi: 18046, skills: [99000],
        imageLink: "http://img2.wikia.nocookie.net/__cb20140122120804/bloodbrothersgame/images/thumb/7/75/Adranus%2C_Lava_Beast_II_Figure.png/60px-Adranus%2C_Lava_Beast_II_Figure.png" },
    "Ahab, the Colossal Anchor II": {
        name: "Ahab", hp: 10273, atk: 12001, def: 11342, wis: 9978, agi: 12342, skills: [195],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131129143807/bloodbrothersgame/images/thumb/e/ec/Ahab%2C_the_Colossal_Anchor_II_Figure.png/40px-Ahab%2C_the_Colossal_Anchor_II_Figure.png" },
    "Alcina the Soulsucker II": {
        name: "Alcina", hp: 12684, atk: 14169, def: 11356, wis: 13682, agi: 15755, skills: [269],
        imageLink: "http://img3.wikia.nocookie.net/__cb20131023124730/bloodbrothersgame/images/thumb/1/1b/Alcina_the_Soulsucker_II_Figure.png/40px-Alcina_the_Soulsucker_II_Figure.png" },
    "Alluring Merrow II": {
        name: "Alluring Merrow", hp: 16811, atk: 14709, def: 13723, wis: 17537, agi: 17320, skills: [217],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130725105247/bloodbrothersgame/images/thumb/6/6d/Alluring_Merrow_II_Figure.png/60px-Alluring_Merrow_II_Figure.png" },
    "Amazon Warfist II": {
        name: "Amazon Warfist", hp: 10904, atk: 11417, def: 10466, wis: 10660, agi: 11830, skills: [156],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130414034805/bloodbrothersgame/images/thumb/1/1a/Amazon_Warfist_II_Figure.png/40px-Amazon_Warfist_II_Figure.png" },
    "Ammit, Soul Destroyer II": {
        name: "Ammit", hp: 18306, atk: 23495, def: 18501, wis: 18490, agi: 18057, skills: [325],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131221031343/bloodbrothersgame/images/thumb/f/f9/Ammit%2C_Soul_Destroyer_II_Figure.png/60px-Ammit%2C_Soul_Destroyer_II_Figure.png" },
    "Ancient Beetle Soldier II": {
        name: "Ancient Beetle", hp: 14005, atk: 15901, def: 11903, wis: 11838, agi: 14904, skills: [365],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140207105441/bloodbrothersgame/images/thumb/e/e0/Ancient_Beetle_Soldier_II_Figure.png/40px-Ancient_Beetle_Soldier_II_Figure.png" },
    "Andorra the Indomitable II": {
        name: "Andorra", hp: 12538, atk: 13621, def: 13510, wis: 12134, agi: 12342, skills: [142],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130325180458/bloodbrothersgame/images/thumb/5/52/Andorra_the_Indomitable_II_Figure.png/40px-Andorra_the_Indomitable_II_Figure.png" },
    "Anneberg, Steel Steed II": {
        name: "Anneberg", hp: 19097, atk: 18241, def: 17038, wis: 8794, agi: 16518, skills: [489, 490],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140614112314/bloodbrothersgame/images/thumb/e/e1/Anneberg%2C_Steel_Steed_II_Figure.png/60px-Anneberg%2C_Steel_Steed_II_Figure.png" },
    "Apocalyptic Beast II": {
        name: "Apocalyptic Beast", hp: 14189, atk: 15977, def: 15413, wis: 13420, agi: 14969, skills: [123],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130227203821/bloodbrothersgame/images/thumb/5/5a/Apocalyptic_Beast_II_Figure.png/60px-Apocalyptic_Beast_II_Figure.png" },
    "Archduke Ose II": {
        name: "Archduke Ose", hp: 16995, atk: 14395, def: 15023, wis: 14850, agi: 11990, skills: [154],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130314191037/bloodbrothersgame/images/thumb/0/00/Archduke_Ose_II_Figure.png/60px-Archduke_Ose_II_Figure.png" },
    "Artemisia Swiftfoot II": {
        name: "Artemisia", hp: 10042, atk: 10977, def: 10977, wis: 10042, agi: 12589, skills: [18],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130222034947/bloodbrothersgame/images/thumb/a/aa/Artemisia_Swiftfoot_II_Figure.png/40px-Artemisia_Swiftfoot_II_Figure.png" },
    "Badalisc, the Gourmet II": {
        name: "Badalisc", hp: 14092, atk: 16107, def: 11882, wis: 11297, agi: 15218, skills: [315],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131212173203/bloodbrothersgame/images/thumb/6/6c/Badalisc%2C_the_Gourmet_II_Figure.png/40px-Badalisc%2C_the_Gourmet_II_Figure.png" },
    "Balgo, the Cursed Flame II": {
        name: "Balgo", hp: 18585, atk: 16037, def: 13962, wis: 5799, agi: 13510, skills: [349],
        imageLink: "http://img2.wikia.nocookie.net/__cb20140122120902/bloodbrothersgame/images/thumb/f/fd/Balgo%2C_the_Cursed_Flame_II_Figure.png/60px-Balgo%2C_the_Cursed_Flame_II_Figure.png" },
    "Batraz, the Immortal Hero II": {
        name: "Batraz", hp: 14471, atk: 15511, def: 13442, wis: 12293, agi: 12174, skills: [142],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130227154434/bloodbrothersgame/images/thumb/e/e3/Batraz%2C_the_Immortal_Hero_II_Figure.png/40px-Batraz%2C_the_Immortal_Hero_II_Figure.png" },
    "Beheading Scarecrow II": {
        name: "Scarecrow", hp: 10625, atk: 13756, def: 10490, wis: 11201, agi: 9342, skills: [256],
        imageLink: "http://img3.wikia.nocookie.net/__cb20131002022744/bloodbrothersgame/images/thumb/4/4d/Beheading_Scarecrow_II_Figure.png/40px-Beheading_Scarecrow_II_Figure.png" },
    "Boudica, the Dawn Chief II": {
        name: "Boudica", hp: 9967, atk: 11914, def: 8918, wis: 13110, agi: 12014, skills: [276],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131101130430/bloodbrothersgame/images/thumb/a/ab/Boudica%2C_the_Dawn_Chief_II_Figure.png/40px-Boudica%2C_the_Dawn_Chief_II_Figure.png" },
    "Bronzeclad Hyena II": {
        name: "Bronzeclad Hyena", hp: 14644, atk: 10766, def: 11860, wis: 18923, agi: 12228, skills: [321], autoAttack: 10008,
        imageLink: "http://img2.wikia.nocookie.net/__cb20131227221825/bloodbrothersgame/images/thumb/f/fc/Bronzeclad_Hyena_II_Figure.png/40px-Bronzeclad_Hyena_II_Figure.png" },
    "Brownies, the Uproarious II": {
        name: "Brownies", hp: 9821, atk: 11283, def: 9515, wis: 13196, agi: 11414, skills: [307],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131202082920/bloodbrothersgame/images/thumb/9/90/Brownies%2C_the_Uproarious_II_Figure.png/40px-Brownies%2C_the_Uproarious_II_Figure.png" },
    "Bunga, the Stalwart II": {
        name: "Bunga", hp: 12269, atk: 11049, def: 14182, wis: 9612, agi: 10343, skills: [125],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130107205042/bloodbrothersgame/images/thumb/5/5d/Bunga%2C_the_Stalwart_II_Figure.png/60px-Bunga%2C_the_Stalwart_II_Figure.png" },
    "Canhel, Guardian Dragon II": {
        name: "Canhel", hp: 15608, atk: 19606, def: 17992, wis: 11329, agi: 16399, skills: [293],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131122150727/bloodbrothersgame/images/thumb/5/54/Canhel%2C_Guardian_Dragon_II_Figure.png/60px-Canhel%2C_Guardian_Dragon_II_Figure.png" },
    "Cat Sith Chillweaver II": {
        name: "Cat Sith", hp: 13293, atk: 13196, def: 10611, wis: 16144, agi: 14489, skills: [2],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131215131933/bloodbrothersgame/images/thumb/b/b2/Cat_Sith_Chillweaver_II_Figure.png/60px-Cat_Sith_Chillweaver_II_Figure.png" },
    "Chaotic Magma Giant II": {
        name: "Magma Giant", hp: 12832, atk: 12380, def: 13097, wis: 11477, agi: 11928, skills: [123],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130202212620/bloodbrothersgame/images/thumb/6/63/Chaotic_Magma_Giant_II_Figure.png/40px-Chaotic_Magma_Giant_II_Figure.png" },
    "Chiyome, the Kamaitachi II": {
        name: "Chiyome", hp: 12635, atk: 14148, def: 11369, wis: 15817, agi: 13510, skills: [238],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130921071449/bloodbrothersgame/images/thumb/8/83/Chiyome%2C_the_Kamaitachi_II_Figure.png/40px-Chiyome%2C_the_Kamaitachi_II_Figure.png" },
    "Cuelebre the Ironscaled II": {
        name: "Cuelebre", hp: 13702, atk: 16096, def: 12954, wis: 11134, agi: 13572, skills: [249],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130916113928/bloodbrothersgame/images/thumb/8/8c/Cuelebre_the_Ironscaled_II_Figure.png/40px-Cuelebre_the_Ironscaled_II_Figure.png" },
    "Dagr Sunrider II": {
        name: "Dagr", hp: 12012, atk: 14059, def: 10712, wis: 17818, agi: 13810, skills: [275],
        imageLink: "http://img4.wikia.nocookie.net/__cb20131030132715/bloodbrothersgame/images/thumb/d/d2/Dagr_Sunrider_II_Figure.png/40px-Dagr_Sunrider_II_Figure.png" },
    "Deborah, Knight Immaculate II": {
        name: "Deborah", hp: 13550, atk: 14157, def: 13442, wis: 12987, agi: 13929, skills: [222],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130815132429/bloodbrothersgame/images/thumb/7/73/Deborah%2C_Knight_Immaculate_II_Figure.png/40px-Deborah%2C_Knight_Immaculate_II_Figure.png" },
    "Delphyne, Thunder Dragon II": {
        name: "Delphyne", hp: 11990, atk: 14601, def: 11882, wis: 18858, agi: 11080, skills: [288],
        imageLink: "http://img4.wikia.nocookie.net/__cb20131101130817/bloodbrothersgame/images/thumb/1/15/Delphyne%2C_Thunder_Dragon_II_Figure.png/40px-Delphyne%2C_Thunder_Dragon_II_Figure.png" },
    "Desna, Mythic Wendigo II": {
        name: "Desna", hp: 13146, atk: 15089, def: 14287, wis: 12137, agi: 12378, skills: [124],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130106235645/bloodbrothersgame/images/thumb/4/45/Desna%2C_Mythic_Wendigo_II_Figure.png/60px-Desna%2C_Mythic_Wendigo_II_Figure.png" },
    "Djinn of the Lamp II": {
        name: "Djinn", hp: 14048, atk: 17363, def: 13333, wis: 19422, agi: 16605, skills: [319, 320],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131227221855/bloodbrothersgame/images/thumb/8/8d/Djinn_of_the_Lamp_II_Figure.png/60px-Djinn_of_the_Lamp_II_Figure.png" },
    "Doppeladler II": {
        name: "Doppeladler", hp: 13940, atk: 14709, def: 14417, wis: 14092, agi: 14850, skills: [33],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130107210324/bloodbrothersgame/images/thumb/6/68/Doppeladler_II_Figure.png/60px-Doppeladler_II_Figure.png" },
    "Earl Cat Sidhe II": {
        name: "Cat Sidhe", hp: 9614, atk: 8322, def: 11959, wis: 11243, agi: 10056, skills: [18],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130228073440/bloodbrothersgame/images/thumb/4/48/Earl_Cat_Sidhe_II_Figure.png/40px-Earl_Cat_Sidhe_II_Figure.png" },
    "Edgardo, Grand Inquisitor II": {
        name: "Edgardo", hp: 10904, atk: 15485, def: 14389, wis: 8978, agi: 14755, skills: [179],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130430110741/bloodbrothersgame/images/thumb/5/5f/Edgardo%2C_Grand_Inquisitor_II_Figure.png/40px-Edgardo%2C_Grand_Inquisitor_II_Figure.png" },
    "Empusa, the Death Scythe": {
        name: "Empusa", hp: 20706, atk: 12623, def: 16110, wis: 20999, agi: 17510, skills: [447], autoAttack: 10016,
        imageLink: "http://img3.wikia.nocookie.net/__cb20140508115333/bloodbrothersgame/images/thumb/0/0a/Empusa%2C_the_Death_Scythe_Figure.png/60px-Empusa%2C_the_Death_Scythe_Figure.png" },
    "Fenrir II": {
        name: "Fenrir", hp: 15099, atk: 16865, def: 22498, wis: 13008, agi: 11167, skills: [154],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130420124059/bloodbrothersgame/images/thumb/d/dd/Fenrir_II_Figure.png/60px-Fenrir_II_Figure.png" },
    "Flame Dragon II": {
        name: "Flame Dragon", hp: 14601, atk: 14449, def: 13756, wis: 15153, agi: 13940, skills: [23],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130107210805/bloodbrothersgame/images/thumb/8/8e/Flame_Dragon_II_Figure.png/60px-Flame_Dragon_II_Figure.png" },
    "Flesh Collector Golem II": {
        name: "Flesh Collector Golem", hp: 17450, atk: 14536, def: 18089, wis: 8664, agi: 9661, skills: [253],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131002005230/bloodbrothersgame/images/thumb/5/52/Flesh_Collector_Golem_II_Figure.png/40px-Flesh_Collector_Golem_II_Figure.png" },
    "Freyr, God of the Harvest II": {
        name: "Freyr", hp: 16562, atk: 19909, def: 15370, wis: 12943, agi: 15998, skills: [385, 386],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140301012048/bloodbrothersgame/images/thumb/5/51/Freyr%2C_God_of_the_Harvest_II_Figure.png/60px-Freyr%2C_God_of_the_Harvest_II_Figure.png" },
    "Fomor the Savage II": {
        name: "Fomor", hp: 13052, atk: 14465, def: 11928, wis: 9967, agi: 9781, skills: [138],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130208175749/bloodbrothersgame/images/thumb/4/43/Fomor_the_Savage_II_Figure.png/40px-Fomor_the_Savage_II_Figure.png" },
    "Gan Ceann": {
        name: "Gan Ceann", hp: 7950, atk: 10530, def: 8830, wis: 8910, agi: 8540, skills: [33],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130224083941/bloodbrothersgame/images/thumb/c/ca/Gan_Ceann_Figure.png/60px-Gan_Ceann_Figure.png" },
    "Gathgoic the Other II": {
        name: "Gathgoic", hp: 14839, atk: 16128, def: 14980, wis: 17948, agi: 14709, skills: [141],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130122044308/bloodbrothersgame/images/thumb/f/fb/Gathgoic_the_Other_II_Figure.png/60px-Gathgoic_the_Other_II_Figure.png" },
    "Ghislandi, Iron Heart II": {
        name: "Ghislandi", hp: 12324, atk: 13551, def: 13525, wis: 12212, agi: 12187, skills: [17],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130106212217/bloodbrothersgame/images/thumb/6/68/Ghislandi%2C_Iron_Heart_II_Figure.png/60px-Ghislandi%2C_Iron_Heart_II_Figure.png" },
    "Goblin King II": {
        name: "Goblin King", hp: 8144, atk: 8339, def: 6400, wis: 10159, agi: 10278, skills: [18],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130228171344/bloodbrothersgame/images/thumb/4/4f/Goblin_King_II_Figure.png/60px-Goblin_King_II_Figure.png" },
    "Gorgon II": {
        name: "Gorgon", hp: 10170, atk: 12436, def: 8652, wis: 12773, agi: 10924, skills: [18],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130227140440/bloodbrothersgame/images/thumb/6/6f/Gorgon_II_Figure.png/40px-Gorgon_II_Figure.png" },
    "Gorlin Gold Helm II": {
        name: "Gorlin", hp: 11928, atk: 12380, def: 17000, wis: 6809, agi: 10904, skills: [167],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130408193159/bloodbrothersgame/images/thumb/5/50/Gorlin_Gold_Helm_II_Figure.png/60px-Gorlin_Gold_Helm_II_Figure.png" },
    "Gregoire, Weaponmaster II": {
        name: "Gregoire", hp: 11708, atk: 12121, def: 10318, wis: 14854, agi: 10159, skills: [144],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130208175748/bloodbrothersgame/images/thumb/0/08/Gregoire%2C_Weaponmaster_II_Figure.png/40px-Gregoire%2C_Weaponmaster_II_Figure.png" },
    "Grellas Fellstaff II": {
        name: "Grellas", hp: 12066, atk: 14769, def: 10636, wis: 17374, agi: 13073, skills: [212],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130714135315/bloodbrothersgame/images/thumb/1/11/Grellas_Fellstaff_II_Figure.png/40px-Grellas_Fellstaff_II_Figure.png" },
    "Gretch, Chimaera Mistress II": {
        name: "Gretch", hp: 16280, atk: 15305, def: 12683, wis: 15652, agi: 13875, skills: [196],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130609110933/bloodbrothersgame/images/thumb/a/a9/Gretch%2C_Chimaera_Mistress_II_Figure.png/40px-Gretch%2C_Chimaera_Mistress_II_Figure.png" },
    "Griffin Mount II": {
        name: "Griffin", hp: 11887, atk: 9909, def: 14391, wis: 14263, agi: 11960, skills: [2],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130222030204/bloodbrothersgame/images/thumb/5/57/Griffin_Mount_II_Figure.png/60px-Griffin_Mount_II_Figure.png" },
    "Guillaume, Fanatic": {
        name: "Guillaume", hp: 21515, atk: 20887, def: 16308, wis: 12948, agi: 18505, skills: [466, 467],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140520122326/bloodbrothersgame/images/thumb/2/22/Guillaume%2C_Fanatic_Figure.png/60px-Guillaume%2C_Fanatic_Figure.png" },
    "Haokah, the Lightning Brave II": {
        name: "Haokah", hp: 13476, atk: 13928, def: 11111, wis: 15706, agi: 13245, skills: [232],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130901131933/bloodbrothersgame/images/thumb/9/98/Haokah%2C_the_Lightning_Brave_II_Figure.png/40px-Haokah%2C_the_Lightning_Brave_II_Figure.png" },
    "Hecatoncheir the Adamantine II": {
        name: "Hecatoncheir", hp: 11807, atk: 13902, def: 14768, wis: 13928, agi: 13366, skills: [264],
        imageLink: "http://img4.wikia.nocookie.net/__cb20131010170211/bloodbrothersgame/images/thumb/8/88/Hecatoncheir_the_Adamantine_II_Figure.png/40px-Hecatoncheir_the_Adamantine_II_Figure.png" },
    "Heinrich the Bold II": {
        name: "Heinrich", hp: 16887, atk: 13940, def: 15132, wis: 13290, agi: 14005, skills: [133],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130124152435/bloodbrothersgame/images/thumb/0/05/Heinrich_the_Bold_II_Figure.png/60px-Heinrich_the_Bold_II_Figure.png" },
    "Hel, Goddess of Death II": {
        name: "Hel", hp: 14709, atk: 17450, def: 14709, wis: 15771, agi: 18057, skills: [239, 240],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130921074034/bloodbrothersgame/images/thumb/e/e8/Hel%2C_Goddess_of_Death_II_Figure.png/60px-Hel%2C_Goddess_of_Death_II_Figure.png" },
    "Hippocamp II": {
        name: "Hippocamp", hp: 14514, atk: 16486, def: 14926, wis: 19855, agi: 15002, skills: [360, 167],
        imageLink: "http://img4.wikia.nocookie.net/__cb20140129062341/bloodbrothersgame/images/thumb/f/f8/Hippocamp_II_Figure.png/60px-Hippocamp_II_Figure.png" },
    "Hollofernyiges II": {
        name: "Hollofernyiges", hp: 16551, atk: 16757, def: 13875, wis: 14568, agi: 16941, skills: [33],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130321232308/bloodbrothersgame/images/thumb/2/20/Hollofernyiges_II_Figure.png/60px-Hollofernyiges_II_Figure.png" },
    "Hoska, the Firestroke II": {
        name: "Hoska", hp: 18996, atk: 7906, def: 15096, wis: 17023, agi: 8881, skills: [484, 485], autoAttack: 10007,
        imageLink: "http://img2.wikia.nocookie.net/__cb20140613080813/bloodbrothersgame/images/thumb/6/6c/Hoska%2C_the_Firestroke_II_Figure.png/60px-Hoska%2C_the_Firestroke_II_Figure.png" },
    "Hraesvelg, Corpse Feaster II": {
        name: "Hraesvelg", hp: 12499, atk: 17472, def: 11784, wis: 12662, agi: 13799, skills: [251],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130927185735/bloodbrothersgame/images/thumb/c/cd/Hraesvelg%2C_Corpse_Feaster_II_Figure.png/40px-Hraesvelg%2C_Corpse_Feaster_II_Figure.png" },
    "Infested Peryton II": {
        name: "Peryton", hp: 10904, atk: 9674, def: 10490, wis: 10490, agi: 12952, skills: [33],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130106234752/bloodbrothersgame/images/thumb/2/2b/Infested_Peryton_II_Figure.png/40px-Infested_Peryton_II_Figure.png" },
    "Ira, Hypnotic Specter II": {
        name: "Ira", hp: 12832, atk: 14489, def: 8770, wis: 11172, agi: 17254, skills: [138],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130227203822/bloodbrothersgame/images/thumb/6/6c/Ira%2C_Hypnotic_Specter_II_Figure.png/40px-Ira%2C_Hypnotic_Specter_II_Figure.png" },
    "Iseult, the Redeemer II": {
        name: "Iseult", hp: 12731, atk: 10977, def: 11708, wis: 15865, agi: 14193, skills: [144],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130629202258/bloodbrothersgame/images/thumb/f/f2/Iseult%2C_the_Redeemer_II_Figure.png/40px-Iseult%2C_the_Redeemer_II_Figure.png" },
    "Kalevan, the Forest Green II": {
        name: "Kalevan", hp: 12629, atk: 18013, def: 11914, wis: 12055, agi: 13821, skills: [297, 240],
        imageLink: "http://img3.wikia.nocookie.net/__cb20131122044155/bloodbrothersgame/images/thumb/b/bd/Kalevan%2C_the_Forest_Green_II_Figure.png/40px-Kalevan%2C_the_Forest_Green_II_Figure.png" },
    "Kangana, the Maelstrom II": {
        name: "Kangana", hp: 15803, atk: 18750, def: 14872, wis: 12813, agi: 13247, skills: [216],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130726121448/bloodbrothersgame/images/thumb/b/b1/Kangana%2C_the_Maelstrom_II_Figure.png/60px-Kangana%2C_the_Maelstrom_II_Figure.png" },
    "Katiria Nullblade II": {
        name: "Katiria", hp: 10807, atk: 11318, def: 11356, wis: 10245, agi: 11623, skills: [156],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130714135314/bloodbrothersgame/images/thumb/b/b6/Katiria_Nullblade_II_Figure.png/60px-Katiria_Nullblade_II_Figure.png" },
    "Kekro, Demiwyrm Magus II": {
        name: "Kekro", hp: 17992, atk: 12001, def: 15002, wis: 19660, agi: 16302, skills: [379], autoAttack: 10007,
        imageLink: "http://img3.wikia.nocookie.net/__cb20140221092259/bloodbrothersgame/images/thumb/3/3b/Kekro%2C_Demiwyrm_Magus_II_Figure.png/60px-Kekro%2C_Demiwyrm_Magus_II_Figure.png" },
    "Kyteler the Corrupted II": {
        name: "Kyteler", hp: 11721, atk: 12524, def: 9892, wis: 17254, agi: 16416, skills: [258],
        imageLink: "http://img4.wikia.nocookie.net/__cb20140120233253/bloodbrothersgame/images/thumb/d/d4/Kyteler_the_Corrupted_II_Figure.png/60px-Kyteler_the_Corrupted_II_Figure.png" },
    "Lanvall, Lizard Cavalier II": {
        name: "Lanvall", hp: 12914, atk: 14639, def: 12245, wis: 12210, agi: 15040, skills: [18],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130106224520/bloodbrothersgame/images/thumb/6/63/Lanvall%2C_Lizard_Cavalier_II_Figure.png/40px-Lanvall%2C_Lizard_Cavalier_II_Figure.png" },
    "Linnorm, the Hailstorm II": {
        name: "Linnorm", hp: 12326, atk: 11102, def: 11979, wis: 16605, agi: 16497, skills: [313],
        imageLink: "http://img3.wikia.nocookie.net/__cb20131210233903/bloodbrothersgame/images/thumb/0/0b/Linnorm%2C_the_Hailstorm_II_Figure.png/60px-Linnorm%2C_the_Hailstorm_II_Figure.png" },
    "Magdal Dragonheart II": {
        name: "Magdal", hp: 13929, atk: 15110, def: 15132, wis: 13810, agi: 15359, skills: [120],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130210215236/bloodbrothersgame/images/thumb/c/c0/Magdal_Dragonheart_II_Figure.png/40px-Magdal_Dragonheart_II_Figure.png" },
    "Marraco, Crusted Wyrm II": {
        name: "Marraco", hp: 18716, atk: 15876, def: 17254, wis: 7381, agi: 8809, skills: [61, 167],
        imageLink: "http://img4.wikia.nocookie.net/__cb20131115131303/bloodbrothersgame/images/thumb/7/7b/Marraco%2C_Crusted_Wyrm_II_Figure.png/60px-Marraco%2C_Crusted_Wyrm_II_Figure.png" },
    "Melanippe, Wolfrider II": {
        name: "Melanippe", hp: 16139, atk: 16800, def: 13929, wis: 11849, agi: 15132, skills: [195],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130708160233/bloodbrothersgame/images/thumb/4/4f/Melanippe%2C_Wolfrider_II_Figure.png/40px-Melanippe%2C_Wolfrider_II_Figure.png" },
    "Millarca, Lady of Thorns II": {
        name: "Millarca", hp: 15305, atk: 10668, def: 15565, wis: 21393, agi: 18046, skills: [407, 408], autoAttack: 10007,
        imageLink: "http://img2.wikia.nocookie.net/__cb20140325120640/bloodbrothersgame/images/thumb/f/ff/Millarca%2C_Lady_of_Thorns_II_Figure.png/60px-Millarca%2C_Lady_of_Thorns_II_Figure.png" },
    "Moni the Dismemberer II": {
        name: "Moni", hp: 13562, atk: 15537, def: 12121, wis: 10234, agi: 16448, skills: [340],
        imageLink: "http://img3.wikia.nocookie.net/__cb20140110075315/bloodbrothersgame/images/thumb/4/43/Moni_the_Dismemberer_II_Figure.png/60px-Moni_the_Dismemberer_II_Figure.png" },
    "Mordred, Drake Knight": {
        name: "Mordred", hp: 11000, atk: 12050, def: 10950, wis: 11000, agi: 12500, skills: [18],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130125001433/bloodbrothersgame/images/thumb/6/6b/Mordred%2C_Drake_Knight_Figure.png/40px-Mordred%2C_Drake_Knight_Figure.png" },
    "Musashi, the Twinblade II": {
        name: "Musashi", hp: 20592, atk: 24752, def: 19151, wis: 17981, agi: 18024, skills: [99003],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140326090459/bloodbrothersgame/images/thumb/1/1f/Musashi%2C_the_Twinblade_II_Figure.png/60px-Musashi%2C_the_Twinblade_II_Figure.png" },
    "Naberius II": {
        name: "Naberius", hp: 9563, atk: 9552, def: 7828, wis: 11208, agi: 11298, skills: [18],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130225032050/bloodbrothersgame/images/thumb/e/e9/Naberius_II_Figure.png/40px-Naberius_II_Figure.png" },
    "Nehasim the Seething II": {
        name: "Nehasim", hp: 12707, atk: 16071, def: 11390, wis: 12466, agi: 15172, skills: [294],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131122150818/bloodbrothersgame/images/thumb/8/8b/Nehasim_the_Seething_II_Figure.png/40px-Nehasim_the_Seething_II_Figure.png" },
    "Neith, Goddess of War II": {
        name: "Neith", hp: 18999, atk: 19660, def: 15002, wis: 12001, agi: 15305, skills: [326],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131221031333/bloodbrothersgame/images/thumb/3/3b/Neith%2C_Goddess_of_War_II_Figure.png/60px-Neith%2C_Goddess_of_War_II_Figure.png" },
    "Nergal, Abyssal Overseer II": {
        name: "Nergal", hp: 13008, atk: 15392, def: 11947, wis: 11643, agi: 16518, skills: [282],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131108145626/bloodbrothersgame/images/thumb/7/75/Nergal%2C_Abyssal_Overseer_II_Figure.png/40px-Nergal%2C_Abyssal_Overseer_II_Figure.png" },
    "Nightblade, Archsage of Winds II": {
        name: "Nightblade", hp: 12196, atk: 16995, def: 13528, wis: 10896, agi: 14915, skills: [341],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140110075314/bloodbrothersgame/images/thumb/6/64/Nightblade%2C_Archsage_of_Winds_II_Figure.png/40px-Nightblade%2C_Archsage_of_Winds_II_Figure.png" },
    "Niu Mo Wang II": {
        name: "Niu Mo Wang", hp: 14276, atk: 17071, def: 15998, wis: 13420, agi: 13138, skills: [133],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130709182652/bloodbrothersgame/images/thumb/2/26/Niu_Mo_Wang_II_Figure.png/60px-Niu_Mo_Wang_II_Figure.png" },
    "Odin Stormgod II": {
        name: "Odin Stormgod", hp: 12855, atk: 14346, def: 12378, wis: 14929, agi: 12245, skills: [119],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130106211414/bloodbrothersgame/images/thumb/5/5c/Odin_Stormgod_II_Figure.png/40px-Odin_Stormgod_II_Figure.png" },
    "Olitiau, the Great Bat II": {
        name: "Otilau", hp: 14081, atk: 15760, def: 11676, wis: 11232, agi: 15197, skills: [221],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130731090323/bloodbrothersgame/images/thumb/3/33/Olitiau%2C_the_Great_Bat_II_Figure.png/40px-Olitiau%2C_the_Great_Bat_II_Figure.png" },
    "Paladin of Capricorn II": {
        name: "Capricorn", hp: 14937, atk: 8491, def: 13507, wis: 16551, agi: 15099, skills: [476], autoAttack: 10007,
        imageLink: "http://img2.wikia.nocookie.net/__cb20140606074954/bloodbrothersgame/images/thumb/f/f4/Paladin_of_Capricorn_II_Figure.png/40px-Paladin_of_Capricorn_II_Figure.png" },
    "Paladin of Pisces II": {
        name: "Pisces", hp: 13041, atk: 8621, def: 14796, wis: 17114, agi: 14991, skills: [419], autoAttack: 10007,
        imageLink: "http://img1.wikia.nocookie.net/__cb20140411023129/bloodbrothersgame/images/thumb/2/22/Paladin_of_Pisces_II_Figure.png/40px-Paladin_of_Pisces_II_Figure.png" },
    "Paladin of Libra II": {
        name: "Libra", hp: 14178, atk: 16172, def: 14698, wis: 9845, agi: 13669, skills: [390],
        imageLink: "http://img4.wikia.nocookie.net/__cb20140313080212/bloodbrothersgame/images/thumb/8/86/Paladin_of_Libra_II_Figure.png/40px-Paladin_of_Libra_II_Figure.png" },
    "Pegasus, the Light Divine II": {
        name: "Pegasus", hp: 8756, atk: 10200, def: 8843, wis: 10880, agi: 9181, skills: [111],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130301003405/bloodbrothersgame/images/thumb/6/69/Pegasus%2C_the_Light_Divine_II_Figure.png/60px-Pegasus%2C_the_Light_Divine_II_Figure.png" },
    "Phoenix, the Metempsychosis II": {
        name: "Phoenix", hp: 14005, atk: 11188, def: 12033, wis: 19010, agi: 12185, skills: [305],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131129143510/bloodbrothersgame/images/thumb/2/25/Phoenix%2C_the_Metempsychosis_II_Figure.png/40px-Phoenix%2C_the_Metempsychosis_II_Figure.png" },
    "Princeps, Angel of Doom II": {
        name: "Princeps", hp: 9360, atk: 10772, def: 9674, wis: 10181, agi: 11667, skills: [156],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130314191111/bloodbrothersgame/images/thumb/d/dc/Princeps%2C_Angel_of_Doom_II_Figure.png/60px-Princeps%2C_Angel_of_Doom_II_Figure.png" },
    "Pontifex Antiquus II": {
        name: "Pontifex", hp: 14590, atk: 16410, def: 13507, wis: 18371, agi: 17797, skills: [229, 167],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130823004421/bloodbrothersgame/images/thumb/b/bd/Pontifex_Antiquus_II_Figure.png/60px-Pontifex_Antiquus_II_Figure.png" },
    "Premyslid, the Black King II": {
        name: "Premyslid", hp: 13626, atk: 16984, def: 14926, wis: 18772, agi: 11232, skills: [244],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130911122726/bloodbrothersgame/images/thumb/c/c7/Premyslid%2C_the_Black_King_II_Figure.png/60px-Premyslid%2C_the_Black_King_II_Figure.png" },
    "Queen of the Waspmen II": {
        name: "Queen Waspmen", hp: 14070, atk: 19898, def: 13247, wis: 15998, agi: 17829, skills: [99002],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140122120929/bloodbrothersgame/images/thumb/f/f6/Queen_of_the_Waspmen_II_Figure.png/60px-Queen_of_the_Waspmen_II_Figure.png" },
    "Ragnar, Dragonslayer II": {
        name: "Ragnar", hp: 13245, atk: 15804, def: 12001, wis: 10294, agi: 16510, skills: [314],
        imageLink: "http://img4.wikia.nocookie.net/__cb20131210233938/bloodbrothersgame/images/thumb/9/97/Ragnar%2C_Dragonslayer_II_Figure.png/60px-Ragnar%2C_Dragonslayer_II_Figure.png" },
    "Rampant Lion II": {
        name: "Rampant Lion", hp: 16291, atk: 17569, def: 16518, wis: 12564, agi: 18035, skills: [380, 381],
        imageLink: "http://img3.wikia.nocookie.net/__cb20140222023232/bloodbrothersgame/images/thumb/8/87/Rampant_Lion_II_Figure.png/60px-Rampant_Lion_II_Figure.png" },
    "Rapse, the Bloody Horns II": {
        name: "Rapse", hp: 11928, atk: 14182, def: 13110, wis: 11270, agi: 15524, skills: [179],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130721141602/bloodbrothersgame/images/thumb/e/e0/Rapse%2C_the_Bloody_Horns_II_Figure.png/40px-Rapse%2C_the_Bloody_Horns_II_Figure.png" },
    "Rasiel, Angel All-Knowing II": {
        name: "Rasiel", hp: 11936, atk: 15587, def: 11817, wis: 17797, agi: 11004, skills: [234],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130901132455/bloodbrothersgame/images/thumb/1/13/Rasiel%2C_Angel_All-Knowing_II_Figure.png/40px-Rasiel%2C_Angel_All-Knowing_II_Figure.png" },
    "Reinforced Brass Gorilla II": {
        name: "Brass Gorilla", hp: 18996, atk: 9760, def: 18096, wis: 12684, agi: 8319, skills: [398],
        imageLink: "http://img2.wikia.nocookie.net/__cb20140318135240/bloodbrothersgame/images/thumb/6/6b/Reinforced_Brass_Gorilla_II_Figure.png/60px-Reinforced_Brass_Gorilla_II_Figure.png" },
    "Sagacious Treant II": {
        name: "Treant", hp: 18566, atk: 17017, def: 22542, wis: 13626, agi: 8014, skills: [154],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131215131956/bloodbrothersgame/images/thumb/6/67/Sagacious_Treant_II_Figure.png/60px-Sagacious_Treant_II_Figure.png" },
    "Saurva, the Lawless Lord II": {
        name: "Saurva", hp: 14958, atk: 15305, def: 11329, wis: 11362, agi: 15002, skills: [259],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131015140405/bloodbrothersgame/images/thumb/f/f3/Saurva%2C_the_Lawless_Lord_II_Figure.png/40px-Saurva%2C_the_Lawless_Lord_II_Figure.png" },
    "Scathing Hierophant": {
        name: "Scathing Hierophant", hp: 19681, atk: 13391, def: 17534, wis: 20112, agi: 16950, skills: [418], autoAttack: 10007,
        imageLink: "http://img1.wikia.nocookie.net/__cb20140411023129/bloodbrothersgame/images/thumb/b/b1/Scathing_Hierophant_Figure.png/60px-Scathing_Hierophant_Figure.png" },
    "Sea Serpent II": {
        name: "Sea Serpent", hp: 16020, atk: 12012, def: 15121, wis: 19259, agi: 17103, skills: [302],
        imageLink: "http://img1.wikia.nocookie.net/__cb20131129152929/bloodbrothersgame/images/thumb/6/65/Sea_Serpent_II_Figure.png/60px-Sea_Serpent_II_Figure.png" },
    "Selk, Desert King II": {
        name: "Selk", hp: 13902, atk: 15852, def: 11976, wis: 11210, agi: 14927, skills: [327],
        imageLink: "http://img4.wikia.nocookie.net/__cb20131221031323/bloodbrothersgame/images/thumb/0/03/Selk%2C_Desert_King_II_Figure.png/40px-Selk%2C_Desert_King_II_Figure.png" },
    "Sigiled Skeleton Axeman II": {
        name: "Sigiled Axeman", hp: 14644, atk: 9076, def: 12987, wis: 18338, agi: 13409, skills: [416], autoAttack: 10007,
        imageLink: "http://img3.wikia.nocookie.net/__cb20140402124523/bloodbrothersgame/images/thumb/9/9e/Sigiled_Skeleton_Axeman_II_Figure.png/40px-Sigiled_Skeleton_Axeman_II_Figure.png" },
    "Sugaar, the Thunderstorm II": {
        name: "Sugaar", hp: 13110, atk: 7481, def: 14293, wis: 16950, agi: 16097, skills: [465], autoAttack: 10007,
        imageLink: "http://img1.wikia.nocookie.net/__cb20140520140320/bloodbrothersgame/images/thumb/9/9b/Sugaar%2C_the_Thunderstorm_II_Figure.png/40px-Sugaar%2C_the_Thunderstorm_II_Figure.png" },
    "Sulima, Executioner II": {
        name: "Sulima", hp: 13417, atk: 13583, def: 12194, wis: 12293, agi: 12269, skills: [17],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130108170214/bloodbrothersgame/images/thumb/e/ec/Sulima%2C_Executioner_II_Figure.png/40px-Sulima%2C_Executioner_II_Figure.png" },
    "Surtr the Fervent II": {
        name: "Surtr", hp: 15439, atk: 17108, def: 15085, wis: 7016, agi: 12891, skills: [383],
        imageLink: "http://img1.wikia.nocookie.net/__cb20140301022355/bloodbrothersgame/images/thumb/5/5b/Surtr_the_Fervent_II_Figure.png/40px-Surtr_the_Fervent_II_Figure.png" },
    "Tanba, Founder of Ninja II": {
        name: "Tanba", hp: 17580, atk: 23213, def: 17883, wis: 23289, agi: 18057, skills: [236],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130921071545/bloodbrothersgame/images/thumb/f/f6/Tanba%2C_Founder_of_Ninja_II_Figure.png/60px-Tanba%2C_Founder_of_Ninja_II_Figure.png" },
    "Tawiscara": {
        name: "Tawiscara", hp: 11914, atk: 14513, def: 14395, wis: 11366, agi: 15630, skills: [161],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130330204311/bloodbrothersgame/images/thumb/f/f5/Tawiscara_Figure.png/40px-Tawiscara_Figure.png" },
    "Tiamat, Mother of Dragons II": {
        name: "Tiamat", hp: 13702, atk: 14698, def: 16497, wis: 18869, agi: 15738, skills: [280],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131112085546/bloodbrothersgame/images/thumb/c/c5/Tiamat%2C_Mother_of_Dragons_II_Figure.png/60px-Tiamat%2C_Mother_of_Dragons_II_Figure.png" },
    "Thor, God of Lightning II": {
        name: "Thor", hp: 10343, atk: 13245, def: 11807, wis: 13842, agi: 11917, skills: [114],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130106214125/bloodbrothersgame/images/thumb/a/a1/Thor%2C_God_of_Lightning_II_Figure.png/60px-Thor%2C_God_of_Lightning_II_Figure.png" },
    "Thor, the Roaring Thunder": {
        name: "Thor L", hp: 20007, atk: 22002, def: 19063, wis: 10334, agi: 16518, skills: [437],
        imageLink: "http://img3.wikia.nocookie.net/__cb20140430140512/bloodbrothersgame/images/thumb/2/23/Thor%2C_the_Roaring_Thunder_Figure.png/60px-Thor%2C_the_Roaring_Thunder_Figure.png" },
    "Tomoe, the Lightning Arrow II": {
        name: "Tomoe", hp: 13889, atk: 16010, def: 13110, wis: 8285, agi: 16622, skills: [406],
        imageLink: "http://img2.wikia.nocookie.net/__cb20140326090713/bloodbrothersgame/images/thumb/b/b5/Tomoe%2C_the_Lightning_Arrow_II_Figure.png/60px-Tomoe%2C_the_Lightning_Arrow_II_Figure.png" },
    "Tormented Bone Beast II": {
        name: "Bone Beast", hp: 12001, atk: 9905, def: 12207, wis: 17000, agi: 16803, skills: [366], autoAttack: 10007,
        imageLink: "http://img1.wikia.nocookie.net/__cb20140206151442/bloodbrothersgame/images/thumb/1/15/Tormented_Bone_Beast_II_Figure.png/60px-Tormented_Bone_Beast_II_Figure.png" },
    "Unicorn, Spirit Eater II": {
        name: "Unicorn", hp: 10807, atk: 12600, def: 8770, wis: 11721, agi: 12001, skills: [156],
        imageLink: "http://img2.wikia.nocookie.net/__cb20131002005418/bloodbrothersgame/images/thumb/0/04/Unicorn%2C_Spirit_Eater_II_Figure.png/60px-Unicorn%2C_Spirit_Eater_II_Figure.png" },
    "Venusia, the Grace II": {
        name: "Venusia", hp: 14514, atk: 18273, def: 13333, wis: 10831, agi: 11492, skills: [361],
        imageLink: "http://img4.wikia.nocookie.net/__cb20140131053558/bloodbrothersgame/images/thumb/0/03/Venusia%2C_the_Grace_II_Figure.png/40px-Venusia%2C_the_Grace_II_Figure.png" },
    "Vezat, Dragonbone Warrior II": {
        name: "Vezat", hp: 16648, atk: 18165, def: 14709, wis: 13431, agi: 17721, skills: [214],
        imageLink: "http://img4.wikia.nocookie.net/__cb20130721141820/bloodbrothersgame/images/thumb/2/29/Vezat%2C_Dragonbone_Warrior_II_Figure.png/60px-Vezat%2C_Dragonbone_Warrior_II_Figure.png" },
    "Vivian Griffinrider II": {
        name: "Vivian", hp: 14677, atk: 17851, def: 15229, wis: 13095, agi: 14677, skills: [224],
        imageLink: "http://img2.wikia.nocookie.net/__cb20130816162357/bloodbrothersgame/images/thumb/5/5f/Vivian_Griffinrider_II_Figure.png/60px-Vivian_Griffinrider_II_Figure.png" },
    "Vlad the Impaler II": {
        name: "Vlad", hp: 16323, atk: 19508, def: 13680, wis: 14709, agi: 16529, skills: [295, 296],
        imageLink: "http://img3.wikia.nocookie.net/__cb20131122044220/bloodbrothersgame/images/thumb/5/56/Vlad_the_Impaler_II_Figure.png/40px-Vlad_the_Impaler_II_Figure.png" },
    "Wolfert, Grave Keeper II": {
        name: "Wolfert", hp: 14189, atk: 23972, def: 13723, wis: 13290, agi: 13431, skills: [118],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130313194006/bloodbrothersgame/images/thumb/9/91/Wolfert%2C_Grave_Keeper_II_Figure.png/60px-Wolfert%2C_Grave_Keeper_II_Figure.png" },
    "Xaphan, the Foul Flame II": {
        name: "Xaphan", hp: 13013, atk: 9415, def: 12573, wis: 17000, agi: 15537, skills: [412],
        imageLink: "http://img4.wikia.nocookie.net/__cb20140402124522/bloodbrothersgame/images/thumb/7/7f/Xaphan%2C_the_Foul_Flame_II_Figure.png/40px-Xaphan%2C_the_Foul_Flame_II_Figure.png" },
    "Ymir, Primordial Giant II": {
        name: "Ymir", hp: 22650, atk: 24600, def: 16464, wis: 20592, agi: 15933, skills: [227],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130824171957/bloodbrothersgame/images/thumb/6/67/Ymir%2C_Primordial_Giant_II_Figure.png/60px-Ymir%2C_Primordial_Giant_II_Figure.png" },
    "Yulia, Snakesage II": {
        name: "Yulia", hp: 14081, atk: 14664, def: 12052, wis: 13544, agi: 12524, skills: [134],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130110210701/bloodbrothersgame/images/thumb/4/41/Yulia%2C_Snakesage_II_Figure.png/60px-Yulia%2C_Snakesage_II_Figure.png" },
    "Zanga, the Iron Storm II": {
        name: "Zanga", hp: 10218, atk: 10787, def: 9692, wis: 9511, agi: 12779, skills: [161],
        imageLink: "http://img1.wikia.nocookie.net/__cb20130630141907/bloodbrothersgame/images/thumb/c/cf/Zanga%2C_the_Iron_Storm_II_Figure.png/60px-Zanga%2C_the_Iron_Storm_II_Figure.png" },
    "Zuniga, Guard Captain II": {
        name: "Zuniga", hp: 12987, atk: 15132, def: 14276, wis: 14839, agi: 14709, skills: [132],
        imageLink: "http://img3.wikia.nocookie.net/__cb20130108170215/bloodbrothersgame/images/thumb/2/22/Zuniga%2C_Guard_Captain_II_Figure.png/60px-Zuniga%2C_Guard_Captain_II_Figure.png" }
};
/// <reference path="enums.ts"/>
var Formation = (function () {
    function Formation(type) {
        this.type = type;
    }
    /**
    * Given a position (from 0-5), return the row of the familiar currently at that position based
    * on the current formation
    */
    Formation.prototype.getCardRow = function (position) {
        return Formation.FORMATION_CONFIG[this.type][position];
    };

    /**
    * Return the config array of the current formation
    */
    Formation.prototype.getFormationConfig = function () {
        return Formation.FORMATION_CONFIG[this.type];
    };
    Formation.FORMATION_CONFIG = {
        SKEIN_5: [3, 2, 1, 2, 3],
        VALLEY_5: [1, 2, 3, 2, 1],
        TOOTH_5: [1, 3, 1, 3, 1],
        WAVE_5: [3, 1, 2, 1, 3],
        FRONT_5: [1, 1, 1, 1, 1],
        MID_5: [2, 2, 2, 2, 2],
        REAR_5: [3, 3, 3, 3, 3],
        PIKE_5: [3, 3, 1, 3, 3],
        SHIELD_5: [1, 1, 3, 1, 1],
        PINCER_5: [3, 1, 3, 1, 3]
    };
    return Formation;
})();
/**
* A class represents a player
*/
var Player = (function () {
    /**
    * @param number id The player id. Usually 1 means the player/me and 2 means the opponent/opposing side
    * @param string name The name of the player
    * @param Formation formation The formation used by the player
    * @param number multiplier Any multiplier the player has, either by all out attack or by title
    */
    function Player(id, name, formation, multiplier) {
        this.id = id;
        this.name = name;
        this.formation = formation;
        this.multiplier = multiplier;
    }
    return Player;
})();
var Skill = (function () {
    function Skill(skillId) {
        var skillData = SkillDatabase[skillId];

        this.id = skillId;
        this.name = skillData.name;
        this.skillType = skillData.skillType;
        this.skillFunc = skillData.skillFunc;
        this.skillCalcType = skillData.skillCalcType;
        this.skillFuncArg1 = skillData.skillFuncArg1;
        this.skillFuncArg2 = skillData.skillFuncArg2;
        this.skillFuncArg3 = skillData.skillFuncArg3;
        this.skillFuncArg4 = skillData.skillFuncArg4;
        this.skillFuncArg5 = skillData.skillFuncArg5;
        this.skillRange = skillData.skillRange;
        this.maxProbability = skillData.maxProbability;
        this.ward = skillData.ward;

        if (typeof skillData.contact === undefined) {
            this.contact = -1;
        } else {
            this.contact = skillData.contact;
        }

        this.logic = SkillLogicFactory.getSkillLogic(this.skillFunc);

        this.range = RangeFactory.getRange(this.skillRange);
    }
    Skill.prototype.getSerializableObject = function () {
        return {
            id: this.id,
            name: this.name,
            skillType: this.skillType,
            skillFunc: this.skillFunc,
            skillCalcType: this.skillCalcType,
            skillFuncArg1: this.skillFuncArg1,
            skillFuncArg2: this.skillFuncArg2,
            skillFuncArg3: this.skillFuncArg3,
            skillFuncArg4: this.skillFuncArg4,
            skillFuncArg5: this.skillFuncArg5,
            skillRange: this.skillRange,
            maxProbability: this.maxProbability,
            ward: this.ward,
            contact: this.contact
        };
    };

    Skill.prototype.getSkillFuncArg = function (argnum) {
        if (argnum == 1) {
            return this.skillFuncArg1;
        } else if (argnum == 2) {
            return this.skillFuncArg2;
        } else if (argnum == 3) {
            return this.skillFuncArg3;
        } else if (argnum == 4) {
            return this.skillFuncArg4;
        } else if (argnum == 5) {
            return this.skillFuncArg5;
        }
    };

    Skill.prototype.execute = function (data) {
        this.logic.execute(data);
    };
    return Skill;
})();
function getDamageCalculatedByATK(attacker, defender, ignorePosition) {
    var ATTACK_FACTOR = 0.3;
    var DIFF_FACTOR = 0.2;

    var POS_ATTACK_FACTOR = {};
    POS_ATTACK_FACTOR[3 /* REAR */] = 0.8;
    POS_ATTACK_FACTOR[2 /* MID */] = 1;
    POS_ATTACK_FACTOR[1 /* FRONT */] = 1.2;

    var POS_DAMAGE_FACTOR = {};
    POS_DAMAGE_FACTOR[3 /* REAR */] = 0.8;
    POS_DAMAGE_FACTOR[2 /* MID */] = 1;
    POS_DAMAGE_FACTOR[1 /* FRONT */] = 1.2;

    var baseDamage = attacker.getATK() * ATTACK_FACTOR;
    var damage = ((attacker.getATK() - defender.getDEF()) * DIFF_FACTOR) + baseDamage;

    if (!ignorePosition) {
        damage *= POS_ATTACK_FACTOR[attacker.getFormationRow()];
        damage *= POS_DAMAGE_FACTOR[defender.getFormationRow()];
    }

    //set lower limit
    if (damage < baseDamage * 0.1) {
        damage = baseDamage * 0.1;
    }

    damage = Math.floor(damage * getRandomArbitary(0.9, 1.1));

    return damage;
}

function getDamageCalculatedByAGI(attacker, defender, ignorePosition) {
    var ATTACK_FACTOR = 0.3;
    var DIFF_FACTOR = 0.2;

    var POS_ATTACK_FACTOR = {};
    POS_ATTACK_FACTOR[3 /* REAR */] = 0.8;
    POS_ATTACK_FACTOR[2 /* MID */] = 1;
    POS_ATTACK_FACTOR[1 /* FRONT */] = 1.2;

    var POS_DAMAGE_FACTOR = {};
    POS_DAMAGE_FACTOR[3 /* REAR */] = 0.8;
    POS_DAMAGE_FACTOR[2 /* MID */] = 1;
    POS_DAMAGE_FACTOR[1 /* FRONT */] = 1.2;

    var baseDamage = attacker.getAGI() * ATTACK_FACTOR;
    var damage = ((attacker.getAGI() - defender.getDEF()) * DIFF_FACTOR) + baseDamage;

    if (!ignorePosition) {
        damage *= POS_ATTACK_FACTOR[attacker.getFormationRow()];
        damage *= POS_DAMAGE_FACTOR[defender.getFormationRow()];
    }

    //set lower limit
    if (damage < baseDamage * 0.1) {
        damage = baseDamage * 0.1;
    }

    damage = Math.floor(damage * getRandomArbitary(0.9, 1.1));

    return damage;
}

function getDamageCalculatedByWIS(attacker, defender) {
    var ATTACK_FACTOR = 0.3;
    var WIS_DEF_FACTOR = 0.5;
    var DIFF_FACTOR = 0.2;

    var baseDamage = attacker.getWIS() * ATTACK_FACTOR;
    var targetWisDef = (defender.getWIS() + defender.getDEF()) * WIS_DEF_FACTOR;
    var damage = ((attacker.getWIS() - targetWisDef) * DIFF_FACTOR) + baseDamage;

    //set lower limit
    if (damage < baseDamage * 0.1) {
        damage = baseDamage * 0.1;
    }

    damage = Math.floor(damage * getRandomArbitary(0.9, 1.1));

    return damage;
}
"use strict";
/**
* Some notes:
* - For attack skills, there has to be a "ward" attribute, which takes a value of "PHYSICAL", "BREATH" or "MAGICAL"
*   Counter skills also need the above, even though the ward will always be "PHYSICAL" for those skills
*
* - For skills with PHYSICAL ward and not random multihitting (like fork, AoE, sweeping...), there has to be a
*   "contact" attribute with 1 being "has/does contact"
*
* - There is no need for the baseProbability
*/
var SkillDatabase = {
    0: {
        name: "Default auto", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 5, maxProbability: 100, ward: "PHYSICAL"
    },
    2: {
        name: "Strength of Blades", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.5, skillFuncArg2: 1, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70
    },
    17: {
        name: "Berserk", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 0.8, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "PHYSICAL"
    },
    18: {
        name: "Rush", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 0.7, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "PHYSICAL"
    },
    23: {
        name: "Breath of Flame", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 7, maxProbability: 30, ward: "BREATH"
    },
    33: {
        name: "Whirlwind", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy AGI-based damage to three foes."
    },
    43: {
        name: "Windlash", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    46: {
        name: "Brawl", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    61: {
        name: "Cloak & Dagger", skillType: 5, skillFunc: 14, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 2, maxProbability: 50, ward: "PHYSICAL"
    },
    62: {
        name: "Cloak", skillType: 5, skillFunc: 12, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 2, maxProbability: 50
    },
    63: {
        name: "Shroud", skillType: 5, skillFunc: 12, skillCalcType: 0,
        skillFuncArg1: 0, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 50
    },
    111: {
        name: "Whorl of Wisdom", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL"
    },
    112: {
        name: "Whorl of Attack", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    114: {
        name: "Electric Shock", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 7, maxProbability: 30, ward: "MAGICAL"
    },
    118: {
        name: "Slashing Blade", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "PHYSICAL", contact: 1
    },
    119: {
        name: "Flash of Rage", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 0.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "MAGICAL",
        description: "Call down six random lightning bolts on foes."
    },
    120: {
        name: "Boon of Mind & Shield 2", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.2, skillFuncArg2: 3, skillFuncArg3: 2, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 70,
        description: "Raise WIS and DEF of all party members."
    },
    123: {
        name: "Flame Fist", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.7, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy fire damage to three random targets."
    },
    124: {
        name: "Ice Fist", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.7, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ice damage to three random targets."
    },
    125: {
        name: "Shield & Dagger", skillType: 5, skillFunc: 14, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 50, ward: "PHYSICAL",
        description: "Take damage in place of any ally and counter."
    },
    132: {
        name: "Boon of Blade & Wind 2", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.2, skillFuncArg2: 1, skillFuncArg3: 4, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 70,
        description: "Raise ATK and AGI of all party members."
    },
    133: {
        name: "Blade Ward 2", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.4, skillFuncArg2: 5, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 70,
        description: "Reduce physical damage taken by all allies."
    },
    134: {
        name: "Magic Ward 2", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.4, skillFuncArg2: 6, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 70,
        description: "Reduce magic damage taken by all allies."
    },
    138: {
        name: "Head Bash", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy physical damage to two random targets."
    },
    139: {
        name: "Mad Dash", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL"
    },
    141: {
        name: "Burning Rage", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 0.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "MAGICAL",
        description: "Engulf six random foes in flames."
    },
    142: {
        name: "Barrage", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 0.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal physical damage to five random targets."
    },
    144: {
        name: "Windcrush", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy damage to four foes."
    },
    154: {
        name: "Cloak & Dagger 2", skillType: 5, skillFunc: 14, skillCalcType: 1,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 2, maxProbability: 50, ward: "PHYSICAL"
    },
    156: {
        name: "Rebuke", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL"
    },
    161: {
        name: "Shadow Strike", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    167: {
        name: "Bulwark", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.4, skillFuncArg2: 5, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70
    },
    179: {
        name: "Sword of Justice", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal massive AGI-based damage to two random foes."
    },
    180: {
        name: "Proxy Counter", skillType: 5, skillFunc: 14, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 28, maxProbability: 50, ward: "PHYSICAL"
    },
    195: {
        name: "Warrior's Wrath", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal massive ATK-based damage to two random foes."
    },
    196: {
        name: "Spark Shot", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 0.8, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    212: {
        name: "Ghasthunt", skillType: 2, skillFunc: 3, skillCalcType: 2,
        skillFuncArg1: 1.2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    214: {
        name: "Blade of Madness", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.35, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "PHYSICAL", contact: 1,
        description: "Deals ATK-based damage to all foes."
    },
    216: {
        name: "Bodycheck", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 6, maxProbability: 30, ward: "PHYSICAL", contact: 1
    },
    217: {
        name: "Harrowing Trial", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "MAGICAL"
    },
    221: {
        name: "Skittering Darkness", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to three foes."
    },
    222: {
        name: "Boastful Blade", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL"
    },
    224: {
        name: "Feather Shot", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 2.1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal massive ATK-based damage to three random foes."
    },
    227: {
        name: "Muscle Play", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.65, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 7, maxProbability: 30, ward: "PHYSICAL", contact: 1,
        description: "Deal massive ATK-based damage to three foes."
    },
    229: {
        name: "Spirit Word", skillType: 2, skillFunc: 3, skillCalcType: 2,
        skillFuncArg1: 2.1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    232: {
        name: "Lightning web", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.15, skillFuncArg2: 2, skillFuncArg3: 0.3, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive WIS-based damage and sometimes paralyze three foes."
    },
    234: {
        name: "Lightning Spirits", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.15, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "MAGICAL",
        description: "Deal WIS-based damage to five random foes."
    },
    236: {
        name: "Flash", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.25, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL"
    },
    238: {
        name: "Shadow Slash", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.05, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    239: {
        name: "Dark Rush", skillType: 2, skillFunc: 4, skillCalcType: 3,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL"
    },
    240: {
        name: "Midnight Smile", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.2, skillFuncArg2: 4, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70
    },
    244: {
        name: "High Spirits", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.6, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to four random foes, regardless of position."
    },
    249: {
        name: "Steelscales", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 0.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "PHYSICAL"
    },
    251: {
        name: "Hungry Beak", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal ATK-based damage to five random foes."
    },
    253: {
        name: "Brutal Fist", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 2.1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL"
    },
    256: {
        name: "Silent Madness", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    258: {
        name: "Fatal Kiss", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.35, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "MAGICAL"
    },
    259: {
        name: "Hell Spark", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    264: {
        name: "Bone Crush", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.95, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal massive ATK-based damage to three random foes."
    },
    269: {
        name: "Tears of the Hideous", skillType: 2, skillFunc: 4, skillCalcType: 3,
        skillFuncArg1: 2.05, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive AGI-based damage to three random foes regardless of position."
    },
    275: {
        name: "Blinding Light", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.7, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to three random foes, regardless of position."
    },
    276: {
        name: "Divine Grief", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "MAGICAL",
        description: "Deal Massive WIS-based damage to two random foes, regardless of position."
    },
    280: {
        name: "Snake Charmer", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.05, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive WIS-based damage to three random foes, regardless of position."
    },
    282: {
        name: "Corpse Hymn", skillType: 2, skillFunc: 4, skillCalcType: 3,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "MAGICAL",
        description: "Deal AGI-based damage to five random foes, regardless of position."
    },
    288: {
        name: "Chain Attack", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 0.95, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "MAGICAL",
        description: "Deal WIS-based damage to six random foes, regardless of position."
    },
    293: {
        name: "Cruel Flame", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 1.7, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to four random foes, regardless of position."
    },
    294: {
        name: "Mocking Laugh", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 2.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal massive ATK-based damage to two random foes."
    },
    295: {
        name: "Dream Lure", skillType: 1, skillFunc: 19, skillCalcType: 0,
        skillFuncArg1: 0, skillFuncArg2: 4, skillFuncArg3: 0.25, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 7, maxProbability: 70,
        description: "Sometimes disable three foes at start of battle."
    },
    296: {
        name: "Blood Offering", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 1.2, skillFuncArg2: 4, skillFuncArg3: 0.3, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal ATK-based damage and disable six random foes, regardless of position."
    },
    297: {
        name: "Awe of the Wild", skillType: 2, skillFunc: 4, skillCalcType: 3,
        skillFuncArg1: 2.15, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive AGI-based damage to three random foes, regardless of position."
    },
    302: {
        name: "Ice Wall", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.4, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "BREATH"
    },
    303: {
        name: "Chill Horn", skillType: 2, skillFunc: 3, skillCalcType: 2,
        skillFuncArg1: 1.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    305: {
        name: "Dancing Flame", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "BREATH",
        description: "Deal WIS-based damage to four random foes, regardless of position."
    },
    307: {
        name: "Evil Wink", skillType: 2, skillFunc: 3, skillCalcType: 2,
        skillFuncArg1: 1.8, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    313: {
        name: "White Ruin", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "BREATH"
    },
    314: {
        name: "Fearless Laugh", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 32, maxProbability: 30, ward: "PHYSICAL", contact: 1
    },
    315: {
        name: "Trembling Horn", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to four random foes."
    },
    319: {
        name: "Magic Overwhelming", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.55, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to four random foes, regardless of position."
    },
    320: {
        name: "Mystic Teachings", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.1, skillFuncArg2: 3, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70,
        description: "Raise WIS of self and adjacent familiars at beginning of battle."
    },
    321: {
        name: "Roaring Blood", skillType: 2, skillFunc: 3, skillCalcType: 2,
        skillFuncArg1: 0.95, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal WIS-based damage to six random foes."
    },
    325: {
        name: "Rippling Flame", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.85, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to three random foes."
    },
    326: {
        name: "Heart of the Warrior", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.6, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to three random foes."
    },
    327: {
        name: "Test of Courage", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.6, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to three random foes."
    },
    340: {
        name: "Penance", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.25, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "PHYSICAL", contact: 1
    },
    341: {
        name: "Staff of Ages", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 1.15, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    349: {
        name: "Staff of Tyranny", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.55, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    351: {
        name: "Sword of Fealty", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    359: {
        name: "Seeping Darkness", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.25, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    360: {
        name: "Curse of Wrath", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "MAGICAL",
        description: "Deal WIS-based damage to six random foes, regardless of position."
    },
    361: {
        name: "Resplendent Light", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "MAGICAL",
        description: "Deal ATK-based damage to five random foes."
    },
    362: {
        name: "Rite of Vengeance", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.85, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL"
    },
    365: {
        name: "Bug Attack", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 1.95, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal heavy ATK-based damage to three random foes, regardless of position."
    },
    366: {
        name: "Bone Chill", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.7, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 32, maxProbability: 30, ward: "BREATH"
    },
    379: {
        name: "Dragon Aura", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.9, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to three random foes, regardless of position."
    },
    380: {
        name: "Feral Claws", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 0.95, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 17, maxProbability: 30, ward: "PHYSICAL"
    },
    381: {
        name: "Lion's Roar", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.4, skillFuncArg2: 6, skillFuncArg3: 7, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70
    },
    383: {
        name: "Flame of Cinders", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.65, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    385: {
        name: "Prominence", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal ATK-based damage to five random foes."
    },
    386: {
        name: "Sun's Mercy", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.15, skillFuncArg2: 1, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70,
        description: "Raise ATK of self and adjacent familiars."
    },
    390: {
        name: "Libra's Retribution", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.6, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    398: {
        name: "Knuckle Guard", skillType: 5, skillFunc: 12, skillCalcType: 0,
        skillFuncArg1: 0, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 50
    },
    406: {
        name: "Piercing Arrow", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 1.35, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 8, maxProbability: 30, ward: "PHYSICAL", contact: 0
    },
    407: {
        name: "Allure of the Rose", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "MAGICAL"
    },
    408: {
        name: "Covenant of the Rose", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.15, skillFuncArg2: 4, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 3, maxProbability: 70
    },
    412: {
        name: "Fires of Thirst", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "MAGICAL",
        description: "Deal WIS-based damage to five random foes, regardless of position."
    },
    416: {
        name: "Bone Smasher", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to four random foes, regardless of position."
    },
    418: {
        name: "Nemesis", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 7, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive WIS-based damage to up to three foes, ignoring position."
    },
    419: {
        name: "Ichthocannon", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    425: {
        name: "Lese Majesty", skillType: 5, skillFunc: 14, skillCalcType: 1,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 50, ward: "PHYSICAL"
    },
    427: {
        name: "Funerary Rush", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    440: {
        name: "Thunderstroke", skillType: 2, skillFunc: 4, skillCalcType: 3,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive AGI-based damage to two random foes, ignoring position."
    },
    441: {
        name: "Bolt of Judgment", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2.15, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive WIS-based damage to two random foes, ignoring position."
    },
    437: {
        name: "Mjolnir", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 1.5, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 32, maxProbability: 30, ward: "PHYSICAL", contact: 0,
        description: "Deal heavy ATK-based damage to up to four foes, ignoring position."
    },
    443: {
        name: "Fangs of the Devoted", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 23, maxProbability: 30, ward: "PHYSICAL"
    },
    447: {
        name: "Looming Nightmare", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.6, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 32, maxProbability: 30, ward: "MAGICAL",
        description: "Deal heavy WIS-based damage to up to four foes, ignoring position."
    },
    448: {
        name: "Leo's Claws", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    465: {
        name: "Stormcaller Pinion", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1.3, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "BREATH",
        description: "Deal WIS-based damage to five random foes, ignoring position."
    },
    466: {
        name: "Blade of Judgment", skillType: 2, skillFunc: 4, skillCalcType: 1,
        skillFuncArg1: 1.8, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    467: {
        name: "Atonement", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.3, skillFuncArg2: 5, skillFuncArg3: 7, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 70
    },
    473: {
        name: "Entomb", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.15, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "PHYSICAL"
    },
    476: {
        name: "Furious Horns", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "MAGICAL",
        description: "Deal massive WIS-based damage to three random foes, ignoring position."
    },
    484: {
        name: "Wall of the Brave", skillType: 5, skillFunc: 12, skillCalcType: 0,
        skillFuncArg1: 0, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 4, maxProbability: 50,
        description: "Take damage in place of allies"
    },
    485: {
        name: "Shield of the Coward", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 1, skillFuncArg2: 2, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 21, maxProbability: 70,
        description: "Raise DEF of self at start of battle."
    },
    489: {
        name: "Hardened Steel", skillType: 1, skillFunc: 1, skillCalcType: 0,
        skillFuncArg1: 0.7, skillFuncArg2: 5, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 21, maxProbability: 70,
        description: "Reduce physical damage taken by self greatly."
    },
    490: {
        name: "Steel Hooves", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.2, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 20, maxProbability: 30, ward: "PHYSICAL",
        description: "Deal ATK-based damage to five random foes."
    },
    10007: {
        name: "Standard Action", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 5, maxProbability: 100, ward: "MAGICAL"
    },
    10008: {
        name: "Standard Action", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 0.65, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 5, maxProbability: 100, ward: "MAGICAL"
    },
    10016: {
        name: "Standard Action", skillType: 2, skillFunc: 4, skillCalcType: 2,
        skillFuncArg1: 1, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 5, maxProbability: 100, ward: "MAGICAL"
    },
    99000: {
        name: "Raging Flames", skillType: 2, skillFunc: 3, skillCalcType: 3,
        skillFuncArg1: 2.4, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    },
    99002: {
        name: "Inferno", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.4, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 19, maxProbability: 30, ward: "PHYSICAL"
    },
    99003: {
        name: "Niten Ichi-ryu", skillType: 2, skillFunc: 3, skillCalcType: 1,
        skillFuncArg1: 1.75, skillFuncArg2: 0, skillFuncArg3: 0, skillFuncArg4: 0, skillFuncArg5: 0,
        skillRange: 16, maxProbability: 30, ward: "PHYSICAL"
    }
};
var SkillLogicFactory = (function () {
    function SkillLogicFactory() {
    }
    SkillLogicFactory.getSkillLogic = function (skillFunc) {
        switch (skillFunc) {
            case 1 /* BUFF */:
                return new BuffSkillLogic();
            case 19 /* AFFLICTION */:
                return new AfflictionSkillLogic();
            case 3 /* ATTACK */:
            case 4 /* MAGIC */:
                return new AttackSkillLogic();
            case 12 /* PROTECT */:
                return new ProtectSkillLogic();
            case 14 /* PROTECT_COUNTER */:
                return new ProtectCounterSkillLogic();
            default:
                throw new Error("Invalid skillFunc or not implemented");
        }
    };
    return SkillLogicFactory;
})();

var SkillLogic = (function () {
    function SkillLogic() {
        this.battleModel = BattleModel.getInstance();
        this.logger = BattleLogger.getInstance();
        this.cardManager = CardManager.getInstance();
    }
    SkillLogic.prototype.execute = function (data) {
    };
    return SkillLogic;
})();

var BuffSkillLogic = (function (_super) {
    __extends(BuffSkillLogic, _super);
    function BuffSkillLogic() {
        _super.call(this);
    }
    BuffSkillLogic.prototype.execute = function (data) {
        var skill = data.skill;
        var executor = data.executor;

        for (var skillFuncArgNum = 2; skillFuncArgNum <= 5; skillFuncArgNum++) {
            if (skill.getSkillFuncArg(skillFuncArgNum) == 0) {
                continue;
            }
            switch (skill.getSkillFuncArg(skillFuncArgNum)) {
                case 1 /* ATK */:
                case 2 /* DEF */:
                case 3 /* WIS */:
                case 4 /* AGI */:
                    var basedOnStatType = ENUM.SkillCalcType[skill.skillCalcType];
                    var skillMod = skill.skillFuncArg1;
                    var buffAmount = Math.round(skillMod * executor.getStat(basedOnStatType));
                    break;
                case 5 /* ATTACK_RESISTANCE */:
                case 6 /* MAGIC_RESISTANCE */:
                case 7 /* BREATH_RESISTANCE */:
                    var buffAmount = skill.skillFuncArg1;
                    break;
                default:
                    throw new Error("Wrong status type or not implemented");
            }

            var thingToBuff = skill.getSkillFuncArg(skillFuncArgNum);
            var targets = skill.range.getTargets(executor);

            for (var i = 0; i < targets.length; i++) {
                targets[i].changeStatus(thingToBuff, buffAmount);
                var description = targets[i].name + "'s " + ENUM.StatusType[thingToBuff] + " increased by " + buffAmount;
                this.logger.addMinorEvent(executor, targets[i], 2 /* STATUS */, ENUM.StatusType[thingToBuff], buffAmount, description, skill.id);
            }
        }
    };
    return BuffSkillLogic;
})(SkillLogic);

var AfflictionSkillLogic = (function (_super) {
    __extends(AfflictionSkillLogic, _super);
    function AfflictionSkillLogic() {
        _super.apply(this, arguments);
    }
    AfflictionSkillLogic.prototype.execute = function (data) {
        var targets = data.skill.range.getTargets(data.executor);

        for (var i = 0; i < targets.length; i++) {
            this.battleModel.processAffliction(data.executor, targets[i], data.skill);
        }
    };
    return AfflictionSkillLogic;
})(SkillLogic);

var AttackSkillLogic = (function (_super) {
    __extends(AttackSkillLogic, _super);
    function AttackSkillLogic() {
        _super.apply(this, arguments);
    }
    AttackSkillLogic.prototype.execute = function (data) {
        this.logger.addMajorEvent({
            description: data.executor.name + " procs " + data.skill.name,
            executorId: data.executor.id,
            skillId: data.skill.id
        });
        if (RangeFactory.isEnemyRandomRange(data.skill.skillRange)) {
            this.executeRandomAttackSkill(data.executor);
        } else {
            this.executeAttackSkillWithRangeTargets(data.executor);
        }
    };

    AttackSkillLogic.prototype.executeRandomAttackSkill = function (executor) {
        var skill = executor.attackSkill;
        var numTarget = skill.range.numTarget;

        for (var i = 0; i < numTarget && !executor.isDead; i++) {
            var targetIndex = this.cardManager.getValidSingleTarget(this.battleModel.oppositePlayerCards);

            if (targetIndex == -1) {
                // no valid target, miss a turn, continue to next card
                return;
            }

            // since we get a valid index with every iteration of the loop, there's no need
            // to check if the target is dead here
            var targetCard = this.battleModel.oppositePlayerCards[targetIndex];
            var protectSkillActivated = this.battleModel.processProtect(executor, targetCard, skill, null);

            // if not protected, proceed with the attack as normal
            if (!protectSkillActivated) {
                this.battleModel.damageToTarget(executor, targetCard, skill, null);
            }
        }
    };

    /**
    * Execute an attack skill that has the targets obtained from its range
    */
    AttackSkillLogic.prototype.executeAttackSkillWithRangeTargets = function (executor) {
        var skill = executor.attackSkill;
        var targets = skill.range.getTargets(executor);

        if (skill.contact == 0 || typeof skill.contact === undefined) {
            // if the skill doesn't make contact, it must be AoE, so only one fam can be protected
            // NOTE: the algorithm used here for protection may not be correct, since it makes the
            // proc rate not really what it should be. For example, if two cards, one can protect (A)
            // and one not (B), are hit by an AoE, B only has 35% chance of being protected, and not 70%,
            // since there's 50% that A will be hit first and therefore unable to protect later on when B
            // is the target (this is based on the assumption that a fam cannot be hit twice in an AoE)
            // shuffle the targets. This serves two purposes. First, we can iterate
            // through the array in a random manner. Second, since the order is not
            // simply left-to-right anymore, it reminds us that this is an AoE skill
            shuffle(targets);

            // assume only one protection can be proc during an AoE skill. Is it true?
            var aoeProtectSkillActivated = false;

            // keep track of targets attacked, to make sure a fam can only be attacked once. So if a fam has already been
            // attacked, it cannot protect another fam later on
            var targetsAttacked = {};

            for (var i = 0; i < targets.length; i++) {
                var targetCard = targets[i];

                // a target can be dead, for example from protecting another fam
                if (targetCard.isDead) {
                    continue;
                }

                var protectSkillActivated = false;

                // if no protect skill has been activated at all during this AoE, we can try to
                // protect this target, otherwise no protect can be activated to protect this target
                // also, if the target has already been attacked (i.e. it protected another card before), then
                // don't try to protect it
                if (!aoeProtectSkillActivated && !targetsAttacked[targetCard.id]) {
                    protectSkillActivated = this.battleModel.processProtect(executor, targetCard, skill, targetsAttacked);
                    if (protectSkillActivated) {
                        aoeProtectSkillActivated = true;
                    }
                }

                // if not protected, proceed with the attack as normal
                // also need to make sure the target is not already attacked
                if (!protectSkillActivated && !targetsAttacked[targetCard.id]) {
                    this.battleModel.damageToTarget(executor, targetCard, skill, null);
                    targetsAttacked[targetCard.id] = true;
                }
            }
        } else {
            for (var i = 0; i < targets.length && !executor.isDead; i++) {
                var targetCard = targets[i];

                // a target can be dead, for example from protecting another fam
                if (targetCard.isDead) {
                    continue;
                }

                var protectSkillActivated = this.battleModel.processProtect(executor, targetCard, skill, null);

                // if not protected, proceed with the attack as normal
                if (!protectSkillActivated) {
                    this.battleModel.damageToTarget(executor, targetCard, skill, null);
                }
            }
        }
    };
    return AttackSkillLogic;
})(SkillLogic);

var ProtectSkillLogic = (function (_super) {
    __extends(ProtectSkillLogic, _super);
    function ProtectSkillLogic() {
        _super.apply(this, arguments);
    }
    ProtectSkillLogic.prototype.execute = function (data) {
        var protector = data.executor;
        var protectSkill = data.skill;

        // first redirect the original attack to the protecting fam
        var additionalDesc = protector.name + " procs " + protectSkill.name + " to protect " + data.targetCard.name + ". ";
        this.battleModel.damageToTarget(data.attacker, protector, data.attackSkill, additionalDesc);

        // update the targetsAttacked if necessary
        if (data.targetsAttacked) {
            data.targetsAttacked[protector.id] = true;
        }
    };
    return ProtectSkillLogic;
})(SkillLogic);

var ProtectCounterSkillLogic = (function (_super) {
    __extends(ProtectCounterSkillLogic, _super);
    function ProtectCounterSkillLogic() {
        _super.apply(this, arguments);
    }
    ProtectCounterSkillLogic.prototype.execute = function (data) {
        var protector = data.executor;
        var protectSkill = data.skill;

        // first redirect the original attack to the protecting fam
        var additionalDesc = protector.name + " procs " + protectSkill.name + " to protect " + data.targetCard.name + ". ";
        this.battleModel.damageToTarget(data.attacker, protector, data.attackSkill, additionalDesc);

        // update the targetsAttacked if necessary
        if (data.targetsAttacked) {
            data.targetsAttacked[protector.id] = true;
        }

        // counter phase
        if (!protector.isDead) {
            var additionalDesc = protector.name + " counters " + data.attacker.name + "! ";
            this.battleModel.damageToTarget(protector, data.attacker, protectSkill, additionalDesc);
        }
    };
    return ProtectCounterSkillLogic;
})(SkillLogic);
var RangeFactory = (function () {
    function RangeFactory() {
    }
    RangeFactory.getRange = function (id) {
        var range = null;
        if (this.isEnemyRandomRange(id)) {
            range = this.createEnemyRandomRange(id);
        } else if (this.isEnemyNearRange(id)) {
            range = this.createEnemyNearRange(id);
        } else {
            range = this.createRange(id);
        }
        return range;
    };

    RangeFactory.isEnemyRandomRange = function (id) {
        return !!RangeFactory.ENEMY_RANDOM_RANGE_TARGET_NUM[id];
    };

    RangeFactory.createEnemyRandomRange = function (id) {
        return new EnemyRandomRange(id, RangeFactory.ENEMY_RANDOM_RANGE_TARGET_NUM[id]);
    };

    RangeFactory.isEnemyNearRange = function (id) {
        return !!RangeFactory.ENEMY_NEAR_RANGE_TARGET_NUM[id];
    };

    RangeFactory.createEnemyNearRange = function (id) {
        return new EnemyNearRange(id, RangeFactory.ENEMY_NEAR_RANGE_TARGET_NUM[id]);
    };

    RangeFactory.createRange = function (id) {
        switch (id) {
            case 2:
                return new BothSidesRange(id);
            case 3:
                return new SelfBothSidesRange(id);
            case 4:
                return new AllRange(id);
            case 8:
                return new EnemyAllRange(id);
            case 21:
                return new SelfRange(id);
            default:
                throw new Error("Invalid range or not implemented");
        }
    };
    RangeFactory.ENEMY_RANDOM_RANGE_TARGET_NUM = {
        16: 3,
        17: 6,
        19: 4,
        20: 5,
        23: 2
    };

    RangeFactory.ENEMY_NEAR_RANGE_TARGET_NUM = {
        5: 1,
        6: 2,
        7: 3,
        32: 4,
        33: 5
    };
    return RangeFactory;
})();

var BaseRange = (function () {
    function BaseRange(id) {
        this.id = id;
    }
    BaseRange.prototype.getTargets = function (executor) {
        // to be overrridden
        return null;
    };
    return BaseRange;
})();

var EnemyRandomRange = (function (_super) {
    __extends(EnemyRandomRange, _super);
    function EnemyRandomRange(id, numTarget) {
        _super.call(this, id);
        this.numTarget = numTarget;
    }
    return EnemyRandomRange;
})(BaseRange);

var BothSidesRange = (function (_super) {
    __extends(BothSidesRange, _super);
    function BothSidesRange(id) {
        _super.call(this, id);
    }
    BothSidesRange.prototype.getTargets = function (executor) {
        var targets = [];

        var leftCard = CardManager.getInstance().getLeftSideCard(executor);
        if (leftCard && !leftCard.isDead) {
            targets.push(leftCard);
        }

        var rightCard = CardManager.getInstance().getRightSideCard(executor);
        if (rightCard && !rightCard.isDead) {
            targets.push(rightCard);
        }

        return targets;
    };
    return BothSidesRange;
})(BaseRange);

var SelfRange = (function (_super) {
    __extends(SelfRange, _super);
    function SelfRange(id) {
        _super.call(this, id);
    }
    SelfRange.prototype.getTargets = function (executor) {
        var targets = [];

        if (!executor.isDead) {
            targets.push(executor);
        }

        return targets;
    };
    return SelfRange;
})(BaseRange);

var SelfBothSidesRange = (function (_super) {
    __extends(SelfBothSidesRange, _super);
    function SelfBothSidesRange(id) {
        _super.call(this, id);
    }
    SelfBothSidesRange.prototype.getTargets = function (executor) {
        var targets = [];

        if (!executor.isDead) {
            targets.push(executor);
        }

        var leftCard = CardManager.getInstance().getLeftSideCard(executor);
        if (leftCard && !leftCard.isDead) {
            targets.push(leftCard);
        }

        var rightCard = CardManager.getInstance().getRightSideCard(executor);
        if (rightCard && !rightCard.isDead) {
            targets.push(rightCard);
        }

        return targets;
    };
    return SelfBothSidesRange;
})(BaseRange);

var AllRange = (function (_super) {
    __extends(AllRange, _super);
    function AllRange(id) {
        _super.call(this, id);
    }
    AllRange.prototype.getTargets = function (executor) {
        var targets = [];
        var partyCards = CardManager.getInstance().getPlayerCards(executor.player);

        for (var i = 0; i < partyCards.length; i++) {
            if (!partyCards[i].isDead) {
                targets.push(partyCards[i]);
            }
        }
        return targets;
    };
    return AllRange;
})(BaseRange);

var EnemyNearRange = (function (_super) {
    __extends(EnemyNearRange, _super);
    function EnemyNearRange(id, numTarget) {
        _super.call(this, id);
        this.numTarget = numTarget;
        this.maxDistance = EnemyNearRange.MAX_DISTANCE_FROM_CENTER[numTarget];
    }
    EnemyNearRange.prototype.getTargets = function (executor) {
        // get center enemy
        var centerEnemy = CardManager.getInstance().getNearestSingleOpponentTarget(executor);
        var enemyCards = CardManager.getInstance().getEnemyCards(executor.player);

        // only upto 2 and not 4 since the max distance is 2 anyway
        var offsetArray = [0, -1, 1, -2, 2];
        var targets = [];
        var targetCount = 0;

        for (var i = 0; i < offsetArray.length; i++) {
            if (targetCount >= this.numTarget || Math.abs(offsetArray[i]) > this.maxDistance) {
                break;
            }
            var currentEnemyIndex = centerEnemy.formationColumn + offsetArray[i];
            var currentEnemyCard = enemyCards[currentEnemyIndex];
            if (currentEnemyCard && !currentEnemyCard.isDead) {
                targetCount++;
                targets.push(enemyCards[currentEnemyIndex]);
            }
        }

        return targets;
    };
    EnemyNearRange.MAX_DISTANCE_FROM_CENTER = {
        1: 1,
        2: 1,
        3: 1,
        4: 2,
        5: 2
    };
    return EnemyNearRange;
})(BaseRange);

var EnemyAllRange = (function (_super) {
    __extends(EnemyAllRange, _super);
    function EnemyAllRange(id) {
        _super.call(this, id);
    }
    EnemyAllRange.prototype.getTargets = function (executor) {
        var enemyCards = CardManager.getInstance().getEnemyCards(executor.player);
        var targets = [];
        for (var i = 0; i < enemyCards.length; i++) {
            var currentEnemyCard = enemyCards[i];
            if (currentEnemyCard && !currentEnemyCard.isDead) {
                targets.push(currentEnemyCard);
            }
        }
        return targets;
    };
    return EnemyAllRange;
})(BaseRange);
/**
* Returns a random number between min (inclusive) and max (exclusive)
*/
function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
* Returns a random integer between min (inclusive) and max (inclusive)
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Get an URL parameter
*/
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

/**
* Shuffle an array. The argument array will be modified.
*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* Get a random element from an array
*/
function getRandomElement(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}

/**
* Remove an element with the supplied index from an array.
*/
function removeElementAtIndex(array, index) {
    array.splice(index, 1);
}

/**
* Get a random property of an object
*/
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1 / ++count)
            result = prop;
    return result;
}

/**
* Given a link to a (already scaled) wikia image, return a new scaled version with the specified width
* @param link The link to the original scaled wikia image
* @param newWidth The width of the new image
* @return The link to the new scaled image
*/
function getScaledWikiaImageLink(link, newWidth) {
    // TODO: maybe we should use regex...
    var lastSlash = link.lastIndexOf("/");
    var scaledName = link.substring(lastSlash + 1);

    // get the original image name
    var firstOriginalImageNamePosition = scaledName.indexOf("px-") + 3;
    var originalName = scaledName.substring(firstOriginalImageNamePosition);

    // the new scaled image new
    var newScaledName = newWidth + "px-" + originalName;

    // original image link with the slash
    var originalLink = link.substring(0, lastSlash + 1);

    // complete new link
    var newScaledLink = originalLink + newScaledName;
    return newScaledLink;
}

function getSerializableObjectArray(array) {
    var toReturn = [];
    for (var i = 0; i < array.length; i++) {
        toReturn.push(array[i].getSerializableObject());
    }
    return toReturn;
}
/// <reference path="affliction.ts"/>
/// <reference path="battleLogger.ts"/>
/// <reference path="card.ts"/>
/// <reference path="cardManager.ts"/>
/// <reference path="enums.ts"/>
/// <reference path="famDatabase.ts"/>
/// <reference path="formation.ts"/>
/// <reference path="player.ts"/>
/// <reference path="skill.ts"/>
/// <reference path="skillCalcType.ts"/>
/// <reference path="skillDatabase.ts"/>
/// <reference path="skillFunc.ts"/>
/// <reference path="skillRange.ts"/>
/// <reference path="util.ts"/>
var BattleModel = (function () {
    function BattleModel(data, mode) {
        this.playerWon = null;
        // only used for quickly get a card by its id
        this.allCardsById = {};
        if (BattleModel._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        BattleModel._instance = this;
        this.logger = BattleLogger.getInstance();
        this.cardManager = CardManager.getInstance();

        var player1formation;
        var player2formation;
        var player1cardsInfo = [];
        var player2cardsInfo = [];

        if (mode == "random") {
            player1formation = pickRandomProperty(Formation.FORMATION_CONFIG);
            player2formation = pickRandomProperty(Formation.FORMATION_CONFIG);
            for (var i = 0; i < 5; i++) {
                player1cardsInfo.push(famDatabase[pickRandomProperty(famDatabase)]);
                player2cardsInfo.push(famDatabase[pickRandomProperty(famDatabase)]);
            }
        } else {
            player1formation = data.player1formation;
            player2formation = data.player2formation;

            player1cardsInfo = data.player1cardsInfo;
            player2cardsInfo = data.player2cardsInfo;
        }

        this.player1 = new Player(1, "Player 1", new Formation(player1formation), 1); // me
        this.player2 = new Player(2, "Player 2", new Formation(player2formation), 1); // opp

        // initialize the cards
        this.player1Cards = [];
        this.player2Cards = [];
        this.allCards = [];

        for (var i = 0; i < 5; i++) {
            var player1Skills = this.makeSkillArray(player1cardsInfo[i].skills);
            var player2Skills = this.makeSkillArray(player2cardsInfo[i].skills);

            var stats1 = new Stats(player1cardsInfo[i].hp, player1cardsInfo[i].atk, player1cardsInfo[i].def, player1cardsInfo[i].wis, player1cardsInfo[i].agi);
            var stats2 = new Stats(player2cardsInfo[i].hp, player2cardsInfo[i].atk, player2cardsInfo[i].def, player2cardsInfo[i].wis, player2cardsInfo[i].agi);

            var auto1;
            if (player1cardsInfo[i].autoAttack) {
                auto1 = new Skill(player1cardsInfo[i].autoAttack);
            } else {
                auto1 = new Skill(0);
            }

            var auto2;
            if (player2cardsInfo[i].autoAttack) {
                auto2 = new Skill(player2cardsInfo[i].autoAttack);
            } else {
                auto2 = new Skill(0);
            }

            this.player1Cards[i] = new Card(player1cardsInfo[i].name, stats1, player1Skills, this.player1, i, player1cardsInfo[i].imageLink, auto1); //my cards
            this.player2Cards[i] = new Card(player2cardsInfo[i].name, stats2, player2Skills, this.player2, i, player2cardsInfo[i].imageLink, auto2); // opp card
            this.allCards.push(this.player1Cards[i]);
            this.allCards.push(this.player2Cards[i]);

            this.allCardsById[this.player1Cards[i].id] = this.player1Cards[i];
            this.allCardsById[this.player2Cards[i].id] = this.player2Cards[i];
        }

        this.cardManager.sortAllCards();

        // save the initial field snapshot
        this.logger.saveInitialField();

        this.logger.displayFormationAndFamOnCanvas();
    }
    BattleModel.getInstance = function () {
        if (BattleModel._instance === null) {
            BattleModel._instance = new BattleModel();
        }
        return BattleModel._instance;
    };

    /**
    * Resets everything
    * Used for testing only
    */
    BattleModel.resetAll = function () {
        BattleModel.removeInstance();
        BattleLogger.removeInstance();
    };

    /**
    * Allows to create a new instance
    * Used for testing only
    */
    BattleModel.removeInstance = function () {
        BattleModel._instance = null;
    };

    /**
    * Given an array of skill ids, return an array of Skills
    */
    BattleModel.prototype.makeSkillArray = function (skills) {
        var skillArray = [];

        for (var i = 0; i < 3; i++) {
            if (skills[i]) {
                skillArray.push(new Skill(skills[i]));
            }
        }

        return skillArray;
    };

    BattleModel.prototype.getOppositePlayer = function (player) {
        if (player == this.player1) {
            return this.player2;
        } else if (player == this.player2) {
            return this.player1;
        } else {
            throw new Error("Invalid player");
        }
    };

    BattleModel.prototype.damageToTarget = function (attacker, target, skill, additionalDescription) {
        var skillMod = skill.skillFuncArg1;
        var ignorePosition = (skill.skillFunc == 4 /* MAGIC */);

        var baseDamage;

        switch (skill.skillCalcType) {
            case (0 /* DEFAULT */):
            case (2 /* WIS */):
                baseDamage = getDamageCalculatedByWIS(attacker, target);
                break;
            case (1 /* ATK */):
                baseDamage = getDamageCalculatedByATK(attacker, target, ignorePosition);
                break;
            case (3 /* AGI */):
                baseDamage = getDamageCalculatedByAGI(attacker, target, ignorePosition);
                break;
        }

        // apply the multiplier
        var damage = skillMod * baseDamage;

        switch (skill.ward) {
            case ("PHYSICAL"):
                damage = Math.round(damage * (1 - target.status.attackResistance));
                break;
            case ("MAGICAL"):
                damage = Math.round(damage * (1 - target.status.magicResistance));
                break;
            case ("BREATH"):
                damage = Math.round(damage * (1 - target.status.breathResistance));
                break;
            default:
                throw new Error("Wrong type of ward. Maybe you forgot to include in the skill?");
        }

        target.changeHP(-1 * damage);

        this.processAffliction(attacker, target, skill);

        if (!additionalDescription) {
            additionalDescription = "";
        }
        var description = additionalDescription + target.name + " lost " + damage + "hp (remaining " + target.getHP() + "/" + target.originalStats.hp + ")";
        this.logger.addMinorEvent(attacker, target, 1 /* HP */, "HP", (-1) * damage, description, skill.id);
        if (target.getHP() <= 0) {
            this.logger.displayMinorEvent(target.name + " is dead");
            target.isDead = true;
        }
    };

    BattleModel.prototype.processAffliction = function (executor, target, skill) {
        var type = skill.skillFuncArg2;
        var prob = skill.skillFuncArg3;

        if (!type) {
            return;
        }

        if (skill.skillFuncArg4 || skill.skillFuncArg5) {
            // arg4: number of turns for silent & blind, % for venom
            // arg5: miss prob. for blind
            var optParam = [skill.skillFuncArg4, skill.skillFuncArg5];
        }

        if (Math.random() <= prob) {
            target.setAffliction(type, optParam);
            var description = target.name + " is now " + ENUM.AfflictionType[type];
            var maxTurn = 1;
            if (type == 7 /* BLIND */ || type == 5 /* SILENT */) {
                maxTurn = skill.skillFuncArg4;
            } else if (type == 1 /* POISON */) {
                maxTurn = -1;
            }
            this.logger.addMinorEvent(executor, target, 3 /* AFFLICTION */, ENUM.AfflictionType[type], maxTurn, description, 0);
        }
    };

    BattleModel.prototype.startBattle = function () {
        this.logger.startBattleLog();

        this.performOpeningSkills();
        this.cardManager.sortAllCards();

        var finished = false;

        while (!finished) {
            this.logger.currentTurn++;
            this.logger.bblogTurn("Turn " + this.logger.currentTurn);

            for (var i = 0; i < 10 && !finished; i++) {
                var currentCard = this.allCards[i];
                this.currentPlayer = currentCard.player;
                this.currentPlayerCards = this.cardManager.getPlayerCards(this.currentPlayer); // cards of the attacking player
                this.oppositePlayer = this.getOppositePlayer(this.currentPlayer);
                this.oppositePlayerCards = this.cardManager.getPlayerCards(this.oppositePlayer);

                if (!currentCard || currentCard.isDead) {
                    continue;
                }

                // procs active skill if we can
                var attackSkill = currentCard.attackSkill;
                if (attackSkill) {
                    if (Math.random() * 100 <= attackSkill.maxProbability && currentCard.canUseSkill()) {
                        attackSkill.execute({
                            executor: currentCard,
                            skill: attackSkill
                        });
                    } else {
                        this.executeNormalAttack(currentCard);
                    }
                } else {
                    this.executeNormalAttack(currentCard);
                }

                if (this.cardManager.isAllDead(this.oppositePlayerCards)) {
                    finished = true;
                    this.playerWon = this.currentPlayer;
                    this.logger.addMajorEvent({
                        description: currentCard.getPlayerName() + " has won"
                    });
                } else if (this.cardManager.isAllDead(this.currentPlayerCards)) {
                    finished = true;
                    this.playerWon = this.oppositePlayer;
                    this.logger.addMajorEvent({
                        description: this.oppositePlayer.name + " has won"
                    });
                }
            }

            if (finished) {
                break;
            }

            // process end turn events: afflictions, etc.
            this.logger.addMajorEvent({
                description: "Turn end"
            });

            for (var i = 0; i < 10 && !finished; i++) {
                var currentCard = this.allCards[i];
                if (currentCard.isDead) {
                    continue;
                }
                var cured = currentCard.updateAffliction();

                // if cured, make a log
                if (!currentCard.affliction && cured) {
                    var desc = currentCard.name + " is cured of affliction!";
                    this.logger.addMinorEvent(currentCard, currentCard, 3 /* AFFLICTION */, "NONE", -2, desc, 0);
                }
            }
        }
        return this.playerWon.name;
    };

    BattleModel.prototype.executeNormalAttack = function (attacker) {
        if (!attacker.canAttack()) {
            return;
        }

        this.logger.addMajorEvent({
            description: attacker.name + " attacks!"
        });

        // create a default auto attack skill
        var autoSkill = attacker.autoAttack;

        var targets = autoSkill.range.getTargets(attacker);

        for (var i = 0; i < targets.length && !attacker.isDead; i++) {
            var targetCard = targets[i];

            // a target can be dead, for example from protecting another fam
            if (targetCard.isDead) {
                continue;
            }

            var protectSkillActivated = this.processProtect(attacker, targetCard, autoSkill, null);

            // if not protected, proceed with the attack as normal
            if (!protectSkillActivated) {
                this.damageToTarget(attacker, targetCard, autoSkill, null);
            }
        }
    };

    /**
    * Process the protecting sequence. Return true if a protect has been executed
    * or false if no protect has been executed
    *
    * @param targetsAttacked optional, set to null when multiple protect/hit is allowed
    */
    BattleModel.prototype.processProtect = function (attacker, targetCard, attackSkill, targetsAttacked) {
        // now check if someone on the enemy side can protect before the damage is dealt
        var enemyCards = this.cardManager.getEnemyCards(attacker.player);
        var protectSkillActivated = false;
        for (var i = 0; i < enemyCards.length && !protectSkillActivated; i++) {
            if (enemyCards[i].isDead) {
                continue;
            }
            var protectSkill = enemyCards[i].protectSkill;
            if (protectSkill) {
                var protector = enemyCards[i];

                // a fam cannot protect itself, unless the skillRange is 21 (hard-coded here for now)
                if (this.cardManager.isSameCard(targetCard, protector) && protectSkill.skillRange != 21) {
                    continue;
                }

                // if a fam that has been attacked is not allowed to protect (like in the case of AoE), continue
                if (targetsAttacked && targetsAttacked[protector.id]) {
                    continue;
                }

                if (!protector.canUseSkill()) {
                    continue;
                }

                // now check if the original target is in the protect range of the protector
                var defenseTargets = protectSkill.range.getTargets(protector);
                if (this.cardManager.isCardInList(targetCard, defenseTargets)) {
                    if (Math.random() * 100 <= protectSkill.maxProbability) {
                        // ok, so now activate the protect skill
                        protectSkillActivated = true;
                        protectSkill.execute({
                            executor: protector,
                            skill: protectSkill,
                            attacker: attacker,
                            attackSkill: attackSkill,
                            targetCard: targetCard,
                            targetsAttacked: targetsAttacked
                        });
                    }
                }
            } else {
                continue;
            }
        }
        return protectSkillActivated;
    };

    BattleModel.prototype.performOpeningSkills = function () {
        for (var i = 0; i < this.player1Cards.length; i++) {
            var skill1 = this.player1Cards[i].openingSkill;
            if (skill1) {
                if (Math.random() * 100 < skill1.maxProbability && this.player1Cards[i].canUseSkill()) {
                    this.logger.addMajorEvent({
                        description: this.player1Cards[i].name + " procs " + skill1.name,
                        executorId: this.player1Cards[i].id,
                        skillId: skill1.id
                    });
                    skill1.execute({
                        executor: this.player1Cards[i],
                        skill: skill1
                    });
                }
            }
        }

        for (var i = 0; i < this.player2Cards.length; i++) {
            var skill2 = this.player2Cards[i].openingSkill;
            if (skill2) {
                if (Math.random() * 100 < skill2.maxProbability && this.player2Cards[i].canUseSkill()) {
                    this.logger.addMajorEvent({
                        description: this.player2Cards[i].name + " procs " + skill2.name,
                        executorId: this.player2Cards[i].id,
                        skillId: skill2.id
                    });
                    skill2.execute({
                        executor: this.player2Cards[i],
                        skill: skill2
                    });
                }
            }
        }
    };
    BattleModel.IS_MASS_SIMULATION = false;

    BattleModel._instance = null;
    return BattleModel;
})();
