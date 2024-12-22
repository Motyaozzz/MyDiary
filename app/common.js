/**
 * @param {string} styleName 
 * @returns {Promise<SVGElement>}
 */
export async function getRandomAvatar(styleName = 'pixel-art') {
    const api = `https://api.dicebear.com/9.x/${styleName}/svg`
    return await getAvatar(api)
}

/**
 * @param {string} api
 * @returns {Promise<SVGElement>}
 */
export async function getAvatar(api) {
    const response = await fetch(api)

    if (response.status !== 200) {
        throw new Error('Non-200 status code returned')
    }

    return response.body
}