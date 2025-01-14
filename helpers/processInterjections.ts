export const processInterjections = (interjections: any) => {
  // const interjections = ['Good Job!', 'Hurray!', 'Yay!', 'Nice work!', 'Awesome!', 'Bravo!', 'Cheers, mate!', 'Excellent!', 'Fabulous!', 'Fantastic!', 'Yippee!', 'Woo-hoo!', 'Swell!', 'Marvelous!'];

  return interjections[Math.floor(Math.random() * interjections.length)];
};
