export type BookStateStringProps = 'READ' | 'READING' | 'READ_LATER' | 'UNFINISHED';

export interface BookStateProps {
  READ: 'READ';
  READING: 'READING';
  READ_LATER: 'READ_LATER';
  UNFINISHED: 'UNFINISHED';
}

export const BookState: BookStateProps = {
  READ: 'READ',
  READING: 'READING',
  READ_LATER: 'READ_LATER',
  UNFINISHED: 'UNFINISHED',
};
