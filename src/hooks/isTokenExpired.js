import jwtDecode from 'jwt-decode';

export function isTokenExpired(token) {
    if (!token) {
        return true; // No token found, consider it as expired
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Token is expired if current time is greater than expiration time
        return decodedToken.exp < currentTime;
    } catch (e) {
        console.error("Error decoding token: ", e);
        return true; // If there's an error decoding, consider it as expired
    }
}
