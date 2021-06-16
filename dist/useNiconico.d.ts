import { MutableRefObject } from "react";
export declare type UseNiconicoOptions = {
    displayMillis?: number;
    fontSize?: number;
    lineWidth?: number;
};
export declare function useNiconico<T extends HTMLElement>(options?: UseNiconicoOptions): [MutableRefObject<null | T>, (text: string) => void];
