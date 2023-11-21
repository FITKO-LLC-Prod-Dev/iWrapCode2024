interface GameObject {
  start?: () => void;
  update: (delta: number) => void;
  setUID: (uid: number) => void;
  getUID: () => number | undefined;
}

export { GameObject };
