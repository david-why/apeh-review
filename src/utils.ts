import { data } from '@/data'
import type { Status } from '@/store'
import { type CSSProperties } from 'vue'

export const statusStyle: Record<Status, CSSProperties> = {
  'not-started': {},
  skipped: { color: 'gray', textDecoration: 'line-through' },
  flagged: { color: 'red' },
  reviewed: { color: '#00bb00' }
}

export function count(str: string, substr: string): number {
  return str.split(substr).length - 1
}

export function sortConcepts(concepts: string[]): string[] {
  // split by "." and sort by each segment
  return concepts.sort((a, b) => {
    const aSegments = a.split('.')
    const bSegments = b.split('.')
    for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
      if (aSegments[i] !== bSegments[i]) {
        return aSegments[i].localeCompare(bSegments[i])
      }
    }
    return aSegments.length - bSegments.length
  })
}

export function findDiff<T>(larger: T[], smaller: T[]): T[] {
  return larger.filter((item) => !smaller.includes(item))
}

export function findChildren(id: string): string[] {
  return sortConcepts(
    Object.keys(data.value.concepts).filter(
      (key) => key.startsWith(id + '.') && count(key, '.') === count(id, '.') + 1
    )
  )
}

export function findTopics(unit: number): string[] {
  return Object.keys(data.value.topics)
    .filter((key) => key.startsWith(unit + '.'))
    .sort((a, b) => Number(a.split('.')[1]) - Number(b.split('.')[1]))
}

export function findUnits(): string[] {
  return Object.keys(data.value.units).sort()
}

export function findRootConcepts(): string[] {
  return sortConcepts(Object.keys(data.value.concepts).filter((key) => count(key, '.') === 1))
}
