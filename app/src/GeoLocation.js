/*
* @flow
*/
import type { GeoCoordinates } from "@src/l10n"

export const getCoordinates = async (apiKey?: string) : Promise<GeoCoordinates> => {
    // const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`);
    try {
        const headers = new Headers({
            Accept: "application/json",
            "User-Agent": "curl/7.72.0",
            // Authorization: apiKey ? `Bearer ${apiKey}` : "",
            // "Content-Type": "application/json",
        })
        const response = await fetch("https://ipinfo.io", { headers })
        const body = await response.json()
        const latlon = body.loc.split(",").map(parseInt)
        return {
            longitude: latlon[0],
            latitude: latlon[1]
        }
    } catch (err) {
        console.error("Cannot get coordinates from ipinfo: %s", err)
        return {
            longitude: 41.0177,
            latitude: 28.9744,
        }
    }
}
