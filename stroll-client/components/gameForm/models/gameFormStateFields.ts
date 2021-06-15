export interface IGameFormStateFields {
  name: string;
}

export const defaultGameFormStateFields = (): IGameFormStateFields => ({
  name: ""
});