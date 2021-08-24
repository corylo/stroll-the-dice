import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { UrlUtility } from "../utilities/urlUtility";

import { ElementID } from "../enums/elementId";
import { ImageStatus } from "../enums/imageStatus";

interface IUseCurrentDateEffect {
  date: Date;
}

export const useCurrentDateEffect = (): IUseCurrentDateEffect => {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      const update: Date = new Date();

      if(update.getSeconds() !== date.getSeconds()) {
        setDate(update);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [date]);

  return { date };
}

export const useClearParamsEffect = (param: string): void => {
  const history: any = useHistory();

  useEffect(() => {
    UrlUtility.clearParam(history, param);
  }, []);
}

export const useScrollToTopEffect = (location: any): void => {  
  useEffect(() => {
    if(location.hash === "") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);
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

interface IUseLoadImageEffect {
  status: ImageStatus;
}

export const useLoadImageEffect = (previewSource: string, loadedSource: string): IUseLoadImageEffect => {
  const [status, setStatus] = useState<ImageStatus>(ImageStatus.Waiting);

  useEffect(() => {
    const preview: HTMLImageElement = new Image();
    preview.src = previewSource;

    preview.onload = () => {
      setStatus(ImageStatus.Preview);
    };
  }, []);

  useEffect(() => {
    if(status === ImageStatus.Preview) {
      const loaded: HTMLImageElement = new Image();
      loaded.src = loadedSource;

      loaded.onload = () => {
        setStatus(ImageStatus.Loaded);
      };
    }
  }, [status])

  return {
    status
  }
}