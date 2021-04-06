import { IEntry } from 'app/shared/model/entry.model';

export interface ITag {
  id?: number;
  name?: string;
  entries?: IEntry[] | null;
}

export const defaultValue: Readonly<ITag> = {};
