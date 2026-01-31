// Handle messages from the main thread
self.onmessage = (event: MessageEvent) => {
  const { executableFunction } = event.data as {executableFunction: () => unknown};

  try {
    const result: unknown = executableFunction();
    self.postMessage({ type: 'success', result });
  } catch (error) {
    console.error(error);
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

export {};