import { TableSort } from "../directives";
import { Paginator } from "./paginator";

export interface Search {
    sort?: TableSort;
    pagination?: Paginator;
}