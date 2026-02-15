export const normalizeDateRange = (from?: Date, to?: Date) => {
  let normalizedFrom: Date | undefined
  let normalizedTo: Date | undefined

  if (from) {
    normalizedFrom = new Date(from)
    normalizedFrom.setHours(0, 0, 0, 0)
  }

  if (to) {
    normalizedTo = new Date(to)
    normalizedTo.setHours(0, 0, 0, 0)
    normalizedTo.setDate(normalizedTo.getDate())
  }

  return { normalizedFrom, normalizedTo }
}
