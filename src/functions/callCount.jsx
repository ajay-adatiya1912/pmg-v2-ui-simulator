export const getCallCount = () => {
  const storedCount = localStorage.getItem("callCount");

  if (storedCount !== null) {
    return parseInt(storedCount, 10);
  } else {
    const defaultCount = 1;
    localStorage.setItem("callCount", defaultCount);
    return defaultCount;
  }
};

export const incrementCallCount = () => {
  const currentCount = getCallCount();
  const newCount = currentCount + 1;
  localStorage.setItem("callCount", newCount);
  return newCount;
};
