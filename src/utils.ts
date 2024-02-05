export async function fetchJson(url: string) {
  const req = await fetch(url)
  return await req.json()
}

export function capitalize(str: string): string {
  if (str.includes('-')) return str.split('-').map(s => capitalize(s)).join(' ')
  else return str.charAt(0).toUpperCase() + str.slice(1)
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
    .map(([key, val]) => { return {type: key, value: val}})
    .filter(w => w.value !== 1)
}

export const iconBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/'
export const artworkBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'
export const apiBaseUrl = 'https://pokeapi.co/api/v2/'

export interface PokemonData {
  name: string,
  id: number,
  artworkUrl: string,
  sprites: any
  classification: string,
  height: number,
  weight: number,
  catchRate: number,
  genderhRateMale: number,
  genderRateFemale: number,
  expGrowthRate: number,
  baseHappiness: number,
  baseExp: number,
  stats: Array<{name: string, value: number}>,
  names: Array<{name: string, language: string}>,
  genera: Array<{name: string, language: string}>,
  flavorTexts: Array<{text: string, version: string}>
  types: any,
  abilities: any,
  evolutions: any
}