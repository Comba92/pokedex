export async function fetchJson(url: string) {
  const req = await fetch(url)
  return await req.json()
}

export function capitalize(str: string): string {
  if (str.includes('-')) return str.split('-').map(s => capitalize(s)).join(' ')
  else return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getIdFromUrl(url: string): number {
  return Number(url.slice(0, -1).split('/').slice(-1))
}

export function computeWeaknesses(types: any) {
  let weaknesses = {}
  
  function computeWeaknessClass(types: any, amount: number) {
    for (const t of types) {
      if (weaknesses[t.name]) weaknesses[t.name] *= amount
      else weaknesses[t.name] = amount
    }
  }
  
  for (const t of types) {
    const tData = t.damage_relations
    
    computeWeaknessClass(tData.no_damage_from, 0)
    computeWeaknessClass(tData.half_damage_from, 1/2)
    computeWeaknessClass(tData.double_damage_from, 2)
  }

  return Object.entries(weaknesses)
    .map(([key, val]) => { return {type: capitalize(key), value: val}})
    .filter(w => w.value !== 1)
}

export function computeEvolutions(evolutions: any) {
  function recursion(chain) {
    if (!chain) return null

    let echain = {species: chain.species, details: chain.evolution_details, next: null}
    echain.next = chain.evolves_to.map(c => recursion(c))

    return echain
  }

  return recursion(evolutions.chain)
}

export const iconBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/'
export const artworkBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'
export const apiBaseUrl = 'https://pokeapi.co/api/v2/'