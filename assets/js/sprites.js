/* Shared Poke Legends artwork loader — used by every tournament. */
window.PLSprites = (() => {
  const BASE = '/pl-usage-stats/assets/';
  const SHOWDOWN = 'https://play.pokemonshowdown.com/sprites/';
  const POKEAPI = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/';
  const POKESPRITE = 'https://raw.githubusercontent.com/msikma/pokesprite/master/';

  const pokemonNames = {
    'Sandshrew (Alola)': 'sandshrew-alola',
    'Growlithe (Hisui)': 'growlithe-hisui',
    'Arcanine (Hisui)': 'arcanine-hisui',
    'Zorua (Hisui)': 'zorua-hisui',
    'Typhlosion (Hisui)': 'typhlosion-hisui',
    'Marowak (Alola)': 'marowak-alola',
    'Tauros (Paldea Blaze)': 'tauros-paldea-blaze',
    'Tauros (Paldea)': 'tauros-paldea-blaze',
    'Rotom-Heat': 'rotom-heat',
    'Charizard Mega X': 'charizard-mega-x',
    'Charizard Mega Y': 'charizard-mega-y',
    'Houndoom Mega': 'houndoom-mega',
    'Camerupt Mega': 'camerupt-mega',
    'Chandelure Mega': 'chandelure-mega',
    'Delphox Mega': 'delphox-mega'
  };
  const itemNames = {
    'Black Glasses': 'blackglasses',
    'Thick Club': 'thick-club',
    'Bone': 'thick-club'
  };
  const specialPokemon = {
    'Growlithe (Hisui)': [
      `${BASE}sprites/dex/growlithe-hisui.png`,
      `${BASE}sprites/dex/growlithehisui.png`,
      `${SHOWDOWN}dex/growlithe-hisui.png`,
      `${SHOWDOWN}dex/growlithehisui.png`,
      `${SHOWDOWN}gen9/growlithe-hisui.png`,
      `${SHOWDOWN}gen8/growlithe-hisui.png`,
      `${BASE}sprites/overrides/pokemon/growlithe-hisui.png`
    ],
    'Arcanine (Hisui)': [
      `${BASE}sprites/overrides/pokemon/arcanine-hisui.png`,
      `${BASE}sprites/dex/arcanine-hisui.png`,
      `${BASE}sprites/home/arcanine-hisui.png`,
      `${SHOWDOWN}dex/arcanine-hisui.png`,
      `${SHOWDOWN}home/arcanine-hisui.png`,
      `${SHOWDOWN}gen9/arcanine-hisui.png`,
      `${SHOWDOWN}gen8/arcanine-hisui.png`
    ],
    'Impidimp': [
      `${BASE}sprites/dex/impidimp.png`,
      `${SHOWDOWN}dex/impidimp.png`,
      `${SHOWDOWN}gen8/impidimp.png`,
      `${POKEAPI}pokemon/other/official-artwork/859.png`
    ],
    'Zorua (Hisui)': [
      `${BASE}sprites/overrides/pokemon/zorua-hisui.png`,
      `${BASE}sprites/home/zorua-hisui.png`,
      `${SHOWDOWN}home/zorua-hisui.png`
    ]
  };
  const normalize = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const compact = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const distinct = arr => [...new Set(arr.filter(Boolean))];

  function pokemonAliases(name) {
    const mapped = pokemonNames[name];
    return distinct([mapped, normalize(name), compact(name)]);
  }

  function urls(name, isItem) {
    if (!isItem) {
      const aliases = pokemonAliases(name);
      const result = [];
      for (const a of aliases) {
        result.push(`${BASE}sprites/overrides/pokemon/${a}.png`);
        result.push(`${BASE}sprites/dex/${a}.png`);
        result.push(`${BASE}sprites/home/${a}.png`);
      }
      result.push(...(specialPokemon[name] || []));
      for (const a of aliases) {
        result.push(`${SHOWDOWN}dex/${a}.png`);
        result.push(`${SHOWDOWN}home/${a}.png`);
        result.push(`${SHOWDOWN}gen9/${a}.png`);
        result.push(`${SHOWDOWN}gen8/${a}.png`);
      }
      return distinct(result);
    }
    const n = itemNames[name] || normalize(name);
    const result = [
      `${BASE}sprites/overrides/items/${n}.png`,
      `${BASE}sprites/itemicons/${n}.png`,
      `${SHOWDOWN}itemicons/${n}.png`,
      `${POKEAPI}items/${n}.png`
    ];
    // Z-Crystals have distinct held/bag icon filenames in PokéAPI.
    // This also handles Groundium, Darkinium, Flyinium, Incinium and Rockium Z.
    if (/ium-z$/.test(n)) {
      result.push(`${BASE}sprites/overrides/items/${n}--held.png`);
      result.push(`${BASE}sprites/overrides/items/${n}--bag.png`);
      result.push(`${POKEAPI}items/${n}--held.png`);
      result.push(`${POKEAPI}items/${n}--bag.png`);
      result.push(`${POKESPRITE}items/z-crystals/${n}--held.png`);
      result.push(`${POKESPRITE}items/z-crystals/${n}--bag.png`);
    }
    return distinct(result);
  }
  function placeholder(isItem) {
    const bg = isItem ? '#29233e' : '#2b4059';
    const ink = isItem ? '#eacb75' : '#c2d7ea';
    return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="${bg}"/><text x="32" y="43" text-anchor="middle" font-size="30" fill="${ink}">?</text></svg>`);
  }
  function image(name, isItem = false) {
    const im = document.createElement('img');
    im.loading = 'lazy';
    im.alt = name;
    const candidates = urls(name, isItem);
    let index = 0;
    im.onerror = () => {
      index += 1;
      if (index < candidates.length) im.src = candidates[index];
      else { im.onerror = null; im.src = placeholder(isItem); }
    };
    im.src = candidates[0];
    return im;
  }
  return { image, urls };
})();
