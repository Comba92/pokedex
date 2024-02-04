export async function fetchJson(url: string) {
  const req = await fetch(url)
  return await req.json()
}

export function capitalize(str: string) {
  if (str.includes('-')) return str.split('-').map(s => capitalize(s)).join(' ')
  else return str.charAt(0).toUpperCase() + str.slice(1)
}

export const iconBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/'
export const apiBaseUrl = 'https://pokeapi.co/api/v2/'
