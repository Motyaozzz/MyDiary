import Notifications from "expo-notifications";

export async function getRandomAvatar(styleName = "pixel-art") {
const api = `https://api.dicebear.com/9.x/${styleName}/svg`;
return await getAvatar(api);
}

export async function getAvatar(api) {
const response = await fetch(api);

if (response.status !== 200) {
   throw new Error("Non-200 status code returned");
}

return response.body;
}

async function requestNotificationPermissions() {
return await Notifications.requestPermissionsAsync();
}

export async function getNotificationPermissions() {
let permissions = await Notifications.getPermissionsAsync();
if (permissions.status !== "granted") {
   permissions = await requestNotificationPermissions();
}
return permissions.status === "granted";
}
