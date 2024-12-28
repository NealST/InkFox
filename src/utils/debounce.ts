const debounce = function (fn: () => void, delay = 100) {
  let timer: ReturnType<typeof setTimeout>;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
};

export default debounce;
