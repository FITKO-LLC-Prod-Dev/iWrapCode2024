interface GameObject {
  start?: () => void;
  update: (delta: number) => void;
  setUID?: (uid: number) => void;
}

export { GameObject };
