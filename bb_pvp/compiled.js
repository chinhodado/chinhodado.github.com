﻿var __extends = this.__extends || function (d, b) {
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
            case 8 /* BURN */:
                return new BurnAffliction();
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
    Affliction.getAfflictionAdjective = function (type) {
        switch (type) {
            case 7 /* BLIND */:
                return "Blinded";
            case 4 /* DISABLE */:
                return "Disabled";
            case 3 /* FROZEN */:
                return "Frozen";
            case 2 /* PARALYSIS */:
                return "Paralyzed";
            case 1 /* POISON */:
                return "Poisoned";
            case 5 /* SILENT */:
                return "Silent";
            case 8 /* BURN */:
                return "Burned";
            default:
                throw new Error("Invalid affliction type!");
        }
    };

    Affliction.prototype.canAttack = function () {
        throw new Error("Implement this");
    };

    Affliction.prototype.canUseSkill = function () {
        return this.canAttack();
    };

    Affliction.prototype.canMiss = function () {
        return false;
    };

    Affliction.prototype.update = function (card) {
        throw new Error("Implement this");
    };

    Affliction.prototype.add = function (option) {
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
        var damage = Math.floor(card.originalStats.hp * this.percent / 100);
        if (damage > PoisonAffliction.MAX_DAMAGE) {
            damage = PoisonAffliction.MAX_DAMAGE;
        }

        BattleModel.getInstance().damageToTargetDirectly(card, damage, "poison");
    };

    PoisonAffliction.prototype.add = function (option) {
        var percent = option.percent;
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

    SilentAffliction.prototype.add = function (option) {
        this.validTurnNum = option.turnNum;
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

    BlindAffliction.prototype.add = function (option) {
        this.validTurnNum = option.turnNum;
        this.missProb = option.missProb;
    };
    return BlindAffliction;
})(Affliction);

var BurnAffliction = (function (_super) {
    __extends(BurnAffliction, _super);
    function BurnAffliction() {
        _super.call(this, 8 /* BURN */);
        this.damage = 0;
        this.values = [];
    }
    BurnAffliction.prototype.canAttack = function () {
        return true;
    };

    BurnAffliction.prototype.update = function (card) {
        BattleModel.getInstance().damageToTargetDirectly(card, this.damage, "burn");
    };

    BurnAffliction.prototype.add = function (option) {
        var arr = this.values;
        arr.push(option.damage);
        arr.sort(function (a, b) {
            return b - a;
        });

        this.damage = 0;
        for (var i = 0; i < BurnAffliction.STACK_NUM; i++) {
            if (arr[i]) {
                this.damage += arr[i];
            }
        }
    };
    BurnAffliction.STACK_NUM = 3;
    return BurnAffliction;
})(Affliction);

var BattleGraphic = (function () {
    function BattleGraphic() {
        this.coordArray = {
            1: [],
            2: []
        };
        if (BattleGraphic._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        BattleGraphic._instance = this;

        this.logger = BattleLogger.getInstance();
        this.battle = BattleModel.getInstance();
        this.cardMan = CardManager.getInstance();
    }
    BattleGraphic.getInstance = function () {
        if (BattleGraphic._instance === null) {
            throw new Error("You're not supposed to create this object this way");
        }
        return BattleGraphic._instance;
    };

    BattleGraphic.removeInstance = function () {
        BattleGraphic._instance = null;
    };

    BattleGraphic.prototype.displayFormationAndFamOnCanvas = function () {
        if (BattleGraphic.GRAPHIC_DISABLED) {
            return;
        }

        var playerFormations = {};
        playerFormations[1] = this.battle.player1.formation.getFormationConfig();

        var player2formation = this.battle.player2.formation.getFormationConfig();
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

        var draw = SVG('svg').size(400, 600).attr('id', 'mainSvg').attr('class', 'svg');

        for (var player = 1; player <= 2; player++) {
            if (player == 2) {
                var skillImg = draw.image('img/skillBg.png', 300, 29).move(55, 5).attr('id', 'p2SkillBg');
                var text = draw.text('placeholder').font({ size: 14 }).fill({ color: '#fff' }).attr('id', 'p2SkillText');
                draw.group().attr('id', 'p2SkillBgTextGroup').add(skillImg).add(text).opacity(0);
            } else if (player == 1) {
                skillImg = draw.image('img/skillBg.png', 300, 29).move(55, 270).attr('id', 'p1SkillBg');
                text = draw.text('placeholder').font({ size: 14 }).fill({ color: '#fff' }).attr('id', 'p1SkillText');
                draw.group().attr('id', 'p1SkillBgTextGroup').add(skillImg).add(text).opacity(0).move(0, 300);
            }

            var PLAYER_GROUP_WIDTH = 350;
            var PLAYER_GROUP_HEIGHT = 80;

            var horizontalStep = PLAYER_GROUP_WIDTH / 10;
            var verticalStep = PLAYER_GROUP_HEIGHT / 2;

            var coordArray = [];
            this.coordArray[player] = coordArray;

            var groupPlayer = draw.group().attr('id', 'p' + player + 'group');
            if ((BattleGraphic.HIDE_PLAYER1 && player == 1) || (BattleGraphic.HIDE_PLAYER2 && player == 2)) {
                groupPlayer.hide();
            }

            if (player == 1) {
                groupPlayer.move(30, 400);
            } else if (player == 2) {
                groupPlayer.move(30, 100);
            }

            for (i = 0; i < 5; i++) {
                var bulletX = ((i + 1) * 2 - 1) * horizontalStep;
                var bulletY = (playerFormations[player][i] - 1) * verticalStep;

                coordArray.push([bulletX, bulletY]);
            }

            if (BattleGraphic.SHOW_FORMATION_LINE) {
                for (i = 0; i < 5; i++) {
                    var diameter = 10;
                    var dot = draw.circle(diameter).move(coordArray[i][0] - diameter / 2, coordArray[i][1] - diameter / 2);
                    groupPlayer.add(dot);
                }

                for (i = 0; i < 4; i++) {
                    var line = draw.line(coordArray[i][0], coordArray[i][1], coordArray[i + 1][0], coordArray[i + 1][1]).stroke({ width: 1 });
                    groupPlayer.add(line);
                }
            }

            var imageLinksArray = [];
            var playerCards = this.cardMan.getPlayerCurrentMainCards(this.battle.getPlayerById(player));
            var reserveCards = this.cardMan.getPlayerOriginalReserveCards(this.battle.getPlayerById(player));

            for (var fam = 0; fam < playerCards.length; fam++) {
                imageLinksArray.push(getScaledWikiaImageLink(playerCards[fam].imageLink, BattleGraphic.IMAGE_WIDTH_BIG));
            }

            for (i = 0; i < 5; i++) {
                var image_x_coord = coordArray[i][0] - BattleGraphic.IMAGE_WIDTH / 2;

                var image_y_coord = coordArray[i][1] - BattleGraphic.IMAGE_WIDTH * 1.5 / 2;

                var image = draw.image(imageLinksArray[i]).move(image_x_coord, image_y_coord).attr('id', 'p' + player + 'f' + i + 'image').loaded(function (loader) {
                    this.size(BattleGraphic.IMAGE_WIDTH);
                });

                var damageText = draw.text('0').font({ size: 22, family: BattleGraphic.FONT }).attr({ fill: '#fff', stroke: '#000', 'stroke-width': '2px' }).center(coordArray[i][0], coordArray[i][1]).attr('id', 'p' + player + 'f' + i + 'damageText').opacity(0);

                var explosion = draw.image('img/explosion.png', 70, 70).move(image_x_coord, image_y_coord).attr('id', 'p' + player + 'f' + i + 'explosion').opacity(0);

                var group = draw.group().attr('id', 'p' + player + 'f' + i + 'group');
                group.add(image);
                group.add(damageText);
                group.add(explosion);

                var click = function (arg) {
                    var cardMan = CardManager.getInstance();
                    var card = cardMan.getCurrentMainCardByIndex(arg[0], arg[1]);
                    return function () {
                        showCardDetailDialog(cardMan.getCardInfoForDialog(card));
                    };
                };
                group.on('click', click([player, i]));

                groupPlayer.add(group);

                if (this.battle.isBloodClash) {
                    var reserve_img = new Image();
                    reserve_img.src = getScaledWikiaImageLink(reserveCards[i].imageLink, BattleGraphic.IMAGE_WIDTH_BIG);
                }
            }
        }
    };

    BattleGraphic.prototype.resetInitialField = function () {
        for (var player = 1; player <= 2; player++) {
            for (var index = 0; index < 5; index++) {
                this.displayHP(100, player, index, 0);
                this.getAfflictionText(player, index).hide();
            }
        }
        this.displayAllCardImages(0);
    };

    BattleGraphic.prototype.displayAllCardImages = function (majorIndex) {
        var field = this.logger.getFieldAtMajorIndex(majorIndex);

        for (var p = 1; p <= 2; p++) {
            for (var f = 0; f < 5; f++) {
                var image = SVG.get('p' + p + 'f' + f + 'image');
                var card = field["player" + p + "Cards"][f];
                image.load(getScaledWikiaImageLink(card.imageLink, BattleGraphic.IMAGE_WIDTH_BIG));
            }
        }
    };

    BattleGraphic.prototype.displayHP = function (percent, player, index, animDuration) {
        var draw = SVG.get('mainSvg');

        var image_x_coord = this.coordArray[player][index][0] - BattleGraphic.IMAGE_WIDTH / 2;

        var image_y_coord = this.coordArray[player][index][1] - BattleGraphic.IMAGE_WIDTH * 1.5 / 2;

        var xstart = Math.round(image_x_coord);

        var ystart = image_y_coord + BattleGraphic.IMAGE_WIDTH * 1.5;

        var width = BattleGraphic.IMAGE_WIDTH;
        var height = 5;

        if (percent < 0) {
            percent = 0;
        }

        var hpbarId = 'p' + player + 'f' + index + 'hp';
        var hpbar = SVG.get(hpbarId);

        if (!hpbar) {
            hpbar = draw.rect(width, height).style({ 'stroke-width': 1, 'stroke': '#000000' }).attr('id', hpbarId).move(xstart, ystart);
            var groupId = 'p' + player + 'f' + index + 'group';

            var group = SVG.get(groupId);
            group.add(hpbar);
        }

        var hpGradientId = 'p' + player + 'f' + index + 'hpGradient';
        var hpGradient = SVG.get(hpGradientId);

        var duration = 1;
        if (!isNaN(animDuration)) {
            duration = animDuration;
        }

        if (!hpGradient) {
            hpGradient = draw.gradient('linear', function (stop) {
                stop.at({ offset: '100%', color: '#00ff00' }).attr('id', 'p' + player + 'f' + index + 'hpgs1');
                stop.at({ offset: '100%', color: 'transparent' }).attr('id', 'p' + player + 'f' + index + 'hpgs2');
            }).attr('id', hpGradientId);
        } else {
            var s1 = SVG.get('p' + player + 'f' + index + 'hpgs1');
            var s2 = SVG.get('p' + player + 'f' + index + 'hpgs2');
            s1.animate(duration + 's').update({ offset: percent + '%' });
            s2.animate(duration + 's').update({ offset: percent + '%' });
        }

        hpbar.fill(hpGradient);

        this.displayDeadAliveFamiliar(player, index, percent <= 0);
    };

    BattleGraphic.prototype.displayDamageTextAndHP = function (playerId, famIndex, majorIndex, minorIndex) {
        var field = this.logger.getFieldAtMinorIndex(majorIndex, minorIndex);
        var targetInfo = field["player" + playerId + "Cards"][famIndex];
        var stats = targetInfo.stats;
        var originalStats = targetInfo.originalStats;

        var center_x = this.coordArray[playerId][famIndex][0];
        var center_y = this.coordArray[playerId][famIndex][1];

        var data = this.logger.minorEventLog[majorIndex][minorIndex];

        if (data.missed) {
            var txt = "missed";
        } else if (data.evaded) {
            txt = "evaded";
        } else if (data.isKilled) {
            txt = "killed";
        } else {
            txt = Math.abs(data.amount) + "";
        }

        var txtColor = '#fff';
        if (data.amount > 0) {
            txtColor = '#00ff00';
        }

        var damageText = SVG.get('p' + playerId + 'f' + famIndex + 'damageText');
        damageText.text(txt).font({ size: 22 }).attr({ fill: txtColor }).center(center_x, center_y).opacity(1).front();
        damageText.animate({ duration: '2s' }).opacity(0);

        this.displayHP(stats.hp / originalStats.hp * 100, playerId, famIndex);
    };

    BattleGraphic.prototype.displayWard = function (playerId, famIndex, majorIndex, minorIndex) {
        var data = this.logger.minorEventLog[majorIndex][minorIndex];

        if (data.missed) {
            return;
        }

        var type;
        switch (data.wardUsed) {
            case 1 /* PHYSICAL */:
                type = 5 /* ATTACK_RESISTANCE */;
                break;
            case 2 /* MAGICAL */:
                type = 6 /* MAGIC_RESISTANCE */;
                break;
            case 3 /* BREATH */:
                type = 7 /* BREATH_RESISTANCE */;
                break;
            default:
                return;
        }

        var wardImg = this.getWard(playerId, famIndex, type);
        wardImg.opacity(1).animate({ delay: '0.5s' }).opacity(0);
    };

    BattleGraphic.prototype.displayAfflictionText = function (playerId, famIndex, majorIndex, minorIndex) {
        var data = this.logger.minorEventLog[majorIndex][minorIndex];
        var svgAfflictTxt = this.getAfflictionText(playerId, famIndex);

        if (data.affliction.isFinished) {
            svgAfflictTxt.hide();
        } else {
            var text = Affliction.getAfflictionAdjective(data.affliction.type);
            svgAfflictTxt.text(text).show();
        }
    };

    BattleGraphic.prototype.displayAllAfflictionText = function (majorIndex) {
        var field = this.logger.getFieldAtMajorIndex(majorIndex);

        for (var player = 1; player <= 2; player++) {
            for (var fam = 0; fam < 5; fam++) {
                var svgAfflictTxt = this.getAfflictionText(player, fam);
                var data = field["player" + player + "Cards"][fam];

                if (!data.affliction) {
                    svgAfflictTxt.hide();
                } else {
                    var text = Affliction.getAfflictionAdjective(data.affliction.type);
                    svgAfflictTxt.text(text).show();
                }
            }
        }
    };

    BattleGraphic.prototype.displayPostDamage = function (playerId, famIndex, majorIndex, minorIndex) {
        this.displayWard(playerId, famIndex, majorIndex, minorIndex);
        this.displayDamageTextAndHP(playerId, famIndex, majorIndex, minorIndex);
    };

    BattleGraphic.prototype.displayDeadAliveFamiliar = function (player, fam, isDead) {
        var image = SVG.get('p' + player + 'f' + fam + 'image');
        var filter = SVG.get('darkenFilter');
        if (isDead) {
            if (!filter) {
                image.filter(function (add) {
                    add.componentTransfer({
                        rgb: { type: 'linear', slope: 0.05 }
                    });
                });

                filter = image.filterer;
                filter.attr('id', 'darkenFilter');

                image.filter(filter);
            } else {
                image.filter(filter);
            }
        } else {
            image.unfilter();
        }
    };

    BattleGraphic.prototype.displayMajorEventAnimation = function (majorIndex) {
        var majorLog = this.logger.majorEventLog;
        var that = this;

        if (majorIndex >= majorLog.length) {
            battleFinishedCallback();
            return;
        }

        if (!majorLog[majorIndex]) {
            if (BattleGraphic.PLAY_MODE == 'AUTO') {
                var nextIndex = +majorIndex + 1;
                this.displayMajorEventAnimation(nextIndex);
            }
            return;
        }

        if (BattleGraphic.PLAY_MODE == 'AUTO') {
            var autoCallback = function () {
                that.displayMajorEventAnimation(majorIndex + 1);
            };
        }

        if (majorLog[majorIndex].skillId && SkillDatabase[majorLog[majorIndex].skillId].isAutoAttack) {
            this.displayMinorEventAnimation(majorIndex, 0, { callback: autoCallback });
        } else {
            var callback = function () {
                that.displayMinorEventAnimation(majorIndex, 0, { callback: autoCallback });
            };

            this.displayProcSkill(majorLog[majorIndex].executorId, majorLog[majorIndex].skillId, { callback: callback });
        }
    };

    BattleGraphic.prototype.displayProcSkill = function (executorId, skillId, option) {
        if (!executorId || !skillId) {
            if (option.callback) {
                option.callback();
            }
            return;
        }

        var executor = this.cardMan.getCardById(executorId);
        var group = this.getCardImageGroup(executor);

        if (!option.noProcEffect) {
            var scaleFactor = 1.3;
            var cx = group.cx();
            var cy = group.cy();

            var D1 = 1, D05 = 0.5;
            if (option.durationRatio) {
                D1 *= option.durationRatio;
                D05 *= option.durationRatio;
            }

            if (Skill.isMagicSkill(skillId)) {
                var procEffect = this.getProcEffect(executor.getPlayerId(), executor.formationColumn, 'spellCircle');
            } else {
                procEffect = this.getProcEffect(executor.getPlayerId(), executor.formationColumn, 'lineSpark');
            }

            SVG.get('p' + executor.getPlayerId() + 'f' + executor.formationColumn + 'group').front();

            procEffect.opacity(1);
            procEffect.animate({ duration: '3s' }).rotate(180).after(function () {
                this.rotate(0);
                this.remove();
            });

            group.animate({ duration: D1 + 's' }).transform({ a: scaleFactor, b: 0, c: 0, d: scaleFactor, e: cx - scaleFactor * cx, f: cy - scaleFactor * cy }).after(function () {
                this.animate({ duration: D1 + 's', delay: D05 + 's' }).transform({ a: 1, b: 0, c: 0, d: 1, e: cx - 1 * cx, f: cy - 1 * cy }).after(function () {
                    procEffect.opacity(0).remove();
                    if (option.callback)
                        option.callback();
                });
            });
        }

        var groupSkillBg = SVG.get('p' + executor.getPlayerId() + 'SkillBgTextGroup');
        var svgText = SVG.get('p' + executor.getPlayerId() + 'SkillText');

        var yText = executor.getPlayerId() == 1 ? 272 : 8;

        var skillName = SkillDatabase[skillId].name;

        svgText.text(skillName).move(55 + 150 - svgText.bbox().width / 2, yText);

        groupSkillBg.animate({ duration: '0.5s' }).opacity(1).after(function () {
            this.animate({ duration: '0.5s', delay: '1.5s' }).opacity(0);
        });
    };

    BattleGraphic.prototype.displayMinorEventAnimation = function (majorIndex, minorIndex, option) {
        if (typeof option === "undefined") { option = {}; }
        var minorLog = this.logger.minorEventLog;

        if (!minorLog[majorIndex] || minorIndex >= minorLog[majorIndex].length) {
            if (option.callback) {
                option.callback();
            }
            return;
        }

        var data = minorLog[majorIndex][minorIndex];

        switch (data.type) {
            case 6 /* TEXT */:
                if (minorIndex < minorLog[majorIndex].length) {
                    this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
                }
                break;
            case 1 /* HP */:
                if (!data.executorId) {
                    this.displayHpChangeEvent(majorIndex, minorIndex, option);
                } else {
                    this.displayBattleEvent(majorIndex, minorIndex, option);
                }
                break;
            case 2 /* STATUS */:
                this.displayStatusEvent(majorIndex, minorIndex, option);
                break;
            case 9 /* BC_ADDPROB */:
                this.displayBcAddProbEvent(majorIndex, minorIndex, option);
                break;
            case 3 /* AFFLICTION */:
                this.displayAfflictionEvent(majorIndex, minorIndex, option);
                break;
            case 8 /* RESERVE_SWITCH */:
                this.displayReserveSwitchEvent(majorIndex, minorIndex, option);
                break;
            case 5 /* DESCRIPTION */:
                this.displayDescriptionEvent(majorIndex, minorIndex, option);
                break;
            case 7 /* REVIVE */:
                this.displayReviveEvent(majorIndex, minorIndex, option);
                break;
            case 4 /* PROTECT */:
                this.displayProtectEvent(majorIndex, minorIndex, option);
                break;
            case 51 /* BATTLE_DESCRIPTION */:
                this.displayBattleDescriptionEvent(majorIndex, minorIndex, option);
                break;
            default:
                throw new Error("Invalid minor event type!");
        }
    };

    BattleGraphic.prototype.displayBattleDescriptionEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        if (minorIndex < minorLog[majorIndex].length) {
            this.getMainBattleEffect().text(data.battleDesc).center(200, 300).opacity(1).animate({ duration: '3s' }).opacity(0);
            this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
        }
    };

    BattleGraphic.prototype.displayStatusEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        if (minorIndex < minorLog[majorIndex].length) {
            var target = this.cardMan.getCardById(data.targetId);

            var center_x = this.coordArray[target.getPlayerId()][target.formationColumn][0];
            var center_y = this.coordArray[target.getPlayerId()][target.formationColumn][1];

            if (data.status.type == 5 /* ATTACK_RESISTANCE */ || data.status.type == 6 /* MAGIC_RESISTANCE */ || data.status.type == 7 /* BREATH_RESISTANCE */) {
                var ward = this.getWard(target.getPlayerId(), target.formationColumn, data.status.type);
                ward.opacity(1).animate({ delay: '0.5s' }).opacity(0);
            } else {
                var fontSize = 18;

                if (data.status.isDispelled) {
                    var displayText = "dispelled";
                } else if (data.status.isClearDebuff) {
                    displayText = "cleared";
                } else if (data.status.isAllUp) {
                    displayText = "All Stats Up";
                    fontSize = 15;
                } else if (data.status.type == 18 /* WILL_ATTACK_AGAIN */) {
                    displayText = "EXTRA ACT";
                } else if (data.status.type == 16 /* ACTION_ON_DEATH */) {
                    displayText = "Revive On";
                } else if (data.status.type == 8 /* SKILL_PROBABILITY */) {
                    displayText = "Prob. Up";
                } else if (data.status.type == 17 /* HP_SHIELD */) {
                    displayText = "HP Up";
                } else {
                    var upDownText = data.amount < 0 ? " Down" : " Up";
                    var statuses = Skill.getStatusModified(data.skillId);
                    displayText = ENUM.StatusType[statuses[0]] + upDownText;

                    if (statuses[1]) {
                        var displayText2 = ENUM.StatusType[statuses[1]] + upDownText;
                        displayText = displayText + "\n" + displayText2;
                    }
                }

                var damageText = SVG.get('p' + target.getPlayerId() + 'f' + target.formationColumn + 'damageText');
                damageText.text(displayText).center(center_x, center_y).font({ size: fontSize }).opacity(1).animate({ delay: '0.5s' }).opacity(0);
            }

            this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
        }
    };

    BattleGraphic.prototype.displayReviveEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];

        var executor = this.cardMan.getCardById(data.executorId);
        var executorGroup = this.getCardImageGroup(executor);

        executorGroup.front();
        SVG.get('p' + executor.getPlayerId() + 'group').front();

        if (minorIndex < minorLog[majorIndex].length) {
            var target = this.cardMan.getCardById(data.targetId);
            var playerId = target.getPlayerId();
            var index = target.formationColumn;
            var center_x = this.coordArray[playerId][index][0];
            var center_y = this.coordArray[playerId][index][1];

            var damageText = SVG.get('p' + playerId + 'f' + index + 'damageText');
            damageText.text("REVIVED").center(center_x, center_y).font({ size: 18 }).opacity(1).animate({ delay: '0.5s' }).opacity(0);
            this.displayHP(data.reviveHPRatio * 100, playerId, index);
            this.getAfflictionText(playerId, index).hide();

            this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
        }
    };

    BattleGraphic.prototype.displayProtectEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        var that = this;
        var executor = this.cardMan.getCardById(data.executorId);
        var executorGroup = this.getCardImageGroup(executor);
        var x1 = executorGroup.rbox().x;
        var y1 = executorGroup.rbox().y;

        executorGroup.front();
        SVG.get('p' + executor.getPlayerId() + 'group').front();

        if (minorIndex < minorLog[majorIndex].length) {
            var protectedCard = this.cardMan.getCardById(data.protect.protectedId);
            var protectedGroup = this.getCardImageGroup(protectedCard);

            var attackerCard = this.cardMan.getCardById(data.protect.attackerId);
            var attackerGroup = this.getCardImageGroup(attackerCard);

            var x_protected = protectedGroup.rbox().x;
            var y_protected = protectedGroup.rbox().y;

            var x_attacker = attackerGroup.rbox().x;
            var y_attacker = attackerGroup.rbox().y;

            this.displayProcSkill(executor.id, data.skillId, { noProcEffect: true });

            var y_offset = 70;
            if (executor.getPlayerId() == 1) {
                y_offset *= -1;
            }

            var moveTime = 0.5;
            var moveBackTime = 0.5;
            if (data.protect.counter && Skill.isIndirectSkill(data.protect.counteredSkillId)) {
                moveTime = 0.1;
                moveBackTime = 0.1;
            }

            var nextData = minorLog[majorIndex][minorIndex + 1];
            var explosion = SVG.get('p' + executor.getPlayerId() + 'f' + executor.formationColumn + 'explosion');

            executorGroup.animate({ duration: moveTime + 's' }).move(x_protected - x1, y_protected - y1 + y_offset).after(function () {
                if (Skill.isIndirectSkill(nextData.skillId)) {
                    var exploDuration = 0.2;
                    if (Skill.isWisAutoAttack(nextData.skillId)) {
                        var procEffect = that.getProcEffect(attackerCard.getPlayerId(), attackerCard.formationColumn, 'spellCircle');
                        procEffect.animate({ duration: '0.2s' }).opacity(1);
                        exploDuration = 0.5;
                    } else if (Skill.isAtkAutoAttack(nextData.skillId)) {
                        procEffect = that.getProcEffect(attackerCard.getPlayerId(), attackerCard.formationColumn, 'lineSpark');
                        procEffect.animate({ duration: '0.2s' }).opacity(1);
                        exploDuration = 0.5;
                    }

                    explosion.animate({ duration: exploDuration + 's' }).opacity(1).after(function () {
                        explosion.opacity(0);

                        if (procEffect) {
                            procEffect.remove();
                        }

                        that.displayPostDamage(executor.getPlayerId(), executor.formationColumn, majorIndex, minorIndex + 1);

                        executorGroup.animate({ duration: moveBackTime + 's' }).move(0, 0).after(function () {
                            that.displayMinorEventAnimation(majorIndex, minorIndex + 2, option);
                        });
                    });
                } else {
                    SVG.get('p' + attackerCard.getPlayerId() + 'group').front();
                    attackerGroup.animate({ duration: '0.5s' }).move(executorGroup.rbox().x - x_attacker, executorGroup.rbox().y - y_attacker).after(function () {
                        explosion.opacity(1);

                        that.displayPostDamage(executor.getPlayerId(), executor.formationColumn, majorIndex, minorIndex + 1);

                        attackerGroup.animate({ duration: '0.3s' }).move(0, 0);

                        executorGroup.animate({ duration: moveBackTime + 's' }).move(0, 0).after(function () {
                            explosion.opacity(0);
                            that.displayMinorEventAnimation(majorIndex, minorIndex + 2, option);
                        });
                    });
                }
            });
        }
    };

    BattleGraphic.prototype.displayReserveSwitchEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        var that = this;
        if (minorIndex < minorLog[majorIndex].length) {
            var main = this.cardMan.getCardById(data.reserveSwitch.mainId);
            var reserve = this.cardMan.getCardById(data.reserveSwitch.reserveId);
            var group = this.getCardImageGroup(main);
            var mainId = main.getPlayerId();

            var image = this.getCardImage(main);
            var newLink = getScaledWikiaImageLink(reserve.imageLink, BattleGraphic.IMAGE_WIDTH_BIG);
            image.load(newLink);

            var y_offset = mainId == 1 ? 255 : -255;
            group.move(0, y_offset).animate(1000).move(0, 0).after(function () {
                that.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
            });

            this.displayHP(100, mainId, main.formationColumn, 0);
            this.getAfflictionText(mainId, main.formationColumn).hide();
        }
    };

    BattleGraphic.prototype.displayDescriptionEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        var that = this;

        var executor = this.cardMan.getCardById(data.executorId);
        var executorGroup = this.getCardImageGroup(executor);

        executorGroup.front();
        SVG.get('p' + executor.getPlayerId() + 'group').front();

        if (minorIndex < minorLog[majorIndex].length) {
            if (!data.noProcEffect) {
                this.displayProcSkill(executor.id, data.skillId, {
                    callback: function () {
                        that.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
                    },
                    durationRatio: 0.5
                });
            } else {
                this.displayProcSkill(executor.id, data.skillId, {
                    noProcEffect: true
                });
                this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
            }
        }
    };

    BattleGraphic.prototype.displayBcAddProbEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        if (minorIndex < minorLog[majorIndex].length) {
            if (data.bcAddProb.isMain) {
                var target = this.cardMan.getCardById(data.bcAddProb.targetId);
                var center_x = this.coordArray[target.getPlayerId()][target.formationColumn][0];
                var center_y = this.coordArray[target.getPlayerId()][target.formationColumn][1];

                var damageText = SVG.get('p' + target.getPlayerId() + 'f' + target.formationColumn + 'damageText');
                damageText.text("+10%").center(center_x, center_y).font({ size: 25 }).opacity(1).animate({ delay: '2s' }).opacity(0);
            }

            this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
        }
    };

    BattleGraphic.prototype.displayAfflictionEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        if (minorIndex < minorLog[majorIndex].length) {
            var target = this.cardMan.getCardById(data.targetId);
            this.displayAfflictionText(target.getPlayerId(), target.formationColumn, majorIndex, minorIndex);

            this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
        }
    };

    BattleGraphic.prototype.displayHpChangeEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        if (minorIndex < minorLog[majorIndex].length) {
            var target = this.cardMan.getCardById(data.targetId);

            this.displayPostDamage(target.getPlayerId(), target.formationColumn, majorIndex, minorIndex);
            this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
        }
    };

    BattleGraphic.prototype.displayBattleEvent = function (majorIndex, minorIndex, option) {
        var minorLog = this.logger.minorEventLog;
        var majorLog = this.logger.majorEventLog;
        var data = minorLog[majorIndex][minorIndex];
        var that = this;

        var target = this.cardMan.getCardById(data.targetId);
        var targetGroup = this.getCardImageGroup(target);
        var x = targetGroup.rbox().x;
        var y = targetGroup.rbox().y;

        var executor = this.cardMan.getCardById(data.executorId);
        var executorGroup = this.getCardImageGroup(executor);
        var x1 = executorGroup.rbox().x;
        var y1 = executorGroup.rbox().y;

        executorGroup.front();
        SVG.get('p' + executor.getPlayerId() + 'group').front();

        var explosion = SVG.get('p' + target.getPlayerId() + 'f' + target.formationColumn + 'explosion');
        if (Skill.isAoeSkill(data.skillId)) {
            var exploSet = [];

            if (data.executorId === majorLog[majorIndex].executorId && data.skillId === majorLog[majorIndex].skillId) {
                var aoeTargets = this.logger.getTargetsInMajorEvent(majorIndex);
            } else {
                aoeTargets = this.logger.getNestedTargetsInMajorEvent(majorIndex, minorIndex);
                var isNested = true;
            }

            if ((isNested && option.noNestedAttackAnim) || (!isNested && option.noAttackAnim)) {
                var noAttackAnim = true;
            }

            for (var i = 0; i < aoeTargets.length; i++) {
                var exploTargetCol = this.cardMan.getCardById(aoeTargets[i]).formationColumn;
                exploSet.push(SVG.get('p' + target.getPlayerId() + 'f' + exploTargetCol + 'explosion'));
            }

            if (noAttackAnim) {
                this.displayPostDamage(target.getPlayerId(), target.formationColumn, majorIndex, minorIndex);
                this.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
            } else {
                var exploDuration = 0.4;
                if (Skill.isWisAutoAttack(data.skillId)) {
                    var procEffect = this.getProcEffect(executor.getPlayerId(), executor.formationColumn, 'spellCircle');
                    procEffect.animate({ duration: '0.2s' }).opacity(1);
                    exploDuration = 0.8;
                } else if (Skill.isAtkAutoAttack(data.skillId)) {
                    procEffect = this.getProcEffect(executor.getPlayerId(), executor.formationColumn, 'lineSpark');
                    procEffect.animate({ duration: '0.2s' }).opacity(1);
                    exploDuration = 0.8;
                }

                if (!isNested) {
                    option.noAttackAnim = true;
                } else {
                    option.noNestedAttackAnim = true;
                }

                function getCallback(graphic, majorIndex, minorIndex, option, target, procEffect, exploSet) {
                    return function () {
                        for (var i = 0; i < exploSet.length; i++) {
                            exploSet[i].opacity(0);
                        }

                        if (procEffect) {
                            procEffect.remove();
                        }

                        graphic.displayPostDamage(target.getPlayerId(), target.formationColumn, majorIndex, minorIndex);
                        graphic.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
                    };
                }

                for (i = 0; i < exploSet.length; i++) {
                    if (i == exploSet.length - 1) {
                        var callback = getCallback(that, majorIndex, minorIndex, option, target, procEffect, exploSet);
                    }

                    exploSet[i].animate({ duration: exploDuration + 's' }).opacity(1).after(callback);
                }
            }
        } else if (Skill.isIndirectSkill(data.skillId)) {
            exploDuration = 0.2;

            if (Skill.isWisAutoAttack(data.skillId)) {
                procEffect = this.getProcEffect(executor.getPlayerId(), executor.formationColumn, 'spellCircle');
                procEffect.animate({ duration: '0.2s' }).opacity(1);
                exploDuration = 0.4;
            }

            explosion.animate({ duration: exploDuration + 's' }).opacity(1).after(function () {
                explosion.opacity(0);

                if (procEffect) {
                    procEffect.remove();
                }

                that.displayPostDamage(target.getPlayerId(), target.formationColumn, majorIndex, minorIndex);
                that.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
            });
        } else {
            executorGroup.animate({ duration: '0.5s' }).move(x - x1, y - y1).after(function () {
                if (!data.missed) {
                    explosion.opacity(1);
                }

                that.displayPostDamage(target.getPlayerId(), target.formationColumn, majorIndex, minorIndex);

                this.animate({ duration: '0.5s' }).move(0, 0).after(function () {
                    explosion.opacity(0);
                    that.displayMinorEventAnimation(majorIndex, minorIndex + 1, option);
                });
            });
        }
    };

    BattleGraphic.prototype.getCardImage = function (card) {
        return SVG.get('p' + card.getPlayerId() + 'f' + card.formationColumn + 'image');
    };

    BattleGraphic.prototype.getCardImageGroup = function (card) {
        return SVG.get('p' + card.getPlayerId() + 'f' + card.formationColumn + 'group');
    };

    BattleGraphic.prototype.getWard = function (playerId, famIndex, type) {
        var wardTxt, wardFileName;
        switch (type) {
            case 5 /* ATTACK_RESISTANCE */:
                wardTxt = "physicalWard";
                wardFileName = "physical_ward.png";
                break;
            case 6 /* MAGIC_RESISTANCE */:
                wardTxt = "magicalWard";
                wardFileName = "magical_ward.png";
                break;
            case 7 /* BREATH_RESISTANCE */:
                wardTxt = "breathWard";
                wardFileName = "breath_ward.png";
                break;
            default:
                throw new Error("Invalid type of ward");
        }

        var ward = SVG.get('p' + playerId + 'f' + famIndex + wardTxt);

        if (!ward) {
            ward = SVG.get('mainSvg').image('img/' + wardFileName, 70, 70).center(this.coordArray[playerId][famIndex][0], this.coordArray[playerId][famIndex][1]).attr('id', 'p' + playerId + 'f' + famIndex + wardTxt).opacity(0);
            SVG.get('p' + playerId + 'f' + famIndex + 'group').add(ward);
        }

        return ward;
    };

    BattleGraphic.prototype.getAfflictionText = function (playerId, famIndex) {
        var txt = SVG.get('p' + playerId + 'f' + famIndex + 'afflictText');

        if (!txt) {
            txt = SVG.get('mainSvg').text('Paralyzed').font({ size: 14, family: BattleGraphic.FONT }).attr({ fill: '#fff', stroke: '#000', 'stroke-width': BattleGraphic.AFFLICTION_TEXT_STROKE_WIDTH }).center(this.coordArray[playerId][famIndex][0], this.coordArray[playerId][famIndex][1] + BattleGraphic.IMAGE_WIDTH * 1.5 / 2 + 20).attr('id', 'p' + playerId + 'f' + famIndex + 'afflictText').hide();
            SVG.get('p' + playerId + 'f' + famIndex + 'group').add(txt);
        }

        return txt;
    };

    BattleGraphic.prototype.getProcEffect = function (playerId, famIndex, type) {
        var file = type == "spellCircle" ? "circle_blue.png" : "lineSpark.png";

        var effect = SVG.get('mainSvg').image('img/' + file, 150, 150).center(this.coordArray[playerId][famIndex][0], this.coordArray[playerId][famIndex][1]).attr('id', 'p' + playerId + 'f' + famIndex + 'spellCircle').opacity(0);
        SVG.get('p' + playerId + 'f' + famIndex + 'group').add(effect);

        return effect;
    };

    BattleGraphic.prototype.getMainBattleEffect = function () {
        var txt = SVG.get('battleText');

        if (!txt) {
            txt = SVG.get('mainSvg').text('0').font({ size: 24, family: BattleGraphic.FONT }).attr({ fill: '#fff', stroke: '#000', 'stroke-width': BattleGraphic.AFFLICTION_TEXT_STROKE_WIDTH }).center(200, 300).attr('id', 'battleText').opacity(0);
        }

        return txt;
    };
    BattleGraphic.HIDE_PLAYER1 = false;
    BattleGraphic.HIDE_PLAYER2 = false;
    BattleGraphic.GRAPHIC_DISABLED = false;

    BattleGraphic.SHOW_FORMATION_LINE = false;
    BattleGraphic.IMAGE_WIDTH = 70;
    BattleGraphic.IMAGE_WIDTH_BIG = 120;
    BattleGraphic.PLAY_MODE = 'MANUAL';
    BattleGraphic.FONT = 'Alegreya Sans, Cooper Black';
    BattleGraphic.AFFLICTION_TEXT_STROKE_WIDTH = '1px';

    BattleGraphic._instance = null;
    return BattleGraphic;
})();
var BattleLogger = (function () {
    function BattleLogger() {
        this.minorEventLog = [];
        this.minorEventFields = [];
        this.majorEventLog = [];
        this.currentTurn = 0;
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

    BattleLogger.removeInstance = function () {
        BattleLogger._instance = null;
    };

    BattleLogger.prototype.displayMajorEvent = function (index) {
        if (!BattleLogger.IS_DEBUG_MODE) {
            return;
        }

        var data = this.majorEventLog[index];
        var id = "turn" + this.currentTurn + "events";
        var battleEventDiv = document.getElementById("battleEventDiv");
        var turnEventList = document.getElementById(id);

        if (!turnEventList) {
            turnEventList = document.createElement("ul");
            turnEventList.setAttribute("id", id);
            battleEventDiv.appendChild(turnEventList);
        }

        var newEvent = document.createElement("li");
        newEvent.innerHTML = "<a>" + data.description + "</a>";
        newEvent.setAttribute("tabindex", index + "");
        newEvent.setAttribute("id", index + "");

        newEvent.onclick = function () {
            BattleLogger.getInstance().displayEventLogAtIndex(this.id);
        };
        turnEventList.appendChild(newEvent);
    };

    BattleLogger.prototype.addMajorEvent = function (data) {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        this.majorEventLog.push(data);
        this.displayMajorEvent(this.majorEventLog.length - 1);
    };

    BattleLogger.prototype.bblogTurn = function (data) {
        if (BattleModel.IS_MASS_SIMULATION || !BattleLogger.IS_DEBUG_MODE) {
            return;
        }

        var battleEventDiv = document.getElementById("battleEventDiv");
        var newEvent = document.createElement("p");
        newEvent.innerHTML = data;
        battleEventDiv.appendChild(newEvent);
    };

    BattleLogger.prototype.displayMinorEvent = function (data) {
        if (BattleModel.IS_MASS_SIMULATION || !BattleLogger.IS_DEBUG_MODE) {
            return;
        }

        var id = "turn" + this.currentTurn + "events";

        var turnEventList = document.getElementById(id);

        var lastEvent = turnEventList.lastChild;

        var subEventList = lastEvent.getElementsByClassName("ul")[0];

        if (!subEventList) {
            subEventList = document.createElement("ul");

            lastEvent.appendChild(subEventList);
        }

        var newEvent = document.createElement("li");
        newEvent.innerHTML = "<a>" + data + "</a>";
        subEventList.appendChild(newEvent);
    };

    BattleLogger.prototype.displayEventLogAtIndex = function (majorIndex) {
        if (!BattleLogger.IS_DEBUG_MODE) {
            return;
        }
        var graphic = BattleGraphic.getInstance();
        var lastEventIndex = (majorIndex == 0) ? 0 : majorIndex - 1;

        var lastEventField = this.getFieldAtMajorIndex(lastEventIndex);

        var field = this.getFieldAtMajorIndex(majorIndex);

        for (var p = 1; p <= 2; p++) {
            var playerCards = field["player" + p + "Cards"];
            for (var f = 0; f < 5; f++) {
                var stats = playerCards[f].stats;
                var originalStats = playerCards[f].originalStats;
                var status = playerCards[f].status;
                var afflict = playerCards[f].affliction;

                var htmlelem = document.getElementById("player" + p + "Fam" + f);

                var addedATK = this.getAdjustedStat(originalStats.atk, status.atk, status.isNewLogic[1 /* ATK */]);
                var addedDEF = this.getAdjustedStat(originalStats.def, status.def, status.isNewLogic[2 /* DEF */]);
                var addedWIS = this.getAdjustedStat(originalStats.wis, status.wis, status.isNewLogic[3 /* WIS */]);
                var addedAGI = this.getAdjustedStat(originalStats.agi, status.agi, status.isNewLogic[4 /* AGI */]);

                var infoText = {
                    name: playerCards[f].name,
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

                if (status.willAttackAgain != 0) {
                    infoText.willAttackAgain = "Extra action: Yes";
                }

                if (status.skillProbability != 0) {
                    infoText.skillProbability = "Extra prob.: " + status.skillProbability;
                }

                if (status.hpShield != 0) {
                    infoText.hpShield = "HP Shld.: " + status.hpShield;
                }

                if (afflict) {
                    infoText.affliction = "Affliction: " + Affliction.getAfflictionAdjective(afflict.type);
                    if (afflict.type === 5 /* SILENT */) {
                        infoText.affliction += (" (" + afflict.validTurnNum + " turn)");
                    } else if (afflict.type === 1 /* POISON */) {
                        infoText.affliction += (" (" + afflict.percent + " %)");
                    } else if (afflict.type === 8 /* BURN */) {
                        infoText.affliction += (" (" + afflict.damage + ")");
                    } else {
                        infoText.affliction += " (1 turn)";
                    }
                }

                for (var j = 0; this.minorEventLog[majorIndex] && j < this.minorEventLog[majorIndex].length; j++) {
                    var tempEvent = this.minorEventLog[majorIndex][j];
                    if (tempEvent.targetId == playerCards[f].id) {
                        if (tempEvent.type == 1 /* HP */) {
                            infoText.hp = this.decorateText(infoText.hp, tempEvent.amount < 0);
                        } else if (tempEvent.type == 2 /* STATUS */) {
                            if (tempEvent.status.type == 1 /* ATK */) {
                                infoText.atk = this.decorateText(infoText.atk, tempEvent.amount < 0);
                            } else if (tempEvent.status.type == 2 /* DEF */) {
                                infoText.def = this.decorateText(infoText.def, tempEvent.amount < 0);
                            } else if (tempEvent.status.type == 3 /* WIS */) {
                                infoText.wis = this.decorateText(infoText.wis, tempEvent.amount < 0);
                            } else if (tempEvent.status.type == 4 /* AGI */) {
                                infoText.agi = this.decorateText(infoText.agi, tempEvent.amount < 0);
                            } else if (tempEvent.status.type == 5 /* ATTACK_RESISTANCE */) {
                                infoText.physicalResist = this.decorateText(infoText.physicalResist, false);
                            } else if (tempEvent.status.type == 6 /* MAGIC_RESISTANCE */) {
                                infoText.magicalResist = this.decorateText(infoText.magicalResist, false);
                            } else if (tempEvent.status.type == 7 /* BREATH_RESISTANCE */) {
                                infoText.breathResist = this.decorateText(infoText.breathResist, false);
                            } else if (tempEvent.status.type == 18 /* WILL_ATTACK_AGAIN */) {
                                infoText.willAttackAgain = this.decorateText(infoText.willAttackAgain, false);
                            } else if (tempEvent.status.type == 8 /* SKILL_PROBABILITY */) {
                                infoText.skillProbability = this.decorateText(infoText.skillProbability, false);
                            } else if (tempEvent.status.type == 17 /* HP_SHIELD */) {
                                infoText.hpShield = this.decorateText(infoText.hpShield, false);
                            }
                        } else if (tempEvent.type == 3 /* AFFLICTION */) {
                            if (!tempEvent.affliction.isFinished) {
                                infoText.affliction = this.decorateText(infoText.affliction, false);
                            }
                        }
                    }
                }

                if (this.minorEventLog[majorIndex] && this.minorEventLog[majorIndex][0].executorId == playerCards[f].id) {
                    infoText.name = "<b>" + infoText.name + "</b>";
                }

                htmlelem.innerHTML = infoText.name + "<br>" + infoText.hp + "<br>" + infoText.atk + "<br>" + infoText.def + "<br>" + infoText.wis + "<br>" + infoText.agi + (infoText.physicalResist ? ("<br>" + infoText.physicalResist) : "") + (infoText.magicalResist ? ("<br>" + infoText.magicalResist) : "") + (infoText.breathResist ? ("<br>" + infoText.breathResist) : "") + (infoText.willAttackAgain ? ("<br>" + infoText.willAttackAgain) : "") + (infoText.skillProbability ? ("<br>" + infoText.skillProbability) : "") + (infoText.hpShield ? ("<br>" + infoText.hpShield) : "") + (infoText.affliction ? ("<br>" + infoText.affliction) : "");

                var lastEventCard = lastEventField["player" + p + "Cards"][f];
                graphic.displayHP(lastEventCard.stats.hp / lastEventCard.originalStats.hp * 100, p, f, 0);
            }
        }
        graphic.displayAllCardImages(majorIndex);

        graphic.displayAllAfflictionText(lastEventIndex);
        graphic.displayMajorEventAnimation(majorIndex);
    };

    BattleLogger.prototype.displayInfoText = function () {
        var cardManager = CardManager.getInstance();
        var battle = BattleModel.getInstance();
        var p1randTxt = this.getRandomModeText(+battle.p1RandomMode);
        var p2randTxt = this.getRandomModeText(+battle.p2RandomMode);

        var infoDivP1 = document.getElementById("infoDivP1");
        var infoDivP2 = document.getElementById("infoDivP2");
        var infoDivP1Title = document.getElementById("infoDivP1Title");
        var infoDivP2Title = document.getElementById("infoDivP2Title");

        if (!battle.p1RandomMode || !BattleModel.IS_MASS_SIMULATION) {
            infoDivP1.innerHTML = cardManager.getPlayerMainBrigString(battle.player1);
        }

        if (!battle.p2RandomMode || !BattleModel.IS_MASS_SIMULATION) {
            infoDivP2.innerHTML = cardManager.getPlayerMainBrigString(battle.player2);
        }

        if (battle.isBloodClash) {
            if (!battle.p1RandomMode || !BattleModel.IS_MASS_SIMULATION) {
                infoDivP1.innerHTML += "<br><br>" + cardManager.getPlayerReserveBrigString(battle.player1);
            }

            if (!battle.p2RandomMode || !BattleModel.IS_MASS_SIMULATION) {
                infoDivP2.innerHTML += "<br><br>" + cardManager.getPlayerReserveBrigString(battle.player2);
            }
        }

        infoDivP1Title.innerHTML += p1randTxt;
        infoDivP2Title.innerHTML += p2randTxt;
    };

    BattleLogger.prototype.displayWarningText = function () {
        var needWarn = true;
        var cardManager = CardManager.getInstance();
        var battle = BattleModel.getInstance();
        var p1main = cardManager.getPlayerCurrentMainCards(battle.player1);
        var p2main = cardManager.getPlayerCurrentMainCards(battle.player2);
        var dbId1 = p1main[0].dbId;
        var dbId2 = p2main[0].dbId;

        for (var i = 1; i < 5; i++) {
            if (p1main[i].dbId != dbId1 || p2main[i].dbId != dbId2) {
                needWarn = false;
                break;
            }
        }

        if (battle.isBloodClash) {
            var p1res = cardManager.getPlayerOriginalReserveCards(battle.player1);
            var p2res = cardManager.getPlayerOriginalReserveCards(battle.player2);

            for (i = 0; i < 5; i++) {
                if (p1res[i].dbId != dbId1 || p2res[i].dbId != dbId2) {
                    needWarn = false;
                    break;
                }
            }
        }

        if (dbId1 == dbId2)
            needWarn = false;

        if (needWarn) {
            var simDiv = document.getElementById("simDiv");
            var gameDiv = document.getElementById("gameDiv");
            var warnTxt = "<p><b>Note:</b> It seems that you using a 5v5 or 10v10 battle to determine whether " + p1main[0].name + " or " + p2main[0].name + " is \"stronger\". This is <b>NOT</b> a recommended way of comparing two familiars.</p>";
            simDiv.innerHTML += warnTxt;
            gameDiv.innerHTML += warnTxt;
        }
    };

    BattleLogger.prototype.getRandomModeText = function (type) {
        switch (type) {
            case 1 /* ALL */:
            case 2 /* XP_ONLY */:
            case 3 /* X_ONLY */:
            case 4 /* X_UP */:
            case 5 /* SP_ONLY */:
            case 6 /* SP_UP */:
            case 7 /* S_ONLY */:
            case 8 /* S_UP */:
            case 9 /* AP_ONLY */:
            case 10 /* AP_UP */:
            case 11 /* A_ONLY */:
            case 12 /* A_UP */:
                return " (random " + ENUM.RandomBrigText[type] + ")";
            default:
                return "";
        }
    };

    BattleLogger.prototype.getAdjustedStat = function (original, statusAmount, isNewLogic) {
        var value = original + statusAmount;

        if (value < 0) {
            value = 0;
        }

        if (isNewLogic) {
            var lowerLimit = original * Card.NEW_DEBUFF_LOW_LIMIT_FACTOR;
            value = (value > lowerLimit) ? value : lowerLimit;
        }
        return value;
    };

    BattleLogger.prototype.getFieldAtMajorIndex = function (majorIndex) {
        if (!this.minorEventLog[majorIndex]) {
            return this.getFieldAtMajorIndex(majorIndex - 1);
        }

        var minorLogLength = this.minorEventLog[majorIndex].length;
        var minorFieldsLength = this.minorEventFields[majorIndex].length;

        if (minorLogLength !== minorFieldsLength) {
            throw new Error("Log length and stored fields length are not equal!");
        }

        return JSON.parse(this.minorEventFields[majorIndex][minorFieldsLength - 1]);
    };

    BattleLogger.prototype.getFieldAtMinorIndex = function (majorIndex, minorIndex) {
        return JSON.parse(this.minorEventFields[majorIndex][minorIndex]);
    };

    BattleLogger.prototype.decorateText = function (text, isNegative) {
        var openTag;
        if (isNegative) {
            openTag = "<span style='color:red'><b>";
        } else {
            openTag = "<span style='color:green'><b>";
        }
        return openTag + text + "</b></span>";
    };

    BattleLogger.prototype.addMinorEvent = function (event) {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        var index = this.majorEventLog.length - 1;

        if (!this.minorEventLog[index]) {
            this.minorEventLog[index] = [];
        }
        this.minorEventLog[index].push(event);

        if (!this.minorEventFields[index]) {
            this.minorEventFields[index] = [];
        }
        this.minorEventFields[index].push(this.getCurrentFieldJSON());

        this.displayMinorEvent(event.description);
    };

    BattleLogger.prototype.getCurrentFieldJSON = function () {
        var toSerialize = {
            player1Cards: getSerializableObjectArray(BattleModel.getInstance().p1_mainCards),
            player2Cards: getSerializableObjectArray(BattleModel.getInstance().p2_mainCards)
        };

        return JSON.stringify(toSerialize);
    };

    BattleLogger.prototype.getTargetsInMajorEvent = function (majorIndex) {
        var targets = [];
        var majorEvent = this.majorEventLog[majorIndex];
        for (var i = 0; i < this.minorEventLog[majorIndex].length; i++) {
            var tmpData = this.minorEventLog[majorIndex][i];
            if (tmpData.executorId === majorEvent.executorId && tmpData.skillId === majorEvent.skillId) {
                targets.push(tmpData.targetId);
            }
        }
        return targets;
    };

    BattleLogger.prototype.getNestedTargetsInMajorEvent = function (majorIndex, minorIndex) {
        var targets = [];
        var initialAttackLog = this.minorEventLog[majorIndex][minorIndex];
        var executorId = initialAttackLog.executorId;
        var skillId = initialAttackLog.skillId;

        for (var i = minorIndex; i < this.minorEventLog[majorIndex].length; i++) {
            var tmpData = this.minorEventLog[majorIndex][i];
            if (tmpData.executorId === executorId && tmpData.skillId === skillId) {
                targets.push(tmpData.targetId);
            }
        }
        return targets;
    };

    BattleLogger.prototype.startBattleLog = function () {
        if (BattleModel.IS_MASS_SIMULATION) {
            return;
        }

        this.addMajorEvent({ description: "Battle start" });
        this.addMinorEvent({
            type: 6 /* TEXT */,
            description: "Everything ready"
        });
        this.displayEventLogAtIndex(0);
    };
    BattleLogger.IS_DEBUG_MODE = true;

    BattleLogger._instance = null;
    return BattleLogger;
})();
var BrigGenerator = (function () {
    function BrigGenerator() {
    }
    BrigGenerator.getBrig = function (randomMode, tierListString, isBloodclash) {
        var randomList = FamiliarDatabase.getRandomFamList(+randomMode, tierListString);
        var brigIds = [];
        var maxIndex = isBloodclash ? 9 : 4;

        if (isBloodclash) {
            var randIndex = getRandomInt(0, maxIndex);
            brigIds[randIndex] = getRandomElement(FamiliarDatabase.getWarlordList());
        }

        for (var i = 0; i <= maxIndex; i++) {
            if (!brigIds[i]) {
                brigIds[i] = getRandomElement(randomList);
            }
        }

        return brigIds;
    };
    return BrigGenerator;
})();
var ENUM;
(function (ENUM) {
    (function (SkillType) {
        SkillType[SkillType["OPENING"] = 1] = "OPENING";
        SkillType[SkillType["ACTIVE"] = 2] = "ACTIVE";
        SkillType[SkillType["DEFENSE"] = 3] = "DEFENSE";
        SkillType[SkillType["FIELD"] = 4] = "FIELD";
        SkillType[SkillType["PROTECT"] = 5] = "PROTECT";
        SkillType[SkillType["EVADE"] = 6] = "EVADE";
        SkillType[SkillType["ACTION_ON_DEATH"] = 16] = "ACTION_ON_DEATH";
    })(ENUM.SkillType || (ENUM.SkillType = {}));
    var SkillType = ENUM.SkillType;

    (function (SkillFunc) {
        SkillFunc[SkillFunc["BUFF"] = 1] = "BUFF";
        SkillFunc[SkillFunc["DEBUFF"] = 2] = "DEBUFF";
        SkillFunc[SkillFunc["ATTACK"] = 3] = "ATTACK";

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
        SkillFunc[SkillFunc["DISPELL"] = 16] = "DISPELL";
        SkillFunc[SkillFunc["SUICIDE"] = 17] = "SUICIDE";
        SkillFunc[SkillFunc["HEAL"] = 18] = "HEAL";
        SkillFunc[SkillFunc["AFFLICTION"] = 19] = "AFFLICTION";

        SkillFunc[SkillFunc["SURVIVE"] = 20] = "SURVIVE";
        SkillFunc[SkillFunc["DEBUFFATTACK"] = 21] = "DEBUFFATTACK";
        SkillFunc[SkillFunc["DEBUFFINDIRECT"] = 22] = "DEBUFFINDIRECT";

        SkillFunc[SkillFunc["RANDOM"] = 24] = "RANDOM";
        SkillFunc[SkillFunc["COPY"] = 25] = "COPY";
        SkillFunc[SkillFunc["IMITATE"] = 26] = "IMITATE";
        SkillFunc[SkillFunc["EVADE"] = 27] = "EVADE";
        SkillFunc[SkillFunc["PROTECT_REFLECT"] = 28] = "PROTECT_REFLECT";

        SkillFunc[SkillFunc["COUNTER_DISPELL"] = 29] = "COUNTER_DISPELL";
        SkillFunc[SkillFunc["TURN_ORDER_CHANGE"] = 31] = "TURN_ORDER_CHANGE";
        SkillFunc[SkillFunc["CASTER_BASED_DEBUFF"] = 32] = "CASTER_BASED_DEBUFF";
        SkillFunc[SkillFunc["CASTER_BASED_DEBUFF_ATTACK"] = 33] = "CASTER_BASED_DEBUFF_ATTACK";
        SkillFunc[SkillFunc["CASTER_BASED_DEBUFF_MAGIC"] = 34] = "CASTER_BASED_DEBUFF_MAGIC";

        SkillFunc[SkillFunc["DRAIN_ATTACK"] = 36] = "DRAIN_ATTACK";
        SkillFunc[SkillFunc["DRAIN_MAGIC"] = 37] = "DRAIN_MAGIC";
        SkillFunc[SkillFunc["ONHIT_DEBUFF"] = 38] = "ONHIT_DEBUFF";
        SkillFunc[SkillFunc["ONHIT_BUFF"] = 39] = "ONHIT_BUFF";
        SkillFunc[SkillFunc["CLEAR_DEBUFF"] = 40] = "CLEAR_DEBUFF";
        SkillFunc[SkillFunc["COUNTER_INDIRECT"] = 41] = "COUNTER_INDIRECT";
    })(ENUM.SkillFunc || (ENUM.SkillFunc = {}));
    var SkillFunc = ENUM.SkillFunc;

    (function (SkillCalcType) {
        SkillCalcType[SkillCalcType["DEFAULT"] = 0] = "DEFAULT";
        SkillCalcType[SkillCalcType["ATK"] = 1] = "ATK";
        SkillCalcType[SkillCalcType["WIS"] = 2] = "WIS";
        SkillCalcType[SkillCalcType["AGI"] = 3] = "AGI";
        SkillCalcType[SkillCalcType["HEAL"] = 4] = "HEAL";
        SkillCalcType[SkillCalcType["BUFF"] = 5] = "BUFF";
        SkillCalcType[SkillCalcType["DEBUFF"] = 6] = "DEBUFF";
        SkillCalcType[SkillCalcType["REFLECT"] = 7] = "REFLECT";
        SkillCalcType[SkillCalcType["ATK_WIS"] = 8] = "ATK_WIS";
        SkillCalcType[SkillCalcType["ATK_AGI"] = 9] = "ATK_AGI";
        SkillCalcType[SkillCalcType["WIS_AGI"] = 10] = "WIS_AGI";
    })(ENUM.SkillCalcType || (ENUM.SkillCalcType = {}));
    var SkillCalcType = ENUM.SkillCalcType;

    (function (ProtectAttackType) {
        ProtectAttackType[ProtectAttackType["ALL"] = 0] = "ALL";
        ProtectAttackType[ProtectAttackType["NORMAL"] = 1] = "NORMAL";
        ProtectAttackType[ProtectAttackType["SKILL"] = 2] = "SKILL";
        ProtectAttackType[ProtectAttackType["NOT_COUNTER"] = 3] = "NOT_COUNTER";
        ProtectAttackType[ProtectAttackType["COUNTER"] = 4] = "COUNTER";
    })(ENUM.ProtectAttackType || (ENUM.ProtectAttackType = {}));
    var ProtectAttackType = ENUM.ProtectAttackType;

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
        StatusType[StatusType["ALL_STATUS"] = 9] = "ALL_STATUS";

        StatusType[StatusType["ACTION_ON_DEATH"] = 16] = "ACTION_ON_DEATH";

        StatusType[StatusType["HP_SHIELD"] = 17] = "HP_SHIELD";
        StatusType[StatusType["WILL_ATTACK_AGAIN"] = 18] = "WILL_ATTACK_AGAIN";
    })(ENUM.StatusType || (ENUM.StatusType = {}));
    var StatusType = ENUM.StatusType;

    (function (SkillRange) {
        SkillRange[SkillRange["EITHER_SIDE"] = 1] = "EITHER_SIDE";
        SkillRange[SkillRange["BOTH_SIDES"] = 2] = "BOTH_SIDES";
        SkillRange[SkillRange["SELF_BOTH_SIDES"] = 3] = "SELF_BOTH_SIDES";
        SkillRange[SkillRange["ALL"] = 4] = "ALL";
        SkillRange[SkillRange["ENEMY_NEAR_1"] = 5] = "ENEMY_NEAR_1";
        SkillRange[SkillRange["ENEMY_NEAR_2"] = 6] = "ENEMY_NEAR_2";
        SkillRange[SkillRange["ENEMY_NEAR_3"] = 7] = "ENEMY_NEAR_3";
        SkillRange[SkillRange["ENEMY_ALL"] = 8] = "ENEMY_ALL";
        SkillRange[SkillRange["ENEMY_FRONT"] = 9] = "ENEMY_FRONT";
        SkillRange[SkillRange["ENEMY_MID"] = 10] = "ENEMY_MID";
        SkillRange[SkillRange["ENEMY_REAR"] = 11] = "ENEMY_REAR";
        SkillRange[SkillRange["ENEMY_FRONT_ALL"] = 12] = "ENEMY_FRONT_ALL";
        SkillRange[SkillRange["ENEMY_MID_ALL"] = 13] = "ENEMY_MID_ALL";
        SkillRange[SkillRange["ENEMY_REAR_ALL"] = 14] = "ENEMY_REAR_ALL";
        SkillRange[SkillRange["ENEMY_FRONT_MID_ALL"] = 15] = "ENEMY_FRONT_MID_ALL";
        SkillRange[SkillRange["ENEMY_RANDOM_3"] = 16] = "ENEMY_RANDOM_3";
        SkillRange[SkillRange["ENEMY_RANDOM_6"] = 17] = "ENEMY_RANDOM_6";
        SkillRange[SkillRange["ENEMY_REAR_RANDOM_3"] = 18] = "ENEMY_REAR_RANDOM_3";
        SkillRange[SkillRange["ENEMY_RANDOM_4"] = 19] = "ENEMY_RANDOM_4";
        SkillRange[SkillRange["ENEMY_RANDOM_5"] = 20] = "ENEMY_RANDOM_5";
        SkillRange[SkillRange["MYSELF"] = 21] = "MYSELF";
        SkillRange[SkillRange["EVERYONE"] = 22] = "EVERYONE";
        SkillRange[SkillRange["ENEMY_RANDOM_2"] = 23] = "ENEMY_RANDOM_2";
        SkillRange[SkillRange["WIDE_ALL"] = 24] = "WIDE_ALL";
        SkillRange[SkillRange["WIDE_ENEMY_ALL"] = 25] = "WIDE_ENEMY_ALL";
        SkillRange[SkillRange["WIDE_NEIGHBOR"] = 26] = "WIDE_NEIGHBOR";
        SkillRange[SkillRange["WIDE_SELF_NEIGHBOR"] = 27] = "WIDE_SELF_NEIGHBOR";
        SkillRange[SkillRange["RIGHT"] = 28] = "RIGHT";
        SkillRange[SkillRange["SELF_RIGHT"] = 29] = "SELF_RIGHT";
        SkillRange[SkillRange["LEFT"] = 30] = "LEFT";
        SkillRange[SkillRange["SELF_LEFT"] = 31] = "SELF_LEFT";
        SkillRange[SkillRange["ENEMY_NEAR_4"] = 32] = "ENEMY_NEAR_4";
        SkillRange[SkillRange["ENEMY_NEAR_5"] = 33] = "ENEMY_NEAR_5";
        SkillRange[SkillRange["ENEMY_FRONT_REAR_ALL"] = 34] = "ENEMY_FRONT_REAR_ALL";
        SkillRange[SkillRange["ATTACKER"] = 35] = "ATTACKER";
        SkillRange[SkillRange["SELF_IMMEDIATE_RIGHT"] = 36] = "SELF_IMMEDIATE_RIGHT";
        SkillRange[SkillRange["SELF_IMMEDIATE_LEFT"] = 37] = "SELF_IMMEDIATE_LEFT";

        SkillRange[SkillRange["FRIEND_RANDOM"] = 101] = "FRIEND_RANDOM";
        SkillRange[SkillRange["FRIEND_RANDOM_2"] = 102] = "FRIEND_RANDOM_2";
        SkillRange[SkillRange["FRIEND_RANDOM_3"] = 103] = "FRIEND_RANDOM_3";
        SkillRange[SkillRange["FRIEND_RANDOM_4"] = 104] = "FRIEND_RANDOM_4";
        SkillRange[SkillRange["FRIEND_RANDOM_5"] = 105] = "FRIEND_RANDOM_5";
        SkillRange[SkillRange["FRIEND_RANDOM_6"] = 106] = "FRIEND_RANDOM_6";

        SkillRange[SkillRange["FRIEND_SELF_RANDOM"] = 111] = "FRIEND_SELF_RANDOM";
        SkillRange[SkillRange["FRIEND_SELF_RANDOM_2"] = 112] = "FRIEND_SELF_RANDOM_2";
        SkillRange[SkillRange["FRIEND_SELF_RANDOM_3"] = 113] = "FRIEND_SELF_RANDOM_3";
        SkillRange[SkillRange["FRIEND_SELF_RANDOM_4"] = 114] = "FRIEND_SELF_RANDOM_4";
        SkillRange[SkillRange["FRIEND_SELF_RANDOM_5"] = 115] = "FRIEND_SELF_RANDOM_5";
        SkillRange[SkillRange["FRIEND_SELF_RANDOM_6"] = 116] = "FRIEND_SELF_RANDOM_6";

        SkillRange[SkillRange["FRIEND_UNIQUE_RANDOM"] = 121] = "FRIEND_UNIQUE_RANDOM";
        SkillRange[SkillRange["FRIEND_UNIQUE_RANDOM_2"] = 122] = "FRIEND_UNIQUE_RANDOM_2";
        SkillRange[SkillRange["FRIEND_UNIQUE_RANDOM_3"] = 123] = "FRIEND_UNIQUE_RANDOM_3";
        SkillRange[SkillRange["FRIEND_UNIQUE_RANDOM_4"] = 124] = "FRIEND_UNIQUE_RANDOM_4";
        SkillRange[SkillRange["FRIEND_UNIQUE_RANDOM_5"] = 125] = "FRIEND_UNIQUE_RANDOM_5";
        SkillRange[SkillRange["FRIEND_UNIQUE_RANDOM_6"] = 126] = "FRIEND_UNIQUE_RANDOM_6";

        SkillRange[SkillRange["FRIEND_SELF_UNIQUE_RANDOM"] = 131] = "FRIEND_SELF_UNIQUE_RANDOM";
        SkillRange[SkillRange["FRIEND_SELF_UNIQUE_RANDOM_2"] = 132] = "FRIEND_SELF_UNIQUE_RANDOM_2";
        SkillRange[SkillRange["FRIEND_SELF_UNIQUE_RANDOM_3"] = 133] = "FRIEND_SELF_UNIQUE_RANDOM_3";
        SkillRange[SkillRange["FRIEND_SELF_UNIQUE_RANDOM_4"] = 134] = "FRIEND_SELF_UNIQUE_RANDOM_4";
        SkillRange[SkillRange["FRIEND_SELF_UNIQUE_RANDOM_5"] = 135] = "FRIEND_SELF_UNIQUE_RANDOM_5";
        SkillRange[SkillRange["FRIEND_SELF_UNIQUE_RANDOM_6"] = 136] = "FRIEND_SELF_UNIQUE_RANDOM_6";

        SkillRange[SkillRange["FORCED_SELF_RANDOM_1"] = 142] = "FORCED_SELF_RANDOM_1";
        SkillRange[SkillRange["FORCED_SELF_RANDOM_2"] = 143] = "FORCED_SELF_RANDOM_2";
        SkillRange[SkillRange["FORCED_SELF_RANDOM_3"] = 144] = "FORCED_SELF_RANDOM_3";
        SkillRange[SkillRange["FORCED_SELF_RANDOM_4"] = 145] = "FORCED_SELF_RANDOM_4";
        SkillRange[SkillRange["FORCED_SELF_UNIQUE_RANDOM_2"] = 153] = "FORCED_SELF_UNIQUE_RANDOM_2";
        SkillRange[SkillRange["FORCED_SELF_UNIQUE_RANDOM_3"] = 154] = "FORCED_SELF_UNIQUE_RANDOM_3";
        SkillRange[SkillRange["FORCED_SELF_UNIQUE_RANDOM_4"] = 155] = "FORCED_SELF_UNIQUE_RANDOM_4";

        SkillRange[SkillRange["BOTH_SIDES_SCALED"] = 202] = "BOTH_SIDES_SCALED";
        SkillRange[SkillRange["SELF_BOTH_SIDES_SCALED"] = 203] = "SELF_BOTH_SIDES_SCALED";
        SkillRange[SkillRange["ALL_SCALED"] = 204] = "ALL_SCALED";
        SkillRange[SkillRange["ENEMY_ALL_SCALED"] = 208] = "ENEMY_ALL_SCALED";
        SkillRange[SkillRange["ENEMY_FRONT_ALL_SCALED"] = 212] = "ENEMY_FRONT_ALL_SCALED";
        SkillRange[SkillRange["ENEMY_MID_ALL_SCALED"] = 213] = "ENEMY_MID_ALL_SCALED";
        SkillRange[SkillRange["ENEMY_REAR_ALL_SCALED"] = 214] = "ENEMY_REAR_ALL_SCALED";
        SkillRange[SkillRange["ENEMY_FRONT_MID_ALL_SCALED"] = 215] = "ENEMY_FRONT_MID_ALL_SCALED";
        SkillRange[SkillRange["ENEMY_FRONT_REAR_ALL_SCALED"] = 234] = "ENEMY_FRONT_REAR_ALL_SCALED";
    })(ENUM.SkillRange || (ENUM.SkillRange = {}));
    var SkillRange = ENUM.SkillRange;

    (function (WardType) {
        WardType[WardType["PHYSICAL"] = 1] = "PHYSICAL";
        WardType[WardType["MAGICAL"] = 2] = "MAGICAL";
        WardType[WardType["BREATH"] = 3] = "BREATH";
    })(ENUM.WardType || (ENUM.WardType = {}));
    var WardType = ENUM.WardType;

    (function (AfflictionType) {
        AfflictionType[AfflictionType["POISON"] = 1] = "POISON";
        AfflictionType[AfflictionType["PARALYSIS"] = 2] = "PARALYSIS";
        AfflictionType[AfflictionType["FROZEN"] = 3] = "FROZEN";
        AfflictionType[AfflictionType["DISABLE"] = 4] = "DISABLE";
        AfflictionType[AfflictionType["SILENT"] = 5] = "SILENT";
        AfflictionType[AfflictionType["BLIND"] = 7] = "BLIND";
        AfflictionType[AfflictionType["BURN"] = 8] = "BURN";
    })(ENUM.AfflictionType || (ENUM.AfflictionType = {}));
    var AfflictionType = ENUM.AfflictionType;

    (function (BattleTurnOrderType) {
        BattleTurnOrderType[BattleTurnOrderType["AGI"] = 0] = "AGI";
        BattleTurnOrderType[BattleTurnOrderType["ATK"] = 1] = "ATK";
        BattleTurnOrderType[BattleTurnOrderType["WIS"] = 2] = "WIS";
        BattleTurnOrderType[BattleTurnOrderType["DEF"] = 3] = "DEF";
        BattleTurnOrderType[BattleTurnOrderType["HP"] = 4] = "HP";
    })(ENUM.BattleTurnOrderType || (ENUM.BattleTurnOrderType = {}));
    var BattleTurnOrderType = ENUM.BattleTurnOrderType;

    (function (FormationRow) {
        FormationRow[FormationRow["REAR"] = 3] = "REAR";
        FormationRow[FormationRow["MID"] = 2] = "MID";
        FormationRow[FormationRow["FRONT"] = 1] = "FRONT";
    })(ENUM.FormationRow || (ENUM.FormationRow = {}));
    var FormationRow = ENUM.FormationRow;

    (function (FormationType) {
        FormationType[FormationType["SKEIN_5"] = 0] = "SKEIN_5";
        FormationType[FormationType["VALLEY_5"] = 1] = "VALLEY_5";
        FormationType[FormationType["TOOTH_5"] = 2] = "TOOTH_5";
        FormationType[FormationType["WAVE_5"] = 3] = "WAVE_5";
        FormationType[FormationType["FRONT_5"] = 4] = "FRONT_5";
        FormationType[FormationType["MID_5"] = 5] = "MID_5";
        FormationType[FormationType["REAR_5"] = 6] = "REAR_5";
        FormationType[FormationType["PIKE_5"] = 7] = "PIKE_5";
        FormationType[FormationType["SHIELD_5"] = 8] = "SHIELD_5";
        FormationType[FormationType["PINCER_5"] = 9] = "PINCER_5";
        FormationType[FormationType["SAW_5"] = 10] = "SAW_5";
        FormationType[FormationType["HYDRA_5"] = 11] = "HYDRA_5";
    })(ENUM.FormationType || (ENUM.FormationType = {}));
    var FormationType = ENUM.FormationType;

    (function (ProcOrderType) {
        ProcOrderType[ProcOrderType["ANDROID"] = 1] = "ANDROID";
        ProcOrderType[ProcOrderType["IOS"] = 2] = "IOS";
    })(ENUM.ProcOrderType || (ENUM.ProcOrderType = {}));
    var ProcOrderType = ENUM.ProcOrderType;

    (function (BattleType) {
        BattleType[BattleType["BLOOD_CLASH"] = 1] = "BLOOD_CLASH";
        BattleType[BattleType["NORMAL"] = 2] = "NORMAL";
    })(ENUM.BattleType || (ENUM.BattleType = {}));
    var BattleType = ENUM.BattleType;

    (function (RandomBrigType) {
        RandomBrigType[RandomBrigType["NONE"] = 0] = "NONE";
        RandomBrigType[RandomBrigType["ALL"] = 1] = "ALL";
        RandomBrigType[RandomBrigType["XP_ONLY"] = 2] = "XP_ONLY";
        RandomBrigType[RandomBrigType["X_ONLY"] = 3] = "X_ONLY";
        RandomBrigType[RandomBrigType["X_UP"] = 4] = "X_UP";
        RandomBrigType[RandomBrigType["SP_ONLY"] = 5] = "SP_ONLY";
        RandomBrigType[RandomBrigType["SP_UP"] = 6] = "SP_UP";
        RandomBrigType[RandomBrigType["S_ONLY"] = 7] = "S_ONLY";
        RandomBrigType[RandomBrigType["S_UP"] = 8] = "S_UP";
        RandomBrigType[RandomBrigType["AP_ONLY"] = 9] = "AP_ONLY";
        RandomBrigType[RandomBrigType["AP_UP"] = 10] = "AP_UP";
        RandomBrigType[RandomBrigType["A_ONLY"] = 11] = "A_ONLY";
        RandomBrigType[RandomBrigType["A_UP"] = 12] = "A_UP";
    })(ENUM.RandomBrigType || (ENUM.RandomBrigType = {}));
    var RandomBrigType = ENUM.RandomBrigType;

    (function (RandomBrigText) {
        RandomBrigText[RandomBrigText["all"] = 1] = "all";
        RandomBrigText[RandomBrigText["Tier X+"] = 2] = "Tier X+";
        RandomBrigText[RandomBrigText["Tier X"] = 3] = "Tier X";
        RandomBrigText[RandomBrigText["Tier X and up"] = 4] = "Tier X and up";
        RandomBrigText[RandomBrigText["Tier S+"] = 5] = "Tier S+";
        RandomBrigText[RandomBrigText["Tier S+ and up"] = 6] = "Tier S+ and up";
        RandomBrigText[RandomBrigText["Tier S"] = 7] = "Tier S";
        RandomBrigText[RandomBrigText["Tier S and up"] = 8] = "Tier S and up";
        RandomBrigText[RandomBrigText["Tier A+"] = 9] = "Tier A+";
        RandomBrigText[RandomBrigText["Tier A+ and up"] = 10] = "Tier A+ and up";
        RandomBrigText[RandomBrigText["Tier A"] = 11] = "Tier A";
        RandomBrigText[RandomBrigText["Tier A and up"] = 12] = "Tier A and up";
    })(ENUM.RandomBrigText || (ENUM.RandomBrigText = {}));
    var RandomBrigText = ENUM.RandomBrigText;

    (function (MinorEventType) {
        MinorEventType[MinorEventType["HP"] = 1] = "HP";
        MinorEventType[MinorEventType["STATUS"] = 2] = "STATUS";
        MinorEventType[MinorEventType["AFFLICTION"] = 3] = "AFFLICTION";
        MinorEventType[MinorEventType["PROTECT"] = 4] = "PROTECT";
        MinorEventType[MinorEventType["DESCRIPTION"] = 5] = "DESCRIPTION";
        MinorEventType[MinorEventType["BATTLE_DESCRIPTION"] = 51] = "BATTLE_DESCRIPTION";
        MinorEventType[MinorEventType["TEXT"] = 6] = "TEXT";
        MinorEventType[MinorEventType["REVIVE"] = 7] = "REVIVE";
        MinorEventType[MinorEventType["RESERVE_SWITCH"] = 8] = "RESERVE_SWITCH";
        MinorEventType[MinorEventType["BC_ADDPROB"] = 9] = "BC_ADDPROB";
    })(ENUM.MinorEventType || (ENUM.MinorEventType = {}));
    var MinorEventType = ENUM.MinorEventType;
})(ENUM || (ENUM = {}));
var Card = (function () {
    function Card(dbId, player, nth, skills) {
        this.bcAddedProb = 0;
        this.lastBattleDamageTaken = 0;
        this.lastBattleDamageDealt = 0;
        this.justMissed = false;
        this.justEvaded = false;
        this.openingSkills = [];
        this.activeSkills = [];
        this.protectSkills = [];
        this.defenseSkills = [];
        this.ondeathSkills = [null, null];
        this.surviveSkill = null;
        var cardData = famDatabase[dbId];
        this.name = cardData.name;
        this.fullName = cardData.fullName;
        this.dbId = dbId;
        this.id = player.id * 100 + nth;
        this.isMounted = cardData.isMounted;
        this.isWarlord = cardData.isWarlord;
        this.imageLink = cardData.img;

        this.stats = new Stats(cardData.stats[0], cardData.stats[1], cardData.stats[2], cardData.stats[3], cardData.stats[4]);

        this.originalStats = new Stats(cardData.stats[0], cardData.stats[1], cardData.stats[2], cardData.stats[3], cardData.stats[4]);

        this.status = new Status();
        this.isDead = false;

        this.player = player;
        this.formationColumn = nth % 5;
        this.formationRow = player.formation.getCardRow(this.formationColumn);
        this.procIndex = Formation.getProcIndex(this.formationRow, this.formationColumn, BattleModel.getInstance().procOrderType);

        this.skills = skills;

        if (cardData.autoAttack) {
            this.autoAttack = new Skill(cardData.autoAttack);
        } else {
            this.autoAttack = new Skill(10000);
        }

        for (var i = 0; i < skills.length; i++) {
            var skill = skills[i];
            if (skill) {
                if (skill.skillType === 1 /* OPENING */) {
                    this.openingSkills.push(skill);
                } else if (skill.skillType === 2 /* ACTIVE */) {
                    this.activeSkills.push(skill);
                } else if (skill.skillType === 5 /* PROTECT */ || skill.skillType === 6 /* EVADE */) {
                    this.protectSkills.push(skill);
                } else if (skill.skillType === 3 /* DEFENSE */) {
                    if (skill.skillFunc === 20 /* SURVIVE */) {
                        this.surviveSkill = skill;
                    } else {
                        this.defenseSkills.push(skill);
                    }
                } else if (skill.skillType === 16 /* ACTION_ON_DEATH */) {
                    this.ondeathSkills[1] = skill;
                }
            }
        }
    }
    Card.prototype.getSerializableObject = function () {
        return {
            name: this.name,
            fullName: this.fullName,
            dbId: this.dbId,
            id: this.id,
            isMounted: this.isMounted,
            isWarlord: this.isWarlord,
            imageLink: this.imageLink,
            stats: this.stats,
            originalStats: this.originalStats,
            status: this.status,
            affliction: this.affliction,
            isDead: this.isDead,
            bcAddedProb: this.bcAddedProb,
            lastBattleDamageTaken: this.lastBattleDamageTaken,
            lastBattleDamageDealt: this.lastBattleDamageDealt,
            justMissed: this.justMissed,
            justEvaded: this.justEvaded,
            player: this.player,
            formationColumn: this.formationColumn,
            formationRow: this.formationRow,
            procIndex: this.procIndex,
            skills: getSerializableObjectArray(this.skills),
            autoAttack: this.autoAttack.getSerializableObject(),
            openingSkills: getSerializableObjectArray(this.openingSkills),
            activeSkills: getSerializableObjectArray(this.activeSkills),
            protectSkills: getSerializableObjectArray(this.protectSkills),
            defenseSkills: getSerializableObjectArray(this.defenseSkills),
            ondeathSkills: getSerializableObjectArray(this.ondeathSkills),
            surviveSkill: this.surviveSkill ? this.surviveSkill.getSerializableObject() : null
        };
    };

    Card.prototype.getRandomOpeningSkill = function () {
        if (this.openingSkills.length === 0) {
            return null;
        } else {
            return getRandomElement(this.openingSkills);
        }
    };

    Card.prototype.getRandomActiveSkill = function () {
        if (this.activeSkills.length === 0) {
            return null;
        } else {
            return getRandomElement(this.activeSkills);
        }
    };

    Card.prototype.getRandomDefenseSkill = function () {
        if (this.defenseSkills.length === 0) {
            return null;
        } else {
            return getRandomElement(this.defenseSkills);
        }
    };

    Card.prototype.getRandomProtectSkill = function () {
        if (this.protectSkills.length === 0) {
            return null;
        } else {
            return getRandomElement(this.protectSkills);
        }
    };

    Card.prototype.getSurviveSkill = function () {
        return this.surviveSkill;
    };

    Card.prototype.getFirstActiveSkill = function () {
        return this.activeSkills[0];
    };

    Card.prototype.getSecondActiveSkill = function () {
        return this.activeSkills[1];
    };

    Card.prototype.getBuffOnDeathSkill = function () {
        return this.ondeathSkills[0];
    };
    Card.prototype.getInherentOnDeathSkill = function () {
        return this.ondeathSkills[1];
    };
    Card.prototype.hasOnDeathSkill = function () {
        return (this.ondeathSkills[0] != null) || (this.ondeathSkills[1] != null);
    };
    Card.prototype.clearBuffOnDeathSkill = function () {
        this.ondeathSkills[0] = null;
        this.status.actionOnDeath = 0;
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

    Card.prototype.setAffliction = function (type, option) {
        if (this.affliction) {
            if (this.affliction.getType() === type) {
                this.affliction.add(option);
                return;
            } else {
                this.clearAffliction();
            }
        }
        this.affliction = AfflictionFactory.getAffliction(type);
        this.affliction.add(option);
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
    Card.prototype.willMiss = function () {
        return (this.affliction) ? this.affliction.canMiss() : false;
    };
    Card.prototype.getAfflictionType = function () {
        return this.affliction ? this.affliction.getType() : null;
    };
    Card.prototype.getPoisonPercent = function () {
        if (!this.affliction || this.affliction.type != 1 /* POISON */) {
            return undefined;
        } else {
            return this.affliction.percent;
        }
    };
    Card.prototype.getBurnDamage = function () {
        if (!this.affliction || this.affliction.type != 8 /* BURN */) {
            return undefined;
        } else {
            return this.affliction.damage;
        }
    };

    Card.prototype.updateAffliction = function () {
        if (!this.affliction) {
            return false;
        }

        this.affliction.update(this);

        if (this.affliction && this.affliction.isFinished()) {
            this.clearAffliction();
            return true;
        }

        return false;
    };

    Card.prototype.changeStatus = function (statusType, amount, isNewLogic, maxAmount) {
        if (isNewLogic) {
            this.status.isNewLogic[statusType] = true;
        }

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
                this.status.attackResistance = amount;
            }
        } else if (statusType === 6 /* MAGIC_RESISTANCE */) {
            if (this.status.magicResistance < amount) {
                this.status.magicResistance = amount;
            }
        } else if (statusType === 7 /* BREATH_RESISTANCE */) {
            if (this.status.breathResistance < amount) {
                this.status.breathResistance = amount;
            }
        } else if (statusType === 8 /* SKILL_PROBABILITY */) {
            this.status.skillProbability += amount;
        } else if (statusType === 18 /* WILL_ATTACK_AGAIN */) {
            this.status.willAttackAgain = amount;
        } else if (statusType === 16 /* ACTION_ON_DEATH */) {
            var skill = new Skill(amount);
            this.ondeathSkills[0] = skill;
            this.status.actionOnDeath = amount;
        } else if (statusType === 17 /* HP_SHIELD */) {
            this.status.hpShield += amount;
            if (maxAmount && this.status.hpShield > maxAmount) {
                this.status.hpShield = maxAmount;
            }
        } else {
            throw new Error("Invalid status type");
        }
    };

    Card.prototype.clearAllStatus = function (condFunc) {
        for (var key in this.status) {
            if (this.status.hasOwnProperty(key) && typeof this.status[key] === "number") {
                if (condFunc(this.status[key])) {
                    this.status[key] = 0;
                }
            }
        }

        if (this.status.actionOnDeath == 0) {
            this.clearBuffOnDeathSkill();
        }
    };

    Card.prototype.hasStatus = function (condFunc) {
        var hasStatus = false;

        for (var key in this.status) {
            if (this.status.hasOwnProperty(key) && typeof this.status[key] === "number") {
                if (condFunc(this.status[key])) {
                    hasStatus = true;
                    break;
                }
            }
        }

        return hasStatus;
    };

    Card.prototype.getHP = function () {
        return this.stats.hp;
    };
    Card.prototype.getOriginalHP = function () {
        return this.originalStats.hp;
    };
    Card.prototype.changeHP = function (amount) {
        this.stats.hp += amount;

        if (this.stats.hp > this.originalStats.hp) {
            this.stats.hp = this.originalStats.hp;
        }

        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.setDead();
        }
    };
    Card.prototype.isFullHealth = function () {
        return this.stats.hp == this.originalStats.hp;
    };
    Card.prototype.getHPRatio = function () {
        return this.stats.hp / this.originalStats.hp;
    };

    Card.prototype.setDead = function () {
        this.isDead = true;
        this.clearAffliction();
        this.status = new Status();
    };
    Card.prototype.revive = function (hpRatio) {
        if (!this.isDead) {
            throw new Error("You can't revive a card that is not dead!");
        }

        this.isDead = false;
        this.status = new Status();
        this.stats.hp = this.originalStats.hp * hpRatio;
    };

    Card.prototype.getATK = function () {
        var value = this.stats.atk + this.status.atk;

        if (value < 0) {
            value = 0;
        }

        value = this.adjustByNewDebuffLogic(1 /* ATK */, value, this.originalStats.atk);

        return value;
    };
    Card.prototype.getDEF = function () {
        var value = this.stats.def + this.status.def;

        if (value < 0) {
            value = 0;
        }

        value = this.adjustByNewDebuffLogic(2 /* DEF */, value, this.originalStats.def);

        return value;
    };
    Card.prototype.getWIS = function () {
        var value = this.stats.wis + this.status.wis;

        if (value < 0) {
            value = 0;
        }

        value = this.adjustByNewDebuffLogic(3 /* WIS */, value, this.originalStats.wis);

        return value;
    };
    Card.prototype.getAGI = function () {
        var value = this.stats.agi + this.status.agi;

        if (value < 0) {
            value = 0;
        }

        value = this.adjustByNewDebuffLogic(4 /* AGI */, value, this.originalStats.agi);

        return value;
    };

    Card.prototype.adjustByNewDebuffLogic = function (type, value, originalValue) {
        if (this.status.isNewLogic[type]) {
            var lowerLimit = originalValue * Card.NEW_DEBUFF_LOW_LIMIT_FACTOR;
            value = (value > lowerLimit) ? value : lowerLimit;
        }
        return value;
    };

    Card.prototype.hasWardOfType = function (type) {
        switch (type) {
            case 1 /* PHYSICAL */:
                return this.status.attackResistance !== 0;
            case 2 /* MAGICAL */:
                return this.status.magicResistance !== 0;
            case 3 /* BREATH */:
                return this.status.breathResistance !== 0;
            default:
                throw new Error("Invalid type of ward!");
        }
    };

    Card.prototype.clearDamagePhaseData = function () {
        this.lastBattleDamageDealt = 0;
        this.lastBattleDamageTaken = 0;
        this.justMissed = false;
        this.justEvaded = false;
    };
    Card.NEW_DEBUFF_LOW_LIMIT_FACTOR = 0.4;
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
        this.atk = 0;
        this.def = 0;
        this.wis = 0;
        this.agi = 0;
        this.attackResistance = 0;
        this.magicResistance = 0;
        this.breathResistance = 0;
        this.skillProbability = 0;
        this.actionOnDeath = 0;
        this.hpShield = 0;
        this.willAttackAgain = 0;
        this.isNewLogic = {};
    }
    return Status;
})();
var CardManager = (function () {
    function CardManager() {
        if (CardManager._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        CardManager._instance = this;

        this.battle = BattleModel.getInstance();
    }
    CardManager.getInstance = function () {
        if (CardManager._instance === null) {
            CardManager._instance = new CardManager();
        }
        return CardManager._instance;
    };

    CardManager.removeInstance = function () {
        CardManager._instance = null;
    };

    CardManager.prototype.getSortFunc = function (type) {
        switch (type) {
            case 0 /* AGI */:
                return function (a, b) {
                    return b.getAGI() - a.getAGI();
                };
            case 1 /* ATK */:
                return function (a, b) {
                    return b.getATK() - a.getATK();
                };
            case 3 /* DEF */:
                return function (a, b) {
                    return b.getDEF() - a.getDEF();
                };
            case 2 /* WIS */:
                return function (a, b) {
                    return b.getWIS() - a.getWIS();
                };
            default:
                throw new Error("Invalid turn order type!");
        }
    };

    CardManager.prototype.sortAllCurrentMainCards = function () {
        var sortFunc = this.getSortFunc(this.battle.turnOrderBase);
        this.battle.allCurrentMainCards.sort(sortFunc);
    };

    CardManager.prototype.getPlayerCurrentMainCardsByProcOrder = function (player) {
        var playerCards = this.getPlayerCurrentMainCards(player);
        var copy = [];
        for (var i = 0; i < playerCards.length; i++) {
            copy.push(playerCards[i]);
        }

        copy.sort(function (a, b) {
            return a.procIndex - b.procIndex;
        });
        return copy;
    };

    CardManager.prototype.getLeftSideCard = function (card) {
        var playerCards = this.getPlayerCurrentMainCards(card.player);
        var column = card.formationColumn;
        if (column == 0) {
            return null;
        } else if (column <= 4 && column >= 1) {
            return playerCards[column - 1];
        } else {
            throw new Error("Invalid card index");
        }
    };

    CardManager.prototype.getRightSideCard = function (card) {
        var playerCards = this.getPlayerCurrentMainCards(card.player);
        var column = card.formationColumn;
        if (column == 4) {
            return null;
        } else if (column >= 0 && column <= 3) {
            return playerCards[column + 1];
        } else {
            throw new Error("Invalid card index");
        }
    };

    CardManager.prototype.getCardById = function (id) {
        return this.battle.allCardsById[id];
    };

    CardManager.prototype.getPlayerCurrentMainCards = function (player) {
        var battle = this.battle;
        if (player === battle.player1) {
            return battle.p1_mainCards;
        } else if (player === battle.player2) {
            return battle.p2_mainCards;
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.getPlayerCurrentReserveCards = function (player) {
        var battle = this.battle;
        if (player === battle.player1) {
            return battle.p1_reserveCards;
        } else if (player === battle.player2) {
            return battle.p2_reserveCards;
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.getPlayerOriginalMainCards = function (player) {
        var battle = this.battle;
        if (player === battle.player1) {
            return battle.p1_originalMainCards;
        } else if (player === battle.player2) {
            return battle.p2_originalMainCards;
        } else {
            throw new Error("Invalid player");
        }
    };
    CardManager.prototype.getPlayerOriginalReserveCards = function (player) {
        var battle = this.battle;
        if (player === battle.player1) {
            return battle.p1_originalReserveCards;
        } else if (player === battle.player2) {
            return battle.p2_originalReserveCards;
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.getPlayerAllCurrentCards = function (player) {
        return this.getPlayerCurrentMainCards(player).concat(this.getPlayerCurrentReserveCards(player));
    };

    CardManager.prototype.getEnemyCurrentMainCards = function (player) {
        var battle = this.battle;
        if (player === battle.player1) {
            return battle.p2_mainCards;
        } else if (player === battle.player2) {
            return battle.p1_mainCards;
        } else {
            throw new Error("Invalid player");
        }
    };

    CardManager.prototype.getEnemyCurrentReserveCards = function (player) {
        var battle = this.battle;
        if (player === battle.player1) {
            return battle.p2_reserveCards;
        } else if (player === battle.player2) {
            return battle.p1_reserveCards;
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
            return null;
        }

        var randomIndex = getRandomInt(0, possibleIndices.length - 1);

        return cards[possibleIndices[randomIndex]];
    };

    CardManager.prototype.getNearestSingleOpponentTarget = function (executor) {
        var oppCards = this.getPlayerCurrentMainCards(this.battle.getOppositePlayer(executor.player));
        var executorIndex = executor.formationColumn;

        var offsetArray = [0, -1, 1, -2, 2, -3, 3, -4, 4];

        for (var i = 0; i < offsetArray.length; i++) {
            var currentOppCard = oppCards[executorIndex + offsetArray[i]];
            if (currentOppCard && !currentOppCard.isDead) {
                return currentOppCard;
            }
        }

        return null;
    };

    CardManager.prototype.isAllDeadPlayer = function (player) {
        var reserveCond = true;
        if (this.battle.isBloodClash) {
            if (!this.isNoReserveLeft(player))
                reserveCond = false;
        }
        return this.isAllMainCardsDead(player) && reserveCond;
    };

    CardManager.prototype.isAllMainCardsDead = function (player) {
        var mainCards = this.getPlayerCurrentMainCards(player);
        var isAllDead = true;
        for (var i = 0; i < mainCards.length; i++) {
            if (!mainCards[i].isDead) {
                isAllDead = false;
                break;
            }
        }
        return isAllDead;
    };

    CardManager.prototype.isNoReserveLeft = function (player) {
        var reserveCards = this.getPlayerCurrentReserveCards(player);
        var noReserveLeft = true;
        for (var i = 0; i < reserveCards.length; i++) {
            if (reserveCards[i]) {
                noReserveLeft = false;
                break;
            }
        }
        return noReserveLeft;
    };

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

    CardManager.prototype.getAllCurrentMainCards = function () {
        return this.battle.allCurrentMainCards;
    };
    CardManager.prototype.getAllCurrentCards = function () {
        var bt = this.battle;
        return bt.p1_mainCards.concat(bt.p2_mainCards).concat(bt.p1_reserveCards).concat(bt.p2_reserveCards);
    };

    CardManager.prototype.isCurrentMainCard = function (card) {
        return this.isCardInList(card, this.getAllCurrentMainCards());
    };

    CardManager.prototype.updateAllCurrentMainCards = function () {
        var battle = this.battle;
        battle.allCurrentMainCards = battle.p1_mainCards.concat(battle.p2_mainCards);
    };

    CardManager.prototype.switchCardInAllCurrentMainCards = function (oldCard, newCard) {
        var allCurrentMainCards = this.battle.allCurrentMainCards;
        var found = false;
        for (var i = 0; i < allCurrentMainCards.length; i++) {
            if (allCurrentMainCards[i].id == oldCard.id) {
                found = true;
                allCurrentMainCards[i] = newCard;
                break;
            }
        }

        if (!found) {
            throw new Error("Card not found!");
        }
    };

    CardManager.prototype.getAllMainCardsInPlayerOrder = function () {
        return this.battle.p1_mainCards.concat(this.battle.p2_mainCards);
    };

    CardManager.prototype.getPlayerMainBrigString = function (player) {
        var cards = this.getPlayerCurrentMainCards(player);
        return this.getBrigString(cards);
    };
    CardManager.prototype.getPlayerReserveBrigString = function (player) {
        var cards = this.getPlayerOriginalReserveCards(player);
        return this.getBrigString(cards);
    };
    CardManager.prototype.getBrigString = function (cards) {
        var brigStr = "";

        for (var i = 0; i < cards.length; i++) {
            var dash = (i == 0) ? "" : " - ";
            var cb = "showCardDetailDialogById(" + cards[i].id + ");";
            brigStr += (dash + "<a href='javascript:void(0)' onclick='" + cb + "'>" + cards[i].name) + "</a>";
        }

        return brigStr;
    };

    CardManager.prototype.getCurrentMainCardByIndex = function (playerId, index) {
        var cards = this.getPlayerCurrentMainCards(this.battle.getPlayerById(playerId));
        return cards[index];
    };

    CardManager.prototype.getTotalHPRatio = function (cards) {
        var totalRemainHp = 0;
        var totalOriginalHp = 0;
        for (var i = 0, len = cards.length; i < len; i++) {
            var card = cards[i];

            if (card) {
                if (!card.isDead) {
                    totalRemainHp += card.getHP();
                }
                totalOriginalHp += card.originalStats.hp;
            }
        }
        return totalRemainHp / totalOriginalHp;
    };

    CardManager.prototype.getCardInfoForDialog = function (card) {
        var skillInfo = [];
        for (var i = 0; i < card.skills.length; i++) {
            var skill = card.skills[i];
            skillInfo.push({
                "id": skill.id,
                "name": skill.name,
                "comment": skill.description,
                "maxProbability": skill.maxProbability
            });
        }

        return {
            "name": card.fullName,
            "image": getScaledWikiaImageLink(card.imageLink, 150),
            "hp": card.originalStats.hp,
            "atk": card.originalStats.atk,
            "def": card.originalStats.def,
            "wis": card.originalStats.wis,
            "agi": card.originalStats.agi,
            "maxLevel": 99,
            "skills": skillInfo,
            "standardAction": {
                "name": "Standard Action",
                "comment": card.autoAttack.description
            }
        };
    };
    CardManager._instance = null;
    return CardManager;
})();
var famDatabase = {
    11261: {
        name: "Rahab", stats: [14073, 12597, 15498, 9004, 16754],
        skills: [434],
        img: "img2$1/__cb20140423020347/$2/1/1c/Abyssal_Rahab_II_Figure.png",
        fullName: "Abyssal Rahab II"
    },
    11282: {
        name: "Achilles", stats: [13593, 15630, 11362, 10603, 16562],
        skills: [459, 460],
        img: "img1$1/__cb20140514075703/$2/c/c7/Achilles%2C_Fallen_Hero_II_Figure.png",
        fullName: "Achilles, Fallen Hero II"
    },
    10613: {
        name: "Adara", stats: [16024, 12134, 17620, 10857, 9370],
        skills: [166],
        img: "img2$1/__cb20130408194639/$2/6/68/Adara_Luck_Shot_II_Figure.png",
        fullName: "Adara Luck Shot II"
    },
    11099: {
        name: "Adranus", stats: [20223, 23517, 19855, 18609, 18046],
        skills: [347],
        img: "img2$1/__cb20140122120804/$2/7/75/Adranus%2C_Lava_Beast_II_Figure.png",
        fullName: "Adranus, Lava Beast II"
    },
    358: {
        name: "Aegis", stats: [14560, 11280, 15530, 10600, 10100],
        skills: [64],
        img: "img2$1/__cb20130125001448/$2/3/35/Aegis%2C_the_Bulwark_Figure.png",
        fullName: "Aegis, the Bulwark"
    },
    11206: {
        name: "Aeneas", stats: [14590, 15630, 13561, 10311, 13561],
        skills: [400, 401],
        img: "img2$1/__cb20140318125230/$2/5/5c/Aeneas%2C_Fallen_Hero_II_Figure.png",
        fullName: "Aeneas, Fallen Hero II"
    },
    11385: {
        name: "Aeshma", stats: [17558, 17212, 15034, 5804, 13019],
        skills: [579],
        autoAttack: 10035,
        img: "img2$1/__cb20140923104300/$2/4/43/Aeshma%2C_the_Tyrant_II_Figure.png",
        fullName: "Aeshma, the Tyrant II"
    },
    11344: {
        name: "Afanc", stats: [16518, 8610, 14124, 16020, 13214],
        skills: [529, 530],
        autoAttack: 10003,
        img: "img4$1/__cb20140730092623/$2/a/a1/Afanc%2C_Beast_of_the_Deep_II_Figure.png",
        fullName: "Afanc, Beast of the Deep II"
    },
    21404: {
        name: "Ah Puch", stats: [22515, 9134, 18258, 20999, 17486],
        skills: [585],
        autoAttack: 10007,
        img: "img4$1/__cb20140930103246/$2/6/60/Ah_Puch%2C_Lord_of_Death_Figure.png",
        fullName: "Ah Puch, Lord of Death"
    },
    11041: {
        name: "Ahab", stats: [10273, 12001, 11342, 9978, 12342],
        skills: [195],
        img: "img2$1/__cb20131129143807/$2/e/ec/Ahab%2C_the_Colossal_Anchor_II_Figure.png",
        fullName: "Ahab, the Colossal Anchor II"
    },
    10841: {
        name: "Alcina", stats: [12684, 14169, 11356, 13682, 15755],
        skills: [269],
        img: "img3$1/__cb20131023124730/$2/1/1b/Alcina_the_Soulsucker_II_Figure.png",
        fullName: "Alcina the Soulsucker II"
    },
    11400: {
        name: "Ales", stats: [18119, 18009, 16024, 10101, 5884],
        skills: [562, 563],
        img: "img4$1/__cb20140830112829/$2/d/d5/Ales_Darkblood_II_Figure.png",
        fullName: "Ales Darkblood II"
    },
    10813: {
        name: "ASK", stats: [12952, 14282, 11477, 10490, 17133],
        skills: [219],
        img: "img3$1/__cb20130801154343/$2/3/39/All-Seeing_Keeper_II_Figure.png",
        fullName: "All-Seeing Keeper II"
    },
    10936: {
        name: "Merrow", stats: [16811, 14709, 13723, 17537, 17320],
        skills: [217],
        img: "img2$1/__cb20130725105247/$2/6/6d/Alluring_Merrow_II_Figure.png",
        fullName: "Alluring Merrow II"
    },
    10972: {
        name: "Alp", stats: [11917, 14120, 10928, 17168, 13366],
        skills: [277],
        img: "img2$1/__cb20131101130545/$2/0/0d/Alp%2C_Dynast_of_Darkness_II_Figure.png",
        fullName: "Alp, Dynast of Darkness II"
    },
    10623: {
        name: "Warfist", stats: [10904, 11417, 10466, 10660, 11830],
        skills: [156],
        img: "img2$1/__cb20130414034805/$2/1/1a/Amazon_Warfist_II_Figure.png",
        fullName: "Amazon Warfist II"
    },
    11058: {
        name: "Ammit", stats: [18306, 23495, 18501, 18490, 18057],
        skills: [325],
        img: "img2$1/__cb20131221031343/$2/f/f9/Ammit%2C_Soul_Destroyer_II_Figure.png",
        fullName: "Ammit, Soul Destroyer II"
    },
    10717: {
        name: "Amon", stats: [13171, 16128, 10755, 14861, 13214],
        skills: [47],
        img: "img3$1/__cb20130809222440/$2/8/86/Amon%2C_Marquis_of_Blaze_II_Figure.png",
        fullName: "Amon, Marquis of Blaze II"
    },
    10757: {
        name: "Amphisbaena", stats: [14861, 14850, 13030, 19855, 18024],
        skills: [202, 203],
        isMounted: true,
        img: "img3$1/__cb20130622163801/$2/4/46/Amphisbaena_II_Figure.png",
        fullName: "Amphisbaena II"
    },
    11065: {
        name: "ABS", stats: [14005, 15901, 11903, 11838, 14904],
        skills: [365],
        img: "img1$1/__cb20140207105441/$2/e/e0/Ancient_Beetle_Soldier_II_Figure.png",
        fullName: "Ancient Beetle Soldier II"
    },
    10464: {
        name: "Andorra", stats: [12538, 13621, 13510, 12134, 12342],
        skills: [142],
        img: "img2$1/__cb20130325180458/$2/5/52/Andorra_the_Indomitable_II_Figure.png",
        fullName: "Andorra the Indomitable II"
    },
    10947: {
        name: "Ankou", stats: [17017, 9628, 16854, 14308, 10246],
        skills: [345, 346],
        autoAttack: 10007,
        isMounted: true,
        img: "img4$1/__cb20140116043959/$2/d/d6/Ankou%2C_Harbinger_of_Death_II_Figure.png",
        fullName: "Ankou, Harbinger of Death II"
    },
    10999: {
        name: "Anne", stats: [12232, 13782, 12342, 13510, 15599],
        skills: [250],
        img: "img1$1/__cb20130919144950/$2/3/3d/Anne%2C_the_Whirlwind_II_Figure.png",
        fullName: "Anne, the Whirlwind II"
    },
    11245: {
        name: "Anneberg", stats: [19097, 18241, 17038, 8794, 16518],
        skills: [489, 490],
        img: "img1$1/__cb20140614112314/$2/e/e1/Anneberg%2C_Steel_Steed_II_Figure.png",
        fullName: "Anneberg, Steel Steed II"
    },
    11292: {
        name: "Anubis", stats: [14330, 17006, 12510, 10625, 14005],
        skills: [473, 474],
        img: "img2$1/__cb20140528102650/$2/4/47/Anubis%2C_Keeper_of_the_Dead_II_Figure.png",
        fullName: "Anubis, Keeper of the Dead II"
    },
    21288: {
        name: "Apep", stats: [20543, 20975, 15503, 14302, 16729],
        skills: [468],
        autoAttack: 10017,
        img: "img1$1/__cb20140528104324/$2/7/79/Apep_the_Chaotic_Figure.png",
        fullName: "Apep the Chaotic"
    },
    10593: {
        name: "Apocalyptic Beast", stats: [14189, 15977, 15413, 13420, 14969],
        skills: [123],
        img: "img1$1/__cb20130227203821/$2/5/5a/Apocalyptic_Beast_II_Figure.png",
        fullName: "Apocalyptic Beast II"
    },
    11281: {
        name: "Chariot", stats: [17342, 19346, 16453, 10376, 17472],
        skills: [464],
        img: "img3$1/__cb20140520122105/$2/d/da/Arcanan_Chariot_II_Figure.png",
        fullName: "Arcanan Chariot II"
    },
    21300: {
        name: "Fate", stats: [20706, 17848, 13181, 18794, 17522],
        skills: [475],
        autoAttack: 10007,
        img: "img3$1/__cb20140606074954/$2/e/ee/Arcanan_Circle_of_Fate_Figure.png",
        fullName: "Arcanan Circle of Fate"
    },
    11335: {
        name: "Daemon", stats: [18252, 20700, 12510, 13117, 15023],
        skills: [509, 510],
        img: "img2$1/__cb20140711093455/$2/4/49/Arcanan_Daemon_II_Figure.png",
        fullName: "Arcanan Daemon II"
    },
    11324: {
        name: "Death", stats: [20234, 19508, 13008, 13019, 18111],
        skills: [546, 547],
        autoAttack: 10028,
        isMounted: true,
        img: "img2$1/__cb20140815142251/$2/5/5b/Arcanan_Death_II_Figure.png",
        fullName: "Arcanan Death II"
    },
    11239: {
        name: "Emperor", stats: [18577, 17916, 17786, 10809, 14590],
        skills: [425, 426],
        img: "img1$1/__cb20140417053801/$2/0/02/Arcanan_Emperor_II_Figure.png",
        fullName: "Arcanan Emperor II"
    },
    11211: {
        name: "Empress", stats: [15197, 12380, 15348, 19422, 17168],
        skills: [394, 395],
        img: "img1$1/__cb20140314150633/$2/0/04/Arcanan_Empress_II_Figure.png",
        fullName: "Arcanan Empress II"
    },
    11311: {
        name: "Hanged Man", stats: [20505, 15002, 13008, 13030, 18024],
        skills: [480, 481],
        img: "img4$1/__cb20140609073717/$2/8/89/Arcanan_Hanged_Man_II_Figure.png",
        fullName: "Arcanan Hanged Man II"
    },
    11287: {
        name: "Hermit", stats: [19205, 12066, 12586, 20722, 15002],
        skills: [453, 454],
        autoAttack: 10007,
        img: "img3$1/__cb20140512070142/$2/c/c5/Arcanan_Hermit_II_Figure.png",
        fullName: "Arcanan Hermit II"
    },
    11199: {
        name: "High Priestess", stats: [17233, 8350, 20256, 19086, 14839],
        skills: [388, 389],
        autoAttack: 10007,
        img: "img4$1/__cb20140313080212/$2/5/58/Arcanan_High_Priestess_II_Figure.png",
        fullName: "Arcanan High Priestess II"
    },
    11395: {
        name: "Judgment", stats: [19996, 7754, 16009, 19508, 17753],
        skills: [573],
        autoAttack: 10003,
        img: "img1$1/__cb20140914071121/$2/7/72/Arcanan_Judgment_II_Figure.png",
        fullName: "Arcanan Judgment II"
    },
    11242: {
        name: "Lovers", stats: [16908, 13875, 12705, 19021, 17006],
        skills: [430, 431],
        autoAttack: 10007,
        img: "img3$1/__cb20140414082018/$2/f/fb/Arcanan_Lovers_II_Figure.png",
        fullName: "Arcanan Lovers II"
    },
    11208: {
        name: "Magus", stats: [15186, 12131, 17688, 19010, 15641],
        skills: [402, 403],
        img: "img1$1/__cb20140319013115/$2/b/bb/Arcanan_Magus_II_Figure.png",
        fullName: "Arcanan Magus II"
    },
    11284: {
        name: "Might", stats: [18598, 19227, 10766, 13301, 17948],
        skills: [461, 462],
        isMounted: true,
        img: "img2$1/__cb20140516081822/$2/a/a4/Arcanan_Might_II_Figure.png",
        fullName: "Arcanan Might II"
    },
    11363: {
        name: "Moon", stats: [18273, 18046, 13279, 12467, 17948],
        skills: [551, 552],
        autoAttack: 10030,
        img: "img3$1/__cb20140825081610/$2/b/b8/Arcanan_Moon_II_Figure.png",
        fullName: "Arcanan Moon II"
    },
    11360: {
        name: "Star", stats: [20223, 7548, 18035, 18208, 15803],
        skills: [540, 541],
        autoAttack: 10007,
        img: "img4$1/__cb20140812101601/$2/7/75/Arcanan_Star_II_Figure.png",
        fullName: "Arcanan Star II"
    },
    11394: {
        name: "Sun", stats: [20299, 7982, 16356, 18013, 17916],
        skills: [570, 571],
        autoAttack: 10032,
        img: "img1$1/__cb20140912105317/$2/0/0a/Arcanan_Sun_II_Figure.png",
        fullName: "Arcanan Sun II"
    },
    11332: {
        name: "Temperance", stats: [19183, 3800, 20007, 19985, 18046],
        skills: [543],
        autoAttack: 10027,
        img: "img3$1/__cb20140814101445/$2/8/8d/Arcanan_Temperance_II_Figure.png",
        fullName: "Arcanan Temperance II"
    },
    11329: {
        name: "Archbishop", stats: [19064, 20191, 16009, 10744, 15002],
        skills: [520],
        autoAttack: 10025,
        img: "img3$1/__cb20140722101833/$2/9/9a/Archbishop_of_the_Deep_II_Figure.png",
        fullName: "Archbishop of the Deep II"
    },
    10600: {
        name: "Ose", stats: [16995, 14395, 15023, 14850, 11990],
        skills: [154],
        img: "img3$1/__cb20130314191037/$2/0/00/Archduke_Ose_II_Figure.png",
        fullName: "Archduke Ose II"
    },
    11105: {
        name: "Ares", stats: [25434, 21285, 21047, 16345, 17407],
        skills: [542],
        img: "img1$1/__cb20140814101503/$2/8/80/Ares%2C_God_of_Ruin_II_Figure.png",
        fullName: "Ares, God of Ruin II"
    },
    10372: {
        name: "Artemisia", stats: [10042, 10977, 10977, 10042, 12589],
        skills: [18],
        img: "img3$1/__cb20130222034947/$2/a/aa/Artemisia_Swiftfoot_II_Figure.png",
        fullName: "Artemisia Swiftfoot II"
    },
    10595: {
        name: "Astaroth", stats: [12194, 13965, 10087, 15278, 14280],
        skills: [155],
        img: "img2$1/__cb20130314191037/$2/2/2e/Astaroth%2C_Duke_of_Fear_II_Figure.png",
        fullName: "Astaroth, Duke of Fear II"
    },
    10900: {
        name: "Aurboda", stats: [11903, 15348, 11773, 18468, 11015],
        skills: [261],
        img: "img3$1/__cb20131009141347/$2/1/15/Aurboda%2C_the_Great_Mother_II_Figure.png",
        fullName: "Aurboda, the Great Mother II"
    },
    11388: {
        name: "Azi", stats: [20375, 20202, 20104, 22899, 18057],
        skills: [572],
        autoAttack: 10033,
        img: "img2$1/__cb20140914071105/$2/5/5b/Azi_Dahaka_II_Figure.png",
        fullName: "Azi Dahaka II"
    },
    10657: {
        name: "Baal", stats: [14677, 15457, 12813, 14482, 16551],
        skills: [178],
        img: "img2$1/__cb20130430102647/$2/2/2f/Baal%2C_Thunder_Lord_of_Hell_II_Figure.png",
        fullName: "Baal, Thunder Lord of Hell II"
    },
    11168: {
        name: "Badalisc", stats: [14092, 16107, 11882, 11297, 15218],
        skills: [315],
        img: "img2$1/__cb20131212173203/$2/6/6c/Badalisc%2C_the_Gourmet_II_Figure.png",
        fullName: "Badalisc, the Gourmet II"
    },
    11390: {
        name: "Suzhen", stats: [15998, 3096, 15002, 17504, 17006],
        skills: [81],
        autoAttack: 10031,
        img: "img1$1/__cb20140914071137/$2/0/05/Bai_Suzhen%2C_Lady_of_Scales_II_Figure.png",
        fullName: "Bai Suzhen, Lady of Scales II"
    },
    11102: {
        name: "Balgo", stats: [18585, 16037, 13962, 5799, 13510],
        skills: [349],
        img: "img2$1/__cb20140122120902/$2/f/fd/Balgo%2C_the_Cursed_Flame_II_Figure.png",
        fullName: "Balgo, the Cursed Flame II"
    },
    10652: {
        name: "Batraz", stats: [14471, 15511, 13442, 12293, 12174],
        skills: [142],
        img: "img4$1/__cb20130227154434/$2/e/e3/Batraz%2C_the_Immortal_Hero_II_Figure.png",
        fullName: "Batraz, the Immortal Hero II"
    },
    11371: {
        name: "Bayam", stats: [13269, 7966, 12804, 17106, 16779],
        skills: [506],
        autoAttack: 10023,
        img: "img1$1/__cb20140709072737/$2/7/71/Bayam_II_Figure.png",
        fullName: "Bayam II"
    },
    11025: {
        name: "Scarecrow", stats: [10625, 13756, 10490, 11001, 9342],
        skills: [256],
        img: "img3$1/__cb20131002022744/$2/4/4d/Beheading_Scarecrow_II_Figure.png",
        fullName: "Beheading Scarecrow II"
    },
    10659: {
        name: "Behemoth", stats: [12442, 14755, 13269, 12380, 12999],
        skills: [186],
        img: "img2$1/__cb20130514143810/$2/3/30/Behemoth%2C_Thunder_Beast_II_Figure.png",
        fullName: "Behemoth, Thunder Beast II"
    },
    10684: {
        name: "Biast", stats: [13879, 12655, 10163, 13611, 9798],
        skills: [163],
        img: "img2$1/__cb20130402220653/$2/2/29/Biast_II_Figure.png",
        fullName: "Biast II"
    },
    10787: {
        name: "Black Knight", stats: [12648, 16097, 11623, 11574, 13842],
        skills: [211],
        img: "img1$1/__cb20130714135313/$2/9/9e/Black_Knight%2C_Soul_Hunter_II_Figure.png",
        fullName: "Black Knight, Soul Hunter II"
    },
    10824: {
        name: "Bolus", stats: [12086, 16889, 12427, 11610, 12832],
        skills: [152],
        img: "img4$1/__cb20130816162357/$2/a/a0/Bolus%2C_the_Blue_Bolt_II_Figure.png",
        fullName: "Bolus, the Blue Bolt II"
    },
    10977: {
        name: "Boudica", stats: [9967, 11914, 8918, 13110, 12014],
        skills: [276],
        img: "img2$1/__cb20131101130430/$2/a/ab/Boudica%2C_the_Dawn_Chief_II_Figure.png",
        fullName: "Boudica, the Dawn Chief II"
    },
    11223: {
        name: "Brang", stats: [18826, 18544, 14027, 18208, 10105],
        skills: [423],
        autoAttack: 10010,
        img: "img4$1/__cb20140417053801/$2/f/f3/Brang_Two-Heads_II_Figure.png",
        fullName: "Brang Two-Heads II"
    },
    11209: {
        name: "Rabbit", stats: [18999, 13951, 20007, 9986, 18035],
        skills: [435, 436],
        img: "img2$1/__cb20140423020348/$2/6/6e/Brass_Rabbit_Figure.png",
        fullName: "Brass Rabbit"
    },
    11194: {
        name: "Tarantula", stats: [19324, 14568, 18024, 15695, 12120],
        skills: [396, 397],
        autoAttack: 10005,
        img: "img2$1/__cb20140318135240/$2/7/71/Brass_Tarantula_II_Figure.png",
        fullName: "Brass Tarantula II"
    },
    11171: {
        name: "Hyena", stats: [14644, 10766, 11860, 18923, 12228],
        skills: [321],
        autoAttack: 10008,
        img: "img2$1/__cb20131227221825/$2/f/fc/Bronzeclad_Hyena_II_Figure.png",
        fullName: "Bronzeclad Hyena II"
    },
    11114: {
        name: "Brownies", stats: [9821, 11283, 9515, 13196, 11414],
        skills: [307],
        img: "img1$1/__cb20131202082920/$2/9/90/Brownies%2C_the_Uproarious_II_Figure.png",
        fullName: "Brownies, the Uproarious II"
    },
    10488: {
        name: "Bunga", stats: [12269, 11049, 14182, 9612, 10343],
        skills: [125],
        img: "img2$1/__cb20130107205042/$2/5/5d/Bunga%2C_the_Stalwart_II_Figure.png",
        fullName: "Bunga, the Stalwart II"
    },
    11129: {
        name: "Caassimolar", stats: [16009, 24979, 15587, 10625, 12521],
        skills: [371],
        img: "img1$1/__cb20140213034945/$2/c/c7/Caassimolar%2C_the_Chimera_II_Figure.png",
        fullName: "Caassimolar, the Chimera II"
    },
    11449: {
        name: "Camazo", stats: [22628, 22585, 22173, 16139, 18208],
        skills: [601, 445],
        autoAttack: 10038,
        img: "img2$1/__cb20141014080304/$2/6/6c/Camazo%2C_Knight_of_Bats_II_Figure.png",
        fullName: "Camazo, Knight of Bats II"
    },
    11119: {
        name: "Canhel", stats: [15608, 19606, 17992, 11329, 16399],
        skills: [293],
        img: "img2$1/__cb20131122150727/$2/5/54/Canhel%2C_Guardian_Dragon_II_Figure.png",
        fullName: "Canhel, Guardian Dragon II"
    },
    10997: {
        name: "Jolly", stats: [14200, 16594, 14070, 18956, 15424],
        skills: [226],
        img: "img2$1/__cb20130828162829/$2/1/14/Cap%27n_Jolly%2C_Sea_Scourge_II_Figure.png",
        fullName: "Cap'n Jolly, Sea Scourge II"
    },
    11333: {
        name: "Kidd", stats: [18403, 18046, 12781, 14395, 16085],
        skills: [157, 518],
        img: "img4$1/__cb20140717114923/$2/4/42/Captain_Kidd_II_Figure.png",
        fullName: "Captain Kidd II"
    },
    11062: {
        name: "Chillweaver", stats: [13293, 13196, 10611, 16144, 14489],
        skills: [2],
        img: "img2$1/__cb20131215131933/$2/b/b2/Cat_Sith_Chillweaver_II_Figure.png",
        fullName: "Cat Sith Chillweaver II"
    },
    11090: {
        name: "CSMM", stats: [14096, 10112, 10549, 15804, 17095],
        skills: [343],
        autoAttack: 10007,
        img: "img2$1/__cb20140116044027/$2/6/6d/Cat_Sith_Magus_Master_II_Figure.png",
        fullName: "Cat Sith Magus Master II"
    },
    11366: {
        name: "CSS", stats: [15034, 16518, 13052, 7202, 16811],
        skills: [549],
        img: "img1$1/__cb20140823140158/$2/7/7b/Cat_Sith_Swordswoman_II_Figure.png",
        fullName: "Cat Sith Swordswoman II"
    },
    11213: {
        name: "Cegila", stats: [13149, 11492, 9498, 17504, 16995],
        skills: [354],
        img: "img2$1/__cb20140110084814/$2/a/a5/Cegila%2C_Dragonian_Incantator_II_Figure.png",
        fullName: "Cegila, Dragonian Incantator II"
    },
    10673: {
        name: "Cernunnos", stats: [16446, 15351, 13761, 13181, 14330],
        skills: [177],
        img: "img2$1/__cb20130422194540/$2/5/5b/Cernunnos_II_Figure.png",
        fullName: "Cernunnos II"
    },
    10409: {
        name: "Magma Giant", stats: [12832, 12380, 13097, 11477, 11928],
        skills: [123],
        img: "img3$1/__cb20130202212620/$2/6/63/Chaotic_Magma_Giant_II_Figure.png",
        fullName: "Chaotic Magma Giant II"
    },
    10907: {
        name: "Chiyome", stats: [12635, 14148, 11369, 15817, 13510],
        skills: [238],
        img: "img1$1/__cb20130921071449/$2/8/83/Chiyome%2C_the_Kamaitachi_II_Figure.png",
        fullName: "Chiyome, the Kamaitachi II"
    },
    11306: {
        name: "Circe", stats: [15002, 7776, 11947, 17017, 16009],
        skills: [487, 488],
        autoAttack: 10007,
        img: "img2$1/__cb20140612092914/$2/0/0f/Circe%2C_Fallen_Heroine_II_Figure.png",
        fullName: "Circe, Fallen Heroine II"
    },
    11392: {
        name: "Viper", stats: [14999, 12999, 14999, 7808, 17133],
        skills: [574],
        img: "img3$1/__cb20140914071153/$2/3/38/Clockwork_Viper_II_Figure.png",
        fullName: "Clockwork Viper II"
    },
    10303: {
        name: "Crystal Gillant", stats: [11832, 10896, 10439, 10439, 13317],
        skills: [11],
        img: "img4$1/__cb20130106234145/$2/6/60/Crystal_Gillant_II_Figure.png",
        fullName: "Crystal Gillant II"
    },
    11095: {
        name: "Roc", stats: [12073, 14879, 12559, 11501, 16510],
        skills: [322],
        img: "img2$1/__cb20131227221759/$2/2/20/Crystalwing_Roc_II_Figure.png",
        fullName: "Crystalwing Roc II"
    },
    10712: {
        name: "Cuelebre", stats: [13702, 16096, 12954, 11134, 13572],
        skills: [249],
        img: "img2$1/__cb20130916113928/$2/8/8c/Cuelebre_the_Ironscaled_II_Figure.png",
        fullName: "Cuelebre the Ironscaled II"
    },
    11019: {
        name: "Cursebone", stats: [14807, 16952, 14146, 15652, 17721],
        skills: [248],
        img: "img3$1/__cb20130926150410/$2/3/3e/Cursebone_Pterosaur_II_Figure.png",
        fullName: "Cursebone Pterosaur II"
    },
    10820: {
        name: "Cyclops", stats: [15868, 17147, 18360, 13214, 14449],
        skills: [218],
        img: "img3$1/__cb20130801154345/$2/b/ba/Cyclops%2C_the_Rocky_Cliff_II_Figure.png",
        fullName: "Cyclops, the Rocky Cliff II"
    },
    11328: {
        name: "Dagon", stats: [23343, 22065, 18035, 19703, 18208],
        skills: [519],
        img: "img3$1/__cb20140722101815/$2/6/6a/Dagon_II_Figure.png",
        fullName: "Dagon II"
    },
    10973: {
        name: "Dagr", stats: [12012, 14059, 10712, 17818, 13810],
        skills: [275],
        img: "img4$1/__cb20131030132715/$2/d/d2/Dagr_Sunrider_II_Figure.png",
        fullName: "Dagr Sunrider II"
    },
    10983: {
        name: "Danniel", stats: [23571, 24990, 21458, 13951, 16204],
        skills: [292],
        img: "img1$1/__cb20131122150756/$2/e/e2/Danniel%2C_Golden_Paladin_II_Figure.png",
        fullName: "Danniel, Golden Paladin II"
    },
    11415: {
        name: "Dantalion", stats: [15193, 5298, 10990, 14207, 11098],
        skills: [596],
        autoAttack: 10007,
        img: "img1$1/__cb20141009082936/$2/8/8e/Dantalion%2C_Duke_of_Hell_II_Figure.png",
        fullName: "Dantalion, Duke of Hell II"
    },
    21445: {
        name: "Darkwind Wyvern", stats: [22211, 8270, 19352, 20917, 17649],
        skills: [607],
        autoAttack: 10042,
        img: "img4$1/__cb20141025082638/$2/d/dd/Darkwind_Wyvern_Figure.png",
        fullName: "Darkwind Wyvern"
    },
    10905: {
        name: "Danzo", stats: [14774, 17277, 14872, 17667, 16128],
        skills: [237],
        img: "img4$1/__cb20130921071511/$2/6/64/Danzo%2C_Falcon_Ninja_II_Figure.png",
        fullName: "Danzo, Falcon Ninja II"
    },
    21308: {
        name: "Justice", stats: [20795, 11717, 17470, 22225, 18005],
        skills: [494, 495],
        autoAttack: 10007,
        img: "img2$1/__cb20140619104322/$2/7/7c/Dauntless_Justice_Figure.png",
        fullName: "Dauntless Justice"
    },
    10967: {
        name: "Deborah", stats: [13550, 14157, 13442, 12987, 13929],
        skills: [222],
        img: "img3$1/__cb20130815132429/$2/7/73/Deborah%2C_Knight_Immaculate_II_Figure.png",
        fullName: "Deborah, Knight Immaculate II"
    },
    11225: {
        name: "Dein", stats: [14000, 16768, 11098, 11683, 14417],
        skills: [424],
        img: "img4$1/__cb20140417053801/$2/8/8e/Dein%2C_Silent_Bomber_II_Figure.png",
        fullName: "Dein, Silent Bomber II"
    },
    10722: {
        name: "Delphyne", stats: [11990, 14601, 11882, 18858, 11080],
        skills: [288],
        img: "img4$1/__cb20131101130817/$2/1/15/Delphyne%2C_Thunder_Dragon_II_Figure.png",
        fullName: "Delphyne, Thunder Dragon II"
    },
    10503: {
        name: "Desna", stats: [13146, 15089, 14287, 12137, 12378],
        skills: [124],
        img: "img2$1/__cb20130106235645/$2/4/45/Desna%2C_Mythic_Wendigo_II_Figure.png",
        fullName: "Desna, Mythic Wendigo II"
    },
    10914: {
        name: "Dharva", stats: [14096, 13742, 12280, 11942, 15427],
        skills: [254],
        img: "img2$1/__cb20131002004805/$2/9/97/Dharva_Fangclad_II_Figure.png",
        fullName: "Dharva Fangclad II"
    },
    11096: {
        name: "Djinn", stats: [14048, 17363, 13333, 19422, 16605],
        skills: [319, 320],
        img: "img1$1/__cb20131227221855/$2/8/8d/Djinn_of_the_Lamp_II_Figure.png",
        fullName: "Djinn of the Lamp II"
    },
    11355: {
        name: "Dong", stats: [13489, 17000, 13196, 8150, 16110],
        skills: [545],
        img: "img4$1/__cb20140814101413/$2/8/8b/Dong%2C_the_Bloody_Claw_II_Figure.png",
        fullName: "Dong, the Bloody Claw II"
    },
    10423: {
        name: "Doppeladler", stats: [13940, 14709, 14417, 14092, 14850],
        skills: [33],
        img: "img1$1/__cb20130107210324/$2/6/68/Doppeladler_II_Figure.png",
        fullName: "Doppeladler II"
    },
    10691: {
        name: "Dors", stats: [15435, 9433, 13268, 16464, 13019],
        skills: [446],
        img: "img1$1/__cb20140428113705/$2/1/1d/Dors%2C_Demiwyrm_Warrior_II_Figure.png",
        fullName: "Dors, Demiwyrm Warrior II"
    },
    11303: {
        name: "Dunkleosteus", stats: [14000, 8394, 13110, 16620, 15804],
        skills: [477],
        autoAttack: 10007,
        img: "img2$1/__cb20140606074955/$2/2/22/Dunkleosteus%2C_the_Rendmaw_II_Figure.png",
        fullName: "Dunkleosteus, the Rendmaw II"
    },
    10272: {
        name: "Cat Sidhe", stats: [9614, 8322, 11959, 11243, 10056],
        skills: [18],
        img: "img4$1/__cb20130228073440/$2/4/48/Earl_Cat_Sidhe_II_Figure.png",
        fullName: "Earl Cat Sidhe II"
    },
    10619: {
        name: "Ebon", stats: [17493, 15543, 13431, 14330, 13788],
        skills: [157],
        img: "img2$1/__cb20130330174610/$2/4/48/Ebon_Dragon_II_Figure.png",
        fullName: "Ebon Dragon II"
    },
    10756: {
        name: "Edgardo", stats: [10904, 15485, 14389, 8978, 14755],
        skills: [179],
        img: "img2$1/__cb20130430110741/$2/5/5f/Edgardo%2C_Grand_Inquisitor_II_Figure.png",
        fullName: "Edgardo, Grand Inquisitor II"
    },
    11450: {
        name: "Elsa", stats: [19010, 19021, 15132, 10018, 17851],
        skills: [602],
        autoAttack: 10039,
        img: "img2$1/__cb20141014080304/$2/f/fe/Elsa%2C_Undead_Bride_II_Figure.png",
        fullName: "Elsa, Undead Bride II"
    },
    21276: {
        name: "Empusa", stats: [20706, 12623, 16110, 20999, 17510],
        skills: [447],
        autoAttack: 10016,
        img: "img3$1/__cb20140508115333/$2/0/0a/Empusa%2C_the_Death_Scythe_Figure.png",
        fullName: "Empusa, the Death Scythe"
    },
    10317: {
        name: "Eton", stats: [10904, 10490, 10490, 12952, 12952],
        skills: [94],
        img: "img1$1/__cb20130106232503/$2/7/74/Eton%2C_Eater_of_Darkness_II_Figure.png",
        fullName: "Eton, Eater of Darkness II"
    },
    10708: {
        name: "Ettin", stats: [16063, 14482, 14677, 9498, 13702],
        skills: [304],
        autoAttack: 10006,
        img: "img3$1/__cb20131129144223/$2/1/1f/Ettin_II_Figure.png",
        fullName: "Ettin II"
    },
    11358: {
        name: "Europa", stats: [14731, 8296, 12207, 16735, 16518],
        skills: [538, 539],
        autoAttack: 10007,
        img: "img4$1/__cb20140809012700/$2/2/25/Europa%2C_Fallen_Heroine_II_Figure.png",
        fullName: "Europa, Fallen Heroine II"
    },
    10452: {
        name: "Evil Eye", stats: [10770, 10394, 10490, 12221, 11721],
        skills: [120],
        img: "img2$1/__cb20130205203018/$2/b/bf/Evil_Eye_II_Figure.png",
        fullName: "Evil Eye II"
    },
    10674: {
        name: "Fenrir", stats: [15099, 16865, 22498, 13008, 11167],
        skills: [154],
        img: "img1$1/__cb20130420124059/$2/d/dd/Fenrir_II_Figure.png",
        fullName: "Fenrir II"
    },
    21352: {
        name: "Siege Tower", stats: [20007, 19750, 16915, 14021, 17567],
        skills: [548],
        autoAttack: 10029,
        img: "img2$1/__cb20140823140158/$2/9/93/Ferocious_Siege_Tower_Figure.png",
        fullName: "Ferocious Siege Tower"
    },
    10496: {
        name: "Bat Demon", stats: [12538, 14182, 12648, 11928, 12720],
        skills: [131],
        img: "img1$1/__cb20130201171143/$2/0/0e/Fiendish_Bat_Demon_II_Figure.png",
        fullName: "Fiendish Bat Demon II"
    },
    10849: {
        name: "Fimbul", stats: [12086, 13489, 12562, 16743, 12597],
        skills: [242],
        img: "img2$1/__cb20130917112620/$2/4/4a/Fimbul_Frostclad_II_Figure.png",
        fullName: "Fimbul Frostclad II"
    },
    10470: {
        name: "Flame Dragon", stats: [14601, 14449, 13756, 15153, 13940],
        skills: [23],
        img: "img1$1/__cb20130107210805/$2/8/8e/Flame_Dragon_II_Figure.png",
        fullName: "Flame Dragon II"
    },
    10888: {
        name: "Flesh Collector Golem", stats: [17450, 14536, 18089, 8664, 9661],
        skills: [253],
        img: "img2$1/__cb20131002005230/$2/5/52/Flesh_Collector_Golem_II_Figure.png",
        fullName: "Flesh Collector Golem II"
    },
    11191: {
        name: "Freyja", stats: [14709, 17125, 14027, 10213, 12380],
        skills: [387],
        img: "img3$1/__cb20140301012048/$2/c/c8/Freyja%2C_Earth_Goddess_II_Figure.png",
        fullName: "Freyja, Earth Goddess II"
    },
    10473: {
        name: "Freila", stats: [11928, 10490, 12453, 12221, 11417],
        skills: [16],
        img: "img3$1/__cb20130209140811/$2/f/f2/Freila_the_Bountiful_II_Figure.png",
        fullName: "Freila the Bountiful II"
    },
    11190: {
        name: "Freyr", stats: [16562, 19909, 15370, 12943, 15998],
        skills: [385, 386],
        img: "img1$1/__cb20140301012048/$2/5/51/Freyr%2C_God_of_the_Harvest_II_Figure.png",
        fullName: "Freyr, God of the Harvest II"
    },
    10606: {
        name: "Fomor", stats: [13052, 14645, 11928, 9967, 9781],
        skills: [138],
        img: "img1$1/__cb20130208175749/$2/4/43/Fomor_the_Savage_II_Figure.png",
        fullName: "Fomor the Savage II"
    },
    11115: {
        name: "Bearwolf", stats: [14503, 24513, 11492, 11405, 17992],
        skills: [353],
        img: "img2$1/__cb20140112201013/$2/5/5b/Frost_Bearwolf_II_Figure.png",
        fullName: "Frost Bearwolf II"
    },
    10022: {
        name: "Galahad", stats: [6543, 7271, 7349, 6842, 6478],
        skills: [10000, 33, 5],
        isMounted: true,
        img: "img4$1/__cb20130228233340/$2/e/e2/Galahad%2C_Drake_Knight_II_Figure.png",
        fullName: "Galahad, Drake Knight II"
    },
    11172: {
        name: "Galatea", stats: [19833, 10062, 15825, 18566, 15218],
        skills: [533],
        autoAttack: 10007,
        img: "img4$1/__cb20140810144815/$2/8/8a/Galatea%2C_Nereid_II_Figure.png",
        fullName: "Galatea, Nereid II"
    },
    201: {
        name: "Gan Ceann", stats: [7950, 10530, 8830, 8910, 8540],
        skills: [33],
        img: "img2$1/__cb20130224083941/$2/c/ca/Gan_Ceann_Figure.png",
        fullName: "Gan Ceann"
    },
    10842: {
        name: "Gargoyle Gatekeeper", stats: [15608, 17602, 14503, 15002, 18035],
        skills: [268],
        img: "img2$1/__cb20131023124814/$2/7/77/Gargoyle_Gatekeeper_II_Figure.png",
        fullName: "Gargoyle Gatekeeper II"
    },
    21384: {
        name: "Garshasp", stats: [22002, 18058, 20019, 20007, 8223],
        skills: [578],
        autoAttack: 10034,
        img: "img2$1/__cb20140925080753/$2/2/25/Garshasp%2C_the_Juggernaut_Figure.png",
        fullName: "Garshasp, the Juggernaut"
    },
    10609: {
        name: "Garuda", stats: [14417, 14677, 14081, 15814, 15023],
        skills: [47],
        img: "img1$1/__cb20130322102239/$2/b/bf/Garuda_II_Figure.png",
        fullName: "Garuda II"
    },
    10571: {
        name: "Gathgoic", stats: [14839, 16128, 14980, 17948, 14709],
        skills: [141],
        img: "img3$1/__cb20130122044308/$2/f/fb/Gathgoic_the_Other_II_Figure.png",
        fullName: "Gathgoic the Other II"
    },
    10742: {
        name: "Gevi", stats: [15565, 15424, 18447, 13593, 11015],
        skills: [180],
        img: "img2$1/__cb20130508213020/$2/5/55/Gevi%2C_Crystal_Troll_Master_II_Figure.png",
        fullName: "Gevi, Crystal Troll Master II"
    },
    10088: {
        name: "Ghislandi", stats: [12324, 13551, 13525, 12212, 12187],
        skills: [17],
        img: "img4$1/__cb20130106212217/$2/6/68/Ghislandi%2C_Iron_Heart_II_Figure.png",
        fullName: "Ghislandi, Iron Heart II"
    },
    11271: {
        name: "Ghislandi L", stats: [18533, 20234, 14590, 10235, 16204],
        skills: [455, 456],
        autoAttack: 10015,
        img: "img3$1/__cb20140515012432/$2/9/91/Ghislandi%2C_the_Unchained_II_Figure.png",
        fullName: "Ghislandi, the Unchained II"
    },
    11453: {
        name: "GCE", stats: [15100, 7564, 11403, 17254, 16609],
        skills: [604],
        autoAttack: 10007,
        img: "img3$1/__cb20141014080306/$2/3/33/Ghost_Carriage_Express_II_Figure.png",
        fullName: "Ghost Carriage Express II"
    },
    11304: {
        name: "Gigantopithecus", stats: [24210, 25055, 21946, 13994, 15998],
        skills: [491],
        img: "img3$1/__cb20140620060851/$2/e/e5/Gigantopithecus_II_Figure.png",
        fullName: "Gigantopithecus II"
    },
    11375: {
        name: "Gilgamesh", stats: [20115, 19053, 18013, 8220, 16096],
        skills: [558, 559],
        img: "img1$1/__cb20140830112828/$2/e/e1/Gilgamesh_the_Bold_II_Figure.png",
        fullName: "Gilgamesh the Bold II"
    },
    10177: {
        name: "Goblin King", stats: [8144, 8339, 6400, 10159, 10278],
        skills: [18],
        img: "img3$1/__cb20130228171344/$2/4/4f/Goblin_King_II_Figure.png",
        fullName: "Goblin King II"
    },
    10011: {
        name: "Gorgon", stats: [10170, 12436, 8652, 12773, 10924],
        skills: [18],
        img: "img4$1/__cb20130227140440/$2/6/6f/Gorgon_II_Figure.png",
        fullName: "Gorgon II"
    },
    10611: {
        name: "Gorlin", stats: [11928, 12380, 17000, 6809, 10904],
        skills: [167],
        img: "img1$1/__cb20130408193159/$2/5/50/Gorlin_Gold_Helm_II_Figure.png",
        fullName: "Gorlin Gold Helm II"
    },
    10720: {
        name: "Goviel", stats: [14135, 14547, 13604, 14926, 16616],
        skills: [204],
        img: "img2$1/__cb20130613194848/$2/9/90/Goviel%2C_Hail_Knight_II_Figure.png",
        fullName: "Goviel, Hail Knight II"
    },
    10551: {
        name: "Grandor", stats: [14709, 17277, 15738, 13756, 11903],
        skills: [149],
        img: "img3$1/__cb20130308154138/$2/6/65/Grandor%2C_Giant_of_Old_II_Figure.png",
        fullName: "Grandor, Giant of Old II"
    },
    10586: {
        name: "Gregoire", stats: [11708, 12121, 10318, 14854, 10159],
        skills: [144],
        img: "img3$1/__cb20130208175748/$2/0/08/Gregoire%2C_Weaponmaster_II_Figure.png",
        fullName: "Gregoire, Weaponmaster II"
    },
    11131: {
        name: "Gregory", stats: [16192, 16121, 15558, 9794, 10294],
        skills: [372],
        img: "img2$1/__cb20140213035030/$2/4/48/Gregory%2C_the_Masked_Slayer_II_Figure.png",
        fullName: "Gregory, the Masked Slayer II"
    },
    10791: {
        name: "Grellas", stats: [12066, 14796, 10636, 17374, 13073],
        skills: [212],
        img: "img2$1/__cb20130714135315/$2/1/11/Grellas_Fellstaff_II_Figure.png",
        fullName: "Grellas Fellstaff II"
    },
    21216: {
        name: "Gremory", stats: [18466, 12819, 18945, 20426, 17009],
        skills: [411],
        autoAttack: 10007,
        img: "img2$1/__cb20140403112446/$2/0/0b/Gremory%2C_the_Vermilion_Moon_Figure.png",
        fullName: "Gremory, the Vermilion Moon"
    },
    10784: {
        name: "Gretch", stats: [16280, 15305, 12683, 15652, 13875],
        skills: [196],
        img: "img3$1/__cb20130609110933/$2/a/a9/Gretch%2C_Chimaera_Mistress_II_Figure.png",
        fullName: "Gretch, Chimaera Mistress II"
    },
    10182: {
        name: "Griffin", stats: [11887, 9909, 14391, 14263, 11960],
        skills: [2],
        img: "img4$1/__cb20130222030204/$2/5/57/Griffin_Mount_II_Figure.png",
        fullName: "Griffin Mount II"
    },
    361: {
        name: "Griflet", stats: [11520, 12970, 11430, 10110, 13780],
        skills: [10],
        img: "img2$1/__cb20130125001834/$2/b/b1/Griflet%2C_Falcon_Knight_Figure.png",
        fullName: "Griflet, Falcon Knight"
    },
    10276: {
        name: "Grim", stats: [11001, 13047, 8888, 13026, 11060],
        skills: [109],
        img: "img1$1/__cb20130301090046/$2/7/7f/Grim_Executioner_II_Figure.png",
        fullName: "Grim Executioner II"
    },
    10925: {
        name: "Grimoire", stats: [15231, 18609, 10441, 8064, 15451],
        skills: [134],
        img: "img4$1/__cb20131115130412/$2/9/9b/Grimoire_Beast_II_Figure.png",
        fullName: "Grimoire Beast II"
    },
    11170: {
        name: "Gryla", stats: [16529, 11622, 15868, 15294, 8740],
        skills: [308, 316],
        isMounted: true,
        img: "img2$1/__cb20131214151558/$2/c/c3/Gryla%2C_the_Lullaby_II_Figure.png",
        fullName: "Gryla, the Lullaby II"
    },
    21285: {
        name: "Guillaume", stats: [21515, 20887, 16308, 12948, 18505],
        skills: [466, 467],
        img: "img1$1/__cb20140520122326/$2/2/22/Guillaume%2C_Fanatic_Figure.png",
        fullName: "Guillaume, Fanatic"
    },
    10898: {
        name: "Hamad", stats: [10294, 10367, 9881, 16416, 10951],
        skills: [265],
        img: "img3$1/__cb20131010165301/$2/f/fd/Hamad%2C_the_Sweeping_Wind_II_Figure.png",
        fullName: "Hamad, the Sweeping Wind II"
    },
    10861: {
        name: "Haokah", stats: [13476, 13928, 11111, 15706, 13245],
        skills: [232],
        img: "img1$1/__cb20130901131933/$2/9/98/Haokah%2C_the_Lightning_Brave_II_Figure.png",
        fullName: "Haokah, the Lightning Brave II"
    },
    11451: {
        name: "Hatshepsut", stats: [17049, 16334, 13041, 6097, 16096],
        skills: [603],
        autoAttack: 10040,
        img: "img2$1/__cb20141014080305/$2/b/bd/Hatshepsut%2C_Mummy_Queen_II_Figure.png",
        fullName: "Hatshepsut, Mummy Queen II"
    },
    10951: {
        name: "Hecatoncheir", stats: [11807, 13902, 14768, 13928, 13366],
        skills: [264],
        img: "img4$1/__cb20131010170211/$2/8/88/Hecatoncheir_the_Adamantine_II_Figure.png",
        fullName: "Hecatoncheir the Adamantine II"
    },
    21312: {
        name: "Hei Long", stats: [20486, 13485, 16192, 20881, 17113],
        skills: [496],
        autoAttack: 10019,
        img: "img1$1/__cb20140628103009/$2/b/bd/Hei_Long%2C_the_New_Moon_Figure.png",
        fullName: "Hei Long, the New Moon"
    },
    10465: {
        name: "Heinrich", stats: [16887, 13940, 15132, 13290, 14005],
        skills: [133],
        img: "img3$1/__cb20130124152435/$2/0/05/Heinrich_the_Bold_II_Figure.png",
        fullName: "Heinrich the Bold II"
    },
    10634: {
        name: "Hel", stats: [14709, 17450, 14709, 15771, 18057],
        skills: [239, 240],
        img: "img1$1/__cb20130921074034/$2/e/e8/Hel%2C_Goddess_of_Death_II_Figure.png",
        fullName: "Hel, Goddess of Death II"
    },
    10895: {
        name: "Hercinia", stats: [14062, 13414, 12562, 12686, 15876],
        skills: [225],
        img: "img1$1/__cb20130819222302/$2/a/a4/Hercinia_the_Blest_II_Figure.png",
        fullName: "Hercinia the Blest II"
    },
    11202: {
        name: "Hereward", stats: [14927, 14000, 12524, 10951, 15498],
        skills: [391],
        img: "img1$1/__cb20140313080213/$2/0/05/Hereward%2C_Storm_of_Arrows_II_Figure.png",
        fullName: "Hereward, Storm of Arrows II"
    },
    11073: {
        name: "Hippocamp", stats: [14514, 16486, 14926, 19855, 15002],
        skills: [360, 167],
        img: "img4$1/__cb20140129062341/$2/f/f8/Hippocamp_II_Figure.png",
        fullName: "Hippocamp II"
    },
    10560: {
        name: "Hippogriff", stats: [9978, 11063, 11942, 9295, 10074],
        skills: [133],
        img: "img4$1/__cb20130111170016/$2/3/3e/Hippogriff_of_Rites_II_Figure.png",
        fullName: "Hippogriff of Rites II"
    },
    10726: {
        name: "Hlokk", stats: [14328, 14462, 12832, 9271, 17133],
        skills: [502, 503],
        img: "img3$1/__cb20140630102857/$2/7/7a/Hlokk%2C_Blade_of_Thunder_II_Figure.png",
        fullName: "Hlokk, Blade of Thunder II"
    },
    10635: {
        name: "Hollofernyiges", stats: [16551, 16757, 13875, 14568, 16941],
        skills: [33],
        img: "img3$1/__cb20130321232308/$2/2/20/Hollofernyiges_II_Figure.png",
        fullName: "Hollofernyiges II"
    },
    11297: {
        name: "Hoska", stats: [18996, 7906, 15096, 17023, 8881],
        skills: [484, 485],
        autoAttack: 10016,
        img: "img2$1/__cb20140613080813/$2/6/6c/Hoska%2C_the_Firestroke_II_Figure.png",
        fullName: "Hoska, the Firestroke II"
    },
    10704: {
        name: "Hraesvelg", stats: [12499, 17472, 11784, 12662, 13799],
        skills: [251],
        img: "img3$1/__cb20130927185735/$2/c/cd/Hraesvelg%2C_Corpse_Feaster_II_Figure.png",
        fullName: "Hraesvelg, Corpse Feaster II"
    },
    10715: {
        name: "Hrimthurs", stats: [13414, 15572, 16144, 9783, 10600],
        skills: [205],
        img: "img2$1/__cb20130613194728/$2/e/e9/Hrimthurs_the_Blizzard_II_Figure.png",
        fullName: "Hrimthurs the Blizzard II"
    },
    11401: {
        name: "Huan", stats: [14005, 14406, 13106, 9997, 16096],
        skills: [577],
        img: "img1$1/__cb20140830112829/$2/d/d4/Huan%2C_Doomcaller_II_Figure.png",
        fullName: "Huan, Doomcaller II"
    },
    10980: {
        name: "Hundred-eyed Warrior", stats: [17385, 18501, 15641, 10452, 17634],
        skills: [289],
        img: "img2$1/__cb20131115130425/$2/2/21/Hundred-eyed_Warrior_II_Figure.png",
        fullName: "Hundred-eyed Warrior II"
    },
    10970: {
        name: "Hypnos", stats: [16291, 17277, 15446, 12488, 17992],
        skills: [274],
        img: "img4$1/__cb20131101130655/$2/3/3b/Hypnos%2C_Lord_of_Dreams_II_Figure.png",
        fullName: "Hypnos, Lord of Dreams II"
    },
    11393: {
        name: "Icarus", stats: [15186, 14796, 14005, 7137, 17363],
        skills: [568, 569],
        img: "img1$1/__cb20140909101524/$2/9/94/Icarus%2C_Fallen_Hero_II_Figure.png",
        fullName: "Icarus, Fallen Hero II"
    },
    10688: {
        name: "Ignis", stats: [11022, 11312, 10818, 13460, 12859],
        skills: [164],
        img: "img2$1/__cb20130402220709/$2/2/2f/Ignis_Fatuus_II_Figure.png",
        fullName: "Ignis Fatuus II"
    },
    10706: {
        name: "Ijiraq", stats: [13929, 14536, 9791, 17797, 12012],
        skills: [168],
        img: "img2$1/__cb20130412195618/$2/1/1b/Ijiraq%2C_the_Glacier_II_Figure.png",
        fullName: "Ijiraq, the Glacier II"
    },
    11064: {
        name: "Ijiraq L", stats: [16995, 14449, 17006, 19508, 12987],
        skills: [328, 329],
        img: "img3$1/__cb20131221031354/$2/3/3c/Ijiraq_the_Brinicle_II_Figure.png",
        fullName: "Ijiraq the Brinicle II"
    },
    21104: {
        name: "IIG", stats: [23155, 19935, 21027, 8440, 17505],
        skills: [444, 445],
        img: "img1$1/__cb20140505115108/$2/5/5f/Impregnable_Iron_Golem_Figure.png",
        fullName: "Impregnable Iron Golem"
    },
    11144: {
        name: "Infested Cyclops", stats: [19508, 19508, 15392, 9997, 15348],
        skills: [364],
        img: "img3$1/__cb20140207111438/$2/d/db/Infested_Cyclops_II_Figure.png",
        fullName: "Infested Cyclops II"
    },
    11120: {
        name: "Infested Minotaur", stats: [13691, 15294, 16031, 9390, 14070],
        skills: [299, 301],
        img: "img3$1/__cb20140426092258/$2/d/d3/Infested_Minotaur_II_Figure_2.png",
        fullName: "Infested Minotaur II"
    },
    10319: {
        name: "Peryton", stats: [10904, 9674, 10490, 10490, 12952],
        skills: [33],
        img: "img1$1/__cb20130106234752/$2/2/2b/Infested_Peryton_II_Figure.png",
        fullName: "Infested Peryton II"
    },
    11342: {
        name: "Ghost Ship", stats: [15365, 12879, 11928, 10951, 16803],
        skills: [525],
        img: "img2$1/__cb20140730092558/$2/0/0f/Inhabited_Ghost_Ship_II_Figure.png",
        fullName: "Inhabited Ghost Ship II"
    },
    693: {
        name: "Ioskeha", stats: [13138, 13611, 11162, 15329, 13675],
        skills: [160],
        img: "img2$1/__cb20130330204311/$2/2/22/Ioskeha_Figure.png",
        fullName: "Ioskeha"
    },
    10592: {
        name: "Ira", stats: [12832, 14489, 8770, 11172, 17254],
        skills: [138],
        img: "img4$1/__cb20130227203822/$2/6/6c/Ira%2C_Hypnotic_Specter_II_Figure.png",
        fullName: "Ira, Hypnotic Specter II"
    },
    10681: {
        name: "Iron Golem", stats: [16778, 13615, 17818, 9867, 8848],
        skills: [152],
        img: "img2$1/__cb20130313201229/$2/9/9f/Iron_Golem_II_Figure.png",
        fullName: "Iron Golem II"
    },
    10746: {
        name: "Iseult", stats: [12731, 10977, 11708, 15865, 14193],
        skills: [144],
        img: "img1$1/__cb20130629202258/$2/3/3b/Iseult_the_Redeemer_II_Figure.png",
        fullName: "Iseult the Redeemer II"
    },
    11376: {
        name: "Ishtar", stats: [16009, 16074, 13106, 9022, 14265],
        skills: [560, 561],
        img: "img2$1/__cb20140830112828/$2/4/4d/Ishtar%2C_Goddess_of_Love_II_Figure.png",
        fullName: "Ishtar, Goddess of Love II"
    },
    11351: {
        name: "Ivy", stats: [16341, 3882, 13803, 15889, 17998],
        skills: [536],
        autoAttack: 10026,
        img: "img3$1/__cb20140809012719/$2/7/73/Ivy_the_Verdant_II_Figure.png",
        fullName: "Ivy the Verdant II"
    },
    11407: {
        name: "Ixtab", stats: [20007, 8502, 17472, 17504, 18013],
        skills: [588, 589],
        autoAttack: 10031,
        img: "img2$1/__cb20140930102755/$2/9/94/Ixtab%2C_Guardian_of_the_Dead_II_Figure.png",
        fullName: "Ixtab, Guardian of the Dead II"
    },
    11009: {
        name: "Jabberwock", stats: [13994, 16193, 13008, 19508, 18024],
        skills: [270, 271],
        img: "img4$1/__cb20131023124841/$2/1/1f/Jabberwock%2C_Phantom_Dragon_II_Figure.png",
        fullName: "Jabberwock, Phantom Dragon II"
    },
    11169: {
        name: "Jack", stats: [13507, 9000, 12196, 16204, 16995],
        skills: [333],
        autoAttack: 10009,
        img: "img1$1/__cb20131227221921/$2/0/0b/Jack_o%27_Frost_II_Figure.png",
        fullName: "Jack o' Frost II"
    },
    10569: {
        name: "Jinx-eye", stats: [14709, 15998, 13832, 13832, 14915],
        skills: [146],
        img: "img1$1/__cb20130220115250/$2/c/c4/Jinx-eye_Dragon_II_Figure.png",
        fullName: "Jinx-eye Dragon II"
    },
    11266: {
        name: "Jormungandr", stats: [13024, 16768, 11756, 10112, 15889],
        skills: [438],
        autoAttack: 10012,
        img: "img3$1/__cb20140430101914/$2/9/97/Jormungandr%2C_World_Serpent_II_Figure.png",
        fullName: "Jormungandr, World Serpent II"
    },
    10510: {
        name: "Kagemaru", stats: [14319, 16973, 13940, 13420, 14568],
        skills: [137],
        img: "img4$1/__cb20130114201626/$2/3/30/Kagemaru%2C_Master_Ninja_II_Figure.png",
        fullName: "Kagemaru, Master Ninja II"
    },
    11121: {
        name: "Kalevan", stats: [12629, 18013, 11914, 12055, 13821],
        skills: [297, 240],
        img: "img3$1/__cb20131122044155/$2/b/bd/Kalevan%2C_the_Forest_Green_II_Figure.png",
        fullName: "Kalevan, the Forest Green II"
    },
    10804: {
        name: "Kangana", stats: [15803, 18750, 14872, 12813, 13247],
        skills: [216],
        img: "img2$1/__cb20130726121448/$2/b/b1/Kangana%2C_the_Maelstrom_II_Figure.png",
        fullName: "Kangana, the Maelstrom II"
    },
    10789: {
        name: "Katiria", stats: [10807, 11318, 11356, 10245, 11623],
        skills: [156],
        img: "img2$1/__cb20130714135314/$2/b/b6/Katiria_Nullblade_II_Figure.png",
        fullName: "Katiria Nullblade II"
    },
    11125: {
        name: "Kekro", stats: [17992, 12001, 15002, 19660, 16302],
        skills: [379],
        autoAttack: 10007,
        img: "img3$1/__cb20140221092259/$2/3/3b/Kekro%2C_Demiwyrm_Magus_II_Figure.png",
        fullName: "Kekro, Demiwyrm Magus II"
    },
    10767: {
        name: "Kelaino", stats: [12538, 12707, 10490, 15047, 14999],
        skills: [197],
        img: "img4$1/__cb20130609105750/$2/0/05/Kelaino%2C_the_Dark_Cloud_II_Figure.png",
        fullName: "Kelaino, the Dark Cloud II"
    },
    11381: {
        name: "Kijin", stats: [17047, 3323, 14038, 17402, 16110],
        skills: [566],
        autoAttack: 10031,
        img: "img2$1/__cb20140909101523/$2/3/3a/Kijin%2C_Heavenly_Maiden_II_Figure.png",
        fullName: "Kijin, Heavenly Maiden II"
    },
    11279: {
        name: "Kobold", stats: [14207, 14462, 15804, 8442, 14999],
        skills: [449],
        img: "img1$1/__cb20140508115333/$2/6/6e/Kobold_Guard_Captain_II_Figure.png",
        fullName: "Kobold Guard Captain II"
    },
    11314: {
        name: "Kua Fu", stats: [16510, 16561, 12207, 9174, 13476],
        skills: [497],
        img: "img3$1/__cb20140628103005/$2/e/e3/Kua_Fu%2C_Sun_Chaser_II_Figure.png",
        fullName: "Kua Fu, Sun Chaser II"
    },
    10911: {
        name: "Kyteler", stats: [11721, 12524, 9892, 17254, 16416],
        skills: [258],
        img: "img4$1/__cb20140120233253/$2/d/d4/Kyteler_the_Corrupted_II_Figure.png",
        fullName: "Kyteler the Corrupted II"
    },
    10985: {
        name: "Lahamu", stats: [14024, 10784, 15999, 16010, 11001],
        skills: [281],
        autoAttack: 10004,
        img: "img2$1/__cb20131112084823/$2/f/fe/Lahamu%2C_Royal_Viper_II_Figure.png",
        fullName: "Lahamu, Royal Viper II"
    },
    21372: {
        name: "Lamashtu", stats: [20579, 17977, 20007, 12062, 17685],
        skills: [555],
        img: "img2$1/__cb20140830112546/$2/e/e5/Lamashtu%2C_Fell_Goddess_Figure.png",
        fullName: "Lamashtu, Fell Goddess"
    },
    10432: {
        name: "Lanvall", stats: [12914, 14639, 12245, 12210, 15040],
        skills: [18],
        img: "img1$1/__cb20130106224520/$2/6/63/Lanvall%2C_Lizard_Cavalier_II_Figure.png",
        fullName: "Lanvall, Lizard Cavalier II"
    },
    11347: {
        name: "Lava Dragon", stats: [19021, 8881, 16237, 18891, 16497],
        skills: [534, 535],
        autoAttack: 10019,
        img: "img3$1/__cb20140809012705/$2/d/de/Lava_Dragon_II_Figure.png",
        fullName: "Lava Dragon II"
    },
    11128: {
        name: "Leupold", stats: [17585, 11038, 12963, 9794, 16510],
        skills: [378],
        img: "img4$1/__cb20140221092527/$2/c/ca/Leupold%2C_Wyvern_Knight_II_Figure.png",
        fullName: "Leupold, Wyvern Knight II"
    },
    10852: {
        name: "Libuse", stats: [11221, 13782, 13379, 16048, 13038],
        skills: [245],
        img: "img2$1/__cb20130911123252/$2/7/7e/Libuse%2C_the_Black_Queen_II_Figure.png",
        fullName: "Libuse, the Black Queen II"
    },
    10933: {
        name: "Linnorm", stats: [12326, 11102, 11979, 16605, 16497],
        skills: [313],
        img: "img3$1/__cb20131210233903/$2/0/0b/Linnorm%2C_the_Hailstorm_II_Figure.png",
        fullName: "Linnorm, the Hailstorm II"
    },
    21187: {
        name: "Loki", stats: [19202, 21231, 16192, 15119, 15806],
        skills: [382],
        img: "img4$1/__cb20140304213357/$2/7/7b/Loki%2C_God_of_Cunning_Figure.png",
        fullName: "Loki, God of Cunning"
    },
    11316: {
        name: "Long Feng", stats: [15164, 17125, 13539, 10452, 12207],
        skills: [501],
        img: "img2$1/__cb20140628103006/$2/a/ad/Long_Feng%2C_the_Dragon_Fist_II_Figure.png",
        fullName: "Long Feng, the Dragon Fist II"
    },
    10754: {
        name: "Lucia", stats: [17106, 13878, 16633, 9881, 10857],
        skills: [16],
        img: "img1$1/__cb20130428112723/$2/9/97/Lucia%2C_Petal-Shears_II_Figure.png",
        fullName: "Lucia, Petal-Shears II"
    },
    10794: {
        name: "Ma-Gu", stats: [14182, 12438, 11477, 15306, 12438],
        skills: [4],
        img: "img2$1/__cb20130709182651/$2/a/a8/Ma-Gu_the_Enlightened_II_Figure.png",
        fullName: "Ma-Gu the Enlightened II"
    },
    11141: {
        name: "Lynx", stats: [14207, 14062, 12500, 10014, 17147],
        skills: [493],
        img: "img3$1/__cb20140620060851/$2/2/21/Madprowl_Lynx_II_Figure.png",
        fullName: "Madprowl Lynx II"
    },
    10558: {
        name: "Magdal", stats: [13929, 15110, 15132, 13810, 15359],
        skills: [120],
        img: "img1$1/__cb20130210215236/$2/c/c0/Magdal_Dragonheart_II_Figure.png",
        fullName: "Magdal Dragonheart II"
    },
    11126: {
        name: "Magdal M", stats: [18728, 20917, 21491, 23235, 15998],
        skills: [336],
        img: "img3$1/__cb20140221092054/$2/4/46/Magdal%2C_Dragonmaster_II_Figure.png",
        fullName: "Magdal, Dragonmaster II"
    },
    11429: {
        name: "Maisie", stats: [19194, 19097, 16258, 8101, 17905],
        skills: [599, 600],
        autoAttack: 10037,
        img: "img1$1/__cb20141011104105/$2/d/da/Maisie%2C_Grimoire_Keeper_II_Figure.png",
        fullName: "Maisie, Grimoire Keeper II"
    },
    10365: {
        name: "Makalipon", stats: [10343, 8405, 10611, 12280, 10343],
        skills: [60],
        img: "img1$1/__cb20130202230532/$2/f/f1/Makalipon%2C_Sacred_Fruit_II_Figure.png",
        fullName: "Makalipon, Sacred Fruit II"
    },
    10445: {
        name: "Managarmr", stats: [12210, 12258, 13266, 13887, 11688],
        skills: [108],
        img: "img1$1/__cb20130125003049/$2/5/51/Managarmr_Frost_Touch_II_Figure.png",
        fullName: "Managarmr Frost Touch II"
    },
    11280: {
        name: "Managarmr M", stats: [20007, 21599, 17396, 23907, 18100],
        skills: [463],
        autoAttack: 10007,
        img: "img4$1/__cb20140521080600/$2/2/2b/Managarmr%2C_the_Frost_Moon_II_Figure.png",
        fullName: "Managarmr, the Frost Moon II"
    },
    11319: {
        name: "Manannan", stats: [16551, 10668, 16464, 19227, 16605],
        skills: [513, 514],
        autoAttack: 10007,
        img: "img4$1/__cb20140715092527/$2/a/a4/Manannan_mac_Lir_II_Figure.png",
        fullName: "Manannan mac Lir II"
    },
    10792: {
        name: "Marchosias", stats: [18165, 15424, 12781, 18566, 13561],
        skills: [210],
        img: "img2$1/__cb20130714135315/$2/7/71/Marchosias%2C_Pit_Beast_II_Figure.png",
        fullName: "Marchosias, Pit Beast II"
    },
    11136: {
        name: "Marcus", stats: [12317, 16534, 14255, 8991, 15438],
        skills: [358],
        img: "img3$1/__cb20140129062109/$2/5/53/Marcus%2C_Brave_of_Liberation_II_Figure.png",
        fullName: "Marcus, Brave of Liberation II"
    },
    332: {
        name: "Mari", stats: [10500, 10980, 10850, 13370, 11500],
        skills: [47],
        img: "img1$1/__cb20130125001827/$2/e/e4/Mari_the_Witch_Figure.png",
        fullName: "Mari the Witch"
    },
    11013: {
        name: "Marraco", stats: [18716, 15876, 17254, 7381, 8809],
        skills: [61, 167],
        img: "img4$1/__cb20131115131303/$2/7/7b/Marraco%2C_Crusted_Wyrm_II_Figure.png",
        fullName: "Marraco, Crusted Wyrm II"
    },
    10656: {
        name: "Mathilda", stats: [11841, 15172, 10639, 12718, 15218],
        skills: [115],
        img: "img3$1/__cb20130430104152/$2/6/68/Mathilda_the_Tarantula_II_Figure.png",
        fullName: "Mathilda the Tarantula II"
    },
    10632: {
        name: "Doog", stats: [10560, 10549, 10777, 14330, 11925],
        skills: [94],
        img: "img4$1/__cb20130314191038/$2/0/09/Mauthe_Doog_II_Figure.png",
        fullName: "Mauthe Doog II"
    },
    10705: {
        name: "Melanippe", stats: [16139, 16800, 13929, 11849, 15132],
        skills: [195],
        img: "img4$1/__cb20130708160233/$2/4/4f/Melanippe%2C_Wolfrider_II_Figure.png",
        fullName: "Melanippe, Wolfrider II"
    },
    11214: {
        name: "Melek", stats: [19097, 16107, 21545, 12792, 10094],
        skills: [374, 375],
        img: "img2$1/__cb20140213035118/$2/1/19/Melek%2C_the_Black_Peacock_II_Figure.png",
        fullName: "Melek, the Black Peacock II"
    },
    10527: {
        name: "Melusine", stats: [11417, 11976, 10490, 13562, 11210],
        skills: [155],
        img: "img2$1/__cb20130330231431/$2/7/72/Melusine_the_Witch_II_Figure.png",
        fullName: "Melusine the Witch II"
    },
    11305: {
        name: "Microraptor", stats: [16172, 18577, 14406, 14092, 17753],
        skills: [492],
        img: "img4$1/__cb20140620060852/$2/1/14/Microraptor_II_Figure.png",
        fullName: "Microraptor II"
    },
    11212: {
        name: "Millarca", stats: [15305, 10668, 15565, 21393, 18046],
        skills: [407, 408],
        autoAttack: 10007,
        img: "img2$1/__cb20140325120640/$2/f/ff/Millarca%2C_Lady_of_Thorns_II_Figure.png",
        fullName: "Millarca, Lady of Thorns II"
    },
    11134: {
        name: "Minerva", stats: [14590, 18024, 14438, 15435, 18013],
        skills: [357],
        img: "img2$1/__cb20140129062047/$2/a/a2/Minerva%2C_Goddess_of_War_II_Figure.png",
        fullName: "Minerva, Goddess of War II"
    },
    11081: {
        name: "Moni", stats: [13562, 15537, 12121, 10234, 16448],
        skills: [340],
        img: "img3$1/__cb20140110075315/$2/4/43/Moni_the_Dismemberer_II_Figure.png",
        fullName: "Moni the Dismemberer II"
    },
    10621: {
        name: "Montu", stats: [12952, 12904, 12269, 12269, 15306],
        skills: [170],
        img: "img2$1/__cb20130414021249/$2/1/1d/Montu%2C_God_of_War_II_Figure.png",
        fullName: "Montu, God of War II"
    },
    308: {
        name: "Mordred", stats: [11000, 12050, 10950, 11000, 12500],
        skills: [18],
        img: "img1$1/__cb20130125001433/$2/6/6b/Mordred%2C_Drake_Knight_Figure.png",
        fullName: "Mordred, Drake Knight"
    },
    10625: {
        name: "Moren", stats: [8502, 11318, 7759, 16803, 8039],
        skills: [10000, 71, 85],
        isMounted: true,
        img: "img3$1/__cb20130418051723/$2/4/4a/Moren%2C_Rime_Mage_II_Figure.png",
        fullName: "Moren, Rime Mage II"
    },
    11233: {
        name: "Musashi", stats: [20592, 24752, 19151, 17981, 18024],
        skills: [404],
        img: "img1$1/__cb20140326090459/$2/1/1f/Musashi%2C_the_Twinblade_II_Figure.png",
        fullName: "Musashi, the Twinblade II"
    },
    10186: {
        name: "Naberius", stats: [9563, 9552, 7828, 11208, 11298],
        skills: [18],
        img: "img2$1/__cb20130225032050/$2/e/e9/Naberius_II_Figure.png",
        fullName: "Naberius II"
    },
    11015: {
        name: "Narmer", stats: [15876, 12194, 15172, 8870, 15924],
        skills: [260],
        img: "img1$1/__cb20131021231637/$2/2/2d/Narmer%2C_Mummy_King_II_Figure.png",
        fullName: "Narmer, Mummy King II"
    },
    10989: {
        name: "Nehasim", stats: [12707, 16071, 11390, 12466, 15172],
        skills: [294],
        img: "img2$1/__cb20131122150818/$2/8/8b/Nehasim_the_Seething_II_Figure.png",
        fullName: "Nehasim the Seething II"
    },
    11057: {
        name: "Neith", stats: [18999, 19660, 15002, 12001, 15305],
        skills: [326],
        img: "img2$1/__cb20131221031333/$2/3/3b/Neith%2C_Goddess_of_War_II_Figure.png",
        fullName: "Neith, Goddess of War II"
    },
    21291: {
        name: "Nephthys", stats: [21015, 11985, 18202, 22005, 16912],
        skills: [471, 472],
        autoAttack: 10007,
        img: "img1$1/__cb20140528102649/$2/1/16/Nephthys%2C_Ruler_of_Death_Figure.png",
        fullName: "Nephthys, Ruler of Death"
    },
    10994: {
        name: "Nergal", stats: [13008, 15392, 11947, 11643, 16518],
        skills: [282],
        img: "img1$1/__cb20131108145626/$2/7/75/Nergal%2C_Abyssal_Overseer_II_Figure.png",
        fullName: "Nergal, Abyssal Overseer II"
    },
    11079: {
        name: "Nightblade", stats: [12196, 16995, 13528, 10896, 14915],
        skills: [341],
        img: "img1$1/__cb20140110075314/$2/6/64/Nightblade%2C_Archsage_of_Winds_II_Figure.png",
        fullName: "Nightblade, Archsage of Winds II"
    },
    11369: {
        name: "Nin-Ridu", stats: [16529, 16215, 11351, 10495, 14005],
        skills: [505],
        autoAttack: 10022,
        img: "img2$1/__cb20140709072738/$2/3/39/Nin-Ridu_Figure.png",
        fullName: "Nin-Ridu"
    },
    10799: {
        name: "Niu Mo Wang", stats: [14276, 17071, 15998, 13420, 13138],
        skills: [133],
        img: "img1$1/__cb20130709182652/$2/2/26/Niu_Mo_Wang_II_Figure.png",
        fullName: "Niu Mo Wang II"
    },
    10438: {
        name: "Odin Stormgod", stats: [12855, 14346, 12378, 14929, 12245],
        skills: [119],
        img: "img1$1/__cb20130106211414/$2/5/5c/Odin_Stormgod_II_Figure.png",
        fullName: "Odin Stormgod II"
    },
    11267: {
        name: "Odin L", stats: [15110, 16562, 13875, 17363, 18057],
        skills: [440, 441],
        isMounted: true,
        img: "img3$1/__cb20140430101913/$2/6/65/Odin%2C_God_of_Victory_II_Figure.png",
        fullName: "Odin, God of Victory II"
    },
    10889: {
        name: "Olitiau", stats: [14081, 15760, 11676, 11232, 15197],
        skills: [221],
        img: "img1$1/__cb20130731090323/$2/3/33/Olitiau%2C_the_Great_Bat_II_Figure.png",
        fullName: "Olitiau, the Great Bat II"
    },
    10505: {
        name: "Oniroku", stats: [12207, 13731, 12235, 12194, 13621],
        skills: [115],
        img: "img1$1/__cb20130114161242/$2/9/96/Oniroku_the_Slayer_II_Figure.png",
        fullName: "Oniroku the Slayer II"
    },
    11088: {
        name: "Ovinnik", stats: [19010, 11210, 20592, 16627, 12315],
        skills: [342, 356],
        autoAttack: 10007,
        img: "img3$1/__cb20140116044009/$2/c/c1/Ovinnik%2C_Hex_Beast_II_Figure.png",
        fullName: "Ovinnik, Hex Beast II"
    },
    11408: {
        name: "Pakal", stats: [15435, 15175, 10777, 10018, 17103],
        skills: [590, 591],
        img: "img1$1/__cb20140930103243/$2/6/68/Pakal%2C_Jade_King_II_Figure.png",
        fullName: "Pakal, Jade King II"
    },
    11286: {
        name: "Aquarius", stats: [16323, 7494, 11448, 17363, 16009],
        skills: [450, 451],
        autoAttack: 10007,
        img: "img2$1/__cb20140508115333/$2/b/b9/Paladin_of_Aquarius_II_Figure.png",
        fullName: "Paladin of Aquarius II"
    },
    11310: {
        name: "Cancer", stats: [16627, 17201, 10408, 7494, 16908],
        skills: [478, 479],
        img: "img2$1/__cb20140606074955/$2/4/4e/Paladin_of_Cancer_II_Figure.png",
        fullName: "Paladin of Cancer II"
    },
    11210: {
        name: "Aries", stats: [14395, 15543, 16854, 9011, 12813],
        skills: [392, 393],
        img: "img3$1/__cb20140313080212/$2/3/37/Paladin_of_Aries_II_Figure.png",
        fullName: "Paladin of Aries II"
    },
    11301: {
        name: "Capricorn", stats: [14937, 8491, 13507, 16551, 15099],
        skills: [476],
        autoAttack: 10007,
        img: "img2$1/__cb20140606074954/$2/f/f4/Paladin_of_Capricorn_II_Figure.png",
        fullName: "Paladin of Capricorn II"
    },
    11325: {
        name: "Gemini", stats: [15197, 15641, 10343, 10148, 17147],
        skills: [511, 512],
        isMounted: true,
        img: "img2$1/__cb20140714102308/$2/4/40/Paladin_of_Gemini_II_Figure.png",
        fullName: "Paladin of Gemini II"
    },
    11277: {
        name: "Leo", stats: [15121, 15002, 14200, 7440, 16811],
        skills: [448],
        autoAttack: 10014,
        img: "img4$1/__cb20140508115334/$2/9/91/Paladin_of_Leo_II_Figure.png",
        fullName: "Paladin of Leo II"
    },
    11229: {
        name: "Pisces", stats: [13041, 8621, 14796, 17114, 14991],
        skills: [419],
        autoAttack: 10007,
        img: "img1$1/__cb20140411023129/$2/2/22/Paladin_of_Pisces_II_Figure.png",
        fullName: "Paladin of Pisces II"
    },
    11200: {
        name: "Libra", stats: [14178, 16172, 14698, 9845, 13669],
        skills: [390],
        img: "img4$1/__cb20140313080212/$2/8/86/Paladin_of_Libra_II_Figure.png",
        fullName: "Paladin of Libra II"
    },
    11334: {
        name: "Sagittarius", stats: [15587, 15218, 12163, 8415, 17255],
        skills: [507, 508],
        img: "img3$1/__cb20140709072736/$2/c/c0/Paladin_of_Sagittarius_II_Figure.png",
        fullName: "Paladin of Sagittarius II"
    },
    11353: {
        name: "Scorpio", stats: [14146, 15998, 13117, 8350, 16995],
        skills: [544],
        img: "img4$1/__cb20140814101430/$2/f/fe/Paladin_of_Scorpio_II_Figure.png",
        fullName: "Paladin of Scorpio II"
    },
    11362: {
        name: "Taurus", stats: [15608, 18598, 10105, 7007, 17363],
        skills: [553, 554],
        img: "img2$1/__cb20140828103608/$2/d/d3/Paladin_of_Taurus_II_Figure.png",
        fullName: "Paladin of Taurus II"
    },
    11241: {
        name: "Virgo", stats: [15500, 6118, 12380, 17797, 16822],
        skills: [421, 422],
        autoAttack: 10007,
        img: "img4$1/__cb20140411023129/$2/c/cf/Paladin_of_Virgo_II_Figure.png",
        fullName: "Paladin of Virgo II"
    },
    11231: {
        name: "Palna", stats: [14999, 15509, 14606, 8991, 13807],
        skills: [420],
        img: "img3$1/__cb20140411023129/$2/f/fb/Palna%2C_the_Vanguard_II_Figure.png",
        fullName: "Palna, the Vanguard II"
    },
    11374: {
        name: "Pazuzu", stats: [15121, 17182, 14988, 5640, 14999],
        skills: [556],
        img: "img2$1/__cb20140830112827/$2/4/4d/Pazuzu%2C_the_Whirling_Jinn_II_Figure.png",
        fullName: "Pazuzu, the Whirling Jinn II"
    },
    10348: {
        name: "Pegasus", stats: [8756, 10200, 8843, 10880, 9181],
        skills: [111],
        img: "img4$1/__cb20130301003405/$2/6/69/Pegasus%2C_the_Light_Divine_II_Figure.png",
        fullName: "Pegasus, the Light Divine II"
    },
    10831: {
        name: "Pegasus Knight", stats: [15251, 19032, 15370, 13073, 18046],
        skills: [311, 312],
        isMounted: true,
        img: "img3$1/__cb20131209121232/$2/e/e4/Pegasus_Knight_II_Figure.png",
        fullName: "Pegasus Knight II"
    },
    11425: {
        name: "Pelops", stats: [15056, 14113, 10018, 12055, 17266],
        skills: [597, 598],
        img: "img3$1/__cb20141009082936/$2/e/ee/Pelops%2C_Fallen_Hero_II_Figure.png",
        fullName: "Pelops, Fallen Hero II"
    },
    10013: {
        name: "Pendragon", stats: [9844, 10317, 10751, 12357, 10861],
        skills: [60],
        img: "img3$1/__cb20130301160021/$2/4/45/Pendragon%2C_the_Scourge_II_Figure.png",
        fullName: "Pendragon, the Scourge II"
    },
    21368: {
        name: "Perendon", stats: [19202, 17300, 17055, 17009, 17604],
        skills: [504],
        autoAttack: 10021,
        img: "img1$1/__cb20140709072738/$2/2/24/Perendon_the_Pure_Figure.png",
        fullName: "Perendon the Pure"
    },
    11020: {
        name: "Phantasmal Succubus", stats: [18013, 13604, 20007, 17190, 10701],
        skills: [272, 273],
        img: "img1$1/__cb20131025125352/$2/f/fb/Phantasmal_Succubus_II_Figure.png",
        fullName: "Phantasmal Succubus II"
    },
    10710: {
        name: "Phantom Assassin", stats: [13507, 13951, 11102, 14341, 14081],
        skills: [193],
        img: "img1$1/__cb20130605201800/$2/1/10/Phantom_Assassin_II_Figure.png",
        fullName: "Phantom Assassin II"
    },
    11022: {
        name: "Phantom Knight", stats: [19877, 23213, 19270, 19682, 18057],
        skills: [267],
        img: "img4$1/__cb20131023124902/$2/6/61/Phantom_Knight%2C_the_Vagabond_II_Figure.png",
        fullName: "Phantom Knight, the Vagabond II"
    },
    11039: {
        name: "Phoenix", stats: [14005, 11188, 12033, 19010, 12185],
        skills: [305],
        img: "img1$1/__cb20131129143510/$2/2/25/Phoenix%2C_the_Metempsychosis_II_Figure.png",
        fullName: "Phoenix, the Metempsychosis II"
    },
    11237: {
        name: "Pollux", stats: [13290, 18631, 11654, 10311, 13756],
        skills: [427, 428],
        img: "img1$1/__cb20140416052152/$2/a/a2/Pollux%2C_Fallen_Hero_II_Figure.png",
        fullName: "Pollux, Fallen Hero II"
    },
    10876: {
        name: "Pontifex", stats: [14590, 16410, 13507, 18371, 17797],
        skills: [229, 167],
        img: "img2$1/__cb20130823004421/$2/b/bd/Pontifex_Antiquus_II_Figure.png",
        fullName: "Pontifex Antiquus II"
    },
    10075: {
        name: "Pouliquen", stats: [7890, 6271, 8910, 9439, 7843],
        skills: [16],
        img: "img2$1/__cb20130126053738/$2/6/6c/Pouliquen%2C_Archibishop_II_Figure.png",
        fullName: "Pouliquen, Archibishop II"
    },
    10785: {
        name: "Premyslid", stats: [13626, 16984, 14926, 18772, 11232],
        skills: [244],
        img: "img2$1/__cb20130911122726/$2/c/c7/Premyslid%2C_the_Black_King_II_Figure.png",
        fullName: "Premyslid, the Black King II"
    },
    10599: {
        name: "Princeps", stats: [9360, 10772, 9674, 10181, 11667],
        skills: [156],
        img: "img4$1/__cb20130314191111/$2/d/dc/Princeps%2C_Angel_of_Doom_II_Figure.png",
        fullName: "Princeps, Angel of Doom II"
    },
    11203: {
        name: "Prismatic", stats: [24004, 14438, 20982, 23300, 18024],
        skills: [432],
        autoAttack: 10007,
        img: "img4$1/__cb20140423020348/$2/f/fe/Prismatic_Wyvern_Figure.png",
        fullName: "Prismatic Wyvern"
    },
    11100: {
        name: "Queen Waspmen", stats: [14070, 19898, 13247, 15998, 17829],
        skills: [348],
        img: "img1$1/__cb20140122120929/$2/f/f6/Queen_of_the_Waspmen_II_Figure.png",
        fullName: "Queen of the Waspmen II"
    },
    21340: {
        name: "Cetus", stats: [22316, 20624, 17579, 11013, 16729],
        skills: [524],
        autoAttack: 10021,
        img: "img3$1/__cb20140730092831/$2/0/0a/Raging_Cetus_Figure.png",
        fullName: "Raging Cetus"
    },
    11048: {
        name: "Ragnar", stats: [13245, 15804, 12001, 10294, 16510],
        skills: [314],
        img: "img4$1/__cb20131210233938/$2/9/97/Ragnar%2C_Dragonslayer_II_Figure.png",
        fullName: "Ragnar, Dragonslayer II"
    },
    10664: {
        name: "Ramiel", stats: [15543, 13929, 13431, 16388, 14709],
        skills: [185],
        img: "img3$1/__cb20130514144200/$2/d/da/Ramiel%2C_Angel_of_the_Storm_II_Figure.png",
        fullName: "Ramiel, Angel of the Storm II"
    },
    10699: {
        name: "Rampant Lion", stats: [16291, 17569, 16518, 12564, 18035],
        skills: [380, 381],
        img: "img3$1/__cb20140222023232/$2/8/87/Rampant_Lion_II_Figure.png",
        fullName: "Rampant Lion II"
    },
    10806: {
        name: "Rapse", stats: [11928, 14182, 13110, 11270, 15524],
        skills: [179],
        img: "img4$1/__cb20130721141602/$2/e/e0/Rapse%2C_the_Bloody_Horns_II_Figure.png",
        fullName: "Rapse, the Bloody Horns II"
    },
    10863: {
        name: "Rasiel", stats: [11936, 15587, 11817, 17797, 11004],
        skills: [234],
        img: "img2$1/__cb20130901132455/$2/1/13/Rasiel%2C_Angel_All-Knowing_II_Figure.png",
        fullName: "Rasiel, Angel All-Knowing II"
    },
    10844: {
        name: "Regin", stats: [12734, 13342, 12832, 16144, 11270],
        skills: [155],
        img: "img2$1/__cb20130823004527/$2/b/b6/Regin%2C_the_Brass_Mantis_II_Figure.png",
        fullName: "Regin, the Brass Mantis II"
    },
    11196: {
        name: "Brass Gorilla", stats: [18996, 9760, 18096, 12684, 8319],
        skills: [398],
        img: "img2$1/__cb20140318135240/$2/6/6b/Reinforced_Brass_Gorilla_II_Figure.png",
        fullName: "Reinforced Brass Gorilla II"
    },
    11215: {
        name: "Rohde", stats: [17591, 8101, 16042, 15305, 10582],
        skills: [376, 377],
        autoAttack: 10007,
        img: "img2$1/__cb20140213035144/$2/3/3b/Rohde%2C_the_Rose_Thorn_II_Figure.png",
        fullName: "Rohde, the Rose Thorn II"
    },
    10845: {
        name: "Rovn", stats: [16269, 19086, 18772, 13214, 13355],
        skills: [228],
        img: "img2$1/__cb20130823004528/$2/a/a4/Rovn%2C_the_Brass_Panzer_II_Figure.png",
        fullName: "Rovn, the Brass Panzer II"
    },
    11066: {
        name: "Ruprecht", stats: [12911, 15316, 11795, 17504, 11199],
        skills: [330, 334],
        img: "img4$1/__cb20131221031407/$2/7/79/Ruprecht_the_Punisher_II_Figure.png",
        fullName: "Ruprecht the Punisher II"
    },
    11295: {
        name: "Ryaum", stats: [19454, 13561, 17667, 11221, 17602],
        skills: [482, 483],
        img: "img2$1/__cb20140613080813/$2/3/37/Ryaum%2C_Hussar_Captain_II_Figure.png",
        fullName: "Ryaum, Hussar Captain II"
    },
    11343: {
        name: "Sachiel", stats: [19357, 14059, 13052, 17017, 17526],
        skills: [527, 528],
        img: "img4$1/__cb20140730092614/$2/2/2b/Sachiel%2C_Angel_of_Water_II_Figure.png",
        fullName: "Sachiel, Angel of Water II"
    },
    11063: {
        name: "Treant", stats: [18566, 17017, 22542, 13626, 8014],
        skills: [154],
        img: "img1$1/__cb20131215131956/$2/6/67/Sagacious_Treant_II_Figure.png",
        fullName: "Sagacious Treant II"
    },
    11234: {
        name: "Saizo", stats: [16128, 12055, 16367, 19422, 16995],
        skills: [405],
        autoAttack: 10007,
        img: "img2$1/__cb20140326090514/$2/4/41/Saizo%2C_Phantom_Ninja_II_Figure.png",
        fullName: "Saizo, Phantom Ninja II"
    },
    10966: {
        name: "Saurva", stats: [14958, 15305, 11329, 11362, 15002],
        skills: [259],
        img: "img1$1/__cb20131015140405/$2/f/f3/Saurva%2C_the_Lawless_Lord_II_Figure.png",
        fullName: "Saurva, the Lawless Lord II"
    },
    21228: {
        name: "Hierophant", stats: [19681, 13391, 17534, 20112, 16950],
        skills: [418],
        autoAttack: 10007,
        img: "img1$1/__cb20140411023129/$2/b/b1/Scathing_Hierophant_Figure.png",
        fullName: "Scathing Hierophant"
    },
    10676: {
        name: "Scirocco", stats: [15002, 14503, 14503, 18999, 16497],
        skills: [331, 301],
        img: "img3$1/__cb20131228021319/$2/d/d5/Scirocco%2C_Father_of_Winds_II_Figure.png",
        fullName: "Scirocco, Father of Winds II"
    },
    10626: {
        name: "Marid", stats: [14070, 17851, 14449, 12597, 15478],
        skills: [169],
        img: "img2$1/__cb20130414020555/$2/e/ed/Scorching_Marid_II_Figure.png",
        fullName: "Scorching Marid II"
    },
    11036: {
        name: "Sea Serpent", stats: [16020, 12012, 15121, 19259, 17103],
        skills: [302],
        img: "img1$1/__cb20131129152929/$2/6/65/Sea_Serpent_II_Figure.png",
        fullName: "Sea Serpent II"
    },
    11379: {
        name: "Seimei", stats: [19963, 6389, 17038, 19053, 17103],
        skills: [564, 565],
        autoAttack: 10007,
        img: "img4$1/__cb20140909101523/$2/b/b7/Seimei%2C_Onmyoji_II_Figure.png",
        fullName: "Seimei, Onmyoji II"
    },
    11204: {
        name: "Seismo", stats: [18999, 19097, 15056, 11015, 16800],
        skills: [433],
        img: "img1$1/__cb20140425214716/$2/c/ce/Seismo_Worm_Figure_2.png",
        fullName: "Seismo Worm"
    },
    10258: {
        name: "Sekhmet", stats: [12529, 16780, 13843, 13598, 13823],
        skills: [11],
        img: "img3$1/__cb20130106204046/$2/d/d7/Sekhmet_Aflame_II_Figure.png",
        fullName: "Sekhmet Aflame II"
    },
    11056: {
        name: "Selk", stats: [13902, 15854, 11976, 11208, 14927],
        skills: [327],
        img: "img4$1/__cb20131221031323/$2/0/03/Selk%2C_Desert_King_II_Figure.png",
        fullName: "Selk, Desert King II"
    },
    11321: {
        name: "Selkie", stats: [15804, 8442, 14049, 16024, 13586],
        skills: [515, 516],
        autoAttack: 10007,
        img: "img4$1/__cb20140715092434/$2/3/31/Selkie%2C_Lady_of_the_Shore_II_Figure.png",
        fullName: "Selkie, Lady of the Shore II"
    },
    11413: {
        name: "Sera", stats: [14293, 17023, 13306, 7406, 15903],
        skills: [594, 595],
        img: "img2$1/__cb20141009082935/$2/8/84/Sera%2C_Exorcist_II_Figure.png",
        fullName: "Sera, Exorcist II"
    },
    11290: {
        name: "Set", stats: [13097, 16364, 10990, 10001, 17133],
        skills: [469],
        img: "img2$1/__cb20140528102650/$2/c/c6/Set%2C_God_of_the_Sands_II_Figure.png",
        fullName: "Set, God of the Sands II"
    },
    11006: {
        name: "Siby", stats: [15558, 8005, 11442, 17120, 15804],
        skills: [550],
        autoAttack: 10018,
        img: "img2$1/__cb20140823140531/$2/0/0c/Siby%2C_Sea_Seer_II_Figure.png",
        fullName: "Siby, Sea Seer II"
    },
    11219: {
        name: "Sigiled Corpse Beast", stats: [17006, 12954, 14926, 19855, 16042],
        skills: [414, 415],
        autoAttack: 10007,
        img: "img1$1/__cb20140402124522/$2/f/f6/Sigiled_Corpse_Beast_II_Figure.png",
        fullName: "Sigiled Corpse Beast II"
    },
    11220: {
        name: "Sigiled Axeman", stats: [14644, 9076, 12987, 18338, 13409],
        skills: [416],
        autoAttack: 10007,
        img: "img3$1/__cb20140402124523/$2/9/9e/Sigiled_Skeleton_Axeman_II_Figure.png",
        fullName: "Sigiled Skeleton Axeman II"
    },
    10987: {
        name: "Sihn", stats: [12001, 10495, 12001, 17504, 16497],
        skills: [285],
        img: "img4$1/__cb20131108145539/$2/5/53/Sihn%2C_Moonlight_King_II_Figure.png",
        fullName: "Sihn, Moonlight King II"
    },
    11207: {
        name: "Silver Dragon", stats: [19714, 14601, 15067, 16215, 18154],
        skills: [522, 523],
        autoAttack: 10024,
        img: "img4$1/__cb20140723074838/$2/8/8e/Silver_Dragon_II_Figure.png",
        fullName: "Silver Dragon II"
    },
    11387: {
        name: "Simurgh", stats: [15524, 6956, 12145, 17206, 16110],
        skills: [580],
        autoAttack: 10007,
        img: "img2$1/__cb20140923104242/$2/a/a2/Simurgh%2C_Bird_Divine_II_Figure.png",
        fullName: "Simurgh, Bird Divine II"
    },
    11093: {
        name: "Sinbad", stats: [15868, 18154, 14644, 13853, 17006],
        skills: [318],
        img: "img2$1/__cb20131227221736/$2/9/9e/Sinbad_the_Adventurer_II_Figure.png",
        fullName: "Sinbad the Adventurer II"
    },
    10566: {
        name: "Bedwyr", stats: [12235, 11318, 12221, 13510, 10598],
        skills: [145],
        img: "img3$1/__cb20130212204233/$2/2/21/Sir_Bedwyr_of_the_Garden_II_Figure.png",
        fullName: "Sir Bedwyr of the Garden II"
    },
    10921: {
        name: "Brandiles", stats: [17017, 18100, 16269, 13940, 14070],
        skills: [252],
        img: "img1$1/__cb20131002005342/$2/0/06/Sir_Brandiles%2C_the_Flameblade_II_Figure.png",
        fullName: "Sir Brandiles, the Flameblade II"
    },
    11455: {
        name: "Skeleton King", stats: [19714, 19064, 20982, 6097, 18143],
        skills: [605, 606],
        autoAttack: 10041,
        img: "img3$1/__cb20141016101616/$2/b/b5/Skeleton_King_II_Figure.png",
        fullName: "Skeleton King II"
    },
    11074: {
        name: "Skoll", stats: [15002, 13160, 15153, 9000, 16302],
        skills: [301, 367],
        img: "img3$1/__cb20140206150854/$2/e/e8/Skoll%2C_Dark_Wolf_II_Figure.png",
        fullName: "Skoll, Dark Wolf II"
    },
    11038: {
        name: "Skrimsl", stats: [13049, 11417, 12466, 17182, 13379],
        skills: [303],
        img: "img2$1/__cb20131129153025/$2/7/78/Skrimsl_the_Freezing_II_Figure.png",
        fullName: "Skrimsl the Freezing II"
    },
    11273: {
        name: "Slagh", stats: [12978, 16561, 11098, 11683, 15631],
        skills: [457],
        img: "img1$1/__cb20140515012351/$2/3/3c/Slagh%2C_Carnage_Incarnate_II_Figure.png",
        fullName: "Slagh, Carnage Incarnate II"
    },
    10450: {
        name: "Snow Queen", stats: [14070, 13994, 13940, 15229, 14449],
        skills: [128],
        img: "img3$1/__cb20130107205830/$2/9/99/Snow_Queen_II_Figure.png",
        fullName: "Snow Queen II"
    },
    10614: {
        name: "Solsten", stats: [13940, 14449, 15998, 17233, 12900],
        skills: [165],
        img: "img3$1/__cb20130408195704/$2/7/7a/Solsten_the_Really_Wanted_II_Figure.png",
        fullName: "Solsten the Really Wanted II"
    },
    10941: {
        name: "Soura", stats: [12012, 12261, 7917, 16930, 17667],
        skills: [287, 291],
        img: "img4$1/__cb20131207210036/$2/f/f1/Soura%2C_Inferno_Shaman_II_Figure.png",
        fullName: "Soura, Inferno Shaman II"
    },
    10568: {
        name: "Spellforged Cyclops", stats: [17047, 11683, 14096, 11111, 10380],
        skills: [61],
        img: "img2$1/__cb20130220143923/$2/c/c7/Spellforged_Cyclops_II_Figure.png",
        fullName: "Spellforged Cyclops II"
    },
    10850: {
        name: "Stalo", stats: [16269, 16280, 16681, 12792, 13496],
        skills: [241],
        img: "img2$1/__cb20130917111955/$2/9/96/Stalo%2C_Glacial_Giant_II_Figure.png",
        fullName: "Stalo, Glacial Giant II"
    },
    414: {
        name: "Steamwork", stats: [14360, 10800, 10600, 12240, 10560],
        skills: [11],
        img: "img3$1/__cb20130125002036/$2/d/de/Steamwork_Dragon_Figure.png",
        fullName: "Steamwork Dragon"
    },
    10955: {
        name: "Sugaar", stats: [13110, 7481, 14293, 16950, 16097],
        skills: [465],
        autoAttack: 10007,
        img: "img1$1/__cb20140520140320/$2/9/9b/Sugaar%2C_the_Thunderstorm_II_Figure.png",
        fullName: "Sugaar, the Thunderstorm II"
    },
    10461: {
        name: "Sulima", stats: [13417, 13583, 12194, 12293, 12269],
        skills: [17],
        img: "img1$1/__cb20130108170214/$2/e/ec/Sulima%2C_Executioner_II_Figure.png",
        fullName: "Sulima, Executioner II"
    },
    11189: {
        name: "Surtr", stats: [15440, 17106, 15085, 7016, 12890],
        skills: [383],
        img: "img1$1/__cb20140301022355/$2/5/5b/Surtr_the_Fervent_II_Figure.png",
        fullName: "Surtr the Fervent II"
    },
    11017: {
        name: "Svadilfari", stats: [15977, 19595, 13442, 15998, 14503],
        skills: [369, 370],
        img: "img1$1/__cb20140214090015/$2/c/ce/Svadilfari_II_Figure.png",
        fullName: "Svadilfari II"
    },
    11000: {
        name: "Tanba", stats: [17580, 23213, 17883, 23289, 18057],
        skills: [236],
        img: "img3$1/__cb20130921071545/$2/a/a8/Tanba%2C_Founder_of_the_Ninja_II_Figure.png",
        fullName: "Tanba, Founder of the Ninja II"
    },
    327: {
        name: "Tangata", stats: [10500, 10800, 10630, 10740, 12480],
        skills: [110],
        img: "img3$1/__cb20130120191546/$2/b/b4/Tangata_Manu_Figure.png",
        fullName: "Tangata Manu"
    },
    11122: {
        name: "Tannin", stats: [13669, 15500, 12683, 19541, 17894],
        skills: [298],
        img: "img2$1/__cb20131125102957/$2/4/4a/Tannin%2C_Sea_Dragon_II_Figure.png",
        fullName: "Tannin, Sea Dragon II"
    },
    695: {
        name: "Tawiscara", stats: [11914, 14513, 14395, 11366, 15630],
        skills: [161],
        img: "img3$1/__cb20130330204311/$2/f/f5/Tawiscara_Figure.png",
        fullName: "Tawiscara"
    },
    10582: {
        name: "Tepaxtl", stats: [10831, 13562, 9209, 13110, 12100],
        skills: [115],
        img: "img3$1/__cb20130308154140/$2/7/7d/Tepaxtl%2C_Fatal_Fang_II_Figure.png",
        fullName: "Tepaxtl, Fatal Fang II"
    },
    11103: {
        name: "Tiamat", stats: [13702, 14698, 16497, 18869, 15738],
        skills: [280],
        img: "img2$1/__cb20131112085546/$2/c/c5/Tiamat%2C_Mother_of_Dragons_II_Figure.png",
        fullName: "Tiamat, Mother of Dragons II"
    },
    1: {
        name: "Black Brute", stats: [14254, 17131, 13848, 11794, 11699],
        skills: [34],
        isWarlord: true,
        img: "img3$1/__cb20130210090020/$2/6/6f/The_Black_Brute_Figure.png",
        fullName: "The Black Brute"
    },
    2: {
        name: "Blue Beard", stats: [12982, 11344, 15588, 15554, 13527],
        skills: [118],
        isWarlord: true,
        img: "img1$1/__cb20130210090031/$2/0/0a/The_Blue_Beard_Figure.png",
        fullName: "The Blue Beard"
    },
    3: {
        name: "Golden Lance", stats: [14462, 13994, 11951, 12227, 16809],
        skills: [10],
        isWarlord: true,
        img: "img3$1/__cb20130210090046/$2/d/d6/The_Golden_Lance_Figure.png",
        fullName: "The Golden Lance"
    },
    4: {
        name: "Green Healer", stats: [13770, 10556, 16359, 15329, 13596],
        skills: [116, 111],
        isWarlord: true,
        img: "img2$1/__cb20130210090056/$2/6/65/The_Green_Healer_Figure.png",
        fullName: "The Green Healer"
    },
    5: {
        name: "Grey Mage", stats: [13415, 13838, 10712, 15865, 16602],
        skills: [40],
        isWarlord: true,
        img: "img2$1/__cb20130210090142/$2/4/48/The_Grey_Mage_Figure.png",
        fullName: "The Grey Mage"
    },
    6: {
        name: "Purple Knife", stats: [13735, 16281, 10712, 15779, 13595],
        skills: [113],
        isWarlord: true,
        img: "img3$1/__cb20130210090107/$2/e/ee/The_Purple_Knife_Figure.png",
        fullName: "The Purple Knife"
    },
    7: {
        name: "Red Samurai", stats: [13432, 14783, 13961, 12869, 14333],
        skills: [46],
        isWarlord: true,
        img: "img4$1/__cb20130210090126/$2/a/ad/The_Red_Samurai_Figure.png",
        fullName: "The Red Samurai"
    },
    8: {
        name: "White Knight", stats: [13916, 14332, 15311, 12851, 13466],
        skills: [46],
        isWarlord: true,
        img: "img2$1/__cb20130210090154/$2/2/25/The_White_Knight_Figure.png",
        fullName: "The White Knight"
    },
    10480: {
        name: "Thor", stats: [10343, 13245, 11807, 13842, 11917],
        skills: [114],
        img: "img3$1/__cb20130106214125/$2/a/a1/Thor%2C_God_of_Lightning_II_Figure.png",
        fullName: "Thor, God of Lightning II"
    },
    21264: {
        name: "Thor L", stats: [20007, 22002, 19063, 10334, 16518],
        skills: [437],
        autoAttack: 10011,
        img: "img3$1/__cb20140430140512/$2/2/23/Thor%2C_the_Roaring_Thunder_Figure.png",
        fullName: "Thor, the Roaring Thunder"
    },
    10859: {
        name: "Thunderbird", stats: [15912, 16995, 13572, 15771, 17006],
        skills: [231],
        img: "img2$1/__cb20130901130236/$2/b/be/Thunderbird_II_Figure.png",
        fullName: "Thunderbird II"
    },
    11236: {
        name: "Tomoe", stats: [13889, 16010, 13110, 8285, 16622],
        skills: [406],
        img: "img2$1/__cb20140326090713/$2/b/b5/Tomoe%2C_the_Lightning_Arrow_II_Figure.png",
        fullName: "Tomoe, the Lightning Arrow II"
    },
    11143: {
        name: "TBB", stats: [12001, 9905, 12207, 17000, 16803],
        skills: [366],
        autoAttack: 10007,
        img: "img1$1/__cb20140206151442/$2/1/15/Tormented_Bone_Beast_II_Figure.png",
        fullName: "Tormented Bone Beast II"
    },
    10747: {
        name: "Tristan", stats: [13832, 16193, 15197, 13052, 15771],
        skills: [122],
        img: "img3$1/__cb20130629202258/$2/c/c3/Tristan_the_Sorrowful_II_Figure.png",
        fullName: "Tristan the Sorrowful II"
    },
    10647: {
        name: "Tuniq", stats: [13635, 16709, 12062, 12086, 9794],
        skills: [150],
        img: "img2$1/__cb20130308154138/$2/9/9c/Tuniq%2C_Guardian_Colossus_II_Figure.png",
        fullName: "Tuniq, Guardian Colossus II"
    },
    10454: {
        name: "Stormwyrm", stats: [11025, 11514, 9646, 14489, 11318],
        skills: [47],
        img: "img3$1/__cb20130301083740/$2/e/ee/Two-Headed_Stormwyrm_II_Figure.png",
        fullName: "Two-Headed Stormwyrm II"
    },
    10735: {
        name: "Typhon", stats: [14677, 13355, 14341, 17959, 13626],
        skills: [117],
        autoAttack: 10001,
        img: "img2$1/__cb20130531211236/$2/8/83/Typhon_II_Figure.png",
        fullName: "Typhon II"
    },
    10344: {
        name: "Hydarnes", stats: [11928, 12832, 10587, 14182, 11928],
        skills: [114],
        img: "img4$1/__cb20130106225027/$2/f/fd/Undead_General%2C_Hydarnes_II_Figure.png",
        fullName: "Undead General, Hydarnes II"
    },
    10920: {
        name: "Unicorn", stats: [10807, 12600, 8770, 11721, 12001],
        skills: [156],
        img: "img2$1/__cb20131002005418/$2/0/04/Unicorn%2C_Spirit_Eater_II_Figure.png",
        fullName: "Unicorn, Spirit Eater II"
    },
    11124: {
        name: "Ushabti", stats: [12434, 16475, 14655, 10062, 14027],
        skills: [317],
        img: "img2$1/__cb20131221031230/$2/1/1d/Ushabti_II_Figure.png",
        fullName: "Ushabti II"
    },
    11268: {
        name: "Vafthruthnir", stats: [15500, 17732, 13008, 9997, 12228],
        skills: [442],
        img: "img2$1/__cb20140430101913/$2/2/2b/Vafthruthnir%2C_Elder_Giant_II_Figure.png",
        fullName: "Vafthruthnir, Elder Giant II"
    },
    10896: {
        name: "Valin", stats: [15500, 16865, 22953, 12716, 11167],
        skills: [263],
        img: "img3$1/__cb20131010170703/$2/4/4a/Valin_the_Terrible_II_Figure.png",
        fullName: "Valin the Terrible II"
    },
    11008: {
        name: "Karkadann", stats: [17034, 16475, 13510, 7822, 13097],
        skills: [521],
        img: "img4$1/__cb20140722101849/$2/2/22/Venomhorn_Karkadann_II_Figure.png",
        fullName: "Venomhorn Karkadann II"
    },
    11137: {
        name: "Venusia", stats: [14514, 18273, 13333, 10831, 11492],
        skills: [361],
        img: "img4$1/__cb20140131053558/$2/0/03/Venusia%2C_the_Grace_II_Figure.png",
        fullName: "Venusia, the Grace II"
    },
    10807: {
        name: "Vezat", stats: [16648, 18165, 14709, 13431, 17721],
        skills: [214],
        img: "img4$1/__cb20130721141820/$2/2/29/Vezat%2C_Dragonbone_Warrior_II_Figure.png",
        fullName: "Vezat, Dragonbone Warrior II"
    },
    10572: {
        name: "Vivian", stats: [14677, 17851, 15229, 13095, 14677],
        skills: [224],
        img: "img2$1/__cb20130816162357/$2/5/5f/Vivian_Griffinrider_II_Figure.png",
        fullName: "Vivian Griffinrider II"
    },
    11021: {
        name: "Vlad", stats: [16323, 19508, 13680, 14709, 16529],
        skills: [295, 296],
        img: "img3$1/__cb20131122044220/$2/5/56/Vlad_the_Impaler_II_Figure.png",
        fullName: "Vlad the Impaler II"
    },
    10675: {
        name: "Void Yaksha", stats: [15706, 18013, 14471, 14276, 15814],
        skills: [199],
        img: "img2$1/__cb20130607215051/$2/9/97/Void_Yaksha_II_Figure.png",
        fullName: "Void Yaksha II"
    },
    11046: {
        name: "Waheela", stats: [17006, 13008, 16204, 16692, 18100],
        skills: [19, 134],
        img: "img2$1/__cb20131210234034/$2/d/dc/Waheela%2C_Dire_Wolf_II_Figure.png",
        fullName: "Waheela, Dire Wolf II"
    },
    11396: {
        name: "Wicker Man", stats: [16605, 6833, 11654, 16670, 16930],
        skills: [581, 582],
        autoAttack: 10036,
        img: "img2$1/__cb20140926194802/$2/d/d2/Wicker_Man_II_Figure.png",
        fullName: "Wicker Man II"
    },
    10570: {
        name: "Wolfert", stats: [14189, 23972, 13723, 13290, 13431],
        skills: [118],
        img: "img3$1/__cb20130313194006/$2/9/91/Wolfert%2C_Grave_Keeper_II_Figure.png",
        fullName: "Wolfert, Grave Keeper II"
    },
    10798: {
        name: "Wu Chang", stats: [10294, 14182, 10977, 10600, 11928],
        skills: [115],
        img: "img3$1/__cb20130709182653/$2/6/65/Wu_Chang_the_Infernal_II_Figure.png",
        fullName: "Wu Chang the Infernal II"
    },
    11018: {
        name: "Warden", stats: [19400, 17504, 18273, 11026, 11795],
        skills: [532],
        img: "img3$1/__cb20140815163230/$2/3/3d/Wyrm_Warden%2C_Everwakeful_II_Figure.png",
        fullName: "Wyrm Warden, Everwakeful II"
    },
    11218: {
        name: "Xaphan", stats: [13013, 9415, 12573, 17000, 15537],
        skills: [412],
        img: "img4$1/__cb20140402124522/$2/7/7f/Xaphan%2C_the_Foul_Flame_II_Figure.png",
        fullName: "Xaphan, the Foul Flame II"
    },
    11315: {
        name: "Xuan Wu", stats: [18013, 18609, 17038, 13821, 13507],
        skills: [499, 500],
        autoAttack: 10020,
        img: "img3$1/__cb20140628103006/$2/2/25/Xuan_Wu_II_Figure.png",
        fullName: "Xuan Wu II"
    },
    10995: {
        name: "Ymir", stats: [22650, 24600, 16464, 20592, 15933],
        skills: [227],
        img: "img1$1/__cb20130824171957/$2/6/67/Ymir%2C_Primordial_Giant_II_Figure.png",
        fullName: "Ymir, Primordial Giant II"
    },
    10486: {
        name: "Yulia", stats: [14081, 14664, 12052, 13544, 12524],
        skills: [134],
        img: "img3$1/__cb20130110210701/$2/4/41/Yulia%2C_Snakesage_II_Figure.png",
        fullName: "Yulia, Snakesage II"
    },
    10497: {
        name: "Zagan", stats: [16128, 16941, 14709, 12423, 13052],
        skills: [143],
        img: "img1$1/__cb20130201171143/$2/9/92/Zagan_II_Figure.png",
        fullName: "Zagan II"
    },
    11077: {
        name: "Zahhak", stats: [16789, 10051, 19151, 17797, 17168],
        skills: [339],
        autoAttack: 10001,
        img: "img1$1/__cb20140110075312/$2/9/94/Zahhak%2C_Dragon_Marshal_II_Figure.png",
        fullName: "Zahhak, Dragon Marshal II"
    },
    10869: {
        name: "Zanga", stats: [10218, 10787, 9694, 9512, 12780],
        skills: [161],
        img: "img1$1/__cb20130630141907/$2/c/cf/Zanga%2C_the_Iron_Storm_II_Figure.png",
        fullName: "Zanga, the Iron Storm II"
    },
    10992: {
        name: "Zeruel", stats: [16995, 19573, 13886, 13507, 16984],
        skills: [351, 352],
        img: "img4$1/__cb20140122120951/$2/a/a7/Zeruel%2C_Angel_of_War_II_Figure.png",
        fullName: "Zeruel, Angel of War II"
    },
    10474: {
        name: "Zuniga", stats: [12987, 15132, 14276, 14839, 14709],
        skills: [132],
        img: "img3$1/__cb20130108170215/$2/2/22/Zuniga%2C_Guard_Captain_II_Figure.png",
        fullName: "Zuniga, Guard Captain II"
    }
};

var FamiliarDatabase = (function () {
    function FamiliarDatabase() {
    }
    FamiliarDatabase.getTierList = function (tierToGet, allTierString) {
        if (!this.tierList) {
            this.tierList = {};
            var allTierList = JSON.parse(allTierString);
            var tierArray = ["X+", "X", "S+", "S", "A+", "A", "B", "C"];

            for (var i = 0; i < tierArray.length; i++) {
                var tierNameList = [];
                var tier = tierArray[i];

                for (var j = 0; j < allTierList[tier].length; j++) {
                    tierNameList.push(allTierList[tier][j].name);
                }

                this.tierList[tier] = [];

                for (var key in famDatabase) {
                    if (famDatabase.hasOwnProperty(key)) {
                        var name = famDatabase[key].fullName;
                        if (tierNameList.indexOf(name) != -1) {
                            this.tierList[tier].push(key);
                        }
                    }
                }
            }
        }

        return this.tierList[tierToGet];
    };

    FamiliarDatabase.getAllFamiliarList = function () {
        if (!this.allIdList) {
            this.allIdList = [];

            for (var key in famDatabase) {
                if (famDatabase.hasOwnProperty(key) && !famDatabase[key].isWarlord) {
                    this.allIdList.push(key);
                }
            }
        }

        return this.allIdList;
    };

    FamiliarDatabase.getRandomFamList = function (type, allTierString) {
        var tierXP = this.getTierList("X+", allTierString);
        var tierX = this.getTierList("X", allTierString);
        var tierSP = this.getTierList("S+", allTierString);
        var tierS = this.getTierList("S", allTierString);
        var tierAP = this.getTierList("A+", allTierString);
        var tierA = this.getTierList("A", allTierString);

        switch (type) {
            case 1 /* ALL */:
                return this.getAllFamiliarList();
            case 2 /* XP_ONLY */:
                return tierXP;
            case 3 /* X_ONLY */:
                return tierX;
            case 4 /* X_UP */:
                return tierX.concat(tierXP);
            case 5 /* SP_ONLY */:
                return tierSP;
            case 6 /* SP_UP */:
                return tierSP.concat(tierX).concat(tierXP);
            case 7 /* S_ONLY */:
                return tierS;
            case 8 /* S_UP */:
                return tierS.concat(tierSP).concat(tierX).concat(tierXP);
            case 9 /* AP_ONLY */:
                return tierAP;
            case 10 /* AP_UP */:
                return tierAP.concat(tierS).concat(tierSP).concat(tierX).concat(tierXP);
            case 11 /* A_ONLY */:
                return tierA;
            case 12 /* A_UP */:
                return tierA.concat(tierAP).concat(tierS).concat(tierSP).concat(tierX).concat(tierXP);
            default:
                throw new Error("Invalid brig random type");
        }
    };

    FamiliarDatabase.getWarlordList = function () {
        return [1, 2, 3, 4, 5, 6, 7, 8];
    };
    FamiliarDatabase.tierList = null;

    FamiliarDatabase.allIdList = null;
    return FamiliarDatabase;
})();
var Formation = (function () {
    function Formation(type) {
        this.type = type;
    }
    Formation.initialize = function () {
        Formation.FORMATION_CONFIG[0 /* SKEIN_5 */] = [3, 2, 1, 2, 3];
        Formation.FORMATION_CONFIG[1 /* VALLEY_5 */] = [1, 2, 3, 2, 1];
        Formation.FORMATION_CONFIG[2 /* TOOTH_5 */] = [1, 3, 1, 3, 1];
        Formation.FORMATION_CONFIG[3 /* WAVE_5 */] = [3, 1, 2, 1, 3];
        Formation.FORMATION_CONFIG[4 /* FRONT_5 */] = [1, 1, 1, 1, 1];
        Formation.FORMATION_CONFIG[5 /* MID_5 */] = [2, 2, 2, 2, 2];
        Formation.FORMATION_CONFIG[6 /* REAR_5 */] = [3, 3, 3, 3, 3];
        Formation.FORMATION_CONFIG[7 /* PIKE_5 */] = [3, 3, 1, 3, 3];
        Formation.FORMATION_CONFIG[8 /* SHIELD_5 */] = [1, 1, 3, 1, 1];
        Formation.FORMATION_CONFIG[9 /* PINCER_5 */] = [3, 1, 3, 1, 3];
        Formation.FORMATION_CONFIG[10 /* SAW_5 */] = [1, 3, 2, 3, 1];
        Formation.FORMATION_CONFIG[11 /* HYDRA_5 */] = [3, 3, 1, 1, 1];

        Formation.ANDROID_PROC_ORDER[1 /* FRONT */] = [11, 15, 14, 13, 12];
        Formation.ANDROID_PROC_ORDER[2 /* MID */] = [6, 10, 9, 8, 7];
        Formation.ANDROID_PROC_ORDER[3 /* REAR */] = [1, 5, 4, 3, 2];

        Formation.IOS_PROC_ORDER[1 /* FRONT */] = [11, 12, 13, 14, 15];
        Formation.IOS_PROC_ORDER[2 /* MID */] = [6, 7, 8, 9, 10];
        Formation.IOS_PROC_ORDER[3 /* REAR */] = [1, 2, 3, 4, 5];
        return null;
    };

    Formation.getProcIndex = function (row, column, type) {
        var order = (type == 1 /* ANDROID */) ? this.ANDROID_PROC_ORDER : this.IOS_PROC_ORDER;

        return order[row][column];
    };

    Formation.prototype.getCardRow = function (position) {
        return Formation.FORMATION_CONFIG[this.type][position];
    };

    Formation.prototype.getFormationConfig = function () {
        return Formation.FORMATION_CONFIG[this.type];
    };
    Formation.FORMATION_CONFIG = {};
    Formation.ANDROID_PROC_ORDER = {};
    Formation.IOS_PROC_ORDER = {};

    Formation.whyfoo = Formation.initialize();
    return Formation;
})();
var Player = (function () {
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
        this.skillType = skillData.type;
        this.skillFunc = skillData.func;
        this.skillCalcType = skillData.calc;
        this.skillFuncArg1 = skillData.arg1 ? skillData.arg1 : 0;
        this.skillFuncArg2 = skillData.arg2 ? skillData.arg2 : 0;
        this.skillFuncArg3 = skillData.arg3 ? skillData.arg3 : 0;
        this.skillFuncArg4 = skillData.arg4 ? skillData.arg4 : 0;
        this.skillFuncArg5 = skillData.arg5 ? skillData.arg5 : 0;
        this.skillRange = skillData.range;
        this.maxProbability = skillData.prob;
        this.ward = skillData.ward;
        this.description = skillData.desc;
        this.isAutoAttack = skillData.isAutoAttack;

        this.logic = SkillLogicFactory.getSkillLogic(this.skillFunc);

        var selectDead = false;
        if (this.skillFunc === 6 /* REVIVE */) {
            selectDead = true;
        }
        this.range = RangeFactory.getRange(this.skillRange, selectDead);
    }
    Skill.isAttackSkill = function (skillId) {
        var isAttackSkill = false;
        var skillInfo = SkillDatabase[skillId];

        switch (skillInfo.func) {
            case 3 /* ATTACK */:
            case 4 /* MAGIC */:
            case 13 /* COUNTER */:
            case 14 /* PROTECT_COUNTER */:
            case 21 /* DEBUFFATTACK */:
            case 22 /* DEBUFFINDIRECT */:
            case 33 /* CASTER_BASED_DEBUFF_ATTACK */:
            case 34 /* CASTER_BASED_DEBUFF_MAGIC */:
            case 36 /* DRAIN_ATTACK */:
            case 37 /* DRAIN_MAGIC */:
            case 7 /* KILL */:
                isAttackSkill = true;
                break;
            default:
                break;
        }

        return isAttackSkill;
    };

    Skill.isIndirectSkill = function (skillId) {
        var isIndirect = true;
        var skillInfo = SkillDatabase[skillId];

        switch (skillInfo.func) {
            case 3 /* ATTACK */:
            case 13 /* COUNTER */:
            case 14 /* PROTECT_COUNTER */:
            case 28 /* PROTECT_REFLECT */:
            case 21 /* DEBUFFATTACK */:
            case 33 /* CASTER_BASED_DEBUFF_ATTACK */:
            case 36 /* DRAIN_ATTACK */:
                isIndirect = false;
                break;
            default:
                break;
        }

        return isIndirect;
    };

    Skill.isPositionIndependentAttackSkill = function (skillId) {
        var skillInfo = SkillDatabase[skillId];

        return this.isIndirectSkill(skillId) && skillInfo.func != 7 /* KILL */;
    };

    Skill.isWisAutoAttack = function (skillId) {
        var skillInfo = SkillDatabase[skillId];
        return this.isAutoAttackSkill(skillId) && skillInfo.calc == 2 /* WIS */;
    };

    Skill.isAtkAutoAttack = function (skillId) {
        var skillInfo = SkillDatabase[skillId];

        return this.isAutoAttackSkill(skillId) && skillInfo.calc == 1 /* ATK */;
    };

    Skill.isAutoAttackSkill = function (skillId) {
        return SkillDatabase[skillId].isAutoAttack;
    };

    Skill.isMagicSkill = function (skillId) {
        var isMagicSkill = false;
        var skillInfo = SkillDatabase[skillId];

        if (skillInfo.calc == 2 /* WIS */) {
            isMagicSkill = true;
        }

        if ([
            19 /* AFFLICTION */,
            1 /* BUFF */,
            2 /* DEBUFF */,
            4 /* MAGIC */,
            34 /* CASTER_BASED_DEBUFF_MAGIC */,
            37 /* DRAIN_MAGIC */].indexOf(skillInfo.func) != -1) {
            isMagicSkill = true;
        }

        return isMagicSkill;
    };

    Skill.isAoeSkill = function (skillId) {
        var isAoe = false;
        var skillInfo = SkillDatabase[skillId];

        if (RangeFactory.canBeAoeRange(skillInfo.range) && this.isIndirectSkill(skillId)) {
            isAoe = true;
        }

        return isAoe;
    };

    Skill.isDebuffAttackSkill = function (skillId) {
        var isDebuffAttack = false;
        var skillInfo = SkillDatabase[skillId];

        switch (skillInfo.func) {
            case 21 /* DEBUFFATTACK */:
            case 22 /* DEBUFFINDIRECT */:
            case 33 /* CASTER_BASED_DEBUFF_ATTACK */:
            case 34 /* CASTER_BASED_DEBUFF_MAGIC */:
                isDebuffAttack = true;
                break;
            default:
                break;
        }

        return isDebuffAttack;
    };

    Skill.isAvailableForSelect = function (skillId) {
        var isAvailable = true;
        var skillInfo = SkillDatabase[skillId];

        if (skillInfo.isAutoAttack || skillId == 355 || skillId == 452) {
            isAvailable = false;
        }

        return isAvailable;
    };

    Skill.getAvailableSkillsForSelect = function () {
        if (this.availableSkillsForSelect == null) {
            this.availableSkillsForSelect = [];
            for (var key in SkillDatabase) {
                if (this.isAvailableForSelect(key)) {
                    this.availableSkillsForSelect.push(key);
                }
            }
        }

        return this.availableSkillsForSelect;
    };

    Skill.getStatusModified = function (skillId) {
        var skillInfo = SkillDatabase[skillId];
        var statuses = [];

        switch (skillInfo.func) {
            case 1 /* BUFF */:
                statuses.push(skillInfo.arg2);
                if (skillInfo.arg3 && skillInfo.arg2 != 17 /* HP_SHIELD */)
                    statuses.push(skillInfo.arg3);
                break;
            case 2 /* DEBUFF */:
            case 21 /* DEBUFFATTACK */:
            case 22 /* DEBUFFINDIRECT */:
            case 33 /* CASTER_BASED_DEBUFF_ATTACK */:
            case 34 /* CASTER_BASED_DEBUFF_MAGIC */:
                statuses.push(skillInfo.arg2);
                break;
            case 32 /* CASTER_BASED_DEBUFF */:
            case 38 /* ONHIT_DEBUFF */:
                statuses.push(skillInfo.arg2);
                if (skillInfo.arg3)
                    statuses.push(skillInfo.arg3);
                break;
            default:
                break;
        }

        return statuses;
    };

    Skill.canProtectFromCalcType = function (type, attackSkill) {
        switch (type) {
            case 1 /* ATK */:
            case 2 /* WIS */:
            case 3 /* AGI */:
                return attackSkill.skillCalcType == type;
            case 8 /* ATK_WIS */:
                return attackSkill.skillCalcType == 1 /* ATK */ || attackSkill.skillCalcType == 2 /* WIS */;
            case 9 /* ATK_AGI */:
                return attackSkill.skillCalcType == 1 /* ATK */ || attackSkill.skillCalcType == 3 /* AGI */;
            case 10 /* WIS_AGI */:
                return attackSkill.skillCalcType == 2 /* WIS */ || attackSkill.skillCalcType == 3 /* AGI */;
            default:
                return false;
        }
    };

    Skill.canProtectFromAttackType = function (type, attackSkill) {
        switch (type) {
            case 2 /* SKILL */:
                return (attackSkill.skillFunc != 13 /* COUNTER */ && attackSkill.skillFunc != 14 /* PROTECT_COUNTER */ && attackSkill.skillFunc != 41 /* COUNTER_INDIRECT */ && attackSkill.id == 10000);
            case 3 /* NOT_COUNTER */:
                return (attackSkill.skillFunc != 13 /* COUNTER */ && attackSkill.skillFunc != 14 /* PROTECT_COUNTER */ && attackSkill.skillFunc != 41 /* COUNTER_INDIRECT */);
            default:
                throw new Error("Unimplemented ProtectAttackType");
        }
    };

    Skill.prototype.isIndirectSkill = function () {
        return Skill.isIndirectSkill(this.id);
    };

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
            description: this.description,
            isAutoAttack: this.isAutoAttack
        };
    };

    Skill.prototype.willBeExecuted = function (data) {
        return this.logic.willBeExecuted(data);
    };

    Skill.prototype.execute = function (data) {
        return this.logic.execute(data);
    };

    Skill.prototype.getTarget = function (executor) {
        return this.range.getTarget(executor);
    };

    Skill.prototype.getReady = function (executor) {
        this.range.getReady(executor);
    };
    Skill.availableSkillsForSelect = null;
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

    if (damage < baseDamage * 0.1) {
        damage = baseDamage * 0.1;
    }

    damage = Math.floor(damage * getRandomArbitary(0.9, 1.1));

    return damage;
}

function getHealAmount(executor) {
    var HEAL_FACTOR = 0.3;
    var amount = executor.getWIS() * HEAL_FACTOR;

    amount = Math.floor(amount * getRandomArbitary(0.9, 1.1));

    return amount;
}

function getDebuffAmount(executor, target) {
    var FACTOR = 1.0;

    var value = (executor.getWIS() - target.getWIS()) * FACTOR;
    var min = executor.getWIS() * 0.1;

    if (value < min) {
        value = min;
    }

    return -1 * value;
}

function getCasterBasedDebuffAmount(executor) {
    var FACTOR = 1.2;

    var value = executor.getWIS() * FACTOR;

    return -1 * value;
}

function getReflectAmount(attacker, attackSkill, caster, target, ignorePosFactor, oriDmg) {
    var DIFF_FACTOR = 0.7;

    var POS_ATTACK_FACTOR = {};
    POS_ATTACK_FACTOR[3 /* REAR */] = 0.8;
    POS_ATTACK_FACTOR[2 /* MID */] = 1;
    POS_ATTACK_FACTOR[1 /* FRONT */] = 1.2;

    var POS_DAMAGE_FACTOR = {};
    POS_DAMAGE_FACTOR[3 /* REAR */] = 0.8;
    POS_DAMAGE_FACTOR[2 /* MID */] = 1;
    POS_DAMAGE_FACTOR[1 /* FRONT */] = 1.2;

    var damage;
    var x = oriDmg;
    switch (attackSkill.skillCalcType) {
        case 1 /* ATK */:
        case 3 /* AGI */:
            var xFormation = ignorePosFactor ? 1 : POS_ATTACK_FACTOR[attacker.formationRow] * POS_DAMAGE_FACTOR[caster.formationRow];
            var formation = ignorePosFactor ? 1 : POS_ATTACK_FACTOR[caster.formationRow] * POS_DAMAGE_FACTOR[target.formationRow];
            damage = (x / xFormation + Math.max(0, caster.getDEF() - target.getDEF()) * DIFF_FACTOR) * formation;
            break;
        case 2 /* WIS */:
            damage = x + Math.max(0, caster.getDEF() - (target.getWIS() + target.getDEF()) / 2) * DIFF_FACTOR;
            break;
    }
    damage = Math.floor(damage * getRandomArbitary(0.9, 1.1));

    return damage;
}
var SkillDatabase = {
    10000: {
        name: "Default auto", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    2: {
        name: "Strength of Blades", type: 1, func: 1, calc: 0,
        arg1: 0.5, arg2: 1,
        range: 3, prob: 70,
        desc: "Raise ATK of self and adjacent familiars."
    },
    4: {
        name: "Guile of Runes", type: 1, func: 1, calc: 0,
        arg1: 0.5, arg2: 3,
        range: 3, prob: 70,
        desc: "Raise WIS of self and adjacent familiars."
    },
    5: {
        name: "Grace of Winds", type: 1, func: 1, calc: 0,
        arg1: 0.5, arg2: 4,
        range: 3, prob: 70,
        desc: "Raise AGI of self and adjacent familiars."
    },
    6: {
        name: "Blade Break", type: 1, func: 2, calc: 0,
        arg1: 0.5, arg2: 1,
        range: 7, prob: 70,
        desc: "Lower ATK of up to three foes."
    },
    7: {
        name: "Shield Rend", type: 1, func: 2, calc: 0,
        arg1: 0.5, arg2: 2,
        range: 7, prob: 70,
        desc: "Lower DEF of up to three foes."
    },
    8: {
        name: "Mind Rust", type: 1, func: 2, calc: 0,
        arg1: 0.5, arg2: 3,
        range: 7, prob: 70,
        desc: "Lower WIS of up to three foes."
    },
    9: {
        name: "Speed Sap", type: 1, func: 2, calc: 0,
        arg1: 0.5, arg2: 4,
        range: 7, prob: 70,
        desc: "Lower AGI of up to three foes."
    },
    10: {
        name: "Scythe Storm", type: 2, func: 3, calc: 3,
        arg1: 1,
        range: 8, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to all foes."
    },
    11: {
        name: "Torrent of Flame", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 8, prob: 30, ward: 3,
        desc: "Deal heavy damage to all foes."
    },
    16: {
        name: "Greater Recall", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 2, prob: 50,
        desc: "Revive and fully restore HP of adjacent familiars."
    },
    17: {
        name: "Berserk", type: 2, func: 3, calc: 1,
        arg1: 0.8,
        range: 17, prob: 30, ward: 1,
        desc: "Deal damage to six random targets."
    },
    18: {
        name: "Rush", type: 2, func: 3, calc: 3,
        arg1: 0.7,
        range: 17, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to six random targets."
    },
    19: {
        name: "Dispell", type: 2, func: 16, calc: 0,
        range: 8, prob: 70,
        desc: "Remove the buffs of all foes."
    },
    20: {
        name: "Recall", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 1, prob: 50,
        desc: "Revive an adjacent familiar."
    },
    21: {
        name: "Elixir of Recall", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 1, prob: 50,
        desc: "Revive an adjacent familiar."
    },
    23: {
        name: "Breath of Flame", type: 2, func: 4, calc: 2,
        arg1: 2.5,
        range: 7, prob: 30, ward: 3,
        desc: "Deal heavy damage to up to three foes."
    },
    26: {
        name: "Greater Heal", type: 2, func: 18, calc: 4,
        arg1: 1,
        range: 2, prob: 30,
        desc: "Restore a fixed amount of HP to adjacent familiars."
    },
    27: {
        name: "Greater Healing Sage", type: 2, func: 18, calc: 4,
        arg1: 1,
        range: 2, prob: 30,
        desc: "Restore a fixed amount of HP to adjacent familiars."
    },
    28: {
        name: "Envenom", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 1, arg3: 1,
        range: 5, prob: 30, ward: 2,
        desc: "Deal damage and poison one foe."
    },
    29: {
        name: "Bind", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 2, arg3: 0.3,
        range: 5, prob: 30, ward: 2,
        desc: "Deal damage and sometimes paralyze one foe."
    },
    33: {
        name: "Whirlwind", type: 2, func: 3, calc: 3,
        arg1: 2.5,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to three foes."
    },
    34: {
        name: "Massive Assault", type: 2, func: 3, calc: 1,
        arg1: 4,
        range: 5, prob: 30, ward: 1,
        desc: "Deal massive damage to one foe."
    },
    38: {
        name: "Heal", type: 2, func: 18, calc: 4,
        arg1: 1,
        range: 1, prob: 30,
        desc: "Restore a fixed amount of HP to an adjacent familiar."
    },
    39: {
        name: "Healing Sage", type: 2, func: 18, calc: 4,
        arg1: 1,
        range: 1, prob: 30,
        desc: "Restore a fixed amount of HP to an adjacent familiar."
    },
    40: {
        name: "Firestrike", type: 2, func: 4, calc: 2,
        arg1: 3,
        range: 5, prob: 30, ward: 2,
        desc: "Deal heavy damage to one foe."
    },
    41: {
        name: "Blizzard", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 3, arg3: 0.3,
        range: 7, prob: 30, ward: 3,
        desc: "Deal damage and sometimes freeze up to three foes."
    },
    42: {
        name: "Thunderstorm", type: 2, func: 4, calc: 2,
        arg1: 0.7,
        range: 8, prob: 30, ward: 2,
        desc: "Deal damage to all foes."
    },
    43: {
        name: "Windlash", type: 2, func: 3, calc: 3,
        arg1: 1,
        range: 16, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to multiple foes."
    },
    45: {
        name: "Intense Assault", type: 2, func: 3, calc: 1,
        arg1: 3,
        range: 5, prob: 30, ward: 1,
        desc: "Deal very heavy damage to one foe."
    },
    46: {
        name: "Brawl", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 16, prob: 30, ward: 1,
        desc: "Attack three foes."
    },
    47: {
        name: "Blastwave", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 12, prob: 30, ward: 2,
        desc: "Deal heavy damage to all foes in the front line."
    },
    48: {
        name: "Impale", type: 2, func: 4, calc: 1,
        arg1: 1,
        range: 6, prob: 30, ward: 1,
        desc: "Deal damage to up to two foes, ignoring position."
    },
    50: {
        name: "Focused Assault", type: 2, func: 3, calc: 1,
        arg1: 2,
        range: 5, prob: 30, ward: 1,
        desc: "Deal heavy damage to one foe."
    },
    51: {
        name: "Skirmish", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 6, prob: 30, ward: 1,
        desc: "Attack up to two foes."
    },
    52: {
        name: "Dervish", type: 2, func: 3, calc: 3,
        arg1: 2,
        range: 5, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to one foe."
    },
    54: {
        name: "Foul Fang", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 1, arg3: 1,
        range: 5, prob: 30, ward: 1,
        desc: "Poison one foe."
    },
    55: {
        name: "Embrace", type: 2, func: 3, calc: 1,
        arg1: 0.5, arg2: 4, arg3: 1,
        range: 5, prob: 30, ward: 1,
        desc: "Deal damage and disable one foe for one turn."
    },
    60: {
        name: "Syphon", type: 3, func: 11, calc: 1,
        arg1: 1,
        range: 1, prob: 50,
        desc: "Heal an adjacent familiar for the amount of damage taken."
    },
    61: {
        name: "Cloak & Dagger", type: 5, func: 14, calc: 1,
        arg1: 1,
        range: 2, prob: 50, ward: 1,
        desc: "Take damage in place of nearby ally and counter."
    },
    62: {
        name: "Cloak", type: 5, func: 12, calc: 1,
        arg1: 1,
        range: 2, prob: 50,
        desc: "Take damage in place of adjacent familiars."
    },
    63: {
        name: "Shroud", type: 5, func: 12, calc: 0,
        arg1: 0,
        range: 4, prob: 50,
        desc: "Take damage in place of familiars."
    },
    64: {
        name: "Riposte", type: 3, func: 13, calc: 1,
        arg1: 1,
        range: 1, prob: 50, ward: 1,
        desc: "Counterattack after receiving an attack."
    },
    69: {
        name: "Lightning Bolt", type: 2, func: 4, calc: 2,
        arg1: 3,
        range: 5, prob: 30, ward: 2,
        desc: "Deal heavy damage to one foe."
    },
    70: {
        name: "Wind Cutter", type: 2, func: 4, calc: 2,
        arg1: 3,
        range: 5, prob: 30, ward: 2,
        desc: "Deal heavy damage to one foe."
    },
    71: {
        name: "Icicle", type: 2, func: 4, calc: 2,
        arg1: 3,
        range: 5, prob: 30, ward: 3,
        desc: "Deal heavy damage to one foe."
    },
    77: {
        name: "Blade Break 1", type: 1, func: 2, calc: 0,
        arg1: 0.1, arg2: 1,
        range: 8, prob: 70,
        desc: "Lower ATK of all foes."
    },
    78: {
        name: "Shield Rend 1", type: 1, func: 2, calc: 0,
        arg1: 0.1, arg2: 2,
        range: 8, prob: 70,
        desc: "Lower DEF of all foes."
    },
    79: {
        name: "Mind Rust 1", type: 1, func: 2, calc: 0,
        arg1: 0.1, arg2: 3,
        range: 8, prob: 70,
        desc: "Lower WIS of all foes."
    },
    80: {
        name: "Speed Sap 1", type: 1, func: 2, calc: 0,
        arg1: 0.1, arg2: 4,
        range: 8, prob: 70,
        desc: "Lower AGI of all foes."
    },
    81: {
        name: "Boon of Blade & Shield 2", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 1, arg3: 2,
        range: 4, prob: 70,
        desc: "Raise ATK and DEF of all familiars."
    },
    85: {
        name: "Grace of Winds 2", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 4,
        range: 4, prob: 70,
        desc: "Raise AGI of all familiars."
    },
    86: {
        name: "Blade Break 2", type: 1, func: 2, calc: 0,
        arg1: 0.2, arg2: 1,
        range: 8, prob: 70,
        desc: "Lower ATK of all foes."
    },
    87: {
        name: "Shield Rend 2", type: 1, func: 2, calc: 0,
        arg1: 0.2, arg2: 2,
        range: 8, prob: 70,
        desc: "Lower DEF of all foes."
    },
    88: {
        name: "Mind Rust 2", type: 1, func: 2, calc: 0,
        arg1: 0.2, arg2: 3,
        range: 8, prob: 70,
        desc: "Lower WIS of all foes."
    },
    89: {
        name: "Speed Sap 2", type: 1, func: 2, calc: 0,
        arg1: 0.2, arg2: 4,
        range: 8, prob: 70,
        desc: "Lower AGI of all foes."
    },
    94: {
        name: "Grace of Winds 3", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 4,
        range: 4, prob: 70,
        desc: "Raise AGI of all familiars."
    },
    95: {
        name: "Blade Break 3", type: 1, func: 2, calc: 0,
        arg1: 0.3, arg2: 1,
        range: 8, prob: 70,
        desc: "Lower ATK of all foes."
    },
    96: {
        name: "Shield Rend 3", type: 1, func: 2, calc: 0,
        arg1: 0.3, arg2: 2,
        range: 8, prob: 70,
        desc: "Lower DEF of all foes."
    },
    97: {
        name: "Mind Rust 3", type: 1, func: 2, calc: 0,
        arg1: 0.3, arg2: 3,
        range: 8, prob: 70,
        desc: "Lower WIS of all foes."
    },
    98: {
        name: "Speed Sap 3", type: 1, func: 2, calc: 0,
        arg1: 0.3, arg2: 4,
        range: 8, prob: 70,
        desc: "Lower AGI of all foes."
    },
    104: {
        name: "Blade Break 4", type: 1, func: 2, calc: 0,
        arg1: 0.4, arg2: 1,
        range: 8, prob: 70,
        desc: "Lower ATK of all foes."
    },
    105: {
        name: "Shield Rend 4", type: 1, func: 2, calc: 0,
        arg1: 0.4, arg2: 2,
        range: 8, prob: 70,
        desc: "Lower DEF of all foes."
    },
    106: {
        name: "Mind Rust 4", type: 1, func: 2, calc: 0,
        arg1: 0.4, arg2: 3,
        range: 8, prob: 70,
        desc: "Lower WIS of all foes."
    },
    107: {
        name: "Speed Sap 4", type: 1, func: 2, calc: 0,
        arg1: 0.4, arg2: 4,
        range: 8, prob: 70,
        desc: "Lower AGI of all foes."
    },
    108: {
        name: "Icestorm", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 8, prob: 30, ward: 3,
        desc: "Deal ice damage to all foes."
    },
    109: {
        name: "Plasma field", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 8, prob: 30, ward: 2,
        desc: "Deal lightning damage to all foes."
    },
    110: {
        name: "Typhoon", type: 2, func: 4, calc: 3,
        arg1: 2,
        range: 8, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to all foes."
    },
    111: {
        name: "Whorl of Wisdom", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 16, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to three foes."
    },
    112: {
        name: "Whorl of Attack", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 16, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to three foes."
    },
    113: {
        name: "Thundercloud", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 2, arg3: 0.3,
        range: 7, prob: 30, ward: 2,
        desc: "Deal damage and sometimes paralyze up to three foes."
    },
    114: {
        name: "Electric Shock", type: 2, func: 4, calc: 2,
        arg1: 2.5,
        range: 7, prob: 30, ward: 2,
        desc: "Deal heavy lightning damage to up to three foes."
    },
    115: {
        name: "Venomstorm", type: 2, func: 3, calc: 1,
        arg1: 1.5, arg2: 1, arg3: 1,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy poison damage to three foes."
    },
    116: {
        name: "Mass Greater Heal", type: 2, func: 18, calc: 4,
        arg1: 0.7,
        range: 4, prob: 30,
        desc: "Restore a fixed amount of HP to all party members."
    },
    117: {
        name: "Hellfire", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 8, prob: 30, ward: 2,
        desc: "Hurl a ball of flame to damage all foes."
    },
    118: {
        name: "Slashing Blade", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes."
    },
    119: {
        name: "Flash of Rage", type: 2, func: 4, calc: 2,
        arg1: 0.9,
        range: 17, prob: 30, ward: 2,
        desc: "Call down six random lightning bolts on foes."
    },
    120: {
        name: "Boon of Mind & Shield 2", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 3, arg3: 2,
        range: 4, prob: 70,
        desc: "Raise WIS and DEF of all party members."
    },
    121: {
        name: "Charge", type: 2, func: 4, calc: 1,
        arg1: 1.2,
        range: 16, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to three foes, regardless of his position."
    },
    122: {
        name: "Frontal Onslaught", type: 2, func: 3, calc: 1,
        arg1: 1.5,
        range: 12, prob: 30, ward: 1,
        desc: "Deal heavy damage to the front line."
    },
    123: {
        name: "Flame Fist", type: 2, func: 3, calc: 1,
        arg1: 1.7,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy fire damage to three random targets."
    },
    124: {
        name: "Ice Fist", type: 2, func: 3, calc: 1,
        arg1: 1.7,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ice damage to three random targets."
    },
    125: {
        name: "Shield & Dagger", type: 5, func: 14, calc: 1,
        arg1: 1,
        range: 4, prob: 50, ward: 1,
        desc: "Take damage in place of any ally and counter."
    },
    127: {
        name: "Poison Fang", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 1, arg3: 0.3,
        range: 16, prob: 30, ward: 2,
        desc: "Deal damage and sometimes poison three random targets."
    },
    128: {
        name: "Whiteout", type: 2, func: 4, calc: 2,
        arg1: 2.3, arg2: 3, arg3: 0.3,
        range: 7, prob: 30, ward: 3,
        desc: "Deal heavy damage and sometimes freeze up to three foes."
    },
    129: {
        name: "Fire Whirlwind", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 16, prob: 30, ward: 2,
        desc: "Deal damage to three foes."
    },
    131: {
        name: "Bloodlust Lance", type: 2, func: 4, calc: 1,
        arg1: 1,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes, ignoring position."
    },
    132: {
        name: "Boon of Blade & Wind 2", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 1, arg3: 4,
        range: 4, prob: 70,
        desc: "Raise ATK and AGI of all party members."
    },
    133: {
        name: "Blade Ward 2", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 5,
        range: 4, prob: 70,
        desc: "Reduce physical damage taken by all allies."
    },
    134: {
        name: "Magic Ward 2", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 6,
        range: 4, prob: 70,
        desc: "Reduce magic damage taken by all allies."
    },
    135: {
        name: "Breath Ward 2", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 7,
        range: 4, prob: 70,
        desc: "Reduce breath damage taken by all allies."
    },
    136: {
        name: "Breath Ward", type: 1, func: 1, calc: 0,
        arg1: 0.7, arg2: 7,
        range: 3, prob: 70,
        desc: "Reduce breath damage taken by self and adjacent familiars."
    },
    137: {
        name: "Binding Arcana", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 5, arg3: 0.3, arg4: 3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal four physical strikes that sometimes silence foes."
    },
    138: {
        name: "Head Bash", type: 2, func: 3, calc: 1,
        arg1: 3,
        range: 23, prob: 30, ward: 1,
        desc: "Deal heavy physical damage to two random targets."
    },
    139: {
        name: "Mad Dash", type: 2, func: 3, calc: 1,
        arg1: 2,
        range: 23, prob: 30, ward: 1,
        desc: "Deal Massive ATK-based damage to two random foes."
    },
    140: {
        name: "Numbing Touch", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 2, arg3: 0.7,
        range: 5, prob: 70, ward: 1,
        desc: "Cause attacks to have a high chance to paralyze foes."
    },
    141: {
        name: "Burning Rage", type: 2, func: 4, calc: 2,
        arg1: 0.9,
        range: 17, prob: 30, ward: 2,
        desc: "Engulf six random foes in flames."
    },
    142: {
        name: "Barrage", type: 2, func: 3, calc: 1,
        arg1: 0.9,
        range: 20, prob: 30, ward: 1,
        desc: "Deal physical damage to five random targets."
    },
    143: {
        name: "Sonic Boom", type: 2, func: 7, calc: 1,
        arg1: 1, arg2: 0.1,
        range: 8, prob: 30, ward: 1,
        desc: "Damage all foes. May kill targets outright."
    },
    144: {
        name: "Windcrush", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy damage to four foes."
    },
    145: {
        name: "Mass Greater Heal 2", type: 2, func: 18, calc: 4,
        arg1: 2,
        range: 4, prob: 30,
        desc: "Restore a fixed amount of HP to all party members."
    },
    146: {
        name: "Ritual of Binding", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 5, arg3: 0.3, arg4: 3,
        range: 8, prob: 70,
        desc: "Chance to silence all foes at beginning of battle."
    },
    147: {
        name: "Spirit Curse", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 4, arg3: 0.3,
        range: 16, prob: 30, ward: 2,
        desc: "Deal damage and sometimes disable three random foes."
    },
    148: {
        name: "Windblast", type: 2, func: 22, calc: 2,
        arg1: 1.5, arg2: 4, arg3: 0.3, arg4: 0.2,
        range: 16, prob: 30, ward: 2,
        desc: "Deal damage and sometimes lower AGI of three foes."
    },
    149: {
        name: "Spiteful Strike", type: 2, func: 21, calc: 1,
        arg1: 1, arg2: 2, arg3: 0.3, arg4: 0.2,
        range: 8, prob: 30, ward: 1,
        desc: "Deal damage to all foes and sometimes lower DEF."
    },
    150: {
        name: "Grin and Bear It", type: 3, func: 20, calc: 0,
        arg1: 0.5,
        range: 21, prob: 70,
        desc: "Survive devastating damage as long as HP is above 50%."
    },
    152: {
        name: "Mad Swing", type: 2, func: 4, calc: 1,
        arg1: 1.7,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy damage to up to three foes with a mighty swing."
    },
    153: {
        name: "Onfall", type: 2, func: 4, calc: 1,
        arg1: 4,
        range: 5, prob: 30, ward: 1,
        desc: "Deal massive damage with dual blades to one foe."
    },
    154: {
        name: "Cloak & Dagger 2", type: 5, func: 14, calc: 1,
        arg1: 1.5,
        range: 2, prob: 50, ward: 1,
        desc: "Take heavy damage in place of nearby ally and counter."
    },
    155: {
        name: "Firecell Roar", type: 2, func: 22, calc: 2,
        arg1: 1.5, arg2: 1, arg3: 0.3, arg4: 0.2,
        range: 16, prob: 30, ward: 2,
        desc: "Three random fire strikes that sometimes lower ATK."
    },
    156: {
        name: "Rebuke", type: 2, func: 3, calc: 3,
        arg1: 2,
        range: 23, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to two random foes."
    },
    157: {
        name: "Rally Cry", type: 1, func: 1, calc: 0,
        arg1: 0.1, arg2: 9,
        range: 4, prob: 70,
        desc: "Raise ATK, DEF, WIS and AGI of all party members."
    },
    160: {
        name: "Ice Fang", type: 2, func: 4, calc: 1,
        arg1: 1.5, arg2: 3, arg3: 0.3,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ice damage and sometimes freeze three foes."
    },
    161: {
        name: "Shadow Strike", type: 2, func: 3, calc: 3,
        arg1: 1,
        range: 19, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to four random foes."
    },
    163: {
        name: "Poison Mist", type: 2, func: 4, calc: 2,
        arg1: 2.3, arg2: 1, arg3: 0.3,
        range: 7, prob: 30, ward: 2,
        desc: "Deal massive damage and sometimes poison up to three foes."
    },
    164: {
        name: "Boon of Mind & Blade 2", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 1, arg3: 3,
        range: 4, prob: 70,
        desc: "Raise the ATK and WIS of all party members."
    },
    165: {
        name: "Furious Cannon", type: 2, func: 22, calc: 2,
        arg1: 1, arg2: 1, arg3: 0.3, arg4: 0.5,
        range: 8, prob: 30, ward: 2,
        desc: "Deal fire damage to all foes and sometimes lower ATK."
    },
    166: {
        name: "Payback", type: 3, func: 13, calc: 1,
        arg1: 2.3,
        range: 21, prob: 50, ward: 1,
        desc: "Chance to unleash a massive counter attack when struck."
    },
    167: {
        name: "Bulwark", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 5,
        range: 3, prob: 70,
        desc: "Reduce physical damage taken by self and nearby familiars."
    },
    168: {
        name: "Frost and Ice", type: 2, func: 4, calc: 2,
        arg1: 0.8, arg2: 3, arg3: 0.3,
        range: 17, prob: 30, ward: 2,
        desc: "Deal damage and sometimes freeze six random foes."
    },
    169: {
        name: "Silent Cheer", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 8,
        range: 2, prob: 70,
        desc: "Raise the skill trigger rate of adjacent familiars."
    },
    170: {
        name: "War Dance", type: 2, func: 4, calc: 3,
        arg1: 1.5,
        range: 15, prob: 30, ward: 2,
        desc: "Deal heavy AGI-based damage to foes in front and middle."
    },
    175: {
        name: "Lifesaver", type: 2, func: 18, calc: 4,
        arg1: 2,
        range: 2, prob: 30,
        desc: "Restore a large amount of HP to adjacent familiars."
    },
    177: {
        name: "Divine Shield", type: 1, func: 1, calc: 0,
        arg1: 0.65, arg2: 5,
        range: 21, prob: 70,
        desc: "Escape most damage from physical attacks."
    },
    178: {
        name: "Light Fist", type: 2, func: 3, calc: 1,
        arg1: 1.7,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy lightning damage to three random targets."
    },
    179: {
        name: "Sword of Justice", type: 2, func: 3, calc: 3,
        arg1: 2.5,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive AGI-based damage to two random foes."
    },
    180: {
        name: "Proxy Counter", type: 5, func: 14, calc: 1,
        arg1: 1,
        range: 28, prob: 50, ward: 1,
        desc: "Take damage in place of familiars to its right and counter."
    },
    185: {
        name: "Thunderclap", type: 2, func: 4, calc: 2,
        arg1: 0.7, arg2: 2, arg3: 0.3,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to five random foes and sometimes paralyze them."
    },
    186: {
        name: "Razor Claws", type: 2, func: 3, calc: 1,
        arg1: 2, arg2: 2, arg3: 0.5,
        range: 6, prob: 30, ward: 1,
        desc: "Deal massive damage and sometimes paralyze up to two foes."
    },
    187: {
        name: "Mega Shot", type: 2, func: 4, calc: 1,
        arg1: 4,
        range: 5, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to one foe, ignoring position."
    },
    188: {
        name: "Shatter Armor", type: 2, func: 21, calc: 1,
        arg1: 3, arg2: 2, arg3: 0.3, arg4: 0.3,
        range: 5, prob: 30, ward: 1,
        desc: "Deal a heavy blow to one foe, sometimes lowering DEF."
    },
    193: {
        name: "Angler", type: 2, func: 24, calc: 0,
        range: 21, prob: 50,
        randSkills: [
            10, 11, 16, 18, 19, 20, 21, 26, 27, 28, 29, 34, 38, 39, 41, 42, 43, 45, 46, 47, 48, 50,
            51, 52, 54, 55, 69, 70, 108, 110, 111, 113, 114, 115, 116, 117, 118, 119, 121, 122, 123, 124, 127,
            129, 131, 137, 138, 139, 140, 144, 145, 147, 148, 149, 152, 153, 155, 156, 160, 161, 163, 175, 187, 188, 197, 198, 206],
        desc: "Not even its user knows what this skill will do."
    },
    195: {
        name: "Warrior's Wrath", type: 2, func: 3, calc: 1,
        arg1: 2,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to two random foes."
    },
    196: {
        name: "Spark Shot", type: 2, func: 3, calc: 1,
        arg1: 0.8,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    197: {
        name: "Revitalize", type: 2, func: 18, calc: 4,
        arg1: 1.5,
        range: 4, prob: 30,
        desc: "Restore HP to all party members."
    },
    198: {
        name: "Flame Rasp", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 7, prob: 30, ward: 3,
        desc: "Deal heavy damage to up to three foes."
    },
    199: {
        name: "Cruelest Touch", type: 2, func: 3, calc: 1,
        arg1: 0.75, arg2: 1, arg3: 0.25,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage and sometimes poison six random foes."
    },
    202: {
        name: "Trial by Fire", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 6, prob: 30, ward: 3,
        desc: "Deal massive WIS-based fire damage to up to two foes."
    },
    203: {
        name: "Trial by Ice", type: 2, func: 4, calc: 2,
        arg1: 2, arg2: 3, arg3: 0.3,
        range: 6, prob: 30, ward: 3,
        desc: "Deal massive WIS-based water damage to up to two foes."
    },
    204: {
        name: "Frozen Spear", type: 2, func: 4, calc: 2,
        arg1: 3, arg2: 3, arg3: 0.7,
        range: 5, prob: 30, ward: 2,
        desc: "Deal massive damage and sometimes freeze one foe."
    },
    205: {
        name: "Crushing Hammer", type: 2, func: 4, calc: 1,
        arg1: 1, arg2: 3, arg3: 0.3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal physical damage and sometimes freeze all foes."
    },
    206: {
        name: "Dance of Petals", type: 2, func: 4, calc: 3,
        arg1: 1,
        range: 16, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to three random foes, ignoring position."
    },
    210: {
        name: "Poison Spout", type: 2, func: 4, calc: 2,
        arg1: 1.2, arg2: 1, arg3: 0.3,
        range: 19, prob: 30, ward: 3,
        desc: "Deal WIS-based damage and sometimes poison four random foes."
    },
    211: {
        name: "Requiem", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 5, arg3: 0.3, arg4: 3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal physical damage and sometimes silence all foes."
    },
    212: {
        name: "Ghasthunt", type: 2, func: 3, calc: 2,
        arg1: 1.2,
        range: 19, prob: 30, ward: 1,
        desc: "Deal WIS-based damage to four random foes."
    },
    214: {
        name: "Blade of Madness", type: 2, func: 3, calc: 1,
        arg1: 1.35,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes."
    },
    216: {
        name: "Bodycheck", type: 2, func: 3, calc: 1,
        arg1: 2.5,
        range: 6, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to up to two foes."
    },
    217: {
        name: "Harrowing Trial", type: 2, func: 4, calc: 2,
        arg1: 2.5,
        range: 23, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to two random foes."
    },
    218: {
        name: "Boulder Toss", type: 2, func: 3, calc: 1,
        arg1: 1.4, arg2: 2, arg3: 0.3,
        range: 15, prob: 30, ward: 1,
        desc: "Deal ATK-based damage and sometimes paralyze front/middles lines."
    },
    219: {
        name: "Evil Eye", type: 2, func: 21, calc: 3,
        arg1: 1.2, arg2: 4, arg3: 0.3, arg4: 0.3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal AGI-based damage and sometimes lower AGI of all foes."
    },
    221: {
        name: "Skittering Darkness", type: 2, func: 3, calc: 1,
        arg1: 1.5,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    222: {
        name: "Boastful Blade", type: 2, func: 3, calc: 1,
        arg1: 1.9,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to two random foes."
    },
    224: {
        name: "Feather Shot", type: 2, func: 4, calc: 1,
        arg1: 2.1,
        range: 16, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to three random foes."
    },
    225: {
        name: "Wings of Winter", type: 2, func: 3, calc: 3,
        arg1: 0.8,
        range: 20, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to five random foes."
    },
    226: {
        name: "Pirate's Pride", type: 2, func: 4, calc: 2,
        arg1: 1.8, arg2: 2, arg3: 0.3,
        range: 15, prob: 30, ward: 2,
        desc: "Deal WIS-based damage and sometimes paralyze front/middle lines."
    },
    227: {
        name: "Muscle Play", type: 2, func: 3, calc: 1,
        arg1: 1.65,
        range: 7, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to up to three foes."
    },
    228: {
        name: "Mecha Rush", type: 2, func: 4, calc: 1,
        arg1: 1.8,
        range: 14, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to all foes in the rear line."
    },
    229: {
        name: "Spirit Word", type: 2, func: 3, calc: 2,
        arg1: 2.1,
        range: 16, prob: 30, ward: 1,
        desc: "Deal massive WIS-based damage to three random foes."
    },
    231: {
        name: "Rolling Thunder", type: 2, func: 21, calc: 3,
        arg1: 1.25, arg2: 1, arg3: 0.3, arg4: 0.2,
        range: 8, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to all foes and sometimes lower ATK."
    },
    232: {
        name: "Lightning Web", type: 2, func: 4, calc: 2,
        arg1: 2.15, arg2: 2, arg3: 0.3,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage and sometimes paralyze three foes."
    },
    234: {
        name: "Lightning Spirits", type: 2, func: 4, calc: 2,
        arg1: 1.15,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to five random foes."
    },
    236: {
        name: "Flash", type: 2, func: 4, calc: 2,
        arg1: 2.25,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to three random foes, ignoring position."
    },
    237: {
        name: "Piercing Claws", type: 2, func: 4, calc: 2,
        arg1: 2.15,
        range: 7, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to up to three foes, ignoring position."
    },
    238: {
        name: "Shadow Slash", type: 2, func: 3, calc: 1,
        arg1: 1.05,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    239: {
        name: "Dark Rush", type: 2, func: 4, calc: 3,
        arg1: 2,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive AGI-based damage to three random foes, ignoring position."
    },
    240: {
        name: "Midnight Smile", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 4,
        range: 3, prob: 70,
        desc: "Raise AGI of self and adjacent familiars at start of battle."
    },
    241: {
        name: "Chilling Blast", type: 2, func: 3, calc: 1,
        arg1: 1.7, arg2: 3, arg3: 0.3,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage and sometimes freeze three random foes."
    },
    242: {
        name: "Glacial Blade", type: 2, func: 4, calc: 2,
        arg1: 1.7, arg2: 3, arg3: 0.3,
        range: 7, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage and sometimes freeze up to three foes, ignoring position."
    },
    244: {
        name: "High Spirits", type: 2, func: 4, calc: 2,
        arg1: 1.6,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    245: {
        name: "Brave Blade", type: 2, func: 4, calc: 2,
        arg1: 1.2,
        range: 8, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to all foes, ignoring position."
    },
    248: {
        name: "Venomwing Dance", type: 2, func: 3, calc: 3,
        arg1: 1.45, arg2: 1, arg3: 0.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage and randomly poison four foes."
    },
    249: {
        name: "Steelscales", type: 2, func: 3, calc: 1,
        arg1: 0.9,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes."
    },
    250: {
        name: "Goddess of the Deep", type: 2, func: 3, calc: 3,
        arg1: 1.6,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to up to three foes."
    },
    251: {
        name: "Hungry Beak", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    252: {
        name: "Scathing Fire Brand", type: 2, func: 3, calc: 1,
        arg1: 1.5,
        range: 15, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to all foes in the front/middle line."
    },
    253: {
        name: "Brutal Fist", type: 2, func: 3, calc: 1,
        arg1: 2.1,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to two random foes."
    },
    254: {
        name: "Roving Fang", type: 2, func: 3, calc: 3,
        arg1: 1.6,
        range: 12, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to all foes in the front line."
    },
    256: {
        name: "Silent Madness", type: 2, func: 3, calc: 1,
        arg1: 1.3,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three foes."
    },
    258: {
        name: "Fatal Kiss", type: 2, func: 4, calc: 2,
        arg1: 1.35,
        range: 8, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to all foes, ignoring position."
    },
    259: {
        name: "Hell Spark", type: 2, func: 3, calc: 1,
        arg1: 1.1,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    260: {
        name: "Curse of Ages", type: 2, func: 21, calc: 3,
        arg1: 0.7, arg2: 1, arg3: 0.3, arg4: 0.2,
        range: 17, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to six random foes and sometimes lower ATK."
    },
    261: {
        name: "Groundswell", type: 2, func: 4, calc: 2,
        arg1: 1.15,
        range: 8, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to all foes, ignoring position."
    },
    263: {
        name: "Judgment", type: 2, func: 3, calc: 1,
        arg1: 1.75,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to up to three foes."
    },
    264: {
        name: "Bone Crush", type: 2, func: 3, calc: 1,
        arg1: 1.95,
        range: 16, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to three random foes."
    },
    265: {
        name: "Ancient Feast", type: 1, func: 1, calc: 0,
        arg1: 0.5, arg2: 1,
        range: 3, prob: 70,
        desc: "Raise ATK of self and adjacent familiars at beginning of battle."
    },
    267: {
        name: "Swordmaster", type: 2, func: 3, calc: 3,
        arg1: 2.4,
        range: 7, prob: 30, ward: 1,
        desc: "Deal massive AGI-based damage to up to three foes."
    },
    268: {
        name: "Gaoler's Torment", type: 2, func: 3, calc: 3,
        arg1: 1.65,
        range: 15, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to front/middle lines."
    },
    269: {
        name: "Tears of the Hideous", type: 2, func: 4, calc: 3,
        arg1: 2.05,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive AGI-based damage to three random foes, ignoring position."
    },
    270: {
        name: "Withering Flame", type: 2, func: 4, calc: 2,
        arg1: 1.7,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    271: {
        name: "Scales of Tranquility", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 5, arg3: 0.45, arg4: 1,
        range: 7, prob: 70,
        desc: "Chance to silence up to three foes for one turn at start of battle."
    },
    272: {
        name: "Bewitching Wings", type: 2, func: 4, calc: 2,
        arg1: 2.5,
        range: 23, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to two random foes, ignoring position."
    },
    273: {
        name: "Stirring Kiss", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 2, prob: 50,
        desc: "Revive and fully restore HP of adjacent familiars."
    },
    274: {
        name: "Eternal Sleep", type: 2, func: 3, calc: 3,
        arg1: 1.5,
        range: 32, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to up to four foes."
    },
    275: {
        name: "Blinding Light", type: 2, func: 4, calc: 2,
        arg1: 1.7,
        range: 16, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to three random foes, ignoring position."
    },
    276: {
        name: "Divine Grief", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 23, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to two random foes, ignoring position."
    },
    277: {
        name: "Nightmarish Notion", type: 2, func: 4, calc: 2,
        arg1: 1.1, arg2: 3, arg3: 0.3,
        range: 20, prob: 30, ward: 3,
        desc: "Deal WIS-based damage and sometimes freeze five random foes, ignoring position."
    },
    280: {
        name: "Snake Charmer", type: 2, func: 4, calc: 2,
        arg1: 2.05,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to three random foes, ignoring position."
    },
    281: {
        name: "Snake Eyes", type: 2, func: 4, calc: 2,
        arg1: 2.1, arg2: 2, arg3: 0.3,
        range: 7, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage and sometimes paralyze up to three foes."
    },
    282: {
        name: "Corpse Hymn", type: 2, func: 4, calc: 3,
        arg1: 1,
        range: 20, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to five random foes, ignoring position."
    },
    285: {
        name: "Moon Soul", type: 2, func: 4, calc: 2,
        arg1: 1.45,
        range: 15, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to front/middle lines, ignoring position."
    },
    287: {
        name: "Staff of Knowledge", type: 2, func: 18, calc: 4,
        arg1: 1.3,
        range: 3, prob: 70,
        desc: "High chance to restore HP to self and adjacent familiars."
    },
    288: {
        name: "Chain Attack", type: 2, func: 4, calc: 2,
        arg1: 0.95,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    289: {
        name: "Quakeblade", type: 2, func: 3, calc: 1,
        arg1: 1.35,
        range: 15, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to front/middle lines."
    },
    291: {
        name: "Grin and Bear It 2", type: 3, func: 20, calc: 0,
        arg1: 0.01,
        range: 21, prob: 70,
        desc: "Survive devastating damage as long as HP is above 1%."
    },
    292: {
        name: "Golden Rule", type: 2, func: 4, calc: 1,
        arg1: 2.1,
        range: 7, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to up to three foes, ignoring position."
    },
    293: {
        name: "Cruel Flame", type: 2, func: 4, calc: 1,
        arg1: 1.7,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to four random foes, ignoring position."
    },
    294: {
        name: "Mocking Laugh", type: 2, func: 3, calc: 1,
        arg1: 2.5,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to two random foes."
    },
    295: {
        name: "Dream Lure", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 4, arg3: 0.25,
        range: 7, prob: 70,
        desc: "Sometimes disable up to three foes at start of battle."
    },
    296: {
        name: "Blood Offering", type: 2, func: 4, calc: 1,
        arg1: 1.2, arg2: 4, arg3: 0.3,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage and disable six random foes, ignoring position."
    },
    297: {
        name: "Awe of the Wild", type: 2, func: 4, calc: 3,
        arg1: 2.15,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive AGI-based damage to three random foes, ignoring position."
    },
    298: {
        name: "Freezing Scales", type: 2, func: 4, calc: 2,
        arg1: 1.35, arg2: 3, arg3: 0.3,
        range: 8, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to all foes and sometimes freeze them, ignoring position."
    },
    299: {
        name: "Crazed Axe", type: 2, func: 3, calc: 1,
        arg1: 1.7,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    301: {
        name: "Fortitude", type: 3, func: 20, calc: 0,
        arg1: 0.2,
        range: 21, prob: 70,
        desc: "Survive devastating damage as long as HP is above 20%."
    },
    302: {
        name: "Ice Wall", type: 2, func: 4, calc: 2,
        arg1: 1.4,
        range: 8, prob: 30, ward: 3,
        desc: "Deal WIS-based damage to all foes, ignoring position."
    },
    303: {
        name: "Chill Horn", type: 2, func: 3, calc: 2,
        arg1: 1.9,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy WIS-based damage to three random foes, ignoring position."
    },
    304: {
        name: "Ferocious Omen", type: 1, func: 1, calc: 0,
        arg1: 0.1, arg2: 1,
        range: 3, prob: 70,
        desc: "Raise ATK of self and adjacent familiars."
    },
    305: {
        name: "Dancing Flame", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 19, prob: 30, ward: 3,
        desc: "Deal WIS-based damage to four random foes, ignoring position."
    },
    307: {
        name: "Evil Wink", type: 2, func: 3, calc: 2,
        arg1: 1.8,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy WIS-based damage to three random foes, ignoring position."
    },
    308: {
        name: "Bloodied Hands", type: 2, func: 4, calc: 2,
        arg1: 1.7,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes."
    },
    311: {
        name: "Black Phantasm", type: 2, func: 3, calc: 1,
        arg1: 1.75,
        range: 6, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to up to two foes."
    },
    312: {
        name: "Demon Spear", type: 2, func: 3, calc: 1,
        arg1: 1.75,
        range: 6, prob: 30, ward: 1,
        desc: "A spear technique from the West. Deal heavy ATK-based damage to up to two foes."
    },
    313: {
        name: "White Ruin", type: 2, func: 4, calc: 2,
        arg1: 1.5,
        range: 8, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage to all foes, ignoring position."
    },
    314: {
        name: "Fearless Laugh", type: 2, func: 3, calc: 1,
        arg1: 1.3,
        range: 32, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to up to four foes."
    },
    315: {
        name: "Trembling Horn", type: 2, func: 3, calc: 1,
        arg1: 1.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    316: {
        name: "Healing Prism", type: 3, func: 11, calc: 1,
        arg1: 1,
        range: 3, prob: 30,
        desc: "Convert damage to heal self and adjacent familiars."
    },
    317: {
        name: "Mad Swing 2", type: 2, func: 4, calc: 1,
        arg1: 1.9,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy damage to up to three foes with a mighty swing."
    },
    318: {
        name: "Frontier Spirit", type: 2, func: 3, calc: 1,
        arg1: 1.1,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    319: {
        name: "Magic Overwhelming", type: 2, func: 4, calc: 2,
        arg1: 1.55,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    320: {
        name: "Mystic Teachings", type: 1, func: 1, calc: 0,
        arg1: 0.1, arg2: 3,
        range: 3, prob: 70,
        desc: "Raise WIS of self and adjacent familiars at beginning of battle."
    },
    321: {
        name: "Roaring Blood", type: 2, func: 3, calc: 2,
        arg1: 0.95,
        range: 17, prob: 30, ward: 1,
        desc: "Deal WIS-based damage to six random foes."
    },
    322: {
        name: "Cruel Dance", type: 2, func: 4, calc: 3,
        arg1: 1.5,
        range: 15, prob: 30, ward: 2,
        desc: "Deal heavy AGI-based damage to front/middle lines, ignoring position."
    },
    325: {
        name: "Rippling Flame", type: 2, func: 3, calc: 1,
        arg1: 1.85,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    326: {
        name: "Heart of the Warrior", type: 2, func: 3, calc: 1,
        arg1: 1.6,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    327: {
        name: "Test of Courage", type: 2, func: 3, calc: 1,
        arg1: 1.6,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    328: {
        name: "Rime Fist", type: 2, func: 4, calc: 2,
        arg1: 1.4, arg2: 3, arg3: 0.3,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage and sometimes freeze five random foes, ignoring position."
    },
    329: {
        name: "Backstep", type: 5, func: 27, calc: 0,
        arg1: 2, arg2: 3, arg3: 78, arg4: 79,
        range: 21, prob: 50,
        desc: "Evade enemy AGI-based attack skills."
    },
    330: {
        name: "Dark Blessing", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 5, arg3: 0.45, arg4: 1,
        range: 7, prob: 70,
        desc: "Chance to silence up to three foes for one turn at start of battle."
    },
    331: {
        name: "Light Divine", type: 2, func: 4, calc: 2,
        arg1: 1.2,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    333: {
        name: "Cold-Blooded Smile", type: 2, func: 3, calc: 3,
        arg1: 1.2, arg2: 3, arg3: 0.3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal AGI-based damage and sometimes freeze all foes."
    },
    334: {
        name: "Gift of Terror", type: 2, func: 4, calc: 2,
        arg1: 1.5,
        range: 16, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to three random foes."
    },
    336: {
        name: "Golden Flame", type: 2, func: 4, calc: 2,
        arg1: 1.65,
        range: 15, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage to all foes in the front/middle lines, ignoring position."
    },
    339: {
        name: "Burning Scales", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 15, prob: 30, ward: 3,
        desc: "Deal massive WIS-based damage to all foes in the front/middle lines, ignoring position."
    },
    340: {
        name: "Penance", type: 2, func: 3, calc: 1,
        arg1: 1.25,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes."
    },
    341: {
        name: "Staff of Ages", type: 2, func: 3, calc: 3,
        arg1: 1.15,
        range: 19, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to four random foes."
    },
    342: {
        name: "Shadow Master", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 17, arg3: 1.25,
        range: 3, prob: 70,
        desc: "Raise HP of self and adjacent familiars at beginning of battle."
    },
    343: {
        name: "Curiosity", type: 2, func: 21, calc: 2,
        arg1: 1.5, arg2: 4, arg3: 0.3, arg4: 0.3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal heavy WIS-based damage to all foes, sometimes lowering AGI."
    },
    345: {
        name: "Wheel of Death", type: 2, func: 4, calc: 2,
        arg1: 2.2,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to three random foes, ignoring position."
    },
    346: {
        name: "Hellish Rebirth", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 101, prob: 50,
        desc: "Revive and fully restore HP of 1 random familiar."
    },
    347: {
        name: "Raging Flames", type: 2, func: 3, calc: 3,
        arg1: 2.4,
        range: 16, prob: 30, ward: 1,
        desc: "Deal massive AGI-based damage to three random foes."
    },
    348: {
        name: "Inferno", type: 2, func: 3, calc: 1,
        arg1: 1.4,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    349: {
        name: "Staff of Tyranny", type: 2, func: 3, calc: 1,
        arg1: 1.55,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    351: {
        name: "Sword of Fealty", type: 2, func: 3, calc: 1,
        arg1: 1.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    352: {
        name: "Spell of Revival", type: 1, func: 1, calc: 0,
        arg1: 355, arg2: 16,
        range: 3, prob: 70,
        desc: "Self and adjacent allies are automatically revived after being killed."
    },
    353: {
        name: "Icerend Claws", type: 2, func: 3, calc: 1,
        arg1: 1.45, arg2: 3, arg3: 0.3,
        range: 16, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to three random foes and sometimes freeze them."
    },
    354: {
        name: "Venomspray Staff", type: 2, func: 4, calc: 2,
        arg1: 2.9, arg2: 1, arg3: 0.3, arg4: 15,
        range: 23, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to two random foes and sometimes envenom them."
    },
    355: {
        name: "Dawn's Light", type: 16, func: 6, calc: 0,
        arg1: 0.5,
        range: 21, prob: 100
    },
    356: {
        name: "Wicked Bolt", type: 2, func: 4, calc: 2,
        arg1: 1.95,
        range: 16, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to three random foes, ignoring position."
    },
    357: {
        name: "Welkin Wings", type: 2, func: 3, calc: 3,
        arg1: 1.75,
        range: 12, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to all foes in the front line."
    },
    358: {
        name: "Call of Steel", type: 2, func: 3, calc: 1,
        arg1: 1.3, arg2: 5, arg3: 0.1, arg4: 3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage and sometimes silence four random foes."
    },
    359: {
        name: "Seeping Darkness", type: 2, func: 3, calc: 1,
        arg1: 1.25,
        range: 16, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to three random foes."
    },
    360: {
        name: "Curse of Wrath", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    361: {
        name: "Resplendent Light", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 20, prob: 30, ward: 2,
        desc: "Deal ATK-based damage to five random foes."
    },
    362: {
        name: "Rite of Vengeance", type: 2, func: 3, calc: 1,
        arg1: 1.85,
        range: 23, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to two random foes."
    },
    364: {
        name: "Depths of Corruption", type: 2, func: 4, calc: 1,
        arg1: 1.95,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to up to three foes, ignoring position."
    },
    365: {
        name: "Bug Attack", type: 2, func: 4, calc: 1,
        arg1: 1.95,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes, ignoring position."
    },
    366: {
        name: "Bone Chill", type: 2, func: 4, calc: 2,
        arg1: 1.7,
        range: 32, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage to up to four foes, ignoring position."
    },
    367: {
        name: "Howl", type: 2, func: 3, calc: 3,
        arg1: 0.9,
        range: 20, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to five random foes."
    },
    369: {
        name: "Stone Rain", type: 2, func: 3, calc: 1,
        arg1: 1.45,
        range: 7, prob: 30, ward: 1,
        desc: "Deal ATK-based damage up to three foes."
    },
    370: {
        name: "Dust Cloud", type: 1, func: 1, calc: 0,
        arg1: 1, arg2: 18,
        range: 132, prob: 70,
        desc: "Allows two random allies to perform an extra action during the next turn."
    },
    371: {
        name: "Battle Hierarchy", type: 1, func: 31, calc: 0,
        arg1: 1, arg2: 1,
        range: 4, prob: 70,
        desc: "Change the attack order by ATK for one turn."
    },
    372: {
        name: "Curse Foil", type: 3, func: 13, calc: 1,
        arg1: 1.3,
        range: 21, prob: 50, ward: 1,
        desc: "Chance to unleash a counter attack when struck."
    },
    374: {
        name: "Streaming Feathers", type: 3, func: 11, calc: 1,
        arg1: 1,
        range: 3, prob: 50,
        desc: "Convert damage to heal self and adjacent familiars."
    },
    375: {
        name: "Windcutter Blade", type: 2, func: 4, calc: 1,
        arg1: 2,
        range: 16, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to three random foes, ignoring position."
    },
    376: {
        name: "Enigmatic Bloom", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 2, prob: 50,
        desc: "Revive and fully restore HP of adjacent familiars."
    },
    377: {
        name: "Healing Bloom", type: 2, func: 18, calc: 4,
        arg1: 1,
        range: 21, prob: 70,
        desc: "Restore HP to self."
    },
    378: {
        name: "Blade Flurry", type: 2, func: 21, calc: 3,
        arg1: 1, arg2: 1, arg3: 0.3, arg4: 0.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to four random foes and sometimes lower ATK."
    },
    379: {
        name: "Dragon Aura", type: 2, func: 4, calc: 2,
        arg1: 1.9,
        range: 16, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to three random foes, ignoring position."
    },
    380: {
        name: "Feral Claws", type: 2, func: 3, calc: 3,
        arg1: 0.95,
        range: 17, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to six random foes."
    },
    381: {
        name: "Lion's Roar", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 6, arg3: 7,
        range: 3, prob: 70,
        desc: "Reduce magic and breath damages taken by self and adjacent familiars."
    },
    382: {
        name: "Laevateinn", type: 2, func: 3, calc: 1,
        arg1: 1.65,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to up to three foes."
    },
    383: {
        name: "Flame of Cinders", type: 2, func: 3, calc: 1,
        arg1: 1.65,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    385: {
        name: "Prominence", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    386: {
        name: "Sun's Mercy", type: 1, func: 1, calc: 0,
        arg1: 0.15, arg2: 1,
        range: 3, prob: 70,
        desc: "Raise ATK of self and adjacent familiars."
    },
    387: {
        name: "Earth's Fury", type: 2, func: 3, calc: 1,
        arg1: 1.35,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    388: {
        name: "Melody of Mercy", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 17, arg3: 1.25,
        range: 3, prob: 70,
        desc: "Raise HP of self and adjacent familiars at beginning of battle."
    },
    389: {
        name: "Mystic Light", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 121, prob: 50,
        desc: "Revive and fully restore HP of one random ally."
    },
    390: {
        name: "Libra's Retribution", type: 2, func: 3, calc: 1,
        arg1: 1.6,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    391: {
        name: "Scatter Arrow", type: 2, func: 4, calc: 3,
        arg1: 1.3,
        range: 32, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to up to four foes, ignoring position."
    },
    392: {
        name: "Aries' Strike", type: 2, func: 3, calc: 1,
        arg1: 1.2,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    393: {
        name: "Sidestep", type: 5, func: 27, calc: 0,
        arg1: 2, arg2: 3, arg3: 78, arg4: 79,
        range: 21, prob: 30,
        desc: "Evade enemy AGI-based attack skills."
    },
    394: {
        name: "Glance", type: 2, func: 4, calc: 2,
        arg1: 1.7,
        range: 15, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to all foes in the front/middle lines, ignoring position."
    },
    395: {
        name: "Imperial Audience", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 5, arg3: 0.45, arg4: 1,
        range: 7, prob: 70,
        desc: "Chance to silence up to three foes for one turn at the start of battle."
    },
    396: {
        name: "Venom Snare", type: 5, func: 28, calc: 7,
        arg1: 0.23, arg2: 1, arg3: 7, arg4: 3, arg5: 0.3,
        range: 21, prob: 30,
        desc: "Reflect ATK-based damage back to up to three foes."
    },
    397: {
        name: "Tarantella", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 2,
        range: 3, prob: 70,
        desc: "Raise DEF of self and adjacent familiars."
    },
    398: {
        name: "Knuckle Guard", type: 5, func: 12, calc: 0,
        arg1: 0,
        range: 4, prob: 50,
        desc: "Take damage in place of allies."
    },
    400: {
        name: "Hatred Blade", type: 2, func: 3, calc: 1,
        arg1: 1.15, arg2: 1, arg3: 0.3,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes and sometimes poison them."
    },
    401: {
        name: "Shield of Ruin", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 1, arg3: 0.5, arg4: 10,
        range: 7, prob: 70,
        desc: "Chance to poison up to three foes at the start of battle."
    },
    402: {
        name: "Tricksy Flames", type: 2, func: 4, calc: 2,
        arg1: 1.95,
        range: 12, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to all foes in the front line, ignoring position."
    },
    403: {
        name: "Flickering Flames", type: 5, func: 27, calc: 0,
        arg1: 2, arg2: 2, arg3: 78, arg4: 79,
        range: 21, prob: 50,
        desc: "Evade enemy WIS-based attack skills."
    },
    404: {
        name: "Niten Ichi-ryu", type: 2, func: 3, calc: 1,
        arg1: 1.75,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    405: {
        name: "Visions of Terror", type: 2, func: 4, calc: 2,
        arg1: 1.65, arg2: 1, arg3: 0.3,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to and sometimes poison four random foes, ignoring position."
    },
    406: {
        name: "Piercing Arrow", type: 2, func: 4, calc: 1,
        arg1: 1.35,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes, ignoring position."
    },
    407: {
        name: "Allure of the Rose", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to five random foes, ignoring position."
    },
    408: {
        name: "Covenant of the Rose", type: 1, func: 1, calc: 0,
        arg1: 0.15, arg2: 4,
        range: 3, prob: 70,
        desc: "Raise AGI of self and adjacent familiars at start of battle."
    },
    411: {
        name: "Winds of Lust", type: 2, func: 4, calc: 2,
        arg1: 2.1,
        range: 12, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to all foes in the front line, ignoring position."
    },
    412: {
        name: "Fires of Thirst", type: 2, func: 4, calc: 2,
        arg1: 1.2,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to five random foes, ignoring position."
    },
    414: {
        name: "Putrid Stench", type: 2, func: 4, calc: 2,
        arg1: 1.2, arg2: 1, arg3: 0.25,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to and sometimes poison five random foes, ignoring position."
    },
    415: {
        name: "Sigiled Sanctuary", type: 1, func: 1, calc: 0,
        arg1: 0.11, arg2: 3,
        range: 3, prob: 70,
        desc: "Raise WIS of self and adjacent familiars at start of battle."
    },
    416: {
        name: "Bone Smasher", type: 2, func: 4, calc: 2,
        arg1: 1.5,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    418: {
        name: "Nemesis", type: 2, func: 4, calc: 2,
        arg1: 2.1,
        range: 7, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to up to three foes, ignoring position."
    },
    419: {
        name: "Ichthocannon", type: 2, func: 4, calc: 2,
        arg1: 1.5,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    420: {
        name: "Breaking Wave", type: 2, func: 3, calc: 1,
        arg1: 1.35,
        range: 15, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes in the front/middle line."
    },
    421: {
        name: "Light of Virtue", type: 2, func: 4, calc: 2,
        arg1: 1.9, arg2: 3, arg3: 0.5,
        range: 16, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage and sometimes freeze three random foes, ignoring position."
    },
    422: {
        name: "Maiden's Prayer", type: 5, func: 29, calc: 0,
        arg1: 0, arg2: 0, arg3: 8, arg4: 1,
        range: 21, prob: 50,
        desc: "Remove the buffs of all foes after receiving an attack."
    },
    423: {
        name: "Wail of Sorrow", type: 1, func: 32, calc: 0,
        arg1: 0.2, arg2: 2,
        range: 7, prob: 70,
        desc: "Greatly lower DEF of up to three foes."
    },
    424: {
        name: "Ultrasonic", type: 2, func: 4, calc: 1,
        arg1: 1.85, arg2: 2, arg3: 0.2,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to and sometimes paralyze up to three foes."
    },
    425: {
        name: "Lese Majesty", type: 5, func: 14, calc: 1,
        arg1: 1.5,
        range: 4, prob: 50, ward: 1,
        desc: "Take damage in place of any ally and unleash a heavy counterattack."
    },
    426: {
        name: "Imperial Gift", type: 2, func: 18, calc: 4,
        arg1: 2,
        range: 21, prob: 50,
        desc: "Restore HP to self."
    },
    427: {
        name: "Funerary Rush", type: 2, func: 3, calc: 1,
        arg1: 1.5,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes."
    },
    428: {
        name: "Rematch", type: 16, func: 18, calc: 4,
        arg1: 0.5, arg2: 1,
        range: 122, prob: 70,
        desc: "Heal two random allies for half of their maximum HP upon death."
    },
    430: {
        name: "Broken Vow", type: 1, func: 32, calc: 0,
        arg1: 0.22, arg2: 3,
        range: 7, prob: 70,
        desc: "Greatly lower WIS of up to three foes."
    },
    431: {
        name: "Lovers' Arrows", type: 2, func: 4, calc: 2,
        arg1: 1.2,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    432: {
        name: "Spectrum", type: 2, func: 4, calc: 2,
        arg1: 2.25,
        range: 7, prob: 30, ward: 3,
        desc: "Deal massive WIS-based damage to up to three foes, ignoring position."
    },
    433: {
        name: "Deep Rumble", type: 2, func: 3, calc: 1,
        arg1: 0.95,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes."
    },
    434: {
        name: "Maelstrom", type: 2, func: 3, calc: 3,
        arg1: 1.45,
        range: 313, prob: 30, ward: 1,
        desc: "AGI-based damage to up to three foes. Increased if fewer foes."
    },
    435: {
        name: "Obedience", type: 2, func: 3, calc: 3,
        arg1: 1.5, arg2: 2, arg3: 0.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to and sometimes paralyze four random foes."
    },
    436: {
        name: "Troublemaker", type: 5, func: 28, calc: 7,
        arg1: 0.23, arg2: 3, arg3: 7, arg4: 3, arg5: 0.3,
        range: 21, prob: 50,
        desc: "Reflect AGI-based damage back to up to three foes."
    },
    438: {
        name: "Poison Torrent", type: 2, func: 3, calc: 1,
        arg1: 1.3, arg2: 1, arg3: 0.25,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to and sometimes poison four random foes."
    },
    440: {
        name: "Thunderstroke", type: 2, func: 4, calc: 3,
        arg1: 2,
        range: 23, prob: 30, ward: 2,
        desc: "Deal massive AGI-based damage to two random foes, ignoring position."
    },
    441: {
        name: "Bolt of Judgment", type: 2, func: 4, calc: 2,
        arg1: 2.15,
        range: 23, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to two random foes, ignoring position."
    },
    437: {
        name: "Mjolnir", type: 2, func: 4, calc: 1,
        arg1: 1.5,
        range: 32, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to up to four foes, ignoring position."
    },
    442: {
        name: "Masterstroke", type: 2, func: 4, calc: 1,
        arg1: 1.05,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes, ignoring position."
    },
    443: {
        name: "Fangs of the Devoted", type: 2, func: 3, calc: 3,
        arg1: 2,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive AGI-based damage to two random foes."
    },
    444: {
        name: "Cruel Swing", type: 2, func: 4, calc: 1,
        arg1: 1.45,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes, ignoring position."
    },
    445: {
        name: "Bastion", type: 3, func: 20, calc: 0,
        arg1: 0.1,
        range: 21, prob: 70,
        desc: "Survive devastating damage as long as HP is above 10%."
    },
    446: {
        name: "Tail Lash", type: 2, func: 4, calc: 2,
        arg1: 1.6,
        range: 32, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to up to four foes, ignoring position."
    },
    447: {
        name: "Looming Nightmare", type: 2, func: 4, calc: 2,
        arg1: 1.6,
        range: 32, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to up to four foes, ignoring position."
    },
    448: {
        name: "Leo's Claws", type: 2, func: 3, calc: 3,
        arg1: 1.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to four random foes."
    },
    449: {
        name: "Whirling Dervish", type: 2, func: 3, calc: 1,
        arg1: 1.8,
        range: 313, prob: 30, ward: 1,
        desc: "Heavy ATK-based damage to up to three foes. Increased if fewer foes."
    },
    450: {
        name: "Aquarius Unleashed", type: 2, func: 4, calc: 2,
        arg1: 1.25,
        range: 20, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to five random foes, ignoring position."
    },
    451: {
        name: "Endless Deluge", type: 1, func: 1, calc: 0,
        arg1: 452, arg2: 16,
        range: 101, prob: 70,
        desc: "One random ally is automatically revived with full HP after being killed."
    },
    452: {
        name: "Dawn's Tear", type: 16, func: 6, calc: 0,
        arg1: 1,
        range: 21, prob: 100
    },
    453: {
        name: "Shadow of Death", type: 2, func: 4, calc: 2,
        arg1: 1.65,
        range: 314, prob: 30, ward: 2,
        desc: "Heavy WIS-based damage to up to four foes. Increased if fewer foes."
    },
    454: {
        name: "Shadow of Confusion", type: 1, func: 31, calc: 0,
        arg1: 2, arg2: 2,
        range: 4, prob: 70,
        desc: "Order of attack is determined by WIS during the next two turns."
    },
    455: {
        name: "Berserker Rage", type: 2, func: 3, calc: 1,
        arg1: 0.85,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes."
    },
    456: {
        name: "Chain Lash", type: 1, func: 32, calc: 0,
        arg1: 0.5, arg2: 1,
        range: 7, prob: 70,
        desc: "Greatly lower ATK of up to three foes."
    },
    457: {
        name: "Brink of Death", type: 16, func: 4, calc: 1,
        arg1: 3.5,
        range: 5, prob: 70, ward: 1,
        desc: "Deal massive ATK-based damage, ignoring position, to one foe upon its death."
    },
    459: {
        name: "Fleet of Foot", type: 2, func: 4, calc: 3,
        arg1: 1.3,
        range: 8, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to all foes, ignoring position."
    },
    460: {
        name: "Void Strike", type: 16, func: 19, calc: 0,
        arg1: 0, arg2: 5, arg3: 0.6, arg4: 1,
        range: 8, prob: 70,
        desc: "High chance to silence all foes for one turn upon his death."
    },
    461: {
        name: "Lion's Wrath", type: 2, func: 3, calc: 1,
        arg1: 1.35,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes."
    },
    462: {
        name: "Heroic Might", type: 2, func: 18, calc: 4,
        arg1: 2,
        range: 113, prob: 50,
        desc: "Restore HP to three random familiars."
    },
    463: {
        name: "Absolute Zero", type: 2, func: 4, calc: 2,
        arg1: 1.7, arg2: 3, arg3: 0.25,
        range: 32, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage and sometimes freeze up to four foes, ignoring position."
    },
    464: {
        name: "Chariot Rush", type: 2, func: 3, calc: 3,
        arg1: 1.8, arg2: 2, arg3: 0.3,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to and sometimes paralyze three random foes."
    },
    465: {
        name: "Stormcaller Pinion", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 20, prob: 30, ward: 3,
        desc: "Deal WIS-based damage to five random foes, ignoring position."
    },
    466: {
        name: "Blade of Judgment", type: 2, func: 4, calc: 1,
        arg1: 1.8,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to four random foes, ignoring position."
    },
    467: {
        name: "Atonement", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 5, arg3: 7,
        range: 4, prob: 70,
        desc: "Reduce physical and breath damages taken by all familiars."
    },
    468: {
        name: "Rain of Death", type: 2, func: 3, calc: 1,
        arg1: 1.7, arg2: 1, arg3: 0.25, arg4: 10,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage and sometimes envenom three random foes."
    },
    469: {
        name: "Sand Blade", type: 2, func: 21, calc: 1,
        arg1: 1.2, arg2: 1, arg3: 0.3, arg4: 0.3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes and sometimes reduce ATK."
    },
    471: {
        name: "Darkflame", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    472: {
        name: "Nightveil", type: 1, func: 1, calc: 0,
        arg1: 0.1, arg2: 1, arg3: 3,
        range: 3, prob: 70,
        desc: "Raise WIS and ATK of self and adjacent familiars at start of battle."
    },
    473: {
        name: "Entomb", type: 2, func: 3, calc: 1,
        arg1: 1.15,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    474: {
        name: "Embalm", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 5,
        range: 3, prob: 70,
        desc: "Reduce physical damage taken by self and adjacent familiars."
    },
    475: {
        name: "Hand of Fortune", type: 2, func: 24, calc: 0,
        randSkills: [
            11, 16, 20, 26, 33, 34, 109, 110, 114, 116, 138, 145, 218, 232, 264, 274, 277, 287,
            296, 319, 331, 345, 346, 354, 378, 426, 431, 462],
        range: 21, prob: 50,
        desc: "The outcome of this skill depends on the user's Fortune."
    },
    476: {
        name: "Furious Horns", type: 2, func: 4, calc: 2,
        arg1: 2,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive WIS-based damage to three random foes, ignoring position."
    },
    477: {
        name: "Chatter Tooth", type: 2, func: 4, calc: 2,
        arg1: 1.5, arg2: 3, arg3: 0.3,
        range: 32, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage and sometimes freeze up to four foes, ignoring position."
    },
    478: {
        name: "Cancer's Claws", type: 2, func: 3, calc: 1,
        arg1: 1.65, arg2: 5, arg3: 0.5, arg4: 1,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage and sometimes silence three random foes."
    },
    479: {
        name: "Infiltrate", type: 1, func: 1, calc: 0,
        arg1: 1, arg2: 18, arg3: 0, arg4: 0,
        range: 121, prob: 70,
        desc: "Allows a random ally to perform an extra action during the next turn."
    },
    480: {
        name: "Rasteira", type: 2, func: 3, calc: 3,
        arg1: 1.5,
        range: 314, prob: 30, ward: 1,
        desc: "Heavy AGI-based damage to up to four foes. Increased if fewer foes."
    },
    481: {
        name: "Macaco", type: 6, func: 27, calc: 0,
        arg1: 2, arg2: 9, arg3: 78, arg4: 79,
        range: 21, prob: 50,
        desc: "Evade enemy ATK-based and AGI-based attack skills."
    },
    482: {
        name: "Souldrain Fangs", type: 2, func: 36, calc: 3,
        arg1: 1.75, arg2: 0.2, arg3: 27, arg4: 21,
        range: 7, prob: 30, ward: 1,
        desc: "Drains HP from up to three foes while dealing heavy AGI-based damage."
    },
    483: {
        name: "Spearhead", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 7, arg3: 0.4, arg4: 1, arg5: 1,
        range: 7, prob: 70,
        desc: "Chance to blind up to three foes at start of battle."
    },
    484: {
        name: "Wall of the Brave", type: 5, func: 12, calc: 0,
        arg1: 0,
        range: 4, prob: 50,
        desc: "Take damage in place of allies."
    },
    485: {
        name: "Shield of the Coward", type: 1, func: 1, calc: 0,
        arg1: 1, arg2: 2,
        range: 21, prob: 70,
        desc: "Raise DEF of self at start of battle."
    },
    487: {
        name: "Dance of Farewell", type: 2, func: 4, calc: 2,
        arg1: 1.1,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    488: {
        name: "Dance of Reunion", type: 16, func: 6, calc: 0,
        arg1: 1,
        range: 121, prob: 50,
        desc: "Revives one random ally upon her death."
    },
    489: {
        name: "Hardened Steel", type: 1, func: 1, calc: 0,
        arg1: 0.7, arg2: 5,
        range: 21, prob: 70,
        desc: "Reduce physical damage taken by self greatly."
    },
    490: {
        name: "Steel Hooves", type: 2, func: 3, calc: 1,
        arg1: 1.2,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    491: {
        name: "Primitive Rage", type: 2, func: 3, calc: 1,
        arg1: 1.35,
        range: 32, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to up to four foes."
    },
    492: {
        name: "Razor Pinion", type: 2, func: 4, calc: 1,
        arg1: 1.75,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to four random foes, ignoring position."
    },
    493: {
        name: "Big Game Hunt", type: 2, func: 3, calc: 3,
        arg1: 1.25,
        range: 314, prob: 30, ward: 1,
        desc: "AGI-based damage to up to four foes. Increased if fewer foes."
    },
    494: {
        name: "Hand of Justice", type: 2, func: 4, calc: 2,
        arg1: 1.65,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    495: {
        name: "Soul Prison", type: 1, func: 32, calc: 0,
        arg1: 0.25, arg2: 4,
        range: 7, prob: 70,
        desc: "Greatly lower AGI of up to three foes."
    },
    496: {
        name: "Flame Cloud", type: 2, func: 4, calc: 2,
        arg1: 2.05,
        range: 16, prob: 30, ward: 3,
        desc: "Deal massive WIS-based damage to three random foes, ignoring position."
    },
    497: {
        name: "Mighty Stomp", type: 2, func: 4, calc: 1,
        arg1: 2,
        range: 16, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to three random foes, ignoring position."
    },
    499: {
        name: "Snake Whip", type: 2, func: 4, calc: 1,
        arg1: 1.5,
        range: 20, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to five random foes, ignoring position."
    },
    500: {
        name: "Spiny Carapace", type: 3, func: 13, calc: 1,
        arg1: 1.2,
        range: 21, prob: 50, ward: 1,
        desc: "Chance to unleash a counter attack when struck."
    },
    501: {
        name: "Dragon Strike", type: 2, func: 22, calc: 1,
        arg1: 1.65, arg2: 2, arg3: 0.3, arg4: 0.3,
        range: 19, prob: 30, ward: 2,
        desc: "Heavy ATK-based damage to four random foes and sometimes lower DEF, ignoring position."
    },
    502: {
        name: "Flashing Blade", type: 2, func: 3, calc: 3,
        arg1: 1.6,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to three random foes."
    },
    503: {
        name: "Wing Aegis", type: 3, func: 20, calc: 0,
        arg1: 0.15,
        range: 21, prob: 70,
        desc: "Survive devastating damage as long as HP is above 15%."
    },
    504: {
        name: "Defender's Thunder", type: 2, func: 4, calc: 3,
        arg1: 2.3, arg2: 2, arg3: 0.35,
        range: 16, prob: 30, ward: 2,
        desc: "Deal massive AGI-based damage, sometimes paralyze three random foes, ignoring position."
    },
    505: {
        name: "Fires of Perdition", type: 2, func: 22, calc: 1,
        arg1: 1.3, arg2: 3, arg3: 0.3, arg4: 0.3,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes, sometimes lowering WIS, ignoring position."
    },
    506: {
        name: "Winds of Perdition", type: 2, func: 4, calc: 2,
        arg1: 1.85,
        range: 313, prob: 30, ward: 2,
        desc: "Heavy WIS-based damage to up to three foes, ignoring position. Increased if fewer foes."
    },
    507: {
        name: "Sagittarius' Arrow", type: 2, func: 4, calc: 3,
        arg1: 1.2,
        range: 20, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to five random foes."
    },
    508: {
        name: "Sage's Wisdom", type: 1, func: 1, calc: 0,
        arg1: 0.5, arg2: 6,
        range: 3, prob: 70,
        desc: "Reduce magic damage taken by self and adjacent familiars."
    },
    509: {
        name: "Atrocity", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 4, arg3: 0.3,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to and sometimes disable all foes."
    },
    510: {
        name: "Bedazzle", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 7, arg3: 0.4, arg4: 2, arg5: 0.7,
        range: 7, prob: 70,
        desc: "Chance to blind up to three foes for 2 turns at start of battle."
    },
    511: {
        name: "Twin Arrow", type: 2, func: 4, calc: 1,
        arg1: 2.1,
        range: 6, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to up to two foes, ignoring position."
    },
    512: {
        name: "Fists of Gemini", type: 2, func: 4, calc: 1,
        arg1: 2.1,
        range: 6, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to up to two foes, ignoring position."
    },
    513: {
        name: "Goblet of Truth", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 5, arg3: 0.3, arg4: 1,
        range: 8, prob: 70,
        desc: "Chance to silence all foes for one turn at the start of battle."
    },
    514: {
        name: "Fragarach", type: 2, func: 4, calc: 2,
        arg1: 1.95,
        range: 313, prob: 30, ward: 2,
        desc: "Heavy WIS-based damage to up to three foes, ignoring position. Increased if fewer foes."
    },
    515: {
        name: "The Sea's Favor", type: 2, func: 37, calc: 2,
        arg1: 2.85, arg2: 0.4, arg3: 27, arg4: 21,
        range: 6, prob: 30, ward: 2,
        desc: "Drains HP from up to two foes while dealing massive WIS-based damage, ignoring position."
    },
    516: {
        name: "Enthrall", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 3, arg3: 0.15,
        range: 7, prob: 70,
        desc: "Chance to freeze up to three foes at start of battle."
    },
    518: {
        name: "Sabre Dance", type: 2, func: 3, calc: 1,
        arg1: 1.45,
        range: 314, prob: 30, ward: 1,
        desc: "ATK-based damage to up to four foes. Increased if fewer foes."
    },
    519: {
        name: "The Sea's Fury", type: 2, func: 4, calc: 3,
        arg1: 2.2,
        range: 32, prob: 30, ward: 2,
        desc: "Deal massive AGI-based damage to up to four foes, ignoring position."
    },
    520: {
        name: "Tentacle Lash", type: 2, func: 4, calc: 1,
        arg1: 1.95,
        range: 16, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to three random foes, ignoring position."
    },
    521: {
        name: "Horn Rush", type: 2, func: 3, calc: 1,
        arg1: 1.45, arg2: 1, arg3: 0.4, arg4: 10,
        range: 314, prob: 30, ward: 1,
        desc: "ATK-based damage to and sometimes poison up to four foes. Increased if fewer foes."
    },
    522: {
        name: "Flash of Silver", type: 2, func: 3, calc: 3,
        arg1: 1.25,
        range: 20, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to five random foes."
    },
    523: {
        name: "Glittering Scales", type: 5, func: 29, calc: 0,
        arg1: 0, arg2: 0, arg3: 8, arg4: 1,
        range: 21, prob: 50,
        desc: "Remove the buffs of all foes after receiving an attack."
    },
    524: {
        name: "Twin-Tail Strike", type: 2, func: 34, calc: 1,
        arg1: 1.35, arg2: 1, arg3: 0.5, arg4: 0.2,
        range: 8, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to all foes and sometimes greatly lower ATK, ignoring position."
    },
    525: {
        name: "Spirit-Candles", type: 2, func: 4, calc: 3,
        arg1: 1.45,
        range: 19, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to four random foes, ignoring position."
    },
    527: {
        name: "Water Blade", type: 2, func: 3, calc: 3,
        arg1: 1.45,
        range: 19, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to four random foes."
    },
    528: {
        name: "Wall of Water", type: 1, func: 1, calc: 0,
        arg1: 0.1, arg2: 4,
        range: 3, prob: 70,
        desc: "Raise AGI of self and adjacent familiars at start of battle."
    },
    529: {
        name: "Waterslice Claws", type: 2, func: 4, calc: 2,
        arg1: 1.7,
        range: 19, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to four random foes, ignoring position."
    },
    530: {
        name: "Gift of the Lair", type: 1, func: 1, calc: 0,
        arg1: 0.1, arg2: 3,
        range: 3, prob: 70,
        desc: "Raise WIS of self and adjacent familiars at start of battle."
    },
    532: {
        name: "Purging Flame", type: 2, func: 3, calc: 1,
        arg1: 1.7,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to up to three foes."
    },
    533: {
        name: "Boon of the Sea", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 3, arg3: 4,
        range: 4, prob: 70,
        desc: "Raise WIS and AGI of all party members."
    },
    534: {
        name: "Lava Torrent", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 8, arg3: 0.5, arg4: 3000,
        range: 7, prob: 70,
        desc: "Chance to burn up to three foes at start of battle."
    },
    535: {
        name: "Eruption", type: 2, func: 4, calc: 2,
        arg1: 1.75,
        range: 15, prob: 30, ward: 3,
        desc: "Deal heavy WIS-based damage to front/middle lines, ignoring position."
    },
    536: {
        name: "Arboreal Succor", type: 2, func: 40, calc: 0,
        range: 4, prob: 70,
        desc: "Remove the debuffs of self and all allies."
    },
    538: {
        name: "Bronze Fist", type: 2, func: 4, calc: 2,
        arg1: 1.5,
        range: 8, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to all foes, ignoring position."
    },
    539: {
        name: "Clockwork Guardian", type: 16, func: 1, calc: 0,
        arg1: 0.5, arg2: 5,
        range: 122, prob: 70,
        desc: "Reduce physical damage taken by two random allies upon her death."
    },
    540: {
        name: "Mercy of the Star", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 17, arg3: 1.5,
        range: 3, prob: 70,
        desc: "Raise HP of self and adjacent familiars at beginning of battle."
    },
    541: {
        name: "Tears of the Star", type: 2, func: 18, calc: 4,
        arg1: 1, arg2: 1,
        range: 132, prob: 70,
        desc: "Full restore HP of two party members."
    },
    542: {
        name: "Rampart Destroyer", type: 2, func: 3, calc: 1,
        arg1: 1.6,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to four random foes."
    },
    543: {
        name: "Devotion", type: 2, func: 6, calc: 0,
        arg1: 1,
        range: 2, prob: 50,
        desc: "Revive and fully restore HP of adjacent familiars."
    },
    544: {
        name: "Tail of the Scorpion", type: 2, func: 3, calc: 3,
        arg1: 1.05, arg2: 1, arg3: 0.3, arg4: 10,
        range: 20, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to and sometimes envenom five random foes."
    },
    545: {
        name: "Whirl of Claws", type: 2, func: 3, calc: 1,
        arg1: 1.1,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    546: {
        name: "Death's March", type: 2, func: 36, calc: 1,
        arg1: 1.85, arg2: 0.4, arg3: 27, arg4: 21,
        range: 23, prob: 30, ward: 1,
        desc: "Drains HP from two random foes while dealing heavy ATK-based damage."
    },
    547: {
        name: "Death's Hunt", type: 2, func: 7, calc: 3,
        arg1: 1.8, arg2: 0.1,
        range: 23, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to two random foes. Chance to kill target."
    },
    548: {
        name: "Cannon Barrage", type: 2, func: 4, calc: 1,
        arg1: 1.75,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to four random foes, ignoring position."
    },
    549: {
        name: "Bond en Avant", type: 2, func: 21, calc: 3,
        arg1: 0.85, arg2: 4, arg3: 0.6, arg4: 0.3,
        range: 17, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to six random foes and sometimes reduce AGI."
    },
    550: {
        name: "Judgment of the Sea", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 208, prob: 30, ward: 2,
        desc: "WIS-based damage to all foes, ignoring position. Increased if fewer foes."
    },
    551: {
        name: "Moonlight", type: 1, func: 1, calc: 0,
        arg1: 0.4, arg2: 8,
        range: 21, prob: 70,
        desc: "Raise the skill trigger rate of self by 40%."
    },
    552: {
        name: "Crescent Edge", type: 2, func: 3, calc: 1,
        arg1: 2.6,
        range: 23, prob: 30, ward: 1,
        desc: "Deal massive ATK-based damage to two random foes."
    },
    553: {
        name: "Wrath of Taurus", type: 2, func: 3, calc: 1,
        arg1: 0.9,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes."
    },
    554: {
        name: "Heart of Taurus", type: 1, func: 1, calc: 1,
        arg1: 1, arg2: 17, arg3: 1.5,
        range: 21, prob: 70,
        desc: "Raise HP of self at start of battle, based on 100% of his ATK."
    },
    555: {
        name: "Shredding Claws", type: 2, func: 3, calc: 3,
        arg1: 1.55,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to four random foes."
    },
    556: {
        name: "Scorching Tornado", type: 2, func: 33, calc: 1,
        arg1: 1.25, arg2: 2, arg3: 0.4, arg4: 0.3,
        range: 19, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to four random foes and sometimes greatly lower DEF."
    },
    558: {
        name: "Blade of Conquest", type: 2, func: 3, calc: 1,
        arg1: 0.95,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes."
    },
    559: {
        name: "Grace of the Goddess", type: 1, func: 1, calc: 0,
        arg1: 0.3, arg2: 1, arg3: 2,
        range: 3, prob: 70,
        desc: "Raise ATK and DEF of self and adjacent familiars."
    },
    560: {
        name: "Yalli of the Blade", type: 2, func: 3, calc: 1,
        arg1: 1.15,
        range: 20, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to five random foes."
    },
    561: {
        name: "Affection", type: 1, func: 1, calc: 0,
        arg1: 0.2, arg2: 1,
        range: 3, prob: 70,
        desc: "Raise ATK of self and adjacent familiars."
    },
    562: {
        name: "Hewing Rood", type: 3, func: 13, calc: 1,
        arg1: 1.5,
        range: 21, prob: 50, ward: 1,
        desc: "Chance to unleash a counter attack when struck."
    },
    563: {
        name: "Ablution", type: 1, func: 1, calc: 0,
        arg1: 0.7, arg2: 2, arg3: 3,
        range: 21, prob: 70,
        desc: "Raise DEF and WIS of self."
    },
    564: {
        name: "Rites of the Shikigami", type: 2, func: 4, calc: 2,
        arg1: 1.65,
        range: 314, prob: 30, ward: 2,
        desc: "Heavy WIS-based damage to up to four foes. Increased if fewer foes."
    },
    565: {
        name: "Pierce the Veil", type: 3, func: 38, calc: 6,
        arg1: 0, arg2: 1, arg3: 0, arg4: 60, arg5: 5,
        range: 7, prob: 50,
        desc: "Greatly lower ATK of up to three foes when being attacked."
    },
    566: {
        name: "Divine Compass", type: 1, func: 32, calc: 0,
        arg1: 0.1, arg2: 3,
        range: 8, prob: 70,
        desc: "Greatly lower WIS of all foes."
    },
    568: {
        name: "Scorching Wing", type: 2, func: 3, calc: 3,
        arg1: 0.9, arg2: 3, arg3: 0.3,
        range: 17, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to six random foes and sometimes freeze them."
    },
    569: {
        name: "Fallen Wing", type: 16, func: 16, calc: 0,
        range: 8, prob: 70,
        desc: "Remove the buffs of all foes upon his death."
    },
    570: {
        name: "Glaring Sunlight", type: 2, func: 4, calc: 2,
        arg1: 1.6, arg2: 7, arg3: 0.35, arg4: 2, arg5: 0.9,
        range: 8, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to all foes  and sometimes blind them, ignoring position."
    },
    571: {
        name: "Corona", type: 1, func: 1, calc: 0,
        arg1: 0.35, arg2: 5, arg3: 6,
        range: 3, prob: 70,
        desc: "Reduce physical and magic damages taken by self and adjacent familiars."
    },
    572: {
        name: "Venomflame", type: 2, func: 4, calc: 2,
        arg1: 2.3, arg2: 3, arg3: 0.4,
        range: 16, prob: 30, ward: 3,
        desc: "Deal massive WIS-based damage, sometimes freeze three random foes, ignoring position."
    },
    573: {
        name: "Blare of Judgment", type: 2, func: 4, calc: 2,
        arg1: 1.15, arg2: 5, arg3: 0.3, arg4: 1,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage and sometimes silence six random foes, ignoring position."
    },
    574: {
        name: "Winding Brass", type: 2, func: 3, calc: 3,
        arg1: 1.15, arg2: 2, arg3: 0.2,
        range: 8, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to all foes and sometimes paralyze targets."
    },
    577: {
        name: "Triple Tails", type: 2, func: 3, calc: 3,
        arg1: 1.5,
        range: 7, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to up to three foes."
    },
    578: {
        name: "Divine Mace", type: 5, func: 14, calc: 1,
        arg1: 1.6,
        range: 4, prob: 50, ward: 1,
        desc: "Take damage in place of any ally and unleash a heavy counterattack."
    },
    579: {
        name: "Intoxicate", type: 2, func: 4, calc: 1,
        arg1: 1.5,
        range: 8, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to all foes, ignoring position."
    },
    580: {
        name: "Flurry of Fangs", type: 2, func: 4, calc: 2,
        arg1: 1.6,
        range: 314, prob: 30, ward: 2,
        desc: "Heavy WIS-based damage to up to four foes. Increased if fewer foes."
    },
    581: {
        name: "Sacred Offering", type: 1, func: 32, calc: 0,
        arg1: 0.2, arg2: 2,
        range: 8, prob: 70,
        desc: "Greatly lower DEF of all foes."
    },
    582: {
        name: "Crumble", type: 2, func: 4, calc: 2,
        arg1: 1.4, arg2: 8, arg3: 0.4, arg4: 2000,
        range: 20, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage and sometimes burn five random foes, ignoring position."
    },
    585: {
        name: "Death's Call", type: 2, func: 34, calc: 2,
        arg1: 1.6, arg2: 3, arg3: 0.4, arg4: 0.2,
        range: 19, prob: 30, ward: 2,
        desc: "Heavy WIS-based damage to four random foes and sometimes greatly lower WIS."
    },
    588: {
        name: "Tranquil Death", type: 2, func: 4, calc: 3,
        arg1: 1.45,
        range: 20, prob: 30, ward: 2,
        desc: "Deal AGI-based damage to five random foes, ignoring position."
    },
    589: {
        name: "Unbridle", type: 1, func: 1, calc: 0,
        arg1: 1, arg2: 18,
        range: 21, prob: 70,
        desc: "Allows self to perform an extra action during the next turn."
    },
    590: {
        name: "Macana Slash", type: 2, func: 3, calc: 3,
        arg1: 1.05,
        range: 20, prob: 30, ward: 1,
        desc: "Deal AGI-based damage to five random foes."
    },
    591: {
        name: "Glittering Jade", type: 1, func: 1, calc: 0,
        arg1: 0.15, arg2: 4,
        range: 3, prob: 70,
        desc: "Raise AGI of self and adjacent familiars."
    },
    594: {
        name: "Holy Lash", type: 2, func: 37, calc: 1,
        arg1: 1.9, arg2: 0.2, arg3: 27, arg4: 21,
        range: 12, prob: 30, ward: 1,
        desc: "Heavy ATK-based damage and drain HP from all foes in the front line, ignoring position."
    },
    595: {
        name: "Shadow Whip", type: 1, func: 19, calc: 0,
        arg1: 0, arg2: 7, arg3: 0.2, arg4: 1, arg5: 0.9,
        range: 7, prob: 70,
        desc: "Chance to blind up to three foes for one turn at start of battle."
    },
    596: {
        name: "Masquerade", type: 2, func: 4, calc: 2,
        arg1: 0.75,
        range: 17, prob: 30, ward: 2,
        desc: "Deal WIS-based damage to six random foes, ignoring position."
    },
    597: {
        name: "Runaway Chariot", type: 2, func: 3, calc: 3,
        arg1: 1.35,
        range: 314, prob: 30, ward: 1,
        desc: "AGI-based damage to up to four foes. Increased if fewer foes."
    },
    598: {
        name: "Entangle", type: 16, func: 32, calc: 0,
        arg1: 0.15, arg2: 4,
        range: 8, prob: 70,
        desc: "Greatly lower AGI of all foes upon his death."
    },
    599: {
        name: "Poisoned Wine", type: 2, func: 4, calc: 1,
        arg1: 1.2, arg2: 4, arg3: 0.3,
        range: 17, prob: 30, ward: 1,
        desc: "Deal ATK-based damage to six random foes and sometimes disable them, ignoring position."
    },
    600: {
        name: "Poison-Laced Hood", type: 3, func: 41, calc: 1,
        arg1: 1.8, arg2: 1, arg3: 1, arg4: 20,
        range: 21, prob: 50, ward: 1,
        desc: "Chance of poisonous counter attack (20% of max HP) when struck, ignoring position."
    },
    601: {
        name: "Veil of Night", type: 2, func: 3, calc: 3,
        arg1: 1.85,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy AGI-based damage to four random foes."
    },
    602: {
        name: "Cake Cutting", type: 2, func: 3, calc: 1,
        arg1: 1.15, arg2: 1, arg3: 1, arg4: 10,
        range: 20, prob: 30, ward: 1,
        desc: "Deal venomous ATK-based damage to five random foes."
    },
    603: {
        name: "Bandage Garotte", type: 2, func: 37, calc: 1,
        arg1: 2.05, arg2: 0.15, arg3: 27, arg4: 21,
        range: 16, prob: 30, ward: 1,
        desc: "Massive ATK-based damage and drain HP from three random foes, ignoring position."
    },
    604: {
        name: "Blindside", type: 2, func: 4, calc: 2,
        arg1: 1.9,
        range: 16, prob: 30, ward: 2,
        desc: "Deal heavy WIS-based damage to three random foes, ignoring position."
    },
    605: {
        name: "Bone Shatter", type: 2, func: 3, calc: 1,
        arg1: 1.6,
        range: 19, prob: 30, ward: 1,
        desc: "Deal heavy ATK-based damage to four random foes."
    },
    606: {
        name: "Overawe", type: 5, func: 28, calc: 7,
        arg1: 0.45, arg2: 10, arg3: 23, arg4: 3, arg5: 0.1,
        range: 21, prob: 50,
        desc: "Reflect 90% of AGI/WIS-based damage back to two random foes."
    },
    607: {
        name: "Breath of Darkness", type: 2, func: 4, calc: 2,
        arg1: 1.35, arg2: 8, arg3: 0.4, arg4: 2500,
        range: 8, prob: 30, ward: 3,
        desc: "Deal WIS-based damage to all foes and sometimes burn targets, ignoring position."
    },
    10001: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10003: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10004: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1.05, arg2: 2, arg3: 0.2,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage, sometimes paralyzing target."
    },
    10005: {
        name: "Standard Action", type: 2, func: 4, calc: 1,
        arg1: 1,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10006: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1.05,
        range: 16, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to three random foes."
    },
    10007: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10008: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 0.65,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10009: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 3, arg3: 0.1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage and sometimes freeze target."
    },
    10010: {
        name: "Standard Action", type: 2, func: 4, calc: 1,
        arg1: 1.1,
        range: 7, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage up to three foes."
    },
    10011: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10012: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 1, arg3: 0.4,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and sometimes poison target."
    },
    10014: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 2, arg3: 0.4,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage, sometimes paralyzing target."
    },
    10015: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10016: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10017: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 1, arg3: 0.4, arg4: 10,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and sometimes envenom target."
    },
    10018: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10019: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 3, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10020: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 0.6,
        range: 23, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to two random foes."
    },
    10021: {
        name: "Standard Action", type: 2, func: 4, calc: 1,
        arg1: 1.2,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10022: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10023: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10024: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 4, arg3: 0.35,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and sometimes disable target."
    },
    10025: {
        name: "Standard Action", type: 2, func: 34, calc: 1,
        arg1: 1.2, arg2: 4, arg3: 0.3, arg4: 0.2,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and sometimes greatly lower AGI of target."
    },
    10026: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1.3, arg2: 2, arg3: 0.5,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage, 50% chance to paralyze."
    },
    10027: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 0.7, arg2: 5, arg3: 0.4, arg4: 1,
        range: 23, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to two random foes. 40% chance to silence."
    },
    10028: {
        name: "Standard Action", type: 2, func: 7, calc: 1,
        arg1: 1, arg2: 0.1,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage. Chance to kill target."
    },
    10029: {
        name: "Standard Action", type: 2, func: 4, calc: 1,
        arg1: 1.2,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10030: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 6, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to up to two foes."
    },
    10031: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    },
    10032: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 7, arg3: 0.35, arg4: 2, arg5: 0.9,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage and sometimes blind target."
    },
    10033: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1,
        range: 23, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to two random foes."
    },
    10034: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1.4,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10035: {
        name: "Standard Action", type: 2, func: 4, calc: 1,
        arg1: 1.3,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10036: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1, arg2: 8, arg3: 0.4, arg4: 2000,
        range: 5, prob: 100, ward: 2, isAutoAttack: true,
        desc: "WIS-based damage and sometimes burn target."
    },
    10037: {
        name: "Standard Action", type: 2, func: 4, calc: 1,
        arg1: 1, arg2: 1, arg3: 0.5, arg4: 15,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and sometimes envenom target."
    },
    10038: {
        name: "Standard Action", type: 2, func: 36, calc: 1,
        arg1: 1, arg2: 0.4, arg3: 27, arg4: 21,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and drain HP from target."
    },
    10039: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1, arg2: 1, arg3: 0.5, arg4: 15,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and sometimes envenom target."
    },
    10040: {
        name: "Standard Action", type: 2, func: 37, calc: 1,
        arg1: 1, arg2: 0.2, arg3: 27, arg4: 21,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage and drain HP from target."
    },
    10041: {
        name: "Standard Action", type: 2, func: 3, calc: 1,
        arg1: 1.2,
        range: 5, prob: 100, ward: 1, isAutoAttack: true,
        desc: "ATK-based damage to one foe."
    },
    10042: {
        name: "Standard Action", type: 2, func: 4, calc: 2,
        arg1: 1.3,
        range: 5, prob: 100, ward: 3, isAutoAttack: true,
        desc: "WIS-based damage to one foe."
    }
};
var SkillLogicFactory = (function () {
    function SkillLogicFactory() {
    }
    SkillLogicFactory.getSkillLogic = function (skillFunc) {
        switch (skillFunc) {
            case 1 /* BUFF */:
                return new BuffSkillLogic();
            case 2 /* DEBUFF */:
            case 32 /* CASTER_BASED_DEBUFF */:
                return new DebuffSkillLogic();
            case 38 /* ONHIT_DEBUFF */:
                return new OnHitDebuffSkillLogic();
            case 16 /* DISPELL */:
                return new DispellSkillLogic();
            case 19 /* AFFLICTION */:
                return new AfflictionSkillLogic();
            case 3 /* ATTACK */:
            case 4 /* MAGIC */:
            case 21 /* DEBUFFATTACK */:
            case 22 /* DEBUFFINDIRECT */:
            case 36 /* DRAIN_ATTACK */:
            case 37 /* DRAIN_MAGIC */:
            case 33 /* CASTER_BASED_DEBUFF_ATTACK */:
            case 34 /* CASTER_BASED_DEBUFF_MAGIC */:
            case 7 /* KILL */:
                return new AttackSkillLogic();
            case 12 /* PROTECT */:
                return new ProtectSkillLogic();
            case 27 /* EVADE */:
                return new EvadeSkillLogic();
            case 14 /* PROTECT_COUNTER */:
                return new ProtectCounterSkillLogic();
            case 28 /* PROTECT_REFLECT */:
                return new ProtectReflectSkillLogic();
            case 13 /* COUNTER */:
            case 41 /* COUNTER_INDIRECT */:
                return new CounterSkillLogic();
            case 29 /* COUNTER_DISPELL */:
                return new CounterDispellSkillLogic();
            case 40 /* CLEAR_DEBUFF */:
                return new ClearDebuffSkillLogic();
            case 11 /* DRAIN */:
                return new DrainSkillLogic();
            case 20 /* SURVIVE */:
                return new SurviveSkillLogic();
            case 18 /* HEAL */:
                return new HealSkillLogic();
            case 6 /* REVIVE */:
                return new ReviveSkillLogic();
            case 31 /* TURN_ORDER_CHANGE */:
                return new TurnOrderChangeSkillLogic();
            case 24 /* RANDOM */:
                return new RandomSkillLogic();
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
    SkillLogic.prototype.willBeExecuted = function (data) {
        var deadCond = (data.skill.skillType === 16 /* ACTION_ON_DEATH */) || (!data.executor.isDead && data.skill.skillType !== 16 /* ACTION_ON_DEATH */);

        if (data.noProbCheck) {
            var probCond = true;
        } else {
            probCond = (Math.random() * 100) <= (data.skill.maxProbability + data.executor.status.skillProbability * 100 + data.executor.bcAddedProb);
        }

        return (deadCond && data.executor.canAttack() && data.executor.canUseSkill() && probCond);
    };

    SkillLogic.prototype.execute = function (data) {
        throw new Error("Implement this");
    };

    SkillLogic.prototype.clearAllCardsDamagePhaseData = function () {
        var allCards = this.cardManager.getAllCurrentMainCards();
        for (var i = 0; i < allCards.length; i++) {
            allCards[i].clearDamagePhaseData();
        }
    };
    return SkillLogic;
})();

var BuffSkillLogic = (function (_super) {
    __extends(BuffSkillLogic, _super);
    function BuffSkillLogic() {
        _super.apply(this, arguments);
    }
    BuffSkillLogic.prototype.willBeExecuted = function (data) {
        var hasTarget = data.skill.range.hasValidTarget(data.executor);
        return _super.prototype.willBeExecuted.call(this, data) && hasTarget;
    };

    BuffSkillLogic.prototype.execute = function (data) {
        var skill = data.skill;
        var executor = data.executor;
        skill.getReady(executor);

        if (skill.skillFuncArg2 != 9 /* ALL_STATUS */) {
            var statusToBuff = [skill.skillFuncArg2];

            if (skill.skillFuncArg3 != 0 && skill.skillFuncArg2 != 17 /* HP_SHIELD */) {
                statusToBuff.push(skill.skillFuncArg3);
            }
        } else {
            statusToBuff = [1 /* ATK */, 2 /* DEF */, 3 /* WIS */, 4 /* AGI */];
        }

        var basedOnStatType = ENUM.SkillCalcType[skill.skillCalcType];
        var baseStat = executor.getStat(basedOnStatType);

        var target;
        while (target = skill.getTarget(executor)) {
            for (var j = 0; j < statusToBuff.length; j++) {
                var statusType = statusToBuff[j];

                switch (statusType) {
                    case 1 /* ATK */:
                    case 2 /* DEF */:
                    case 3 /* WIS */:
                    case 4 /* AGI */:
                        if (skill.skillRange == 3 /* SELF_BOTH_SIDES */) {
                            baseStat = executor.getStat(basedOnStatType);
                        }
                        var skillMod = skill.skillFuncArg1;
                        var buffAmount = Math.round(skillMod * baseStat);
                        break;
                    case 5 /* ATTACK_RESISTANCE */:
                    case 6 /* MAGIC_RESISTANCE */:
                    case 7 /* BREATH_RESISTANCE */:
                    case 8 /* SKILL_PROBABILITY */:
                    case 18 /* WILL_ATTACK_AGAIN */:
                    case 16 /* ACTION_ON_DEATH */:
                        buffAmount = skill.skillFuncArg1;
                        break;
                    case 17 /* HP_SHIELD */:
                        skillMod = skill.skillFuncArg1;
                        buffAmount = Math.round(skillMod * baseStat);
                        var maxValue = ~~(target.getOriginalHP() * skill.skillFuncArg3);
                        break;
                    default:
                        throw new Error("Wrong status type or not implemented");
                }

                target.changeStatus(statusType, buffAmount, false, maxValue);

                this.logger.addMinorEvent({
                    executorId: executor.id,
                    targetId: target.id,
                    type: 2 /* STATUS */,
                    status: {
                        type: statusType,
                        isAllUp: skill.skillFuncArg2 == 9 /* ALL_STATUS */
                    },
                    description: target.name + "'s " + ENUM.StatusType[statusType] + " increased by " + buffAmount,
                    amount: buffAmount,
                    skillId: skill.id
                });
            }
        }
    };
    return BuffSkillLogic;
})(SkillLogic);

var DebuffSkillLogic = (function (_super) {
    __extends(DebuffSkillLogic, _super);
    function DebuffSkillLogic() {
        _super.apply(this, arguments);
    }
    DebuffSkillLogic.prototype.execute = function (data) {
        var skill = data.skill;
        var executor = data.executor;
        skill.getReady(executor);

        var target;
        while (target = skill.getTarget(executor)) {
            this.battleModel.processDebuff(executor, target, skill);
        }
    };
    return DebuffSkillLogic;
})(SkillLogic);

var ClearStatusSkillLogic = (function (_super) {
    __extends(ClearStatusSkillLogic, _super);
    function ClearStatusSkillLogic() {
        _super.apply(this, arguments);
        this.condFunc = function (x) {
            return true;
        };
        this.isDispelled = false;
    }
    ClearStatusSkillLogic.prototype.willBeExecuted = function (data) {
        var hasValidTarget = data.skill.range.hasValidTarget(data.executor, this.getCondFunc());
        return _super.prototype.willBeExecuted.call(this, data) && hasValidTarget;
    };

    ClearStatusSkillLogic.prototype.getCondFunc = function () {
        var _this = this;
        return function (card) {
            return card.hasStatus(_this.condFunc);
        };
    };

    ClearStatusSkillLogic.prototype.execute = function (data) {
        data.skill.getReady(data.executor);
        var target;

        while (target = data.skill.getTarget(data.executor)) {
            target.clearAllStatus(this.condFunc);

            this.logger.addMinorEvent({
                executorId: data.executor.id,
                targetId: target.id,
                type: 2 /* STATUS */,
                status: {
                    type: 0,
                    isDispelled: this.isDispelled,
                    isClearDebuff: !this.isDispelled
                },
                description: target.name + (this.isDispelled ? " is dispelled." : " is cleared of debuffs."),
                skillId: data.skill.id
            });
        }
    };
    return ClearStatusSkillLogic;
})(SkillLogic);

var DispellSkillLogic = (function (_super) {
    __extends(DispellSkillLogic, _super);
    function DispellSkillLogic() {
        _super.call(this);
        this.condFunc = function (x) {
            return x > 0;
        };
        this.isDispelled = true;
    }
    return DispellSkillLogic;
})(ClearStatusSkillLogic);

var ClearDebuffSkillLogic = (function (_super) {
    __extends(ClearDebuffSkillLogic, _super);
    function ClearDebuffSkillLogic() {
        _super.call(this);
        this.condFunc = function (x) {
            return x < 0;
        };
        this.isDispelled = false;
    }
    return ClearDebuffSkillLogic;
})(ClearStatusSkillLogic);

var AfflictionSkillLogic = (function (_super) {
    __extends(AfflictionSkillLogic, _super);
    function AfflictionSkillLogic() {
        _super.apply(this, arguments);
    }
    AfflictionSkillLogic.prototype.execute = function (data) {
        data.skill.getReady(data.executor);

        var target;
        while (target = data.skill.getTarget(data.executor)) {
            this.battleModel.processAffliction(data.executor, target, data.skill);
        }
    };
    return AfflictionSkillLogic;
})(SkillLogic);

var AttackSkillLogic = (function (_super) {
    __extends(AttackSkillLogic, _super);
    function AttackSkillLogic() {
        _super.apply(this, arguments);
    }
    AttackSkillLogic.prototype.willBeExecuted = function (data) {
        var hasTarget = data.skill.range.hasValidTarget(data.executor);
        return _super.prototype.willBeExecuted.call(this, data) && hasTarget;
    };

    AttackSkillLogic.prototype.execute = function (data) {
        if (!RangeFactory.isEnemyRandomRange(data.skill.skillRange) && data.skill.isIndirectSkill()) {
            this.executeAoeAttack(data);
        } else {
            this.executeNonAoeAttack(data);
        }
    };

    AttackSkillLogic.prototype.executeNonAoeAttack = function (data) {
        data.skill.getReady(data.executor);
        var target;
        while ((target = data.skill.getTarget(data.executor)) && !data.executor.isDead) {
            this.processAttackAgainstSingleTarget(data.executor, target, data.skill);
        }
    };

    AttackSkillLogic.prototype.executeAoeAttack = function (data) {
        var skill = data.skill;
        var executor = data.executor;
        skill.getReady(executor);

        var targets = skill.range.targets;

        if (RangeFactory.isEnemyScaledRange(skill.skillRange)) {
            var scaledRatio = RangeFactory.getScaledRatio(skill.skillRange, targets.length);
        }

        if (skill.isIndirectSkill()) {
            shuffle(targets);

            var aoeReactiveSkillActivated = false;

            var targetsAttacked = [];

            for (var i = 0; i < targets.length; i++) {
                var targetCard = targets[i];

                if (targetCard.isDead) {
                    continue;
                }

                var protectSkillActivated = false;

                if (!aoeReactiveSkillActivated && !targetsAttacked[targetCard.id]) {
                    var protectData = this.battleModel.processProtect(executor, targetCard, skill, targetsAttacked, scaledRatio);
                    protectSkillActivated = protectData.activated;
                    if (protectSkillActivated) {
                        aoeReactiveSkillActivated = true;
                    }
                }

                if (!protectSkillActivated && !targetsAttacked[targetCard.id]) {
                    var defenseSkill = targetCard.getRandomDefenseSkill();

                    var defenseData = {
                        executor: targetCard,
                        skill: defenseSkill,
                        attacker: executor
                    };

                    this.battleModel.processDamagePhase({
                        attacker: executor,
                        target: targetCard,
                        skill: skill,
                        scaledRatio: scaledRatio
                    });
                    targetsAttacked[targetCard.id] = true;

                    if (!executor.justMissed && !targetCard.justEvaded && !targetCard.isDead) {
                        if (Skill.isDebuffAttackSkill(skill.id)) {
                            if (Math.random() <= skill.skillFuncArg3) {
                                this.battleModel.processDebuff(executor, targetCard, skill);
                            }
                        } else if (skill.skillFunc === 3 /* ATTACK */ || skill.skillFunc === 4 /* MAGIC */) {
                            this.battleModel.processAffliction(executor, targetCard, skill);
                        }
                    }

                    if (defenseSkill && defenseSkill.willBeExecuted(defenseData) && !aoeReactiveSkillActivated) {
                        defenseSkill.execute(defenseData);
                        aoeReactiveSkillActivated = true;
                    }
                }

                if (skill.skillFunc == 36 /* DRAIN_ATTACK */ || skill.skillFunc == 37 /* DRAIN_MAGIC */) {
                    this.processDrainPhase(executor, skill);
                }

                this.clearAllCardsDamagePhaseData();
            }
        }
    };

    AttackSkillLogic.prototype.processAttackAgainstSingleTarget = function (executor, target, skill, scaledRatio) {
        var protectData = this.battleModel.processProtect(executor, target, skill, null, scaledRatio);

        if (!protectData.activated) {
            var defenseSkill = target.getRandomDefenseSkill();

            var defenseData = {
                executor: target,
                skill: defenseSkill,
                attacker: executor
            };

            this.battleModel.processDamagePhase({
                attacker: executor,
                target: target,
                skill: skill,
                scaledRatio: scaledRatio
            });

            if (!executor.justMissed && !target.justEvaded && !target.isDead) {
                if (Skill.isDebuffAttackSkill(skill.id)) {
                    if (Math.random() <= skill.skillFuncArg3) {
                        this.battleModel.processDebuff(executor, target, skill);
                    }
                } else if (skill.skillFunc === 3 /* ATTACK */ || skill.skillFunc === 4 /* MAGIC */) {
                    this.battleModel.processAffliction(executor, target, skill);
                }
            }

            if (defenseSkill && defenseSkill.willBeExecuted(defenseData)) {
                defenseSkill.execute(defenseData);
            }
        }

        if (skill.skillFunc == 36 /* DRAIN_ATTACK */ || skill.skillFunc == 37 /* DRAIN_MAGIC */) {
            this.processDrainPhase(executor, skill);
        }

        this.clearAllCardsDamagePhaseData();
    };

    AttackSkillLogic.prototype.processDrainPhase = function (executor, skill) {
        var healRange = RangeFactory.getRange(skill.skillFuncArg4);
        healRange.getReady(executor, function (card) {
            return !card.isFullHealth();
        });

        console.assert(!(healRange instanceof RandomRange), "can't do this with random ranges!");
        if (healRange.targets.length == 0) {
            return;
        }

        var healAmount = Math.floor((executor.lastBattleDamageDealt * skill.skillFuncArg2) / healRange.targets.length);
        var target;
        while (target = healRange.getTarget(executor)) {
            this.battleModel.damageToTargetDirectly(target, -1 * healAmount, " healing");
        }
    };
    return AttackSkillLogic;
})(SkillLogic);

var ProtectSkillLogic = (function (_super) {
    __extends(ProtectSkillLogic, _super);
    function ProtectSkillLogic() {
        _super.apply(this, arguments);
        this.counter = false;
    }
    ProtectSkillLogic.prototype.willBeExecuted = function (data) {
        data.skill.getReady(data.executor);

        if (this.cardManager.isSameCard(data.targetCard, data.executor) && data.skill.skillRange != 21 /* MYSELF */) {
            return false;
        }

        console.assert(!(data.skill.range instanceof RandomRange), "can't do this with random ranges!");
        return _super.prototype.willBeExecuted.call(this, data) && this.cardManager.isCardInList(data.targetCard, data.skill.range.targets);
    };

    ProtectSkillLogic.prototype.execute = function (data) {
        return this.executeProtectPhase(data);
    };

    ProtectSkillLogic.prototype.executeProtectPhase = function (data, noProtectLog) {
        var protector = data.executor;
        var protectSkill = data.skill;
        var attackSkill = data.attackSkill;
        var toReturn = {};

        if (!noProtectLog) {
            this.logger.addMinorEvent({
                executorId: protector.id,
                type: 4 /* PROTECT */,
                protect: {
                    protectedId: data.targetCard.id,
                    counter: this.counter,
                    counteredSkillId: attackSkill.id,
                    attackerId: data.attacker.id
                },
                description: protector.name + " procs " + protectSkill.name + " to protect " + data.targetCard.name + ". ",
                skillId: protectSkill.id
            });
        }

        if (protectSkill.skillFunc === 28 /* PROTECT_REFLECT */) {
            var dmgRatio = protectSkill.skillFuncArg5;
        }

        this.battleModel.processDamagePhase({
            attacker: data.attacker,
            target: protector,
            skill: attackSkill,
            scaledRatio: data.scaledRatio,
            dmgRatio: dmgRatio
        });

        if (protectSkill.skillFunc === 28 /* PROTECT_REFLECT */) {
            toReturn.dmgTaken = protector.lastBattleDamageTaken;
        }

        if (!data.attacker.justMissed && !protector.isDead) {
            if (attackSkill.skillFunc === 3 /* ATTACK */ || attackSkill.skillFunc === 4 /* MAGIC */) {
                this.battleModel.processAffliction(data.attacker, protector, attackSkill);
            } else if (Skill.isDebuffAttackSkill(attackSkill.id)) {
                if (Math.random() <= attackSkill.skillFuncArg3) {
                    this.battleModel.processDebuff(data.attacker, protector, attackSkill);
                }
            }
        }

        if (data.targetsAttacked) {
            data.targetsAttacked[protector.id] = true;
        }

        this.clearAllCardsDamagePhaseData();

        return toReturn;
    };
    return ProtectSkillLogic;
})(SkillLogic);

var EvadeSkillLogic = (function (_super) {
    __extends(EvadeSkillLogic, _super);
    function EvadeSkillLogic() {
        _super.apply(this, arguments);
    }
    EvadeSkillLogic.prototype.willBeExecuted = function (data) {
        var skill = data.skill;
        skill.getReady(data.executor);

        if (this.cardManager.isSameCard(data.targetCard, data.executor) && skill.skillRange != 21 /* MYSELF */) {
            return false;
        }

        var canEvade = Skill.canProtectFromCalcType(skill.skillFuncArg2, data.attackSkill) && Skill.canProtectFromAttackType(skill.skillFuncArg1, data.attackSkill);

        console.assert(!(skill.range instanceof RandomRange), "can't do this with random ranges!");
        return _super.prototype.willBeExecuted.call(this, data) && this.cardManager.isCardInList(data.targetCard, skill.range.targets) && canEvade;
    };

    EvadeSkillLogic.prototype.execute = function (data) {
        data.executor.justEvaded = true;

        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 5 /* DESCRIPTION */,
            noProcEffect: true,
            description: data.executor.name + " procs " + data.skill.name,
            skillId: data.skill.id
        });

        this.battleModel.processDamagePhase({
            attacker: data.attacker,
            target: data.executor,
            skill: data.attackSkill,
            scaledRatio: data.scaledRatio
        });

        if (data.targetsAttacked) {
            data.targetsAttacked[data.executor.id] = true;
        }

        this.clearAllCardsDamagePhaseData();

        return {};
    };
    return EvadeSkillLogic;
})(SkillLogic);

var ProtectCounterSkillLogic = (function (_super) {
    __extends(ProtectCounterSkillLogic, _super);
    function ProtectCounterSkillLogic() {
        _super.call(this);
        this.counter = true;
    }
    ProtectCounterSkillLogic.prototype.execute = function (data) {
        var toReturn = this.executeProtectPhase(data);
        var protector = data.executor;

        if (!protector.isDead && protector.canAttack() && !data.attacker.isDead) {
            this.battleModel.processDamagePhase({
                attacker: protector,
                target: data.attacker,
                skill: data.skill,
                additionalDescription: protector.name + " counters " + data.attacker.name + "! "
            });
        }

        return toReturn;
    };
    return ProtectCounterSkillLogic;
})(ProtectSkillLogic);

var ProtectReflectSkillLogic = (function (_super) {
    __extends(ProtectReflectSkillLogic, _super);
    function ProtectReflectSkillLogic() {
        _super.apply(this, arguments);
    }
    ProtectReflectSkillLogic.prototype.willBeExecuted = function (data) {
        var skill = data.skill;

        var canProtect = Skill.canProtectFromCalcType(skill.skillFuncArg2, data.attackSkill) && Skill.canProtectFromAttackType(skill.skillFuncArg4, data.attackSkill);

        return _super.prototype.willBeExecuted.call(this, data) && canProtect;
    };

    ProtectReflectSkillLogic.prototype.execute = function (data) {
        var toReturn = this.executeProtectPhase(data);

        if (data.executor.isDead || !data.executor.canUseSkill()) {
            return toReturn;
        }

        var range = RangeFactory.getRange(data.skill.skillFuncArg3);
        range.getReady(data.executor);
        var target;

        while (target = range.getTarget(data.executor)) {
            this.battleModel.processDamagePhase({
                attacker: data.executor,
                target: target,
                skill: data.skill,
                scaledRatio: data.scaledRatio,
                oriAttacker: data.attacker,
                oriAtkSkill: data.attackSkill,
                oriDmg: toReturn.dmgTaken / data.skill.skillFuncArg5
            });

            if (data.attackSkill.skillFunc === 3 /* ATTACK */ || data.attackSkill.skillFunc === 4 /* MAGIC */) {
                this.battleModel.processAffliction(data.executor, target, data.attackSkill, ProtectReflectSkillLogic.REFLECT_AFFLICTION_PROBABILITY);
            }

            this.clearAllCardsDamagePhaseData();
        }

        return toReturn;
    };
    ProtectReflectSkillLogic.REFLECT_AFFLICTION_PROBABILITY = 0.2;
    return ProtectReflectSkillLogic;
})(ProtectSkillLogic);

var CounterSkillLogic = (function (_super) {
    __extends(CounterSkillLogic, _super);
    function CounterSkillLogic() {
        _super.apply(this, arguments);
    }
    CounterSkillLogic.prototype.execute = function (data) {
        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 5 /* DESCRIPTION */,
            description: data.executor.name + " procs " + data.skill.name + ". ",
            skillId: data.skill.id
        });

        this.battleModel.processDamagePhase({
            attacker: data.executor,
            target: data.attacker,
            skill: data.skill,
            additionalDescription: data.executor.name + " counters " + data.attacker.name + "! "
        });

        if (!data.executor.justMissed && !data.attacker.justEvaded && !data.attacker.isDead) {
            this.battleModel.processAffliction(data.executor, data.attacker, data.skill);
        }
    };
    return CounterSkillLogic;
})(SkillLogic);

var CounterDispellSkillLogic = (function (_super) {
    __extends(CounterDispellSkillLogic, _super);
    function CounterDispellSkillLogic() {
        _super.apply(this, arguments);
        this.condFunc = function (x) {
            return x > 0;
        };
    }
    CounterDispellSkillLogic.prototype.willBeExecuted = function (data) {
        var range = RangeFactory.getRange(data.skill.skillFuncArg3);
        var hasValidtarget = range.hasValidTarget(data.executor, this.getCondFunc());
        return _super.prototype.willBeExecuted.call(this, data) && hasValidtarget;
    };

    CounterDispellSkillLogic.prototype.getCondFunc = function () {
        var _this = this;
        return function (card) {
            return card.hasStatus(_this.condFunc);
        };
    };

    CounterDispellSkillLogic.prototype.execute = function (data) {
        var toReturn = this.executeProtectPhase(data, true);

        if (data.executor.isDead || !data.executor.canUseSkill()) {
            return toReturn;
        }

        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 5 /* DESCRIPTION */,
            description: data.executor.name + " procs " + data.skill.name,
            skillId: data.skill.id
        });

        var range = RangeFactory.getRange(data.skill.skillFuncArg3);
        range.getReady(data.executor, this.getCondFunc());
        var target;

        while (target = range.getTarget(data.executor)) {
            target.clearAllStatus(this.condFunc);

            this.logger.addMinorEvent({
                executorId: data.executor.id,
                targetId: target.id,
                type: 2 /* STATUS */,
                status: {
                    type: 0,
                    isDispelled: true
                },
                description: target.name + " is dispelled.",
                skillId: data.skill.id
            });
        }

        return toReturn;
    };
    return CounterDispellSkillLogic;
})(ProtectSkillLogic);

var OnHitDebuffSkillLogic = (function (_super) {
    __extends(OnHitDebuffSkillLogic, _super);
    function OnHitDebuffSkillLogic() {
        _super.apply(this, arguments);
        this.executionLeft = OnHitDebuffSkillLogic.UNINITIALIZED_VALUE;
    }
    OnHitDebuffSkillLogic.prototype.willBeExecuted = function (data) {
        var hasTarget = data.skill.range.hasValidTarget(data.executor);

        if (this.executionLeft == OnHitDebuffSkillLogic.UNINITIALIZED_VALUE) {
            this.executionLeft = data.skill.skillFuncArg5;
        }

        if (this.executionLeft == 0)
            return false;

        var success = _super.prototype.willBeExecuted.call(this, data) && hasTarget;

        if (success) {
            this.executionLeft--;
            return true;
        } else
            return false;
    };

    OnHitDebuffSkillLogic.prototype.execute = function (data) {
        data.skill.getReady(data.executor);
        var target;

        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 5 /* DESCRIPTION */,
            description: data.executor.name + " procs " + data.skill.name + ". ",
            skillId: data.skill.id
        });

        while (target = data.skill.getTarget(data.executor)) {
            this.battleModel.processDebuff(data.executor, target, data.skill);
        }
    };
    OnHitDebuffSkillLogic.UNINITIALIZED_VALUE = -1234;
    return OnHitDebuffSkillLogic;
})(SkillLogic);

var DrainSkillLogic = (function (_super) {
    __extends(DrainSkillLogic, _super);
    function DrainSkillLogic() {
        _super.apply(this, arguments);
    }
    DrainSkillLogic.prototype.willBeExecuted = function (data) {
        var hasValidTarget = data.skill.range.hasValidTarget(data.executor, this.getCondFunc());
        return _super.prototype.willBeExecuted.call(this, data) && hasValidTarget;
    };

    DrainSkillLogic.prototype.getCondFunc = function () {
        return function (card) {
            return !card.isFullHealth();
        };
    };

    DrainSkillLogic.prototype.execute = function (data) {
        var skill = data.skill;
        skill.range.getReady(data.executor, this.getCondFunc());
        var target;

        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 5 /* DESCRIPTION */,
            description: data.executor.name + " procs " + skill.name + ". ",
            skillId: skill.id
        });

        console.assert(!(skill.range instanceof RandomRange), "can't do this with random ranges!");
        var eachTargetHealAmount = Math.floor(data.executor.lastBattleDamageTaken / skill.range.targets.length);

        while (target = skill.getTarget(data.executor)) {
            this.battleModel.damageToTargetDirectly(target, -1 * eachTargetHealAmount, " healing");
        }
    };
    return DrainSkillLogic;
})(SkillLogic);

var SurviveSkillLogic = (function (_super) {
    __extends(SurviveSkillLogic, _super);
    function SurviveSkillLogic() {
        _super.apply(this, arguments);
    }
    SurviveSkillLogic.prototype.willBeExecuted = function (data) {
        var hpRatio = data.executor.getHPRatio();
        return _super.prototype.willBeExecuted.call(this, data) && (hpRatio > data.skill.skillFuncArg1) && (data.wouldBeDamage >= data.executor.getHP());
    };

    SurviveSkillLogic.prototype.execute = function (data) {
        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 5 /* DESCRIPTION */,
            noProcEffect: true,
            description: data.executor.name + " procs " + data.skill.name + ". ",
            skillId: data.skill.id
        });
    };
    return SurviveSkillLogic;
})(SkillLogic);

var HealSkillLogic = (function (_super) {
    __extends(HealSkillLogic, _super);
    function HealSkillLogic() {
        _super.apply(this, arguments);
    }
    HealSkillLogic.prototype.willBeExecuted = function (data) {
        var hasValidTarget = data.skill.range.hasValidTarget(data.executor, this.getCondFunc());
        return _super.prototype.willBeExecuted.call(this, data) && hasValidTarget;
    };

    HealSkillLogic.prototype.getCondFunc = function () {
        return function (card) {
            return !card.isFullHealth();
        };
    };

    HealSkillLogic.prototype.execute = function (data) {
        data.skill.range.getReady(data.executor, this.getCondFunc());

        var baseHealAmount = getHealAmount(data.executor);

        var multiplier = data.skill.skillFuncArg1;
        var healAmount = Math.floor(multiplier * baseHealAmount);

        var target;
        while (target = data.skill.getTarget(data.executor)) {
            if (data.skill.skillFuncArg2 == 1) {
                healAmount = multiplier * target.getOriginalHP();
            }

            this.battleModel.damageToTargetDirectly(target, -1 * healAmount, " healing");
        }
    };
    return HealSkillLogic;
})(SkillLogic);

var ReviveSkillLogic = (function (_super) {
    __extends(ReviveSkillLogic, _super);
    function ReviveSkillLogic() {
        _super.apply(this, arguments);
    }
    ReviveSkillLogic.prototype.willBeExecuted = function (data) {
        var hasValidTarget = data.skill.range.hasValidTarget(data.executor);
        return _super.prototype.willBeExecuted.call(this, data) && hasValidTarget;
    };

    ReviveSkillLogic.prototype.execute = function (data) {
        data.skill.getReady(data.executor);
        var hpRatio = data.skill.skillFuncArg1;

        var target;
        while (target = data.skill.getTarget(data.executor)) {
            target.revive(hpRatio);

            this.logger.addMinorEvent({
                executorId: data.executor.id,
                targetId: target.id,
                type: 7 /* REVIVE */,
                reviveHPRatio: hpRatio,
                description: target.name + " is revived with " + hpRatio * 100 + "% HP!",
                skillId: data.skill.id
            });
        }
    };
    return ReviveSkillLogic;
})(SkillLogic);

var TurnOrderChangeSkillLogic = (function (_super) {
    __extends(TurnOrderChangeSkillLogic, _super);
    function TurnOrderChangeSkillLogic() {
        _super.apply(this, arguments);
    }
    TurnOrderChangeSkillLogic.prototype.willBeExecuted = function (data) {
        return _super.prototype.willBeExecuted.call(this, data) && !this.battleModel.turnOrderChanged;
    };

    TurnOrderChangeSkillLogic.prototype.execute = function (data) {
        this.battleModel.turnOrderChanged = true;
        this.battleModel.turnOrderBase = data.skill.skillFuncArg1;
        this.battleModel.turnOrderChangeEffectiveTurns = data.skill.skillFuncArg2;

        this.logger.addMinorEvent({
            executorId: data.executor.id,
            type: 51 /* BATTLE_DESCRIPTION */,
            description: "Turn order is now based on " + ENUM.BattleTurnOrderType[data.skill.skillFuncArg1] + " for " + data.skill.skillFuncArg2 + " turn(s).",
            skillId: data.skill.id,
            battleDesc: "Turn Order Changed"
        });
    };
    return TurnOrderChangeSkillLogic;
})(SkillLogic);

var RandomSkillLogic = (function (_super) {
    __extends(RandomSkillLogic, _super);
    function RandomSkillLogic() {
        _super.apply(this, arguments);
    }
    RandomSkillLogic.prototype.execute = function (data) {
        var randSkillsId = SkillDatabase[data.skill.id].randSkills;
        shuffle(randSkillsId);
        data.noProbCheck = true;

        for (var i = 0; i < randSkillsId.length; i++) {
            var skill = new Skill(randSkillsId[i]);
            data.skill = skill;

            if (skill.willBeExecuted(data)) {
                this.logger.addMinorEvent({
                    executorId: data.executor.id,
                    type: 5 /* DESCRIPTION */,
                    description: data.executor.name + " procs " + data.skill.name + ". ",
                    skillId: data.skill.id
                });

                skill.execute(data);
                break;
            }
        }
    };
    return RandomSkillLogic;
})(SkillLogic);
var RangeFactory = (function () {
    function RangeFactory() {
    }
    RangeFactory.getRange = function (id, selectDead) {
        if (typeof selectDead === "undefined") { selectDead = false; }
        var range;
        if (this.isEnemyRandomRange(id)) {
            range = this.createEnemyRandomRange(id);
        } else if (this.isEnemyNearRange(id) || this.isEnemyNearScaledRange(id)) {
            range = this.createEnemyNearRange(id);
        } else if (this.isFriendRandomRange(id)) {
            range = this.createFriendRandomRange(id, selectDead);
        } else {
            range = this.createRange(id, selectDead);
        }
        return range;
    };

    RangeFactory.isEnemyRandomRange = function (id) {
        return !!RangeFactory.ENEMY_RANDOM_RANGE_TARGET_NUM[id];
    };

    RangeFactory.isFriendRandomRange = function (id) {
        return !!RangeFactory.FRIEND_RANDOM_RANGE_TARGET_NUM[id];
    };

    RangeFactory.createEnemyRandomRange = function (id) {
        return new EnemyRandomRange(id, RangeFactory.ENEMY_RANDOM_RANGE_TARGET_NUM[id]);
    };

    RangeFactory.createFriendRandomRange = function (id, selectDead) {
        return new FriendRandomRange(id, RangeFactory.FRIEND_RANDOM_RANGE_TARGET_NUM[id], selectDead);
    };

    RangeFactory.isEnemyNearRange = function (id) {
        return !!RangeFactory.ENEMY_NEAR_RANGE_TARGET_NUM[id];
    };

    RangeFactory.createEnemyNearRange = function (id) {
        if (this.isEnemyNearRange(id)) {
            var numTargets = RangeFactory.ENEMY_NEAR_RANGE_TARGET_NUM[id];
        } else if (this.isEnemyNearScaledRange(id)) {
            numTargets = RangeFactory.ENEMY_NEAR_SCALED_RANGE_TARGET_NUM[id];
        }
        return new EnemyNearRange(id, numTargets);
    };

    RangeFactory.isEnemyNearScaledRange = function (id) {
        return !!RangeFactory.ENEMY_NEAR_SCALED_RANGE_TARGET_NUM[id];
    };

    RangeFactory.isEnemyScaledRange = function (id) {
        return this.isEnemyNearScaledRange(id) || id == 208 /* ENEMY_ALL_SCALED */;
    };

    RangeFactory.getScaledRatio = function (id, targetsLeft) {
        var paramArray = RangeFactory.ScalePatternParams[id];

        if (!paramArray) {
            throw new Error("Invalid range for getting scale ratio");
        }
        return paramArray[targetsLeft - 1];
    };

    RangeFactory.isRowBasedRange = function (rangeId) {
        if (rangeId === 12 /* ENEMY_FRONT_ALL */ || rangeId === 14 /* ENEMY_REAR_ALL */ || rangeId === 15 /* ENEMY_FRONT_MID_ALL */) {
            return true;
        }

        return false;
    };

    RangeFactory.canBeAoeRange = function (rangeId) {
        var canBe = false;

        if (this.isEnemyNearRange(rangeId) || this.isEnemyNearScaledRange(rangeId) || this.isRowBasedRange(rangeId) || rangeId == 8 /* ENEMY_ALL */ || rangeId == 208 /* ENEMY_ALL_SCALED */) {
            canBe = true;
        }

        return canBe;
    };

    RangeFactory.createRange = function (id, selectDead) {
        switch (id) {
            case 1 /* EITHER_SIDE */:
                return new EitherSideRange(id, selectDead);
            case 2 /* BOTH_SIDES */:
                return new BothSidesRange(id, selectDead);
            case 3 /* SELF_BOTH_SIDES */:
                return new SelfBothSidesRange(id);
            case 4 /* ALL */:
                return new AllRange(id);
            case 8 /* ENEMY_ALL */:
            case 208 /* ENEMY_ALL_SCALED */:
                return new EnemyAllRange(id);
            case 12 /* ENEMY_FRONT_ALL */:
                return new EnemyFrontAllRange(id);
            case 14 /* ENEMY_REAR_ALL */:
                return new EnemyRearAllRange(id);
            case 15 /* ENEMY_FRONT_MID_ALL */:
                return new EnemyFrontMidAllRange(id);
            case 21 /* MYSELF */:
                return new SelfRange(id, selectDead);
            case 28 /* RIGHT */:
                return new RightRange(id);
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

    RangeFactory.ENEMY_NEAR_SCALED_RANGE_TARGET_NUM = {
        312: 2,
        313: 3,
        314: 4,
        315: 5
    };

    RangeFactory.ENEMY_NEAR_RANGE_TARGET_NUM = {
        5: 1,
        6: 2,
        7: 3,
        32: 4,
        33: 5
    };

    RangeFactory.FRIEND_RANDOM_RANGE_TARGET_NUM = {
        101: 1,
        102: 2,
        103: 3,
        104: 4,
        105: 5,
        106: 6,
        111: 1,
        112: 2,
        113: 3,
        114: 4,
        115: 5,
        116: 6,
        121: 1,
        122: 2,
        123: 3,
        124: 4,
        125: 5,
        126: 6,
        131: 1,
        132: 2,
        133: 3,
        134: 4,
        135: 5,
        136: 6
    };

    RangeFactory.INCLUDE_SELF = {
        111: true,
        112: true,
        113: true,
        114: true,
        115: true,
        116: true,
        131: true,
        132: true,
        133: true,
        134: true,
        135: true,
        136: true,
        332: true,
        333: true,
        334: true,
        335: true,
        336: true
    };

    RangeFactory.IS_UNIQUE = {
        121: true,
        122: true,
        123: true,
        124: true,
        125: true,
        126: true,
        131: true,
        132: true,
        133: true,
        134: true,
        135: true,
        136: true
    };

    RangeFactory.ScalePatternParams = {
        202: [1.5, 1],
        203: [1.75, 1.25, 1],
        204: [1.9375, 1.4375, 1.25, 1.13, 1, 1, 1, 1, 1, 1],
        208: [1.9375, 1.4375, 1.25, 1.13, 1],
        212: [1, 1, 1, 1, 1],
        213: [1, 1, 1, 1, 1],
        214: [1, 1, 1, 1, 1],
        215: [1, 1, 1, 1, 1],
        234: [1, 1, 1, 1, 1],
        312: [1.5, 1],
        313: [1.75, 1.25, 1],
        314: [1.875, 1.375, 1.16, 1],
        315: [1.9375, 1.4375, 1.25, 1.13, 1],
        322: [1.5, 1],
        323: [1.75, 1.25, 1],
        324: [1.875, 1.375, 1.16, 1],
        325: [1.875, 1.375, 1.16, 1, 1],
        326: [1.875, 1.375, 1.16, 1, 1, 1],
        332: [1.5, 1],
        333: [1.75, 1.25, 1],
        334: [1.875, 1.375, 1.16, 1],
        335: [1.9375, 1.4375, 1.25, 1.13, 1],
        336: [1.9375, 1.4375, 1.25, 1.13, 1, 1]
    };
    return RangeFactory;
})();

var BaseRange = (function () {
    function BaseRange(id) {
        this.id = id;
    }
    BaseRange.prototype.getBaseTargets = function (condFunc) {
        var allCards = CardManager.getInstance().getAllMainCardsInPlayerOrder();
        var baseTargets = [];
        for (var i = 0; i < allCards.length; i++) {
            if (condFunc(allCards[i])) {
                baseTargets.push(allCards[i]);
            }
        }
        return baseTargets;
    };

    BaseRange.prototype.getReady = function (executor, skillCondFunc) {
        throw new Error("Implement this");
    };

    BaseRange.prototype.hasValidTarget = function (executor, condFunc) {
        this.getReady(executor, condFunc);

        var hasValid = false;
        if (condFunc) {
            for (var i = 0; i < this.targets.length; i++) {
                if (condFunc(this.targets[i])) {
                    hasValid = true;
                    break;
                }
            }
        } else {
            hasValid = this.targets.length > 0;
        }

        return hasValid;
    };

    BaseRange.prototype.getRandomCard = function (cards) {
        return getRandomElement(cards);
    };

    BaseRange.prototype.getRandomUniqueCards = function (cards, num) {
        var len = cards.length;
        while (len) {
            var a = Math.floor(Math.random() * len);
            var b = cards[--len];
            cards[len] = cards[a];
            cards[a] = b;
        }
        return cards.slice(0, num);
    };

    BaseRange.prototype.getCondFunc = function (executor) {
        return function (card) {
            if (card.isDead || (card.getPlayerId() === executor.getPlayerId())) {
                return false;
            }
            return true;
        };
    };

    BaseRange.prototype.satisfyDeadCondition = function (card, selectDead) {
        return (card.isDead && selectDead) || (!card.isDead && !selectDead);
    };

    BaseRange.prototype.getTarget = function (executor) {
        return this.targets[this.currentIndex++];
    };
    return BaseRange;
})();

var BothSidesRange = (function (_super) {
    __extends(BothSidesRange, _super);
    function BothSidesRange(id, selectDead) {
        _super.call(this, id);
        this.selectDead = selectDead;
    }
    BothSidesRange.prototype.getReady = function (executor) {
        var targets = [];
        this.currentIndex = 0;

        var leftCard = CardManager.getInstance().getLeftSideCard(executor);
        if (leftCard && this.satisfyDeadCondition(leftCard, this.selectDead)) {
            targets.push(leftCard);
        }

        var rightCard = CardManager.getInstance().getRightSideCard(executor);
        if (rightCard && this.satisfyDeadCondition(rightCard, this.selectDead)) {
            targets.push(rightCard);
        }

        this.targets = targets;
    };
    return BothSidesRange;
})(BaseRange);

var RandomRange = (function (_super) {
    __extends(RandomRange, _super);
    function RandomRange() {
        _super.apply(this, arguments);
    }
    RandomRange.prototype.hasValidTarget = function (executor, condFunc) {
        var baseTargets = this.getBaseTargets(this.getCondFunc(executor));
        var hasValid = false;
        if (condFunc) {
            for (var i = 0; i < baseTargets.length; i++) {
                if (condFunc(baseTargets[i])) {
                    hasValid = true;
                    break;
                }
            }
        } else {
            hasValid = baseTargets.length > 0;
        }

        return hasValid;
    };
    return RandomRange;
})(BaseRange);

var EnemyRandomRange = (function (_super) {
    __extends(EnemyRandomRange, _super);
    function EnemyRandomRange(id, numTarget) {
        _super.call(this, id);
        this.numTarget = numTarget;
    }
    EnemyRandomRange.prototype.getReady = function (executor) {
        this.numProcessed = 0;
    };

    EnemyRandomRange.prototype.getTarget = function (executor) {
        if (this.numProcessed < this.numTarget) {
            this.numProcessed++;
            return this.getRandomCard(this.getBaseTargets(this.getCondFunc(executor)));
        } else {
            return null;
        }
    };
    return EnemyRandomRange;
})(RandomRange);

var EitherSideRange = (function (_super) {
    __extends(EitherSideRange, _super);
    function EitherSideRange() {
        _super.apply(this, arguments);
    }
    EitherSideRange.prototype.getReady = function (executor) {
        _super.prototype.getReady.call(this, executor);

        if (this.targets.length != 0) {
            this.targets = [getRandomElement(this.targets)];
        }
    };
    return EitherSideRange;
})(BothSidesRange);

var RightRange = (function (_super) {
    __extends(RightRange, _super);
    function RightRange() {
        _super.apply(this, arguments);
    }
    RightRange.prototype.getReady = function (executor) {
        var targets = [];
        this.currentIndex = 0;
        var partyCards = CardManager.getInstance().getPlayerCurrentMainCards(executor.player);

        for (var i = executor.formationColumn + 1; i < 5; i++) {
            if (!partyCards[i].isDead) {
                targets.push(partyCards[i]);
            }
        }

        this.targets = targets;
    };
    return RightRange;
})(BaseRange);

var SelfRange = (function (_super) {
    __extends(SelfRange, _super);
    function SelfRange(id, selectDead) {
        _super.call(this, id);
        this.selectDead = selectDead;
    }
    SelfRange.prototype.getReady = function (executor) {
        var targets = [];
        this.currentIndex = 0;

        if (this.satisfyDeadCondition(executor, this.selectDead)) {
            targets.push(executor);
        }

        this.targets = targets;
    };
    return SelfRange;
})(BaseRange);

var SelfBothSidesRange = (function (_super) {
    __extends(SelfBothSidesRange, _super);
    function SelfBothSidesRange() {
        _super.apply(this, arguments);
    }
    SelfBothSidesRange.prototype.getReady = function (executor) {
        var targets = [];
        this.currentIndex = 0;

        var leftCard = CardManager.getInstance().getLeftSideCard(executor);
        if (leftCard && !leftCard.isDead) {
            targets.push(leftCard);
        }

        if (!executor.isDead) {
            targets.push(executor);
        }

        var rightCard = CardManager.getInstance().getRightSideCard(executor);
        if (rightCard && !rightCard.isDead) {
            targets.push(rightCard);
        }

        this.targets = targets;
    };
    return SelfBothSidesRange;
})(BaseRange);

var AllRange = (function (_super) {
    __extends(AllRange, _super);
    function AllRange() {
        _super.apply(this, arguments);
    }
    AllRange.prototype.getReady = function (executor) {
        var targets = [];
        this.currentIndex = 0;
        var partyCards = CardManager.getInstance().getPlayerCurrentMainCards(executor.player);

        for (var i = 0; i < partyCards.length; i++) {
            if (!partyCards[i].isDead) {
                targets.push(partyCards[i]);
            }
        }
        this.targets = targets;
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
    EnemyNearRange.prototype.getReady = function (executor) {
        this.currentIndex = 0;

        var centerEnemy = CardManager.getInstance().getNearestSingleOpponentTarget(executor);

        if (!centerEnemy) {
            this.targets = [];
            return;
        }

        var enemyCards = CardManager.getInstance().getEnemyCurrentMainCards(executor.player);

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

        this.targets = targets;
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
    function EnemyAllRange() {
        _super.apply(this, arguments);
    }
    EnemyAllRange.prototype.getReady = function (executor) {
        var enemyCards = CardManager.getInstance().getEnemyCurrentMainCards(executor.player);
        var targets = [];
        this.currentIndex = 0;
        for (var i = 0; i < enemyCards.length; i++) {
            var currentEnemyCard = enemyCards[i];
            if (currentEnemyCard && !currentEnemyCard.isDead) {
                targets.push(currentEnemyCard);
            }
        }
        this.targets = targets;
    };
    return EnemyAllRange;
})(BaseRange);

var FriendRandomRange = (function (_super) {
    __extends(FriendRandomRange, _super);
    function FriendRandomRange(id, numTargets, selectDead) {
        _super.call(this, id);
        this.numTargets = numTargets;
        this.selectDead = selectDead;
        this.isUnique = RangeFactory.FRIEND_RANDOM_RANGE_TARGET_NUM[id];
        this.includeSelf = RangeFactory.INCLUDE_SELF[id];
    }
    FriendRandomRange.prototype.getReady = function (executor, skillCondFunc) {
        var baseTargets = this.getBaseTargets(this.getCondFunc(executor, skillCondFunc));
        var targets = [];
        this.currentIndex = 0;

        if (baseTargets.length) {
            if (this.isUnique) {
                targets = this.getRandomUniqueCards(baseTargets, this.numTargets);
            } else {
                for (var i = 0; i < this.numTargets; i++) {
                    targets.push(this.getRandomCard(baseTargets));
                }
            }
        }
        this.targets = targets;
    };

    FriendRandomRange.prototype.getCondFunc = function (executor, skillCondFunc) {
        var selectDead = this.selectDead;
        var includeSelf = this.includeSelf;

        return function (card) {
            if (card.getPlayerId() != executor.getPlayerId())
                return false;

            if (card.id === executor.id && !includeSelf)
                return false;

            if ((selectDead && !card.isDead) || (!selectDead && card.isDead))
                return false;

            if (skillCondFunc && !skillCondFunc(card))
                return false;

            return true;
        };
    };
    return FriendRandomRange;
})(RandomRange);

var BaseRowRange = (function (_super) {
    __extends(BaseRowRange, _super);
    function BaseRowRange() {
        _super.apply(this, arguments);
    }
    BaseRowRange.prototype.getSameRowCards = function (cards, row) {
        var returnArr = [];

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (card.getFormationRow() === row) {
                returnArr.push(card);
            }
        }

        return returnArr;
    };

    BaseRowRange.prototype.getRowCandidates = function (cards, row, isAsc) {
        var candidates = [];
        if (!cards || cards.length === 0) {
            return candidates;
        }

        var currentRow = row;
        while (!candidates.length) {
            var sameRowCards = this.getSameRowCards(cards, currentRow);
            for (var i = 0; i < sameRowCards.length; i++) {
                candidates.push(sameRowCards[i]);
            }

            currentRow = (isAsc) ? currentRow % BaseRowRange.ROW_TYPE_COUNT + 1 : currentRow - 1;

            if (currentRow < 1) {
                currentRow = 3 /* REAR */;
            }

            if (currentRow === row) {
                break;
            }
        }

        return candidates;
    };
    BaseRowRange.ROW_TYPE_COUNT = 3;
    return BaseRowRange;
})(BaseRange);

var EnemyFrontMidAllRange = (function (_super) {
    __extends(EnemyFrontMidAllRange, _super);
    function EnemyFrontMidAllRange() {
        _super.apply(this, arguments);
    }
    EnemyFrontMidAllRange.prototype.getReady = function (executor) {
        this.currentIndex = 0;
        var candidates = this.getBaseTargets(this.getCondFunc(executor));
        if (candidates.length) {
            var frontCards = this.getSameRowCards(candidates, 1 /* FRONT */);
            var centerCards = this.getSameRowCards(candidates, 2 /* MID */);

            if (frontCards.length > 0 || centerCards.length > 0) {
                candidates = frontCards.concat(centerCards);
            } else {
                candidates = this.getSameRowCards(candidates, 3 /* REAR */);
            }
        }
        this.targets = candidates;
    };
    return EnemyFrontMidAllRange;
})(BaseRowRange);

var EnemyFrontAllRange = (function (_super) {
    __extends(EnemyFrontAllRange, _super);
    function EnemyFrontAllRange() {
        _super.apply(this, arguments);
    }
    EnemyFrontAllRange.prototype.getReady = function (executor) {
        this.currentIndex = 0;
        var candidates = this.getBaseTargets(this.getCondFunc(executor));
        if (candidates.length) {
            candidates = this.getRowCandidates(candidates, 1 /* FRONT */, true);
        }
        this.targets = candidates;
    };
    return EnemyFrontAllRange;
})(BaseRowRange);

var EnemyRearAllRange = (function (_super) {
    __extends(EnemyRearAllRange, _super);
    function EnemyRearAllRange() {
        _super.apply(this, arguments);
    }
    EnemyRearAllRange.prototype.getReady = function (executor) {
        this.currentIndex = 0;
        var candidates = this.getBaseTargets(this.getCondFunc(executor));
        if (candidates.length) {
            candidates = this.getRowCandidates(candidates, 3 /* REAR */, false);
        }
        this.targets = candidates;
    };
    return EnemyRearAllRange;
})(BaseRowRange);
function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getRandomElement(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}

function removeElementAtIndex(array, index) {
    array.splice(index, 1);
}

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1 / ++count)
            result = prop;
    return result;
}

function getScaledWikiaImageLink(link, newWidth) {
    link = link.replace("$1", ".wikia.nocookie.net");
    link = link.replace("$2", "bloodbrothersgame/images/thumb");

    var lastSlash = link.lastIndexOf("/");
    var originalName = link.substring(lastSlash + 1);

    var newScaledName = newWidth + "px-" + originalName;

    var newScaledLink = "http://" + link + "/" + newScaledName;
    return newScaledLink;
}

function getSerializableObjectArray(array) {
    var toReturn = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] == null) {
            toReturn.push(null);
        } else {
            toReturn.push(array[i].getSerializableObject());
        }
    }
    return toReturn;
}

function isChrome() {
    var window = window;
    var isChromium = window.chrome, vendorName = window.navigator.vendor;
    if (isChromium !== null && vendorName === "Google Inc.") {
        return true;
    } else {
        return false;
    }
}
var BattleModel = (function () {
    function BattleModel(data, option, tierListString) {
        if (typeof option === "undefined") { option = {}; }
        this.isBloodClash = false;
        this.procOrderType = 1 /* ANDROID */;
        this.isFinished = false;
        this.playerWon = null;
        this.p1_mainCards = [];
        this.p2_mainCards = [];
        this.p1_reserveCards = [];
        this.p2_reserveCards = [];
        this.p1_originalMainCards = [];
        this.p2_originalMainCards = [];
        this.p1_originalReserveCards = [];
        this.p2_originalReserveCards = [];
        this.allCurrentMainCards = [];
        this.allCardsById = {};
        this.onDeathCards = [];
        this.turnOrderBase = 0 /* AGI */;
        this.turnOrderChangeEffectiveTurns = 0;
        this.turnOrderChanged = false;
        if (BattleModel._instance) {
            throw new Error("Error: Instantiation failed: Use getInstance() instead of new.");
        }
        BattleModel._instance = this;
        this.logger = BattleLogger.getInstance();
        this.cardManager = CardManager.getInstance();
        var graphic = new BattleGraphic();

        this.procOrderType = option.procOrder;
        if (option.battleType && option.battleType == 1 /* BLOOD_CLASH */) {
            this.isBloodClash = true;
        }

        var p1_formation;
        var p2_formation;
        var p1_cardIds = [];
        var p2_cardIds = [];
        var p1_warlordSkillIds = [];
        var p2_warlordSkillIds = [];

        var availableSkills = Skill.getAvailableSkillsForSelect();

        if (!tierListString) {
            tierListString = sessionStorage["tierList"];
        }

        if (option.p1RandomMode) {
            this.p1RandomMode = option.p1RandomMode;
            p1_formation = pickRandomProperty(Formation.FORMATION_CONFIG);
            p1_cardIds = BrigGenerator.getBrig(option.p1RandomMode, tierListString, this.isBloodClash);

            for (var i = 0; i < 3; i++) {
                p1_warlordSkillIds.push(+getRandomElement(availableSkills));
            }
        } else {
            p1_formation = data.p1_formation;
            p1_cardIds = data.p1_cardIds;
            p1_warlordSkillIds = data.p1_warlordSkillIds;
        }

        if (option.p2RandomMode) {
            this.p2RandomMode = option.p2RandomMode;
            p2_formation = pickRandomProperty(Formation.FORMATION_CONFIG);
            p2_cardIds = BrigGenerator.getBrig(option.p2RandomMode, tierListString, this.isBloodClash);

            for (i = 0; i < 3; i++) {
                p2_warlordSkillIds.push(+getRandomElement(availableSkills));
            }
        } else {
            p2_formation = data.p2_formation;
            p2_cardIds = data.p2_cardIds;
            p2_warlordSkillIds = data.p2_warlordSkillIds;
        }

        this.player1 = new Player(1, "Player 1", new Formation(p1_formation), 1);
        this.player2 = new Player(2, "Player 2", new Formation(p2_formation), 1);

        for (i = 0; i < 10; i++) {
            if (i >= 5 && !this.isBloodClash)
                break;
            var p1_cardInfo = famDatabase[p1_cardIds[i]];
            var p2_cardInfo = famDatabase[p2_cardIds[i]];

            var p1fSkillIdArray = p1_cardInfo.skills;
            if (p1_cardInfo.isWarlord) {
                p1fSkillIdArray = p1_warlordSkillIds;
            }

            var p2fSkillIdArray = p2_cardInfo.skills;
            if (p2_cardInfo.isWarlord) {
                p2fSkillIdArray = p2_warlordSkillIds;
            }

            var player1Skills = this.makeSkillArray(p1fSkillIdArray);
            var player2Skills = this.makeSkillArray(p2fSkillIdArray);

            var card1 = new Card(p1_cardIds[i], this.player1, i, player1Skills);
            var card2 = new Card(p2_cardIds[i], this.player2, i, player2Skills);

            if (i < 5) {
                this.p1_mainCards[i] = card1;
                this.p2_mainCards[i] = card2;

                this.p1_originalMainCards[i] = card1;
                this.p2_originalMainCards[i] = card2;

                this.allCurrentMainCards.push(card1);
                this.allCurrentMainCards.push(card2);
            } else if (i >= 5 && this.isBloodClash) {
                this.p1_reserveCards[i % 5] = card1;
                this.p2_reserveCards[i % 5] = card2;

                this.p1_originalReserveCards[i % 5] = card1;
                this.p2_originalReserveCards[i % 5] = card2;
            }

            this.allCardsById[card1.id] = card1;
            this.allCardsById[card2.id] = card2;
        }

        this.cardManager.sortAllCurrentMainCards();

        graphic.displayFormationAndFamOnCanvas();

        if (!BattleLogger.IS_DEBUG_MODE) {
            this.logger.displayInfoText();
            this.logger.displayWarningText();
        }
    }
    BattleModel.getInstance = function () {
        if (BattleModel._instance === null) {
            throw new Error("Error: you should not make this object this way");
        }
        return BattleModel._instance;
    };

    BattleModel.resetAll = function () {
        BattleModel.removeInstance();
        BattleLogger.removeInstance();
        BattleGraphic.removeInstance();
        CardManager.removeInstance();
    };

    BattleModel.removeInstance = function () {
        BattleModel._instance = null;
    };

    BattleModel.prototype.makeSkillArray = function (skills) {
        var skillArray = [];

        for (var i = 0; i < 3; i++) {
            if (skills[i]) {
                skillArray.push(new Skill(skills[i]));
            }
        }

        return skillArray;
    };

    BattleModel.prototype.getPlayerById = function (id) {
        if (id === 1) {
            return this.player1;
        } else if (id === 2) {
            return this.player2;
        } else {
            throw new Error("Invalid player");
        }
    };

    BattleModel.prototype.getOppositePlayer = function (player) {
        if (player === this.player1) {
            return this.player2;
        } else if (player === this.player2) {
            return this.player1;
        } else {
            throw new Error("Invalid player");
        }
    };

    BattleModel.prototype.processDamagePhase = function (data) {
        var target = data.target;
        var damage = this.getWouldBeDamage(data);

        var isMissed = data.attacker.willMiss();
        if (isMissed) {
            damage = 0;
            data.attacker.justMissed = true;
        } else {
            data.attacker.justMissed = false;
        }

        var evaded = target.justEvaded;
        if (evaded) {
            damage = 0;
        }

        if (!isMissed && !evaded && data.skill.skillFunc == 7 /* KILL */) {
            if (Math.random() <= data.skill.skillFuncArg2) {
                var isKilled = true;
            }
        }
        if (isKilled) {
            damage = target.getHP() + target.status.hpShield;
        }

        var hpShield = ~~target.status.hpShield;
        if (hpShield > 0 && !isMissed && !evaded && !isKilled) {
            if (damage >= hpShield) {
                target.status.hpShield = 0;
                damage -= hpShield;
            } else {
                target.status.hpShield = hpShield - damage;
                damage = 0;
            }
        }

        var surviveSkill = target.getSurviveSkill();
        var defenseData = {
            executor: target,
            skill: surviveSkill,
            attacker: data.attacker,
            wouldBeDamage: damage
        };

        if (surviveSkill && surviveSkill.willBeExecuted(defenseData) && !isKilled && !isMissed && !evaded) {
            surviveSkill.execute(defenseData);
            damage = target.getHP() - 1;
        }

        target.changeHP(-1 * damage);
        target.lastBattleDamageTaken = damage;
        data.attacker.lastBattleDamageDealt = damage;

        if (!data.additionalDescription) {
            data.additionalDescription = "";
        }

        if (data.skill.skillFunc == 28 /* PROTECT_REFLECT */) {
            if (target.hasWardOfType(data.oriAtkSkill.ward)) {
                var wardUsed = data.oriAtkSkill.ward;
            }
        } else if (target.hasWardOfType(data.skill.ward)) {
            wardUsed = data.skill.ward;
        }

        if (isMissed) {
            var desc = data.attacker.name + " missed the attack on " + target.name;
        } else if (evaded) {
            desc = target.name + " evaded the attack!";
        } else if (isKilled) {
            desc = target.name + " is killed outright!";
        } else {
            desc = data.additionalDescription + target.name + " lost " + damage + "hp (remaining " + target.getHP() + "/" + target.originalStats.hp + ")";
        }

        this.logger.addMinorEvent({
            executorId: data.attacker.id,
            targetId: target.id,
            type: 1 /* HP */,
            amount: (-1) * damage,
            description: desc,
            skillId: data.skill.id,
            wardUsed: wardUsed,
            missed: isMissed,
            evaded: evaded,
            isKilled: isKilled
        });

        if (target.isDead) {
            this.logger.displayMinorEvent(target.name + " is dead");
            this.addOnDeathCard(target);
        }
    };

    BattleModel.prototype.getWouldBeDamage = function (data) {
        var attacker = data.attacker;
        var target = data.target;
        var skill = data.skill;
        var skillMod = skill.skillFuncArg1;

        if (skill.skillFunc != 28 /* PROTECT_REFLECT */) {
            var ignorePosition = Skill.isPositionIndependentAttackSkill(skill.id);
        } else {
            ignorePosition = Skill.isPositionIndependentAttackSkill(data.oriAtkSkill.id);
        }

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
            case 7 /* REFLECT */:
                baseDamage = getReflectAmount(data.oriAttacker, data.oriAtkSkill, data.attacker, target, ignorePosition, data.oriDmg);
                break;
            default:
                throw new Error("Invalid calcType!");
        }

        var damage = skillMod * baseDamage;

        if (data.scaledRatio)
            damage *= data.scaledRatio;

        if (data.dmgRatio)
            damage *= data.dmgRatio;

        if (skill.skillFunc == 28 /* PROTECT_REFLECT */) {
            skill = data.oriAtkSkill;
        }
        switch (skill.ward) {
            case 1 /* PHYSICAL */:
                damage = Math.round(damage * (1 - target.status.attackResistance));
                break;
            case 2 /* MAGICAL */:
                damage = Math.round(damage * (1 - target.status.magicResistance));
                break;
            case 3 /* BREATH */:
                damage = Math.round(damage * (1 - target.status.breathResistance));
                break;
            default:
                throw new Error("Wrong type of ward. Maybe you forgot to include in the skill?");
        }

        return damage;
    };

    BattleModel.prototype.damageToTargetDirectly = function (target, damage, reason) {
        target.changeHP(-1 * damage);

        var descVerb = " lost ";
        if (damage < 0) {
            descVerb = " gained ";
        }

        var description = target.name + descVerb + Math.abs(damage) + " HP because of " + reason;

        this.logger.addMinorEvent({
            targetId: target.id,
            type: 1 /* HP */,
            amount: (-1) * damage,
            description: description
        });

        if (target.isDead) {
            this.logger.displayMinorEvent(target.name + " is dead");
            this.addOnDeathCard(target);
        }
    };

    BattleModel.prototype.processAffliction = function (executor, target, skill, fixedProb) {
        var type = skill.skillFuncArg2;
        var prob = fixedProb ? fixedProb : skill.skillFuncArg3;

        if (!type) {
            return;
        }

        var option = {};

        if (skill.skillFuncArg4) {
            if (type == 1 /* POISON */) {
                option.percent = skill.skillFuncArg4;
            } else if (type == 5 /* SILENT */ || type == 7 /* BLIND */) {
                option.turnNum = skill.skillFuncArg4;
            } else if (type == 8 /* BURN */) {
                option.damage = skill.skillFuncArg4;
            }
        }

        if (skill.skillFuncArg5) {
            option.missProb = skill.skillFuncArg5;
        }

        if (Math.random() <= prob) {
            target.setAffliction(type, option);

            if (type == 1 /* POISON */) {
                var percent = target.getPoisonPercent();
            }

            this.logger.addMinorEvent({
                executorId: executor.id,
                targetId: target.id,
                type: 3 /* AFFLICTION */,
                affliction: {
                    type: type,
                    duration: option.turnNum,
                    percent: percent,
                    missProb: option.missProb
                },
                description: target.name + " is now " + ENUM.AfflictionType[type]
            });
        }
    };

    BattleModel.prototype.processDebuff = function (executor, target, skill) {
        var status, multi;
        var isNewLogic = false;

        if (skill.skillFunc === 21 /* DEBUFFATTACK */ || skill.skillFunc === 22 /* DEBUFFINDIRECT */) {
            status = skill.skillFuncArg2;
            multi = skill.skillFuncArg4;
        } else if (skill.skillFunc === 2 /* DEBUFF */) {
            status = skill.skillFuncArg2;
            multi = skill.skillFuncArg1;
        } else if (skill.skillFunc === 32 /* CASTER_BASED_DEBUFF */) {
            status = skill.skillFuncArg2;
            multi = skill.skillFuncArg1;
            isNewLogic = true;
        } else if (skill.skillFunc === 33 /* CASTER_BASED_DEBUFF_ATTACK */ || skill.skillFunc === 34 /* CASTER_BASED_DEBUFF_MAGIC */) {
            status = skill.skillFuncArg2;
            multi = skill.skillFuncArg4;
            isNewLogic = true;
        } else if (skill.skillFunc === 38 /* ONHIT_DEBUFF */) {
            status = skill.skillFuncArg2;
            multi = skill.skillFuncArg1;
            isNewLogic = true;

            if (skill.skillFuncArg4) {
                multi = skill.skillFuncArg4;
                var isFlat = true;
            }
        } else {
            throw new Error("Wrong skill to use with processDebuff()");
        }

        if (isFlat) {
            var baseAmount = -100;
        } else if (!isNewLogic) {
            baseAmount = getDebuffAmount(executor, target);
        } else {
            baseAmount = getCasterBasedDebuffAmount(executor);
        }

        var amount = Math.floor(baseAmount * multi);

        target.changeStatus(status, amount, isNewLogic);
        var description = target.name + "'s " + ENUM.StatusType[status] + " decreased by " + Math.abs(amount);

        this.logger.addMinorEvent({
            executorId: executor.id,
            targetId: target.id,
            type: 2 /* STATUS */,
            status: {
                type: status,
                isNewLogic: isNewLogic
            },
            description: description,
            amount: amount,
            skillId: skill.id
        });
    };

    BattleModel.prototype.startBattle = function () {
        this.logger.startBattleLog();

        this.performOpeningSkills();

        while (!this.isFinished) {
            this.logger.currentTurn++;
            this.logger.bblogTurn("Turn " + this.logger.currentTurn);

            if (this.turnOrderChangeEffectiveTurns == 0) {
                this.turnOrderBase = 0 /* AGI */;
            } else {
                this.turnOrderChangeEffectiveTurns--;
            }

            this.cardManager.updateAllCurrentMainCards();
            this.cardManager.sortAllCurrentMainCards();

            for (var i = 0; i < 10 && !this.isFinished; i++) {
                var currentCard = this.allCurrentMainCards[i];

                this.currentPlayer = currentCard.player;
                this.currentPlayerMainCards = this.cardManager.getPlayerCurrentMainCards(this.currentPlayer);
                this.currentPlayerReserveCards = this.cardManager.getPlayerCurrentReserveCards(this.currentPlayer);

                this.oppositePlayer = this.getOppositePlayer(this.currentPlayer);
                this.oppositePlayerMainCards = this.cardManager.getPlayerCurrentMainCards(this.oppositePlayer);
                this.oppositePlayerReserveCards = this.cardManager.getPlayerCurrentReserveCards(this.oppositePlayer);

                if (currentCard.isDead) {
                    var column = currentCard.formationColumn;
                    if (this.isBloodClash && this.currentPlayerReserveCards[column]) {
                        var reserveCard = this.currentPlayerReserveCards[column];

                        this.cardManager.switchCardInAllCurrentMainCards(currentCard, reserveCard);
                        this.currentPlayerMainCards[column] = reserveCard;
                        this.currentPlayerReserveCards[column] = null;

                        this.logger.addMajorEvent({
                            description: currentCard.name + " is switched by " + reserveCard.name
                        });

                        this.logger.addMinorEvent({
                            description: currentCard.name + " is switched by " + reserveCard.name,
                            type: 8 /* RESERVE_SWITCH */,
                            reserveSwitch: {
                                mainId: currentCard.id,
                                reserveId: reserveCard.id
                            }
                        });

                        currentCard = reserveCard;

                        var openingSkill = currentCard.getRandomOpeningSkill();
                        if (openingSkill) {
                            var data = {
                                executor: currentCard,
                                skill: openingSkill
                            };
                            if (openingSkill.willBeExecuted(data)) {
                                this.logger.addMajorEvent({
                                    description: currentCard.name + " procs " + openingSkill.name,
                                    executorId: currentCard.id,
                                    skillId: openingSkill.id
                                });
                                openingSkill.execute(data);
                            }
                        }
                    } else {
                        continue;
                    }
                }

                var missTurn = !currentCard.canAttack();
                if (missTurn) {
                    this.logger.addMajorEvent({
                        description: currentCard.name + " missed a turn"
                    });
                }

                this.processActivePhase(currentCard, "FIRST");
                if (this.isFinished)
                    break;

                if (!currentCard.isDead && currentCard.status.willAttackAgain != 0) {
                    this.processActivePhase(currentCard, "FIRST");

                    currentCard.status.willAttackAgain = 0;
                    if (this.isFinished)
                        break;
                }

                if (!currentCard.isDead) {
                    if (currentCard.getAfflictionType() != 8 /* BURN */) {
                        var cured = currentCard.updateAffliction();
                    }

                    if (!currentCard.affliction && cured) {
                        var desc = currentCard.name + " is cured of affliction!";

                        this.logger.addMinorEvent({
                            targetId: currentCard.id,
                            type: 3 /* AFFLICTION */,
                            affliction: {
                                type: currentCard.getAfflictionType(),
                                isFinished: true
                            },
                            description: desc
                        });
                    }

                    this.processOnDeathPhase();
                }

                this.checkFinish();
            }

            if (!this.isFinished) {
                this.processEndTurn();
            }
        }
        return this.playerWon.name;
    };

    BattleModel.prototype.addOnDeathCard = function (card) {
        if (card.hasOnDeathSkill()) {
            this.onDeathCards.push(card);
        }
    };

    BattleModel.prototype.checkFinish = function () {
        var noOnDeathRemain = this.onDeathCards.length === 0;
        if (this.cardManager.isAllDeadPlayer(this.oppositePlayer) && noOnDeathRemain) {
            this.playerWon = this.currentPlayer;
        } else if (this.cardManager.isAllDeadPlayer(this.currentPlayer) && noOnDeathRemain) {
            this.playerWon = this.oppositePlayer;
        }

        if (this.playerWon) {
            this.logger.addMajorEvent({
                description: this.playerWon.name + " has won"
            });

            this.logger.addMinorEvent({
                type: 6 /* TEXT */,
                description: "Battle ended"
            });
            this.isFinished = true;
        }
    };

    BattleModel.prototype.processActivePhase = function (currentCard, nth) {
        if (currentCard.getAfflictionType() == 8 /* BURN */) {
            this.logger.addMajorEvent({
                description: currentCard.name + "'s turn"
            });
            currentCard.updateAffliction();
            this.checkFinish();
            if (currentCard.isDead || this.isFinished) {
                return;
            }
        }

        var activeSkill = currentCard.getRandomActiveSkill();

        if (nth === "FIRST" && currentCard.isMounted) {
            activeSkill = currentCard.getFirstActiveSkill();
        } else if (nth === "SECOND" && currentCard.isMounted) {
            activeSkill = currentCard.getSecondActiveSkill();
        }

        if (activeSkill) {
            var data = {
                executor: currentCard,
                skill: activeSkill
            };
            if (activeSkill.willBeExecuted(data)) {
                this.logger.addMajorEvent({
                    description: currentCard.name + " procs " + activeSkill.name,
                    executorId: currentCard.id,
                    skillId: activeSkill.id
                });

                activeSkill.execute(data);
            } else {
                this.executeNormalAttack(currentCard);
            }
        } else {
            this.executeNormalAttack(currentCard);
        }

        this.processOnDeathPhase();

        this.checkFinish();
        if (this.isFinished) {
            return;
        } else if (nth === "FIRST" && currentCard.isMounted && !currentCard.isDead) {
            this.processActivePhase(currentCard, "SECOND");
        }
    };

    BattleModel.prototype.processOnDeathPhase = function () {
        var hasOnDeath = [];
        for (var i = 0; i < this.onDeathCards.length; i++) {
            hasOnDeath.push(this.onDeathCards[i]);
        }

        this.onDeathCards = [];

        for (i = 0; i < hasOnDeath.length; i++) {
            var card = hasOnDeath[i];
            var skill = card.getInherentOnDeathSkill();
            var data = {
                executor: card,
                skill: skill
            };
            if (skill && skill.willBeExecuted(data)) {
                this.logger.addMinorEvent({
                    executorId: card.id,
                    type: 5 /* DESCRIPTION */,
                    description: card.name + " procs " + skill.name + ". ",
                    skillId: skill.id
                });
                skill.execute(data);
            }

            skill = card.getBuffOnDeathSkill();
            data = {
                executor: card,
                skill: skill
            };

            card.clearBuffOnDeathSkill();
            if (skill && skill.willBeExecuted(data)) {
                this.logger.addMinorEvent({
                    executorId: card.id,
                    type: 5 /* DESCRIPTION */,
                    description: card.name + " procs " + skill.name + ". ",
                    skillId: skill.id
                });
                skill.execute(data);
            }
        }

        if (this.onDeathCards.length !== 0) {
            this.processOnDeathPhase();
        }
    };

    BattleModel.prototype.processEndTurn = function () {
        this.logger.addMajorEvent({
            description: "Turn end"
        });

        this.logger.addMinorEvent({
            type: 6 /* TEXT */,
            description: "Turn end"
        });

        if (this.logger.currentTurn >= BattleModel.MAX_TURN_NUM) {
            var p1Cards = this.cardManager.getPlayerAllCurrentCards(this.player1);
            var p2Cards = this.cardManager.getPlayerAllCurrentCards(this.player2);

            var p1Ratio = this.cardManager.getTotalHPRatio(p1Cards);
            var p2Ratio = this.cardManager.getTotalHPRatio(p2Cards);

            if (p1Ratio >= p2Ratio) {
                this.playerWon = this.player1;
                var battleDesc = "Decision win";
            } else {
                this.playerWon = this.player2;
                battleDesc = "Decision loss";
            }
            this.isFinished = true;

            this.logger.addMajorEvent({
                description: "Decision win for " + this.playerWon.name
            });

            this.logger.addMinorEvent({
                type: 51 /* BATTLE_DESCRIPTION */,
                description: "Decision win",
                battleDesc: battleDesc
            });
        } else if (this.isBloodClash) {
            var allCards = this.cardManager.getAllCurrentCards();
            for (var i = 0; i < allCards.length; i++) {
                var tmpCard = allCards[i];
                if (tmpCard && !tmpCard.isDead) {
                    tmpCard.bcAddedProb += 10;

                    this.logger.addMinorEvent({
                        type: 9 /* BC_ADDPROB */,
                        description: tmpCard.name + " gets 10% increase in skill prob.",
                        bcAddProb: {
                            targetId: tmpCard.id,
                            isMain: this.cardManager.isCurrentMainCard(tmpCard)
                        }
                    });
                }
            }
        }
    };

    BattleModel.prototype.executeNormalAttack = function (attacker) {
        if (!attacker.canAttack() || attacker.isDead) {
            return;
        }

        this.logger.addMajorEvent({
            description: attacker.name + " attacks!",
            skillId: attacker.autoAttack.id,
            executorId: attacker.id
        });

        attacker.autoAttack.execute({
            executor: attacker,
            skill: attacker.autoAttack
        });
    };

    BattleModel.prototype.processProtect = function (attacker, targetCard, attackSkill, targetsAttacked, scaledRatio) {
        var enemyCards = this.cardManager.getEnemyCurrentMainCards(attacker.player);
        var protectSkillActivated = false;
        var toReturn = {};
        for (var i = 0; i < enemyCards.length && !protectSkillActivated; i++) {
            if (enemyCards[i].isDead) {
                continue;
            }
            var protectSkill = enemyCards[i].getRandomProtectSkill();
            if (protectSkill) {
                var protector = enemyCards[i];

                if (targetsAttacked && targetsAttacked[protector.id]) {
                    continue;
                }

                var protectData = {
                    executor: protector,
                    skill: protectSkill,
                    attacker: attacker,
                    attackSkill: attackSkill,
                    targetCard: targetCard,
                    targetsAttacked: targetsAttacked,
                    scaledRatio: scaledRatio
                };

                if (protectSkill.willBeExecuted(protectData)) {
                    protectSkillActivated = true;
                    toReturn = protectSkill.execute(protectData);
                }
            } else {
                continue;
            }
        }
        toReturn.activated = protectSkillActivated;
        return toReturn;
    };

    BattleModel.prototype.performOpeningSkills = function () {
        var p1cards = this.cardManager.getPlayerCurrentMainCardsByProcOrder(this.player1);
        var p2cards = this.cardManager.getPlayerCurrentMainCardsByProcOrder(this.player2);

        for (var i = 0; i < p1cards.length; i++) {
            var skill1 = p1cards[i].getRandomOpeningSkill();
            if (skill1) {
                var data = {
                    executor: p1cards[i],
                    skill: skill1
                };
                if (skill1.willBeExecuted(data)) {
                    this.logger.addMajorEvent({
                        description: p1cards[i].name + " procs " + skill1.name,
                        executorId: p1cards[i].id,
                        skillId: skill1.id
                    });
                    skill1.execute(data);
                }
            }
        }

        for (i = 0; i < p2cards.length; i++) {
            var skill2 = p2cards[i].getRandomOpeningSkill();
            if (skill2) {
                data = {
                    executor: p2cards[i],
                    skill: skill2
                };
                if (skill2.willBeExecuted(data)) {
                    this.logger.addMajorEvent({
                        description: p2cards[i].name + " procs " + skill2.name,
                        executorId: p2cards[i].id,
                        skillId: skill2.id
                    });
                    skill2.execute(data);
                }
            }
        }

        this.turnOrderChanged = false;
    };
    BattleModel.IS_MASS_SIMULATION = false;
    BattleModel.MAX_TURN_NUM = 5;

    BattleModel._instance = null;
    return BattleModel;
})();



var CsRandom = (function () {
    function CsRandom(seed) {
        this.seedArray = [];
        var ii;
        var mj, mk;

        var subtraction = (seed == -2147483648) ? 2147483647 : Math.abs(seed);
        mj = CsRandom.MSEED - subtraction;
        this.seedArray[55] = mj;
        mk = 1;
        for (var i = 1; i < 55; i++) {
            ii = (21 * i) % 55;
            this.seedArray[ii] = mk;
            mk = mj - mk;
            if (mk < 0)
                mk += CsRandom.MBIG;
            mj = this.seedArray[ii];
        }
        for (var k = 1; k < 5; k++) {
            for (i = 1; i < 56; i++) {
                this.seedArray[i] -= this.seedArray[1 + (i + 30) % 55];
                if (this.seedArray[i] < 0)
                    this.seedArray[i] += CsRandom.MBIG;
            }
        }
        this.inext = 0;
        this.inextp = 21;
        seed = 1;
    }
    CsRandom.prototype.sample = function () {
        return (this.internalSample() * (1.0 / CsRandom.MBIG));
    };

    CsRandom.prototype.internalSample = function () {
        var retVal;
        var locINext = this.inext;
        var locINextp = this.inextp;

        if (++locINext >= 56)
            locINext = 1;
        if (++locINextp >= 56)
            locINextp = 1;

        retVal = this.seedArray[locINext] - this.seedArray[locINextp];

        if (retVal == CsRandom.MBIG)
            retVal--;
        if (retVal < 0)
            retVal += CsRandom.MBIG;

        this.seedArray[locINext] = retVal;

        this.inext = locINext;
        this.inextp = locINextp;

        return retVal;
    };

    CsRandom.prototype.next = function () {
        return this.internalSample();
    };

    CsRandom.prototype.getSampleForLargeRange = function () {
        var result = this.internalSample();

        var negative = (this.internalSample() % 2 == 0) ? true : false;
        if (negative) {
            result = -result;
        }
        var d = result;
        d += (2147483647 - 1);
        d /= 2 * 2147483647 - 1;
        return d;
    };

    CsRandom.prototype.nextInRange = function (minValue, maxValue) {
        if (minValue > maxValue) {
            throw new Error("max less than min");
        }

        var range = maxValue - minValue;
        if (range <= 2147483647) {
            return (Math.floor(this.sample() * range) + minValue);
        } else {
            return Math.floor(Math.floor(this.getSampleForLargeRange() * range) + minValue);
        }
    };

    CsRandom.prototype.nextLessThan = function (maxValue) {
        if (maxValue < 0) {
            throw new Error("Max value less than 0");
        }
        return Math.floor(this.sample() * maxValue);
    };

    CsRandom.prototype.nextDouble = function () {
        return this.sample();
    };
    CsRandom.MBIG = 2147483647;
    CsRandom.MSEED = 161803398;
    CsRandom.MZ = 0;
    return CsRandom;
})();
