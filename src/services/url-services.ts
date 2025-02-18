import {PathMatch} from "react-router-dom";

export const extractIdFromPath = (match: PathMatch<"id"> | null) => {
    return match?.params?.id != null ? parseInt(match?.params?.id) : null;
};