interface GameObject {
    start: () => void;
    update: (delta: number) => void;
}

export { GameObject };
