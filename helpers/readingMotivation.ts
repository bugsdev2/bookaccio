import { processDuration } from './processDuration';

export function readingMotivation(startDate: number, endDate: number, phrases: any, lessThan: string, one: string, moreThan: string) {
  const duration = processDuration(startDate, endDate, lessThan, one, moreThan);
  // const phrases = [
  //   `${processInterjections()} It’s been ${duration} since you started this journey. Keep up the great work!`,
  //   `${duration} have flown by since you began this book! You're making wonderful progress!`,
  //   `${processInterjections()} ${duration} in and you're doing amazing! Stay on track—you're doing great!`,
  //   `${duration} down, countless adventures to go! You're crushing it—keep reading!`,
  //   `Time flies! ${duration} have passed since you embarked on this story. Keep the pages turning!`,
  //   `It’s been ${duration} since you turned the first page. The plot thickens, and so does your progress!`,
  //   `${duration} in, and you're already deep into this adventure. Keep exploring, one page at a time!`,
  //   `${duration} gone by, oh how time does fly! Keep going, reader—reach for the sky!`,
  //   `Look at you go. ${duration} and counting! Progress like this deserves a standing ovation!`,
  //   `${duration} of reading, and you’re officially in a committed relationship with this book. Keep it steady!`,
  // ];

  return phrases[Math.floor(Math.random() * phrases.length)].replace('_', duration);
}
