const allCogsHP = [6, 12, 20, 30, 42, 56, 72, 90, 110, 132, 156, 200];

class Cog {
    constructor(lvl) {
        this.lvl = lvl;    
    }

    get HP() {
        return allCogsHP[this.lvl-1]
    }

    toString() {
        return `Cog(lvl: ${this.lvl}, HP: ${this.HP})`;
    }
}


const gagNames = {
    'sound':    ['Bike Horn', 'Whistle', 'Bugle', 'Aoogah',
                 'Elephant Trunk', 'Foghorn', 'Opera Singer'],
    'throw':    ['Cupcake', 'Fruit Pie Slice', 'Cream Pie Slice', 'Whole Fruit Pie',
                 'Whole Cream Pie', 'Birthday Cake', 'Wedding Cake'],
    'squirt':   ['Squirting Flower', 'Glass of Water', 'Squirt Gun',
                 'Seltzer Bottle', 'Fire Hose', 'Storm Cloud', 'Geyser'],
    'drop':     ['Flower Pot', 'Sandbag', 'Anvil', 'Big Weight',
                 'Safe', 'Grand Piano', 'Toontanic'],
}

const gagDmgs = {
    'sound':    [4, 7, 11, 16, 21, 50, 90],
    'throw':    [6, 10, 17, 27, 40, 100, 120],
    'squirt':   [4, 8, 12, 21, 30, 80, 105],
    'drop':     [10, 18, 30, 45, 60, 170, 180],
}

class Gag {
    constructor(track, lvl) {
        this.track = track;
        this.lvl = lvl;
    }

    get name() {
        if (this.lvl === 0) {
            return 'None';
        }
        return gagNames[this.track][this.lvl-1];
    }

    get baseDmg() {
        if (this.lvl === 0) {
            return 0;
        }
        return gagDmgs[this.track][this.lvl-1];
    }

    multiplier(combo) {
        if (this.lvl === 0) {
            return 1;
        }
        let tc = combo.trackCounts();
        let multi = 1 + (tc[this.track] >= 2 ? 0.2 : 0) + (
            (combo.lured && (this.track === 'throw' ||
                             this.track === 'squirt')
            ) ? 0.5 : 0)
        return multi;
    }

    toString() {
        return `(${this.name}, lvl: ${this.lvl}, dmg: ${this.baseDmg})`;
    }
}


class Combo {
    constructor(gags, lured, track, stun='') {
        this.gags = gags;
        this.num = gags.length;
        this.lured = lured;
        this.track = track;
        this.stun = stun;
    }

    trackCounts() {
        let tc = {};
        this.gags.forEach((gag) => {
            if (gag.lvl !== 0) {
                gag.track in tc ? tc[gag.track] += 1 : tc[gag.track] = 1;
            }
        });
        return tc;
    }

    damage() {
        let dmg = 0;
        this.gags.forEach((gag) => {
            dmg += gag.baseDmg * gag.multiplier(this);
        });
        return Math.ceil(dmg);
    }

    toString() {
        return `Combo[${this.gags}\nDamage: ${this.damage()}]`;
    }
}


const findCombo = function(cogLvl, track, num, lured, stun) {
    let cog = new Cog(cogLvl);
    let combo;
    // Populate the inital combo with level 1 gags
    if (track === 'drop') {
        combo = new Combo([new Gag(stun, 1)], lured, track, stun);
        for (let i = 0; i < num-1; i++) {
            combo.gags.push(new Gag(track, 1));
        }
    } else {
        combo = new Combo([], lured, track);
        for (let i = 0; i < num; i++) {
            combo.gags.push(new Gag(track, 1));
        }
    }
    // Increase the level of each gag until the damage is sufficient
    while (combo.damage() < cog.HP) {
        combo.gags = combo.gags.map((gag) => {
            if (gag.track == stun && gag.lvl > 4) {
                gag.lvl = 5;
            } else {
                gag.lvl += 1;
            }
            return gag;
        });
    }
    // Decrease the level of individual gags until the damage is insufficient
    let i = 0;
    while (i != combo.gags.length-1) {
        for (i = combo.gags.length-1; i >= 0; i--) {
            if (combo.gags[i].lvl === 0) {
                break;
            }
            combo.gags[i].lvl -= 1;
            if (combo.damage() < cog.HP) {
                combo.gags[i].lvl += 1;
                break
            }
        }
    }
    // In a drop combo, attempt to lower gag level of stun gag
    if (track === 'drop' && combo.gags[0].lvl == 5) {
        if (combo.gags[1].lvl === 7) {
            combo.gags[0].lvl += 1;
            combo.gags[1].lvl -= 1;
            if (combo.damage() < cog.HP) {
                combo.gags[0].lvl -= 1;
                combo.gags[1].lvl += 1;
            }
        } else {
            while (combo.damage() >= cog.HP && combo.gags[0].lvl > 0) {
                combo.gags[0].lvl -= 1;
            }
            combo.gags[0].lvl += 1;
        }
    }
    return combo;
}


let cogLvl = 12;  // 1 - 12
let track = 'drop';  // 'sound', 'throw', 'squirt', 'drop'
let num = 4;  // 4, 3, 2
let lured = false;  // true, false
let stun = 'squirt';

let combo = findCombo(cogLvl, track, num, lured, stun);
console.log(String(combo));
