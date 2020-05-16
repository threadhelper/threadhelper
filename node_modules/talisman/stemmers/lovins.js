'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lovins;
/* eslint no-multi-spaces: 0 */
/* eslint no-confusing-arrow: 0 */
/**
 * Talisman stemmers/lovins
 * =========================
 *
 * Julie Beth Lovins' stemmer.
 *
 * [Reference]:
 * http://snowball.tartarus.org/algorithms/lovins/stemmer.html
 *
 * [Article]:
 * Lovins JB (1968) Development of a stemming algorithm. Mechanical Translation
 * and Computational Linguistics, 11: 22-31.
 */

/**
 * Endings.
 */
var ENDINGS_LIST = [/alistically$/, 'B', /arizability$/, 'A', /izationally$/, 'B', /antialness$/, 'A', /arisations$/, 'A', /arizations$/, 'A', /entialness$/, 'A', /allically$/, 'C', /antaneous$/, 'A', /antiality$/, 'A', /arisation$/, 'A', /arization$/, 'A', /ationally$/, 'B', /ativeness$/, 'A', /eableness$/, 'E', /entations$/, 'A', /entiality$/, 'A', /entialize$/, 'A', /entiation$/, 'A', /ionalness$/, 'A', /istically$/, 'A', /itousness$/, 'A', /izability$/, 'A', /izational$/, 'A', /ableness$/, 'A', /arizable$/, 'A', /entation$/, 'A', /entially$/, 'A', /eousness$/, 'A', /ibleness$/, 'A', /icalness$/, 'A', /ionalism$/, 'A', /ionality$/, 'A', /ionalize$/, 'A', /iousness$/, 'A', /izations$/, 'A', /lessness$/, 'A', /ability$/, 'A', /aically$/, 'A', /alistic$/, 'B', /alities$/, 'A', /ariness$/, 'E', /aristic$/, 'A', /arizing$/, 'A', /ateness$/, 'A', /atingly$/, 'A', /ational$/, 'B', /atively$/, 'A', /ativism$/, 'A', /elihood$/, 'E', /encible$/, 'A', /entally$/, 'A', /entials$/, 'A', /entiate$/, 'A', /entness$/, 'A', /fulness$/, 'A', /ibility$/, 'A', /icalism$/, 'A', /icalist$/, 'A', /icality$/, 'A', /icalize$/, 'A', /ication$/, 'G', /icianry$/, 'A', /ination$/, 'A', /ingness$/, 'A', /ionally$/, 'A', /isation$/, 'A', /ishness$/, 'A', /istical$/, 'A', /iteness$/, 'A', /iveness$/, 'A', /ivistic$/, 'A', /ivities$/, 'A', /ization$/, 'F', /izement$/, 'A', /oidally$/, 'A', /ousness$/, 'A', /aceous$/, 'A', /acious$/, 'B', /action$/, 'G', /alness$/, 'A', /ancial$/, 'A', /ancies$/, 'A', /ancing$/, 'B', /ariser$/, 'A', /arized$/, 'A', /arizer$/, 'A', /atable$/, 'A', /ations$/, 'B', /atives$/, 'A', /eature$/, 'Z', /efully$/, 'A', /encies$/, 'A', /encing$/, 'A', /ential$/, 'A', /enting$/, 'C', /entist$/, 'A', /eously$/, 'A', /ialist$/, 'A', /iality$/, 'A', /ialize$/, 'A', /ically$/, 'A', /icance$/, 'A', /icians$/, 'A', /icists$/, 'A', /ifully$/, 'A', /ionals$/, 'A', /ionate$/, 'D', /ioning$/, 'A', /ionist$/, 'A', /iously$/, 'A', /istics$/, 'A', /izable$/, 'E', /lessly$/, 'A', /nesses$/, 'A', /oidism$/, 'A', /acies$/, 'A', /acity$/, 'A', /aging$/, 'B', /aical$/, 'A', /alist$/, 'A', /alism$/, 'B', /ality$/, 'A', /alize$/, 'A', /allic$/, 'BB', /anced$/, 'B', /ances$/, 'B', /antic$/, 'C', /arial$/, 'A', /aries$/, 'A', /arily$/, 'A', /arity$/, 'B', /arize$/, 'A', /aroid$/, 'A', /ately$/, 'A', /ating$/, 'I', /ation$/, 'B', /ative$/, 'A', /ators$/, 'A', /atory$/, 'A', /ature$/, 'E', /early$/, 'Y', /ehood$/, 'A', /eless$/, 'A', /elity$/, 'A', /ement$/, 'A', /enced$/, 'A', /ences$/, 'A', /eness$/, 'E', /ening$/, 'E', /ental$/, 'A', /ented$/, 'C', /ently$/, 'A', /fully$/, 'A', /ially$/, 'A', /icant$/, 'A', /ician$/, 'A', /icide$/, 'A', /icism$/, 'A', /icist$/, 'A', /icity$/, 'A', /idine$/, 'I', /iedly$/, 'A', /ihood$/, 'A', /inate$/, 'A', /iness$/, 'A', /ingly$/, 'B', /inism$/, 'J', /inity$/, 'CC', /ional$/, 'A', /ioned$/, 'A', /ished$/, 'A', /istic$/, 'A', /ities$/, 'A', /itous$/, 'A', /ively$/, 'A', /ivity$/, 'A', /izers$/, 'F', /izing$/, 'F', /oidal$/, 'A', /oides$/, 'A', /otide$/, 'A', /ously$/, 'A', /able$/, 'A', /ably$/, 'A', /ages$/, 'B', /ally$/, 'B', /ance$/, 'B', /ancy$/, 'B', /ants$/, 'B', /aric$/, 'A', /arly$/, 'K', /ated$/, 'I', /ates$/, 'A', /atic$/, 'B', /ator$/, 'A', /ealy$/, 'Y', /edly$/, 'E', /eful$/, 'A', /eity$/, 'A', /ence$/, 'A', /ency$/, 'A', /ened$/, 'E', /enly$/, 'E', /eous$/, 'A', /hood$/, 'A', /ials$/, 'A', /ians$/, 'A', /ible$/, 'A', /ibly$/, 'A', /ical$/, 'A', /ides$/, 'L', /iers$/, 'A', /iful$/, 'A', /ines$/, 'M', /ings$/, 'N', /ions$/, 'B', /ious$/, 'A', /isms$/, 'B', /ists$/, 'A', /itic$/, 'H', /ized$/, 'F', /izer$/, 'F', /less$/, 'A', /lily$/, 'A', /ness$/, 'A', /ogen$/, 'A', /ward$/, 'A', /wise$/, 'A', /ying$/, 'B', /yish$/, 'A', /acy$/, 'A', /age$/, 'B', /aic$/, 'A', /als$/, 'BB', /ant$/, 'B', /ars$/, 'O', /ary$/, 'F', /ata$/, 'A', /ate$/, 'A', /eal$/, 'Y', /ear$/, 'Y', /ely$/, 'E', /ene$/, 'E', /ent$/, 'C', /ery$/, 'E', /ese$/, 'A', /ful$/, 'A', /ial$/, 'A', /ian$/, 'A', /ics$/, 'A', /ide$/, 'L', /ied$/, 'A', /ier$/, 'A', /ies$/, 'P', /ily$/, 'A', /ine$/, 'M', /ing$/, 'N', /ion$/, 'Q', /ish$/, 'C', /ism$/, 'B', /ist$/, 'A', /ite$/, 'AA', /ity$/, 'A', /ium$/, 'A', /ive$/, 'A', /ize$/, 'F', /oid$/, 'A', /one$/, 'R', /ous$/, 'A', /ae$/, 'A', /al$/, 'BB', /ar$/, 'X', /as$/, 'B', /ed$/, 'E', /en$/, 'F', /es$/, 'E', /ia$/, 'A', /ic$/, 'A', /is$/, 'A', /ly$/, 'B', /on$/, 'S', /or$/, 'T', /um$/, 'U', /us$/, 'V', /yl$/, 'R', /s'/, 'A', /'s$/, 'A', /a$/, 'A', /e$/, 'A', /i$/, 'A', /o$/, 'A', /s$/, 'W', /y$/, 'B'];

var ENDINGS = [];

for (var i = 0, l = ENDINGS_LIST.length; i < l; i += 2) {
  ENDINGS.push([ENDINGS_LIST[i], ENDINGS_LIST[i + 1]]);
} /**
   * Conditions.
   */
var CONDITIONS = {
  A: function A() {
    return true;
  },
  B: function B(stem) {
    return stem.length > 2;
  },
  C: function C(stem) {
    return stem.length > 3;
  },
  D: function D(stem) {
    return stem.length > 4;
  },
  E: function E(stem) {
    return !/e$/.test(stem);
  },
  F: function F(stem) {
    return CONDITIONS.B(stem) && CONDITIONS.E(stem);
  },
  G: function G(stem) {
    return CONDITIONS.B(stem) && /f$/.test(stem);
  },
  H: function H(stem) {
    return (/(t|ll)$/.test(stem)
    );
  },
  I: function I(stem) {
    return !/[oe]$/.test(stem);
  },
  J: function J(stem) {
    return !/[ae]$/.test(stem);
  },
  K: function K(stem) {
    return CONDITIONS.B(stem) && /(l|i|(u\we))$/.test(stem);
  },
  L: function L(stem) {
    return !/(u|x|([^o]s))$/.test(stem);
  },
  M: function M(stem) {
    return !/[acem]$/.test(stem);
  },
  N: function N(stem) {
    return (/s\w{2}$/.test(stem) ? CONDITIONS.C(stem) : CONDITIONS.B(stem)
    );
  },
  O: function O(stem) {
    return (/[li]$/.test(stem)
    );
  },
  P: function P(stem) {
    return !/c$/.test(stem);
  },
  Q: function Q(stem) {
    return CONDITIONS.B(stem) && !/[ln]$/.test(stem);
  },
  R: function R(stem) {
    return (/[nr]$/.test(stem)
    );
  },
  S: function S(stem) {
    return (/(dr|[^t]t)$/.test(stem)
    );
  },
  T: function T(stem) {
    return (/(s|[^o]t)$/.test(stem)
    );
  },
  U: function U(stem) {
    return (/[lmnr]$/.test(stem)
    );
  },
  V: function V(stem) {
    return (/c$/.test(stem)
    );
  },
  W: function W(stem) {
    return !/[su]$/.test(stem);
  },
  X: function X(stem) {
    return (/(l|i|u\we)$/.test(stem)
    );
  },
  Y: function Y(stem) {
    return (/in$/.test(stem)
    );
  },
  Z: function Z(stem) {
    return !/f$/.test(stem);
  },
  AA: function AA(stem) {
    return (/([dflt]|ph|th|er|or|es)$/.test(stem)
    );
  },
  BB: function BB(stem) {
    return CONDITIONS.B(stem) && !/(met|ryst)/.test(stem);
  },
  CC: function CC(stem) {
    return (/l$/.test(stem)
    );
  }
};

/**
 * Endings.
 */
var TRANSFORMATIONS = [[/iev$/, 'ief'], [/uct$/, 'uc'], [/umpt$/, 'um'], [/rpt$/, 'rb'], [/urs$/, 'ur'], [/istr$/, 'ister'], [/metr$/, 'meter'], [/olv$/, 'olut'], [/([^aoi])ul$/, '$1l'], [/bex$/, 'bic'], [/dex$/, 'dic'], [/pex$/, 'pic'], [/tex$/, 'tic'], [/ax$/, 'ac'], [/ex$/, 'ec'], [/ix$/, 'ic'], [/lux$/, 'luc'], [/uad$/, 'uas'], [/vad$/, 'vas'], [/cid$/, 'cis'], [/lid$/, 'lis'], [/erid$/, 'eris'], [/pand$/, 'pans'], [/([^s])end$/, '$1ens'], [/ond$/, 'ons'], [/lud$/, 'lus'], [/rud$/, 'rus'], [/([^pt])her$/, '$1hes'], [/mit$/, 'mis'], [/([^m])ent$/, '$1ens'], [/ert$/, 'ers'], [/([^n])et$/, '$1es'], [/(yt|yz)$/, 'ys']];

/**
 * Function stemming the given world using the Lovins algorithm.
 *
 * @param  {string} word - The word to stem.
 * @return {string}      - The resulting stem.
 */
function lovins(word) {

  // Preparing the word
  word = word.toLowerCase().replace(/^a-z'/g, '');

  // Dropping the longest suffix we can find in the word
  var stem = word;
  for (var _i = 0, _l = ENDINGS.length; _i < _l; _i++) {
    var _ENDINGS$_i = ENDINGS[_i],
        match = _ENDINGS$_i[0],
        condition = _ENDINGS$_i[1];


    stem = word.replace(match, '');

    if (stem.length > 1 && stem.length < word.length && CONDITIONS[condition](stem)) break;
  }

  // Dropping double occurrences of some consonants ending the stem
  if (/[bdglmnprst]{2,}$/.test(stem) && stem[stem.length - 1] === stem[stem.length - 2]) {
    stem = stem.slice(0, -1);
  }

  // Applying transformations
  for (var _i2 = 0, _l2 = TRANSFORMATIONS.length; _i2 < _l2; _i2++) {
    var _TRANSFORMATIONS$_i = TRANSFORMATIONS[_i2],
        match = _TRANSFORMATIONS$_i[0],
        replacement = _TRANSFORMATIONS$_i[1];

    stem = stem.replace(match, replacement);
  }

  return stem;
}
module.exports = exports['default'];