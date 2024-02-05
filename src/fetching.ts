import { capitalize, computeEvolutions, computeWeaknesses, fetchJson } from "./utils"

// incomplete, use just for reference
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

export default async function extractPkmnData(data) {
  const artworkUrl = data.sprites.other['official-artwork'].front_default

  const types = await Promise.all(
    data.types.map(async (t) => await fetchJson(t.type.url))
  )

  const abilities = await Promise.all(
    data.abilities.map(async (a) => await fetchJson(a.ability.url))
  )

  const species = await fetchJson(data.species.url)
  const classification = species.genera
    .filter(g => g.language.name === 'en')[0]
    // this just trims out the unicode 'pokemon' word after the genus
    .genus.split(' ')[0]

  const genderRateFemale = species.gender_rate * 100 / 8
  const genderRateMale = 100 - genderRateFemale

  const evolutions = await fetchJson(species.evolution_chain.url)

  const pkmn = {
    name: capitalize(data.name),
    id: data.id,
    artworkUrl,
    sprites: data.sprites.versions,
    classification, 
    height: data.height,
    weight: data.weight,
    catchRate: species.capture_rate,
    genderRateMale,
    genderRateFemale,
    expGrowthRate: species.growth_rate.name,
    baseExp: data.base_experience,
    baseHappiness: species.base_happiness,
    stats: data.stats.map(s => {
      return {name: capitalize(s.stat.name), value: s.base_stat}
    }),
    names: species.names.map(n => {
      return {name: capitalize(n.name), language: n.language.name}
    }),
    genera: species.genera.map(g => {
      return {name: capitalize(g.genus), language: g.language.name}
    }),
    flavorTexts: species.flavor_text_entries
      .filter(t => t.language.name === 'en')
      .map(t => {
        return {text: t.flavor_text, version: t.version.name}
      }),
    types: types.map(type => capitalize(type.name)).join(', '),
    weaknesses: computeWeaknesses(types),
    evolutions: computeEvolutions(evolutions),
    abilities: abilities.map(a => { 
      return {
        name: capitalize(a.name), 
        effect: a?.effect_entries?.filter(e => e.language.name === 'en')[0]?.short_effect,
        description: a?.effect_entries?.filter(e => e.language.name === 'en')[0]?.effect
      }
    }),
  }

  return pkmn
}