import readingTime from 'reading-time'

export function ReadingTime({ content }: { content: string }) {
  const stats = readingTime(content)
  const minutes = Math.ceil(stats.minutes)

  const readingText =
    minutes < 1
      ? 'менее минуты чтения'
      : `${minutes} мин. чтения`

  return (readingText)
}
