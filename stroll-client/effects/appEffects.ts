import { useEffect } from "react";
import { useHistory } from "react-router";

import { UrlUtility } from "../utilities/urlUtility";

import { ElementID } from "../enums/elementId";

export const useClearParamsEffect = (param: string): void => {
  const history: any = useHistory();

  useEffect(() => {
    const value: string = UrlUtility.getQueryParam(param);

    if(value !== null) {
      history.push(window.location.pathname);
    }
  }, []);
}

export const useScrollToTopEffect = (location: any): void => {  
  useEffect(() => window.scrollTo(0, 0), [location.pathname]);
}

export const useDisableScrollEffect = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
};

export const useOnClickAwayEffect = (
  focused: boolean,
  elementIds: string[],
  changeProps: any[],
  handleOnClickAway: () => void
) => {
  useEffect(() => {
    if (focused) {
      const focusedElements: HTMLElement[] = [];

      elementIds.forEach((id: string) => {
        const el: HTMLElement | null = document.getElementById(id);

        if (el) {
          focusedElements.push(el);
        }
      });

      const handleClick = (e: any): void => {
        let count: number = 0;
        
        focusedElements.forEach((el: HTMLElement) => {
          if (el.contains(e.target)) {
            count++;
          }
        });

        if (count === 0) {
          handleOnClickAway();
        }
      };

      document.addEventListener("mousedown", handleClick);

      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }
  }, changeProps);
};

export const useUpdatePageOGUrlEffect = (location: any): void => {  
  useEffect(() => {            
    document.querySelector("meta[property=\"og:url\"]").setAttribute("content", window.location.href);
  }, [location.pathname]);
}

export const useUpdatePageTitleEffect = (title: string): void => {
  useEffect(() => {
    if(document.title !== title) {
      document.title = title;
      document.querySelector("meta[property=\"og:title\"]").setAttribute("content", title);
      document.querySelector("meta[name=\"twitter:title\"]").setAttribute("content", title);
    }
  }, [title]);
}

export const useGlobalCommandsEffect = (): void => {
  useEffect(() => {
    const handleOnKeyDown = (e: any): void => {
      if(document.activeElement.id !== ElementID.SearchBarInput && e.key === "/") {
        const el: HTMLElement | null = document.getElementById(ElementID.SearchBarInput);

        if (el) {
          e.preventDefault();

          el.focus();
        }
      }
    }

    document.addEventListener("keydown", handleOnKeyDown);

    return () => {
      document.removeEventListener("keydown", handleOnKeyDown);
    }
  }, []);
}