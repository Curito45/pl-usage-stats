/* Shared Poke Legends artwork loader — used by every tournament. */
window.PLSprites = (() => {
  const BASE = '/pl-usage-stats/assets/';
  const SHOWDOWN = 'https://play.pokemonshowdown.com/sprites/';
  const POKEAPI = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/';
  const POKESPRITE = 'https://raw.githubusercontent.com/msikma/pokesprite/master/';

  const pokemonNames = {
    'Sandshrew (Alola)': 'sandshrew-alola',
    'Growlithe (Hisui)': 'growlithe-hisui'
  };
  const itemNames = {
    'Black Glasses':'blackglasses',
    'Thick Club':'thick-club',
    'Bone':'thick-club'
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
    'Impidimp': [
      `${BASE}sprites/dex/impidimp.png`,
      `${SHOWDOWN}dex/impidimp.png`,
      `${SHOWDOWN}gen8/impidimp.png`,
      `${POKEAPI}pokemon/other/official-artwork/859.png`
    ]
  };
  const normalize = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const compact = s => s.toLowerCase().replace(/[^a-z0-9]+/g,'');
  const distinct = arr => [...new Set(arr)];

  function urls(name, isItem) {
    if (!isItem) {
      const n = pokemonNames[name] || compact(name);
      const regional = pokemonNames[name] || n;
      return distinct([
        `${BASE}sprites/overrides/pokemon/${regional}.png`,
        `${BASE}sprites/dex/${regional}.png`,
        `${BASE}sprites/home/${regional}.png`,
        ...(specialPokemon[name] || []),
        `${SHOWDOWN}dex/${regional}.png`,
        `${SHOWDOWN}home/${regional}.png`
      ]);
    }
    const n = itemNames[name] || normalize(name);
    const result = [
      `${BASE}sprites/overrides/items/${n}.png`,
      `${BASE}sprites/itemicons/${n}.png`,
      `${SHOWDOWN}itemicons/${n}.png`,
      `${POKEAPI}items/${n}.png`
    ];
    // Separate fallback source for Gen 7 Z-crystals (held-item artwork).
    // Override images can be placed in assets/sprites/overrides/items/.
    if (/ium-z$/.test(n)) {
      result.push(`${POKESPRITE}resources/items/z-crystals/${n}--held.png`);
      result.push(`${POKESPRITE}resources/items/z-crystals/${n}--bag.png`);
    }
    return distinct(result);
  }
  function placeholder(isItem) {
    const bg = isItem?'#29233e':'#2b4059', ink = isItem?'#eacb75':'#c2d7ea';
    return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="${bg}"/><text x="32" y="43" text-anchor="middle" font-size="30" fill="${ink}">?</text></svg>`);
  }
  function image(name, isItem=false) {
    const im = document.createElement('img');
    im.loading = 'lazy'; im.alt = name;
    const candidates = urls(name,isItem);
    let index = 0;
    im.onerror = () => {
      index += 1;
      if (index<candidates.length) im.src=candidates[index];
      else { im.onerror=null; im.src=placeholder(isItem); }
    };
    im.src = candidates[0];
    return im;
  }
  return { image, urls };
})();
