interface IDomUtility {
  scrollToBottom: (id: string) => void;
}

export const DomUtility: IDomUtility = {
  scrollToBottom: (id: string): void => {
    const element: HTMLElement = document.getElementById(id);

    element.scrollTop = element.scrollHeight;
  }
}