import { Story } from "./story.model";

export interface Sprint{
id: number;
    startDate:Date,
    endDate:Date,
    projectId:number,
    stories?: Story[];
}