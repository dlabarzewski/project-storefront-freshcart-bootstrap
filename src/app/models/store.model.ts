import { StoreTagModel } from "./store-tag.model";

export interface StoreModel {
  readonly id: string;
  readonly name: string;
  readonly logoUrl: string;
  readonly distanceInMeters: number;
  readonly tagIds: string[];
  readonly tags?: StoreTagModel[];
}
