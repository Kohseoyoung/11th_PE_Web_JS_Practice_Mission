const movieRequest = new Promise<string>((resolve) => {
  setTimeout(() => resolve("영화 요청이 끝났어요."), 300);
});

console.log("1. 요청을 시작했어요.");

movieRequest
  .then((message) => console.log(`2. ${message}`))
  .catch((error) => console.error(error))
  .finally(() => console.log("3. 요청 처리를 마쳤어요."));