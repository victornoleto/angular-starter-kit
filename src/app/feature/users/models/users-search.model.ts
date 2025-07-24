import { Search } from "../../../shared/models/search";
import { UsersFilters } from "./users-filters.model";

export interface UsersSearch extends Search {
    filters?: UsersFilters;
}