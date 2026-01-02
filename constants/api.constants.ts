import { objToQueryString } from "@/lib/utils";

export const apiConstants = {

    response: {
        add: () => `response`,
    },
    analytics: {

    }

};

const getUrlWithParams = (baseUrl: string, params: Record<string, string | number>): string => {
    const paramStr = objToQueryString(params);
    return `${baseUrl}?${paramStr}`;
}