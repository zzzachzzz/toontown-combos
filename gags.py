from math import ceil, floor
from collections import defaultdict
from pprint import pprint


class Cog:
    hp = (6, 12, 20, 30, 42, 56, 72, 90, 110, 132, 156, 200)

    def __init__(self, lvl):
        self.lvl = lvl

    def __repr__(self):
        return 'Cog(Lvl {} | {} Hp)'.format(self.lvl, self.max_hp())

    def max_hp(self):
        return self.hp[self.lvl-1]

    def to_JSON(self):
        return {
            'lvl': self.lvl,
            'hp': self.max_hp(),
        }


class Gag:
    gag_names = {
        'sound':    ('Bike Horn', 'Whistle', 'Bugle', 'Aoogah',
                     'Elephant Trunk', 'Foghorn', 'Opera Singer'),
        'throw':    ('Cupcake', 'Fruit Pie Slice', 'Cream Pie Slice', 'Whole Fruit Pie',
                     'Whole Cream Pie', 'Birthday Cake', 'Wedding Cake'),
        'squirt':   ('Squirting Flower', 'Glass of Water', 'Squirt Gun',
                     'Seltzer Bottle', 'Fire Hose', 'Storm Cloud', 'Geyser'),
        'drop':     ('Flower Pot', 'Sandbag', 'Anvil', 'Big Weight',
                     'Safe', 'Grand Piano', 'Toontanic'),
    }
    gag_dmgs = {
        'sound':    (4, 7, 11, 16, 21, 50, 90),
        'throw':    (6, 10, 17, 27, 40, 100, 120),
        'squirt':   (4, 8, 12, 21, 30, 80, 105),
        'drop':     (10, 18, 30, 45, 60, 170, 180),
    }

    def __init__(self, track, lvl, org=False):
        self.track = track
        self.lvl = lvl
        self.org = org

    def __repr__(self):
        if self.lvl == 0:
            return '({}, {}'.format('None', 0)
        return '({}{}, {})'.format('[org] ' if self.org else '', self.name(), self.base_dmg())

    def __eq__(self, other):
        return (self.lvl == other.lvl and self.org == other.org and
                self.track == other.track)

    def to_JSON(self):
        return {
            'name':  self.name(),
            'lvl':   self.lvl,
            'org':   self.org,
            'track': self.track,
        }

    def name(self):
        if self.lvl == 0:
            return 'None'
        return self.gag_names[self.track][self.lvl-1]

    def base_dmg(self):
        if self.lvl == 0:
            return 0
        # If gag dmg is less than 10, multiplying by 1.1 does not result in
        # the minimum 1 bonus dmg point. Ex: 9*1.1=9.9 floor(9.9) == 9
        if self.org and 0 < self.gag_dmgs[self.track][self.lvl-1] < 10:
            return self.gag_dmgs[self.track][self.lvl-1] + 1
        # Normal organic calculation, 10% dmg bonus
        return (floor(self.gag_dmgs[self.track][self.lvl-1] *
                      (1.1 if self.org else 1)))

    # When doing track count check for knockback multiplier, if both
    # 'throw' and 'squirt' are present, only grant the 0.5 knockback
    # multiplier to 'throw'. Currently not an issue.
    def multiplier(self, combo):
        if self.lvl == 0:
            return 1  # Could be 0 also... zero times zero equals...
        tc = combo.track_counts()
        multi = (1 + (0.2 if tc[self.track] >= 2 else 0) +
                 (0.5 if combo.lured and self.track in {'throw', 'squirt'} else 0))
        return multi


class Combo:
    def __init__(self, gags, num, lured, sel_track, sel_stun):
        self.gags = gags  # list of gags
        self.num = num  # number of gags
        self.lured = lured  # lured - True or False
        self.sel_track = sel_track
        self.sel_stun = sel_stun   # '' unless sel_track == 'drop'

    def __repr__(self):
        return 'Combo({})'.format(self.gags)

    # Returns a dict to be JSON serializable, containing combo info
    def to_JSON(self):
        json_ = {
            'num': self.num,
            'sel_track': self.sel_track,
            'sel_stun': self.sel_stun,
            'lured': self.lured,
            'damage': self.damage(),
            'gags': [gag.to_JSON() for gag in self.gags],
        }
        return json_

    def track_counts(self):
        tc = defaultdict(int)
        for gag in self.gags:
            if gag.lvl != 0:
                tc[gag.track] += 1
        return tc

    def damage(self):
        dmg = 0
        for gag in self.gags:
            dmg += round(gag.base_dmg() * gag.multiplier(self), 2)
        return ceil(dmg)


class GagCombos:
    def __init__(self, cog_lvl, sel_track, num, lured=False, sel_stun=''):
        self.cog = Cog(cog_lvl)
        self.sel_track = sel_track
        self.num = num
        self.lured = lured
        self.sel_stun = sel_stun if self.sel_track == 'drop' else ''
        # Avoids bug of sel_stun accidentally being set when track != 'drop'.

    def find(self):
        combo = self.test_down(self.test_up())
        return combo

    def to_JSON(self):
        json_ = self.find().to_JSON()  # find() returns a combo, which is then converted to JSON
        json_['cog_lvl'] = self.cog.lvl
        return json_

    def test_up(self):
        # Begin with lvl 1 gags
        if self.sel_track == 'drop':
            combo = Combo([Gag(self.sel_stun, 1)] +
                          [Gag(self.sel_track, 1) for i in range(self.num-1)],
                          self.num, self.lured, self.sel_track, self.sel_stun)
        else:
            combo = Combo([Gag(self.sel_track, 1) for i in range(self.num)],
                          self.num, self.lured, self.sel_track, self.sel_stun)
        while combo.damage() < self.cog.max_hp():
            for gag in combo.gags:
                if gag.track == self.sel_stun and gag.lvl > 4:
                    gag.lvl = 5
                else:
                    gag.lvl += 1
        return combo

    def test_down(self, combo):
        i = 0  # Arbitrary value
        # While the last gag in the list was not the one last modified
        while i != len(combo.gags) - 1:
            # Begins with index at end of gag list, decrements to reach start index 0
            for i in range(len(combo.gags) - 1, -1, -1):
                if combo.gags[i].lvl == 0:  # A lvl 0 gag is None
                    break
                combo.gags[i].lvl -= 1  # lower gag lvl
                if combo.damage() < self.cog.max_hp():  # test if new dmg is sufficient
                    combo.gags[i].lvl += 1  # revert gag lvl change
                    break
        # Attempt to lower gag lvl of stun gag in a drop combo
        if self.sel_track == 'drop' and combo.gags[0].lvl == 5:
            if combo.gags[1].lvl == 7:  # if lvl 7 gag is being used, try alternative
                combo.gags[0].lvl += 1  # set stun to lvl 6 gag from 5
                combo.gags[1].lvl -= 1  # set gag to lvl 6 from 7
                # If new combo dmg is insufficient, revert
                if combo.damage() < self.cog.max_hp():
                    combo.gags[0].lvl -= 1
                    combo.gags[1].lvl += 1
            else:
                # Lower lvl of stun gag while damage is sufficient or gag becomes None
                while combo.damage() >= self.cog.max_hp() and combo.gags[0].lvl > 0:
                    combo.gags[0].lvl -= 1
                combo.gags[0].lvl += 1
        return combo


if __name__ == '__main__':
    # Test as you wish
    combo = GagCombos(cog_lvl=11, sel_track='drop', num=3, lured=True, sel_stun='squirt').find()
    print(combo, "\n")  # Combo __repr__
    combo_json = combo.to_JSON()  # Combo as JSON
    print("Cog HP: {}".format(Cog(11).max_hp()))
    pprint(combo_json)