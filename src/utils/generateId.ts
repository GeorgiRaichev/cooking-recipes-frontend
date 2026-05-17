export const generateId = (): string => {
  return crypto.randomUUID().slice(0, 24);
};
