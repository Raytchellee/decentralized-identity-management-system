'use client';
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
import { useCallback, useState } from 'react';

export const useDebounce = () => {
  const [timerId, setTimerId] = useState<NodeJS.Timeout>();

  const debounce: any = useCallback(
    (func: Function, delay = 1000) => {
      return function (this: ThisParameterType<Function>) {
        const self: any = this;
        const args = arguments;
        clearTimeout(timerId);

        const newId = setTimeout(() => {
          func.apply(self, args);
        }, delay);

        setTimerId(newId);
      };
    },
    [timerId],
  );

  return {
    debounce,
  };
};
